// just serve up static files.

var mime = require("./utils/mime"),
  posix = require("posix"),
  path = require("path");

exports.fileServer = function fileServerFactory () {
  return function fileServer () {
    var conf = this.server.conf,
      self = this,
      stat = self.req.stat,
      file = self.req.filename;
      
    if (!stat || !file || stat.isDirectory()) return self.next();
    (function openAndSend () {
      posix.open(file, process.O_RDONLY, 0666)
        .addErrback(function (e) {
          if (e && e.message && e.message === "Too many open files") {
            // try later, after some requests have completed.
            setTimeout(openAndSend);
          } else self.error(500, "Failed to open file: "+file)();
        })
        .addCallback(function (fd) { (function readAndSend () {
          posix.read(fd, conf.chunkSize || 1024, null, "binary")
            .addErrback(function () {
              posix.close(fd);
              self.error(500, "File read error: "+file)()
            })
            .addCallback(function (data, bytesRead) {
              self.sendHeader(200, {
                "content-type" : mime.type(file),
                "content-length" : stat.size,
                "last-modified" : stat.mtime.toUTCString()
              });
              if (bytesRead > 0) {
                self.write(data, "binary");
                readAndSend();
              } else {
                self.close();
                posix.close(fd);
              }
            });
          })()});
    })();
  };
};