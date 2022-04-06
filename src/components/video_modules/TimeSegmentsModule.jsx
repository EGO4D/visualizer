import React from 'react';
import TimeSegmentChart from "../../components/charts/TimeSegmentChart";

export default function TimeSegmentsModule({ data, annotations, progress, videoRef, setPlaying, duration }) {
    return <TimeSegmentChart
        data={data}
        seeker_position={progress}
        videoRef={videoRef}
        setPlaying={setPlaying}
        min={0}
        max={duration}
    />;
}
