// maybe you keep your files in two places.
// if it doesn't find it in the first, it'll look in the second.

var sns = require("../sns"),
  wwwDir = require("path").join(__filename, "../../www"),
  rootDir = require("path").join(__filename, "../..");

sns.start({
  modules : [
    // going to / will index the www dir.
    sns.autoIndex(wwwDir),
    sns.fileServer(wwwDir),
    
    // going to /examples will show this folder.
    // going to /lib will show the lib files
    // going to /www will be just like going to /
    sns.autoIndex(rootDir),
    sns.fileServer(rootDir),
    
    // if nothing matches, serve a 404
    sns.errorServer(404)
  ],
  port : 8000
});