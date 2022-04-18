import React from 'react'

export default function ObjectStateChange({ data, path, key, videoRef, setPlaying, videoOffset = 0 }) {
    // data has type { object_of_change?: str, pre_frame?: video_frame_number: { frame_number: int }, bounding_boxes: [{ x, y, width, height }], pnr_frame?: video_frame_number, bounding_boxes: [{ x, y, width, height }], post_frame?: video_frame_number, bounding_boxes: [{ x, y, width, height }] }

    let noun_label = data['object_of_change'];
    if (!!noun_label) {
        const noun = data['object_of_change'];

        const noun_pre = noun.indexOf('_') == -1 ? noun : noun.substr(0, noun.indexOf('_'))
        const noun_post = noun.indexOf('_') == -1 ? '' : noun.substr(noun.indexOf('_'))

        noun_label = <>
            <span><b> {noun_pre}</b>{noun_post}</span>
        </>
    }

    return <span>{noun_label}: [pre: {Math.round(data.pre_frame?.video_frame.frame_number / 30.0)}s, pnr: {Math.round(data.pnr_frame?.video_frame.frame_number / 30.0)}s, post: {Math.round(data.post_frame?.video_frame.frame_number / 30.0)}s]</span >
}
