import { sha256 } from "../core/hash.js";

export async function normalizePipeline({ spider, item }) {
  const now = new Date().toISOString();
  const sourceUrl = String(item.source_url || "").trim();
  const canonicalUrl = String(item.canonical_url || sourceUrl).trim();

  if (!sourceUrl || !canonicalUrl) {
    throw new Error(`invalid item from spider ${spider.name}: source_url/canonical_url missing`);
  }

  const id = await sha256(`${spider.name}:${canonicalUrl}`);

  return {
    id,
    spider: spider.name,
    source_url: sourceUrl,
    canonical_url: canonicalUrl,
    title: item.title || null,
    summary: item.summary || null,
    content: item.content || null,
    published_at: item.published_at || null,
    raw: item.raw || item,
    created_at: item.created_at || now,
    updated_at: now
  };
}
