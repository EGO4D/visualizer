/* eslint-disable no-unused-expressions */

import React from "react";
import { Card, Elevation, HTMLTable, Spinner } from "@blueprintjs/core";
import { getHostname } from "../utils";

import "./NarrationsThumbnail.scss";
import { formatVideoSeconds } from "./Utility/Formatters";
import { useQuery } from "react-query";

const CUSTOM_FIELDS = ['video_uid', 'benchmarks']

function NarrationsThumbnail({ item, setDetailIDs, mode, selectedFields }) {
  const [isError, setError] = React.useState(false);

  const video_uid = selectedFields.includes('video_uid') &&
    <p style={{ fontSize: 12 }}>
      {item.video_uid}
    </p>

  let thumbnail;
  if (!!item.timestamps) {
    thumbnail = <div style={{ position: 'relative' }}>
      <img
        role="presentation"
        src={`${getHostname()}/thumbnail/${item.video_uid}?frame=${item.timestamps[0] * 30.0}`}
        alt="Thumbnail"
        style={{ width: item._img ? "100%" : "1px", height: "25vh", 'objectFit': 'cover' }}
      />
      <span style={{ position: 'absolute', right: 3, bottom: 5, zIndex: 1, color: 'white', fontSize: '0.8rem' }}>start: {formatVideoSeconds(item.timestamps[0])}</span>
    </div>
  } else {
    thumbnail = <img
      role="presentation"
      onError={(e) => {
        e.target.onerror = null;
        setError(true);
      }}
      src={
        item._img && !isError
          ? getHostname() + item._img
          : "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
      }
      alt="Thumbnail"
      style={{ width: item._img ? "100%" : "1px", height: "25vh", 'objectFit': 'cover' }}
    />;
  }

  const benchmarks =
    selectedFields.includes('benchmarks') &&
    <span>
      <br />
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
