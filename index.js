var brocWriter = require('broccoli-writer'),
    fs = require('fs'),
    path = require('path'),
    ejs = require('ejs');

var BroccoliEJS = function BroccoliEJS() {};
var BroccoliEJS = function BroccoliEJS(inputTree, options) {
  if (!(this instanceof BroccoliEJS)) return new BroccoliEJS(inputTree, options)
  this.inputTree = inputTree;
  this.options = options || {};
};
BroccoliEJS.prototype = Object.create(brocWriter.prototype);
BroccoliEJS.prototype.constructor = BroccoliEJS;
BroccoliEJS.prototype.description = 'broccoli-ejs';

BroccoliEJS.prototype.compileTemplate = function(template, callback) {
  if(path.extname(template) !== '.ejs') { return; }
  return fs.readFile(this.inputTree + '/' + template, function(err, buf) {
    if(err) { console.log(err); return; }
    var contents = buf.toString('utf8');
    var compiled = ejs.compile(contents, {
      client: true,
      compileDebug: true
    });

    var rep = /function anonymous/i,
        replacement = 'if (typeof window.TEMPLATE === \'undefined\') { window.TEMPLATE = {}; }\nwindow.TEMPLATE["'+ path.basename(template, '.ejs') +'"] = function';

    var data = compiled.toString().replace(rep, replacement);
    callback(data);
  })
};

BroccoliEJS.prototype.write = function(readTree, destDir) {
  var self = this;
  return readTree(this.inputTree)
    .then(function (srcDir) {
      var allTemplates = fs.readdirSync(srcDir),
          compiledTemplates = [];

      allTemplates.forEach(function(template) {
        self.compileTemplate(template, function(data) {
          fs.writeFileSync(destDir + '/template_' + path.basename(template, '.ejs') + '.js', data);
        });
      });
    });
};

module.exports = BroccoliEJS;
