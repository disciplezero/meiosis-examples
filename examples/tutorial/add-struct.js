/*global process*/
var fs = require("fs");
var toDir = process.argv[2];

var filenames = fs.readdirSync(toDir);

filenames.forEach(source => {
  var filename = toDir + "/" + source;
  var input = fs.readFileSync(filename, "ascii");
  var lines = input.split("\n");

  lines = input.split("\n");
  lines.unshift("<script src=\"https://flems.io/flems.html\" type=\"text/javascript\" charset=\"utf-8\"></script>");
  lines.unshift("<link rel=\"stylesheet\" href=\"style.css\">");
  lines.unshift("<link rel=\"stylesheet\" href=\"skeleton.css\">");
  lines.unshift("<link rel=\"stylesheet\" href=\"normalize.css\">");
  lines.unshift("<!DOCTYPE html><html><body class=\"container\">");
  lines.push("</body></html>");
  fs.writeFileSync(filename, lines.join("\n"));
});
