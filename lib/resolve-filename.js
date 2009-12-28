// an action that resolves the filename that a request points to.
// Adds a "req.filename" member if found, or leaves it empty if not.
// Pre-requisite for fileServer, directoryIndex, and autoIndex actions.

// just serve up static files.

var posix = require("posix"),
  path = require("path");

exports.resolveFilename = function filenameResolverFactory (docroot, prefix) {
  if (!docroot) throw new Error("Need a docroot for resolveFilename.");
  if (prefix) prefix = prefix.replace(/^\/+/, '');
  
  return function filenameResolver () {
    var conf = this.server.conf,
      p, file, self = this;
    
    p = self.req.uri.path.replace(/^\/+/, '');
    file = path.join(docroot, (prefix && p.indexOf(prefix) === 0)
      ? p.substr(prefix.length) : p);

    posix.stat(file)
      .addErrback(self.next)
      .addCallback(function resolveFilename (stat) {
        self.req.stat = stat;
        self.req.filename = file;
        self.next();
      });
  };
};