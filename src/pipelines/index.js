import { normalizePipeline } from "./normalize.js";
import { dedupPipeline } from "./dedup.js";
import { storePipeline } from "./store.js";

const defaultPipelines = [normalizePipeline, dedupPipeline, storePipeline];

export async function runPipelines(env, spider, item, task) {
  let current = item;
  for (const pipeline of defaultPipelines) {
    if (!current) return null;
    current = await pipeline({ env, spider, item: current, task });
  }
  return current;
}
