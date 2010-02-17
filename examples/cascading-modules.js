// showing the way that next() works.
require("../sns").start({
  actions : [
    function () { this.sendHeader(200, {"content-type":"text/html"}).next() },
    function () { this.write("<title>A cascading module").next() },
    function () { this.write("<p>Hello, world").close() }
  ],
  port : 8000
});
