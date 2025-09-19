import React, { useContext, useState } from "react";
import {
    Block,
    Template,
    Group,
    AuthorBlock,
    parse_template,
} from "../parser/template";
import "../css/template.css";
import { EditIcon, DeleteIcon } from "./Icons";
import EditForm from "./EditForm";
import { errorContext } from "../contexts/errorContext";

interface TemplateCardProps {
    template: Template;
    updateTemplate: (newTemplate: Template) => void;
    deleteTemplate: () => void;
}

interface AuthorCardProps {
    block: AuthorBlock;
}

interface BlockCardProps {
    block: Block;
}

interface GroupCardProps {
    group: Group;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
    template,
    updateTemplate,
    deleteTemplate,
}) => {
    const [editable, setEditable] = useState<boolean>(false);
    const { setError } = useContext(errorContext);

    const setNewTemplate = (new_template_text: string) => {
        if (new_template_text !== template.template_text) {
            var new_template: Template;
            try {
                new_template = parse_template(new_template_text);
                updateTemplate(new_template);
                setEditable(false);
            } catch (e) {
                setError(e as string);
            }
        } else {
            setEditable(false);
        }
    };

    return (
        <span className="template-container">
            <span className="template-entry-type">{template.entry_type}:</span>
            <span className="template">
                {template.blocks.map((block, i) => {
                    if (block.type != "group" && block.type != "author") {
                        return <BlockCard key={"block_" + i} block={block} />;
                    } else if (block.type === "author") {
                        return (
                            <AuthorCard
                                key={"author_" + i}
                                block={block as AuthorBlock}
                            />
                        );
                    } else {
                        return (
                            <GroupCard
                                key={"block_" + i}
                                group={block as Group}
                            />
                        );
                    }
                })}
                <a className="template-edit" onClick={() => setEditable(true)}>
                    <EditIcon />
                </a>
                <a className="template-delete" onClick={deleteTemplate}>
                    <DeleteIcon />
                </a>
            </span>
            <EditForm
                input_text={template.template_text}
                setText={setNewTemplate}
                editable={editable}
                setEditable={setEditable}
                className="edit-text"
            />
        </span>
    );
};

const AuthorCard: React.FC<AuthorCardProps> = ({ block }) => {
    return (
        <span className="author">
            author ({block.author_template.form === "s" ? "short" : "long"},{" "}
            {block.author_template.number === -1
                ? "all"
                : block.author_template.number}
            )
        </span>
    );
};

const BlockCard: React.FC<BlockCardProps> = ({ block }) => {
    return (
        <span
            className={
                block.type === "keyword" || block.type === "author"
                    ? "block"
                    : block.text.trim() === ""
                      ? ""
                      : "other"
            }
        >
            {block.type === "keyword"
                ? block.text.replace("$", "")
                : block.text}
        </span>
    );
};

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
    return (
        <span className="group">
            {group.blocks.map((block, i) => (
                <BlockCard key={"block_group_" + i} block={block} />
            ))}
        </span>
    );
};

export default TemplateCard;
