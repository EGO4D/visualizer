import React from 'react';
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
// import usePageTracking from './hooks/usePageTracking';
import CollectionView from "./components/CollectionView";
import ItemView from "./components/ItemView";

import { GridCollection, JSONItem, WordCloudItem } from "./renderers";
import NarrationsThumbnail from "./custom/NarrationsThumbnail";
import NarrationsItem from "./custom/NarrationsItem";
import LoginView from "./components/LoginView";

import "normalize.css/normalize.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "./App.scss";
import "./custom.scss";

const queryClient = new QueryClient();

export default function App() {
    // usePageTracking(); // Removed until we have a privacy policy

    return (
        <QueryClientProvider client={queryClient}>
            <Routes>
                <Route path="/login" element={<LoginView />} />
                <Route path="/:id" element={<ItemView itemRenderer={NarrationsItem} allowReview={false} />} />
                <Route path="/" element={<CollectionView
                    collectionRenderer={GridCollection}
                    // itemRenderer={JSONItem}
                    itemRenderer={NarrationsThumbnail}
                    pagination={true}
                    resultsPerPage={12}
                />} />
            </Routes>
        </QueryClientProvider>
    );
}
