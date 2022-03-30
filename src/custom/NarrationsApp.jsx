// Copyright (c) Meta Platforms, Inc. and affiliates. All Rights Reserved.

import React, { useCallback, useRef, useEffect, useState } from "react";
import ReactPlayer from "react-player"; /* dependency */
import JSONSpeedViewer from "./JSONSpeedViewer";
import CustomLabelRenderer from "./CustomLabelRenderer";
import { Callout, Intent } from "@blueprintjs/core";
import { Tab, Tabs } from "@blueprintjs/core";
import ResponsiveCanvas from "./Utility/ResponsiveCanvas";

import "./NarrationsApp.scss";

function App({ data }) {
  return <Viewer data={data} />;
}

function Viewer({ data }) {
  const file = data?._presigned_url;

  const [, setDuration] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [bboxes,] = useState([{ label: 'test-bbox', x: 250.5, y: 300.50, width: 100, height: 100 }]);
  const canvasRef = useRef();
  const videoRef = useRef();

  const [isError, setError] = useState(false);
  const [selectedTab, setSelectedTab] = useState(Object.keys(data.annotations)[0]);

  const activeAnnotations = [];

  // const activeAnnotations = segData
  //   .filter(
  //     (seg) =>
  //       progress >= seg.start_time - 0.5 && progress <= seg.end_time + 0.5
  //   )
  //   .map((seg) => (
  //     <Segment
  //       segment={seg}
  //       duration={duration}
  //       progress={progress}
  //       onClick={() => {
  //         videoRef?.current && videoRef.current.seekTo(seg.start_time, "seconds");
  //         setPlaying(true);
  //       }}
  //     />
  //   ));

  const dimensions = data?.quick_info?.metadata?.dimensions.slice(1, -1).split(",").map(x => x.trim()).map(parseFloat);

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
    [canvasRef, bboxes]
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

  return (
    <div>
      <div className="app-container">
        <div className="video-viewer">
          {isError ? (
            <Callout intent={Intent.WARNING} style={{ marginBottom: 10 }}>
              The video was not found. You may not have it downloaded. You can
              try downloading it with the Ego4D cli:
              <pre style={{ whiteSpace: "break-spaces" }}>
                python -m ego4d.cli.cli --yes --datasets full_scale
                --output_directory $OUTPUT_DIR --video_uids {data._uid}
              </pre>
            </Callout>
          ) : null}
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
              onError={(error) => {
                setError(true);
              }}
              onProgress={({ playedSeconds }) => {
                // setProgress(playedSeconds);
              }}
              onDuration={setDuration}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />

            <ResponsiveCanvas className={"video-canvas"} ref={canvasRef} reactPlayerRef={videoRef} scale={1.5} />
          </div>
          {/* <h3>{Math.floor(progress * 10) / 10}</h3>
            <h3>{duration}</h3> */}
          <h3>Active annotations:</h3>
          {activeAnnotations.length > 0 ? activeAnnotations : <span>None</span>}
        </div>
        <div className="segment-viewer">
          <h3>Info:</h3>
          <JSONSpeedViewer data={data.quick_info} customRenderer={CustomLabelRenderer} videoRef={videoRef} setPlaying={setPlaying} />

          <h3>Annotations:</h3>
          <Tabs selectedTabId={selectedTab} onChange={setSelectedTab} animate={true}>
            {
              Object.keys(data.annotations).map((k) =>
                <Tab id={k} title={k} key={k} panel={
                  <div style={{ display: 'flex', height: '100%' }}>
                    <JSONSpeedViewer data={data.annotations[k]} customRenderer={CustomLabelRenderer} videoRef={videoRef} setPlaying={setPlaying} />
                  </div>
                } />
              )
            }
          </Tabs>
        </div>
      </div>
    </div>
  );
}


export default App;
