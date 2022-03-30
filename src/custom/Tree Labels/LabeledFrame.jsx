import React from 'react'

export default function LabeledFrame({ data, path, key, videoRef, setPlaying }) {
    // data has type { video_frame: int, label: str, ?video_time: float }
    // assert(!!data && data.constructor == Array)

    const onClick = (e) => {
        e.stopPropagation();
        videoRef?.current &&
            videoRef.current.seekTo(data['video_time'] ?? data['video_frame']/30, "seconds");
        !!setPlaying && setPlaying(true);
    }

    return <span onClick={onClick} onKeyDown={(e) => e.key === 'Enter' && onClick(e)} role='button' tabIndex={-1} style={{width:'100%', padding: '7px 0'}}> {data['label']}</span >
}
