import React, { useState, useCallback } from 'react';
import { Button, Dialog, Classes, Tag } from '@blueprintjs/core';
import { useFilterlistDataStore } from '../../stores/UploadedDataStore';
import StyledDropzone from './StyledDropzone';
import "./FilterlistUploadButton.scss";

export default function FilterlistUploadButton() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const addData = useFilterlistDataStore(state => state.addData);
    const removeData = useFilterlistDataStore(state => state.removeData);
    const uploadedData = useFilterlistDataStore(state => state.data);

    const onDrop = useCallback(acceptedFiles => {
        acceptedFiles.map((file) => {
            const reader = new FileReader();
            reader.addEventListener('load', (event) => addData(file.name, event.target.result.split("\n")));
            reader.readAsText(file);
        })
    }, [])

    return <>
        <Button small icon={'upload'} text={'Filter by csv'} onClick={() => setIsDialogOpen(true)} style={{ margin: '0 10px', transform: 'translateY(-3px)' }} />
        <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} style={{ height: '80%' }}>
            <div className={Classes.DIALOG_BODY}>
                {/* Instructions */}
                <h1>Add a video_uid filter</h1>
                <p>Submit a newline-separated list of video_uids to filter by them</p>
                <b><i>Files are stored on your machine, nothing is uploaded online.</i></b>

                {/* Dropzone */}
                <StyledDropzone dropZoneProps={{ onDrop: onDrop, accepts: '.json' }} placeholder={<><p>Drop your filter files here or click to select them.</p></>} />

                {/* Already Uploaded Files */}
                <div>
                    <h3>Active Files</h3>
                    {
                        Object.keys(uploadedData).map(k => {
                            return <li className='uploaded-file-tag-li' key={k}><Tag onRemove={() => removeData(k)}>{k}</Tag></li>
                        })
                    }
                </div>
            </div>
        </Dialog>
    </>
}
