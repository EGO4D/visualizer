import React, { useMemo, useState, useEffect } from "react"
import "./TimeSegmentChart.scss"

// nivo default color scheme
const COLORS = ['#e8c1a0', '#f47560', '#f1e15b', '#e8a838', '#61cdbb', '#97e3d5'];

export default function TimeSegmentChart({ data, seeker_position, videoRef, setPlaying, min, max }) {
    const [activeSegment, setActiveSegment] = useState(null);

    const { data_min, data_max, tracks } = useMemo(() => {
        const sortedData = [...data].sort((a, b) => a.start - b.start);

        const data_max = Math.max(...sortedData.map(({end}) => end));
        const data_min = Math.min(...sortedData.map(({start}) => start));

        // Distribute the items on tracks and greedily minimize overlap
        const tracks = []
        const labelFills = {}
        sortedData.forEach((datum, i) => {
            const {start, end, label} = datum
            let myTrack = tracks.find(track => start >= track.max);
            if(!myTrack){
                myTrack = {segments: [], max: 0};
                tracks.push(myTrack);
            }
            if(!labelFills[label]){
                labelFills[label] = COLORS[Object.keys(labelFills).length % COLORS.length];
            }
            const newItem = {...datum, fill: labelFills[label], key: i};
            myTrack.segments.push(newItem);
            myTrack.max = end;
        });

        return {data_min, data_max, tracks}
    }, [data]);

    max = max ?? data_max;
    min = min ?? data_min;
    const range = max-min || 0.000000000001; // TODO: replace this magic number

    const onSegmentClick = (start, e) => {
        e.stopPropagation();
        videoRef?.current &&
            videoRef.current.seekTo(start, "seconds");
        // !!setPlaying && setPlaying(true);
    }

    const useMousePosition = () => {
        const [position, setPosition] = useState({
          clientX: 0,
          clientY: 0,
        });

        const updatePosition = event => {
          const { pageX, pageY, clientX, clientY } = event;

          setPosition({
            clientX,
            clientY,
          });
        };

        useEffect(() => {
          document.addEventListener("mousemove", updatePosition, false);
          document.addEventListener("mouseenter", updatePosition, false);

          return () => {
            document.removeEventListener("mousemove", updatePosition);
            document.removeEventListener("mouseenter", updatePosition);
          };
        }, []);

        return position;
      };

    const { clientX, clientY } = useMousePosition();

    const bordersAndAxes = useMemo(() => {
        return <>
            <rect x={0} y={0} width='100%' height='100%' fill='transparent' style={{stroke: 'rgb(230, 230, 230)', strokeWidth: 3, pointerEvents: 'none'}}/>
            {
                [...Array(10).keys()].map((i) => {
                    return <svg x={`${10*i}%`} style={{overflow: 'visible'}} key={i}>
                        <rect  width={1} height={85} fill='rgb(230, 230, 230)'/>
                        <text x={0} y={97} textAnchor='middle' style={{fill: 'rgb(230, 230, 230)', pointerEvents:'none', fontSize:'0.8vw'}}>
                            {Math.round((range/10)*i + min)}s
                        </text>
                    </svg>
                })
            }
        </>
    }, [data, min, max])

    const segments = useMemo(() => {
        return <svg y={'10px'} height="80px" className={!!activeSegment ? 'focus-mode' : ''}>
            {
                tracks.map(({segments}, i) =>
                    segments.map(({start, end, label, fill, key}) =>
                        <rect
                            x={`${(start-min)/range * 100}%`}
                            y={`${i * (100 / tracks.length)}%`}
                            width={`${(end-start) / range * 100}%`}
                            height={`${90 / tracks.length}%`}
                            fill={fill}
                            key={key}
                            className={activeSegment?.key === key ? 'active' : ''}
                            onMouseEnter={() => setActiveSegment({start, end, label, fill, key})}
                            onMouseLeave={()=> activeSegment?.key === key && setActiveSegment(null)}
                            onClick={onSegmentClick.bind(this, start)}
                            onKeyDown={(e) => e.key === 'Enter' && onSegmentClick.bind(this, start)}
                            role='button'
                            tabIndex={-1}
                        />
                    )
                )
            }
        </svg>
    }, [data, activeSegment, min, range]);

    return <div>
        <svg width="100%" height="100px">

            {/* Border and Axis Markers */}
            { bordersAndAxes }

            {/* Segments */}
            { segments }

            {/* Seeker */}
            <svg x={`${(seeker_position-min)/range * 100}%`} style={{overflow:'visible', opacity:0.8, pointerEvents:'none'}}>
                <polygon points="0,10 -5,5 -5,0 5,0 5,5" fill="black"/>
                <rect  x={-0.5} width={1} height='100%' fill='black'/>
                <rect  x={-0.25} y={5} width={0.5} height='4' fill='white'/>
            </svg>
        </svg>

        {/* Hover Tooltips */}
        {
            !!activeSegment &&
            <div className='chart-tooltip' style={{position: 'fixed', top: 0, left: 0, maxWidth: '50%', transform:`translateX(${clientX-20}px) translateY(${clientY-35}px)`, pointerEvents: 'none'}}>
                <b>{activeSegment.label}</b> [{Math.round(activeSegment.start)}s - {Math.round(activeSegment.end)}s]
            </div>
        }
    </div>
}
