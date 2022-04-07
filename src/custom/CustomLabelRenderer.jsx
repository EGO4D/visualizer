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
import TrackedFrame from "./Tree Labels/TrackedFrame";

const RENDERERS = {
    'frame_number': FrameNumber,
    'labeled_frame': LabeledFrame,
    'nlq_query_set': NLQQuerySet,
    'object_state_change': ObjectStateChange,
    'response_track': ResponseTrack,
    'templatized_query': TemplatizedQuery,
    'time_segment': TimeSegment,
    'tracked_frame': TrackedFrame,
    'tracking_path': ResponseTrack,
    'video_time': VideoTime,
    'visual_crop': VisualCrop,
    'vq_query_set': VQQuerySet,
}

const OVERRIDES = {
    'frame_number': { renderChildren: false },
    'labeled_frame': { renderChildren: false },
    'video_time': { renderChildren: false },
}

export default function CustomLabelRenderer({ root, path, key, videoRef, setPlaying, videoOffset }) {

    return ({
        label: root['_type'] in RENDERERS
            ? RENDERERS[root['_type']]({ data: root, path, key, videoRef, setPlaying, videoOffset })
            : null,
        overrides: root['_type'] in OVERRIDES
            ? OVERRIDES[root['_type']]
            : null,
    })
}
