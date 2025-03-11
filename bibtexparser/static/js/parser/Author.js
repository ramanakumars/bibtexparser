export default class Author {
    /*
    A class to represent an author in a bibtex entry
    author_text is the text in the author field
    This class breaks this text into first and last names
    */
    constructor(author_text) {
        this.author_text = author_text.replace(/[^\\]~/g, " ");

        // figure out if it is first name first or last name first
        if (/[^\\]\,\s?/.test(this.author_text)) {
            const nnames = this.author_text.split(", ");
            this.firstname = nnames[1];
            this.lastname = nnames[0];
        } else {
            // get the list of names in the author field
            let nnames = [...this.author_text.matchAll(/{?(\S+)}?/g)].map((value) => value[1]);

            // remove the initials
            const names_without_initials = nnames.filter((name) => !/\w\./.test(name));
            const initials = nnames.filter((name) => /\w\./.test(name));

            if(!initials) {
                initials = [];
            }

            if(names_without_initials.length > 1) {
                this.lastname = names_without_initials.slice(1).join(" ");
                this.firstname = names_without_initials[0] + " " + initials.join(" ");
                // this.firstname += " " + initials.join(" ");
            } else {
                this.lastname = names_without_initials[0];
                this.firstname = "";
            }
        }

        this.lastname = this.lastname.replace(/[{}]/g, "").trim();
        this.firstname = this.firstname.replace(/[{}]/g, "").trim();
    }

    get short_name() {
        /*
        Get the short name of the author in the format
        Lastname, F. M.
        */
        const first = this.firstname.split(" ");
        let short_first = ""

        if (first[0] != "") {
            for (const fname of first) {
                let fname_text = "";
                if(fname[0] === "{") {
                    fname_text = fname.match(/(\{.+\})/)[0];
                } else {
                    fname_text = fname[0];
                }
                short_first += fname_text + ". ";
            }
        }

        return `${this.lastname}, ${short_first.trim()}`;
    }

    get long_name() {
        /*
        Get the long name of the author in the format
        Firstname Middlenames Lastname
        */
        return `${this.firstname} ${this.lastname}`;
    }

}