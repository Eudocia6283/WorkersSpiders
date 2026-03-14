export class BaseSpider {
  name = "base";
  userAgent = "cfspiders-workers/0.1";
  headers = {};

  async parse(_ctx) {
    throw new Error("parse() must be implemented by spider");
  }
}
