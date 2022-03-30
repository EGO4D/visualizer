import { Icon } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";

import ReactFilterBox, { SimpleResultProcessing, GridDataAutoCompleteHandler } from "react-filter-box";
import "react-filter-box/lib/react-filter-box.css"
import "./FilterBox.css"

import { filter_options } from "./filterData";

//extend this class to add your custom operator
class CustomAutoComplete extends GridDataAutoCompleteHandler {

    // override this method to add new your operator
    // needOperators(parsedCategory) {
    //     var result = super.needOperators(parsedCategory);

    //     var eq_index = result.indexOf('==');
    //     if (eq_index !== -1) {
    //         result[eq_index] = '=';
    //     }
    //     return result;
    // }

    //override to custom to indicate you want to show your custom date time
    // needValues(parsedCategory, parsedOperator) {
    //     console.log(" -- needValues -- ")
    //     console.log(parsedCategory, parsedOperator)
    //     if (parsedOperator == "after") {
    //         return [{ customType: "date" }]
    //     }

    //     return super.needValues(parsedCategory, parsedOperator);
    // }
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
                return !!row[field] && row[field].some((x) => !!x.match(new RegExp('\\b' + value + '\\b', 'i')));
            case "!contain":
            case "!contains":
                return !!row[field] && row[field].some((x) => !x.match(new RegExp('\\b' + value + '\\b', 'i')));
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
                return !!row[field] && row[field].some((x) => x.toLowerCase() === value.toLowerCase());
            case "!include":
            case "!includes":
                return !row[field] || !row[field].some((x) => x.toLowerCase() === value.toLowerCase());
            default:
                return false;
        }
    }
}

export default function FilterBox({ filterData, setFilteredData }) {
    const [query, setQuery] = useState('');
    useEffect(() => onParseOk([]), [filterData]);

    const onParseOk = (expressions) => {
        var newData = new CustomResultProcessing(filter_options).process(filterData, expressions);
        setFilteredData(newData)
    }

    return <>
        <Icon icon={'search'} className='filterbox-search-icon'/>
        <ReactFilterBox
            data={[]}
            options={filter_options}
            query={query}
            onChange={(q) => setQuery(q)}
            onParseOk={onParseOk}
            autoCompleteHandler={new CustomAutoComplete([], filter_options)}
        />
    </>
};