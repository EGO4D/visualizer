import React, { useMemo } from "react";
import SpeedTree from "./Utility/SpeedTree";

import "./JSONSpeedViewer.scss"

function JSONSpeedViewer({ data, customRenderer, videoRef, setPlaying, videoOffset, expandThreshold }) {

    // Returns a list of node objects
    function json_to_treenodeinfo(root, path, key) {
        // Case 1: Root is null or undefined
        if (root === null || root === undefined) {
            return null;
        }

        // Case 2: Root is a single value
        else if (['string', 'number', 'boolean'].indexOf(typeof (root)) > -1) {
            if (key.startsWith('_')) { return null }; // Keep for production, remove for development
            return [{
                'id': [...path, String(key)].join('/'),
                'label': <span><b>{key}</b>: {root}</span>
            }]
        }

        // Case 3 and 4: Root is an Object or Array
        else if (root.constructor === Object || root.constructor === Array) {
            var keys = Object.keys(root);
            keys.sort(keyCompare);

            const arrayCount = root.constructor === Array && <span className='tree-label-array-count'> {` [ ${Object.keys(root).length} ]`} </span>;

            const { label: customLabel, overrides } = customRenderer({ root, path, key, videoRef, setPlaying, videoOffset });
            let label = customLabel ?? <span><b>{key}</b>{arrayCount}</span>
            // Optimization to speed up rendering
            const renderChildren = (
                overrides?.renderChildren != undefined
                    ? overrides.renderChildren
                    : root.constructor !== Array || (root.constructor == Array && root.length < 1000)
            );

            return [{
                'id': [...path, String(key)].join('/'),
                label,
                // 'selectable': root.constructor == Array,
                'children': renderChildren ? keys.map((k) => json_to_treenodeinfo(root[k], [...path, String(k)], k)).flat().filter(v => !!v) : []
            }]
        }

        console.error("Data Type Uncaught");
        return;
    }

    const memoized_graph = useMemo(() => {
        let start = new Date();
        // console.log("json_to_treenode_info start");
        const res = json_to_treenodeinfo(data, [], '')[0].children;
        // console.log("json_to_treenode_info took ", new Date()-start, " milliseconds");
        return res;
    }, [data])

    return (
        <div className="json-viewer-wrapper" style={{ flex: '1 1 auto', minHeight: '1px' }}>
            <SpeedTree data={memoized_graph} expandThreshold={expandThreshold} />{" "}
        </div>
    );
}

// Enforces order of items in list, others are placed at the end
function keyCompare(a, b) {
    const quick_info = ['video_uid', 'video_source', 'device', 'metadata',];
    const benchmarks = ['av', 'moments', 'vq', 'nlq', 'fho_hands', 'fho_lta', 'fho_scod', 'fho_sta', 'narrations',];
    const time_segments = ['video_frame', 'start_time', 'end_time', 'label',];
    const bboxes = ['x', 'y', 'width', 'height',];
    const fho_frames = ['pre_45', 'pre_30', 'pre_15', 'pre_frame', 'contact_frame', 'pnr_frame', 'post_frame',];
    const fho_lta = ['interval_start_time', 'interval_end_time', 'interval_start_frame', 'interval_end_frame'];

    const GLOBAL_ORDER = [...fho_frames, ...quick_info, ...benchmarks, ...time_segments, ...bboxes, ...fho_lta];
    var [indexA, indexB] = [GLOBAL_ORDER.indexOf(a), GLOBAL_ORDER.indexOf(b)];
    indexA = indexA === -1 ? GLOBAL_ORDER.length : indexA
    indexB = indexB === -1 ? GLOBAL_ORDER.length : indexB
    return indexA - indexB;
}

export default JSONSpeedViewer;
