import React, { useState } from 'react'
import { Button, ControlGroup, FormGroup, InputGroup, NumericInput } from '@blueprintjs/core'
import { nextFrame, prevFrame } from '../custom/CustomIcons'

import "./VideoControls.scss"


export default function VideoControls({ videoRef, progress }) {
    const [targetFrame, setTargetFrame] = useState('');
    const [targetTime, setTargetTime] = useState('');

    const seekToFrame = (frame) => {
        videoRef?.current && videoRef.current.seekTo(frame / 30.0 + 1 / 60.0, 'seconds');
        setTargetFrame('');
    }

    const parseTimeStamp = (timestamp) => {
        let splits = timestamp.split(':');
        let sum = 0;
        splits.reverse().forEach((time, index) => sum += parseFloat(time) * 60.0 ** index);
        return sum;
    }

    const seekToTime = (time) => {
        videoRef?.current && videoRef.current.seekTo(parseTimeStamp(time), 'seconds');
        setTargetTime('');
    }

    return <div className="video-controls">
        <Button icon={prevFrame} onClick={() => videoRef?.current && videoRef.current.seekTo(progress - (1 / 30.0), 'seconds')} />
        <Button icon={nextFrame} onClick={() => videoRef?.current && videoRef.current.seekTo(progress + (1 / 30.0), 'seconds')} />
        <ControlGroup>
            <InputGroup
                className='video-controls-target-frame'
                placeholder='frame'
                value={targetFrame}
                onChange={e => setTargetFrame(e.target.value)}
                onKeyDown={e => e.key == 'Enter' && seekToFrame(e.target.value)}
            />
            <Button icon='arrow-right' onClick={() => targetFrame !== '' && seekToFrame(targetFrame)} />
        </ControlGroup>

        <ControlGroup>
            <InputGroup
                className='video-controls-target-timestamp'
                placeholder='timestamp'
                value={targetTime}
                onChange={e => setTargetTime(e.target.value)}
                onKeyDown={e => e.key == 'Enter' && seekToTime(e.target.value)}
            />
            <Button icon='arrow-right' onClick={() => targetTime !== '' && seekToTime(targetTime)} />
        </ControlGroup>
        {/* <ReportButton style ={{ marginLeft: 'auto' }}/> */}
    </div>
}
