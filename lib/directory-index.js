// look for files matching the indexFiles config, then tack it onto the request uri if found.

// NB: Directory Indexing does a LOT of stat calls. If you're going to use this in production,
// which I very much don't recommend, please at least minimize the number of indexFiles you
// tell it to look for.  Think of the poor kittens.

var posix = require("posix"),
  path = require("path");

exports.directoryIndex = function directoryIndexFactory (indexFiles) {
  if (!indexFiles) throw new Error("Need indexFiles config for directoryIndex");
  
  return function directoryIndex () {
    var conf = this.server.conf,
      self = this,
      file = self.req.filename,
      i = 0,
      indexFile = '';
    
    (function lookForIndex (stat) {
      // if it exists, and isn't a dir, then either we've found our index,
      // or we have something else and should move on.
      if (stat && stat.isDirectory && !stat.isDirectory()) {
        if (indexFile) {
          self.req.stat = stat;
          self.req.filename = path.join(file, indexFile);
        }
        return self.next();
      }
      
      if (i >= indexFiles.length) return self.next();
      
      indexFile = indexFiles[i];
      i ++;
      var newFile = path.join(file, indexFile);
      // require("sys").debug("look for: "+newFile);
      
      posix.stat(newFile)
        .addErrback(lookForIndex)
        .addCallback(lookForIndex);
    })(self.req.stat);
  };
};
