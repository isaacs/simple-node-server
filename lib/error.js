var sns = require("../sns");

exports.error = function error (code, message, req, res) {
  var req = req || sns_error.caller.arguments[0],
    res = res || sns_error.caller.arguments[1],
    message = message || require("./lib/status")[code] || "oops?",
    stack = (new Error(message)).stack;
  return function error () {
    var m = message
        + "\n\nCall stack at error creation:\n" + stack
        + "\n\nCall stack at error invocation:\n"+ (new Error()).stack
        + "\n\nArguments to error handler:\n"+ JSON.stringify(arguments, null, 2);
    require("sys").error(m+"\n");
    
    sns.sendHeader(res, code, {
      "content-type" : "text/plain",
      "content-length" : m.length
    });
    sns.sendBody(res, m);
    sns.finish(res);
  };
};

exports.errorServer = function (code, message) {
  return function (conf) { return function (req, res) {
    exports.error(code, message, req, res);
  }}
};
  