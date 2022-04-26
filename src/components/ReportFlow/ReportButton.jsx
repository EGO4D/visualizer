import React, { useState } from 'react'
import { Button, Dialog, PanelStack2, CLAS, Classes } from '@blueprintjs/core'

import "./ReportButton.scss"
import ReportFlow from './ReportFlow';

export default function ReportButton({ id, style }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return <>
        <Button id={'report-button'} icon={'shield'} intent='none' text={'Report'} onClick={() => setIsDialogOpen(true)} style={{ ...style }} />
        <Dialog title={'Report Issue'} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} style={{ height: '80%' }}>
            <div className={Classes.DIALOG_BODY}>
                <ReportFlow id={id} closeDialog={() => setIsDialogOpen(false)} />
            </div>
        </Dialog>
    </>
}
