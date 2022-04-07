// General Purpose Video Module Generator
// From the json of annotations, we extract all the objects that match our data_selector. Each object is mapped with data_mapper, then passed to its module and rendered.
// 1. Select the objects you want to get from the json
// 2. Write a mapper to map that object to whatever data type the Module expects
// 3. Modules are rendered. Final Output is essentially [ <Module data_mapper(obj) /> for obj in json if data_selector(obj) ]

import React, { useMemo } from 'react';
import TimeSegmentsModule from './video_modules/TimeSegmentsModule';
import { dfs_find } from '../custom/Utility/ObjectSearchUtils';

// Type: [{ module: React.FC<{data: data_obj, ...}>, data_selector: Object -> [data_obj] }]
const module_generators = [
    {
        'Module': TimeSegmentsModule,
        'data_selector': (v, path) => !path.includes('people') && v?.constructor === Array && v.filter((vchild) => vchild?._type === 'time_segment').length > 0,
        'data_mapper': ({ root, path }) => root.filter((vchild) => vchild?._type === 'time_segment').map(({ start_time: { video_time: start }, end_time: { video_time: end }, label }) => { return { start, end, label } }),
    },
    {
        'Module': TimeSegmentsModule,
        'data_selector': (v, path) => v?.constructor === Array && v.filter((vchild) => vchild?._type === 'nlq_query_set').length > 0,
        'data_mapper': ({ root, path }) => root.filter((vchild) => vchild?._type === 'nlq_query_set').map(({ query: { query: label }, response: { start_time: { video_time: start }, end_time: { video_time: end } } }) => { return { start, end, label } }),
    },
    {
        'Module': TimeSegmentsModule,
        'data_selector': (v, path) => v?._type === 'action_interval',
        'data_mapper': ({ root, path }) => root['actions'].map(({ start_time: { video_time: start }, end_time: { video_time: end }, verb, noun }) => { return { start, end, label: `${verb} ${noun}` } }),
    },
    {
        'Module': TimeSegmentsModule,
        'data_selector': (v, path) => v?.constructor === Array && v?.length > 0 && v[0]?._type === 'vq_query_set',
        'data_mapper': ({ root, path }) => {
            return root.map((query_set) => {
                const frames = query_set['response_track']['frames'].map(({ video_frame: { frame_number } }) => frame_number);
                return { start: Math.min(...frames) / 30.0, end: Math.max(...frames) / 30.0, label: query_set['object_title'] };
            })
        }
    }
]

export default function VideoModules(props) {
    const { data, annotations, progress, videoRef, setPlaying, duration } = props;
    const extracted_modules = useMemo(
        () => {
            var start = new Date();
            // console.log("video_modules start");
            const res = module_generators.map(
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
            // console.log("video_modules took ", new Date() - start, " milliseconds");
            return res;
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
