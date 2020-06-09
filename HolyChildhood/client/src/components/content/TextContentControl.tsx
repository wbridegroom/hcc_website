///<reference path="../../../node_modules/react-froala-wysiwyg/lib/index.d.ts" />
import React, {useContext} from 'react';
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
import FroalaEditor from "react-froala-wysiwyg";
import {PageContent, TextContent} from "../../models/PageContent";
import ContentAdminPanel from "./ContentAdminPanel";
import 'froala-editor/js/plugins.pkgd.min';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/plugins.pkgd.min.css';
import AppState from "../../stores/AppState";
import {observer} from "mobx-react";


interface TextContentProps {
    pageContent?: PageContent,
    textContent: TextContent
}

function TextContentControl(props: TextContentProps) {
    const { pageContent, textContent } = props;
    const store = useContext(AppState);

    const { page } = store.domainStore.pageStore;
    const { updateTextContent } = store.domainStore.contentStore;

    const [content, setContent] = React.useState(textContent.content);
    const [isEdit, setIsEdit] = React.useState<boolean>(false);

    function handleEdit() {
        setIsEdit(true);
    }

    function handleCancelEdit() {
        setIsEdit(false);
    }

    async function handleSave() {
        setIsEdit(false);
        console.log(content);
        textContent.content = content;
        await updateTextContent(page.id, textContent);
    }

    function handleModelChange(text: string) {
        setContent(text);
    }

    return (
        <div>
            {isEdit &&
                <FroalaEditor model={content} onModelChange={handleModelChange}/>
            }
            {!isEdit &&
                <FroalaEditorView model={content} />
            }

            <ContentAdminPanel showEdit onEdit={handleEdit} isEdit={isEdit} onSave={handleSave} onCancelEdit={handleCancelEdit} pageContent={pageContent} />
        </div>
    )
};

export default observer(TextContentControl);
