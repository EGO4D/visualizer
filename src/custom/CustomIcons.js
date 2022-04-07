const ptIconWrapper = (path, viewboxDefault = 16) => {
    return (
        <span className="bp3-icon">
            <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="16px"
                height="16px"
                viewBox={`0 0 ${viewboxDefault} ${viewboxDefault}`}
            >
                {path}
            </svg>
        </span>
    );
};

export const nextFrame = ptIconWrapper(
    <g>
        <path fillRule="evenodd" clipRule="evenodd" d="M13.8,8.8c0.3-0.2,0.5-0.5,0.5-0.8c0-0.3-0.2-0.6-0.5-0.8l-6-4
				C7.7,3.1,7.5,3,7.3,3c-0.6,0-1,0.5-1,1v8c0,0.6,0.4,1,1,1c0.2,0,0.4-0.1,0.5-0.2"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M3.6,13H2.4c-0.4,0-0.7-0.3-0.7-0.7V3.7C1.7,3.3,2,3,2.4,3h1.2
		C4,3,4.3,3.3,4.3,3.7v8.6C4.3,12.7,4,13,3.6,13z"/>
    </g>
);

export const prevFrame = ptIconWrapper(
    <g>
        <path fillRule="evenodd" clipRule="evenodd" d="M8.2,12.8C8.3,12.9,8.5,13,8.7,13c0.6,0,1-0.4,1-1V4c0-0.5-0.4-1-1-1
				C8.5,3,8.3,3.1,8.2,3.2l-6,4C1.9,7.4,1.7,7.7,1.7,8c0,0.4,0.2,0.6,0.5,0.8"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M12.4,13h1.2c0.4,0,0.7-0.3,0.7-0.7V3.7C14.3,3.3,14,3,13.6,3h-1.2
		c-0.4,0-0.7,0.3-0.7,0.7v8.6C11.7,12.7,12,13,12.4,13z"/>
    </g>
)
