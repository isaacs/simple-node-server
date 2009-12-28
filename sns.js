
// just load up the actions
process.mixin(exports
  ,require("./lib/router")
  ,require("./lib/file-server")
  ,require("./lib/resolve-filename")
  ,require("./lib/ejs-server")
  ,require("./lib/auto-index")
  ,require("./lib/directory-index")
  ,require("./lib/error")
  ,require("./lib/core")
);
