exports.type = mime_type;
exports.set = mime_set;

var Lang = require("./lang"),
  ownProp = require("../utils").ownProp;

function mime_type (file) {
  var ext = (/\..*$/.exec(file) || [""])[0].toLowerCase();
  var type = (ownProp(types, ext)) ? types[ext] : types[""];
  return (Lang.isFunction(type)) ? type(file) : type;
};
function mime_set (ext, type) {
  if (Lang.isArray(ext)) {
    ext.forEach(function (ext) {
      mime_set(ext, type);
    });
    return;
  }
  types[ext.toLowerCase()] = type;
};

var types = {
  ".pdf"     : "application/pdf",
  ".sig"     : "application/pgp-signature",
  ".spl"     : "application/futuresplash",
  ".class"   : "application/octet-stream",
  ".ps"      : "application/postscript",
  ".torrent" : "application/x-bittorrent",
  ".dvi"     : "application/x-dvi",
  ".gz"      : "application/x-gzip",
  ".pac"     : "application/x-ns-proxy-autoconfig",
  ".swf"     : "application/x-shockwave-flash",
  ".tar.gz"  : "application/x-tgz",
  ".tgz"     : "application/x-tgz",
  ".tar"     : "application/x-tar",
  ".zip"     : "application/zip",
  ".mp3"     : "audio/mpeg",
  ".m3u"     : "audio/x-mpegurl",
  ".wma"     : "audio/x-ms-wma",
  ".wax"     : "audio/x-ms-wax",
  ".ogg"     : "application/ogg",
  ".wav"     : "audio/x-wav",
  ".ico"     : "image/vnd.microsoft.icon",
  // ".ico"     : "image/ico",
  // ".ico"     : "image/x-icon",
  ".gif"     : "image/gif",
  ".jar"     : "application/x-java-archive",
  ".jpg"     : "image/jpeg",
  ".jpeg"    : "image/jpeg",
  ".png"     : "image/png",
  ".xbm"     : "image/x-xbitmap",
  ".xpm"     : "image/x-xpixmap",
  ".xwd"     : "image/x-xwindowdump",
  ".css"     : "text/css",
  ".html"    : "text/html",
  ".htm"     : "text/html",
  ".js"      : "text/javascript",
  ".asc"     : "text/plain",
  ".c"       : "text/plain",
  ".cpp"     : "text/plain",
  ".log"     : "text/plain",
  ".conf"    : "text/plain",
  ".text"    : "text/plain",
  ".txt"     : "text/plain",
  ".dtd"     : "text/xml",
  ".xml"     : "text/xml",
  ".mpeg"    : "video/mpeg",
  ".mpg"     : "video/mpeg",
  ".mov"     : "video/quicktime",
  ".qt"      : "video/quicktime",
  ".avi"     : "video/x-msvideo",
  ".asf"     : "video/x-ms-asf",
  ".asx"     : "video/x-ms-asf",
  ".wmv"     : "video/x-ms-wmv",
  ".bz2"     : "application/x-bzip",
  ".tbz"     : "application/x-bzip-compressed-tar",
  ".tar.bz2" : "application/x-bzip-compressed-tar",
  // default mime type
  ""         : "application/octet-stream",
};

