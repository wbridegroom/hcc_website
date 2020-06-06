///<reference path="../../../node_modules/react-froala-wysiwyg/lib/index.d.ts" />
import React from 'react';
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
import FroalaEditor from 'react-froala-wysiwyg';
import { TextContent } from "../../models/PageContent";

import 'froala-editor/js/plugins.pkgd.min';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/plugins.pkgd.min.css';



interface TextContentProps {
    content: TextContent,
}

const TextContentControl: React.FC<TextContentProps> = (props) => {

    const { content } = props;

    return (
        <div>
            {/*<FroalaEditor model={content.content} />*/}
            <FroalaEditorView model={content.content} />
        </div>
    )
};

export default TextContentControl;
