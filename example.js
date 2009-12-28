// a reasonable example.
// file serving, directory indexing, autoindexes.

var sns = require("./sns"),
  docroot = require("path").join(__filename, "../www");

sns.start({
  actions : [
    sns.resolveFilename(docroot),
    sns.directoryIndex(["index.ejs","index.html","index.htm"]),
    sns.autoIndex({ ignore : [/\.ico$/] }),
    sns.ejsServer(),
    sns.fileServer(),
    sns.errorServer(404)
  ],
  port : 8000
});