import React from "react";
import { Block, Template, Group, AuthorBlock } from "../parser/template";
import "../css/template.css";

interface TemplateCardProps {
    template: Template;
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

const DeleteIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-trash"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 7l16 0" />
            <path d="M10 11l0 6" />
            <path d="M14 11l0 6" />
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
        </svg>
    );
};


const TemplateCard: React.FC<TemplateCardProps> = ({ template, deleteTemplate }) => {
    return (
        <span className="template-container">
            <span className="template-entry-type">
                {template.entry_type}:
            </span>
            <span className="template">
                {template.blocks.map((block, i) => {
                    if ((block.type != "group")&&(block.type != "author")) {
                        return <BlockCard key={"block_" + i} block={block} />;
                    } else if (block.type === 'author') {
                        return <AuthorCard key={"author_" + i} block={block as AuthorBlock} />;
                    } else {
                        return (
                            <GroupCard
                                key={"block_" + i}
                                group={
                                    block as Group
                                }
                            />
                        );
                    }
                })}
                <a className="template-delete" onClick={deleteTemplate}>
                    <DeleteIcon />
                </a>
            </span>
        </span>
    );
};


const AuthorCard: React.FC<AuthorCardProps> = ({ block }) => {
    return (
        <span className="author">
            author ({ block.author_template.form === "s" ? "short" : "long" }, {block.author_template.number === -1 ? 'all' : block.author_template.number})
        </span>
    );
};

const BlockCard: React.FC<BlockCardProps> = ({ block }) => {
    return (
        <span
            className={
                ((block.type === "keyword") || (block.type === "author"))  ? "block" : ((block.text.trim() === "") ? "" : "other")
            }
        >
            {block.type === 'keyword' ? block.text.replace('$', '') : block.text }
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
