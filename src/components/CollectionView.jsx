// Copyright (c) Meta Platforms, Inc. and affiliates. All Rights Reserved.

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMephistoReview } from "../shims/mephisto-review-hook";
import {
  Button,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  Alignment,
  Tabs,
  Tab,
  Intent,
} from "@blueprintjs/core";
import { ALIGN_RIGHT } from "@blueprintjs/core/lib/esm/common/classes";
import { GridCollection, JSONItem } from "../renderers";
import { getHostname } from "../utils";
import { CSVLink } from "react-csv";

import FilterBox from "./filterbox/FilterBox";
import Analyze from "../custom/Panels/Analyze";

import "./CollectionView.scss"
import Browse from "../custom/Panels/Browse";
import VersionHeader from "./VersionHeader";
import useStateWithUrlParam from "../hooks/useStateWithUrlParam";
// import VideoDetail from "../custom/Panels/VideoDetail";


function CollectionView({
  itemRenderer = JSONItem,
  collectionRenderer: CollectionRenderer = GridCollection,
  resultsPerPage = 12,
}) {
  const [page, setPage] =  useStateWithUrlParam('page', '1', parseInt);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedTab, setSelectedTab] = useStateWithUrlParam('tab', 'browse');
  const navigate = useNavigate();

  const { filterData, isFinished, isLoading, error } =
    useMephistoReview({
      hostname: getHostname(),
    });

  // TODO: simplify how this is handled
  useEffect(() => {
    if ((filteredData?.length ?? 0) === 0) {
      return;
    }
    const totalPages = Math.ceil(filteredData.length / resultsPerPage);
    (page > totalPages) && setPage(Math.max(totalPages, 1));
  }, [filteredData]);

  const gen_export_csv = (filteredData) => {
    return !!filteredData ? filteredData.map(o => { return { video_uid: o['video_uid'] } }) : []
  }

  const total_duration_seconds = filteredData?.map((v) => (v['duration'] || 0)).reduce((s, a) => s + a, 0);
  const tabid_to_verb = {
    'browse': 'Browsing',
    'analyze': 'Analyzing',
  }

  const onImFeelingLuckyClick = () => {
    navigate(`/${filteredData[Math.floor(Math.random() * filteredData.length)].video_uid}`)
  }

  return (
    <>
      <VersionHeader />
      <Navbar fixedToTop={true} className={"navbar-wrapper"} style={{ height: '75px' }}>
        <div>
          <NavbarGroup className="navbar-header" onClick={() => {
            setSelectedTab('browse');
            setPage(1);
            }}>
            <NavbarHeading>
              <b>
                <pre>EGO4D Dataset</pre>
              </b>
            </NavbarHeading>
          </NavbarGroup>
          <NavbarGroup align={Alignment.CENTER}>
            <FilterBox filterData={filterData} setFilteredData={setFilteredData} />
            <CSVLink data={gen_export_csv(filteredData)} target="_blank" filename={'ego4d_viz_filtered_videos'} >
              <Button intent={Intent.PRIMARY} align={ALIGN_RIGHT} style={{ flex: '1 1 auto', margin: '7px' }}>Export Video UIDs</Button>
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

          {/* <Button intent={Intent.PRIMARY} align={ALIGN_RIGHT} style={{ flex: '1 1 auto', margin: '7px' }} onClick={onImFeelingLuckyClick}>Random Video</Button> */}
        </div>
      </Navbar>
      <main id="all-item-view-wrapper">
        <Tabs selectedTabId={selectedTab} onChange={setSelectedTab} animate={true} className={'main-tabs'} renderActiveTabPanelOnly={true}>
          <Tab id={'browse'} title={'Browse'} panel={
            <Browse {...{ setSelectedTab, itemRenderer, CollectionRenderer, isLoading, isFinished, filteredData, page, resultsPerPage, setPage, error }} />
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
