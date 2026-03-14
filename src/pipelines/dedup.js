export async function dedupPipeline({ env, item }) {
  const cacheKey = `dedup:${item.id}`;
  const seen = await env.CACHE.get(cacheKey);
  if (seen) {
    return null;
  }

  await env.CACHE.put(cacheKey, item.updated_at, { expirationTtl: 60 * 60 * 6 });
  return item;
}
