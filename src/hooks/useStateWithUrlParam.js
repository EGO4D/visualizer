import { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";

export default function useStateWithUrlParam(name, default_val, _deserializer){
    const deserializer = _deserializer ?? ((x) => x)
    const [searchParams, setSearchParams] = useSearchParams();
    const [prop, setProp] = useState(deserializer(searchParams.get(name) ?? default_val));

    // TODO fix race condition with setting two properties at the same time (searchParams updates async)
    const setPropInURL = (newProp) => {
        setSearchParams({ ...Object.fromEntries(searchParams), [name]: newProp });
    }

    const setPropWithUrl = (newProp) => {
        setPropInURL(newProp);
        setProp(newProp);
    }

    // useEffect(() => setProp(deserializer(searchParams.get(name) ?? default_val)), [searchParams]);

    return [prop, setPropWithUrl, setProp, setPropInURL]
}
