// Copyright (c) Meta Platforms, Inc. and affiliates. All Rights Reserved.

import React, { useEffect, useState } from "react";
import { useMephistoReview } from "../shims/mephisto-review-hook";
import {
  Button,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  Alignment,
  Tabs,
  Tab,
} from "@blueprintjs/core";
import { ALIGN_RIGHT } from "@blueprintjs/core/lib/esm/common/classes";
import { GridCollection, JSONItem } from "../renderers";
import { getHostname } from "../utils";
import { CSVLink } from "react-csv";

import FilterBox from "./filterbox/FilterBox";
import Analyze from "../custom/Panels/Analyze";

import "./CollectionView.scss"
import Browse from "../custom/Panels/Browse";
// import VideoDetail from "../custom/Panels/VideoDetail";


function CollectionView({
  itemRenderer = JSONItem,
  collectionRenderer: CollectionRenderer = GridCollection,
  pagination = true,
  resultsPerPage = 12,
}) {
  const [page, setPage] = useState(pagination ? 1 : null);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('browse')

  const { filterData, isFinished, isLoading, error, mode } =
    useMephistoReview({
      page,
      resultsPerPage,
      filters: "",
      hostname: getHostname(),
    });

  useEffect(() => setPage(1), [filteredData]);

  const gen_export_csv = (filteredData) => {
    return !!filteredData ? filteredData.map(o => { return { video_uid: o['video_uid'] } }) : []
  }

  const total_duration_seconds = filteredData?.map((v) => (v['duration'] || 0)).reduce((s, a) => s + a, 0);
  const tabid_to_verb = {
    'browse': 'Browsing',
    'analyze': 'Analyzing',
  }

  return (
    <>
      <Navbar fixedToTop={true} className={"navbar-wrapper"}>
        <div>
          <NavbarGroup className="navbar-header">
            <NavbarHeading>
              <b>
                <pre>EGO4D Dataset</pre>
              </b>
            </NavbarHeading>
          </NavbarGroup>
          <NavbarGroup align={Alignment.CENTER}>
            <FilterBox filterData={filterData} setFilteredData={setFilteredData} />
            <CSVLink data={gen_export_csv(filteredData)} target="_blank" filename={'ego4d_viz_filtered_videos'} >
              <Button align={ALIGN_RIGHT} style={{ flex: '1 1 auto', margin: '7px' }}>Export Video UIDs</Button>
            </CSVLink>
          </NavbarGroup>
        </div>
        <div>
          {tabid_to_verb[selectedTab]} <span className='nav-info-important'>{filteredData?.length} / {filterData?.length ?? 0} videos</span>.
          Total Duration: <span className='nav-info-important'>{
            total_duration_seconds > 3600 ? Math.round(total_duration_seconds / 3600 * 100) / 100 + ' hours' :
              total_duration_seconds > 60 ? Math.round(total_duration_seconds / 60 * 100) / 100 + ' minutes' :
                total_duration_seconds + ' seconds'
          }</span>.
        </div>
      </Navbar>
      <main className={`all-item-view mode-${mode}`} id="all-item-view-wrapper">
        <Tabs selectedTabId={selectedTab} onChange={setSelectedTab} animate={true} className={'main-tabs'}>
          <Tab id={'browse'} title={'Browse'} panel={
            <Browse {...{ setSelectedTab, itemRenderer, CollectionRenderer, isLoading, isFinished, filteredData, page, resultsPerPage, setPage, error, pagination }} />
          } />

          <Tab id={'analyze'} title={'Analyze'} panel={
            <Analyze filteredData={filteredData} filterData={filterData} />
          } />
        </Tabs>
      </main>
    </>
  );
}

export default CollectionView;