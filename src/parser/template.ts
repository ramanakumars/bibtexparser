import { regex } from "regex";
import { recursion } from "regex-recursion-cjs";

export interface Block {
    type: string;
    text: string;
}

export interface Group extends Block {
    blocks: Block[];
}

export interface AuthorBlock extends Block {
    author_template: { form: string; number: number };
}

export type Blocks = (Block | Group | AuthorBlock)[];

export interface Template {
    template_text: string;
    entry_type: string;
    blocks: Blocks;
}

const isNumeric = (val: string): boolean => {
    var intRegex = /^-?\d+$/;
    if (!intRegex.test(val)) return false;

    var intVal = parseInt(val, 10);
    return parseFloat(val) == intVal && !isNaN(intVal);
};

const get_groups_and_blocks = (text: string, start: number): Blocks => {
    const group_pattern = regex({
        plugins: [recursion],
        flags: "gm",
    })`(?!<\\)\{((?:\\\{|\\\}|[^\{\}])++|(?R=4))*(?!<\\)\}`;
    const re = regex({ plugins: [recursion], flags: "gm" })`
        (?<keyword>\$(\w+))|
        (?<other>[^\$\\\{\}]|
            (\\\$|(\\(?![\{\}]))|(\\\{)|(\\\}))
        )*`;

    const new_groups: Group[] = [];
    const new_blocks: Blocks = [];

    const group_matches = text.matchAll(group_pattern);

    var new_text: string = text;
    var index: number = start;
    for (const group of group_matches) {
        new_text = new_text.replace(group[0], `\$group${index}`);
        const group_matches = group[1].matchAll(re);
        const group_block: Blocks = [];
        for (const match of group_matches) {
            const groups = match.groups
                ? match.groups
                : { keyword: "", other: "", dollar: "" };
            const type = Object.keys(groups).find(
                (key) => groups[key] !== undefined
            );
            const blocki: Block = { type: type ? type : "", text: match[0] };
            group_block.push(blocki);
        }
        const group_obj: Group = {
            type: "group",
            text: group[0],
            blocks: group_block,
        };
        new_groups.push(group_obj);
        index++;
    }
    const blocks = new_text.matchAll(re);

    for (const block of blocks) {
        let type: string = "";
        let blocki: Block | Group | AuthorBlock;
        if (block[0].indexOf("$group") !== -1) {
            type = "group";
            const index = Number(block[0].replace("$group", ""));
            blocki = new_groups[index];
        } else if (block[0].indexOf("$auth") !== -1) {
            const author_template = block[0]
                .matchAll(/auth([sf])([0-9]+|a)?/g)
                .next();
            var author_template_entry;
            if (author_template.value) {
                author_template_entry = {
                    form: author_template.value[1],
                    number:
                        author_template.value[2] === "a"
                            ? -1
                            : isNumeric(author_template.value[2])
                              ? Number(author_template.value[2])
                              : 0,
                };
            }
            blocki = {
                type: "author",
                text: block[0],
                author_template: author_template_entry,
            };
        } else {
            const groups = block.groups
                ? block.groups
                : { keyword: "", other: "", dollar: "" };
            type = Object.keys(groups).find(
                (key) => groups[key] !== undefined
            ) as string;
            blocki = { type: type ? type : "", text: block[0] };
        }
        new_blocks.push(blocki);
    }

    return new_blocks;
};

export const parse_template = (template_text: string): Template => {
    const template: Template = {
        template_text: template_text,
        entry_type: "",
        blocks: [],
    };

    const type_match = template_text.match(/\@(\w+)/);

    if (type_match) {
        template.entry_type = type_match[1];
        template_text = template_text.replace(type_match[0], "").trim();
    } else {
        template.entry_type = "generic";
    }

    const blocks = get_groups_and_blocks(template_text, 0);

    template.blocks = blocks;

    const author_template_search: Blocks = template.blocks.filter(
        (block) => block.type === "author"
    );
    if (author_template_search.length !== 1) {
        throw `There must be atleast one author template and it must not be in an optional group! Currently found ${author_template_search.length} templates for authors`;
    }

    return template;
};
