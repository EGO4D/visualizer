import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";

import ReactGA from 'react-ga4';
const GA_MEASUREMENT_ID = 'G-E3CCWL27RK';

export default usePageTracking = () => {
    const location = useLocation();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!window.location.href.includes("localhost")) {
            ReactGA.initialize(GA_MEASUREMENT_ID);
        }
        setInitialized(true);
    }, [])

    useEffect(() => {
        initialized && ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
    }, [initialized, location])
}
