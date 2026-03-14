# 从 Scrapy 迁移到 Workers（建议）

## 1. 先迁移什么
- 先迁移 Item 字段规范（等价于 Scrapy Item）
- 再迁移解析逻辑（等价于 spider.parse）
- 最后迁移 pipeline（清洗/去重/落库）

## 2. 对应关系
- Scrapy `Spider` -> `src/spiders/*.js`
- Scrapy `ITEM_PIPELINES` -> `src/pipelines/index.js`
- Scrapy `Request/Response` -> Worker `fetch` + 自定义 parse
- Scrapy 调度器 -> `Queue consumer` (`src/index.js` 的 `queue`)

## 3. 添加新爬虫步骤
1. 复制 `templates/spider.template.js` 到 `src/spiders/your-spider.js`
2. 在 `src/core/registry.js` 注册
3. 如有新字段，更新 `migrations/*.sql` 与 `normalizePipeline`
4. 本地跑 `npm run dev`，然后调用 `POST /api/crawl`

## 4. 不建议直接照搬 Scrapy 特性
- Twisted 下载中间件
- 深度递归站点爬行
- 复杂会话和反爬对抗

这类能力建议拆成外部任务系统，Workers 只做 API 与轻量抓取。
