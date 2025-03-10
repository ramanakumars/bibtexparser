import React, { useContext, useEffect, useState } from "react";
import UploadForm from './UploadForm.js';


export default function Input(props) {
    const {text, setText} = useContext(props.context);

    const handleFileUpload = (field, value) => {
        if (field == 'text') {
            setText(value);
        }
    };

    const handleChangeText = (event) => {
        setText(event.target.value);
    }
    
    const handleClean = (event) => {
        event.preventDefault();

        fetch('/clean/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: text }),
        }).then(result => result.json()).then(data => {
            if (!data.error) {
                setText(data.data);
            }
        })
            .catch((error) => {
                alert(error);
            });
    }

    return (
        <section className="main-container">
            <h1>{
                    props.type == 'bib' ? 'BibTex entry' : 'Template entry'
                }:</h1>
            <section className='upload-container'>
                <UploadForm type={props.type} onChange={handleFileUpload} handleClean={handleClean}/>
                <textarea id={props.type + "text"} className="upload-text" placeholder="... or copy it here" onChange={handleChangeText} value={text} />
            </section>
        </section>
    )
}