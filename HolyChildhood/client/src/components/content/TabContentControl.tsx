import React from 'react';
import {PageContent} from "../../models/PageContent";
import ContentAdminPanel from "./ContentAdminPanel";

interface TabContentControlProps {
    pageContent: PageContent;
}

function TabContentControl(props: TabContentControlProps) {
    const { pageContent } = props;

    return(
        <div>
            "Tab Control"
            <ContentAdminPanel pageContent={pageContent} />
        </div>
    )
}

export default TabContentControl;
