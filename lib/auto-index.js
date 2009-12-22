var posix = require("posix"),
  path = require("path");

exports.autoIndex = function autoIndex () {
  var conf = this.server.conf,
    docroot = conf.docroot || this.die("Need docroot config for autoIndex."),
    indexIgnore = conf.indexIgnore || [],
    dir = path.join(docroot, this.req.uri.path),
    self = this,
    Lang = require("./utils/lang");
  
  posix.stat(dir)
    .addErrback(self.next)
    .addCallback(function (stat) {
      if (!stat.isDirectory()) return self.next();
      posix.readdir(dir)
        .addErrback(self.error(500, "Failed to readdir: "+dir))
        .addCallback(function (files) {
          var out = [
            '<title>index of ',self.req.uri.path,'</title>',
            '<ul>'
          ].concat(files.map(function (f) {
            var itemMarkup = '<li><a href="'+f+'">'+f+'</a></li>';
            indexIgnore.forEach(function (ii) {
              if (
                Lang.isFunction(ii.exec) && ii.exec(f) // regexp
                || Lang.isFunction(ii) && ii(f)
                || ii === f
              ) itemMarkup = '';
            });
            return itemMarkup
          })).concat([
            '</ul> <p><small>simple node server</small></p>'
          ]).join('\n');
          
          self
            .sendHeader(200, {
              "content-type" : "text/html",
              "content-length" : out.length
            })
            .sendBody(out)
            .finish();
        });
    });   
};