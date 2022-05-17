import React, { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent";
import usePageTracking from './hooks/usePageTracking';
import CollectionView from "./components/CollectionView";
import ItemView from "./components/ItemView";
import { useLocation } from 'react-router-dom'

import { GridCollection, JSONItem, WordCloudItem } from "./renderers";
import NarrationsThumbnail from "./custom/NarrationsThumbnail";
import NarrationsItem from "./custom/NarrationsItem";
import LoginView from "./components/LoginView";

import "normalize.css/normalize.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "./App.scss";
import "./custom.scss";

const COOKIE_NAME = "ganalytics_cookie_consent"

const queryClient = new QueryClient();

function PageAnalytics() {
    usePageTracking();
    return <></>
}

export default function App() {
    const [cookiesAccepted, setCookiesAccepted] = useState(getCookieConsentValue(COOKIE_NAME));
    const location = useLocation();
    const showCookieConsent = location.pathname !== '/login';

    return (
        <QueryClientProvider client={queryClient}>
            <Routes>
                <Route path="/login" element={<LoginView />} />
                <Route path="/:id" element={<ItemView itemRenderer={NarrationsItem} allowReview={false} />} />
                <Route path="/" element={<CollectionView
                    collectionRenderer={GridCollection}
                    // itemRenderer={JSONItem}
                    itemRenderer={NarrationsThumbnail}
                />} />
            </Routes>

            {/* Cookie Policy and GAnalytics */}
            {cookiesAccepted && <PageAnalytics />}
            {showCookieConsent &&
                <CookieConsent
                    location="bottom"
                    buttonText="Accept and Close"
                    cookieName={COOKIE_NAME}
                    style={{ background: '#7762ce', width: '100%', left: 'auto', position: 'fixed' }}
                    buttonStyle={{ background: "#fff", fontSize: "13px" }}
                    onAccept={() => setCookiesAccepted(true)}>
                    We use Google Analytics to understand page use and develop this website. To learn more, see <a href="https://developers.google.com/analytics/devguides/collection/gtagjs/cookie-usage" style={{ color: 'rgb(86 191 255)' }}>here</a>.
                    <br />
                    To opt out of being tracked via Google Analytics, you can also use Google's opt-out browser add-on <a href="https://tools.google.com/dlpage/gaoptout" style={{ color: 'rgb(86 191 255)' }}>here</a>.
                </CookieConsent>
            }

        </QueryClientProvider>
    );
}
