import React, {useContext} from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import BlueFab from "../common/buttons/BlueFab";
import GreenFab from "../common/buttons/GreenFab";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import AppState from "../../stores/AppState";
import {PageContent} from "../../models/PageContent";
import {Fab} from "@material-ui/core";
import DeleteContent from "./contentactions/DeleteContent";
import YellowFab from "../common/buttons/YellowFab";
import { observer } from 'mobx-react';

const styles = makeStyles(theme => ({
    adminPanel: {
        backgroundImage: 'repeating-linear-gradient(45deg, #d3d3d3, #d3d3d3 10px, #c4bfbf 10px, #c4bfbf 20px)',
        padding: theme.spacing(.5)
    },
    icon: {
        marginRight: theme.spacing(1)
    },
    adminButton: {
        margin: theme.spacing(.25)
    },
    fab: {
        margin: theme.spacing(.25),
        height: 26,
        textTransform: "none"
    }
}));

interface ContentAdminPanelProps {
    showEdit?: boolean;
    isEdit?: boolean;
    onEdit?: () => void;
    onSave?: () => void;
    onCancelEdit?: () => void;
    pageContent?: PageContent;
}

function ContentAdminPanel(props: ContentAdminPanelProps) {
    const classes = styles();
    const { showEdit, pageContent, onEdit, onSave, onCancelEdit, isEdit } = props;

    const store = useContext(AppState);
    const { page } = store.domainStore.pageStore;
    const { edit, isAdministrator, isEditor } = store.domainStore.authStore;
    const { moveContentUp, moveContentDown } = store.domainStore.contentStore;

    const showMove = pageContent && page.pageContents.length > 1;
    const showMoveUp = showMove && pageContent && pageContent.index > 0;
    const showMoveDown = showMove && pageContent && pageContent.index < page.pageContents.length - 1;

    const handleMoveUp = async () => {
        if (pageContent) {
            await moveContentUp(page.id, pageContent.id);
        }
    }

    const handleMoveDown = async () => {
        if (pageContent) {
            await moveContentDown(page.id, pageContent.id);
        }
    }

    return (
        <div>
            {edit && (isAdministrator || isEditor) &&
                <div className={classes.adminPanel}>
                    {showEdit && isEdit &&
                        <GreenFab variant="extended" className={classes.adminButton} onClick={onSave}>
                            <FontAwesomeIcon icon={'save'} className={classes.icon} /> Save
                        </GreenFab>
                    }
                    {showEdit && !isEdit &&
                        <BlueFab variant="extended" className={classes.adminButton} onClick={onEdit}>
                            <FontAwesomeIcon icon={'pencil-alt'} className={classes.icon} /> Edit
                        </BlueFab>
                    }
                    {pageContent &&
                        <span>
                            {!isEdit &&
                                <DeleteContent pageContent={pageContent} />
                            }
                            {isEdit &&
                                <YellowFab variant="extended" className={classes.adminButton} onClick={onCancelEdit}>
                                    <FontAwesomeIcon icon={ 'ban' } className={classes.icon} /> Cancel
                                </YellowFab>
                            }

                            {showMoveUp &&
                                <Fab variant="extended" className={classes.fab} onClick={handleMoveUp}>
                                    <FontAwesomeIcon icon={'arrow-up'} className={classes.icon} /> Move Up
                                </Fab>
                            }
                            { showMoveDown &&
                                <Fab variant="extended" className={classes.fab} onClick={handleMoveDown}>
                                    <FontAwesomeIcon icon={'arrow-down'} className={classes.icon} /> Move Down
                                </Fab>
                            }
                        </span>
                    }
                </div>
            }
        </div>
    );
}

export default observer(ContentAdminPanel);