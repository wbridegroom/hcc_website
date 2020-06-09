import React, {useContext, useEffect} from 'react';
import AppState from "../stores/AppState";
import {observer} from "mobx-react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as RouterLink } from 'react-router-dom';
import Typography from "@material-ui/core/Typography";
import TextContentControl from "./content/TextContentControl";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import CalendarContentControl from "./content/CalendarContentControl";
import TabContentControl from "./content/TabContentControl";
import FileContentControl from "./content/FileContentControl";
import FormContentControl from "./content/FormContentControl";
import Paper from "@material-ui/core/Paper";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import PageAdminPanel from "./page/PageAdminPanel";
import classNames from 'classnames';

const style = makeStyles(theme => ({
    contentContainer: {
        paddingTop: "10px",
        paddingLeft: "15px",
        paddingRight: "15px",
    },
    breadcrumbPaper: {
        backgroundColor: "#ebebeb",
        padding: theme.spacing(1.5),
        margin: theme.spacing(1)
    },
    content: {
        padding: 1,
        marginBottom: theme.spacing(1)
    },
    cardHeaderRoot: {
        padding: theme.spacing(1),
        backgroundColor: '#ebebeb'
    },
    cardHeaderTitle: {
        fontSize: '1.1em'
    },
    cardContentRoot: {
        padding: 0,
        '&:last-child': {
            paddingBottom: theme.spacing(1)
        }
    },
    homeIcon: {
        color: '#007ad9'
    },
    edit: {
        '&:hover': {
            padding: 0,
            border: '1px dashed'
        }
    }
}));

interface PageProps {
    id: string;
}

function Page(props: PageProps) {

    const classes = style();
    const store = useContext(AppState);
    const { id } = props;
    const { page, loadPage } = store.domainStore.pageStore;
    const { edit, isAdministrator, isEditor } = store.domainStore.authStore;

    useEffect(() => {
        loadPage(id).finally()
        }, [loadPage, id]
    );

    const hasChildren = page && page.children && page.children.length > 0;

    return (
        <div>
            {edit && (isAdministrator || isEditor) &&
                <PageAdminPanel page={page} />
            }
            <div className={classes.contentContainer}>
                <Paper elevation={2} className={classes.breadcrumbPaper}>
                    <Breadcrumbs>
                        <RouterLink to="/"><FontAwesomeIcon icon={'home'} className={classes.homeIcon} /></RouterLink>
                        {!page.parent && page.menuItem &&
                            <Typography>{page.menuItem.name}</Typography>
                        }
                        {page.parent && page.parent.menuItem &&
                            <Typography>{page.parent.menuItem.name}</Typography>
                        }
                        {page.parent &&
                            <RouterLink to={`/page/${page.parent.id}`}>{page.parent.title}</RouterLink>
                        }
                        <Typography>{page.title}</Typography>
                    </Breadcrumbs>
                </Paper>
                <Grid container direction="row" spacing={2} style={{marginTop: 8, marginLeft: 1, marginRight: 1}} justify='flex-start'>
                    {hasChildren &&
                        <Grid item xs={12} sm={3}>
                            <Card elevation={2}>
                                <CardHeader title={page.title} classes={{ root: classes.cardHeaderRoot, title: classes.cardHeaderTitle}} />
                                <Divider />
                                <CardContent classes={{ root: classes.cardContentRoot }}>
                                    <List dense>
                                        {page.children.map(child => (
                                            <ListItem key={child.id} component={RouterLink} to={`/page/${child.id}`}>
                                                <ListItemText primary={child.title} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    }
                    <Grid item xs={12} sm={hasChildren ? 9 : 12}>
                        {page && page.pageContents && page.pageContents.map(content => (
                            <div key={content.id} className={classNames(classes.content, {[classes.edit]: edit})}>
                                {content.contentType === "Text" &&
                                    <TextContentControl textContent={content.textContent} pageContent={content} />
                                }
                                {content.contentType === "Calendar" &&
                                    <CalendarContentControl pageContent={content} />
                                }
                                {content.contentType === "Tabs" &&
                                    <TabContentControl pageContent={content} />
                                }
                                {content.contentType === "Files" &&
                                    <FileContentControl pageContent={content} />
                                }
                                {content.contentType === "Form" &&
                                    <FormContentControl pageContent={content} />
                                }
                            </div>
                        ))}
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default observer(Page);
