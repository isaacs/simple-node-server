// serve anything ending with ico or html out of the www dir, but anything
// starting with lib and ending with js should be served out of the examples dir.

var sns = require("../sns"),
  wwwDir = require("path").join(__filename, "../../www"),
  exampleDir = require("path").join(__filename, "..");


sns.start({
  actions : [sns.router(
    // serve ico and html files with the www root dir.
    { pattern : /\.(ico|html)$/, action : sns.fileServer(wwwDir) },
    
    // starting with lib and ending with js should be served out of the examples dir.
    // see how we pass a "prefix" arg to the fileServer, so that it knows to ignore
    // that bit of the request URI.
    { pattern : /^\/lib\/(.*\.js)$/, action : sns.fileServer(exampleDir, "/lib/") }
  ), sns.errorServer(404)],
  port : 8000
});