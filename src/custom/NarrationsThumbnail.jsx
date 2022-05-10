/* eslint-disable no-unused-expressions */

import React, { useState } from "react";
import { Card, Elevation, HTMLTable, Spinner } from "@blueprintjs/core";
import { getHostname } from "../utils";

import "./NarrationsThumbnail.scss";
import { formatVideoSeconds } from "./Utility/Formatters";

import 'react-loading-skeleton/dist/skeleton.css'

const CUSTOM_FIELDS = ['video_uid', 'benchmarks']

function NarrationsThumbnail({ item, setDetailIDs, mode, selectedFields }) {
  const [isError, setError] = useState(false);
  const [placeholderLoaded, setPlaceholderLoaded] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const video_uid = selectedFields.includes('video_uid') &&
    <p style={{ fontSize: 12 }}>
      {item.video_uid}
    </p>



  // TODO: refactor to make DRY code
  // Displays placeholder thumbnail regardless, loads timestamp thumbnail if item specifies timestamps (from search)
  let thumbnail;
  if (!!item.timestamps) {
    thumbnail =
      <div style={{ position: 'relative', width: item._img ? "100%" : "1px", height: "25vh", overflow: 'hidden' }}>
        {/* Placeholder image */}
        <div style={{ display: loaded ? 'none' : 'inherit' }}>
          <div style={{ zIndex: 2, position: 'absolute', left: '50%', top: '50%', transform: 'translateX(-50%) translateY(-50%)' }}>
            <Spinner />
          </div>
          <img
            role="presentation"
            src={
              item._img && !isError
                ? getHostname() + item._img
                : "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
            }
            alt="Thumbnail"
            style={{ zIndex: 1, position: 'absolute', width: '100%', height: '100%', 'objectFit': 'cover', borderRadius: '3px', opacity: 0.6 }}
            onLoad={() => setPlaceholderLoaded(true)}
          />
        </div>

        {/* Timestampped Thumbnail */}
        {
          // Load placeholder first before sending this request
          placeholderLoaded && <img
            role="presentation"
            src={`${getHostname()}/thumbnail/${item.video_uid}?frame=${item.timestamps[0] * 30.0}`}
            alt="Thumbnail"
            style={{ zIndex: 3, position: 'absolute', width: '100%', height: '100%', 'objectFit': 'cover', borderRadius: '3px' }}
            onLoad={() => setLoaded(true)}
          />
        }
        {/* Timestamp Overlay*/}
        <span style={{ position: 'absolute', right: 3, bottom: 5, zIndex: 4, color: 'white', fontSize: '0.8rem' }}>
          start: {formatVideoSeconds(item.timestamps[0])}
          { item.timestamps.length > 1 ? ` + ${item.timestamps.length-1}` : '' }
        </span>
      </div>
  } else {
    thumbnail = <img
      role="presentation"
      src={
        item._img && !isError
          ? getHostname() + item._img
          : "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
      }
      alt="Thumbnail"
      style={{ width: item._img ? "100%" : "1px", height: "25vh", objectFit: 'cover', borderRadius: '3px' }}
    />;
  }

  const benchmarks =
    selectedFields.includes('benchmarks') &&
    <span style={{paddingTop: '5px'}}>
      {
        getBenchmarks(item).map(({ tag, subtag }) => (
          subtag !== '' ?
            <div className={"thumbnail-tag-with-subtag"} key={tag + subtag}>
              <span className={"pillbox-left tag-" + tag}> {tag} </span>
              <span className={"pillbox-right subtag-" + tag}> {subtag} </span>
            </div> :
            <span
              className={"thumbnail-tag tag-" + tag}
              key={tag}>
              {tag}
            </span>
        ))
      }
    </span>;

  const rendered_fields =
    <HTMLTable condensed={true} bordered={true} className='thumbnail-detail'>
      <tbody>
        {selectedFields.filter(x => !CUSTOM_FIELDS.includes(x)).map(f =>
          <tr key={f}>
            <th className='thumbnail-detail-label'>{f}:</th>
            <td className='thumbnail-detail-info'>
              {
                item[f] && item[f].constructor == Array
                  ? item[f].map(
                    (x, i) => <>{i > 0 && <div className='separator' />}{String(x)}</>
                  )
                  : item[f]
              }
            </td>
          </tr>
        )}
      </tbody>
    </HTMLTable>;

  if (mode === 'mini') {
    return <div className='mini-thumbnail'> {thumbnail} </div>
  }
  return (
    <div className="json-item-renderer">
      <Card
        elevation={Elevation.TWO}
        interactive={true}
        className="json-item-card"
      >
        {video_uid}
        {thumbnail}
        {benchmarks}
        {rendered_fields}
      </Card>
    </div>
  );
}

function getBenchmarks(item) {
  return item.benchmarks.map((x) => { return { tag: x, subtag: '' } })
}

export default NarrationsThumbnail;
