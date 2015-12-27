'use strict';

var fs = require('fs');
fs = 'default' in fs ? fs['default'] : fs;
var path = require('path');
path = 'default' in path ? path['default'] : path;
var cheerio = require('cheerio');
cheerio = 'default' in cheerio ? cheerio['default'] : cheerio;

function stylePlugin(el) {
  var src = el.attr('src');
  var content = el.html();
  if (src) {
    return '<link rel="stylesheet" href="' + src + '">';
  } else {
    return '<style>' + content + '</style>';
  }
}

function htmlpack(str) {
  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref$dest = _ref.dest;
  var dest = _ref$dest === undefined ? 'index.output.html' : _ref$dest;

  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  var $input = cheerio.load(str);
  var $output = fs.readFileSync('./lib/output.html', 'utf8');
  $output = cheerio.load($output);
  // process style
  $input('style').each(function (i, el) {
    $output('head').append(stylePlugin($input(el)));
  });
  $output = $output.root().html();
  fs.writeFileSync(path.join(process.cwd(), dest), $output, 'utf8');
};

module.exports = htmlpack;