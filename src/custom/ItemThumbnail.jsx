import React, { useState } from 'react'
import { Spinner } from "@blueprintjs/core";
import { getHostname } from "../utils";
import { formatVideoSeconds } from "./Utility/Formatters";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function ItemThumbnail({ item }) {
    const [isError, setError] = useState(false);
    const [placeholderLoaded, setPlaceholderLoaded] = useState(false);
    const [loaded, setLoaded] = useState(false);

    // Load Order: Skeleton -> Placeholder -> Thumbnail
    const center_spinner = (
        <div style={{ zIndex: 2, position: 'absolute', left: '50%', top: '50%', transform: 'translateX(-50%) translateY(-50%)' }}>
            <Spinner />
        </div>
    )

    const placeholder = (
        <div style={{ display: loaded ? 'none' : 'inherit' }}>
            {!!item.timestamps && center_spinner}
            <img
                role="presentation"
                src={
                    item._img && !isError
                        ? getHostname() + item._img
                        : "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                }
                alt="Thumbnail"
                style={{ zIndex: 1, position: 'absolute', width: '100%', height: '100%', 'objectFit': 'cover', borderRadius: '3px', opacity: !!item.timestamps ? 0.6 : 1.0 }}
                onLoad={() => setPlaceholderLoaded(true)}
            />
        </div>
    );

    const timestampped_thumbnail = !!item.timestamps && (
        <img
            role="presentation"
            src={`${getHostname()}/thumbnail/${item.video_uid}?frame=${item.timestamps[0] * 30.0}`}
            alt="Thumbnail"
            style={{ zIndex: 3, position: 'absolute', width: '100%', height: '100%', 'objectFit': 'cover', borderRadius: '3px' }}
            onLoad={() => setLoaded(true)}
        />
    )

    if (!!item.timestamps) {
        return <div style={{ position: 'relative', width: item._img ? "100%" : "1px", height: "25vh", overflow: 'hidden' }}>
            {/* Load Order: Skeleton */}
            {!placeholderLoaded && <Skeleton style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 2, opacity: 1 }} />}
            {/* Load Order: Placeholder */}
            {!loaded && placeholder}
            {/* Load Order: Timestampped Thumbnail */}
            {placeholderLoaded && timestampped_thumbnail}

            {/* Always show timestamp overlay*/}
            <span style={{ position: 'absolute', right: 3, bottom: 5, zIndex: 4, color: 'white', fontSize: '0.8rem' }}>
                start: {formatVideoSeconds(item.timestamps[0])}
                {item.timestamps.length > 1 ? ` + ${item.timestamps.length - 1}` : ''}
            </span>
        </div>
    }
    return <div style={{ position: 'relative', width: item._img ? "100%" : "1px", height: "25vh", overflow: 'hidden' }}>
        {/* Load Order: Skeleton */}
        {!placeholderLoaded && <Skeleton style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 2, opacity: 1 }} />}
        {/* Load Order: Placeholder */}
        {placeholder}
    </div>;
}
