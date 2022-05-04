import React, { useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core'
import "./Footer.scss"

export default function Footer() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return <>
        <div class="footer">
            <div class="inner_footer">
                <div class="logo_container">
                    <a href="https://ego4d-data.org/">
                        <img src={"/static/ego-4d-logo-white.png"} alt="ego4d logo" />
                    </a>
                </div>

                <div class="footer_third">
                    <h1>Docs</h1>
                    <a href="https://ego4d-data.org/docs/">Intro</a>
                    <a href="https://ego4d-data.org/docs/data/annotation-guidelines/">Annotation Guidelines</a>
                    <a href="https://ego4d-data.org/docs/challenge/">Ego4D Challenges</a>
                    <a href="https://ego4d-data.org/docs/contact/">Contact Us</a>
                </div>

                <div class="footer_third">
                    <h1>More</h1>
                    <a href="https://discuss.ego4d-data.org/">Discussion Board</a>
                    <a href="https://github.com/Ego4d">Github</a>
                    <a href="https://ego4d-data.org/">Ego4D Main Site</a>
                    <button onClick={(e) => { e.stopPropagation(); setIsDialogOpen(true); }} href="#">Privacy Issues</button>
                </div>

            </div>
        </div>

        <Dialog title={'Privacy Issues'} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} style={{ height: '80%' }}>
            <div className={Classes.DIALOG_BODY}>
                Ego4D is led by an international consortium of 13 universities in partnership with FAIR, which collaborated to advance egocentric perception. Ego4D university partners specifically collected all of the data shown via this visualization tool.  Should any researcher, participant or data user encounter clips that they believe have been insufficiently redacted, or for any other privacy concerns, please contact the university consortium immediately at <a href="mailto:privacy@ego4d-data.org">privacy@ego4d-data.org</a>. Please reference <a href="https://arxiv.org/abs/2110.07058">“Ego4D: Around the World in 3,000 Hours of Egocentric Video”</a> for detailed information about our de-identification process, standards, and collection efforts. Additionally, please refer to <a href="https://ego4d-data.org/pdfs/Ego4D-Privacy-and-ethics-consortium-statement.pdf">the statement by members of the university consortium on issues of privacy and ethics</a> for further details.
            </div>
        </Dialog>
    </>
}
