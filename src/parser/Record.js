import Author from "./Author";
import { journal_macros } from "./JournalMacros";

function checkInt(val) {
    var intRegex = /^-?\d+$/;
    if (!intRegex.test(val))
        return false;

    var intVal = parseInt(val, 10);
    return parseFloat(val) == intVal && !isNaN(intVal);
}

export default class Record {
    /*
    A class to represent a bibtex record
    rec_type is the type of record (e.g., article, book, etc.)
    entry_name is the ID of the entry
    */

    constructor(rec_type, entry_name, full_text) {
        this.authors = [];
        this.rec_type = rec_type;
        this.entry_name = entry_name;
        this.full_text = full_text;
    }

    parse_text(input_text) {
        this.text = input_text
        const text = input_text.replace("[\s]{2,50}?|[\n?]", "");

        // the entry pattern is [key] = [entry],
        // text_pattern = r"(\w+)\s*=\s*\"?\{*\"?(.*?)\"?\}*\"?,?(,|$)"
        let text_pattern = /(((\w+)\s*=\s*([^=]+))(,|$))/g

        const matches = text.matchAll(text_pattern);

        for (const match of matches) {
            let key = match[3].toLowerCase().trim();
            let value = match[4].trim().replace('"', "");

            if ((key == 'author') || (key == 'authors')) {
                const authors = value.split(" and");

                // get the list of authors
                for (const author of authors) {
                    let authi = new Author(author.trim());
                    this.authors.push(authi);
                }
            } else {
                value = value.replace(/^\{/, "").replace(/\}$/, "")
                switch (key) {
                    case "journal":
                        this.journal = value;

                        // check if the journal is a macro
                        if (this.journal[0] === "\\") {
                            if (journal_macros[this.journal]) {
                                this.journal = journal_macros[this.journal];
                            } else {
                                console.log(`Error: Journal macro ${this.journal} not found for entry ${this.entry_name}`);
                            }
                        }
                        break;
                    case "year":

                        // convert hte year to an integer
                        this.year = Number(value);
                        break;
                    case "month":
                        // check if the month is an integer or a month name
                        if (checkInt(value)) {
                            this.month = Number(value);
                        } else {
                            this.month = value;
                        }
                        break;
                    case "volume":
                        this.volume = Number(value.replace("{", "").replace("}", ""));
                        break;
                    case "doi":
                        this.doi = value;
                        this.doiurl = `https://doi.org/${value}`;
                        break;
                    default:
                        this[key] = value;
                        break;
                }

            }
        }
    }
}