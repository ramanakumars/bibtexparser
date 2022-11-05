import unittest
from ..parser import bibtexParser
from .test_file import test_file, bib_dict_check


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


bib = bibtexParser('test', fileIO=test_file)
bib.get_records()


class TestBibReader(unittest.TestCase):
    def test_bib_record_count(self):
        self.assertEqual(len(bib.records), 6)

    def test_bib_records(self):
        bib_dict = todict(bib.records)
        self.assertEqual(bib_dict, bib_dict_check)
