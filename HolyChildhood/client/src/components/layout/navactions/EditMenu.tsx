import React, {useContext} from 'react';
import {observer} from "mobx-react";
import TextField from "@material-ui/core/TextField";
import AppState from "../../../stores/AppState";
import HCCDialog from "../../common/HCCDialog";
import {Menu} from "../../../models/Menu";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Page} from "../../../models/Page";
import Typography from "@material-ui/core/Typography";
import {Paper} from "@material-ui/core";


interface EditMenuProps {
    open: boolean,
    menu: Menu,
    handleClose(): void,
}

function EditMenu(props: EditMenuProps) {
    const store = useContext(AppState);

    const { open, menu, handleClose } = props;
    const { saveMenu } = store.domainStore.navStore;


    const [name, setName] = React.useState(menu.name);
    const [selected, setSelected] = React.useState<null | Page>(null);

    const handleUpdateMenu = async () => {
        await saveMenu(menu);
        handleClose();
    };

    function select(page: Page) {
        setSelected(selected !== null && selected.id === page.id ? null : page);
    }

    function isChecked(page: Page) {
        return selected !== null && selected.id === page.id;
    }

    function moveTop() {
        const pages = menu.pages;
        if (selected === null) return;

        pages.splice(selected.index, 1);
        pages.unshift(selected);

        updateIndexes(pages);
    }

    function moveUp() {
        const pages = menu.pages;
        if (selected === null) return;

        const index = selected.index;
        const prevPage = pages[index - 1];
        menu.pages[index - 1] = selected;
        menu.pages[index] = prevPage;

        updateIndexes(pages);
    }

    function moveDown() {
        const pages = menu.pages;
        if (selected === null) return;

        const index = selected.index;
        const nextPage = pages[index + 1];
        menu.pages[index + 1] = selected;
        menu.pages[index] = nextPage;
        updateIndexes(pages);
    }

    function moveBottom() {
        const pages = menu.pages;
        if (selected === null) return;

        pages.splice(selected.index, 1);
        pages.push(selected);
        updateIndexes(pages);
    }

    function updateIndexes(pages: Page[]) {
        for (let i = 0; i < pages.length; i++) {
            pages[i].index = i;
        }
    }

    return (
        <HCCDialog
            open={open}
            size={"xs"}
            title={"Edit Menu"}
            content={
                <div>
                    <TextField
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        label={"Menu Name"}
                        fullWidth
                    />
                    { menu.pages.length > 1 &&
                        <div>
                            <Typography variant="subtitle1" style={{ marginTop: 8 }}>
                                Page Order
                            </Typography>
                            <Grid container direction='row' justify='flex-start'>
                                <Grid item style={{ width: 250, marginRight: 30}}>
                                    <Paper elevation={2} style={{ height: 250, overflowY: "scroll" }}>
                                        <List dense>
                                            {menu.pages.map(page => (
                                                <ListItem key={page.id} button selected={isChecked(page)} onClick={() => select(page)}>
                                                    <ListItemText>{page.title}</ListItemText>
                                                </ListItem>
                                            ))}

                                        </List>
                                    </Paper>
                                </Grid>
                                <Grid item>
                                    <Grid container direction='column' justify='center' alignItems='flex-start' spacing={1} style={{height: '100%'}}>
                                        <Grid item>
                                            <Fab color='primary' size='small' disabled={selected === null || selected.index === 0} onClick={moveTop}>
                                                <FontAwesomeIcon icon={'chevron-double-up'} />
                                            </Fab>
                                        </Grid>
                                        <Grid item>
                                            <Fab color='primary' size='small' disabled={selected === null || selected.index === 0} onClick={moveUp}>
                                                <FontAwesomeIcon icon={'chevron-up'} />
                                            </Fab>
                                        </Grid>
                                        <Grid item>
                                            <Fab color='primary' size='small' disabled={selected === null || selected.index === menu.pages.length - 1} onClick={moveDown}>
                                                <FontAwesomeIcon icon={'chevron-down'} />
                                            </Fab>
                                        </Grid>
                                        <Grid item>
                                            <Fab color='primary' size='small' disabled={selected === null || selected.index === menu.pages.length - 1} onClick={moveBottom}>
                                                <FontAwesomeIcon icon={'chevron-double-down'} />
                                            </Fab>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    }
                </div>
            }
            okAction={handleUpdateMenu}
            handleClose={handleClose}
        />
    )
}

export default observer(EditMenu);
