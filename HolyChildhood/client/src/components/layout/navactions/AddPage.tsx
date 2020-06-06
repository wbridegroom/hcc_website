import React, {useContext} from 'react';
import {Redirect} from 'react-router-dom';
import TextField from "@material-ui/core/TextField";
import HCCDialog from "../../common/HCCDialog";
import {Menu} from "../../../models/Menu";
import AppState from "../../../stores/AppState";
import {Page} from "../../../models/Page";

interface AddPageProps {
    open: boolean,
    menu: Menu,
    handleClose(): void
}


function AddPage(props: AddPageProps) {
    const store = useContext(AppState);

    const { open, menu, handleClose } = props;
    const [title, setTitle] = React.useState('');
    const [page, setPage] = React.useState<null | Page>(null);
    const { addPage } = store.domainStore.pageStore;

    function close() {
        setTitle('');
        handleClose();
    }

    const handleAddPage = async () => {
        const page = await addPage(title, menu);
        close();
        setPage(page);
    };

    if (page) {
        return <Redirect to={`/page/${page.id}`} />
    }

    return (
        <HCCDialog
            open={open}
            size={'xs'}
            title={'Add Page'}
            content={
                <TextField autoFocus value={title} label={"Page Title"} onChange={(event) => setTitle(event.target.value)} fullWidth />
            }
            okAction={handleAddPage}
            handleClose={close}
        />
    )
}

export default AddPage;
