import React from 'react'

export default function ResponseTrack({ data, path, key, videoRef, setPlaying, videoOffset = 0 }) {
    // data has type { frames: [{video_frame: {frame_number: int}, bounding_boxes: [{ ... }]}] }
    // assert(!!data && data.constructor == Array)

    const first_frame = data['frames'].length > 0 ? Math.min(...data['frames'].map(({ video_frame: { frame_number } }) => frame_number)) : null;

    const onClick = (e) => {
        e.stopPropagation();
        first_frame && videoRef?.current && videoRef.current.seekTo(first_frame / 30.0 + videoOffset, "seconds");
    }

    const arrayCount = <span className='tree-label-array-count'> {` [ ${Object.keys(data['frames']).length} ]`} </span>;

    return <span
        className={first_frame && 'tree-clickable-label'}
        onClick={onClick}
        onKeyDown={(e) => e.key === 'Enter' && onClick(e)}
        role='button'
        tabIndex={-1}
        style={{ width: '100%', padding: '7px 0' }}>
        <b>{key}</b>{arrayCount}
    </span >
}
