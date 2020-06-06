import React, {useContext} from 'react';
import HCCDialog from "../../common/HCCDialog";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import RedFab from "../../common/buttons/RedFab";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AppState from "../../../stores/AppState";
import {Page} from "../../../models/Page";
import Typography from "@material-ui/core/Typography";
import {Redirect} from "react-router-dom";

const style = makeStyles(theme => ({
    icon: {
        marginRight: theme.spacing(1)
    },
    adminButton: {
        margin: theme.spacing(.5)
    }
}));

interface DeletePageProps {
    page: Page
}

function DeletePage(props: DeletePageProps) {
    const classes = style();
    const store = useContext(AppState);  

    const { page } = props;
    const { deletePage } = store.domainStore.pageStore;

    const [open, setOpen] = React.useState(false);
    const [deleted, setDeleted] = React.useState(false);

    const handleDelete = async () => {
        await deletePage(page);
        setOpen(false);
        setDeleted(true);
    }

    if (deleted) {
        console.log('Deleted');
        setDeleted(false);
        if (page.parent !== null) {
            return <Redirect to={`/page/${page.parent.id}`} />
        }
        return <Redirect to={'/home'} />
    }

    return (
        <span>
            <RedFab variant="extended" className={classes.adminButton} onClick={() => setOpen(true)}>
                <FontAwesomeIcon icon={'trash'} className={classes.icon} />Delete Page
            </RedFab>
            <HCCDialog
                open={open}
                size={'xs'}
                title={'Delete Page Confirmation'}
                content={
                    <Typography>
                        Are you sure you want to delete page: <b>{page.title}</b>?
                    </Typography>
                }
                okAction={handleDelete}
                handleClose={() => setOpen(false)}
            />
        </span>
    )
}

export default DeletePage;
