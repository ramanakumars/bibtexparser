import React from "react";
import Record from "../parser/Record";

interface OutputProps{
    records: Record[];
}

const Output: React.FC<OutputProps> = ({ records }) => {
    return (
        <section id="output" className="main-container">
            <h1>Output: </h1>
            {records.length > 0 ? <span>{records.length} entries found</span> : "" } 
        </section>
    )
}

export default Output;