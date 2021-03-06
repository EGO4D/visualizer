import { Icon } from "@blueprintjs/core";
import React, { useEffect } from "react";

import ReactFilterBox, { SimpleResultProcessing, GridDataAutoCompleteHandler, FilterQueryParser } from "react-filter-box";
import "react-filter-box/lib/react-filter-box.css"
import "./FilterBox.scss"

import { filter_options } from "./filterData";
import useStateWithUrlParam from "../../hooks/useStateWithUrlParam";

const sample_queries = [
    'benchmarks include moments',
    'video_uid == a37f501d-5cc1-4cc2-8ac2-1ec4e66a86d2',
    'duration > 5000',
    'scenarios include Cooking',
    'benchmarks include fho_hands AND modalities include imu',
    'is_stereo == true',
    'split_av == train',
    'split_em == val',
    'split_fho == multi',
    'splits include fho_scod-train'
]

class CustomAutoComplete extends GridDataAutoCompleteHandler { }

class CustomResultProcessing extends SimpleResultProcessing {
    filter(row, fieldOrLabel, operator, value) {
        var field = this.tryToGetFieldCategory(fieldOrLabel);
        switch (operator) {
            case "is":
            case "=":
            case "==":
                return row[field] === value;
            case "is not":
            case "!=":
                return row[field] !== value;
            case "contain":
            case "contains":
                return !!row[field] && row[field].some((x) => !!x && !!x.match(new RegExp('\\b' + value + '\\b', 'i')));
            case "!contain":
            case "!contains":
                return !!row[field] && row[field].some((x) => !!x && !x.match(new RegExp('\\b' + value + '\\b', 'i')));
            case ">":
                return row[field] > value;
            case ">=":
                return row[field] >= value;
            case "<":
                return row[field] < value;
            case "<=":
                return row[field] <= value;
            case "include":
            case "includes":
                return !!row[field] && row[field].some((x) => !!x && x.toLowerCase() === value.toLowerCase());
            case "!include":
            case "!includes":
                return !row[field] || !row[field].some((x) => !!x && x.toLowerCase() === value.toLowerCase());
            default:
                return false;
        }
    }
}

export default function FilterBox({ filterData, setFilteredData, query, setQuery, setQueryURL }) {

    const autoCompleteHandler = new CustomAutoComplete([], filter_options);
    const parser = new FilterQueryParser();
    parser.setAutoCompleteHandler(autoCompleteHandler);

    const onParseOk = (expressions) => {
        var newData = new CustomResultProcessing(filter_options).process(filterData, expressions);
        setQueryURL(query.trim());
        setFilteredData(newData);
    }

    useEffect(() => {
        var result = parser.parse(query);
        if (result.isError) { return }
        // new CustomResultProcessing(filter_options).process(filterData, result).length > 0 && onParseOk(result);
        onParseOk(result);
    }, [filterData, query]); // Run pre-loaded url query when the page first loads

    return <div style={{ display: 'flex', flexBasis: '50%', maxWidth: '50%', paddingRight: '10px'}}>
        <Icon icon={'filter'} className='filterbox-icon' />
        <ReactFilterBox
            data={[]}
            options={filter_options}
            query={query}
            onChange={(q) => setQuery(q)}
            onParseOk={onParseOk}
            autoCompleteHandler={autoCompleteHandler}
            editorConfig={{ placeholder: `Enter a filter, e.g. ${sample_queries[Math.floor(Math.random() * sample_queries.length)]}` }}
        />
    </div>
};
