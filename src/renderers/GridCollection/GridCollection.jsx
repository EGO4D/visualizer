import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { JSONItem } from "../JSONItem";
import "./GridCollection.scss";

function GridCollection({ items, itemRenderer: ItemRenderer = JSONItem, setDetailIDs, detailIDs, setSelectedTab, mode, selectedFields }) {
  const [searchParams,] = useSearchParams();

  return items && items.length > 0 ? (
    <div className={`default-collection-renderer-container mode-${mode}`}>
      {items.map((item) => {
        return (
          <Link
            to={`/${item.video_uid}?${searchParams.toString()}`}
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
            <ItemRenderer item={item} setDetailIDs={setDetailIDs} mode={mode} selectedFields={selectedFields} />
          </Link>
        );
      })}
    </div>
  ) : null;
}

export { GridCollection };
