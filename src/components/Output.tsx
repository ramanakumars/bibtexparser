import React from "react";
import { Entry } from "../parser/Record";

interface OutputProps{
    entries: Entry[];
}

const Output: React.FC<OutputProps> = ({ entries }) => {
    return (
        <section id="output" className="main-container">
            <h1>Output: </h1>
            {entries.length > 0 ? <span>{entries.length} entries found</span> : "" } 
        </section>
    )
}

export default Output;