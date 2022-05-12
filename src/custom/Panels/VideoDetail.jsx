import React, { useRef, useEffect, useState } from "react";
import ReactPlayer from "react-player"; /* dependency */
import JSONSpeedViewer, { keyCompare } from "../JSONSpeedViewer";
import CustomLabelRenderer from "../CustomLabelRenderer";
import VideoModules from "../../components/VideoModules";
import { ProgressBar, Tab, Tabs } from "@blueprintjs/core";
import ResponsiveCanvas from "../Utility/ResponsiveCanvas";
import { getHostname } from "../../utils";
import { useMephistoReview } from "../../shims/mephisto-review-hook";
import { useUploadedDataStore } from "../../stores/UploadedDataStore";
import ErrorPane from "../../components/ErrorPane";

import "./VideoDetail.scss";
import { Link } from "react-router-dom";
import useBBoxes from "../Utility/useBBoxes";
import VideoControls from "../../components/VideoControls";
import useStateWithUrlParam from "../../hooks/useStateWithUrlParam";

export default function VideoDetail({ id }) {
    const {
        data: item,
        isLoading,
        error,
    } = useMephistoReview({ taskId: id, hostname: getHostname() });

    const [progress, setProgress] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [playing, setPlaying] = useState(false);
    const [playerReady, setPlayerReady] = useState(false);
    const [buffering, setBuffering] = useState(false);
    const [startTime, _] = useStateWithUrlParam('t', undefined)
    const uploadedData = useUploadedDataStore(state => state.uploadedData);
    const canvasRef = useRef();
    const videoRef = useRef();

    const data = item?.data;
    const file = data?._presigned_url;

    const [isError, setError] = useState(false);
    const [selectedTab, setSelectedTab] = useState(null);

    const dimensions = data?.quick_info?.metadata?.dimensions.slice(1, -1).split(",").map(x => x.trim()).map(parseFloat);

    useEffect(() => {
        !selectedTab && setSelectedTab(Object.keys(data?.annotations ?? ['']).sort(keyCompare)[0]);
    }, [data])

    const annotation_trees = React.useMemo(() => {
        return data && <>
            <h3>Info:</h3>
            <JSONSpeedViewer data={data.quick_info} customRenderer={CustomLabelRenderer} videoRef={videoRef} setPlaying={setPlaying} videoOffset={data['_video_offset']} />

            <h3>Annotations:</h3>
            <Tabs selectedTabId={selectedTab} onChange={setSelectedTab} animate={true}>
                {
                    Object.keys(data.annotations).sort(keyCompare).map((k) =>
                        <Tab id={k} title={k} key={k} panel={
                            <div style={{ display: 'flex', height: '100%' }}>
                                <JSONSpeedViewer data={data.annotations[k]} customRenderer={CustomLabelRenderer} videoRef={videoRef} setPlaying={setPlaying} videoOffset={data['_video_offset']} expandThreshold={26} />
                            </div>
                        } />
                    )
                }
                {
                    Object.keys(uploadedData).filter(k => !!uploadedData[k][data._uid]).map(k =>
                        <Tab id={k} title={k} panel={
                            <div style={{ display: 'flex', height: '100%' }}>
                                <JSONSpeedViewer data={uploadedData[k][data._uid]} customRenderer={CustomLabelRenderer} videoRef={videoRef} setPlaying={setPlaying} videoOffset={data['_video_offset']} expandThreshold={26} />
                            </div>
                        } />
                    )
                }
            </Tabs>
        </>
    }, [selectedTab, data, uploadedData])

    // TODO: simplify this logic
    const annotations = data?.annotations[selectedTab] ?? (!!uploadedData[selectedTab] && uploadedData[selectedTab][data._uid]);

    useBBoxes({ annotations: annotations, videoRef, canvasRef, dimensions, selectedTab });

    // const videoModules = null;
    const videoModules = annotations && <VideoModules data={data} annotations={annotations} progress={progress} videoRef={videoRef} setPlaying={setPlaying} duration={duration || data._duration} />;

    const renderedItem = data && (
        <>
            <div className="app-container">
                <div className="video-viewer">
                    {/* {isError ? (
                        <Callout intent={Intent.WARNING} style={{ marginBottom: 10 }}>
                            Error streaming video from S3.
                        </Callout>
                    ) : null} */}
                    <div className="video-stage">
                        <ReactPlayer
                            className="video-player"
                            url={file}
                            controls
                            playing={playing}
                            ref={videoRef}
                            width={'100%'}
                            height={'auto'}
                            progressInterval={350}
                            onReady={() => {
                                // Just once, seek to passed-in start time
                                !playerReady && !!startTime && videoRef.current.seekTo(startTime, 'seconds');
                                setPlayerReady(true);
                            }}
                            onProgress={({ playedSeconds }) => {
                                setProgress(playedSeconds);
                            }}
                            onDuration={setDuration}
                            onError={(error) => {
                                console.log(error);
                                setError(true);
                            }}
                            onPlay={() => setPlaying(true)}
                            onPause={() => setPlaying(false)}
                            onBuffer={() => setBuffering(true)}
                            onBufferEnd={() => setBuffering(false)}
                        />

                        <ResponsiveCanvas className={"video-canvas"} ref={canvasRef} reactPlayerRef={videoRef} scale={2} playerReady={playerReady} />
                    </div>

                    <VideoControls videoRef={videoRef} progress={progress} id={id} />

                    {videoModules}
                </div>
                <div className="segment-viewer">
                    {/* {concurrent_videos} */}
                    {annotation_trees}
                </div>
            </div>
        </>
    );

    return isLoading ? (
        <div className="item-dynamic">
            <ErrorPane error={error} />
            <h1 className="item-view-message">Loading...</h1>
        </div>
    ) : !!data ? (
        <>
            <ErrorPane error={error} />
            {renderedItem}
        </>
    ) : null;
}
