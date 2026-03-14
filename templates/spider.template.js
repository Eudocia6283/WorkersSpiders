import { BaseSpider } from "../src/spiders/base.js";

export class NewSpider extends BaseSpider {
  name = "new_spider";

  async parse({ html, url }) {
    // TODO: replace with your own extraction logic.
    return {
      source_url: url,
      canonical_url: url,
      title: null,
      summary: null,
      content: null,
      published_at: null,
      raw: { html_length: html.length }
    };
  }
}
