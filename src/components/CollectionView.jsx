import React, { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
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

import FilterBox from "./FilterBox/FilterBox";
import Analyze from "../custom/Panels/Analyze";

import Browse from "../custom/Panels/Browse";
import VersionHeader from "./VersionHeader";
import useStateWithUrlParam from "../hooks/useStateWithUrlParam";
// import VideoDetail from "../custom/Panels/VideoDetail";
import "./CollectionView.scss"
import FileUploadButton from "./PredictionsUpload/PredictionsUploadButton";


function CollectionView({
  itemRenderer = JSONItem,
  collectionRenderer: CollectionRenderer = GridCollection,
}) {
  const [searchParams,] = useSearchParams();
  const [page, setPage] = useStateWithUrlParam('page', '1', parseInt);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedTab, setSelectedTab] = useStateWithUrlParam('tab', 'browse');
  const navigate = useNavigate();

  const { filterData, isLoading, error } =
    useMephistoReview({
      hostname: getHostname(),
    });

  const gen_export_csv = (filteredData) => {
    return !!filteredData ? filteredData.map(o => { return { video_uid: o['video_uid'] } }) : []
  }

  const total_duration_seconds = filteredData?.map((v) => (v['duration'] || 0)).reduce((s, a) => s + a, 0);
  const tabid_to_verb = {
    'browse': 'Browsing',
    'analyze': 'Analyzing',
  }

  const onImFeelingLuckyClick = () => {
    navigate(`/${filteredData[Math.floor(Math.random() * filteredData.length)].video_uid}?${searchParams.toString()}`)
  }

  return (
    <>
      <VersionHeader />
      <Navbar fixedToTop={true} className={"navbar-wrapper"} style={{ height: '75px' }}>
        <div>
          <NavbarGroup className="navbar-header">
            <Link to={'/'} style={{ textDecoration: "none", color: "black" }}>
              <NavbarHeading>
                <b>
                  <pre>EGO4D Dataset</pre>
                </b>
              </NavbarHeading>
            </Link>
          </NavbarGroup>
          <NavbarGroup align={Alignment.CENTER}>
            <FilterBox filterData={filterData} setFilteredData={setFilteredData} />
            <CSVLink data={gen_export_csv(filteredData)} target="_blank" filename={'ego4d_viz_filtered_videos'} >
              <Button intent={Intent.PRIMARY} align={ALIGN_RIGHT} style={{ flex: '1 1 auto', margin: '7px' }}>Export Video UIDs</Button>
            </CSVLink>
            <FileUploadButton />
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
            <Browse {...{ setSelectedTab, itemRenderer, CollectionRenderer, isLoading, filteredData, page, setPage, error }} />
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
