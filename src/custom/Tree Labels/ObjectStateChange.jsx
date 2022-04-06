import React from 'react'

export default function ObjectStateChange({ data, path, key, videoRef, setPlaying }) {
    // data has type { object_of_change?: str, pre_frame?: video_frame_number, bounding_boxes: [{ x, y, width, height }], pnr_frame?: video_frame_number, bounding_boxes: [{ x, y, width, height }], post_frame?: video_frame_number, bounding_boxes: [{ x, y, width, height }] }

    return <span><b>{data['object_of_change']}</b>: [pre: {Math.round(data.pre_frame?.video_frame_number / 30.0)}s, pnr: {Math.round(data.pnr_frame?.video_frame_number / 30.0)}s, post: {Math.round(data.post_frame?.video_frame_number / 30.0)}s]</span >
}
