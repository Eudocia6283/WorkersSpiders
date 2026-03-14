# WorkersSpiders

这个仓库是一个“可扩展爬虫封装”骨架，目标是替代 Scrapy 的部分工程结构，并运行在 Cloudflare Workers。

## 架构
- `src/spiders`: 爬虫解析逻辑（Spider 层）
- `src/pipelines`: 清洗、去重、落库（Pipeline 层）
- `src/core/registry.js`: spider 注册中心
- `src/core/runner.js`: 任务执行器
- `src/index.js`: HTTP API + Queue Consumer
- `migrations`: D1 表结构

## API
- `POST /api/crawl`
```json
{
  "spider": "example_news",
  "url": "https://example.com",
  "force": false
}
```

- `GET /api/item?spider=example_news&url=https://example.com`

## 本地启动
1. 安装依赖
```bash
npm install
```
2. 创建 D1/KV/Queue（首次）
```bash
wrangler d1 create workersspiders_db
wrangler kv namespace create CACHE
wrangler queues create workersspiders-crawl
```
3. 更新 `wrangler.toml` 里的 `database_id` 和 `kv id`
4. 执行迁移
```bash
npm run d1:migrate
```
5. 启动
```bash
npm run dev
```

## 如何新增 spider
1. 复制 `templates/spider.template.js` 到 `src/spiders/<name>.js`
2. 实现 `parse({ html, url })`
3. 在 `src/core/registry.js` 注册该 spider
4. 如需新增字段，更新 SQL 和 pipeline

## 推荐后续增强
- 给每个 spider 增加独立 pipeline 列表
- 增加 auth/rate-limit
- 增加失败重试策略和告警
- 增加分页/列表页 -> 详情页任务拆分

## GitHub 推送
```bash
git init
git add .
git commit -m "init WorkersSpiders workers skeleton"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```




