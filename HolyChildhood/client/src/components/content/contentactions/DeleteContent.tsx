import React, {useContext} from 'react';
import RedFab from "../../common/buttons/RedFab";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import HCCDialog from "../../common/HCCDialog";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {PageContent} from "../../../models/PageContent";
import AppState from "../../../stores/AppState";

const styles = makeStyles(theme => ({
    icon: {
        marginRight: theme.spacing(1)
    },
    adminButton: {
        margin: theme.spacing(.5)
    }
}));

interface DeleteContentProps {
    pageContent: PageContent;
}

function DeleteContent(props: DeleteContentProps) {
    const classes = styles();
    const store = useContext(AppState);
    const { pageContent } = props;
    const { page } = store.domainStore.pageStore;
    const { deleteContent } = store.domainStore.contentStore;

    const [open, setOpen] = React.useState(false);

    const handleDelete = async () => {
        await deleteContent(page.id, pageContent.id);
        setOpen(false);
    }

    return (
        <span>
            <RedFab variant="extended" className={classes.adminButton} onClick={() => setOpen(true)}>
                <FontAwesomeIcon icon={'trash'} className={classes.icon} />Delete
            </RedFab>
            <HCCDialog
                open={open}
                size={'xs'}
                title={'Delete Content Confirmation'}
                content={
                    <Typography>
                        Are you sure you want to delete this content?
                    </Typography>
                }
                okAction={handleDelete}
                handleClose={() => setOpen(false)}
            />
        </span>
    );
}

export default DeleteContent;