import React from 'react'

export default function LabeledFrame({ data, path, key, videoRef, setPlaying, videoOffset = 0 }) {
    // data has type { video_frame: { frame_number: int }, label: str, ?video_time: { video_time: float } }
    // assert(!!data && data.constructor == Array)

    const onClick = (e) => {
        e.stopPropagation();
        videoRef?.current &&
            videoRef.current.seekTo(data['video_frame']['frame_number']/30 + ( videoOffset ?? 1/120), "seconds");
        // !!setPlaying && setPlaying(true);
    }

    return <span
        className='tree-clickable-label'
        onClick={onClick}
        onKeyDown={(e) => e.key === 'Enter' && onClick(e)}
        role='button'
        tabIndex={-1}
        style={{width:'100%', padding: '7px 0'}}>
        {data['label']}
    </span >
}
