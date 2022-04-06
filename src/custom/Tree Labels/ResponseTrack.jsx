import React from 'react'

export default function ResponseTrack({ data, path, key, videoRef, setPlaying }) {
    // data has type { frames: [{video_frame: {frame_number: int}, bounding_boxes: [{ ... }]}] }
    // assert(!!data && data.constructor == Array)

    const first_frame = Math.min(...data['frames'].map(({ video_frame: { frame_number } }) => frame_number))

    const onClick = (e) => {
        e.stopPropagation();
        videoRef?.current && videoRef.current.seekTo(first_frame / 30.0, "seconds");
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
