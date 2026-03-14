import { BaseSpider } from "./base.js";

function stripTags(input) {
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function captureMeta(html, metaName) {
  const pattern = new RegExp(`<meta[^>]+name=["']${metaName}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i");
  const match = html.match(pattern);
  return match ? match[1].trim() : null;
}

export class ExampleNewsSpider extends BaseSpider {
  name = "example_news";

  async parse({ html, url }) {
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? stripTags(titleMatch[1]) : null;
    const summary = captureMeta(html, "description");

    return {
      source_url: url,
      canonical_url: url,
      title,
      summary,
      content: null,
      published_at: null,
      raw: {
        title,
        summary
      }
    };
  }
}
