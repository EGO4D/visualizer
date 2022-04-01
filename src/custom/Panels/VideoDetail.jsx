import React, { useCallback, useRef, useEffect, useState } from "react";
import ReactPlayer from "react-player"; /* dependency */
import JSONSpeedViewer from "../JSONSpeedViewer";
import CustomLabelRenderer from "../CustomLabelRenderer";
import { Tab, Tabs } from "@blueprintjs/core";
import ResponsiveCanvas from "../Utility/ResponsiveCanvas";
import { getHostname } from "../../utils";
import { useMephistoReview } from "../../shims/mephisto-review-hook";
import ErrorPane from "../../components/ErrorPane"

import "./VideoDetail.scss";
import TimeSegmentChart from "../../components/charts/TimeSegmentChart";

export default function VideoDetail({ id }) {
    const {
        data: item,
        isFinished,
        isLoading,
        error,
    } = useMephistoReview({ taskId: id, hostname: getHostname() });

    const [progress, setProgress] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [playing, setPlaying] = useState(false);
    const [bboxes, setBboxes] = useState([{ label: 'test-bbox', x: 250.5, y: 300.50, width: 100, height: 100 }]);
    const canvasRef = useRef();
    const videoRef = useRef();

    const data = item?.data;
    const file = data?._presigned_url;

    const [isError, setError] = useState(false);
    const [selectedTab, setSelectedTab] = useState(null);

    const dimensions = data?.quick_info?.metadata?.dimensions.slice(1, -1).split(",").map(x => x.trim()).map(parseFloat);

    useEffect(() => {
        setSelectedTab(Object.keys(data?.annotations ?? [''])[0]);
    }, [data])

    const step = useCallback(
        (ctx, now, metadata) => {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            ctx.lineWidth = 5;
            bboxes.forEach(bbox => {
                ctx.strokeRect(
                    bbox.x / dimensions[0] * canvasRef.current.width,
                    bbox.y / dimensions[1] * canvasRef.current.height,
                    bbox.width / dimensions[0] * canvasRef.current.width,
                    bbox.height / dimensions[1] * canvasRef.current.height,
                );
            });
            // ctx.strokeRect(20, 20, 150, 100);

            ctx.font = "30px Arial";

            ctx.fillText(
                "Frame: " +
                Math.round(metadata.mediaTime * 30),
                100,
                canvasRef.current.height / 2
            );
        },
        [canvasRef, bboxes, dimensions]
    );

    function useRVFC(videoRef, canvasRef, steps) {
        const callback = useCallback(
            (now, metadata) => {
                if (!canvasRef.current) return;
                const ctx = canvasRef.current.getContext("2d");

                steps.forEach((step) => step(ctx, now, metadata));

                const video = videoRef.current.getInternalPlayer()
                !!video && video.requestVideoFrameCallback(callback);
            },
            [canvasRef, videoRef, steps]
        );

        useEffect(() => {
            const video = !!videoRef.current && videoRef.current.getInternalPlayer();
            !!video && video.requestVideoFrameCallback(callback);
        }, [videoRef, callback]);
    }

    // useRVFC(videoRef, canvasRef, [step]);

    const segment_viewer = React.useMemo(() => {
        return data && <div className="segment-viewer">
            <h3>Info:</h3>
            <JSONSpeedViewer data={data.quick_info} customRenderer={CustomLabelRenderer} videoRef={videoRef} setPlaying={setPlaying} />

            <h3>Annotations:</h3>
            <Tabs selectedTabId={selectedTab} onChange={setSelectedTab} animate={true}>
                {
                    Object.keys(data.annotations).map((k) =>
                        <Tab id={k} title={k} key={k} panel={
                            <div style={{ display: 'flex', height: '100%' }}>
                                <JSONSpeedViewer data={data.annotations[k]} customRenderer={CustomLabelRenderer} videoRef={videoRef} setPlaying={setPlaying} expandThreshold={26} />
                            </div>
                        } />
                    )
                }
            </Tabs>
        </div>
    }, [selectedTab, data])

    const timelines = data?.annotations[selectedTab] && Object.keys(data.annotations[selectedTab]).map(
        (k) => {
            const v = data.annotations[selectedTab][k];
            const time_segs = v.constructor === Array && v.filter((vchild) => vchild._type === 'time_segment');
            return !!time_segs && time_segs.length > 0 && (
                <div key={`video-${k}`}>
                    <span>{k}</span>
                    <TimeSegmentChart
                        data={time_segs.map(({start_time, end_time, label}) => {return {start: start_time, end: end_time, label: label} })}
                        seeker_position={progress}
                        videoRef={videoRef}
                        setPlaying={setPlaying}
                        min={0}
                        max={duration}
                    />
                </div>
            )
        }
    )

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
                            className={"video-player"}
                            url={file}
                            controls
                            playing={playing}
                            ref={videoRef}
                            width={'100%'}
                            height={'auto'}
                            progressInterval={350}
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
                        />

                        <ResponsiveCanvas className={"video-canvas"} ref={canvasRef} reactPlayerRef={videoRef} scale={1.5} />
                    </div>

                    {/* Generate a timeline for every first child that's time segments */}
                    <div className="video-visualizers">
                        { timelines }
                    </div>
                    {/* {
                        !!data.annotations[selectedTab]?.action_segments &&
                           <TimeSegmentChart
                            data={data.annotations[selectedTab].action_segments.map(({start_time, end_time, label}) => {return {start: start_time, end: end_time, label: label} })}
                            seeker_position={progress}
                            videoRef={videoRef}
                            setPlaying={setPlaying}
                            min={0}
                            max={duration}
                            />
                    } */}
                </div>
                { segment_viewer }
            </div>
        </>
    );

    return isLoading ? (
        <div className="item-dynamic">
            <ErrorPane error={error} />
            <h1 className="item-view-message">Loading...</h1>
        </div>
    ) : isFinished ? (
        <div className="item-dynamic">
            <ErrorPane error={error} />
            <h1 className="item-view-message">
                Done reviewing! You can close this app now
            </h1>
        </div>
    ) : !!data ? (
        <>
            <ErrorPane error={error} />
            {renderedItem}
        </>
    ) : null;
}
