import Record from "./Record";

export class bibtexParser {
    constructor(text) {
        this.text = text;
        this.records = [];
        this.get_records();
    }

    get_records() {
        let pattern = /@(\w+)\s*\{(.*?),\n?([\s\S\n\t]*?[^\w\.\)\!])\}/g;

        const records = this.text.matchAll(pattern);
        for (const record of records) {
            let rec_type = record[1].toLowerCase();
            let entry_name = record[2];
            let entry_text = record[3];
            let new_record = new Record(rec_type, entry_name);
            new_record.parse_text(entry_text);
            console.log(new_record.entry_name);
            this.records.push(new_record);
        }

        console.log(this.records.length);
    }
}