import React, { useState, useCallback } from 'react';
import { Button, Dialog, Classes, Collapse, Tag } from '@blueprintjs/core';
import { useUploadedDataStore } from '../../stores/UploadedDataStore';
import "./PredictionsUploadButton.scss";
import StyledDropzone from './StyledDropzone';

const TYPES = {
    tracking_path: {
        _type: '\'tracking_path\'',
        frames: [{
            video_frame: {
                _type: '\'video_frame\'',
                frame_number: 'int',
            },
            bounding_boxes: [{
                label: 'str',
                x: 'float',
                y: 'float',
                width: 'float',
                height: 'float',
            }]
        }]
    },

    time_segment: {
        _type: '\'time_segment\'',
        start_time: {
            _type: '\'video_time\'',
            video_time: 'int',
        },
        end_time: {
            _type: '\'video_time\'',
            video_time: 'int',
        },
        label: 'string',
    },

    labeled_frame: {
        _type: '\'labeled_frame\'',
        video_frame: {
            _type: '\'frame_number\'',
            frame_number: 'int',
        },
        label: 'string',
    },
};

export default function PredictionsUploadButton({ style }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dropdownStates, setDropdownState] = useState({});
    const addUploadedData = useUploadedDataStore(state => state.addData);
    const removeUploadedData = useUploadedDataStore(state => state.removeData);
    const uploadedData = useUploadedDataStore(state => state.uploadedData);
    const onDrop = useCallback(acceptedFiles => {
        acceptedFiles.map((file) => {
            const reader = new FileReader();
            reader.addEventListener('load', (event) => addUploadedData(file.name, JSON.parse(event.target.result)));
            reader.readAsText(file);
        })
    }, [])

    return <>
        <Button icon={'upload'} intent="primary" text={"Add Predictions"} onClick={() => setIsDialogOpen(true)} style={{ ...style }} />
        <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} style={{ height: '80%' }}>
            <div className={Classes.DIALOG_BODY}>
                {/* Instructions */}
                <h1>Add Predictions</h1>
                <p>To visualize your own predictions, format them into a <code>.json</code> with video_uid at the root directory. Tag visualizable objects with any of these types.
                    <br />Ensure the object matches its type schema (extra fields are okay).
                </p>
                <b><i>Predictions are stored on your machine, nothing is uploaded online.</i></b>
                <div style={{ marginBottom: '10px' }}>
                    {
                        Object.keys(TYPES).map(k =>
                            <div key={k}>
                                <Button onClick={() => setDropdownState({ dropdownStates, [k]: !dropdownStates[k] })} text={k} />
                                <Collapse isOpen={dropdownStates[k]}>
                                    <pre>
                                        {JSON.stringify(TYPES[k], null, 4).replace(/\"/g, "")}
                                    </pre>
                                </Collapse>
                            </div>
                        )
                    }
                </div>
                {/* Dropzone */}
                <StyledDropzone dropZoneProps={{ onDrop: onDrop, accepts: '.json' }} placeholder={<><p>Drop your prediction files here or click to select them.</p><em>(Only .json will be accepted)</em></>} />
                {/* Already Uploaded Prediction Files */}
                <div>
                    <h3>Active Uploads</h3>
                    {
                        Object.keys(uploadedData).map(k => {
                            return <li className='uploaded-file-tag-li' key={k}><Tag onRemove={() => removeUploadedData(k)}>{k}</Tag></li>
                        })
                    }
                </div>
            </div>
        </Dialog>
    </>
}
