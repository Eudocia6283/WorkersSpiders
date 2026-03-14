export async function storePipeline({ env, item }) {
  await env.DB.prepare(
    `INSERT INTO crawl_items (
      id, spider, source_url, canonical_url, title, summary, content,
      published_at, raw_json, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      summary = excluded.summary,
      content = excluded.content,
      published_at = excluded.published_at,
      raw_json = excluded.raw_json,
      updated_at = excluded.updated_at`
  )
    .bind(
      item.id,
      item.spider,
      item.source_url,
      item.canonical_url,
      item.title,
      item.summary,
      item.content,
      item.published_at,
      JSON.stringify(item.raw),
      item.created_at,
      item.updated_at
    )
    .run();

  await env.CACHE.put(
    `item:${item.spider}:${item.source_url}`,
    JSON.stringify(item),
    { expirationTtl: 60 * 30 }
  );

  return item;
}

export async function getItemByUrl(env, spider, sourceUrl) {
  const cacheKey = `item:${spider}:${sourceUrl}`;
  const cached = await env.CACHE.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const row = await env.DB.prepare(
    `SELECT * FROM crawl_items WHERE spider = ? AND source_url = ? LIMIT 1`
  )
    .bind(spider, sourceUrl)
    .first();

  if (!row) return null;

  const item = {
    ...row,
    raw: JSON.parse(row.raw_json)
  };

  await env.CACHE.put(cacheKey, JSON.stringify(item), { expirationTtl: 60 * 30 });
  return item;
}
