import React, { useEffect, useState } from 'react';
import { Switch, Route, useLocation } from "react-router-dom";
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

import ReactGA from 'react-ga4';
const GA_MEASUREMENT_ID = 'G-E3CCWL27RK';

const usePageTracking = () => {
    const location = useLocation();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!window.location.href.includes("localhost")) {
            ReactGA.initialize(GA_MEASUREMENT_ID);
        }
        setInitialized(true);
    }, [])

    useEffect(() => {
        initialized && ReactGA.send({hitType: "pageview", page: location.pathname + location.search});
    }, [initialized, location])
}

export default function App(){
    // usePageTracking(); // Removed until we have a privacy policy

    return (
        <>
            <Switch>
                <Route path="/login">
                <LoginView />
                </Route>
                <Route path="/:id">
                {/* For more information see the 'Customization' section of the README.md file. */}
                {/* <ItemView wrapClass="item-dynamic" itemRenderer={JSONItem} /> */}
                <ItemView itemRenderer={NarrationsItem} allowReview={false} />
                </Route>
                <Route path="/">
                {/* For more information see the 'Customization' section of the README.md file. */}
                <CollectionView
                    collectionRenderer={GridCollection}
                    // itemRenderer={JSONItem}
                    itemRenderer={NarrationsThumbnail}
                    pagination={true}
                    resultsPerPage={12}
                />
                </Route>
            </Switch>
        </>
    );
}
