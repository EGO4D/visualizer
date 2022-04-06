import React from 'react'

export default function VideoTime({ data, path, key, videoRef, setPlaying }) {
    // data has type { video_time: float }
    // assert(!!data && data.constructor == Array)

    const onClick = (e) => {
        e.stopPropagation();
        videoRef?.current && videoRef.current.seekTo(data['video_time'], "seconds");
    }

    return <span
        className='tree-clickable-label'
        onClick={onClick}
        onKeyDown={(e) => e.key === 'Enter' && onClick(e)}
        role='button'
        tabIndex={-1}
        style={{ width: '100%', padding: '7px 0' }}>
        <b>{key}</b>: {data['video_time']}
    </span >
}
