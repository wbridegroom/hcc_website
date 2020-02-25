import React, {useEffect} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
        }
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

const Nav: React.FC = () => {
    const classes = style();

    const [menus, setMenus] = React.useState<Menu[]>([]);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    useEffect(() => {
            axios.get("/api/menu").then(response => {
                setMenus(response.data);
                console.log(response.data);
            })
        },[]
    );

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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
                            </NavMenu>

                        </div>
                    ))}

                    <div style={{ flexGrow: 1}} />
                    <Button variant='outlined' style={{ color: 'white'}}>Login</Button>
                </Toolbar>
            </div>
            <div className={classes.menuContainer}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <div style={{ flexGrow: 1}} />
                    <Button className={classes.button}>Login</Button>
                </Toolbar>
            </div>

        </AppBar>
    )
};

export default Nav;
