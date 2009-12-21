var sys = require("sys"),
  posix = require("posix"),
  path = require("path"),
  sns = require("../sns");

exports.directoryIndex = function directoryIndex (conf) {
  // return a function that gets called in a http.createServer callback.
  if (!conf.docroot) {
    throw new Error("Cannot index directories without a docroot.");
  }
  return function (req, res) {
    var docroot = conf.docroot,
      dir = path.join(docroot, req.uri.path);
    posix.stat(dir)
      .addErrback(sns.error(404, "Not found: "+dir, req, res))
      .addCallback(function (stat) {
        if (!stat.isDirectory()) {
          // not a dir, so just move along.
          return;
        }
        posix.readdir(dir)
          .addErrback(sns.error(500, "Failed to readdir: "+dir, req, res))
          .addCallback(function (files) {
            var out = [
              '<title>index of ',req.uri.path,'</title>',
              '<ul>'
            ].concat(files.map(function (f) {
              return '<li><a href="'+f+'">'+f+'</a></li>';
            })).concat([
              '</ul> <p>simple node server</p>'
            ]).join('\n');
            sns.sendHeader(res, 200, {
              "content-type" : "text/html",
              "content-length" : out.length
            });
            sns.sendBody(res, out);
            sns.finish(res);
          });
      });   
  };
};