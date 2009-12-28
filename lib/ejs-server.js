// just serve up static files.

var ejs = require("./utils/ejs"),
  posix = require("posix"),
  path = require("path");

exports.ejsServer = function ejsServerFactory (fileMatch) {
  return function () {
    var self = this,
      server = self.server,
      stat = self.req.stat,
      file = self.req.filename;
      
    fileMatch = fileMatch || /\.ejs$/;
    
    if (!stat || !file || stat.isDirectory() || !fileMatch.test(file)) return self.next();
    
    if (!server.ejsCache) server.ejsCache = {};
    ejs.cache = server.ejsCache;
    ejs.render(
      file,
      function (m) { self.sendBody(m) },
      function () { self.finish() },
      self
    ).addErrback(self.error(500));
  };
};