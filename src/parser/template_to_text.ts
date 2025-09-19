import { Block, Template, AuthorBlock, Group, Blocks } from "./template";
import { Author, get_long_name, get_short_name } from "./Author";
import { journal_macros } from "./JournalMacros";
import { Entry } from "./parser";

export interface ParsedProps {
    warnings: string;
    text: string;
}

const authors_to_text = (entry: Entry, block: AuthorBlock): ParsedProps => {
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
        return {
            text: entry.authors.map((author) => naming(author)).join(", "),
            warnings: "",
        };
    } else {
        return {
            text:
                entry.authors
                    .slice(0, block.author_template.number)
                    .map((author) => naming(author))
                    .join(", ") + " et al.",
            warnings: "",
        };
    }
};

const block_to_text = (
    block: Block | Group | AuthorBlock,
    entry: Entry,
): ParsedProps => {
    if (block.type === "group") {
        const group: Group = block as Group;
        return group_to_text(group.blocks, entry);
    } else if (block.type === "author") {
        // author case
        return authors_to_text(entry, block as AuthorBlock);
    } else {
        const match = block.text.match(/\$([\w\d]+)/);

        // there are no variables here -- just return the text block as-is
        if (!match) {
            return { text: block.text, warnings: "" };
        }

        // found a match for a variable name (e.g., $journal, $doiurl, etc.)
        if (entry[match[1]]) {
            // parse journal macros
            if (match[1] === "journal") {
                var journal = entry[match[1]];
                var warning = "";
                // check if the journal is a macro
                if (journal[0] === "\\") {
                    if (journal_macros[journal]) {
                        journal = journal_macros[journal];
                    } else {
                        warning = `Error: Journal macro ${journal} not found for entry ${entry.entry_name}`;
                    }
                }
                return { text: journal, warnings: warning };
            }

            return { text: entry[match[1]], warnings: "" };
        } else {
            throw `entry ${match[1]} not found for ${entry.entry_name}`;
        }
    }
};

export const group_to_text = (blocks: Blocks, entry: Entry): ParsedProps => {
    try {
        const output = blocks.map((block) => block_to_text(block, entry));
        return {
            text: output.map((out) => out.text).join(""),
            warnings: output.map((out) => out.warnings).join(""),
        };
    } catch {
        return { text: "", warnings: "" };
    }
};

export const blocks_to_text = (blocks: Blocks, entry: Entry): ParsedProps => {
    const output = blocks.map((block) => block_to_text(block, entry));
    return {
        text: output.map((out) => out.text).join(""),
        warnings: output.map((out) => out.warnings).join(""),
    };
};

export const template_to_text = (
    template: Template,
    entry: Entry,
): ParsedProps => {
    return blocks_to_text(template.blocks, entry);
};

