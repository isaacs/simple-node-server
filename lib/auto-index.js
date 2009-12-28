var posix = require("posix"),
  path = require("path"),
  Lang = require("./utils/lang");

exports.autoIndex = function autoIndexFactory (conf) {
  var indexIgnore = conf.ignore || [];
  
  return function autoIndex () {
    var conf = this.server.conf,
      self = this,
      dir = self.req.filename;
    
    if (!dir || !self.req.stat || !self.req.stat.isDirectory()) return self.next();
    
    if (self.req.uri.path.substr(-1) !== "/") {
      return self.sendHeader(301, {"location":self.req.uri.path + "/"}).finish();
    }
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
  };
};