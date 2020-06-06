import React, {useContext} from 'react';
import HCCDialog from "../../common/HCCDialog";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AppState from "../../../stores/AppState";
import {Page} from "../../../models/Page";
import GreenFab from "../../common/buttons/GreenFab";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const style = makeStyles(theme => ({
    icon: {
        marginRight: theme.spacing(1)
    },
    adminButton: {
        margin: theme.spacing(.5)
    }
}));

interface AddContentProps {
    page: Page
}

function AddContent(props: AddContentProps) {
    const classes = style();
    const store = useContext(AppState);

    const { page } = props;

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <span>
            <GreenFab variant="extended" className={classes.adminButton} onClick={handleMenuOpen}>
                <FontAwesomeIcon icon={'plus'} className={classes.icon} />Add Content<FontAwesomeIcon icon={'caret-down'} style={{marginLeft: 8}} />
            </GreenFab>
            <Menu
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                anchorEl={anchorEl}
                open={anchorEl !== null}
                onClose={handleClose}
            >
                <MenuItem style={{width: 150}}>Text/HTML</MenuItem>
                <MenuItem style={{width: 150}}>Tabs</MenuItem>
                <MenuItem style={{width: 150}}>Calendar</MenuItem>
                <MenuItem style={{width: 150}}>PDF Viewer</MenuItem>
                <MenuItem style={{width: 150}}>Form</MenuItem>
            </Menu>
        </span>
    )
}

export default AddContent;
