
// just load up the actions
process.mixin(exports
  ,require("./lib/file-server")
  ,require("./lib/auto-index")
  ,require("./lib/directory-index")
  ,require("./lib/error")
  ,require("./lib/core")
);
