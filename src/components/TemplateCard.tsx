import React from "react";
import { Block, Template, Group, AuthorBlock } from "../parser/template";
import { RiDeleteBin5Line } from "react-icons/ri";
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
                <span className="template-delete">
                    <RiDeleteBin5Line onClick={deleteTemplate}/>
                </span>
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
