import React, { useEffect, useState } from "react";
import "../css/upload.css";
import PopupContainer from "./PopupContainer";

interface UploadFormProps {
    upload_type: string;
    onChange: (value: string) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ upload_type, onChange }) => {
    const [filename, setFilename] = useState<string>("No file selected!");
    const [fileInput, setFileInput] = useState<File | null>(null);
    const [text, setText] = useState<string>("");

    const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            return;
        }
        setFilename(event.target.files[0].name);
        setFileInput(event.target.files[0]);
    };

    useEffect(() => {
        if (fileInput) {
            var reader = new FileReader();
            reader.readAsText(fileInput as Blob);
            reader.onload = function () {
                setText(reader.result as string);
            };
        }
    }, [fileInput]);

    return (
        <PopupContainer onClick={() => onChange("")}>
            <form action="#" className="file-upload" method="POST">
                <label htmlFor={upload_type + "file"} className="file-desc">
                    Upload your{" "}
                    {upload_type == "bib" ? "bibfile" : "template"}{" "}
                </label>
                <label className="file-upload">
                    <input
                        name={upload_type + "file"}
                        id={upload_type + "file"}
                        type="file"
                        className="file-upload"
                        onChange={handleFileInput}
                    />
                    <span>{filename}</span>
                </label>
            </form>
            <textarea
                id={upload_type + "text"}
                className="upload-text"
                placeholder="... or copy it here"
                onChange={(event) => setText(event.target.value)}
                value={text}
            />
            <button
                type="button"
                className="upload"
                onClick={() => onChange(text)}
            >
                Add!
            </button>
        </PopupContainer>
    );
};

export default UploadForm;
