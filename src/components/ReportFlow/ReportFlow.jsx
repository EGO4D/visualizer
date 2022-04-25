import React, { useState, useEffect } from 'react';
import { FormGroup, InputGroup, Button, Radio, RadioGroup, TextArea } from '@blueprintjs/core';
import { useMephistoReview } from '../../shims/mephisto-review-hook';
import { getHostname } from "../../utils";

export default function ReportFlow({ id, closeDialog }) {
    const [issue, setIssue] = useState();
    const [startTime, setStartTime] = useState();
    const [notes, setNotes] = useState();
    const [isFormDisabled, setIsFormDisabled] = useState(false);
    const [submitStage, setSubmitStage] = useState('Submit');

    const { submitFeedback } = useMephistoReview({ taskId: id, hostname: getHostname(), });

    const onSubmit = (e) => {
        if (issue && startTime && notes) {
            setIsFormDisabled(true);
            setSubmitStage('Sending...');
            submitFeedback({ issue_type: issue, start_time: startTime, notes: notes })
                .then((res) => {
                    setSubmitStage('Thanks!');
                    setTimeout(() => {
                        closeDialog();
                    }, 2000);
                }
                );
            // Send backend feedback api call and setSubmitStage('Thanks!') after
        }
    }

    return <form autocomplete="off">
        <FormGroup
            label="Issue Type"
            labelFor="radio"
            labelInfo="(required)">
            <RadioGroup
                onChange={(e) => setIssue(e.target.value)}
                selectedValue={issue}
                disabled={isFormDisabled}
            >
                <Radio label="Accuracy" value="Accuracy" />
                <Radio label="Integrity" value="Integrity" />
                <Radio label="Anonymization" value="Anonymization" />
                <Radio label="Other (please specify in notes)" value="Other" />
            </RadioGroup>
        </FormGroup>
        <FormGroup
            label="Start Time"
            labelFor="start_time-input"
            labelInfo="(required)">
            <InputGroup id="start_time-input" placeholder="When does this issue appear?" onChange={(e) => setStartTime(e.target.value)} disabled={isFormDisabled} autocomplete={false} />
        </FormGroup>
        <FormGroup
            label="Notes"
            labelFor="text-input"
            labelInfo="(required)">
            <TextArea id="text-input" placeholder="What's the issue? Anything else to tell us?" onChange={(e) => setNotes(e.target.value)} disabled={isFormDisabled} fill={true} growVertically={true} />
        </FormGroup>
        <Button className={`bp3-intent-${submitStage == 'Thanks!' ? 'success' : 'primary'}`} onClick={onSubmit}>{submitStage}</Button>
        <p style={{ margin: '20px 0 0 0' }}>This form is anonymous. If you'd like a response, please email <a href="mailto:privacy@ego4d-data.org">privacy@ego4d-data.org</a> directly.</p>
    </form>
}
