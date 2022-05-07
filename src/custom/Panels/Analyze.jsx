import React from "react";
import _ from "lodash";
import { ResponsiveBar, ResponsiveBarCanvas } from '@nivo/bar'
import { ResponsiveScatterPlot, ResponsiveScatterPlotCanvas } from '@nivo/scatterplot'
import { useNavigate, useSearchParams } from "react-router-dom";
import { benchmark_values, scenario_values, device_values, dimension_values } from "../../components/FilterBox/filterData";
import { getHostname } from "../../utils";

import "./Analyze.scss"

const videosMeasure = { key: 'videos', selector: (({ raw_videos }) => raw_videos.length) };
const hoursMeasure = { key: 'hours', selector: (({ raw_videos }) => Math.round(raw_videos.map((v) => (v['duration'] || 0) / 3600).reduce((s, a) => s + a, 0) * 100) / 100) }

// TODO: implement scatterplot configs

const barchart_configs = [
    // {
    //     index_name: 'total', index_values: ['total'], measures: [
    //         videosMeasure,
    //         hoursMeasure
    //     ], sort_key: [videosMeasure['key']], custom_filter: (() => true), chartArgs: { axisBottom: { legend: '' } }
    // },
    {
        index_name: 'benchmarks', index_values: benchmark_values, filter_zeroes: true, measures: [
            { key: 'train', selector: (({ raw_videos, val }) => Math.round(raw_videos.filter(x => x['splits'].includes(val + '-train')).reduce((s, a) => s + (a['duration'] || 0) / 3600, 0) * 100) / 100) },
            { key: 'val', selector: (({ raw_videos, val }) => Math.round(raw_videos.filter(x => x['splits'].includes(val + '-val')).reduce((s, a) => s + (a['duration'] || 0) / 3600, 0) * 100) / 100) },
            { key: 'test', selector: (({ raw_videos, val }) => Math.round(raw_videos.filter(x => x['splits'].includes(val + '-test')).reduce((s, a) => s + (a['duration'] || 0) / 3600, 0) * 100) / 100) },
        ], sort_key: ['train'], chartArgs: { groupMode: 'stacked', axisLeft: { legend: 'hours' } }
    },
    {
        index_name: 'device', index_values: device_values, filter_zeroes: true, measures: [
            videosMeasure,
            hoursMeasure,
        ], sort_key: [videosMeasure['key']]
    },
    // {
    //     index_name: 'dimensions', index_values: dimension_values, filter_zeroes: true, measures: [
    //         videosMeasure,
    //     ], sort_key: [videosMeasure['key']]
    // },
    {
        index_name: 'scenarios', index_values: scenario_values, filter_zeroes: true, measures: [
            videosMeasure,
            hoursMeasure,
        ], sort_key: [videosMeasure['key']]
    },
]


export default function Analyze({ filteredData, filterData }) {
    const navigate = useNavigate();
    const [searchParams,] = useSearchParams();

    const computed_barcharts = !!filteredData && barchart_configs.map(({ index_name, index_values, filter_zeroes, measures, sort_key, custom_filter, chartArgs }) => {
        let index_data = [];
        index_values.forEach(val => {
            let raw_videos = filteredData.filter((x) => !!custom_filter ? custom_filter({ item: x, val }) : !!x[index_name] && (x[index_name].constructor === Array ? x[index_name].includes(val) : x[index_name] === val));
            let data_obj = { [index_name]: val }
            measures.forEach(({ key, selector }) => {
                data_obj[key] = selector({ raw_videos, val })
            });
            filter_zeroes ? data_obj[sort_key] > 0 && index_data.push(data_obj) : index_data.push(data_obj);
        });
        return { index_name, chartArgs, keys: measures.map(m => m['key']), data: index_data.sort((a, b) => a[sort_key] < b[sort_key] ? 1 : -1) };
    })

    const bar_charts = computed_barcharts.map(({ index_name, keys, data, chartArgs = {} }, i) => {
        const ChartComponent = data.length > 20 ? ResponsiveBarCanvas : ResponsiveBar;
        const chartProps = _.merge({
            data,
            keys,
            indexBy: index_name,
            groupMode: 'grouped',
            margin: { top: 10, right: 100, bottom: data.length >= 10 ? 120 : 50, left: 100 },
            padding: 0.3,
            valueScale: { type: 'linear' },
            indexScale: { type: 'band', round: true },
            enableLabel: data.length < 10,
            labelTextColor: {
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        1.6
                    ]
                ]
            },
            axisBottom: {
                tickSize: 5,
                tickPadding: 5,
                tickRotation: data.length >= 10 ? -30 : 0,
                legend: index_name,
                legendPosition: 'middle',
                legendOffset: data.length >= 10 ? 105 : 40,
            },
            axisLeft: {
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'count',
                legendPosition: 'middle',
                legendOffset: -60,
            },
            legends:
                [
                    {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ],
        },
            chartArgs
        );

        return <div style={{ height: '250px', width: data.length > 20 ? '100%' : '50%', float: 'left' }} key={`bar-${i}`}>
            <ChartComponent {...chartProps} />
        </div>
    })

    let raw_videos = filteredData.filter((x) => !!x['_embeddings']['tsne']);
    let tagged_embs = []
    raw_videos.forEach(vid => {
        let vid_embs = vid['_embeddings']['tsne'];
        vid_embs = vid_embs.constructor === Array ? vid_embs : [vid_embs];
        let tagged_vid_embs = vid_embs.map(emb => { return { ...emb, 'video_uid': vid['video_uid'], 'img': vid['_img'], 'category': vid['scenarios'][0] } })
        tagged_embs = [...tagged_embs, ...tagged_vid_embs];
    });

    let grouped_emb_data = _.groupBy(tagged_embs, 'category');
    let emb_data = Object.keys(grouped_emb_data).map(k => { return { 'id': k, 'data': grouped_emb_data[k] } });
    let emb_length = emb_data.map(({ data }) => data.length).reduce((s, a) => s + a, 0);

    let ScatterComponent = emb_length <= 100 ? ResponsiveScatterPlot : ResponsiveScatterPlotCanvas;
    let scatterplots =
        <div style={{ height: '50vh', width: '50%', float: 'left' }}>
            <ScatterComponent
                data={emb_data}
                animate={false}
                margin={{ top: 30, right: 200, bottom: 30, left: 60 }}
                xScale={{ type: 'linear', min: '-300', max: '300' }}
                xFormat=">-.2f"
                yScale={{ type: 'linear', min: '-175', max: '175' }}
                yFormat=">-.2f"
                blendMode="multiply"
                nodeSize={8}
                colors={{ scheme: 'spectral' }}
                tooltip={({ node }) =>
                    <div className='video-toolip' style={{ width: '250px', height: '150px' }}>
                        <img
                            src={getHostname() + node.data.img}
                            alt={node.data.video_uid}
                            style={{ width: "100%", height: "100%", 'objectFit': 'cover', margin: 0 }}
                        />
                        <p className='video-tooltip-category'>{node.data.category}</p>
                    </div>
                }
                onClick={(node, e) => (e.ctrlKey || e.metaKey) ? window.open(`${getHostname()}/${node.data.video_uid}`) : navigate(`/${node.data.video_uid}?${searchParams.toString()}`)}
                axisTop={{
                    orient: 'top',
                    tickValues: [],
                    legend: 'SlowFast Feature T-SNE Embeddings',
                    legendPosition: 'middle',
                    legendOffset: -20
                }}
                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 130,
                        translateY: 0,
                        itemWidth: 100,
                        itemHeight: 12,
                        itemsSpacing: 5,
                        itemDirection: 'left-to-right',
                        symbolSize: 12,
                        symbolShape: 'circle',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
            />
        </div>

    return <div style={{ flexWrap: 'wrap', width: '100vw'}}>
        {scatterplots}
        {bar_charts}
    </div>
}
