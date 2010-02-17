// dump all the data about the request.
require("../sns").start({
  actions : [function debug () {
    this
      .sendHeader(200, {"content-type" : "application/json"}, true)
      .write(JSON.stringify(this, function replacer (key, val) {
        if (key[0] === "_") return;
        if (typeof val === "function") return val.toString();
        return val;
      }, 2), "binary")
      .close();
  }],
  port : 8080
});
