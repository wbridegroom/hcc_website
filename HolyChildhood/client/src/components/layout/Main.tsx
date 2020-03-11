import React from 'react';
import {Route, RouteComponentProps} from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Home from "../Home";
import Page from "../Page";
import Login from "../Login";


const style = makeStyles(theme => ({
    root: {
        backgroundColor: "#fff",
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
}));

type TParams = { id: string };

const Main: React.FC = () => {

    const classes = style();

    return (
        <div className={classes.root}>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/home" component={Home} />
            <Route path="/page/:id" component={({match}: RouteComponentProps<TParams>) => <Page id={match.params.id} />} />
        </div>
    )
};

export default Main;
