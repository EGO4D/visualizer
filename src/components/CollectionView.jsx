import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import Footer from "../Footer";
import SearchBox from "./SearchBox/SearchBox";
import { benchmark_values } from "./FilterBox/filterData";
import { orderBy } from "lodash-es";


function CollectionView({
  itemRenderer = JSONItem,
  collectionRenderer: CollectionRenderer = GridCollection,
}) {
  const [query, setQueryAndURL, setQuery, setQueryURL] = useStateWithUrlParam('q', '');
  const [page, setPage] = useStateWithUrlParam('p', 1);
  const [filteredData, setFilteredData] = useState([]);
  const [searchFilter, setSearchFilter] = useState();
  const [selectedTab, setSelectedTab] = useStateWithUrlParam('b', 'browse');

  const { filterData, isLoading, error } =
    useMephistoReview({
      hostname: getHostname(),
    });

  const locallyFilteredData = useMemo(
    () => {
      if (!!searchFilter) {
        const { order, metadata } = searchFilter;
        console.log(searchFilter);
        const matchingItems =
          filteredData
            .filter(x => order.includes(x.video_uid))
            .map(obj => { return { ...obj, ...metadata[obj.video_uid] } })
            .sort((a, b) => order.indexOf(a.video_uid) - order.indexOf(b.video_uid))
        return matchingItems;
      }
      return filteredData;
    },
    [filteredData, searchFilter]);

    const gen_export_csv = (locallyFilteredData) => {
      return !!locallyFilteredData ? locallyFilteredData.map(o => { return { video_uid: o['video_uid'] } }) : []
    }

  const total_duration_seconds = locallyFilteredData?.map((v) => (v['duration'] || 0)).reduce((s, a) => s + a, 0);
  const tabid_to_verb = {
    'browse': 'Browsing',
    'analyze': 'Analyzing',
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
                  <pre>EGO4D Explorer</pre>
                </b>
              </NavbarHeading>
            </Link>
          </NavbarGroup>
          <NavbarGroup align={Alignment.CENTER}>
            <FilterBox filterData={filterData} setFilteredData={setFilteredData} {...{ query, setQueryAndURL, setQuery, setQueryURL }} />
            <SearchBox setSearchFilter={setSearchFilter} />
            {/* <CSVLink data={gen_export_csv(locallyFilteredData)} target="_blank" filename={'ego4d_viz_filtered_videos'} >
              <Button align={ALIGN_RIGHT} style={{ flex: '1 1 auto', margin: '7px', width: '140px'}}>Export Video UIDs</Button>
            </CSVLink> */}
            {/* <FileUploadButton /> */}
          </NavbarGroup>
        </div>
        <div>
          {tabid_to_verb[selectedTab]} <span className='nav-info-important'>{locallyFilteredData?.length} / {filterData?.length ?? 0} videos</span>.
          Total Duration: <span className='nav-info-important'>{
            total_duration_seconds > 3600 ? Math.round(total_duration_seconds / 3600 * 100) / 100 + ' hours' :
              total_duration_seconds > 60 ? Math.round(total_duration_seconds / 60 * 100) / 100 + ' minutes' :
                total_duration_seconds + ' seconds'
          }</span>.

          {false &&
            benchmark_values.map((benchmark) => {
              let snippet = `benchmarks include ${benchmark}`;
              return <span
                className={'nav-benchmark-opt' + (query.includes(snippet) ? ` tag-${benchmark} active` : '')}
                onClick={() => {
                  let new_query = query.includes(snippet)
                    ? query.replace(new RegExp(`(( AND| OR)\\s*${snippet}|${snippet}\\s*(AND |OR )|\\s*${snippet}\\s*)`), '')
                    : query.trim().length > 0
                      ? `${query} ${query.includes('benchmarks include') ? 'OR' : 'AND'} ${snippet}`
                      : snippet;

                  setQueryAndURL(new_query.replace(new RegExp('\\s+', 'g'), ' '));
                }}
                onKeyDown={(e) => e.preventDefault()}
                role='button'
                tabIndex={-1}>{benchmark}</span>
            })
          }
        </div>
      </Navbar>
      <main id="all-item-view-wrapper">
        <Tabs selectedTabId={selectedTab} onChange={setSelectedTab} animate={true} className={'main-tabs'} renderActiveTabPanelOnly={true}>
          <Tab id={'browse'} title={'Browse'} panel={
            <Browse filteredData={locallyFilteredData} {...{ setSelectedTab, itemRenderer, CollectionRenderer, isLoading, page, setPage, error }} />
          } />

          <Tab id={'analyze'} title={'Analyze'} panel={
            <Analyze filteredData={locallyFilteredData} filterData={filterData} />
          } />
        </Tabs>
      </main>

      <Footer />
    </>
  );
}

export default CollectionView;
