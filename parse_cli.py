from bibtexparser import bibtexParser
import argparse
from string import Template

argparser = argparse.ArgumentParser(description="Parse bibtex entries")
argparser.add_argument('input', nargs=1, help='input file (.bib)')
#argparser.add_argument('--html', help='parse into a HTML file', action="store_true")
#argparser.add_argument('--latex', help='parse into a .tex file with each entry as an \item', action="store_true")
#argparser.add_argument('--text', help='parse into a .txt file with each entry as a new line', action="store_true")
#argparser.add_argument('--short', help="short form -- only one or two authors", action="store_true")
argparser.add_argument('--sort', help="do not sort author list by name and year before saving (used for text option)", action="store_true")
argparser.add_argument('--clean', help='parse into a new .bib file after removing duplicated items and sorting by author', action="store_true")
argparser.add_argument('--template', help='template file to format records', nargs=1, default=['html.template'])
argparser.add_argument('-output', nargs=1, help='output file (.html, .tex)')

args = argparser.parse_args()


parser = bibtexParser(args.input[0])
if(args.output != None):
    print("Saving to %s"%(args.output[0]))
    template = args.template[0]
    parser.to_out(args.output[0], template, sort=args.sort, clean=args.clean)
else:
    if(args.clean):
        parser.cleanup()
