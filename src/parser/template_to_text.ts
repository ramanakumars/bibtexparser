import { Block, Template, AuthorBlock, Group, Blocks } from "./template";
import { Author, get_long_name, get_short_name } from "./Author";
import { Entry } from "./parser";

const authors_to_text = (entry: Entry, block: AuthorBlock): string => {
    var naming: (author: Author) => string;
    if (block.author_template.form === "s") {
        naming = get_short_name;
    } else {
        naming = get_long_name;
    }

    if (
        block.author_template.number === -1 ||
        entry.authors.length <= block.author_template.number
    ) {
        return entry.authors.map((author) => naming(author)).join(", ");
    } else {
        return (
            entry.authors
                .slice(0, block.author_template.number)
                .map((author) => naming(author))
                .join(", ") + " et al."
        );
    }
};

const block_to_text = (
    block: Block | Group | AuthorBlock,
    entry: Entry
): string => {
    if (block.type === "group") {
        const group: Group = block as Group;
        return group_to_text(group.blocks, entry);
    } else if (block.type === "author") {
        // author case
        return authors_to_text(entry, block as AuthorBlock);
    } else {
        const match = block.text.match(/\$([\w\d]+)/);
        if (match) {
            if (entry[match[1]]) {
                return entry[match[1]];
            } else {
                throw `entry ${match[1]} not found for ${entry.entry_name}`;
            }
        } else {
            return block.text;
        }
    }
};

export const group_to_text = (blocks: Blocks, entry: Entry): string => {
    try {
        return blocks.map((block) => block_to_text(block, entry)).join("");
    } catch {
        return "";
    }
};

export const blocks_to_text = (blocks: Blocks, entry: Entry): string => {
    return blocks.map((block) => block_to_text(block, entry)).join("");
};

export const template_to_text = (template: Template, entry: Entry): string => {
    return blocks_to_text(template.blocks, entry);
};
