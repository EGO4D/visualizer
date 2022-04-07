import React from 'react'

export default function TrackedFrame({ data, path, key, videoRef, setPlaying, videoOffset = 0 }) {
    // data has type { video_frame: { frame_number: int }, bounding_boxes: [{ ... }] }

    const onClick = (e) => {
        e.stopPropagation();
        videoRef?.current && videoRef.current.seekTo(data['video_frame']['frame_number'] / 30 + 1/120 + videoOffset, "seconds");
    }

    return <span
        className='tree-clickable-label'
        onClick={onClick}
        onKeyDown={(e) => e.key === 'Enter' && onClick(e)}
        role='button'
        tabIndex={-1}
        style={{ width: '100%', padding: '7px 0' }}>
        <b>{key}</b>
    </span >
}
