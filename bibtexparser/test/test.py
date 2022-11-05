import unittest
from ..parser import bibtexParser
from io import StringIO
from .test_file import (test_file, bib_dict_check,
                        tex_long_template, tex_long_output,
                        html_short_template, html_output)
import pprint

unittest.util._MAX_LENGTH = 2000


def todict(obj, classkey=None):
    if isinstance(obj, dict):
        data = {}
        for (k, v) in obj.items():
            data[k] = todict(v, classkey)
        return data
    elif hasattr(obj, "_ast"):
        return todict(obj._ast())
    elif hasattr(obj, "__iter__") and not isinstance(obj, str):
        return [todict(v, classkey) for v in obj]
    elif hasattr(obj, "__dict__"):
        data = dict([(key, todict(value, classkey))
                     for key, value in obj.__dict__.items()
                     if not callable(value) and not key.startswith('_')])
        if classkey is not None and hasattr(obj, "__class__"):
            data[classkey] = obj.__class__.__name__
        return data
    else:
        return obj


class TestBibReader(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bib = bibtexParser('test', fileIO=test_file)
        cls.bib.get_records()

    def test_bib_record_count(self):
        self.assertEqual(len(self.bib.records), 6)

    def test_bib_records(self):
        bib_dict = todict(self.bib.records)
        self.assertEqual(bib_dict, bib_dict_check)

    def test_bib_output(self):
        outfile = StringIO()
        self.bib.to_out(outfile, tex_long_template)
        outfile.seek(0)
        bib_formatted = outfile.readlines()

        self.assertEqual(bib_formatted, tex_long_output)

    def test_bib_html_output(self):
        outfile = StringIO()
        self.bib.to_out(outfile, html_short_template, clean=True, sort=True)
        outfile.seek(0)
        bib_formatted = outfile.readlines()

        self.assertEqual(bib_formatted, html_output)


if "__name__" == '__main__':
    unittest.main()
