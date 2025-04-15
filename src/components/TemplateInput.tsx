import React, { useContext, useEffect, useState } from "react";
import UploadForm from './UploadForm';
import { IoMdAddCircle } from "react-icons/io";
import { parse_template, Template } from "../parser/template";
import { tempContext, Templates } from "../contexts/tempContext";

const template_test = `
$authsa $year $title. { $journal $pages }  { \\item\\{ $hi \\} }
`

const TemplateInput: React.FC = () => {
    const [editable, setEditable] = useState<boolean>(false);
    const [text, setText] = useState<string>('');
    const {templates, setTemplates} = useContext<Templates>(tempContext);

    const addText = (value: string) => {
        const _templates_text = template_test.split('\n');
        const _templates: Template[] = []
        for(const _template of _templates_text) {
            if(_template != '') {
                _templates.push(parse_template(_template));
            }
        }
        setTemplates((old_templates) => [...old_templates, ..._templates]);
        setEditable(false);
    };

    useEffect(() => {
        addText(template_test);
    }, []);

    return (
        <section className="main-container">
            <h1>Template entry:</h1>
            <section className='input-container'>
                <span className="input-header">
                    <strong>Found {templates.length} entries</strong>
                    <span>
                        <a onClick={() => setEditable(true)} title="Add entries" className="icon-button">
                            <IoMdAddCircle/>
                        </a>
                    </span>
                </span>
                <div className="templates">

                </div>
            </section>
            { editable && <UploadForm upload_type={'temp'} onChange={ addText }/> }
        </section>
    )
}

export default TemplateInput;