/* eslint-disable no-unused-expressions */

import React from "react";
import { Card, Elevation, HTMLTable } from "@blueprintjs/core";
import { getHostname } from "../utils";

import "./NarrationsThumbnail.scss";
import { formatVideoSeconds } from "./Utility/Formatters";

const CUSTOM_FIELDS = ['video_uid', 'benchmarks']

function NarrationsThumbnail({ item, setDetailIDs, mode, selectedFields }) {
  const [isError, setError] = React.useState(false);

  if (mode === 'mini') {
    return <div className='mini-thumbnail'>
      <img
        role="presentation"
        onError={(e) => {
          e.target.onerror = null;
          // e.target.src = "image_path_here";
          setError(true);
        }}
        src={
          item._img && !isError
            ? getHostname() + item._img
            : "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
        }
        alt="Thumbnail"
        style={{ width: item._img ? "100%" : "1px", height: "100%", objectFit: 'cover' }}
      />
    </div>
  }
  return (
    <div className="json-item-renderer">
      <Card
        elevation={Elevation.TWO}
        interactive={true}
        className="json-item-card"
      >
        <p style={{ fontSize: 12 }}>
          {selectedFields.includes('video_uid') && item.video_uid}
        </p>
        <img
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
        />
        <span>
          {selectedFields.includes('benchmarks') &&
            <>
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
            </>
          }
          <HTMLTable condensed={true} bordered={true} className='thumbnail-detail'>
            <tbody>
              {selectedFields.filter(x => !CUSTOM_FIELDS.includes(x)).map(f =>
                <tr key={f}>
                  <th className='thumbnail-detail-label'>{f}:</th>
                  <td className='thumbnail-detail-info'>{item[f] && item[f].constructor == Array ? item[f].map((x, i) => <>{i > 0 && <div className='separator' />}{String(x)}</>) : item[f]}</td>
                </tr>
              )}
            </tbody>
          </HTMLTable>
        </span>
      </Card>
    </div>
  );
}

function getBenchmarks(item) {
  return item.benchmarks.map((x) => { return { tag: x, subtag: '' } })
}

export default NarrationsThumbnail;
