import React from 'react';
import ReactDOM from 'react-dom';

'use strict';

class UploadForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {filename: 'No file selected!', fileInput: null, type: props.type, text: ''};
        this.handleUpload     = this.handleUpload.bind(this);
        this.handleFileInput  = this.handleFileInput.bind(this);
	}

	handleFileInput(event) {
		this.setState({filename: event.target.files[0].name, fileInput: event.target.files[0]});
	}

    handleUpload(event) {
        event.preventDefault();

		const formData = new FormData();

		formData.append('file', this.state.fileInput);

        fetch('/upload/', {
            method: 'POST',
            body: formData
        }).then( result => result.json()).then( data => {
			if(!data.error) {
				this.setState({text: data.data});
				this.props.onChange('text', data.data);
			}
        })
        .catch((error) => {
			alert(error);
        });
    }

	render() {
		const inputname = this.type + "file";

		if(this.state.type=='bib') {
			var labeltext = "Upload your bibfile";
		} else {
			var labeltext = "Upload your template";
		}
		
		return (
			<form action="#" className="file-upload" method="POST" onSubmit={this.handleUpload}>
				<label htmlFor={inputname} className="file-desc">{labeltext}: </label>
				<label className="file-upload">
					<input name={inputname} id={inputname} type="file" className="file-upload" onChange={this.handleFileInput}/>
					<span>{this.state.filename}</span>
				</label>
				<input type="submit" value="Upload!" />
			</form>
		)
	}
}

class Input extends React.Component {
    constructor(props) {
        super(props);
		this.state = {text: '', type: props.type};
		this.uploadForm = React.createRef();
        this.handleChangeText = this.handleChangeText.bind(this);
        
		this.handleFileUpload = this.handleFileUpload.bind(this);
    }

	handleFileUpload(field, value) {
		if(field=='text') {
			this.setState({text: value});
			this.props.onChange();
		}
	}

    handleChangeText(event) {
        this.setState({text: event.target.value});
		this.props.onChange();
    }

    render() {
		if(this.state.type=='bib') {
			var header='BibTex entry';
		} else {
			var header='Template entry';
		}

        return (
            <section className="main-container">
                <h1>{header}:</h1>
				<section className='upload-container'>
					<UploadForm type={this.state.type} ref={this.uploadForm} onChange={this.handleFileUpload} />
					<textarea id={this.state.type+"text"} className="upload-text" placeholder="... or copy it here" onChange={this.handleChangeText} value={this.state.text} />
                </section>
            </section>
        )
    }
}

class Output extends React.Component {
	constructor(props) {
		super(props);
		this.state = {output: 'Please enter/upload both the bibtex entries and a template!'};
	}

	render() {
		return (
            <section id="output" className="main-container">
                <h1>Output: </h1>
                <div id="parse-output-container">
                    <code id="output-text">
						{this.state.output}
                    </code>
                </div>
            </section>
		);
	}

}


class App extends React.Component {
	constructor(props) {
		super(props);

		this.bibsec  = React.createRef();
		this.tempsec = React.createRef();
		this.output  = React.createRef();

		this.update = this.update.bind(this);

	}

	update() {
		const bibsec  = this.bibsec.current;
		const tempsec = this.tempsec.current;
		const output  = this.output.current;

		var formData = {bibdata: bibsec.state.text, template: tempsec.state.text, sort: false, clean: false};

        fetch('/parse/', {
            method: 'POST',
			headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
			},
            body: JSON.stringify(formData),
        }).then( result => result.json()).then( data => {
			if(!data.error) {
				output.setState({output: data.data});
			}
        })
        .catch((error) => {
			console.log(error);
        });
		
	}

	render() {
		return(
			<article id='main' className='center-frame'>
				<Input type='bib' ref={this.bibsec} onChange={this.update}/>
				<Input type='template' ref={this.tempsec} onChange={this.update}/>
				<Output ref={this.output}/>
				<HelpText />
			</article>
		)
	}
}

class HelpText extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
            <section id='template-helper' className='template-helper main-container'>
                <h1>Template tags</h1>
                <p className="template-tag-desc">
                    <span className="template-tag"><code>$auths[x]</code></span>
                    <span className='template-desc'>
                        Short author list. 
                        Replace <code>x</code> with a number to specify number of authors to list, or use 
                        <code>a</code> to print all the authors.
                        e.g., <code>$auths2</code> will give <code>AuthorA, A and AuthorB, B</code> for two authors,
                        and <code>AuthorA, A et al.</code> for more than two authors. <code>$authsa</code> will print 
                        all the authors with first names initialed.
                    </span>
                </p>

                <p className="template-tag-desc">
                    <span className="template-tag"><code>$authf</code></span>
                    <span className='template-desc'>
                        Full author list. 
                        This will print all the authors in <code>Firstname Initial Lastname</code> format. 
                        Cannot be used with <code>$auths[x]</code> above. If first name is not found, the 
                        first initial is printed instead. 
                    </span>
                </p>

                <p style={{'display': 'block', 'width': '100%', 'textAlign': 'center'}} className='template-tag-desc'>
                    <b>You must have either <code>$auths[x]</code> or <code>$authf</code> in your template.</b>
                </p>

                <p className="template-tag-desc">
                    <span className="template-tag"><code>$doi</code></span>
                    <span className='template-desc'>
                        The DOI value. e.g., <code>10.1103/PhysRev.73.803</code>
                    </span>
                </p>

                <p className="template-tag-desc">
                    <span className="template-tag"><code>$doiurl</code></span>
                    <span className='template-desc'>
                        The full DOI URL. e.g., <code>https://doi.org/10.1103/PhysRev.73.803</code>
                    </span>
                </p>

                <p className="template-tag-desc">
                    <span className="template-tag"><code>$[variable]</code></span>
                    <span className='template-desc'>
                        Any other keyword entry in bibtex (e.g., <code>$year</code> for the year, 
                        <code>$title</code> for the title.) Years will be formatted in full 4-digit
                        integer format and titles will retain any TeX formatting. 
                    </span>
                </p>
                
                <p className="template-tag-desc">
                    <span className="template-tag"><code>\\</code>,<code>$</code> and text</span>
                    <span className='template-desc'>
                    Use <code>\</code> to escape <code>{'{}'}</code> and <code>$$</code> to output <code>$</code>. 
                    Any other text will be printed as is. e.g., use <code>\\item</code> to print a LaTeX <code>\\item</code> tag, or 
                    <code>\{'{'}\bf \{'}'}</code> to enter a bold text. 
                    </span>
                </p>

                <p className="template-tag-desc">
                    <span className="template-tag"><code>{'{'}optional{'}'}</code></span>
                    <span className='template-desc'>
                    Enclose optional groups within a <code>{'{'}{'}'}</code>. If these keywords do not exist 
                    in the bibtex entry, they will be skipped in the output. e.g., conference abstracts
                    do no usually have a publisher or page number, so you can use <code>{'{'}$journal $pages{'}'}</code>
                    to skip these entries for abstracts, but retain them for journal articles. The code 
                    will error out when not finding specific tags. 
                    </span>
                </p>
            </section>
		)
	}

}

ReactDOM.render(<App />, document.body.appendChild(document.createElement("div")));
