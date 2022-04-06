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

    const onClick = (e) => {
        e.stopPropagation();
        videoRef?.current &&
            videoRef.current.seekTo(data['response']['start_time'], "seconds");
    }

    return <span
        className='tree-clickable-label'
        onClick={onClick}
        onKeyDown={(e) => e.key === 'Enter' && onClick(e)}
        role='button'
        tabIndex={-1}
        style={{ width: '100%', padding: '7px 0' }}>
        <b>{key}</b>: {data['query']['query']}
    </span >
}
