import TimeSegment from "./Tree Labels/TimeSegment";
import LabeledFrame from "./Tree Labels/LabeledFrame";
import FrameNumber from "./Tree Labels/FrameNumber";
import NLQQuerySet from "./Tree Labels/NLQQuerySet"
import VQQuerySet from "./Tree Labels/VQQuerySet";
import TemplatizedQuery from "./Tree Labels/TemplatizedQuery";
import VideoTime from "./Tree Labels/VideoTime";
import ObjectStateChange from "./Tree Labels/ObjectStateChange";

import "./CustomLabelRenderer.scss"
import ResponseTrack from "./Tree Labels/ResponseTrack";
import VisualCrop from "./Tree Labels/VisualCrop";

const RENDERERS = {
    'frame_number': FrameNumber,
    'labeled_frame': LabeledFrame,
    'nlq_query_set': NLQQuerySet,
    'object_state_change': ObjectStateChange,
    'response_track': ResponseTrack,
    'templatized_query': TemplatizedQuery,
    'time_segment': TimeSegment,
    'video_time': VideoTime,
    'visual_crop': VisualCrop,
    'vq_query_set': VQQuerySet,
}

export default function CustomLabelRenderer({ root, path, key, videoRef, setPlaying }) {

    return (
        root['_type'] in RENDERERS
            ? RENDERERS[root['_type']]({ data: root, path, key, videoRef, setPlaying })
            : null
    )
}
