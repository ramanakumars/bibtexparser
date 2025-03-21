import React, { useContext, useEffect, useState } from "react";
import UploadForm from './UploadForm';
import { tempContext, Templates } from "../contexts/tempContext";

const TemplateInput: React.FC = () => {
    const [text, setText] = useState<string>('');
    const {templates, setTemplates} = useContext<Templates>(tempContext);

    const handleFileUpload = (field: string, value: string) => {
        if (field == 'text') {
            setText(value);
        }
    };

    const handleChangeText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    }

    return (
        <section className="main-container">
            <h1>Template entry:</h1>
            <section className='input-container'>
                <UploadForm input_text={text} upload_type={'temp'} onChange={handleFileUpload}/>
                <textarea id={"temptext"} className="upload-text" placeholder="... or copy it here" onChange={handleChangeText} value={text} />
            </section>
        </section>
    )
}

export default TemplateInput;