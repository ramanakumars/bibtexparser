import React, { useContext, useEffect, useState } from "react";
import UploadForm from "./UploadForm";
import { IoMdAddCircle } from "react-icons/io";
import { parse_template, Template } from "../parser/template";
import { tempContext, Templates } from "../contexts/tempContext";
import TemplateCard from "./TemplateCard";

const template_test = `
$auths2 $title.{ $journal, $pages.}{ \\item\\{ $hi \\}} ($year)
`;

const TemplateInput: React.FC = () => {
    const [editable, setEditable] = useState<boolean>(false);
    const { templates, setTemplates } = useContext<Templates>(tempContext);

    const addText = (value: string) => {
        const _templates_text = value.split("\n");
        const _templates: Template[] = [];
        for (const _template of _templates_text) {
            if (_template != "") {
                _templates.push(parse_template(_template));
            }
        }
        setTemplates((old_templates) => [...old_templates, ..._templates]);
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
                            <IoMdAddCircle />
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
