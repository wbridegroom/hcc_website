import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from "../../images/church_round.png";
import Nav from "./Nav";

const style = makeStyles(theme => ({
    root: {
        width: '100%',
        paddingRight: "15px",
        paddingLeft: "15px",
        marginRight: "auto",
        marginLeft: "auto",
        [theme.breakpoints.down('xs')]: {
            paddingRight: 0,
            paddingLeft: 0
        },
        [theme.breakpoints.up('sm')]: {
            maxWidth: '540px',
        },
        [theme.breakpoints.up('md')]: {
            maxWidth: '900px',
        },
        [theme.breakpoints.up('lg')]: {
            maxWidth: '1220px',
        },
        [theme.breakpoints.up('xl')]: {
            maxWidth: '1860px',
        },
    },
    topHeader: {
        backgroundColor: theme.palette.primary.dark,
        width: '100%',
        color: theme.palette.primary.contrastText,
        padding: "15px",
        fontSize: "15px",
        fontWeight: 600,
        marginTop: "10px",
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        [theme.breakpoints.down('xs')]: {
            marginTop: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
        }
    },
    bottomHeader: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        marginTop: "-3px"
    },
    logo: {
        height: "65px",
        width: "65px",
    },
    link: {
        color: theme.palette.primary.light
    }
}));

const Header: React.FC = () => {
    const classes = style();

    return (
        <header className={classes.root}>
            <Grid container direction="column">
                <Grid item className={classes.topHeader}>
                    <Grid container spacing={2}>
                        <Grid item sm={12} md={1}>
                            <img src={logo} className={classes.logo} alt="logo" />
                        </Grid>
                        <Grid item sm={12} md={8} style={{ textAlign: "left"}}>
                            <Typography variant='h2'>Holy Childhood of Jesus</Typography>
                            <Typography variant='h6'>Catholic Church - Mascoutah, IL</Typography>
                        </Grid>
                        <Grid item sm={12} md={3} style={{ textAlign: "left"}}>
                            <FontAwesomeIcon icon={'phone'} /> (618) 566-2958
                            <br />
                            <Link href="mailto:hcc@holychildhoodchurch.com" className={classes.link}>hcc@holychildhoodchurch.com</Link>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item className={classes.bottomHeader}>
                    <Nav />
                </Grid>
            </Grid>
        </header>
    )
};

export default Header;
