import React from 'react'

export default function NLQQuerySet({ data, path, key, videoRef, setPlaying }) {
    /* data has type { 'query':{
        '_type': 'templatized_query',
        'template': lq['template'] if 'template' in lq else None,
        'query': lq['query'] if 'query' in lq else None,
        'slot_x': lq['slot_x'] if 'slot_x' in lq else None,
        'verb_x': lq['verb_x'] if 'verb_x' in lq else None,
        'slot_y': lq['slot_y'] if 'slot_y' in lq else None,
        'verb_y': lq['verb_y'] if 'verb_y' in lq else None,
        'raw_tags': lq['raw_tags'],
    },
    'response': {
        '_type': 'templatized_query_response',
        'start_time': lq['video_start_sec'],
        'end_time': lq['video_end_sec'],
    } } */

    return <span><b>{key}</b>: {data['query']['query']}</span >
}
