import React, { useState } from "react";
import Record from "../parser/Record";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface RecordCardProps {
    record: Record;
    onSelect: () => void;
    onDeselect: () => void;
    isChecked: boolean;
}

const RecordCard: React.FC<RecordCardProps> = ({ record, onSelect, onDeselect, isChecked }) => {
    const [showText, setShowText] = useState(false);

    return (
        <div className="record">
            <div className="record-contents">
                <span className="checkbox half-width"><input type="checkbox" checked={isChecked} onChange={(e) => e.target.checked ? onSelect() : onDeselect()}/></span>
                <span className="title double-width">{record.title}</span>
                <span className="subtitle single-width">
                    {record.rec_type.toUpperCase()}
                </span>
                <span className="single-width">{record.entry_name}</span>
                <span className="half-width">{record.year}</span>
                <div className="author-container double-width">
                    {record.authors.slice(0, 5).map((author, index) => (
                        <span key={index} className="author">
                            {author.short_name}
                        </span>
                    ))}
                </div>
                <a onClick={() => setShowText(!showText)}>
                    {!showText ? <FaChevronDown /> : <FaChevronUp />}
                </a>
            </div>
            {showText && (
                <code className="record-text">{record.full_text}</code>
            )}
        </div>
    );
};

export default RecordCard;
