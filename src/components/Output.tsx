import React, { useContext, useEffect, useMemo, useState } from "react";
import { bibContext } from "../contexts/bibContext";
import { tempContext } from "../contexts/tempContext";
import { template_to_text } from "../parser/template_to_text";
import "../css/output";
import WarningDisplay from "./Warning";
import { CopyIcon, SettingsIcon } from "./Icons";
import PopupContainer from "./PopupContainer";
import {
    journal_macros as base_journal_macros,
    JournalMacro,
} from "../parser/JournalMacros";

interface ParsedPropList {
    text: string[];
    warnings: string[];
}

const Output: React.FC = () => {
    const { entries } = useContext(bibContext);
    const { templates } = useContext(tempContext);
    const [isCopied, setCopied] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [journal_macros, setJournalMacros] = useState(base_journal_macros);

    const { warnings, text } = useMemo((): ParsedPropList => {
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
                    try {
                        return template_to_text(
                            templates[template_index],
                            entry,
                            journal_macros
                        );
                    } catch (error: unknown) {
                        return { text: "", warnings: error as string };
                    }
                } else {
                    return {
                        text: "",
                        warnings: `No templates found for ${entry.rec_type} type for ${entry.entry_name}!`,
                    };
                }
            });

            warnings = parsed_templates
                .filter((parsed_dict) => parsed_dict.warnings !== "")
                .map((warning) => warning.warnings);
            text = parsed_templates
                .filter((parsed_dict) => parsed_dict.text !== "")
                .map((t) => t.text);
        }

        return { warnings: warnings, text: text };
    }, [entries, templates, journal_macros]);

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
                    <a onClick={() => setShowSettings(true)}>
                        <SettingsIcon />
                    </a>
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
            {showSettings && (
                <Settings
                    journal_macros={journal_macros}
                    setJournalMacros={setJournalMacros}
                    closeFn={() => setShowSettings(false)}
                />
            )}
        </section>
    );
};

interface SettingsProps {
    journal_macros: JournalMacro;
    setJournalMacros: React.Dispatch<React.SetStateAction<JournalMacro>>;
    closeFn: () => void;
}

const Settings: React.FC<SettingsProps> = ({
    journal_macros,
    setJournalMacros,
    closeFn,
}) => {
    const changeValue = (key: string, value: string | null) => {
        if(!value) return null;
        setJournalMacros((prevState) => {

            // this key does not exist so we're not going to add it
            if(!prevState[key]) {
                return prevState;
            }

            prevState[key] = value;
            return Object.keys(prevState).sort().reduce((obj: JournalMacro, key: string) => {
                obj[key] = prevState[key];
                return obj;
            }, {})
        });
    };

    const changeKey = (key: string, value: string | null) => {
        if(!value) return null;
        setJournalMacros((prevState) => {

            // this key has not been changed so just update 
            if(prevState[value]) {
                return prevState;
            }

            const newObject: JournalMacro = {};

            delete Object.assign(newObject, prevState, {[value]: prevState[key] })[key];
            return Object.keys(newObject).sort().reduce((obj: JournalMacro, key: string) => {
                obj[key] = newObject[key];
                return obj;
            }, {})
        });
    };

    return (
        <PopupContainer onClick={() => closeFn()}>
            <div>Journal Macros</div>
            <div className="table">
                {Object.keys(journal_macros).map((macro) => (
                    <div className="table-row" key={macro}>
                        <div
                            className="table-entry quarter-width"
                            contentEditable="true"
                            onBlur={(e) =>
                                changeKey(macro, e.target.textContent)
                            }
                        >
                            {macro}
                        </div>
                        <div
                            className="table-entry"
                            contentEditable="true"
                            onBlur={(e) =>
                                changeValue(macro, e.target.textContent)
                            }
                        >
                            {journal_macros[macro]}
                        </div>
                    </div>
                ))}
            </div>
        </PopupContainer>
    );
};

export default Output;
