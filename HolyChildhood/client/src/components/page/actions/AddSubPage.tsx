import React, {useContext} from 'react';
import HCCDialog from "../../common/HCCDialog";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AppState from "../../../stores/AppState";
import {Page} from "../../../models/Page";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import GreenFab from "../../common/buttons/GreenFab";
import TextField from "@material-ui/core/TextField";
import {Redirect} from "react-router-dom";

const style = makeStyles(theme => ({
    icon: {
        marginRight: theme.spacing(1)
    },
    adminButton: {
        margin: theme.spacing(.5)
    }
}));

interface AddSubPageProps {
    page: Page
}

function AddSubPage(props: AddSubPageProps) {
    const classes = style();
    const store = useContext(AppState);

    const { page } = props;
    const { addSubPage } = store.domainStore.pageStore;

    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState('');

    const handleAddSubPage = async () => {
        await addSubPage(page, title);
        setOpen(false);
    };

    return (
        <span>
            <GreenFab variant="extended" className={classes.adminButton} onClick={() => setOpen(true)}>
                <FontAwesomeIcon icon={'plus'} className={classes.icon} />Add Sub-Page
            </GreenFab>
            <HCCDialog
                open={open}
                size={'xs'}
                title={`${page.title}: Add Sub-Page`}
                content={
                    <TextField autoFocus value={title} label={"Page Title"} onChange={(event) => setTitle(event.target.value)} fullWidth />
                }
                okAction={handleAddSubPage}
                handleClose={() => setOpen(false)}
            />
        </span>
    )
}

export default AddSubPage;
