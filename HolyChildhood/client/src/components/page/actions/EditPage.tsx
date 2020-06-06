import React, {useContext} from 'react';
import HCCDialog from "../../common/HCCDialog";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AppState from "../../../stores/AppState";
import {Page} from "../../../models/Page";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import BlueFab from "../../common/buttons/BlueFab";
import TextField from "@material-ui/core/TextField";

const style = makeStyles(theme => ({
    icon: {
        marginRight: theme.spacing(1)
    },
    adminButton: {
        margin: theme.spacing(.5)
    }
}));

interface EditPageProps {
    page: Page
}

function EditPage(props: EditPageProps) {
    const classes = style();
    const store = useContext(AppState);

    const { page } = props;
    const { updatePage } = store.domainStore.pageStore;

    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState(page.title);

    const handleUpdatePage = async () => {
        page.title = title;
        await updatePage(page);
        setOpen(false);
    };

    return (
        <span>
            <BlueFab variant="extended" className={classes.adminButton} onClick={() => setOpen(true)}>
                <FontAwesomeIcon icon={'pencil-alt'} className={classes.icon} />Edit Page
            </BlueFab>
            <HCCDialog
                open={open}
                size={'xs'}
                title={'Edit Page'}
                content={
                    <TextField autoFocus value={title} label={"Page Title"} onChange={(event) => setTitle(event.target.value)} fullWidth />
                }
                okAction={handleUpdatePage}
                handleClose={() => setOpen(false)}
            />
        </span>
    )
}

export default EditPage;
