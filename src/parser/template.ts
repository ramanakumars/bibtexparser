import { regex } from "regex";
import { recursion } from "regex-recursion-cjs";

type Block = string[];

export interface Template {
    entry_type: string;
    author_template: { form: string, number: Number};
    blocks: Block;
    groups: Block[];
}

const isNumeric = (val: string): boolean => {
    var intRegex = /^-?\d+$/;
    if (!intRegex.test(val))
        return false;

    var intVal = parseInt(val, 10);
    return parseFloat(val) == intVal && !isNaN(intVal);
}

export const parse_template = (template_text: string): Template => {
    const template: Template = {
        entry_type: "",
        author_template: {form: '', number: 0},
        blocks: [],
        groups: []
    };
    console.log(template_text);

    const group_pattern = regex({ plugins: [recursion], flags: 'gm'})`(?!<\\)\{((?:\\\{|\\\}|[^\{\}])++|(?R=4))*(?!<\\)\}`;
    const re = regex({ plugins: [recursion], flags: 'gm'})`(?<keyword>\$(\w+))|(?<other>[^\$]|(?<dollar>\\\$))`;
    const group_matches = template_text.matchAll(group_pattern);

    var new_text: string = template_text;
    var index = 0;
    for(const group of group_matches) {
        console.log(group);
        new_text = new_text.replace(group[0], `\$group${index}`)
        const group_block = [];
        const group_matches = group[1].matchAll(re);
        for(const match of group_matches) {
            group_block.push(match[0]);
        }
        template.groups.push(group_block);
        index++;
    }
    const blocks = new_text.matchAll(re);

    for(const block of blocks) {
        template.blocks.push(block[0]);
    }

    console.log(template);
    
    return template;
}