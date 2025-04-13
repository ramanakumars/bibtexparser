// import React, { useMemo, useState } from "react";
import Author from "./Author";
import { journal_macros } from "./JournalMacros";
import { regex } from 'regex';
import { recursion } from "regex-recursion-cjs";

function checkInt(val: string): boolean {
    var intRegex = /^-?\d+$/;
    if (!intRegex.test(val))
        return false;

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

export const parse_text = (input_text: string, rec_type: string): Entry => {
    const text: string = input_text.replace("[\s]{2,50}?|[\n?]", "");

    // the entry pattern is [key] = [entry],
    // text_pattern = r"(\w+)\s*=\s*\"?\{*\"?(.*?)\"?\}*\"?,?(,|$)"
    // const text_pattern: RegExp = /(((\w+)\s*=\s*([^=]+))(,|$))/g
    // const text_pattern = regex({ plugins: [recursion], flags: 'gm', disable: { v: true } })`
    //     (?<key>\w+\s?=\s?)(((?<value1>\{(?:[^\{\}]++|(\g<value1&R=20>)|(\g<value2>))*\})|(?<value2>"(?:[^"]+|(\g<value1>|(\g<value2&R=20>))*")))|(?<value3>([^{},"]+)))
    // `;

    const text_pattern = regex({ plugins: [recursion], flags: 'gm', disable: { v: true } })`
        (?<key>\w+\s?=\s?)(?<value>[\s\S]+?)\s+(?:(?=(\g<key>)))
    `;

    const matches = text.matchAll(text_pattern);

    let entry_name = "";

    const entry: Entry = {
        rec_type: rec_type.replace('@',''),
        entry_name: entry_name,
        text: text,
        authors: [],
        journal: "",
        year: -1,
        month: '',
        volume: -1,
        doi: '',
        doiurl: ''
    };

    for (const match of matches) {
        let key = match[1].toLowerCase().trim().replace(/\s?=\s?/, '');
        let value = match[2].replace(/^"?\{?([\S\s]+?)\}?"?,?$/gm, "$1");
        console.log("match: ", match[2]);

        console.log(key)
        if(value) {
            console.log("value: ", value);
        }


        if ((key == 'author') || (key == 'authors')) {
            const authors = value.split(" and");

            // get the list of authors
            for (const author of authors) {
                let authi = new Author(author.trim());
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
                            console.log(`Error: Journal macro ${journal} not found for entry ${entry_name}`);
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
                    entry.volume = Number(value.replace("{", "").replace("}", ""));
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
}



// class RecordOld {
//     /*
//     A class to represent a bibtex record
//     rec_type is the type of record (e.g., article, book, etc.)
//     entry_name is the ID of the entry
//     */

//     public authors: Author[];
//     public rec_type: string;
//     public entry_name: string;
//     public full_text: string;
//     public text: string = "";
//     public journal: string = "";
//     public year: number = 0;
//     public month: number | string = 0;
//     public volume: number = 0;
//     public doi: string = "";
//     public doiurl: string = "";
//     public key: string = "";
//     [key: string]: any;

//     constructor(rec_type: string, entry_name: string, full_text: string) {
//         this.authors = [];
//         this.rec_type = rec_type;
//         this.entry_name = entry_name;
//         this.full_text = full_text;
//     }

//     parse_text(input_text: string) {
//         this.text = input_text
//         const text: string = input_text.replace("[\s]{2,50}?|[\n?]", "");

//         // the entry pattern is [key] = [entry],
//         // text_pattern = r"(\w+)\s*=\s*\"?\{*\"?(.*?)\"?\}*\"?,?(,|$)"
//         const text_pattern: RegExp = /(((\w+)\s*=\s*([^=]+))(,|$))/g

//         const matches = text.matchAll(text_pattern);

//         for (const match of matches) {
//             let key = match[3].toLowerCase().trim();
//             let value = match[4].trim().replace('"', "");

//             if ((key == 'author') || (key == 'authors')) {
//                 const authors = value.split(" and");

//                 // get the list of authors
//                 for (const author of authors) {
//                     let authi = new Author(author.trim());
//                     this.authors.push(authi);
//                 }
//             } else {
//                 value = value.replace(/^\{/, "").replace(/\}$/, "")
//                 switch (key) {
//                     case "journal":
//                         this.journal = value;

//                         // check if the journal is a macro
//                         if (this.journal[0] === "\\") {
//                             if (journal_macros[this.journal]) {
//                                 this.journal = journal_macros[this.journal];
//                             } else {
//                                 console.log(`Error: Journal macro ${this.journal} not found for entry ${this.entry_name}`);
//                             }
//                         }
//                         break;
//                     case "year":

//                         // convert hte year to an integer
//                         this.year = Number(value);
//                         break;
//                     case "month":
//                         // check if the month is an integer or a month name
//                         if (checkInt(value)) {
//                             this.month = Number(value);
//                         } else {
//                             this.month = value;
//                         }
//                         break;
//                     case "volume":
//                         this.volume = Number(value.replace("{", "").replace("}", ""));
//                         break;
//                     case "doi":
//                         this.doi = value;
//                         this.doiurl = `https://doi.org/${value}`;
//                         break;
//                     default:
//                         this[key] = value;
//                         break;
//                 }

//             }
//         }
//     }
// }

// export default Record;