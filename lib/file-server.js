// just serve up static files.

var mime = require("./utils/mime"),
  posix = require("posix"),
  path = require("path");

exports.fileServer = function fileServer () {
  var conf = this.server.conf,
    docroot = conf.docroot || this.die("Need a docroot config for fileServer."),
    file = path.join(docroot, this.req.uri.path),
    self = this;
  
  posix.stat(file)
    .addErrback(self.next)
    .addCallback(function openAndSend (stat) {
      if (stat.isDirectory()) return self.next();
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
                self.sendBody(data, "binary");
                readAndSend();
              } else {
                self.finish();
                posix.close(fd);
              }
            });
          })()});
    });
};