// a reasonable example.
// file serving, directory indexing, autoindexes.

var sns = require("./sns"),
  docroot = require("path").join(__filename, "../www");

sns.start({
  actions : [
    sns.directoryIndex(docroot, ["index.ejs","index.html","index.htm"]),
    sns.autoIndex(docroot, [/\.ico$/]),
    sns.fileServer(docroot),
    sns.errorServer(404)
  ],
  port : 8000
});