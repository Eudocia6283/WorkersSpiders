export async function fetchHtml(url, spider) {
  const headers = {
    "user-agent": spider.userAgent || "cfspiders-workers/0.1",
    accept: "text/html,application/xhtml+xml",
    ...spider.headers
  };

  const response = await fetch(url, { headers, redirect: "follow" });
  if (!response.ok) {
    throw new Error(`fetch failed: ${response.status} for ${url}`);
  }
  return response.text();
}
