// just serve up static files.
// keepin it real

var mime = require("./mime"),
  sys = require("sys"),
  posix = require("posix"),
  path = require("path"),
  uri = require("uri"),
  sns = require("../sns");

exports.fileServer = function fileServer (conf) {
  // return a function that gets called in a http.createServer callback.
  if (!conf.docroot) {
    throw new Error("Cannot start a file server without a docroot.");
  }
  return function (req, res) {
    var docroot = conf.docroot,
      file = path.join(docroot, req.uri.path);
    
    posix.stat(file)
      .addErrback(sns.error(404, "Not found: "+file, req, res))
      .addCallback(function (stat) {
        if (stat.isDirectory()) {
          // punt on this one.
          // maybe directory indexing will handle it, if loaded
          return;
        }
        posix.open(file, process.O_RDONLY, 0666)
          .addErrback(sns.error(500, "Failed to open file: "+file, req, res))
          .addCallback(function (fd) {
            var headersSent = false;
            readAndSend(fd);
            function readAndSend (fd) {
              posix.read(fd, conf.chunkSize || 1024, null, "binary")
                .addErrback(sns.error(500, "File read error: "+file, req, res))
                .addCallback(function (data, bytesRead) {
                  sns.sendHeader(res, 200, {
                    "content-type" : mime.type(file),
                    "content-length" : stat.size
                  });
                  if (bytesRead === 0) sns.finish(res);
                  else {
                    sns.sendBody(res, data, "binary");
                    readAndSend(fd);
                  }
                });
            };
          });
      });   
  };
};