// showing the way that next() works.
require("../sns").start({
  actions : [
    function () { this.sendHeader(200, {"content-type":"text/html"}).next() },
    function () { this.sendBody("<title>A cascading module").next() },
    function () { this.sendBody("<p>Hello, world").finish() }
  ],
  port : 8000
});
