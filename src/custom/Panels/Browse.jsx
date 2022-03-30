import React from "react";
import ErrorPane from "../../components/ErrorPane"
import { Pagination } from "../../components/pagination";
import { Spinner } from "@blueprintjs/core";

export default function Browse({ setSelectedTab, isLoading, isFinished, filteredData, page, resultsPerPage, itemRenderer, CollectionRenderer, setPage, error, pagination }) {
    const totalPages = filteredData && Math.ceil(filteredData.length / resultsPerPage);

    return (
        <div className="item-dynamic">
            <ErrorPane error={error} />
            {isLoading ? (
                <h1 className="all-item-view-message"> <Spinner />Loading...</h1>
            ) : isFinished ? (
                <h1 className="all-item-view-message">
                    Done reviewing! You can close this app now
                </h1>
            ) : filteredData && filteredData.length > 0 ? (
                <>
                    <CollectionRenderer items={filteredData.slice((page - 1) * resultsPerPage, page * resultsPerPage)} {...{itemRenderer, setSelectedTab}}/>
                    {pagination && totalPages > 1 ? (
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
