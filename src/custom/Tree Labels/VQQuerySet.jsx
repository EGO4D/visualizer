import React from 'react'

export default function VQQuerySet({ data, path, key, videoRef, setPlaying, videoOffset = 0 }) {
    // data has type { object_title: str, query_video_frame: int, response_track: {frames: [{video_frame: int, bounding_boxes: [{x: int, y: int, width: int, height: int, label: str }] }]} }

    return <span><b>{key}</b>: {data['object_title']}</span >
}
