CREATE TABLE IF NOT EXISTS crawl_items (
  id TEXT PRIMARY KEY,
  spider TEXT NOT NULL,
  source_url TEXT NOT NULL,
  canonical_url TEXT NOT NULL,
  title TEXT,
  summary TEXT,
  content TEXT,
  published_at TEXT,
  raw_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_crawl_items_spider_created_at
ON crawl_items(spider, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_crawl_items_canonical_url
ON crawl_items(canonical_url);

