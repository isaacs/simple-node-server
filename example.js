var sns = require("./sns"),
  path = require("path");

sns.start({
  modules : [
    sns.fileServer,
    sns.directoryIndex,
    sns.errorServer(400, "You sent a request this server doesn't grok")
  ],
  docroot : require("path").join(__filename, "../www"),
  port : 8000
});