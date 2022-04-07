import React from 'react'

export default function TimeSegment({ data, path, key, videoRef, setPlaying, videoOffset = 0 }) {
    // data has type { start_time: { video_time: float }, end_time: { video_time: float }, label: str }
    // assert(!!data && data.constructor == Array)

    const onClick = (e) => {
        e.stopPropagation();
        videoRef?.current &&
            videoRef.current.seekTo(data['start_time']['video_time'], "seconds");
    }

    return <span
        className='tree-clickable-label'
        onClick={onClick}
        onKeyDown={(e) => e.key === 'Enter' && onClick(e)}
        role='button'
        tabIndex={-1}
        style={{ width: '100%', padding: '7px 0' }}>
        <b>{key}</b>: [{Math.round(data['start_time']['video_time'])}s - {Math.round(data['end_time']['video_time'])}s] {data['label']}
    </span>
}
