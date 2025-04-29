import React, { useContext } from "react";
import { bibContext } from "../contexts/bibContext";
import { tempContext } from "../contexts/tempContext";
import { template_to_text } from "../parser/template_to_text";
import "../css/output";

interface OutputProps {}

const Output: React.FC<OutputProps> = () => {
    const { entries } = useContext(bibContext);
    const { templates } = useContext(tempContext);

    const template_types = templates.map((template) => template.entry_type);

    return (
        <section id="output" className="main-container">
            <h1>Output: </h1>
            {templates.length > 0 && (
                <div className="output-container">
                    {entries.map((entry, index) => {
                        let template_index = template_types.indexOf(
                            entry.rec_type
                        );
                        if (template_index === -1) {
                            template_index = template_types.indexOf("generic");
                        }

                        if (template_index !== -1) {
                            return (
                                <span key={`output_${index}`}>
                                    {template_to_text(
                                        templates[template_index],
                                        entry
                                    )}
                                </span>
                            );
                        } else {
                            console.error(`No templates found for ${entry.rec_type}!`)
                            return null;
                        }
                    })}
                </div>
            )}
        </section>
    );
};

export default Output;
