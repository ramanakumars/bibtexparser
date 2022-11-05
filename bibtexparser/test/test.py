import unittest
from ..parser import bibtexParser
from .test_file import test_file, bib_dict_check
import pprint


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
        print("Returned:")
        pprint.pprint(bib_dict)
        self.assertEqual(bib_dict, bib_dict_check)


pprint.pprint(bib_dict_check)

# if __name__ == '__main__':
# suite = unittest.TestSuite()
# suite.addTest(TestBibReader('test_bib_record_count'))
# suite.addTest(TestBibReader('test_bib_records'))
# unittest.TextTestRunner(verbosity=2).run(suite)

if "__name__" == '__main__':
    unittest.main()
