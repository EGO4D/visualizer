import React from 'react'

export default function FHOStaFrame({ data, path, key, videoRef, setPlaying, videoOffset = 0 }) {
    // data has type { video_frame: int, objects: [{ noun, verb, time_to_contact, bounding_box: {x: int, y: int, width: int, height: int, label: str } }] }

    const onClick = (e) => {
        e.stopPropagation();
        !!setPlaying && setPlaying(false);
        videoRef?.current && videoRef.current.seekTo(data['video_frame']['frame_number'] / 30 + (1 / 60), "seconds");
    }

    let obj_val = `[${data['objects'].length} objects]`;
    if (data['objects'].length == 1) {
        const noun = data['objects'][0]['noun'];
        const verb = data['objects'][0]['verb'];

        const noun_pre = noun.indexOf('_') == -1 ? noun : noun.substr(0, noun.indexOf('_'))
        const noun_post = noun.indexOf('_') == -1 ? '' : noun.substr(noun.indexOf('_'))
        const verb_pre = verb.indexOf('_') == -1 ? verb : verb.substr(0, verb.indexOf('_'))
        const verb_post = verb.indexOf('_') == -1 ? '' : verb.substr(verb.indexOf('_'))

        obj_val = <>
            <span /*style={{ color: '#1e847f' }}*/><b>{verb_pre}</b>{verb_post}</span>
            <span /*style={{ color: '#d2601a' }}*/><b> {noun_pre}</b>{noun_post}</span>
        </>
    }

    return <span
        className='tree-clickable-label'
        onClick={onClick}
        onKeyDown={(e) => e.key === 'Enter' && onClick(e)}
        role='button'
        tabIndex={-1}
        style={{ width: '100%', padding: '7px 0' }}>
        <b>{key}</b>: {obj_val}
    </span >
}
