import { useCallback, useEffect, useMemo } from "react";
import keyframes from "keyframes";
import { dfs_find } from "./ObjectSearchUtils";

const FIXED_COLORS = {
    'object_of_change': '#0ff',
    'left_hand': '#00f',
    'right_hand': '#0f0',
};

const COLORS = ['#e8c1a0', '#f47560', '#f1e15b', '#e8a838', '#61cdbb', '#97e3d5'];

// tabs are optional and let you limit which tabs we search. Recommended for perf.
// selectors should return bool
// mappers should return [{ label, kf: keyframes, interpolate: bool, min: int, max: int }]
const bbox_generators = [
    {
        'tabs': ['vq'],
        'data_selector': (v, path) => v._type === 'response_track',
        'data_mapper': ({ root, path }) => {
            const res_obj = {}; // label -> obj
            root['frames'].forEach(({ video_frame: { frame_number: frame }, bounding_boxes }) => {
                bounding_boxes.forEach(({ label, x, y, width, height }) => {
                    let obj = res_obj[label] ?? { label, kf: keyframes(), interpolate: true, min: frame, max: frame };
                    obj.kf.add({ time: frame, value: [x, y, width, height] });
                    obj.min = Math.min(obj.min, frame);
                    obj.max = Math.max(obj.max, frame);
                    res_obj[label] = obj;
                });
            });
            return Object.values(res_obj);
        }
    },
    {
        'tabs': ['vq'],
        'data_selector': (v, path) => v._type === 'vq_query_set' && v['visual_crop'],
        'data_mapper': ({ root, path }) => {
            let { x, y, width, height, video_frame: { frame_number: frame } } = root['visual_crop'];
            return [{ label: `${root['object_title']}`, kf: keyframes([{ time: frame, value: [x, y, width, height] }]), interpolate: false, min: frame, max: frame }];
        }
    },
    {
        'tabs': ['av'],
        'data_selector': (v, path) => v._type === 'av_person' && v['tracking_paths']['frames'].length > 0,
        'data_mapper': ({ root, path }) => {
            const res_obj = {}; // label -> obj
            root['tracking_paths']['frames'].forEach(({ video_frame: { frame_number: frame }, bounding_boxes }) => {
                bounding_boxes.forEach(({ label, x, y, width, height }) => {
                    let obj = res_obj[label] ?? { label, kf: keyframes(), interpolate: false, min: frame, max: frame };
                    obj.kf.add({ time: frame, value: [x, y, width, height] });
                    obj.min = Math.min(obj.min, frame);
                    obj.max = Math.max(obj.max, frame);
                    res_obj[label] = obj;
                });
            });
            return Object.values(res_obj);
        }
    },
    {
        'tabs': ['fho_scod'],
        'data_selector': (v, path) => v._type === 'tracked_frame' && v['bounding_boxes'].length > 0,
        'data_mapper': ({ root, path }) => {
            const res_obj = {}; // label -> obj
            const frame = root['video_frame']['frame_number'];
            root['bounding_boxes'].forEach(({ label, x, y, width, height }) => {
                let obj = res_obj[label] ?? { label, kf: keyframes(), interpolate: false, min: frame, max: frame };
                obj.kf.add({ time: frame, value: [x, y, width, height] });
                obj.min = Math.min(obj.min, frame);
                obj.max = Math.max(obj.max, frame);
                res_obj[label] = obj;
            });
            return Object.values(res_obj);
        }
    },
    {
        'tabs': ['fho_sta'],
        'data_selector': (v, path) => v._type === 'sta_frame' && v['objects'].length > 0,
        'data_mapper': ({ root, path }) => {
            const frame = root['video_frame']['frame_number'];
            return root['objects'].map(({ noun, verb, bounding_box: { x, y, width, height } }) => {
                return { label: noun, kf: keyframes([{ time: frame, value: [x, y, width, height] }]), interpolate: false, min: frame, max: frame }
            });
        }
    },
];

const point_generators = [
    {
        'tabs': ['fho_hands'],
        'data_selector': (v, path) => v._type === 'tracked_frame' && v['points'].length > 0,
        'data_mapper': ({ root, path }) => {
            const res_obj = {}; // label -> obj
            const frame = root['video_frame']['frame_number'];
            root['points'].forEach(({ label, x, y }) => {
                let obj = res_obj[label] ?? { label, kf: keyframes(), interpolate: false, min: frame, max: frame };
                obj.kf.add({ time: frame, value: [x, y] });
                obj.min = Math.min(obj.min, frame);
                obj.max = Math.max(obj.max, frame);
                res_obj[label] = obj;
            });
            return Object.values(res_obj);
        }
    }
]

export default function useBBoxes({ annotations, videoRef, canvasRef, dimensions, selectedTab }) {
    // TODO: abstract into a generic 'shape' renderer
    const bboxes = useMemo(
        () => {
            const bboxes = [];
            const label_colors = { ...FIXED_COLORS };
            for (let bbox_gen of bbox_generators) {
                const { data_selector, data_mapper, tabs } = bbox_gen;
                if (tabs && !tabs.includes(selectedTab)) {
                    continue;
                }
                for (let obj of dfs_find(annotations, data_selector)) {
                    const { root, path } = obj;
                    const bbox_objs = data_mapper({ root, path });
                    for (let bbox_obj of bbox_objs) {
                        // add colors
                        if (!label_colors[bbox_obj.label]) {
                            label_colors[bbox_obj.label] = COLORS[Object.keys(label_colors).length % COLORS.length];
                        }
                        bboxes.push({ color: label_colors[bbox_obj.label], ...bbox_obj })
                    }
                }
            }
            return bboxes;
        }, [annotations, selectedTab]);

    const points = useMemo(
        () => {
            const points = [];
            const label_colors = { ...FIXED_COLORS };
            for (let point_gen of point_generators) {
                const { data_selector, data_mapper, tabs } = point_gen;
                if (tabs && !tabs.includes(selectedTab)) {
                    continue;
                }
                for (let obj of dfs_find(annotations, data_selector)) {
                    const { root, path } = obj;
                    const point_objs = data_mapper({ root, path });
                    for (let point_obj of point_objs) {
                        // add colors
                        if (!label_colors[point_obj.label]) {
                            label_colors[point_obj.label] = COLORS[Object.keys(label_colors).length % COLORS.length];
                        }
                        points.push({ color: label_colors[point_obj.label], ...point_obj })
                    }
                }
            }
            return points;
        }, [annotations, selectedTab]);


    /* cv2.rectangle(img,
        pt1=(x - rect_thickness//2, y - rect_thickness//2),
        pt2=(x + textWidth + 10 + rect_thickness, y - textHeight - 10 - rect_thickness),
        color=rectColor, thickness=-1)
    */

    const step = useCallback(
        (ctx, now, metadata) => {
            const frame = Math.round(metadata.mediaTime * 30); // TODO: don't hardcode fps
            // Generate Bboxes for frame
            const cur_bboxes = bboxes.map(({ label, color, kf, interpolate, min, max }) => {
                if (frame < min || frame > max) { return null }
                let kf_obj = interpolate ? kf.value(frame) : kf.get(frame)?.value;
                if (!kf_obj) { return null }
                let [x, y, width, height] = kf_obj
                return { label, color, x, y, width, height };
            }).filter(x => !!x);

            // Generate Points for frame
            const cur_points = points.map(({ label, color, kf, interpolate, min, max }) => {
                if (frame < min || frame > max) { return null }
                let kf_obj = interpolate ? kf.value(frame) : kf.get(frame)?.value;
                if (!kf_obj) { return null }
                let [x, y] = kf_obj
                return { label, color, x, y };
            }).filter(x => !!x);

            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            // Draw Bboxes
            ctx.lineWidth = 5;
            cur_bboxes.forEach(bbox => {
                const { x, y, width, height, label, color } = bbox;
                ctx.strokeStyle = color ?? '#000';
                ctx.fillStyle = color ?? '#000';
                // bbox
                ctx.strokeRect(
                    x / dimensions[0] * canvasRef.current.width,
                    y / dimensions[1] * canvasRef.current.height,
                    width / dimensions[0] * canvasRef.current.width,
                    height / dimensions[1] * canvasRef.current.height,
                );
                // label bg
                ctx.fillRect(
                    x / dimensions[0] * canvasRef.current.width - ctx.lineWidth / 2,
                    y / dimensions[1] * canvasRef.current.height - 40,
                    ctx.measureText(label).width + 10,
                    40,
                )
                // label
                ctx.fillStyle = "#fff";
                ctx.fillText(label, (x + 3) / dimensions[0] * canvasRef.current.width, (y - 6) / dimensions[1] * canvasRef.current.height);
            });

            // Draw Points
            const radius = 7
            cur_points.forEach(point => {
                const { x, y, label, color } = point;
                ctx.strokeStyle = color ?? '#000';
                ctx.fillStyle = color ?? '#000';
                // point
                ctx.beginPath();
                ctx.arc(
                    x / dimensions[0] * canvasRef.current.width,
                    y / dimensions[1] * canvasRef.current.height,
                    radius, 0, 2 * Math.PI, false
                );
                // ctx.fill();
                ctx.stroke();

                // label bg
                ctx.fillRect(
                    x / dimensions[0] * canvasRef.current.width - ctx.lineWidth / 2 - ctx.measureText(label).width / 2,
                    y / dimensions[1] * canvasRef.current.height - 60,
                    ctx.measureText(label).width + 10,
                    40,
                )
                // label
                ctx.fillStyle = "#fff";
                ctx.fillText(label, (x + 3) / dimensions[0] * canvasRef.current.width - ctx.measureText(label).width / 2, (y - 6) / dimensions[1] * canvasRef.current.height - 20);
            });

            // Draw frame number
            ctx.font = "30px Arial";
            ctx.fillStyle = "#fff";

            ctx.fillText(
                "Frame: " +
                frame,
                10,
                40
            );
        },
        [canvasRef, bboxes, dimensions]
    );

    const steps = [step];

    // Render shapes on every frame
    const callback = useCallback(
        (now, metadata) => {
            if (!canvasRef.current) return;
            const ctx = canvasRef.current.getContext("2d");

            steps.forEach((step) => step(ctx, now, metadata));

            const video = videoRef.current.getInternalPlayer()
            !!video?.requestVideoFrameCallback && video.requestVideoFrameCallback(callback);
        },
        [canvasRef, videoRef, steps]
    );

    useEffect(() => {
        const video = !!videoRef.current && videoRef.current.getInternalPlayer();
        !!video?.requestVideoFrameCallback && video.requestVideoFrameCallback(callback);
    }, [videoRef, callback]);
}
