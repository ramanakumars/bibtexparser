import React, { useContext, useEffect, useState } from "react";
import UploadForm from './UploadForm.js';
import { tempContext } from "../contexts/tempContext.js";

export default function TemplateInput(props) {
    const [text, setText] = useState('');
    const {templates, setTemplates} = useContext(tempContext);

    const handleFileUpload = (field, value) => {
        if (field == 'text') {
            setText(value);
        }
    };

    const handleChangeText = (event) => {
        setText(event.target.value);
    }

    return (
        <section className="main-container">
            <h1>Template entry:</h1>
            <section className='input-container'>
                <UploadForm type={'temp'} onChange={handleFileUpload}/>
                <textarea id={"temptext"} className="upload-text" placeholder="... or copy it here" onChange={handleChangeText} value={text} />
            </section>
        </section>
    )
}