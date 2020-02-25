import React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import diocese from "../../images/Diocese_of_Belleville.svg.png";
import insigne from "../../images/Insigne_Francisci.svg_.png";
import usccb from "../../images/usccb-logo-2018.png";

const style = makeStyles(theme => ({
    root: {
        width: '100%',
        marginRight: "auto",
        marginLeft: "auto",
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
    footer1: {
        backgroundColor: '#fff',
        paddingTop: "20px",
        paddingBottom: "20px"
    },
    footer2: {
        backgroundColor: theme.palette.primary.main,
        width: '100%',
        color: theme.palette.primary.contrastText,
        textAlign: "left",
        paddingTop: "15px",
        paddingBottom: "15px",
        borderBottomLeftRadius: "10px",
        borderBottomRightRadius: "10px",
        [theme.breakpoints.down('xs')]: {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
        }
    },
    copyright: {
        fontFamily: "inherit",
        fontSize: "16px",
        fontWeight: 600,
        marginLeft: "20px",
    },
    imageContainer: {
        paddingLeft: "80px",
        paddingRight: "80px",
        [theme.breakpoints.down('xs')]: {
            paddingLeft: "10px",
            paddingRight: "10px"
        }
    },
    image: {
        height: "80px",
        [theme.breakpoints.down('sm')]: {
            height: "60px",
            margin: "5px"
        }
    }
}));

const Footer: React.FC = () => {

    const classes = style();

    return (
        <footer className={classes.root}>
            <div className={classes.footer1}>
                <Grid container direction="row" justify="space-between" alignItems="center" className={classes.imageContainer}>
                    <Grid item>
                        <img src={insigne} alt="Insigne" className={classes.image} />
                    </Grid>
                    <Grid item>
                        <img src={usccb} alt="USCCB" className={classes.image} />
                    </Grid>
                    <Grid item>
                        <img src={diocese} alt="Diocese of Belleville" className={classes.image} />
                    </Grid>
                </Grid>
            </div>
            <div className={classes.footer2}>
                <Typography className={classes.copyright}>
                    Copyright &copy; 2020 Holy Childhood of Jesus Catholic Church
                </Typography>
            </div>
        </footer>
    )
};

export default Footer;
