import React from 'react';

export default class UploadForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { filename: 'No file selected!', fileInput: null, type: props.type, text: '' };
        this.handleUpload = this.handleUpload.bind(this);
        this.handleFileInput = this.handleFileInput.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        // this.handleClean = this.handleClean.bind(this);
    }

    handleFileInput(event) {
        this.setState({ filename: event.target.files[0].name, fileInput: event.target.files[0] });
    }

    handleUpload(event) {
        event.preventDefault();

        const formData = new FormData();

        formData.append('file', this.state.fileInput);

        fetch('/upload/', {
            method: 'POST',
            body: formData
        }).then(result => result.json()).then(data => {
            if (!data.error) {
                this.setState({ text: data.data });
                this.props.onChange('text', data.data);
            }
        })
            .catch((error) => {
                alert(error);
            });
    }

    handleCheckbox(event) {
        this.setState({ clean: event.target.checked });
    }


    render() {
        const inputname = this.state.type + "file";

        if (this.state.type == 'bib') {
            var labeltext = "Upload your bibfile";
        } else {
            var labeltext = "Upload your template";
        }

        if (this.state.type == 'bib') {
            return (
                <div className='bib-upload-container'>
                    <form action="#" className="file-upload" method="POST" onSubmit={this.handleUpload}>
                        <label htmlFor={inputname} className="file-desc">{labeltext}: </label>
                        <label className="file-upload">
                            <input name={inputname} id={inputname} type="file" className="file-upload" onChange={this.handleFileInput} />
                            <span>{this.state.filename}</span>
                        </label>

                        <input type="submit" value="Upload!" />

                        <label className="checkbox-container">
                            <button type='button' className='clean-button' onClick={this.props.handleClean}>Sort & Clean!</button>
                        </label>
                    </form>

                </div>

            )
        } else {
            return (
                <form action="#" className="file-upload" method="POST" onSubmit={this.handleUpload}>
                    <label htmlFor={inputname} className="file-desc">{labeltext}: </label>
                    <label className="file-upload">
                        <input name={inputname} id={inputname} type="file" className="file-upload" onChange={this.handleFileInput} />
                        <span>{this.state.filename}</span>
                    </label>
                    <input type="submit" value="Upload!" />
                </form>
            )
        }
    }
}
