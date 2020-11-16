from bibtexparser import bibtexParser
import argparse

argparser = argparse.ArgumentParser(description="Parse bibtex entries")
argparser.add_argument('input', nargs=1, help='input file (.bib)')
argparser.add_argument('--html', help='parse into a HTML file', action="store_true")
argparser.add_argument('--latex', help='parse into a .tex file with each entry as an \item', action="store_true")
argparser.add_argument('--clean', help='parse into a new .bib file after removing duplicated items and sorting by author', action="store_true")

args = argparser.parse_args()


parser = bibtexParser(args.input[0])
if(args.html):
    print("Saving to bib.html")
    parser.to_html('bib.html')

if(args.latex):
    print("Saving to bib.tex")
    parser.to_latex_item('bib.tex')

if(args.clean):
    print("Cleaning and saving as ref_clean.bib")
    parser.cleanup("ref_clean.bib")
