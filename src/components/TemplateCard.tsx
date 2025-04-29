import React from "react";
import { Block, Template, Group, AuthorBlock } from "../parser/template";
import { RiDeleteBin5Line } from "react-icons/ri";
import "../css/template.css";

interface TemplateCardProps {
    template: Template;
    deleteTemplate: () => void;
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
            <span className="template">
                {template.blocks.map((block, i) => {
                    if (block.type !== "group") {
                        return <BlockCard key={"block_" + i} block={block} />;
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
            </span>
            <span className="template-delete">
                <RiDeleteBin5Line onClick={deleteTemplate}/>
            </span>
        </span>
    );
};

const BlockCard: React.FC<BlockCardProps> = ({ block }) => {
    return (
        <span
            className={
                block.type === "keyword"
                    ? "block"
                    : block.text.trim() === ""
                    ? ""
                    : "other"
            }
        >
            {block.text}
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
