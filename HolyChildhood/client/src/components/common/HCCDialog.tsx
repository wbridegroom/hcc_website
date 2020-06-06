import React from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const style = makeStyles(theme => ({
    content: {
        marginBottom: '20px'
    },
    icon: {
        marginRight: theme.spacing(1),
        fontSize: 20,
    },
    actions: {
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    button: {
        fontWeight: 600
    }
}));

const HCCDialog: React.FC<{open: boolean, size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false, title: string, content: any, okAction: any, handleClose: any}> =
        ({open, size, title, content, okAction, handleClose}) => {

    const classes = style();

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={open}
            maxWidth={size}
            fullWidth
            onClose={handleClose}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent className={classes.content}>{content}</DialogContent>
            <DialogActions className={classes.actions}>
                <Button onClick={handleClose} color="primary" size="small" className={classes.button}>
                    <FontAwesomeIcon icon={'ban'} className={classes.icon} /> Cancel
                </Button>
                <Button onClick={okAction} color="primary" variant="contained" size="small" className={classes.button}>
                    <FontAwesomeIcon icon={'check'} className={classes.icon} /> Ok
                </Button>
            </DialogActions>
        </Dialog>
    )
};

export default HCCDialog;
