/* eslint-disable no-unused-expressions */

import React from "react";
import { Card, Elevation, HTMLTable } from "@blueprintjs/core";
import ItemThumbnail from "./ItemThumbnail";
import "./NarrationsThumbnail.scss";

const CUSTOM_FIELDS = ['video_uid', 'benchmarks']

function NarrationsThumbnail({ item, setDetailIDs, mode, selectedFields }) {
  const video_uid = selectedFields.includes('video_uid') &&
    <p style={{ fontSize: 12 }}>
      {item.video_uid}
    </p>

  const imageThumbnail = <ItemThumbnail item={item} />;

  const benchmarks =
    selectedFields.includes('benchmarks') &&
    <span style={{ paddingTop: '5px' }}>
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
    return <div className='mini-thumbnail'> {imageThumbnail} </div>
  }
  return (
    <div className="json-item-renderer">
      <Card
        elevation={Elevation.TWO}
        interactive={true}
        className="json-item-card"
      >
        {video_uid}
        {imageThumbnail}
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
