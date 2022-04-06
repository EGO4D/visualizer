import { useCallback, useEffect, useMemo } from "react";
import keyframes from "keyframes";
import { dfs_find } from "./ObjectSearchUtils";

const FIXED_COLORS = {
    'object_of_change': '#0ff',
    'left_hand': '#00f',
    'right_hand': '#0f0',
};

const COLORS = ['#e8c1a0', '#f47560', '#f1e15b', '#e8a838', '#61cdbb', '#97e3d5'];

// mappers should return [{ label, kf: keyframes, interpolate: bool, min: int, max: int }]
const bbox_generators = [
    {
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
        'data_selector': (v, path) => v._type === 'vq_query_set',
        'data_mapper': ({ root, path }) => {
            let { x, y, width, height, video_frame: { frame_number: frame } } = root['visual_crop'];
            return [{ label: `${root['object_title']}`, kf: keyframes([{ time: frame, value: [x, y, width, height] }]), interpolate: false, min: frame, max: frame }];
        }
    }
]

export default function useBBoxes({ annotations, videoRef, canvasRef, dimensions }) {
    const bboxes = useMemo(
        () => {
            const bboxes = [];
            const label_colors = { ...FIXED_COLORS };
            for (let bbox_gen of bbox_generators) {
                const { data_selector, data_mapper } = bbox_gen;
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
        }, [annotations]);


    /* cv2.rectangle(img,
        pt1=(x - rect_thickness//2, y - rect_thickness//2),
        pt2=(x + textWidth + 10 + rect_thickness, y - textHeight - 10 - rect_thickness),
        color=rectColor, thickness=-1)
    */

    const step = useCallback(
        (ctx, now, metadata) => {
            const frame = Math.round(metadata.mediaTime * 30); // TODO: get framerate from fps in data
            const cur_bboxes = bboxes.filter(({ min, max }) => frame >= min && frame <= max).map(({ label, color, kf, interpolate }) => {
                let [x, y, width, height] = interpolate ? kf.value(frame) : kf.get(frame).value;
                return { label, color, x, y, width, height };
            })
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            ctx.lineWidth = 5;
            cur_bboxes.forEach(bbox => {
                const { x, y, width, height, label, color } = bbox;
                ctx.strokeStyle = color ?? '#000';
                ctx.fillStyle = color ?? '#000';
                ctx.strokeRect(
                    x / dimensions[0] * canvasRef.current.width,
                    y / dimensions[1] * canvasRef.current.height,
                    width / dimensions[0] * canvasRef.current.width,
                    height / dimensions[1] * canvasRef.current.height,
                );
                ctx.fillRect(
                    x / dimensions[0] * canvasRef.current.width - ctx.lineWidth / 2,
                    (y - 30) / dimensions[1] * canvasRef.current.height,
                    ctx.measureText(label).width + (6 / dimensions[1] * canvasRef.current.height),
                    30 / dimensions[1] * canvasRef.current.height,
                )
                ctx.fillStyle = "#fff";
                // TODO: add rect behind text
                ctx.fillText(label, (x + 3) / dimensions[0] * canvasRef.current.width, (y - 6) / dimensions[1] * canvasRef.current.height);
            });
            // ctx.strokeRect(20, 20, 150, 100);

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

    // TODO: remove temp bbox code for testing
    // useEffect(() => {
    //     const test_bboxes = {};
    //     [...Array(1000).keys()].forEach(frame => {
    //         test_bboxes[frame] = [{ label: 'test-bbox', x: frame, y: frame * 0.5, width: 1800 - frame, height: 100 }]
    //     });
    //     setBboxes(test_bboxes);
    // }, [])

    const callback = useCallback(
        (now, metadata) => {
            if (!canvasRef.current) return;
            const ctx = canvasRef.current.getContext("2d");

            steps.forEach((step) => step(ctx, now, metadata));

            const video = videoRef.current.getInternalPlayer()
            !!video && video.requestVideoFrameCallback(callback);
        },
        [canvasRef, videoRef, steps]
    );

    useEffect(() => {
        const video = !!videoRef.current && videoRef.current.getInternalPlayer();
        !!video && video.requestVideoFrameCallback(callback);
    }, [videoRef, callback]);
}
