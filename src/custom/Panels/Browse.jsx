import React, { useState, useEffect } from "react";
import ErrorPane from "../../components/ErrorPane"
import { Pagination } from "../../components/pagination";
import { Button, Spinner } from "@blueprintjs/core";

export default function Browse({ setSelectedTab, isLoading, filteredData, page, itemRenderer, CollectionRenderer, setPage, error }) {
    const [mode, setMode] = useState('full');
    const resultsPerPage = mode === 'full' ? 12 : 36

    // TODO: simplify how this is handled
    useEffect(() => {
        if ((filteredData?.length ?? 0) === 0) {
            return;
        }
        const totalPages = Math.ceil(filteredData.length / resultsPerPage);
        (page > totalPages) && setPage(Math.max(totalPages, 1));
    }, [filteredData]);

    const totalPages = Math.ceil((filteredData?.length ?? 0) / resultsPerPage);

    return (
        <div className="item-dynamic">
            <ErrorPane error={error} />
            {isLoading ? (
                <h1 className="all-item-view-message"> <Spinner />Loading...</h1>
            ) : filteredData && filteredData.length > 0 ? (
                <>
                    {/* <div className="browse-mode-switcher">
                        <Button icon='square' onClick={() => setMode('full')} />
                        <Button icon='grid-view' onClick={() => setMode('mini')} />
                    </div> */}
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
