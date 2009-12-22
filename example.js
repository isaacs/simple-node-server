// a reasonable example.
// file serving, directory indexing, autoindexes.

var sns = require("./sns");

sns.start({
  modules : [
    sns.directoryIndex,
    sns.autoIndex,
    sns.fileServer,
    sns.errorServer(404)
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