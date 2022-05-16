import { Icon } from "@blueprintjs/core";
import React, { useCallback, useEffect, useMemo } from "react";

import ReactFilterBox, { SimpleResultProcessing, GridDataAutoCompleteHandler, FilterQueryParser, BaseAutoCompleteHandler } from "react-filter-box";
import "react-filter-box/lib/react-filter-box.css"
import "./FilterBox.scss"

import { filter_options } from "./filterData";
import { useFilterlistDataStore } from '../../stores/UploadedDataStore';
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

export default function FilterBox({ filterData, setFilteredData, query, setQuery, setQueryURL }) {
    const filterLists = useFilterlistDataStore(store => store.data);

    useEffect(() => console.log(filterLists), [filterLists]);

    // Add video uid here because it depends on a hook
    const new_filter_options = [{
        columnField: "video_uid",
        type: "text",
        customOperatorFunc: (_c) =>
            Object.keys(filterLists).length > 0
                ? ['is_in_file', 'is_not_in_file', '==', '!=']
                : ['==', '!='],
        customValuesFunc: (_c, operator) =>
            ['is_in_file', 'is_not_in_file'].includes(operator)
                ? Object.keys(filterLists)
                : []
    }, ...filter_options];

    class CustomAutoComplete extends BaseAutoCompleteHandler {
        needCategories() { return new_filter_options.map(x => x.columnField); }
        needOperators(category) {
            let opt = new_filter_options.find(x => x.columnField == category)
            return !!opt?.customOperatorFunc ? opt.customOperatorFunc(category) : []
        }
        needValues(category, operator){
            let opt = new_filter_options.find(x => x.columnField == category)
            return !!opt?.customValuesFunc ? opt.customValuesFunc(category, operator) : []
        }
    }

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
                case "is_in_file":
                    return value in filterLists && filterLists[value].some((x) => x === row[field])
                case "is_not_in_file":
                    return value in filterLists && !filterLists[value].some((x) => x === row[field])
                default:
                    return false;
            }
        }
    }

    const autoCompleteHandler = new CustomAutoComplete([], new_filter_options);
    const parser = new FilterQueryParser();
    parser.setAutoCompleteHandler(autoCompleteHandler);

    const onParseOk = (expressions) => {
        var newData = new CustomResultProcessing(new_filter_options).process(filterData, expressions);
        setQueryURL(query.trim());
        setFilteredData(newData);
    }

    useEffect(() => {
        var result = parser.parse(query);
        if (result.isError) { return }
        // new CustomResultProcessing(filter_options).process(filterData, result).length > 0 && onParseOk(result);
        onParseOk(result);
    }, [filterData, query]); // Run pre-loaded url query when the page first loads

    return <div style={{ display: 'flex', flexBasis: '65%', maxWidth: '65%', paddingRight: '10px' }}>
        <Icon icon={'filter'} className='filterbox-icon' />
        <ReactFilterBox
            data={[]}
            options={new_filter_options}
            query={query}
            onChange={(q) => setQuery(q)}
            onParseOk={onParseOk}
            autoCompleteHandler={autoCompleteHandler}
            editorConfig={{ placeholder: `Enter a filter, e.g. ${sample_queries[Math.floor(Math.random() * sample_queries.length)]}` }}
        />
    </div>
};
