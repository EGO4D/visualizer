import { Icon, InputGroup, Spinner, SpinnerSize } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";

import "react-filter-box/lib/react-filter-box.css"
import "./SearchBox.scss"

import useStateWithUrlParam from "../../hooks/useStateWithUrlParam";
import { useMephistoReview } from "../../shims/mephisto-review-hook";
import { getHostname } from "../../utils";

export default function SearchBox({ setSearchFilter }) {
    const { useSearch } = useMephistoReview({ hostname: getHostname() });
    const [query, setQueryAndURL, setQuery, setQueryUrl] = useStateWithUrlParam('s', '');
    const { isLoading, data, refetch } = useSearch(query);

    const onChange = (e) => {
        setQuery(e.target.value);
        if (e.target.value.length == 0) {
            setSearchFilter(null);
            setQueryUrl('');
        }
    }

    const onSubmit = () => {
        setQueryUrl(query);
        query.length == 0
            ? setSearchFilter(null)
            : refetch();
    }

    useEffect(() => {
        setSearchFilter(data);
    }, [data]);

    useEffect(() => onSubmit(query), []);


    // const submitBtn = <Button className='searchbox-icon' icon='arrow-right' onClick={(e) => search(e.target.value).then(res => console.log(res))} />
    const searchIcon = isLoading
        ? <Spinner size={SpinnerSize.SMALL} className='searchbox-icon' />
        : <Icon icon={'search'} className='searchbox-icon clickable' onClick={onSubmit} />;

    return <>
        <InputGroup disabled={isLoading} className='searchbox' fill={true} placeholder='Semantic search for anything' leftElement={searchIcon} onKeyDown={(e) => e.key == 'Enter' && onSubmit(e)} onChange={onChange} value={query} />
    </>
};
