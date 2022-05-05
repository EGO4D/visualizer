import { useState } from 'react';
import { useSearchParams } from "react-router-dom";

export default function useStateWithUrlParam(name, default_val) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [prop, setProp] = useState(searchParams.get(name) ? JSON.parse(searchParams.get(name)) : default_val);

    // TODO fix race condition with setting two properties at the same time (searchParams updates async)
    const setPropInURL = (newProp) => {
        let newSearchParams = { ...Object.fromEntries(searchParams), [name]: JSON.stringify(newProp) };
        JSON.stringify(newProp) == JSON.stringify(default_val) && delete newSearchParams[name];
        setSearchParams(newSearchParams);
    }

    const setPropWithUrl = (newProp) => {
        setPropInURL(newProp);
        setProp(newProp);
    }

    // useEffect(() => setProp(deserializer(searchParams.get(name) ?? default_val)), [searchParams]);

    return [prop, setPropWithUrl, setProp, setPropInURL]
}
