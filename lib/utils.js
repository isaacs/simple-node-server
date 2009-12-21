
var objProto = exports.objProto = Object.prototype;

exports.ownProp = function (o, p) { return objProto.hasOwnProperty.call(o, p) };

exports.keysToLowerCase = function (obj) {
  var o = {};
  for (var i in obj) if (exports.ownProp(obj, i)) o[i.toLowerCase()] = obj[i];
};