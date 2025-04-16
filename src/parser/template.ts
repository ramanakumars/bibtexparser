import { regex } from "regex";
import { recursion } from "regex-recursion-cjs";

export interface Block {
    type: string;
    text: string;
}

type Blocks = Block[];

export interface Template {
    entry_type: string;
    author_template: { form: string, number: Number };
    blocks: Blocks;
    groups: Blocks[];
}

const isNumeric = (val: string): boolean => {
    var intRegex = /^-?\d+$/;
    if (!intRegex.test(val))
        return false;

    var intVal = parseInt(val, 10);
    return parseFloat(val) == intVal && !isNaN(intVal);
}

const get_groups_and_blocks = (text: string, start: number): { groups: Blocks[], blocks: Blocks } => {
    const group_pattern = regex({ plugins: [recursion], flags: 'gm' })`(?!<\\)\{((?:\\\{|\\\}|[^\{\}])++|(?R=4))*(?!<\\)\}`;
    const re = regex({ plugins: [recursion], flags: 'gm' })`
        (?<keyword>\$(\w+))|
        (?<other>[^\$\\\{\}]|
            (\\\$|(\\(?![\{\}]))|(\\\{)|(\\\}))
        )*`;

    const new_groups: Blocks[] = [];
    const new_blocks: Blocks = [];

    const group_matches = text.matchAll(group_pattern);

    var new_text: string = text;
    var index: number = start;
    for (const group of group_matches) {
        new_text = new_text.replace(group[0], `\$group${index}`)
        const group_block: Block[] = [];
        const group_matches = group[1].matchAll(re);
        for (const match of group_matches) {
            const groups = match.groups ? match.groups : { keyword: "", other: "", dollar: "" };
            const type = Object.keys(groups).find((key) => groups[key] !== undefined);
            const blocki: Block = { type: type ? type : "", text: match[0] };
            group_block.push(blocki);
        }
        new_groups.push(group_block);
        index++;
    }
    const blocks = new_text.matchAll(re);

    for (const block of blocks) {
        let type: string = "";
        if(block[0].indexOf("$group") !== -1) {
            type = "group";
        } else {
            const groups = block.groups ? block.groups : { keyword: "", other: "", dollar: "" };
            type = Object.keys(groups).find((key) => groups[key] !== undefined) as string;
        }
        const blocki: Block = { type: type ? type : "", text: block[0] };
        new_blocks.push(blocki);
    }

    return { blocks: new_blocks, groups: new_groups}
}

export const parse_template = (template_text: string): Template => {
    const template: Template = {
        entry_type: "",
        author_template: { form: '', number: 0 },
        blocks: [],
        groups: []
    };

    const { groups, blocks } = get_groups_and_blocks(template_text, 0);

    template.groups = groups;
    template.blocks = blocks;

    const author_template_search: Blocks = template.blocks.filter((block) => (block.text.indexOf("$auth") !== -1));
    if (author_template_search.length !== 1) {
        throw (`There must be atleast one author template and it must not be in an optional group! Currently found ${author_template_search.length} templates for authors`)
    }

    const author_template = author_template_search[0].text.matchAll(/auth([sf])([0-9]+|a)?/g).next();

    if (author_template.value) {
        template.author_template.form = author_template.value[1];
        template.author_template.number = author_template.value[2] === "a" ? -1 : (isNumeric(author_template.value[2]) ? Number(author_template.value[2]) : 0);
    }

    return template;
}