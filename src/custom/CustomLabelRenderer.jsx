import TimeSegment from "./Tree Labels/TimeSegment";
import LabeledFrame from "./Tree Labels/LabeledFrame";
import FrameNumber from "./Tree Labels/FrameNumber";
import QuerySet from "./Tree Labels/QuerySet";
import TemplatizedQuery from "./Tree Labels/TemplatizedQuery";
import TemplatizedQueryResponse from "./Tree Labels/TemplatizedQueryResponse";

import "./CustomLabelRenderer.scss"
import VideoTime from "./Tree Labels/VideoTime";

const RENDERERS = {
    'frame_number': FrameNumber,
    'labeled_frame': LabeledFrame,
    'query_set': QuerySet,
    'templatized_query_response': TemplatizedQueryResponse,
    'templatized_query': TemplatizedQuery,
    'time_segment': TimeSegment,
    'video_time': VideoTime,
}

export default function CustomLabelRenderer({ root, path, key, videoRef, setPlaying }) {

    return (
        root['_type'] in RENDERERS
            ? RENDERERS[root['_type']]({ data: root, path, key, videoRef, setPlaying })
            : null
    )
}
