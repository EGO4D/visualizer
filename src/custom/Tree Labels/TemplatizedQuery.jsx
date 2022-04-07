import React from 'react'

export default function TemplatizedQuery({ data, path, key, videoRef, setPlaying, videoOffset = 0 }) {
    // data has type { template?: str, query?: str, slot_x?: str, verb_x?: str, slot_y?: str, verb_y?: str, raw_tags?: [str] }

    return <span><b>query:</b> {data['query']}</span >
}
