import React, { useState, useEffect } from "react";
import ErrorPane from "../../components/ErrorPane"
import Pagination from "../../components/Pagination/Pagination";
import { Button, Intent, Spinner } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import useStateWithUrlParam from "../../hooks/useStateWithUrlParam"

import "./Browse.scss"

export default function Browse({ setSelectedTab, isLoading, filteredData, page, itemRenderer, CollectionRenderer, setPage, error }) {
    const [mode, setMode] = useStateWithUrlParam('m', 'full');
    const [resultsPerPage, setResultsPerPage] = useStateWithUrlParam('rpp', '24', parseInt);

    // TODO: simplify how this is handled
    useEffect(() => {
        if ((filteredData?.length ?? 0) === 0) {
            return;
        }
        const totalPages = Math.ceil(filteredData.length / resultsPerPage);
        (page > totalPages) && setPage(Math.max(totalPages, 1));
    }, [filteredData, resultsPerPage]);

    const totalPages = Math.ceil((filteredData?.length ?? 0) / resultsPerPage);

    return (
        <div className="item-dynamic">
            <ErrorPane error={error} />
            {isLoading ? (
                <h1 className="all-item-view-message"> <Spinner />Loading...</h1>
            ) : filteredData && filteredData.length > 0 ? (
                <>
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
                    <CollectionRenderer items={filteredData.slice((page - 1) * resultsPerPage, page * resultsPerPage)} {...{ itemRenderer, setSelectedTab, mode }} />
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
