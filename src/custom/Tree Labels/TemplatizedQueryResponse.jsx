import React from 'react'

export default function TemplatizedQueryResponse({ data, path, key, videoRef, setPlaying }) {
    // data has type { start_time: float, end_time: float }

    const onClick = (e) => {
        e.stopPropagation();
        videoRef?.current &&
            videoRef.current.seekTo(data['start_time'], "seconds");
        // !!setPlaying && setPlaying(true);
    }

    return <span
        className='tree-clickable-label'
        onClick={onClick}
        onKeyDown={(e) => e.key === 'Enter' && onClick(e)}
        role='button'
        tabIndex={-1}
        style={{ width: '100%', padding: '7px 0' }}>
            <b>response:</b> [{Math.round(data['start_time'], 2)}s - {Math.round(data['end_time'], 2)}s]
        </span>
}
