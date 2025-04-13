import React, { useContext, useState } from "react";
import { Entry } from "../parser/Record";
import { bibContext } from "../contexts/bibContext";
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


    if (!entry) {
        return null;
    }

    return (
        <div className="record">
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
                {/* <span className="title double-width">{record.title}</span> */}
                <Editable
                    value={entry.title}
                    setValue={(text) =>
                        updateEntry({ title: text })
                    }
                    className="title double-width"
                />
                <span className="subtitle single-width">
                    {entry.rec_type.toUpperCase()}
                </span>
                <span className="single-width">{entry.entry_name}</span>
                <span className="half-width">{entry.year}</span>
                <div className="author-container double-width">
                    {entry.authors.slice(0, 5).map((author, index) => (
                        <span key={index} className="author">
                            {author.short_name}
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

export default RecordCard;
