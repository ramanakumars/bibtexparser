import unittest
from ..parser import bibtexParser
from io import StringIO
from .test_outputs import (bib_dict_check, tex_long_output,
                           html_output, html_short_output)
import os

unittest.util._MAX_LENGTH = 2000


def todict(obj, classkey=None):
    if hasattr(obj, "__iter__") and not isinstance(obj, str):
        return [todict(v, classkey) for v in obj]
    elif hasattr(obj, "__dict__"):
        data = dict([(key, todict(value, classkey))
                     for key, value in obj.__dict__.items()
                     if not callable(value) and not key.startswith('_')])
        return data
    else:
        return obj


class TestBibReader(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bib = bibtexParser(os.path.dirname(__file__) + '/test.bib')
        cls.bib.get_records()

    def test_bib_record_count(self):
        # test to make sure that the reader loaded all the entries
        self.assertEqual(len(self.bib.records), 6)

    def test_bib_records(self):
        # test to make sure that the reader loaded
        # all the attributes from each bib entry
        bib_dict = todict(self.bib.records)

        self.assertEqual(bib_dict, bib_dict_check)

    def test_latex_output(self):
        # test a short LateX style output
        template = StringIO("""\item $authsa $year. $title. {\{\it $journal. $volume, $pages.\}}{\{\it $booktitle. $pages\}}{\{\it $publisher\}} {DOI: \href\{$doiurl\}\{$doi\}} 
@inbook:\item $authsa $year. $title. {\{\it $publisher, $pages\}}
@book:\item $authsa $year. $title. {\{\it $publisher\}}
@inproceedings:\item $authsa $year. $title. {\{\it $booktitle. $pages\}}""")
        outfile = StringIO()
        self.bib.to_out(outfile, template, convunicode=False)
        outfile.seek(0)
        bib_formatted = outfile.readlines()

        self.assertEqual(bib_formatted, tex_long_output)

    def test_bib_html_output(self):
        # test a HTML style output after cleaning and sorting
        outfile = StringIO()
        template = StringIO("""<li>$authf $year. $title.{ <i>$journal. $volume, $pages</i>.}{ (DOI: <a href='$doiurl'>$doi</a>)}</li>
@inbook:<li>$authf $year. $title.{ <i>$publisher, $pages</i>}{ (DOI: <a href='$doiurl'>$doi</a>)}</li>
@inproceedings:<li>$authf $year. $title.{ <i>$booktitle, $pages</i>}{ (DOI: <a href='$doiurl'>$doi</a>)}</li>
@book:<li>$authf $year. $title.{ <i>$publisher.</i>}{ (DOI: <a href='$doiurl'>$doi</a>)}</li>
""")
        self.bib.to_out(outfile, template, clean=True, sort=True)
        outfile.seek(0)
        bib_formatted = outfile.readlines()

        self.assertEqual(bib_formatted, html_output)

    def test_bib_short_html_output(self):
        # test a HTML style output after cleaning and sorting
        outfile = StringIO()
        template = StringIO("""<li>$auths1 $year. $title.{ <i>$journal. $volume, $pages</i>.}{ (DOI: <a href='$doiurl'>$doi</a>)}</li>
""")
        self.bib.to_out(outfile, template, clean=True, sort=True)
        outfile.seek(0)
        bib_formatted = outfile.readlines()

        self.assertEqual(bib_formatted, html_short_output)

    def test_bib_cleanup(self):
        # test a HTML style output after cleaning and sorting
        outfile = StringIO()
        self.bib.cleanup(sort=True, save=True, outfile=outfile)
        outfile.seek(0)
        bib_formatted = outfile.read()
        with open(os.path.dirname(__file__) + '/test_cleaned.bib', 'r') as in_cleaned:
            cleanded_bib = in_cleaned.read()

        self.assertEqual(bib_formatted, cleanded_bib)


class TestBibErrors(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bib = bibtexParser(os.path.dirname(__file__) + '/test.bib')
        cls.bib.get_records()

    def test_bad_author_templates(self):
        # test no numbering on short author template
        template = StringIO("$auths  \n")
        outfile = StringIO()
        with self.assertRaises(ValueError):
            self.bib.to_out(outfile, template)

        # test having multiple author templates
        template = StringIO("$auths2 $authf  \n")
        outfile = StringIO()
        with self.assertRaises(ValueError):
            self.bib.to_out(outfile, template)

        # test bad author templating
        template = StringIO("$autha  \n")
        outfile = StringIO()
        with self.assertRaises(IndexError):
            self.bib.to_out(outfile, template)

        # test having no author
        template = StringIO("$title  \n")
        outfile = StringIO()
        with self.assertRaises(IndexError):
            self.bib.to_out(outfile, template)
