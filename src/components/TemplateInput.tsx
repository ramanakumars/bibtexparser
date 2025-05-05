import React, { useContext, useEffect, useState } from "react";
import UploadForm from "./UploadForm";
import { parse_template, Template } from "../parser/template";
import { tempContext, Templates } from "../contexts/tempContext";
import TemplateCard from "./TemplateCard";

const AddCircle = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="icon icon-tabler icons-tabler-filled icon-tabler-circle-plus"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4.929 4.929a10 10 0 1 1 14.141 14.141a10 10 0 0 1 -14.14 -14.14zm8.071 4.071a1 1 0 1 0 -2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0 -2h-2v-2z" />
        </svg>
    );
};

const template_test = `
$auths2 $title.{ $journal, $pages.}{ \\item\\{ hi\\}} ($year)
@article $authsa $title. ($year)
`;

const checkUniqueTemplateTypes = (old_templates: Template[], new_templates: Template[]): Template[] => {
    const old_template_types = old_templates.map((template) => template.entry_type);
    const new_template_types = new_templates.map((template) => template.entry_type);
    
    const duplicate_entries = new_template_types.filter((_type, i) => old_template_types.indexOf(_type) != i);

    if(duplicate_entries.length > 0) {
        console.warn(`Found ${duplicate_entries.length} duplicated entry types for ${duplicate_entries}`);
    }

    const _templates = [...old_templates, ...new_templates.filter((template) => (duplicate_entries.indexOf(template.entry_type) != -1))];

    return _templates;
};

const TemplateInput: React.FC = () => {
    const [editable, setEditable] = useState<boolean>(false);
    const { templates, setTemplates } = useContext<Templates>(tempContext);

    const addText = (value: string) => {
        const _templates_text = value.split("\n");
        const _templates: Template[] = [];
        for (const _template of _templates_text) {
            if (_template != "") {
                const new_template: Template = parse_template(_template);
                _templates.push(new_template);
            }
        }
        setTemplates((old_templates) => checkUniqueTemplateTypes(old_templates, _templates));
        setEditable(false);
    };

    const deleteTemplate = (index: Number) => {
        setTemplates((_templates) => (
            _templates.filter((_template, _ind) => _ind != index)
        ))
    }

    useEffect(() => {
        addText(template_test);
    }, []);

    return (
        <section className="main-container">
            <h1>Template entry:</h1>
            <section className="input-container min-h-56">
                <span className="input-header">
                    <strong>Found {templates.length} entries</strong>
                    <span>
                        <a
                            onClick={() => setEditable(true)}
                            title="Add entries"
                            className="icon-button"
                        >
                            <AddCircle />
                        </a>
                    </span>
                </span>
                <div className="templates">
                    {templates.map((template, index) => (
                        <TemplateCard
                            key={"template_" + index}
                            template={template}
                            deleteTemplate={() => deleteTemplate(index)}
                        />
                    ))}
                </div>
            </section>
            {editable && <UploadForm upload_type={"temp"} onChange={addText} />}
        </section>
    );
};

export default TemplateInput;
