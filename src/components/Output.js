import React from "react";

export default function Output({ records }) {
    return (
        <section id="output" className="main-container">
            <h1>Output: </h1>
            {records.length > 0 ? <span>{records.length} entries found</span> : "" } 
        </section>
    )
}