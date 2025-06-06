import React, { useContext, useEffect, useState } from "react";
import UploadForm from "./UploadForm";
import { parse_template, Template } from "../parser/template";
import { tempContext, Templates } from "../contexts/tempContext";
import TemplateCard from "./TemplateCard";
import { errorContext } from "../contexts/errorContext";

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
$auths2 $title.{ $journal, $pages.}{ \\item\\{ $missing_key \\}} ($year)
@article $authsa $title. ($year)
`;

const checkUniqueTemplateTypes = (templates: Template[]): Template[] => {
    const template_types = templates.map((template) => template.entry_type);
    const duplicate_entries = template_types.filter(
        (_type, i) => template_types.indexOf(_type) != i
    );

    if (duplicate_entries.length > 0) {
        console.warn(
            `Found ${duplicate_entries.length} duplicated entry types for ${duplicate_entries}`
        );
    }

    const _templates = templates.filter(
        (template, index) =>
            template_types.indexOf(template.entry_type) == index
    );

    return _templates;
};

const TemplateInput: React.FC = () => {
    const [editable, setEditable] = useState<boolean>(false);
    const { templates, setTemplates } = useContext<Templates>(tempContext);
    const { setError } = useContext(errorContext);

    const addText = (value: string) => {
        const _templates_text = value.split("\n");
        const _templates: Template[] = [];
        try {
            for (const _template of _templates_text) {
                if (_template != "") {
                    const new_template: Template = parse_template(_template);
                    _templates.push(new_template);
                }
            }
            setTemplates((old_templates) =>
                checkUniqueTemplateTypes([...old_templates, ..._templates])
            );
            setEditable(false);
        } catch (e: unknown) {
            setError(e as string);
        }
    };

    const deleteTemplate = (index: number) => {
        setTemplates((_templates) =>
            _templates.filter((_template, _ind) => _ind != index)
        );
    };

    const updateTemplate = (index: number, newTemplate: Template) => {
        try {
            setTemplates((_templates) => {
                const new_templates = [..._templates];
                new_templates[index] = newTemplate;
                return checkUniqueTemplateTypes(new_templates);
            });
        } catch (e: unknown) {
            setError(e as string);
        }
    };

    useEffect(() => {
        addText(template_test);
    }, []);

    return (
        <section className="main-container">
            <span className="main-header">
                <span>
                    <h1>Template entry:</h1>
                </span>
            </span>
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
                            updateTemplate={(newTemplate: Template) =>
                                updateTemplate(index, newTemplate)
                            }
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
