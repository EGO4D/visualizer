// Copyright (c) Meta Platforms, Inc. and affiliates. All Rights Reserved.

import React from "react";
import VideoDetail from "./Panels/VideoDetail";

function NarrationsItem({ item }) {

  return (
    <div className="json-item-renderer">
      <VideoDetail id={item.data._uid} />
    </div>
  );
}

export default NarrationsItem;
