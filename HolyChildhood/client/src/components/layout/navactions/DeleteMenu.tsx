import React, {useContext} from 'react';
import AppState from "../../../stores/AppState";
import HCCDialog from "../../common/HCCDialog";
import {Menu} from "../../../models/Menu";

interface DeleteMenuProps {
    open: boolean,
    menu: Menu,
    handleClose(): void,
}

function DeleteMenu(props: DeleteMenuProps) {
    const store = useContext(AppState);

    const { deleteMenu } = store.domainStore.navStore;
    const { open, menu, handleClose } = props;

    const handleDeleteMenu = async () => {
        await deleteMenu(menu.id);
        handleClose();
    };

    return (
        <HCCDialog
            open={open}
            size={'xs'}
            title={'Delete Menu?'}
            content={'Are you sure you want to delete this menu?'}
            okAction={handleDeleteMenu}
            handleClose={handleClose}
        />
    );
}

export default DeleteMenu;
