from io import StringIO

test_file = StringIO("""@article{article,
    author  = {Peter Adams and PeterLastNameOnly and {van Author3}, Peter},
    title   = {The title of the work},
    journal = {The name of the journal},
    year    = 1993,
    number  = 2,
    pages   = {201-213},
    month   = 7,
    note    = {An optional note},
    volume  = 4
}

@book{book,
    author    = {Peter Babington},
    title     = {The title of the work},
    publisher = {The name of the publisher},
    year      = 1993,
    volume    = 4,
    series    = 10,
    address   = {The address},
    edition   = 3,
    month     = 7,
    note      = {An optional note},
    isbn      = {3257227892}
}

@booklet{booklet,
    title        = {The title of the work},
    author       = {Peter Caxton},
    howpublished = {How it was published},
    address      = {The address of the publisher},
    month        = 7,
    year         = 1993,
    note         = {An optional note}
}

@conference{conference,
    author       = {Peter Draper},
    title        = {The title of the work},
    booktitle    = {The title of the book},
    year         = 1993,
    editor       = {The editor},
    volume       = 4,
    series       = 5,
    pages        = 213,
    address      = {The address of the publisher},
    month        = 7,
    organization = {The organization},
    publisher    = {The publisher},
    note         = {An optional note}
}

@inbook{inbook,
    author       = {Peter Eston},
    title        = {The title of the work},
    chapter      = 8,
    pages        = {201-213},
    publisher    = {The name of the publisher},
    year         = 1993,
    volume       = 4,
    series       = 5,
    address      = {The address of the publisher},
    edition      = 3,
    month        = 7,
    note         = {An optional note}
}

@incollection{incollection,
    author       = {Peter Farindon},
    title        = {The title of the work},
    booktitle    = {The title of the book},
    publisher    = {The name of the publisher},
    year         = 1993,
    editor       = {The editor},
    volume       = 4,
    series       = 5,
    chapter      = 8,
    pages        = {201-213},
    address      = {The address of the publisher},
    edition      = 3,
    month        = 7,
    note         = {An optional note}
}""")


bib_dict_check = [{'author': '{Peter Adams and PeterLastNameOnly and {van Author3}, Peter}',
        'authors': [{'firstname': 'Peter', 'lastname': 'Adams'},
                                {'firstname': '', 'lastname': 'PeterLastNameOnly'},
                                {'firstname': 'Peter', 'lastname': 'van Author3'}],
        'entry_name': 'article',
        'journal': 'The name of the journal',
        'month': 7,
        'note': 'An optional note',
        'number': '2',
        'pages': '201-213',
        'rec_type': 'article',
        'text': '  author  = {Peter Adams and PeterLastNameOnly and {van Author3}, '
                        'Peter},\n'
                        '  title   = {The title of the work},\n'
                        '  journal = {The name of the journal},\n'
                        '  year    = 1993,\n'
                        '  number  = 2,\n'
                        '  pages   = {201-213},\n'
                        '  month   = 7,\n'
                        '  note    = {An optional note},\n'
                        '  volume  = 4\n',
        'title': 'The title of the work',
        'volume': 4,
        'year': 1993},
    {'address': 'The address',
        'author': '{Peter Babington}',
        'authors': [{'firstname': 'Peter', 'lastname': 'Babington'}],
        'edition': '3',
        'entry_name': 'book',
        'isbn': '3257227892',
        'month': 7,
        'note': 'An optional note',
        'publisher': 'The name of the publisher',
        'rec_type': 'book',
        'series': '10',
        'text': '  author    = {Peter Babington},\n'
                        '  title     = {The title of the work},\n'
                        '  publisher = {The name of the publisher},\n'
                        '  year      = 1993,\n'
                        '  volume    = 4,\n'
                        '  series    = 10,\n'
                        '  address   = {The address},\n'
                        '  edition   = 3,\n'
                        '  month     = 7,\n'
                        '  note      = {An optional note},\n'
                        '  isbn      = {3257227892}\n',
        'title': 'The title of the work',
        'volume': 4,
        'year': 1993},
    {'address': 'The address of the publisher',
        'author': '{Peter Caxton}',
        'authors': [{'firstname': 'Peter', 'lastname': 'Caxton'}],
        'entry_name': 'booklet',
        'howpublished': 'How it was published',
        'month': 7,
        'note': 'An optional note',
        'rec_type': 'booklet',
        'text': '  title        = {The title of the work},\n'
                        '  author       = {Peter Caxton},\n'
                        '  howpublished = {How it was published},\n'
                        '  address      = {The address of the publisher},\n'
                        '  month        = 7,\n'
                        '  year         = 1993,\n'
                        '  note         = {An optional note}\n',
        'title': 'The title of the work',
        'year': 1993},
    {'address': 'The address of the publisher',
        'author': '{Peter Draper}',
        'authors': [{'firstname': 'Peter', 'lastname': 'Draper'}],
        'booktitle': 'The title of the book',
        'editor': 'The editor',
        'entry_name': 'conference',
        'month': 7,
        'note': 'An optional note',
        'organization': 'The organization',
        'pages': '213',
        'publisher': 'The publisher',
        'rec_type': 'conference',
        'series': '5',
        'text': '  author       = {Peter Draper},\n'
                        '  title        = {The title of the work},\n'
                        '  booktitle    = {The title of the book},\n'
                        '  year         = 1993,\n'
                        '  editor       = {The editor},\n'
                        '  volume       = 4,\n'
                        '  series       = 5,\n'
                        '  pages        = 213,\n'
                        '  address      = {The address of the publisher},\n'
                        '  month        = 7,\n'
                        '  organization = {The organization},\n'
                        '  publisher    = {The publisher},\n'
                        '  note         = {An optional note}\n',
        'title': 'The title of the work',
        'volume': 4,
        'year': 1993},
    {'address': 'The address of the publisher',
        'author': '{Peter Eston}',
        'authors': [{'firstname': 'Peter', 'lastname': 'Eston'}],
        'chapter': '8',
        'edition': '3',
        'entry_name': 'inbook',
        'month': 7,
        'note': 'An optional note',
        'pages': '201-213',
        'publisher': 'The name of the publisher',
        'rec_type': 'inbook',
        'series': '5',
        'text': '  author       = {Peter Eston},\n'
                        '  title        = {The title of the work},\n'
                        '  chapter      = 8,\n'
                        '  pages        = {201-213},\n'
                        '  publisher    = {The name of the publisher},\n'
                        '  year         = 1993,\n'
                        '  volume       = 4,\n'
                        '  series       = 5,\n'
                        '  address      = {The address of the publisher},\n'
                        '  edition      = 3,\n'
                        '  month        = 7,\n'
                        '  note         = {An optional note}\n',
        'title': 'The title of the work',
        'volume': 4,
        'year': 1993},
    {'address': 'The address of the publisher',
        'author': '{Peter Farindon}',
        'authors': [{'firstname': 'Peter', 'lastname': 'Farindon'}],
        'booktitle': 'The title of the book',
        'chapter': '8',
        'edition': '3',
        'editor': 'The editor',
        'entry_name': 'incollection',
        'month': 7,
        'note': 'An optional note',
        'pages': '201-213',
        'publisher': 'The name of the publisher',
        'rec_type': 'incollection',
        'series': '5',
        'text': '  author       = {Peter Farindon},\n'
                        '  title        = {The title of the work},\n'
                        '  booktitle    = {The title of the book},\n'
                        '  publisher    = {The name of the publisher},\n'
                        '  year         = 1993,\n'
                        '  editor       = {The editor},\n'
                        '  volume       = 4,\n'
                        '  series       = 5,\n'
                        '  chapter      = 8,\n'
                        '  pages        = {201-213},\n'
                        '  address      = {The address of the publisher},\n'
                        '  edition      = 3,\n'
                        '  month        = 7,\n'
                        '  note         = {An optional note}\n',
        'title': 'The title of the work',
        'volume': 4,
        'year': 1993}]
