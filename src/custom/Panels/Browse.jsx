import React, { useState, useEffect, useMemo } from "react";
import ErrorPane from "../../components/ErrorPane"
import Pagination from "../../components/Pagination/Pagination";
import { Button, FormGroup, Intent, MenuItem, Spinner } from "@blueprintjs/core";
import { MultiSelect, Select } from "@blueprintjs/select";
import useStateWithUrlParam from "../../hooks/useStateWithUrlParam"

import "./Browse.scss"
import { filter_options } from "../../components/FilterBox/filterData";

const FIELD_BLOCKLIST = ['narrations']

export default function Browse({ setSelectedTab, isLoading, filteredData, page, itemRenderer, CollectionRenderer, setPage, error }) {
    const [mode, setMode] = useStateWithUrlParam('m', 'full');
    const [resultsPerPage, setResultsPerPage] = useStateWithUrlParam('rpp', 24);

    const fieldOptions = useMemo(() => filter_options.map(opt => opt.columnField).filter(opt => !FIELD_BLOCKLIST.includes(opt)));
    const [selectedFields, setSelectedFields] = useStateWithUrlParam('sf',['video_uid', 'benchmarks', 'summaries']);
    const [fieldQuery, setFieldQuery] = useState('');

    // TODO: simplify how this is handled
    useEffect(() => {
        if ((filteredData?.length ?? 0) === 0) {
            return;
        }
        const totalPages = Math.ceil(filteredData.length / resultsPerPage);
        (page > totalPages) && setPage(Math.max(totalPages, 1));
    }, [filteredData, resultsPerPage]);

    // const fieldOptions = useMemo(() => filter_options.map(opt => opt.columnField));
    const clearButton = selectedFields.length > 0 ? <Button icon="cross" minimal={true} onClick={() => setSelectedFields([])} /> : undefined;

    const totalPages = Math.ceil((filteredData?.length ?? 0) / resultsPerPage);

    console.log(selectedFields);
    return (
        <div className="item-dynamic">
            <ErrorPane error={error} />
            {isLoading ? (
                <h1 className="all-item-view-message"> <Spinner />Loading...</h1>
            ) : filteredData && filteredData.length > 0 ? (
                <>
                    <div className="browse-controls-container">
                        <div className="browse-controls">
                            <FormGroup
                                label={<div style={{ position: 'absolute', transform: 'translateY(-1.5rem)' }}>Show Properties</div>}
                                style={{ fontSize: '0.9rem', margin: '0' }}
                            >
                                <MultiSelect
                                    className='fields-selector'
                                    placeholder='Select some props'
                                    filterable={true}
                                    resetOnSelect={true}
                                    popoverProps={{ minimal: true }}
                                    items={fieldOptions.filter(x => !selectedFields.includes(x) && x.includes(fieldQuery))}
                                    disabled={mode !== 'full'}
                                    onQueryChange={q => setFieldQuery(q)}
                                    query={fieldQuery}
                                    selectedItems={selectedFields}
                                    itemRenderer={(x, { handleClick, modifiers }) =>
                                        <MenuItem
                                            selected={modifiers.active}
                                            className={modifiers.active ? 'bp3-selected' : ''}
                                            // icon={this.isFilmSelected(film) ? "tick" : "blank"}
                                            key={x}
                                            text={x}
                                            onClick={handleClick}
                                            shouldDismissPopover={false} />
                                    }
                                    tagRenderer={(x) => x}
                                    tagInputProps={{
                                        onRemove: (i) => setSelectedFields(selectedFields.filter(x => x !== i)),
                                        rightElement: clearButton,
                                        // tagProps: getTagProps,
                                    }}
                                    onItemSelect={(i) => setSelectedFields([...selectedFields, i])}>
                                </MultiSelect>
                            </FormGroup>
                        </div>
                        <div className="browse-controls">
                            <Select
                                className='pagenum-selector'
                                filterable={false}
                                popoverProps={{ minimal: true }}
                                items={[12, 24, 48, 96]}
                                activeItem={resultsPerPage}
                                itemRenderer={(x, { handleClick, modifiers, index }) =>
                                    <div
                                        className={'pagenum-option' + (modifiers.active ? ' active' : '')}
                                        onClick={handleClick}
                                        onKeyDown={(e) => e.key === 'Enter' && handleClick.bind(this)}
                                        role='button'
                                        tabIndex={index}>
                                        {x}
                                    </div>}
                                onItemSelect={(i) => setResultsPerPage(i)}>
                                <Button text={`Items: ${resultsPerPage}`} rightIcon="caret-down" />
                            </Select>
                            <div className="mode-switcher">
                                <Button icon={mode == 'mini' ? 'minimize' : 'maximize'} onClick={() => setMode(mode == 'mini' ? 'full' : 'mini')} intent={Intent.NONE} />
                                {/* <Button icon='grid-view' onClick={() => setMode('mini')} intent={ mode == 'mini' ? 'primary' : 'none'} /> */}
                                {/* <Button icon='square' onClick={() => setMode('full')} intent={ mode == 'full' ? 'primary' : 'none'} /> */}
                            </div>
                        </div>
                    </div>
                    <CollectionRenderer items={filteredData.slice((page - 1) * resultsPerPage, page * resultsPerPage)} {...{ itemRenderer, setSelectedTab, mode, selectedFields }} />
                    {totalPages > 1 ? (
                        <Pagination
                            totalPages={totalPages}
                            page={page}
                            setPage={setPage}
                        />
                    ) : null}
                </>
            ) : (
                <div className="all-item-view-message all-item-view-no-data">
                    <h1>
                        No videos match the filters
                    </h1>
                </div>
            )}
        </div>
    );
}
