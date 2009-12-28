/**

A url router for Simple Node Server.  Usage:

sns.start({
  actions : [sns.router(
    { pattern : "index.html", action : sns.fileServer(docroot) },
    { pattern : /^send\/(^.+)$/, method : "POST", action : function (who) { ... } },
    { test : function (r) { return r.client.remoteAddress === "127.0.0.1" }, action : localOnly }},
    { action : myAppAction } // no tests, so this is the default.
  )]
})

The arguments to the factory are a list of objects with the following fields:
action - The action to route to. Required.
test - A boolean function that is called with the entire request object. Optional.
pattern - Either a string, regex (that is, {exec:function} object), or a function
  which returns truish/falsey, when matched against the request uri path. Optional.
method - Either a function, string, or array of strings of methods to restrict to. Optional.

Since "test" gets the whole request object, pattern and method are essentially just sugar, provided
because matching the request uri or the method are the most common use-cases.

If none of the patterns match, then the router calls next() to go to the next action in the list.
Note that calling next() in an action handler results in jumping out of the router's list. If there
are no other actions supplied to the SNS server, then a 500 error will be served.

If you supply an action without pattern/method/test members, then it will match every request.

Actions will receive the results of the regex match (or test function) as their argument list.

**/


exports.router = function RouterFactory () {
  var routes = Array.prototype.slice.call(arguments, 0);
  // todo: move the validation logic up here, to optimize the per-request
  // routing logic a bit.
  return function Router () {
    var acted = false, matchResult = null;
    for (var i = 0, l = routes.length; i < l; i ++) {
      var route = routes[i];
      if (
        acted // already did something
        || !( route && typeof(route) === "object" ) // invalid route
        || !route.hasOwnProperty("action") // can't act
        || (route.hasOwnProperty("method") && ( // test method
          (typeof(route.method) === "string" && this.req.method !== route.method)
          || (typeof(route.method) === "function" && !route.method(this.req.method))
          || (Array.isArray(route.method) && route.method.indexOf(this.req.method) === -1)
        ))
        || (route.hasOwnProperty("pattern") && ( // test pattern
          (typeof(route.pattern.exec) === "function"
            && !(matchResult = route.pattern.test(this.req.uri.full)))
          || (typeof(route.pattern) === "function"
            && !(matchResult = route.pattern(this.req.uri.full)))
          || (typeof(route.pattern) === "string" && route.pattern
            && !(route.pattern === this.req.uri.full && matchResult = route.pattern))
        ))
        || ( // test generic method
          route.hasOwnProperty("test")
          && typeof(route.pattern.test) === "function"
          && !(matchResult = route.pattern.test(this.req))
        )
      ) continue;
      else {
        if (!Array.isArray(matchResult)) matchResult = [matchResult];
        this.route = route;
        this.routes = routes;
        route.action.apply(this, matchResult);
        acted = true;
        break;
      }
    }
    
    if (!acted) return this.next(); // router didn't match anything.
  };
};