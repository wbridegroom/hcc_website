import React, {useContext, useEffect} from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import alter from "../images/alter.jpg";
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import AppState from "../stores/AppState";
import {TextContent} from "../models/PageContent";
import {Event} from "../models/Calendar";
import TextContentControl from "./content/TextContentControl";
import past2future from "../images/Past2Future.jpg";
import {observer} from "mobx-react";

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


function Home() {
    const classes = style();
    const store = useContext(AppState);
    const { getTextContent } = store.domainStore.contentStore;
    const { getUpcomingEvents } = store.domainStore.eventStore;

    const [mainContent, setMainContent] = React.useState<TextContent | null>(null);
    const [scheduleContent, setScheduleContent] = React.useState<TextContent | null>(null);
    const [contactContent, setContactContent] = React.useState<TextContent | null>(null);
    const [events, setEvents] = React.useState<Event[]>([]);

    useEffect(() => {
        getTextContent(1).then((content) => {
            setMainContent(content);
        });
        getTextContent(2).then((content) => {
            setScheduleContent(content);
        });
        getTextContent(3).then((content) => {
            setContactContent(content);
        });
        getUpcomingEvents(8).then((events) => {
            setEvents(events);
        });
    }, [getTextContent, getUpcomingEvents])

    return(
        <div>
            <div className={classes.image}>
                <div className={classes.quoteContainer}>
                    <Typography className={classes.quote}>
                        At Holy Childhood, we use the gifts that God has given us, our gifts of time, talent and treasure, to further the Kingdom of God here on earth.
                    </Typography>
                </div>
            </div>
            <Grid container direction="column" style={{padding: "30px"}} spacing={4}>
                <Grid item>
                    <Typography variant="h2" style={{marginBottom: ".5rem" }}>
                        Our Mission
                    </Typography>
                    <Typography variant="body1">
                        To be a credible sign of God’s love and care, Holy Childhood Parish needs to be a loving, charitable and caring community that is spiritually challenging, generously welcoming and liturgically alive. We strive to reach out to those in spiritual need and basic material needs. We will be open to the ideas of others, and, with God’s help, continue to live out the Gospel message.
                    </Typography>
                </Grid>
                <Grid item>
                    {mainContent &&
                        <TextContentControl textContent={mainContent} />
                    }
                </Grid>
                <Grid item>
                    <Grid container direction="row" spacing={4}>
                        <Grid item xs={8}>
                            {scheduleContent &&
                                <TextContentControl textContent={scheduleContent} />
                            }
                        </Grid>
                        <Grid item xs={4}>
                            <h2>Upcoming Events</h2>
                            {events.map(event => (
                                <div>
                                    {event.start} - {event.title}
                                </div>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container direction="row" spacing={4}>
                        <Grid item xs={8}>
                            {contactContent &&
                                <TextContentControl textContent={contactContent} />
                            }
                        </Grid>
                        <Grid item xs={4}>
                            <a href="http://churchcampaign.org/holychild" target="_blank" rel="noopener noreferrer">
                                <img src={past2future} style={{width: 250}} alt="Past2Future" />
                            </a>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

export default observer(Home);
