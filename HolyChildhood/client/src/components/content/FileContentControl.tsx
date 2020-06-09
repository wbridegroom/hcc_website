import React, {useContext, useEffect} from 'react';
import {PageContent} from "../../models/PageContent";
import { Document, Page, pdfjs } from 'react-pdf';
import AppState from "../../stores/AppState";
import {observer} from "mobx-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Select} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import RedFab from "../common/buttons/RedFab";
import BlueFab from "../common/buttons/BlueFab";
import ContentAdminPanel from "./ContentAdminPanel";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const BASE_URL = `http://localhost:57084/files/`;

const styles = makeStyles(theme => ({
    icon: {
        marginRight: theme.spacing(1)
    },
    uploadSection: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    adminPanel: {
        backgroundImage: 'repeating-linear-gradient(45deg, #d3d3d3, #d3d3d3 10px, #c4bfbf 10px, #c4bfbf 20px)',
        padding: theme.spacing(.5)
    },
    adminButton: {
        margin: theme.spacing(.25)
    }
}));

interface FileContentControlProps {
    pageContent: PageContent;
}

interface FilePage {
    pageNumber: number
}

function FileContentControl(props: FileContentControlProps) {
    const { pageContent } = props;
    const content = pageContent.fileContent;
    const classes = styles();

    const store = useContext(AppState);

    const { isAdministrator } = store.domainStore.authStore;

    const [pages, setPages] = React.useState<FilePage[]>([]);
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
    const [width, setWidth] = React.useState(0);
    const [selectedId, setSelectedId] = React.useState<number | string>('');
    const [fileName, setFileName] = React.useState<string>("");

    function onDocumentLoadSuccess(pdfDocument: any) {
        const pages = [];
        for (let i = 0; i < pdfDocument.numPages; i++) {
            pages.push({pageNumber: i + 1});
        }
        setPages(pages);
    }

    function updateWindowWidth() {
        setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', updateWindowWidth);

    function updateCanvasWidth() {
        const windowWidth = window.innerWidth;
        if (windowWidth > 1920) {
            setWidth(1820);
        } else if (windowWidth > 1280) {
            setWidth(1180);
        } else if (windowWidth > 960) {
            setWidth(860);
        } else if (windowWidth > 600) {
            setWidth(500);
        } else {
            setWidth(windowWidth - 50);
        }
    }

    useEffect(() => updateCanvasWidth(), [windowWidth]);

    useEffect(() => {
        if (content.files.length > 0) {
            const file = content.files[0];
            setSelectedId(file.id);
            setFileName(`${BASE_URL}/${file.id}.${file.type}`);
        }
    }, [content])

    const handleFileChanged = (event: any) => {
        const fileId = event.target.value;
        const file = content.files.find((f) => f.id === fileId);
        if (file) {
            setSelectedId(file.id);
            setFileName(`${BASE_URL}/${file.id}.${file.type}`);
        }
    }

    return(
        <div>
            <h2>{content.title}</h2>
            { isAdministrator &&
                <div className={classes.uploadSection}>
                    <BlueFab variant="extended">
                        <FontAwesomeIcon icon={'file-upload'} className={classes.icon} /> Upload
                    </BlueFab>
                </div>
            }
            <Grid container direction="row">
                <Grid item>
                    <Select value={selectedId} onChange={handleFileChanged}>
                        {content.files.map((file) => (
                            <MenuItem key={file.id} value={file.id}>{file.title}</MenuItem>
                        ))}

                    </Select>
                </Grid>
                <Grid item>
                    <BlueFab variant="extended" style={{marginLeft: 12}}>
                        <FontAwesomeIcon icon={'external-link-alt'} className={classes.icon} /> Open
                    </BlueFab>
                </Grid>
                <Grid item>
                    <RedFab variant="extended" style={{marginLeft: 12}}>
                        <FontAwesomeIcon icon={'trash'} className={classes.icon} />Delete
                    </RedFab>
                </Grid>
            </Grid>
            <Document file={fileName} onLoadSuccess={onDocumentLoadSuccess}>
                { pages.map(page => (<Page key={page.pageNumber} width={width} pageNumber={page.pageNumber} />)) }
            </Document>
            <ContentAdminPanel pageContent={pageContent} />
        </div>
    )
}

export default observer(FileContentControl);