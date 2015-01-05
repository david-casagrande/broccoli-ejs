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

  var data = fs.readFileSync(this.inputTree + '/' + template, 'utf8'),
      compiled = ejs.compile(data, { client: true, compileDebug: true }),
      baseName = path.basename(template, '.ejs'),
      functionName = 'if (typeof window.TEMPLATE === \'undefined\') { window.TEMPLATE = {}; }\nwindow.TEMPLATE["'+ baseName +'"] = function';

  return compiled.toString().replace(/function anonymous/i, functionName);
};

BroccoliEJS.prototype.write = function(readTree, destDir) {
  var self = this;
  return readTree(this.inputTree)
    .then(function (srcDir) {
      var allTemplates = fs.readdirSync(srcDir),
          compiledTemplates = [];

      allTemplates.forEach(function(template) {
        var data = self.compileTemplate(template);
        fs.writeFileSync(destDir + '/template_' + path.basename(template, '.ejs') + '.js', data);
      });
    });
};

module.exports = BroccoliEJS;
