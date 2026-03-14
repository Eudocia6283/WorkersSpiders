import { ExampleNewsSpider } from "../spiders/example-news.js";

const spiderRegistry = new Map([
  ["example_news", new ExampleNewsSpider()]
]);

export function getSpider(name) {
  return spiderRegistry.get(name) || null;
}

export function listSpiders() {
  return Array.from(spiderRegistry.keys());
}
