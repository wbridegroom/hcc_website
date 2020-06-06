import React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import DeletePage from "./actions/DeletePage";
import {Page} from "../../models/Page";
import AddContent from "./actions/AddContent";
import EditPage from "./actions/EditPage";
import AddSubPage from "./actions/AddSubPage";

const style = makeStyles(theme => ({
    adminPanel: {
        backgroundImage: 'repeating-linear-gradient(45deg, #d3d3d3, #d3d3d3 10px, #c4bfbf 10px, #c4bfbf 20px)',
        padding: theme.spacing(.5)
    },
    icon: {
        marginRight: theme.spacing(1)
    },
    adminButton: {
        margin: theme.spacing(.5)
    }
}));

interface PageAdminPanelProps {
    page: Page
}

function PageAdminPanel(props: PageAdminPanelProps) {
    const classes = style();

    const { page } = props;

    return (
        <div className={classes.adminPanel}>
            <AddContent page={page} />
            <EditPage page={page} />
            <DeletePage page={page} />
            {page.parent === null &&
                <AddSubPage page={page}/>
            }
        </div>
    )
}

export default PageAdminPanel;
