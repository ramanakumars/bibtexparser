from io import StringIO, BytesIO


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
                   'text': '    author  = {Peter Adams and PeterLastNameOnly and {van Author3}, '
                   'Peter},\n'
                   '    title   = {The title of the work},\n'
                   '    journal = {The name of the journal},\n'
                   '    year    = 1993,\n'
                   '    number  = 2,\n'
                   '    pages   = {201-213},\n'
                   '    month   = 7,\n'
                   '    note    = {An optional note},\n'
                   '    volume  = 4\n',
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
                   'text': '    author    = {Peter Babington},\n'
                   '    title     = {The title of the work},\n'
                   '    publisher = {The name of the publisher},\n'
                   '    year      = 1993,\n'
                   '    volume    = 4,\n'
                   '    series    = 10,\n'
                   '    address   = {The address},\n'
                   '    edition   = 3,\n'
                   '    month     = 7,\n'
                   '    note      = {An optional note},\n'
                   '    isbn      = {3257227892}\n',
                   'title': 'The title of the work',
                   'volume': 4,
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
                   'text': '    author       = {Peter Draper},\n'
                   '    title        = {The title of the work},\n'
                   '    booktitle    = {The title of the book},\n'
                   '    year         = 1993,\n'
                   '    editor       = {The editor},\n'
                   '    volume       = 4,\n'
                   '    series       = 5,\n'
                   '    pages        = 213,\n'
                   '    address      = {The address of the publisher},\n'
                   '    month        = 7,\n'
                   '    organization = {The organization},\n'
                   '    publisher    = {The publisher},\n'
                   '    note         = {An optional note}\n',
                   'title': 'The title of the work',
                   'volume': 4,
                   'year': 1993},
                  {'address': 'The address of the publisher',
                   'author': '{Peter Eston}',
                   'authors': [{'firstname': 'Peter', 'lastname': 'Eston'}],
                   'chapter': '8',
                   'doi': '10.01/someDOIURL',
                   'doiurl': 'https://doi.org/10.01/someDOIURL',
                   'edition': '3',
                   'entry_name': 'inbook',
                   'month': 7,
                   'pages': '201-213',
                   'publisher': 'The name of the publisher',
                   'rec_type': 'inbook',
                   'series': '5',
                   'text': '    author       = {Peter Eston},\n'
                   '    title        = {The title of the work},\n'
                   '    chapter      = 8,\n'
                   '    pages        = {201-213},\n'
                   '    publisher    = {The name of the publisher},\n'
                   '    year         = 1993,\n'
                   '    volume       = 4,\n'
                   '    series       = 5,\n'
                   '    address      = {The address of the publisher},\n'
                   '    edition      = 3,\n'
                   '    month        = 7,\n'
                   '    note         = {An optional note}\n'
                   '    doi          = {10.01/someDOIURL}\n',
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
                   'text': '    author       = {Peter Farindon},\n'
                   '    title        = {The title of the work},\n'
                   '    booktitle    = {The title of the book},\n'
                   '    publisher    = {The name of the publisher},\n'
                   '    year         = 1993,\n'
                   '    editor       = {The editor},\n'
                   '    volume       = 4,\n'
                   '    series       = 5,\n'
                   '    chapter      = 8,\n'
                   '    pages        = {201-213},\n'
                   '    address      = {The address of the publisher},\n'
                            '    edition      = 3,\n'
                            '    month        = 7,\n'
                            '    note         = {An optional note}\n',
                   'title': 'The title of the work',
                   'volume': 4,
                   'year': 1993},
                  {'address': 'The address of the publisher',
                   'author': "{Peter Su{\\'a}rez}",
                   'authors': [{'firstname': 'Peter', 'lastname': "Su\\'arez"}],
                   'entry_name': 'booklet',
                   'howpublished': 'How it was published',
                   'month': 7,
                   'note': 'An optional note',
                   'rec_type': 'booklet',
                   'text': '    title        = {The title of the work},\n'
                   "    author       = {Peter Su{\\'a}rez},\n"
                   '    howpublished = {How it was published},\n'
                   '    address      = {The address of the publisher},\n'
                   '    month        = 7,\n'
                   '    year         = 1993,\n'
                   '    note         = {An optional note}\n',
                   'title': 'The title of the work',
                   'year': 1993}]


tex_long_template = StringIO("""\item $authsa $year. $title. {\{\it $journal. $volume, $pages.\}}{\{\it $booktitle. $pages\}}{\{\it $publisher\}} {DOI: \href\{$doiurl\}\{$doi\}} 
@inbook:\item $authsa $year. $title. {\{\it $publisher, $pages\}}
@book:\item $authsa $year. $title. {\{\it $publisher\}}
@inproceedings:\item $authsa $year. $title. {\{\it $booktitle. $pages\}}""")

tex_long_output = ['\\item Adams, P., PeterLastNameOnly,  and van Author3, P.  1993. The title of the work. {\\it The name of the journal. 4, 201-213.}  \n',
                   '\\item Babington, P.  1993. The title of the work. {\\it The name of the publisher}\n',
                   '\\item Draper, P.  1993. The title of the work. {\\it The title of the book. 213}{\\it The publisher}  \n',
                   '\\item Eston, P.  1993. The title of the work. {\\it The name of the publisher, 201-213}\n',
                   '\\item Farindon, P.  1993. The title of the work. {\\it The title of the book. 201-213}{\\it The name of the publisher}  \n',
                   '\\item Suárez, P.  1993. The title of the work.   \n']


html_short_template = StringIO("""<li>$authf $year. $title.{ <i>$journal. $volume, $pages</i>.}{ (DOI: <a href='$doiurl'>$doi</a>)}</li>
@inbook:<li>$authf $year. $title.{ <i>$publisher, $pages</i>}{ (DOI: <a href='$doiurl'>$doi</a>)}</li>
@inproceedings:<li>$authf $year. $title.{ <i>$booktitle, $pages</i>}{ (DOI: <a href='$doiurl'>$doi</a>)}</li>
@book:<li>$authf $year. $title.{ <i>$publisher.</i>}{ (DOI: <a href='$doiurl'>$doi</a>)}</li>
""")

html_output = ['<li>Peter Adams,  PeterLastNameOnly, Peter van Author3 1993. The title of the work. <i>The name of the journal. 4, 201-213</i>.</li>\n',
               '<li>Peter Babington 1993. The title of the work. <i>The name of the publisher.</i></li>\n',
               '<li>Peter Draper 1993. The title of the work.</li>\n',
               "<li>Peter Eston 1993. The title of the work. <i>The name of the publisher, 201-213</i> (DOI: <a href='https://doi.org/10.01/someDOIURL'>10.01/someDOIURL</a>)</li>\n",
               '<li>Peter Farindon 1993. The title of the work.</li>\n',
               '<li>Peter Suárez 1993. The title of the work.</li>\n']
