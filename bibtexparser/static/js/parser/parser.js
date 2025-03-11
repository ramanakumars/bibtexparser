import Record from "./Record";

export class bibtexParser {
    constructor(text) {
        this.text = text;
        this.records = [];
        this.get_records();
    }

}