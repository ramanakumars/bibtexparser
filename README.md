# bibtexparser
Parses .bib file into plaintext/HTML entries or clean up the .bib file


# Usage:
`python parse.py -h [--clean] input [--template templatefile] [-output outputfile]`

positional arguments:
  input       input file (.bib)

optional arguments:

  `-h, --help`  show this help message and exit
  
  `-output` 	output file. Skip if you don't want the bib file parsed into an output. If the output file is not .tex, the entries will be corrected for unicode formatting (i.e. accents will formatted in unicode)

  `--template`  if outputting to a file, define a template for each entry. See details below.
  
  `--clean`     save to a ref_clean.bib file with entries sorted by entry name and duplicates removed
  

# Defining a template
Templates should be saved as a separate file (e.g. html.template), and each line should contain a string showing how the output should be formatted. Each keyword must be defined by a `$`, e.g. `$journal` is a placeholder for the journal name and `$year` is the placeholder for the year. 

The exceptions are the author variables. These should be defined as `$auth[s/f][num/a]`. The `s` defines the short format (e.g. Ramanakumar Sankar will be formatted as Sankar, R.), while `f` is for the full format (e.g. Ramanakumar Sankar or R. Sankar -- if the bib entry does not have the full first name). The `num` is the number of authors to show (only used in the `s` mode) before collapsing to et al. For example `$auths3` will be formatted as "Author1, Author2 and Author3" for three authors or less, or "Author1 et al." for more than three authors. Alternatively use 'a' to print all authors (e.g. `$authsa`). In the full (`f`) mode, all authors will be displayed. 

Groups of optional variables can be enclosed with a `{}`. Text inside a group will be removed if any of the keywords within that group do not exist in the bib entry. For example, arXiv preprints do no usually have a journal reference. Thus the formatter can be defined as `{$journal. $pages}`, and so if the journal keyword is missing in the bib entry, the whole group will be ignored. Curly braces can be escaped with a `\`, e.g. `\{...\}` will retain the curly braces in the final output. 

Different reference types (inbook, book, article) can be distinguished by putting `@[reftype]:` in front of the format string. e.g. `@inbook:[...]` string will format inbook entries. Seperate different formats by a new line. Leave the type blank to use a generic template. 

For DOIs, you can get the whole url using the `$doiurl` keyword or just the identifier with `$doi`. 

See the html.template or the tex.template for examples. Note: Make sure there are no hanging new lines in the .template file.

