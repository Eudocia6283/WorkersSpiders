import { runCrawlTask } from "./core/runner.js";
import { getItemByUrl } from "./pipelines/store.js";

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json; charset=utf-8" },
    ...init
  });
}

async function handleCrawlRequest(request, env) {
  const body = await request.json().catch(() => null);
  if (!body || !body.spider || !body.url) {
    return json(
      { error: "body.spider and body.url are required" },
      { status: 400 }
    );
  }

  const spider = String(body.spider).trim();
  const url = String(body.url).trim();
  const force = Boolean(body.force);
  const key = `item:${spider}:${url}`;

  if (!force) {
    const cached = await env.CACHE.get(key);
    if (cached) {
      return json({ status: "ok", source: "cache", data: JSON.parse(cached) });
    }
  }

  await env.CRAWL_QUEUE.send({
    spider,
    url,
    requestedAt: new Date().toISOString()
  });

  return json({
    status: "queued",
    spider,
    url
  });
}

async function handleGetItem(request, env) {
  const reqUrl = new URL(request.url);
  const spider = reqUrl.searchParams.get("spider");
  const url = reqUrl.searchParams.get("url");

  if (!spider || !url) {
    return json({ error: "spider and url query params are required" }, { status: 400 });
  }

  const item = await getItemByUrl(env, spider, url);
  if (!item) {
    return json({ status: "not_found" }, { status: 404 });
  }

  return json({ status: "ok", data: item });
}

export default {
  async fetch(request, env, ctx) {
    const reqUrl = new URL(request.url);

    if (request.method === "POST" && reqUrl.pathname === "/api/crawl") {
      return handleCrawlRequest(request, env, ctx);
    }

    if (request.method === "GET" && reqUrl.pathname === "/api/item") {
      return handleGetItem(request, env, ctx);
    }

    if (request.method === "GET" && reqUrl.pathname === "/healthz") {
      return json({ status: "ok", time: new Date().toISOString() });
    }

    return json(
      {
        name: "cfspiders-workers",
        endpoints: ["POST /api/crawl", "GET /api/item", "GET /healthz"]
      },
      { status: 200 }
    );
  },

  async queue(batch, env, ctx) {
    for (const msg of batch.messages) {
      try {
        await runCrawlTask(env, msg.body);
        msg.ack();
      } catch (error) {
        console.error("crawl task failed", { body: msg.body, error: String(error) });
        msg.retry();
      }
    }
  }
};

