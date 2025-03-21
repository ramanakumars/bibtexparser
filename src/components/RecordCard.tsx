import React, { useState } from 'react';
import Record from '../parser/Record';
import { FaChevronDown, FaChevronLeft } from "react-icons/fa";

interface RecordCardProps {
    record: Record;
}

const RecordCard: React.FC<RecordCardProps> = ({ record }) => {
    const [showText, setShowText] = useState(false);

    return (
        <section className="record">
            <span className="record-header-container">
                <div className="record-header">
                    <h2 className="title">{record.title}   ({record.year})</h2>
                    <h3 className="subtitle">{record.rec_type.toUpperCase()} ({record.entry_name})</h3>
                    <div className="author-container">
                        {record.authors.slice(0, 5).map((author, index) => (
                            <span key={index} className="author">{author.short_name}</span>
                        ))}
                    </div>
                </div>
                <button onClick={() => setShowText(!showText)}>
                    {!showText ? <FaChevronDown /> : <FaChevronLeft />}
                </button>
            </span>
            { showText && 
                <code className="record-text">
                    {record.full_text}
                </code>
            }
        </section>
    )
}

export default RecordCard;