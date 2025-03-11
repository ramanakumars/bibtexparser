import React, { useContext, useEffect, useState } from "react";
import UploadForm from './UploadForm.js';
import Record from '../parser/Record.js';
import { bibContext } from "../contexts/bibContext.js";
import RecordCard from './RecordCard.js';

const test = `@book{texbook,
  author = {Donald E. Knuth},
  year = {1986},
  title = {The {\TeX} Book},
  publisher = {Addison-Wesley Professional}
}

@book{latex:companion,
  author = {Frank Mittelbach and Michel Gossens
            and Johannes Braams and David Carlisle
            and Chris Rowley},
  year = {2004},
  title = {The {\LaTeX} Companion},
  publisher = {Addison-Wesley Professional},
  edition = {2}
}

@book{latex2e,
  author = {Leslie Lamport},
  year = {1994},
  title = {{\LaTeX}: a Document Preparation System},
  publisher = {Addison Wesley},
  address = {Massachusetts},
  edition = {2}
}

@article{knuth:1984,
  title={Literate Programming},
  author={Donald E. Knuth},
  journal={The Computer Journal},
  volume={27},
  number={2},
  pages={97--111},
  year={1984},
  publisher={Oxford University Press}
}

@inproceedings{lesk:1977,
  title={Computer Typesetting of Technical Journals on {UNIX}},
  author={Michael Lesk and Brian Kernighan},
  booktitle={Proceedings of American Federation of
             Information Processing Societies: 1977
             National Computer Conference},
  pages={879--888},
  year={1977},
  address={Dallas, Texas}
}
`;

export default function BibInput() {
    const [text, setText] = useState(test);
    const [editable, setEditable] = useState(false);
    const { records, setRecords } = useContext(bibContext);

    const handleFileUpload = (field, value) => {
        if (field == 'text') {
            setText(value+'\n');
        }
    };

    const handleChangeText = (event) => {
        setText(event.target.value+'\n');
    }

    useEffect(() => {
        // find the pattern of the type @type{entry_name, ...}
        let pattern = /@(\w+)\s*\{(.*?),\n?([\s\S\t]*?=[\{\}\s\S\t]*?,?[^\w\.\)\!])\}[^\},]\n?/g;

        const records = text.matchAll(pattern);
        const new_records = [];
        for (const record of records) {
            let rec_type = record[1].toLowerCase();
            let entry_name = record[2];
            let entry_text = record[3];
            let new_record = new Record(rec_type, entry_name, record[0]);
            new_record.parse_text(entry_text);
            new_records.push(new_record);
        }

        setRecords(new_records);
    }, [text]);


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
            <h1>BibTex entry</h1>
            {editable ?
                <section className='input-container'>
                    <span className="input-header">
                        <strong>Found {records.length} entries</strong>
                        <span>
                            <button type='button' className='clean-button' onClick={handleClean}>Sort & Clean!</button>
                            <button onClick={() => setEditable(false)}>Close</button>
                        </span>
                    </span>
                    <UploadForm type={'bib'} onChange={handleFileUpload} />
                    <textarea id={"bibtext"} className="upload-text" placeholder="... or copy it here" onChange={handleChangeText} value={text} />
                </section>
                :
                <section className="input-container">
                    <span className="input-header">
                        <strong>Found {records.length} entries</strong>
                        <span>
                            <button type='button' className='clean-button' onClick={handleClean}>Sort & Clean!</button>
                            <button onClick={() => setEditable(true)}>Edit</button>
                        </span>
                    </span>
                    <div className="record-list">
                        {records.map((record, index) => (
                            <RecordCard record={record} key={index} />
                        ))}
                    </div>
                </section>
            }
        </section>
    )
}

