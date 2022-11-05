from .read_test import TestBibReader
import unittest


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(TestBibReader('test_bib_record_count'))
    suite.addTest(TestBibReader('test_bib_records'))
    unittest.TextTestRunner(verbosity=4).run(suite)
