import TimeSegment from "./Tree Labels/TimeSegment";
import LabeledFrame from "./Tree Labels/LabeledFrame";
import FrameNumber from "./Tree Labels/FrameNumber";
import NLQQuerySet from "./Tree Labels/NLQQuerySet"
import VQQuerySet from "./Tree Labels/VQQuerySet";
import TemplatizedQuery from "./Tree Labels/TemplatizedQuery";
import VideoTime from "./Tree Labels/VideoTime";
import ObjectStateChange from "./Tree Labels/ObjectStateChange";

import "./CustomLabelRenderer.scss"

const RENDERERS = {
    'frame_number': FrameNumber,
    'video_time': VideoTime,
    'labeled_frame': LabeledFrame,
    'nlq_query_set': NLQQuerySet,
    'vq_query_set': VQQuerySet,
    'templatized_query': TemplatizedQuery,
    'time_segment': TimeSegment,
    'object_state_change': ObjectStateChange,
}

export default function CustomLabelRenderer({ root, path, key, videoRef, setPlaying }) {

    return (
        root['_type'] in RENDERERS
            ? RENDERERS[root['_type']]({ data: root, path, key, videoRef, setPlaying })
            : null
    )
}
