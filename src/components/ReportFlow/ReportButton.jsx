import React, { useState } from 'react'
import { Button, Dialog, PanelStack2, CLAS, Classes } from '@blueprintjs/core'

import "./ReportButton.scss"
import ReportFlow from './ReportFlow';

export default function ReportButton({ style }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return <>
        <Button icon={'shield'} intent="primary" text={"Report Video"} onClick={() => setIsDialogOpen(true)} style={{ ...style }} />
        <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} style={{ height: '80%' }}>
            <div className={Classes.DIALOG_BODY}>
                <ReportFlow closeDialog={() => setIsDialogOpen(false)} />
            </div>
        </Dialog>
    </>
}
