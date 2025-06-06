import React, { useContext, useEffect, useMemo, useState } from "react";
import { bibContext } from "../contexts/bibContext";
import { tempContext } from "../contexts/tempContext";
import { template_to_text } from "../parser/template_to_text";
import "../css/output";
import WarningDisplay from "./Warning";
import { CopyIcon } from "./Icons";

interface ParsedProps {
    warnings: string[];
    text: string[];
}

const Output: React.FC = () => {
    const { entries } = useContext(bibContext);
    const { templates } = useContext(tempContext);
    const [isCopied, setCopied] = useState(false);

    const { warnings, text } = useMemo((): ParsedProps => {
        let parsed_templates = [];
        let warnings: string[] = [];
        let text: string[] = [];
        const template_types = templates.map((template) => template.entry_type);

        if (entries.length > 0) {
            parsed_templates = entries.map((entry) => {
                let template_index = template_types.indexOf(entry.rec_type);
                if (template_index === -1) {
                    template_index = template_types.indexOf("generic");
                }

                if (template_index !== -1) {
                    var text = "";
                    try {
                        text = template_to_text(
                            templates[template_index],
                            entry
                        );
                    } catch (error: unknown) {
                        return { text: null, warning: error as string };
                    }
                    return { text: text, warning: null };
                } else {
                    return {
                        text: null,
                        warning: `No templates found for ${entry.rec_type} type for ${entry.entry_name}!`,
                    };
                }
            });
            warnings = parsed_templates
                .filter((parsed_dict) => parsed_dict.warning !== null)
                .map((warning) => warning.warning);
            text = parsed_templates
                .filter((parsed_dict) => parsed_dict.text !== null)
                .map((t) => t.text);
        }

        return { warnings: warnings, text: text };
    }, [entries, templates]);

    const copyOutput = () => {
        const _text = text.join("\n");
        navigator.clipboard.writeText(_text).then(() => setCopied(true));
    };

    useEffect(() => {
        if (isCopied) {
            setTimeout(() => setCopied(false), 2000);
        }
    }, [isCopied]);

    return (
        <section id="output" className="main-container">
            <span className="main-header">
                <span>&nbsp;</span>
                <span>
                    <h1>Output: </h1>
                </span>
                <span>
                    <span className="w-fit flex flex-row items-center">
                        {isCopied ? "Copied!" : ""}
                        <a onClick={copyOutput}>
                            <CopyIcon />
                        </a>
                    </span>
                </span>
            </span>
            <WarningDisplay warnings={warnings} />
            {templates.length > 0 && (
                <div className="output-container">
                    {text.map((t, index) => (
                        <span key={`output_${index}`}>{t}</span>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Output;
