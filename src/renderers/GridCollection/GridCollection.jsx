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
            to={`/${item.video_uid}?${searchParams.toString()}${!!item.timestamps ? '&t='+item.timestamps[0] : ''}`}
            style={{ textDecoration: "none" }}
            key={item.video_uid}
            id={`item-${item.video_uid}`}
          >
            <ItemRenderer item={item} setDetailIDs={setDetailIDs} mode={mode} selectedFields={selectedFields} />
          </Link>
        );
      })}
    </div>
  ) : null;
}

export { GridCollection };
