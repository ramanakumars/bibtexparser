import React, { useContext, useEffect, useState } from "react";
import UploadForm from './UploadForm';
import Record from '../parser/Record';
import { bibContext, Records } from "../contexts/bibContext";
import RecordCard from './RecordCard';

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


const BibInput: React.FC = () => {
    const [editable, setEditable] = useState<boolean>(false);
    const { records, setRecords } = useContext<Records>(bibContext);

    useEffect(() => {
        addText(test);
    }, []);

    const addText = (text: string) => {
        // find the pattern of the type @type{entry_name, ...}
        let _text = text;
        if (_text[-1] !== '\n') {
            _text += '\n';
        }
        let pattern = /@(\w+)\s*\{(.*?),\n?([\s\S\t]*?=[\{\}\s\S\t]*?,?[^\w\.\)\!])\}[^\},]\n?/g;

        const records = _text.matchAll(pattern);
        const new_records: Record[] = [];
        for (const record of records) {
            let rec_type = record[1].toLowerCase();
            let entry_name = record[2];
            let entry_text = record[3];
            let new_record = new Record(rec_type, entry_name, record[0]);
            new_record.parse_text(entry_text);
            new_records.push(new_record);
        }

        setRecords((old_records) => ([...old_records, ...new_records]));
        setEditable(false);
    };

    return (
        <section className="main-container">
            <h1>BibTex entry</h1>
            <section className="input-container">
                <span className="input-header">
                    <strong>Found {records.length} entries</strong>
                    <span>
                        <button type='button' className='clean-button' onClick={() => (null)}>Sort & Clean!</button>
                        <button onClick={() => setEditable(true)}>Add entries</button>
                    </span>
                </span>
                <div className="record-list">
                    {records.map((record: Record, index: number) => (
                        <RecordCard record={record} key={index} />
                    ))}
                </div>
            </section>
            {editable &&
                    <UploadForm upload_type={'bib'} onChange={addText} />
            }
        </section>
    )
}

export default BibInput;