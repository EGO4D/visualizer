// Copyright (c) Meta Platforms, Inc. and affiliates. All Rights Reserved.

import React from "react";
import { Link } from "react-router-dom";
import { JSONItem } from "../JSONItem";
import "./GridCollection.css";

function GridCollection({ items, itemRenderer: ItemRenderer = JSONItem, setDetailIDs, detailIDs, setSelectedTab }) {
  return items && items.length > 0 ? (
    <div className="default-collection-renderer-container">
      {items.map((item) => {
        return (
          <Link
            to={`/${item.video_uid}`}
            // to={'#'} // Add videos as tabs
            style={{ textDecoration: "none" }}
            key={item.video_uid}
            id={`item-${item.video_uid}`}
            // onClick={ // Add videos as tabs
            //   (e) => {
            //     e.preventDefault();

            //     if (e.metaKey || e.ctrlKey) {
            //       setDetailIDs([item.video_uid, ...detailIDs]);
            //     } else {
            //       setDetailIDs([item.video_uid]);
            //       setSelectedTab(item.video_uid);
            //     }
            //   }
            // }
          >
            <ItemRenderer item={item} setDetailIDs={setDetailIDs} />
          </Link>
        );
      })}
    </div>
  ) : null;
}

export { GridCollection };
