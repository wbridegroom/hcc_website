import React, {useContext, useEffect} from 'react';
import AppState from "../stores/AppState";
import {observer} from "mobx-react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import {Link} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

const style = makeStyles(theme => ({
    root: {
        paddingTop: "10px",
        paddingLeft: "15px",
        paddingRight: "15px",
    }
}));

const Page: React.FC<{ id: string}> = observer (({id}) => {

    const classes = style();
    const store = useContext(AppState);
    const { page, loadPage } = store.domainStore.pageStore;

    useEffect(() => {
        loadPage(id).finally()
        }, [loadPage, id]
    );

    return (
        <div className={classes.root}>
            <Breadcrumbs>
                <Link href="/">
                    Home
                </Link>
                <Typography>
                    {page.title}
                </Typography>
            </Breadcrumbs>
        </div>
    )
});

export default Page;
