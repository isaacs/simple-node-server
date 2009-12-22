var http = require("http"),
  sns = exports,
  utils = require("./utils"),
  status = require("./utils/status"),
  sys = require("sys");

sns.start = function sns_start (conf) {
  return new SNS(conf).start();
};

sns.SNS = SNS;

function SNS (conf) {
  process.EventEmitter.call(this);
  this.conf = {
    port : 80,
    hostname : "localhost",
    modules : []
  };
  process.mixin(this.conf, conf);
  this.modules = this.conf.modules;
};
process.inherits(SNS, process.EventEmitter);
process.mixin(SNS.prototype, {
  // sugar
  on : process.EventEmitter.prototype.addListener,
  
  // start up the server
  start : function SNS_start () {
    var self = this;
    self.server = http.createServer(function (req, res) {
      self.processRequest(req, res);
    });
    self.server.listen(self.conf.port, self.conf.hostname);
    self.emit("start", self);
    return this;
  },
  processRequest : function SNS_process (req, res) {
    this.emit("request", new SNSProcessor(this, req, res));
    return this;
  },
  stop : function SNS_stop () {
    this.server.close();
    this.emit("stop", this);
    return this;
  } 
});

function SNSProcessor (server, req, res) {
  var p = this;
  process.mixin(p, {
    server : server,
    req : req,
    res : res,
    index : -1,
    header : {"date" : new Date().toUTCString()},
    status : 200,
    headerSent : false,
    // bind p.next so I can pass it to callbacks, etc.
    next : (function (n) { return function () { return n.apply(p, arguments) }})(SNSProcessor_next)
  });
  p.next();
  return p;
};
function SNSProcessor_next () {
  this.index ++;
  if (this.index >= this.server.modules.length) return this;
  this.currentModule = this.server.modules[ this.index ];
  try {
    this.currentModule.call(this, this.req, this.res);
  } catch (ex) {
    this.server.emit("error", 500, ex.message || "sns error", this);
    this.error(500, ex.message || "sns error")();
  }
  return this;
}
SNSProcessor.prototype = {
  sendHeader : function SNSProcessor_sendHeader (status, header, now) {
    if (this.headerSent) return this;
    if (status) this.status = status;
    if (header) process.mixin(
      this.header, utils.keysToLowerCase(header)
    );
    if (now) {
      this.headerSent = true;
      this.res.sendHeader(this.status, this.header);
    }
    return this;
  },
  sendBody : function SNSProcessor_body (body) {
    if (!this.headerSent) this.sendHeader(false, false, true);
    this.res.sendBody(body, "binary");
    return this;
  },
  finish : function SNSProcessor_finish () {
    if (!this.headerSent) this.sendHeader(false, false, true);
    this.res.finish();
    this.server.emit("requestComplete", this, this.req, this.res);
    
    for (var i in this) if (this.hasOwnProperty(i) && i !== "server") this[i] = null;
    return this;
  },
  error : function SNSProcessor_error (code, message) {
    var message = message || status[code] || "oops?",
      stack = new Error(message).stack,
      self = this;
    return function error () {
      var m = message
        + "\n\nCall stack at error creation:\n" + stack
        + "\n\nArguments to error handler:\n"+ JSON.stringify(arguments, null, 2)
        + "\n\nCall stack at error invocation:\n"+ new Error().stack
        ;
      
      self
        .sendHeader(code, {
          "content-type" : "text/plain",
          "content-length" : m.length
        })
        .sendBody(m)
        .finish();
    };
  },
  die : function SNSProcessor_die (message) {
    throw new Error(message);
  }
};
