var sns = require("./sns");

sns.start({
  modules : [
    sns.directoryIndex,
    sns.autoIndex,
    sns.fileServer,
    sns.errorServer(400, "You sent a request this server doesn't grok")
  ],
  docroot : require("path").join(__filename, "../www"),
  port : 8000,
  indexFiles : [
    "index.ejs",
    "index.html",
    "index.htm"
  ],
  indexIgnore : [
    /\.ico$/
  ]
});