import React, { useContext } from "react";
import { bibContext } from "../contexts/bibContext";
import { tempContext } from "../contexts/tempContext";
import { template_to_text } from "../parser/template_to_text";
import "../css/output";

interface OutputProps {}

const Output: React.FC<OutputProps> = () => {
    const { entries } = useContext(bibContext);
    const { templates } = useContext(tempContext);

    return (
        <section id="output" className="main-container">
            <h1>Output: </h1>
            {entries.length > 0 ? (
                <span>{entries.length} entries found</span>
            ) : (
                ""
            )}
            { templates.length > 0 &&
            <div className="output-container">
                {entries.map((entry) => (
                    <span>{template_to_text(templates[0], entry)}</span>
                ))}
            </div>
            }
        </section>
    );
};

export default Output;
