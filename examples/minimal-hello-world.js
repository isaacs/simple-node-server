// the bare minimum.  
require.async("../sns").addCallback(function (sns) {
  sns.start({
    modules : [
      function () {
        this
          .sendHeader(200, {"content-type" : "text/html"})
          .sendBody("<title>An inline module<p>Hello, world")
          .finish();
      }
    ],
    port : 8000
  });
});