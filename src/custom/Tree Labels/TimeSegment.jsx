import React from 'react'
import { formatVideoSeconds } from '../Utility/Formatters';

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
        <b>{key}</b>: [{formatVideoSeconds(data['start_time']['video_time'])} - {formatVideoSeconds(data['end_time']['video_time'])}] {data['label']}
    </span>
}
