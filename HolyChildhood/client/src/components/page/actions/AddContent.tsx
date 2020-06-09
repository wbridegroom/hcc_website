import React, {useContext} from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import AppState from "../../../stores/AppState";
import {Page} from "../../../models/Page";
import GreenFab from "../../common/buttons/GreenFab";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import HCCDialog from "../../common/HCCDialog";
import {Select} from "@material-ui/core";
import {
    CalendarContent,
    FileContent,
    FormContent,
    PageContent,
    TabContent,
    TextContent
} from "../../../models/PageContent";

const style = makeStyles(theme => ({
    icon: {
        marginRight: theme.spacing(1)
    },
    adminButton: {
        margin: theme.spacing(.5)
    }
}));

interface AddContentProps {
    page: Page
}

function AddContent(props: AddContentProps) {
    const classes = style();
    const store = useContext(AppState);

    const { addContent } = store.domainStore.contentStore;
    const { page } = props;

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [open, setOpen] = React.useState<boolean>(false);
    const [title, setTitle] = React.useState<string>("");
    const [pdfType, setPdfType] = React.useState<string>("");

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAdd = async (type: string) => {
        const content= {} as PageContent;
        content.contentType = type;
        content.page = page;

        if (type === 'Files') {
            setOpen(true);
            handleClose();
            return;
        } else if (type === 'Text') {
            content.textContent = {} as TextContent;
        } else if (type === 'Tabs') {
            content.tabContent = {} as TabContent;
        } else if (type === 'Calendar') {
            content.calendarContent = { calendarId: 1 } as CalendarContent;
        } else if (type === 'Form') {
            content.formContent = {} as FormContent;
        }

        await addContent(page.id, content);
        handleClose();
    }

    const handleAddPdfViewer = async () => {
        const content= {} as PageContent;
        content.contentType = 'Files';
        content.page = page;
        content.fileContent = { fileType: pdfType } as FileContent;

        await addContent(page.id, content);
        setOpen(false);
        handleClose();
    }

    const handlePdfTypeChange = (event: any) => {
        setPdfType(event.target.value);
    }

    return (
        <span>
            <GreenFab variant="extended" className={classes.adminButton} onClick={handleMenuOpen}>
                <FontAwesomeIcon icon={'plus'} className={classes.icon} />Add Content<FontAwesomeIcon icon={'caret-down'} style={{marginLeft: 8}} />
            </GreenFab>
            <Menu
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                anchorEl={anchorEl}
                open={anchorEl !== null}
                onClose={handleClose}
            >
                <MenuItem style={{width: 150}} onClick={() => handleAdd('Text')}>Text/HTML</MenuItem>
                <MenuItem style={{width: 150}} onClick={() => handleAdd('Tabs')}>Tabs</MenuItem>
                <MenuItem style={{width: 150}} onClick={() => handleAdd('Calendar')}>Calendar</MenuItem>
                <MenuItem style={{width: 150}} onClick={() => handleAdd('Files')}>PDF Viewer</MenuItem>
                <MenuItem style={{width: 150}} onClick={() => handleAdd('Form')}>Form</MenuItem>
            </Menu>
            <HCCDialog
                open={open}
                size={'xs'}
                title={'Add PDF Viewer: PDF Types'}
                content={
                    <div>
                        <TextField autoFocus value={title} label={"Title"} onChange={(event) => setTitle(event.target.value)} fullWidth />
                        <Select value={pdfType} onChange={handlePdfTypeChange}>
                            <MenuItem value='bulletin'>Bulletin</MenuItem>
                            <MenuItem value='other'>Other</MenuItem>
                        </Select>
                    </div>
                }
                okAction={handleAddPdfViewer}
                handleClose={() => setOpen(false)}
            />
        </span>
    )
}

export default AddContent;
