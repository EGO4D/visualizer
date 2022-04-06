// General Purpose Video Module Generator
// From the json of annotations, we extract all the objects that match our data_selector. Each object is mapped with data_mapper, then passed to its module and rendered.
// 1. Select the objects you want to get from the json
// 2. Write a mapper to map that object to whatever data type the Module expects
// 3. Modules are rendered. Final Output is essentially [ <Module data_mapper(obj) /> for obj in json if data_selector(obj) ]

import React, { useMemo } from 'react';
import TimeSegmentsModule from './video_modules/TimeSegmentsModule';

// Yields all objects in root that pass condition.
// DOES NOT yield nested valid objects. If an object matches the condition, its children are not checked. This is a small optimization for our Ego4D data.
function* dfs_find(root, condition, path, key) {
    path = path ?? [];
    key = key ?? '';
    // Case 1: Root is null or undefined
    if (root === null || root === undefined) {
        return;
    }

    // If the root satisfies our conditions, yield it
    if (condition(root, path)) {
        yield ({ root, path, key });
        return;
    }

    // Then dfs it, looking for more

    // Case 2: Root is a single value
    else if (['string', 'number', 'boolean'].indexOf(typeof (root)) > -1) {
        return;
    }

    // Case 3: Root is an Object or Array
    else if (root.constructor === Object || root.constructor === Array) {
        for (let k of Object.keys(root)) {
            for (let i of dfs_find(root[k], condition, [...path, String(k)], k)) {
                yield i;
            }
        };
    }
}

// Type: [{ module: React.FC<{data: data_obj, ...}>, data_selector: Object -> [data_obj] }]
const mappers = [
    {
        'Module': TimeSegmentsModule,
        'data_selector': (v, path) => !path.find(x => x === 'people') && v.constructor === Array && v.filter((vchild) => vchild?._type === 'time_segment').length > 0,
        'data_mapper': ({ root, path }) => root.filter((vchild) => vchild?._type === 'time_segment').map(({ start_time: start, end_time: end, label }) => { return { start, end, label } }),
    },
    {
        'Module': TimeSegmentsModule,
        'data_selector': (v, path) => v.constructor === Array && v.filter((vchild) => vchild?._type === 'nlq_query_set').length > 0,
        'data_mapper': ({ root, path }) => root.filter((vchild) => vchild?._type === 'nlq_query_set').map(({ query: { query: label }, response: { start_time: start, end_time: end } }) => { return { start, end, label } }),
    },
    {
        'Module': TimeSegmentsModule,
        'data_selector': (v, path) => v._type == 'action_interval',
        'data_mapper': ({ root, path }) => root['actions'].map(({ start_time: { video_time: start }, end_time: { video_time: end }, verb, noun }) => { return { start, end, label: `${verb} ${noun}` } }),
    }
]

export default function VideoModules(props) {
    const { data, annotations, progress, videoRef, setPlaying, duration } = props;
    const extracted_modules = useMemo(
        () => {
            return mappers.map(
                ({ Module, data_selector, data_mapper }) => {
                    const data_generator = (annotations) => {
                        const res = [];
                        for (let obj of dfs_find(annotations, data_selector)) {
                            const { root, path } = obj;
                            res.push({
                                'label': path.join('.'),
                                'data': data_mapper({ root, path }),
                            });
                        }
                        return res;
                    }

                    return data_generator(annotations).map(
                        ({ label, data: extracted_data }) => {
                            return { Module, label, extracted_data }
                        })
                }
            ).flat()
        }, [annotations]);

    const modules = extracted_modules.map(({ Module, label, extracted_data }) =>
        <div key={label}>
            <span>{label}</span>
            <Module {...props} data={extracted_data} />
        </div>
    );
    return <div className="video-visualizers">
        {modules}
    </div>
}
