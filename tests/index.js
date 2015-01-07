var path       = require('path')
var compileEJS = require('..')
var ejs = require('ejs')
var root       = process.cwd()
var fs         = require('fs')
var chai = require('chai')
var expect = chai.expect;
var broccoli   = require('broccoli')

describe('broccoli-concat', function(){
  var initialTmpContents, builder;

  function readFile(path) {
    //return fs.readFileSync(path, {encoding: 'utf8'})
  }

  function getMtime(path) {
    //return fs.lstatSync(path).mtime
  }

  function chdir(path) {
    //process.chdir(path)
  }

  before(function() {
    // if (!fs.existsSync('tmp')) {
    //   fs.mkdirSync('tmp');
    // }
  });

  beforeEach(function() {
    // chdir(root)
    // initialTmpContents = fs.readdirSync('tmp');
  })

  afterEach(function() {
    if (builder) {
      builder.cleanup()
    }
    //
    // expect(fs.readdirSync('tmp')).to.eql(initialTmpContents);
  })


  describe('ejs', function(){
    it('compiles ejs template', function() {

      var sourcePath = 'tests/fixtures'
      var tree = compileEJS(sourcePath);

      builder = new broccoli.Builder(tree);
      return builder.build().then(function(results) {
        var dir = results.directory;
        var contents = fs.readFileSync(dir + '/template_template.js', 'utf8');
        var contentTwo = fs.readFileSync(root + '/tests/fixtures/template.ejs', 'utf8');

        var expected = ejs.compile(contentTwo, { client: true })
        var functionName = 'if (typeof window.TEMPLATE === \'undefined\') { window.TEMPLATE = {}; }\nwindow.TEMPLATE["template"] = function';

        expected = expected.toString().replace(/function anonymous/i, functionName);
        expect(contents).to.eql(expected)
      })

    })
  })

});
