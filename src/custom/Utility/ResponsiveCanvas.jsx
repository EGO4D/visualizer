import React, { useEffect, useState, forwardRef } from "react";
import getSize from "./ElemSizeComputers";

function ResponsiveCanvas(props, ref){
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const onResize = () => {
            const parent = props.reactPlayerRef?.current?.getInternalPlayer();
            if (!parent) { return; }

            const [width, height] = getSize(parent);

            setWidth(width);
            setHeight(height);
        }

        window.addEventListener("resize", onResize);
        onResize();

        return () => {
            window.removeEventListener("resize", onResize);
        }
    }, []);

    return <canvas
            className={props.className}
            ref={ref}
            width={width * (props.scale ?? 1)}
            height={height * (props.scale ?? 1)}
            style={{ width, height }}
        />
}

export default forwardRef(ResponsiveCanvas);
