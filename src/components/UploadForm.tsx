import React, { useEffect, useState } from 'react';
import "../css/upload.css";

interface UploadFormProps {
    upload_type: string;
    onChange: (value: string) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ upload_type, onChange }) => {
    const [filename, setFilename] = useState<string>('No file selected!');
    const [fileInput, setFileInput] = useState<File | null>(null);
    const [text, setText] = useState<string>('');

    const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            return;
        }
        setFilename(event.target.files[0].name);
        setFileInput(event.target.files[0]);
    }

    useEffect(() => {
        if (fileInput) {
            var reader = new FileReader();
            reader.readAsText(fileInput as Blob);
            reader.onload = function () {          
                setText(reader.result as string);
            }
        }
    }, [fileInput]);


    return (
        <>        
            <div className='upload-background' onClick={() => onChange('')}>
                &nbsp;
            </div>
            <div className='upload-container'>
                <form action="#" className="file-upload" method="POST">
                    <label htmlFor={upload_type + "file"} className="file-desc">Upload your { upload_type == "bib" ? "bibfile" : "template" } </label>
                    <label className="file-upload">
                        <input name={upload_type + "file"} id={upload_type + "file"} type="file" className="file-upload" onChange={handleFileInput} />
                        <span>{filename}</span>
                    </label>
                </form>
                <textarea id={upload_type + "text"} className="upload-text" placeholder="... or copy it here" onChange={(event) => setText(event.target.value)} value={text} />
                <button type='button' className='upload' onClick={() => (onChange(text))}>Add!</button>
            </div>
        </>
    )
}

// export default class UploadForm extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = { filename: 'No file selected!', fileInput: null, type: props.type, text: '' };
//         this.handleUpload = this.handleUpload.bind(this);
//         this.handleFileInput = this.handleFileInput.bind(this);
//         this.handleCheckbox = this.handleCheckbox.bind(this);
//         // this.handleClean = this.handleClean.bind(this);
//     }

//     handleFileInput(event) {
//         this.setState({ filename: event.target.files[0].name, fileInput: event.target.files[0] });
//     }

//     handleUpload(event) {
//         event.preventDefault();

//         const formData = new FormData();

//         formData.append('file', this.state.fileInput);

//         fetch('/upload/', {
//             method: 'POST',
//             body: formData
//         }).then(result => result.json()).then(data => {
//             if (!data.error) {
//                 this.setState({ text: data.data });
//                 this.props.onChange('text', data.data);
//             }
//         })
//             .catch((error) => {
//                 alert(error);
//             });
//     }

//     handleCheckbox(event) {
//         this.setState({ clean: event.target.checked });
//     }


//     render() {
//         const inputname = this.state.type + "file";

//         if (this.state.type == 'bib') {
//             var labeltext = "Upload your bibfile";
//         } else {
//             var labeltext = "Upload your template";
//         }

//         return (
//             <div className='upload-container'>
//                 {this.state.type == 'bib' ?
//                     <form action="#" className="file-upload" method="POST" onSubmit={this.handleUpload}>
//                         <label htmlFor={inputname} className="file-desc">{labeltext}: </label>
//                         <label className="file-upload">
//                             <input name={inputname} id={inputname} type="file" className="file-upload" onChange={this.handleFileInput} />
//                             <span>{this.state.filename}</span>
//                         </label>

//                         <input type="submit" value="Upload!" />

//                     </form>

//                     :
//                     <form action="#" className="file-upload" method="POST" onSubmit={this.handleUpload}>
//                         <label htmlFor={inputname} className="file-desc">{labeltext}: </label>
//                         <label className="file-upload">
//                             <input name={inputname} id={inputname} type="file" className="file-upload" onChange={this.handleFileInput} />
//                             <span>{this.state.filename}</span>
//                         </label>
//                         <input type="submit" value="Upload!" />
//                     </form>
//                 }
//             </div>
//         )
//     }
// }

export default UploadForm;