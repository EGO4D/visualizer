import React from 'react'
import { Button } from '@blueprintjs/core'
import { nextFrame, prevFrame } from '../custom/CustomIcons'

import "./VideoControls.scss"


export default function VideoControls({ videoRef, progress }){
    return <div className="video-controls">
        <Button icon={prevFrame} onClick={() => videoRef?.current && videoRef.current.seekTo(progress -  (1 / 30.0), "seconds")} />
        <Button icon={nextFrame} onClick={() => videoRef?.current && videoRef.current.seekTo(progress +  (1 / 30.0), "seconds")} />
    </div>
}
