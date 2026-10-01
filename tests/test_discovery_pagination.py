import unittest
from src.ingest.discovery_pilot import search_pages

class FakeCache:
    def __init__(self, responses):
        self.responses = iter(responses)
        self.cursors = []
    def get(self, url, params):
        self.cursors.append(params['cursorMark'])
        return next(self.responses), {}

def page(cursor, rows=True):
    return {'nextCursorMark': cursor, 'resultList': {'result': [{'pmid':'1'}] if rows else []}}

class PaginationTests(unittest.TestCase):
    def test_follows_cursor_and_stops_cycle(self):
        cache = FakeCache([page('next'), page('*')])
        self.assertEqual(len(list(search_pages(cache, 'q', 10, 5))), 2)
        self.assertEqual(cache.cursors, ['*', 'next'])
    def test_page_cap(self):
        cache = FakeCache([page('next')])
        self.assertEqual(len(list(search_pages(cache, 'q', 10, 1))), 1)
    def test_empty_results_stop(self):
        cache = FakeCache([page('next', False)])
        self.assertEqual(len(list(search_pages(cache, 'q', 10, 4))), 1)
