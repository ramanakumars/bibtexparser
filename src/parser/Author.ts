export interface Author {
    author_text: string;
    firstname: string;
    lastname: string;
}

export const parse_author = (author_text: string): Author => {
    const author: Author = {
        author_text: author_text.replace(/[^\\]~/g, " "),
        firstname: "",
        lastname: "",
    };

    // figure out if it is first name first or last name first
    if (/[^\\]\,\s?/.test(author.author_text)) {
        const nnames = author.author_text.split(", ");
        author.firstname = nnames[1];
        author.lastname = nnames[0];
    } else {
        // get the list of names in the author field
        let nnames = [...author.author_text.matchAll(/{?(\S+)}?/g)].map(
            (value) => value[1]
        );

        // remove the initials
        const names_without_initials = nnames.filter(
            (name) => !/\w\./.test(name)
        );
        const initials = nnames.filter((name) => /\w\./.test(name));

        // if(!initials) {
        //     initials = [];
        // }

        if (names_without_initials.length > 1) {
            author.lastname = names_without_initials.slice(1).join(" ");
            author.firstname =
                names_without_initials[0] + " " + initials.join(" ");
            // author.firstname += " " + initials.join(" ");
        } else {
            author.lastname = names_without_initials[0];
            author.firstname = "";
        }
    }

    author.lastname = author.lastname.replace(/[{}]/g, "").trim();
    author.firstname = author.firstname.replace(/[{}]/g, "").trim();

    return author;
};

export const get_short_name = (author: Author): string => {
    /*
    Get the short name of the author in the format
    Lastname, F. M.
    */
    const first = author.firstname.split(" ");
    let short_first = "";

    if (first[0] != "") {
        for (const fname of first) {
            let fname_text = "";
            if (fname[0] === "{") {
                const match = fname.match(/(\{.+\})/);
                fname_text = match ? match[0] : "";
            } else {
                fname_text = fname[0];
            }
            short_first += fname_text + ". ";
        }
    }

    return `${author.lastname}, ${short_first.trim()}`;
};

export const get_long_name = (author: Author): string => {
    /*
    Get the long name of the author in the format
    Firstname Middlenames Lastname
    */
    return `${author.firstname} ${author.lastname}`;
};

