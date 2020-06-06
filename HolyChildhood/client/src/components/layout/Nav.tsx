import React, {useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import makeStyles from '@material-ui/core/styles/makeStyles';
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu, {MenuProps} from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from '@material-ui/core/Toolbar';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import MenuIcon from '@material-ui/icons/Menu';
import AppState from "../../stores/AppState";
import {observer} from "mobx-react";
import Divider from "@material-ui/core/Divider";
import Switch from "@material-ui/core/Switch";
import AddPage from "./navactions/AddPage";
import AddMenu from "./navactions/AddMenu";
import DeleteMenu from "./navactions/DeleteMenu";
import EditMenu from "./navactions/EditMenu";

const style = makeStyles(theme => ({
    toolbar: {
        minHeight: '48px',
    },
    buttonContainer: {
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    },
    menuContainer: {
        [theme.breakpoints.up('md')]: {
            display: 'none'
        }
    },
    button: {
        fontSize: "18px",
        fontWeight: 600,
        color: "white",
        textTransform: 'none',
        fontFamily: 'inherit',
        '&:hover': {
            color: "gold",
            backgroundColor: theme.palette.primary.main
        }
    },
    menuItem: {
        fontSize: "16px",
        fontFamily: 'inherit',
        fontWeight: 550,
        '&:hover': {
            color: "gold",
            backgroundColor: theme.palette.primary.dark
        },
        padding: "4px 24px",
    },
    icon: {
        marginRight: theme.spacing(1)
    },
    divider: {
        backgroundColor: 'white',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    }
}));

interface Menu {
    id: number,
    name: string,
    pages: Array<Page>
}

interface Page {
    id: number,
    title: string,
    index: number
}

const NavMenu = withStyles(theme => ({
    paper: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText
    }
}))((props: MenuProps) => (
    <Menu
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        {...props}
    />
));

function Nav() {
    const classes = style();
    const store = useContext(AppState);

    const { menus, loadMenu } = store.domainStore.navStore;
    const { selectedMenu, setSelectedMenu } = store.uiState;

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [open, setOpen] = React.useState('');

    const { auth, logout, edit, setEdit, isAdministrator, isEditor } = store.domainStore.authStore;

    useEffect(() => {loadMenu().finally()},[loadMenu]);

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        logout();
    };

    function openDialog(dialogName: string, menu: any) {
        setSelectedMenu(JSON.parse(JSON.stringify(menu)));
        setOpen(dialogName);
        handleClose();
    }

    function closeDialog() {
        setSelectedMenu(null);
        setOpen('');
    }

    return (
        <AppBar position="static">
            <div className={classes.buttonContainer}>
                <Toolbar className={classes.toolbar}>
                    <Button component={Link} to="/home" className={classes.button}>
                        <FontAwesomeIcon icon={'home'} />&nbsp;Home
                    </Button>
                    {menus.map(menu => (
                        <div key={menu.id}>
                            <Button id={menu.name} onClick={handleMenuOpen} className={classes.button}>
                                {menu.name}
                                <ArrowDropDown />
                            </Button>

                            <NavMenu
                                anchorEl={anchorEl}
                                open={anchorEl !== null && anchorEl.id === menu.name}
                                onClose={handleClose}
                            >
                                {menu.pages.map(page => (
                                    <MenuItem
                                        key={page.id}
                                        component={Link}
                                        to={`/page/${page.id}`}
                                        onClick={handleClose}
                                        className={classes.menuItem}
                                    >
                                        {page.title}
                                    </MenuItem>
                                ))}
                                {isAdministrator && edit &&
                                    <div>
                                        <Divider light className={classes.divider} />
                                        <MenuItem className={classes.menuItem} onClick={() => openDialog('addpage', menu)}>
                                            <FontAwesomeIcon icon={'plus'} className={classes.icon} /><i>Add Page...</i>
                                        </MenuItem>
                                        <MenuItem className={classes.menuItem} onClick={() => openDialog('editmenu', menu)}>
                                            <FontAwesomeIcon icon={'pencil-alt'} className={classes.icon} /><i>Edit Menu...</i>
                                        </MenuItem>
                                        {menu  && menu.pages.length === 0 &&
                                            <MenuItem className={classes.menuItem} onClick={() => openDialog('delete', menu)}>
                                                <FontAwesomeIcon icon={'trash'} className={classes.icon} /><i>Delete Menu</i>
                                            </MenuItem>
                                        }

                                    </div>
                                }
                            </NavMenu>

                        </div>
                    ))}
                    {isAdministrator && edit &&
                        <span>
                            <AddMenu />
                            {selectedMenu &&
                                <span>
                                    <AddPage open={open === 'addpage'} menu={selectedMenu} handleClose={closeDialog} />
                                    <EditMenu open={open === 'editmenu'} menu={selectedMenu} handleClose={closeDialog} />
                                    <DeleteMenu open={open === 'delete'} menu={selectedMenu} handleClose={closeDialog} />
                                </span>
                            }
                        </span>

                    }

                    <div style={{ flexGrow: 1}} />
                    {!auth.token &&
                        <Button component={Link} to="/login" className={classes.button}>
                            <FontAwesomeIcon icon={'sign-in-alt'} />&nbsp;Login
                        </Button>
                    }
                    {auth.token &&
                        <div>
                            <Button id='userMenu' onClick={handleMenuOpen} className={classes.button}>
                                <FontAwesomeIcon icon={'user'} />&nbsp; {auth.fullName} <ArrowDropDown />
                            </Button>
                            <NavMenu anchorEl={anchorEl} open={anchorEl !== null && anchorEl.id === 'userMenu'} onClose={handleClose}>
                                <MenuItem className={classes.menuItem}>
                                    <FontAwesomeIcon icon={'user-cog'} />&nbsp;User Profile
                                </MenuItem>
                                {isAdministrator &&
                                    <MenuItem className={classes.menuItem}>
                                        <FontAwesomeIcon icon={'cogs'} />&nbsp;Settings
                                    </MenuItem>
                                }
                                {(isAdministrator || isEditor) &&
                                    <MenuItem className={classes.menuItem}>
                                        <FontAwesomeIcon icon={'edit'}/>&nbsp;Edit
                                        <Switch color='secondary' checked={edit} onChange={() => setEdit(!edit)}/>
                                        {edit ? ' ON' : ' OFF'}
                                    </MenuItem>
                                }
                                <Divider light className={classes.divider} />
                                <MenuItem onClick={handleLogout} className={classes.menuItem}>
                                    <FontAwesomeIcon icon={'sign-out-alt'} />&nbsp;Logout
                                </MenuItem>
                            </NavMenu>
                        </div>
                    }
                </Toolbar>
            </div>
            <div className={classes.menuContainer}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <div style={{ flexGrow: 1}} />
                    {!auth.token &&
                        <Button className={classes.button} component={Link} to="/login">
                            <FontAwesomeIcon icon={'sign-in-alt'} />&nbsp;Login
                        </Button>
                    }
                    {auth.token &&
                        <Button className={classes.button} onClick={handleLogout}>
                            <FontAwesomeIcon icon={'sign-out-alt'} />&nbsp;Logout
                        </Button>
                    }
                </Toolbar>
            </div>

        </AppBar>
    )
}

export default observer(Nav);
