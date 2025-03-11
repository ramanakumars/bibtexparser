import React, { useState } from 'react';
import { FaChevronDown, FaChevronLeft } from "react-icons/fa";

export default function RecordCard({ record }){
    const [showText, setShowText] = useState(false);

    return (
        <section className="record">
            <span className="record-header-container">
                <div className="record-header">
                    <h2 className="title">{record.title}</h2>
                    <h3 className="subtitle">{record.rec_type} ({record.entry_name})</h3>
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
