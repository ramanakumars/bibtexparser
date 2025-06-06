// import React, { useMemo, useState } from "react";
import { Author, parse_author } from "./Author";
import { journal_macros } from "./JournalMacros";
import { regex } from "regex";
import { recursion } from "regex-recursion-cjs";

function checkInt(val: string): boolean {
    var intRegex = /^-?\d+$/;
    if (!intRegex.test(val)) return false;

    var intVal = parseInt(val, 10);
    return parseFloat(val) == intVal && !isNaN(intVal);
}

export interface Entry {
    rec_type: string;
    entry_name: string;
    authors: Author[];
    text: string;
    journal: string;
    year: number;
    month: number | string;
    volume: number;
    doi: string;
    doiurl: string;
    [key: string]: any;
}

const add_accent = (
    text: string,
    match: string,
    accent: string,
    unicode: string
): string => {
    const re = new RegExp(`\\\\${accent}\\\\?\\{?(\\w)\\}?`, "gm");

    const accent_match = match.matchAll(re);
    for (const accenti of accent_match) {
        let accent_text: string = `${accenti[1]}${unicode}`;
        text = text.replace(accenti[0], accent_text);
    }

    return text;
};

export const sanitize_latex = (text: string) => {
    // return text.replace(/^"?\{?([\S\s]+?)\}?"?,?$/gm, "$1")
    const pattern_braces = regex({
        flags: "gm",
        plugins: [recursion],
        disable: { v: true, n: true },
    })`\{((?:[^\{\}]++|(?R=20))*)\}`;
    const pattern_quotes = regex({
        flags: "gm",
        plugins: [recursion],
        disable: { v: true, n: true },
    })`"((?:[^"]++|(?R=20))*)"`;

    // remove nested curly braces
    for (var i = 0; i < 5; i++) {
        let matches = text.matchAll(pattern_braces);
        for (const matchi of matches) {
            // fix all accents. Can probably do this in a loop but this works fine.
            text = add_accent(text, matchi[1], "'", "\u{0301}");
            text = add_accent(text, matchi[1], "`", "\u{0301}");
            text = add_accent(text, matchi[1], "^", "\u{0302}");
            text = add_accent(text, matchi[1], "~", "\u{0303}");
            text = add_accent(text, matchi[1], "v", "\u{030C}");
            text = add_accent(text, matchi[1], "c", "\u{0327}");
            text = add_accent(text, matchi[1], '"', "\u{0308}");

            let match = text.replace(matchi[0], matchi[1]);

            if (match) {
                text = match;
            }
        }
    }

    // remove nested quotes
    for (var i = 0; i < 5; i++) {
        let match = text.replace(pattern_quotes, "$1");
        if (match) {
            text = match;
        }
    }

    return text;
};

export const parse_text = (
    input_text: string,
    entry_name: string,
    rec_type: string
): Entry => {
    const text: string = input_text.replace("[\s]{2,50}?|[\n?]", "");

    // the entry pattern is [key] = [value],
    const text_pattern = regex({
        plugins: [recursion],
        flags: "gm",
        disable: { v: true },
    })`
        (?<key>\w+\s*=\s*)(?<value>[\s\S]+?),?\s+(?:(?=(\g<key>))|\})
    `;

    const matches = text.matchAll(text_pattern);

    const entry: Entry = {
        rec_type: rec_type.replace("@", ""),
        entry_name: entry_name,
        text: text,
        authors: [],
        journal: "",
        year: -1,
        month: "",
        volume: -1,
        doi: "",
        doiurl: "",
    };

    for (const match of matches) {
        let key = match[1]
            .toLowerCase()
            .trim()
            .replace(/\s*=\s*/, "");
        let value = sanitize_latex(match[2]);

        if (key == "author" || key == "authors") {
            const authors = value.split(" and");

            // get the list of authors
            for (const author of authors) {
                let authi = parse_author(author.trim());
                entry.authors.push(authi);
            }
        } else {
            switch (key) {
                case "journal":
                    let journal = value;

                    // check if the journal is a macro
                    if (journal[0] === "\\") {
                        if (journal_macros[journal]) {
                            journal = journal_macros[journal];
                        } else {
                            console.log(
                                `Error: Journal macro ${journal} not found for entry ${entry_name}`
                            );
                        }
                    }

                    entry.journal = journal;
                    break;
                case "year":
                    // convert hte year to an integer
                    entry.year = Number(value);
                    break;
                case "month":
                    // check if the month is an integer or a month name
                    if (checkInt(value)) {
                        entry.month = Number(value);
                    } else {
                        entry.month = value;
                    }
                    break;
                case "volume":
                    entry.volume = Number(
                        value.replace("{", "").replace("}", "")
                    );
                    break;
                case "doi":
                    entry.doi = value;
                    entry.doiurl = `https://doi.org/${value}`;
                    break;
                default:
                    entry[key] = value;
                    break;
            }
        }
    }

    return entry;
};

