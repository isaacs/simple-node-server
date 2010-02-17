// the bare minimum.  
require.async("../sns").addCallback(function (sns) {
  sns.start({
    actions : [
      function () {
        this
          .sendHeader(200, {"content-type" : "text/html"})
          .write("<title>An inline module<p>Hello, world")
          .close();
      }
    ],
    port : 8000
  });
});