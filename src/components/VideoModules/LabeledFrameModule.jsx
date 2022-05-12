import React from 'react';
import "./LabeledFrameModule.scss"

// Shows frame labels near their frame time
export default function LabeledFrameModule({ data, annotations, progress, videoRef, setPlaying, duration }) {
    // data: [{ video_time: float, label: str }]
    return <div className="labeled-frame-module">{
        data.filter((seg) => (
            seg.video_time > progress && (seg.video_time - progress) <= 0.3
            || progress > seg.video_time && (progress - seg.video_time) <= 0.7)
        )
            .map((seg) => <div className='label'>{seg.label}</div>)
    }</div>
}
