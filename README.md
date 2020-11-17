# bibtexparser
Parses .bib file into plaintext/HTML entries or clean up the .bib file


# Usage:
`python parse.py -h [--html] [--latex] [--clean] input`

positional arguments:
  input       input file (.bib)

optional arguments:

  `-h, --help`  show this help message and exit
  
  `--html`      parse into a bib.html file
  
  `--latex`     parse into a bib.tex file with each entry as an `\item`
  
  `--clean`     save to a ref_clean.bib file with entries sorted by entry name and duplicates removed
  
