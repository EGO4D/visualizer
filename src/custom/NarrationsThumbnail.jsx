/* eslint-disable no-unused-expressions */

import React from "react";
import { Card, Elevation } from "@blueprintjs/core";
import { getHostname } from "../utils";
import { getAllObjectValWordCounts } from "../renderers/WordCloudItem/WordCloud";

import "./NarrationsThumbnail.scss";

function NarrationsThumbnail({ item, setDetailIDs, mode }) {
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
        style={{ width: item._img ? "100%" : "1px", height: "25vh", 'objectFit': 'cover' }}
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
          {item.video_uid}
        </p>
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
          style={{ width: item._img ? "100%" : "1px", height: "25vh", 'objectFit': 'cover' }}
        />
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
          <br />
          {
            getTags(item).map((tag) => (
              <span
                className={"thumbnail-tag tag-" + tag}
                key={tag}>
                {tag}
              </span>
            ))
          }
          <br />
          {item.summaries}
        </span>
      </Card>
    </div>
  );
}

function getBenchmarks(item) {
  // let benchmarks = item['quick_info']['splits'].map((s) => {return {tag: s.split('-')[0] , subtag: s.split('-')[1]}});


  // 'av' in data['annotations'] && benchmarks.push({tag: 'av', subtag: data['annotations']['av']['splits'].join(" ")})
  // 'fho_hands' in data['annotations'] && benchmarks.push({tag: 'fho_hands', subtag: data['annotations']['fho_hands']['splits'].join(" ")})
  // 'fho_lta' in data['annotations'] && benchmarks.push({tag: 'fho_lta', subtag: data['annotations']['fho_lta']['splits'].join(" ")})
  // 'fho_scod' in data['annotations'] && benchmarks.push({tag: 'fho_scod', subtag: data['annotations']['fho_scod']['splits'].join(" ")})
  // 'fho_sta' in data['annotations'] && benchmarks.push({tag: 'fho_sta', subtag: data['annotations']['fho_sta']['splits'].join(" ")})
  // 'moments' in data['annotations'] && benchmarks.push({tag: 'moments', subtag: data['annotations']['moments']['splits'].join(" ")})
  // 'nlq' in data['annotations'] && benchmarks.push({tag: 'nlq', subtag: data['annotations']['nlq']['splits'].join(" ")})
  // 'vq' in data['annotations'] && benchmarks.push({tag: 'vq', subtag: data['annotations']['vq']['splits'].join(" ")})
  // 'narrations' in data['annotations'] && benchmarks.push({tag: 'narrations', subtag:''})

  return item.benchmarks.map((x) => { return { tag: x, subtag: '' } })
}

function getTags(data) {
  // return []
  return data.scenarios ?? []
}

export default NarrationsThumbnail;
