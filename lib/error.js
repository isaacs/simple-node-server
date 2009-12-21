exports.errorServer = function errorServer (code, message) {
  return function () { return this.error(code, message)() };
};
  