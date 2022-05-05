import { Icon, InputGroup } from "@blueprintjs/core";
import React, { useEffect } from "react";

import ReactFilterBox, { SimpleResultProcessing, GridDataAutoCompleteHandler, FilterQueryParser } from "react-filter-box";
import "react-filter-box/lib/react-filter-box.css"
import "./SearchBox.scss"

import useStateWithUrlParam from "../../hooks/useStateWithUrlParam";

const sample_queries = [
    'benchmarks include moments',
    'video_uid == a37f501d-5cc1-4cc2-8ac2-1ec4e66a86d2',
    'duration > 5000',
    'scenarios include Cooking',
    'benchmarks include fho_hands AND modalities include imu',
    'narrations contain "instrument"',
    'is_stereo == true',
    'split_av == train',
    'split_em == val',
    'split_fho == multi',
    'splits include fho_scod-train'
]

export default function SearchBox({ filterData, setFilteredData }) {
    const [search, setSearchAndUrl, setSearch, setSearchUrl] = useStateWithUrlParam('s', '');

    return <>
        <InputGroup className='searchbox' fill={true} placeholder='Semantic search for anything' leftElement={<Icon icon={'search'} className='searchbox-icon'/>} />
    </>
};
