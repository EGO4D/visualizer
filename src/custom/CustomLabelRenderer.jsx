import TimeSegment from "./Tree Labels/TimeSegment";
import LabeledFrame from "./Tree Labels/LabeledFrame";
import FrameNumber from "./Tree Labels/FrameNumber";
import QuerySet from "./Tree Labels/QuerySet";

const RENDERERS = {
    'time_segment': TimeSegment,
    'labeled_frame': LabeledFrame,
    'frame_number': FrameNumber,
    'query_set': QuerySet,
}

export default function CustomLabelRenderer({ root, path, key, videoRef, setPlaying }) {

    return (
        root['_type'] in RENDERERS
            ? RENDERERS[root['_type']]({ data: root, path, key, videoRef, setPlaying })
            : null
    )
}
