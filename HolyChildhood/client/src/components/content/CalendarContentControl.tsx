import React from 'react';
import {PageContent} from "../../models/PageContent";
import ContentAdminPanel from "./ContentAdminPanel";

interface CalendarContentControlProps {
    pageContent: PageContent
}

function CalendarContentControl(props: CalendarContentControlProps) {
    const { pageContent } = props;

    return(
        <div>
            "Calendar Control"
            <ContentAdminPanel pageContent={pageContent} />
        </div>
    )
}

export default CalendarContentControl;
