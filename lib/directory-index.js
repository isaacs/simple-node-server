// just serve up static files.
// keepin it real

var posix = require("posix"),
  path = require("path"),
  sns = require("../sns");

exports.directoryIndex = function directoryIndex (conf) {
  // return a function that gets called in a http.createServer callback.
  if (!conf.indexFiles) {
    throw new Error("Need indexFiles config for directoryIndex");
  }
  if (!conf.docroot) {
    throw new Error("Need docroot config for directoryIndex");
  }
  return function (req, res) {
    var docroot = conf.docroot,
      file = path.join(docroot, req.uri.path);
    
    posix.stat(file)
      .addErrback(sns.error(404, "Not found: "+file, req, res))
