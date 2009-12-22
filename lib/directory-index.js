// look for files matching the indexFiles config, then tack it onto the request uri if found.

// NB: Directory Indexing does a LOT of stat calls. If you're going to use this in production,
// which I very much don't recommend, please at least minimize the number of indexFiles you
// tell it to look for.  Think of the poor kittens.

var posix = require("posix"),
  path = require("path");

exports.directoryIndex = function directoryIndexFactory (docroot, indexFiles) {
  if (!docroot) throw new Error("Need a docroot for directoryIndex.");
  if (!indexFiles) throw new Error("Need indexFiles config for directoryIndex");
  
  return function directoryIndex () {
    var conf = this.server.conf,
      self = this,
      file = path.join(docroot, this.req.uri.path),
      i = 0,
      indexFile = '';
    posix.stat(file)
      .addErrback(self.next)
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
};
