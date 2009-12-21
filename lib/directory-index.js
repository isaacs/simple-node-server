// look for files matching the indexFiles config, then tack it onto the request uri if found.

var posix = require("posix"),
  path = require("path");

exports.directoryIndex = function directoryIndex () {
  var conf = this.server.conf,
    indexFiles = conf.indexFiles || this.die("Need indexFiles config for directoryIndex"),
    docroot = conf.docroot || this.die("Need docroot config for directoryIndex"),
    self = this,
    file = path.join(docroot, this.req.uri.path),
    i = 0,
    indexFile = '';
  posix.stat(file)
    .addErrback(function () { return self.next() })
    .addCallback(function lookForIndex (stat) {
      
      // if it exists, and isn't a dir, then make that our place, and move on.
      if (stat && stat.isDirectory && !stat.isDirectory()) {
        if (indexFile) self.req.uri.path = path.join(self.req.uri.path, indexFile);
        return self.next();
      }
      if (i >= indexFiles.length) return self.next();
      
      indexFile = indexFiles[i];
      i ++;
      // require("sys").debug("about to test: "+path.join(file, indexFile));
      
      posix.stat(path.join(file, indexFile))
        .addErrback(lookForIndex)
        .addCallback(lookForIndex);
    });
};

