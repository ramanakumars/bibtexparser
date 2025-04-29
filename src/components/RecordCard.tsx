import React, { useEffect, useState } from "react";
import { Entry } from "../parser/parser";
import {
    Author,
    parse_author,
    get_long_name,
    get_short_name,
} from "../parser/author";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Editable from "./Editable";

interface UpdateProp {
    [key: string]: any;
}

interface RecordCardProps {
    entry: Entry;
    updateEntry: (new_entry: UpdateProp) => void;
    onSelect: () => void;
    onDeselect: () => void;
    isChecked: boolean;
}

const RecordCard: React.FC<RecordCardProps> = ({
    entry,
    updateEntry,
    onSelect,
    onDeselect,
    isChecked,
}) => {
    const [showText, setShowText] = useState(false);
    const [showAuthorEditor, setShowAuthorEditor] = useState(false);

    if (!entry) {
        return null;
    }

    return (
        <div className="record">
            {showAuthorEditor && (
                <AuthorEditor
                    authors={entry.authors}
                    setShowAuthorEditor={setShowAuthorEditor}
                    updateAuthors={(new_authors: Author[]) =>
                        updateEntry({ authors: new_authors })
                    }
                />
            )}
            <div className="record-contents">
                <span className="checkbox half-width">
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                            e.target.checked ? onSelect() : onDeselect()
                        }
                    />
                </span>
                <Editable
                    value={entry.title}
                    setValue={(text) => updateEntry({ title: text })}
                    className="title double-width"
                />
                <span className="subtitle single-width">
                    {entry.rec_type.toUpperCase()}
                </span>
                <Editable
                    value={entry.entry_name}
                    setValue={(text) => updateEntry({ entry_name: text })}
                    className="single-width"
                />

                <Editable
                    value={String(entry.year)}
                    setValue={(text) => updateEntry({ year: Number(text) })}
                    className="half-width"
                />
                <div className="author-container double-width">
                    {entry.authors.map((author, index) => (
                        <span
                            key={"author_" + index}
                            className="author"
                            onClick={() => setShowAuthorEditor(true)}
                        >
                            {get_long_name(author)}
                        </span>
                    ))}
                </div>
                <a onClick={() => setShowText(!showText)}>
                    {!showText ? <FaChevronDown /> : <FaChevronUp />}
                </a>
            </div>
            {showText && <code className="record-text">{entry.text}</code>}
        </div>
    );
};

interface AuthorEditorProps {
    authors: Author[];
    setShowAuthorEditor: (val: boolean) => void;
    updateAuthors: (new_authors: Author[]) => void;
}

const AuthorEditor: React.FC<AuthorEditorProps> = ({
    authors,
    setShowAuthorEditor,
    updateAuthors,
}) => {
    const [updated_authors, setUpdatedAuthors] = useState<string[]>(
        authors.map((author) => author.author_text)
    );

    return (
        <>
            <div
                className="author-editor-background"
                onClick={() => setShowAuthorEditor(false)}
            >
                &nbsp;
            </div>
            <div className="author-editor">
                <h2>Authors:</h2>
                <div className="author-list">
                    {updated_authors.map((author, index) => (
                        <Editable
                            value={author}
                            setValue={(text) =>
                                setUpdatedAuthors((_current_authors) =>
                                    _current_authors.map((authi: string, i) => {
                                        if (i == index) {
                                            return text;
                                        } else {
                                            return authi;
                                        }
                                    })
                                )
                            }
                            className="author-edit"
                        />
                    ))}
                </div>
                <button
                    onClick={() => {
                        updateAuthors(
                            updated_authors.map((author) =>
                                parse_author(author)
                            )
                        );
                        setShowAuthorEditor(false);
                    }}
                >
                    Submit!
                </button>
            </div>
        </>
    );
};

export default RecordCard;
