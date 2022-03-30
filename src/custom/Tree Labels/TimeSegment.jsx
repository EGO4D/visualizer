import React from 'react'

export default function TimeSegment({ data, path, key, videoRef, setPlaying }) {
    // data has type { start_time: float, end_time: float, label: str }
    // assert(!!data && data.constructor == Array)

    const onClick = (e) => {
        e.stopPropagation();
        videoRef?.current &&
            videoRef.current.seekTo(data['start_time'], "seconds");
        !!setPlaying && setPlaying(true);
    }

    return <span
        onClick={onClick}
        onKeyDown={(e) => e.key === 'Enter' && onClick(e)}
        role='button'
        tabIndex={-1}
        style={{ width: '100%', padding: '7px 0' }}>
        {data['label']}
    </span>
}
