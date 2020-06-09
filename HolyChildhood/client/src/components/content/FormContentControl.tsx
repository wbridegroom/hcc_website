import React from 'react';
import {PageContent} from "../../models/PageContent";
import ContentAdminPanel from "./ContentAdminPanel";

interface FormContentControlProps {
    pageContent: PageContent;
}

function FormContentControl(props: FormContentControlProps) {
    const { pageContent } = props;

    return(
        <div>
            "Form Control"
            <ContentAdminPanel pageContent={pageContent} />
        </div>
    )
}

export default FormContentControl;
