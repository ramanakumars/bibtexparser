import React, { useContext, useEffect, useState } from "react";
import UploadForm from "./UploadForm";
import { Entry, parse_text } from "../parser/parser";
import { bibContext, Entries } from "../contexts/bibContext";
import RecordList from "./RecordList";
import { regex } from "regex";
import { recursion } from "regex-recursion-cjs";

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
    const { entries, setEntries } = useContext<Entries>(bibContext);

    useEffect(() => {
        addText(test);
    }, []);

    const addText = (text: string) => {
        // find the pattern of the type @type{entry_name, ...}
        let _text = text;
        if (_text[-1] !== "\n") {
            _text += "\n";
        }
        const re = regex({
            plugins: [recursion],
            flags: "gm",
            disable: { v: true },
        })`(?<rec_type>@\w+)(?<rec_text>\{(?:[^\{\}]++|(\g<rec_text&R=20>))*\})`;
        //`(\w+\s=\s)?\{(?>[^\{\}]+|(?R))*\}`;
        // /@(\w+)\s*\{(.*?),\n?([\s\S\t]*?=[\{\}\s\S\t]*?,?[^\w\.\)\!])\}[^\},]\n?/g;

        const entries = _text.matchAll(re);

        if (!entries) return null;

        const new_entries: Entry[] = [];
        for (const entry of entries) {
            let rec_type = entry[1].toLowerCase();
            let match = [...entry[2].matchAll(/^\{(\S+),/g)];
            let entry_name: string = "";
            if(match) {
                entry_name = match[0][1];
            }
            let new_entry: Entry = parse_text(entry[0], entry_name, rec_type);
            new_entries.push(new_entry);
        }

        setEntries((old_entries) => [...old_entries, ...new_entries]);
        setEditable(false);
    };

    return (
        <section className="main-container">
            <h1>BibTex entry</h1>
            <section className="input-container">
                <span className="input-header">
                    <strong>Found {entries.length} entries</strong>
                    <span>
                        <button
                            type="button"
                            className="clean-button"
                            onClick={() => null}
                        >
                            Sort & Clean!
                        </button>
                        <button onClick={() => setEditable(true)}>
                            Add entries
                        </button>
                    </span>
                </span>
                <RecordList />
            </section>
            {editable && <UploadForm upload_type={"bib"} onChange={addText} />}
        </section>
    );
};

export default BibInput;
