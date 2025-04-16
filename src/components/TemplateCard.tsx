import React from "react";
import { Block, Template } from "../parser/template";
import "../css/template.css";

interface TemplateCardProps {
    template: Template;
}

interface BlockCardProps {
    block: Block;
}

interface GroupCardProps {
    blocks: Block[];
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
    return (
        <span className="template">
            {template.blocks.map((block, i) => {
                if (block.type !== "group") {
                    return <BlockCard key={"block_" + i} block={block} />;
                } else {
                    return (
                        <GroupCard
                            key={"block_" + i}
                            blocks={
                                template.groups[
                                    Number(
                                        block.text.charAt(block.text.length - 1)
                                    )
                                ]
                            }
                        />
                    );
                }
            })}
        </span>
    );
};

const BlockCard: React.FC<BlockCardProps> = ({ block }) => {
    return (
        <span className={block.type === "keyword" ? "block" : (block.text.trim() === "" ? "" : "other")}>
            {block.text}
        </span>
    );
};

const GroupCard: React.FC<GroupCardProps> = ({ blocks }) => {
    return (
        <span className="group">
            {blocks.map((block, i) => (
                <BlockCard key={"block_group_" + i} block={block} />
            ))}
        </span>
    );
};

export default TemplateCard;
