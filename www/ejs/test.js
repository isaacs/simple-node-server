var ejs = require("../../lib/utils/ejs"),
  path = require("path"),
  posix = require("posix"),
  sys = require("sys");

ejs.parse(path.join(__filename, "../test.ejs"))
  .addCallback(function (parsed) {
    parsed();
  })
  .addErrback(function (err) {
    process.stdio.writeError(err.stack+"\n");
  });
  