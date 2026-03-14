import { getSpider } from "./registry.js";
import { fetchHtml } from "./http.js";
import { runPipelines } from "../pipelines/index.js";

export async function runCrawlTask(env, task) {
  const spider = getSpider(task.spider);
  if (!spider) {
    throw new Error(`unknown spider: ${task.spider}`);
  }

  const html = await fetchHtml(task.url, spider);
  const extracted = await spider.parse({ html, url: task.url, env, task });
  const items = Array.isArray(extracted) ? extracted : [extracted];

  const results = [];
  for (const item of items) {
    if (!item) continue;
    const output = await runPipelines(env, spider, item, task);
    if (output) results.push(output);
  }

  return results;
}
