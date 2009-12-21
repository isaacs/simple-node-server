var http = require("http"),
  sns = exports,
  sys = require("sys");

sns.start = function start (servers, conf) {
  servers = servers.map(function (server) { return server(conf) });
  http.createServer(function (req, res) {
    try {
      for (var i = 0, l = servers.length; i < l && !res._finished; i ++) {
        if (res._finished) break;
        servers[i](req,res);
      }
    } catch (ex) {
      sns.error(500, ex.message || "sns error", req, res);
    }
  }).listen(conf.port || 80);
};
sns.sendBody = function (res, body) {
  if (!res._headerSent) sns.sendHeader(res, false, false, true);
  return res.sendBody(body);
};
sns.sendHeader = function (res, code, header, now) {
  if (res._headerSent) return;
  if (code) res._code = code;
  if (header) res._header = process.mixin(res._header,
    require("./utils").keysToLowerCase(header));
  if (now) {
    res._headerSent = true;
    res.sendHeader(res._code, res._header);
  }
};
sns.finish = function (res) {
  if (res._finished) return;
  if (!res._headerSent) sns.sendHeader(res, false, false, true);
  res._finished = true;
  res.finish();
}