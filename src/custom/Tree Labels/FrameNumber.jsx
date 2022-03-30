import React from 'react'

export default function FrameNumber({ data, path, key, videoRef, setPlaying }) {
    // data has type { frame_number: int }
    // assert(!!data && data.constructor == Array)

    const onClick = (e) => {
        e.stopPropagation();
        !!setPlaying && setPlaying(false);
        // videoRef?.current && videoRef.current.pause();
        videoRef?.current && videoRef.current.seekTo(data['frame_number'] / 30, "seconds");
    }

    return <span onClick={onClick} onKeyDown={(e) => e.key === 'Enter' && onClick(e)} role='button' tabIndex={-1} style={{ width: '100%', padding: '7px 0' }}>
        <b>{key}</b>: {data['frame_number']}
    </span >
}
