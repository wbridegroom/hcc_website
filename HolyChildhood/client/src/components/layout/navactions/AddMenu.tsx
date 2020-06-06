import React, {useContext} from 'react';
import AppState from "../../../stores/AppState";
import TextField from "@material-ui/core/TextField";
import HCCDialog from "../../common/HCCDialog";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import GreenFab from "../../common/buttons/GreenFab";


function AddMenu() {
    const store = useContext(AppState);

    const { addMenu } = store.domainStore.navStore;
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');

    function close() {
        setName('');
        setOpen(false);
    }

    const handleAddMenu = async () => {
        await addMenu(name);
        close();
    };

    return (
        <div>
            <GreenFab variant="extended" onClick={() => setOpen(true)}>
                <FontAwesomeIcon icon={'plus'} />&nbsp;Add Menu
            </GreenFab>
            <HCCDialog
                open={open}
                size={"xs"}
                title={"Add Menu"}
                content={
                    <TextField
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        label={"Menu Name"}
                        fullWidth
                    />
                }
                okAction={handleAddMenu}
                handleClose={close}
            />
        </div>
    )
}

export default AddMenu;
