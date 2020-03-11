import React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import alter from "../images/alter.jpg";
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";

const style = makeStyles(theme => ({
    image: {
        backgroundImage: `url(${alter})`,
        height: "225px",
        backgroundSize: "cover",
        backgroundPosition: "center 59.85%",
    },
    quoteContainer: {
        height: "100%",
        position: "relative"
    },
    quote: {
        position: "absolute",
        top: "35%",
        left: "5%",
        right: "auto",
        bottom: "auto",
        backgroundColor: 'rgba(0,0,0,0.4)',
        width: "400px",
        margin: 0,
        padding: "10px",
        borderRadius: "10px",
        wordWrap: "break-word",
        textAlign: "left",
        fontFamily: "inherit",
        color: '#fff',
        [theme.breakpoints.down('sm')]: {
            width: "75%"
        },
    }
}));


const Home: React.FC = () => {
    const classes = style();
    return(
        <div>
            <div className={classes.image}>
                <div className={classes.quoteContainer}>
                    <Typography className={classes.quote}>
                        At Holy Childhood, we use the gifts that God has given us, our gifts of time, talent and treasure, to further the Kingdom of God here on earth.
                    </Typography>
                </div>
            </div>
            <Grid container direction="column" style={{padding: "15px"}}>
                <Grid item>
                    <Typography variant="h2" style={{marginBottom: ".5rem" }}>
                        Our Mission
                    </Typography>
                    <Typography variant="body1">
                        To be a credible sign of God’s love and care, Holy Childhood Parish needs to be a loving, charitable and caring community that is spiritually challenging, generously welcoming and liturgically alive. We strive to reach out to those in spiritual need and basic material needs. We will be open to the ideas of others, and, with God’s help, continue to live out the Gospel message.
                    </Typography>
                </Grid>
            </Grid>
        </div>
    )
};

export default Home;
