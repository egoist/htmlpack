'use strict';

var fs = require('fs');
fs = 'default' in fs ? fs['default'] : fs;
var path = require('path');
path = 'default' in path ? path['default'] : path;
var cheerio = require('cheerio');
cheerio = 'default' in cheerio ? cheerio['default'] : cheerio;
var objectAssign = require('object-assign');
objectAssign = 'default' in objectAssign ? objectAssign['default'] : objectAssign;
var pathExists = require('path-exists');
pathExists = 'default' in pathExists ? pathExists['default'] : pathExists;
var babel = require('babel-core');
babel = 'default' in babel ? babel['default'] : babel;
var requireFromString = require('require-from-string');
requireFromString = 'default' in requireFromString ? requireFromString['default'] : requireFromString;

function loadConfig() {
  var configLocation = path.join(process.cwd(), 'htmlpack.config.js');
  if (!pathExists.sync(configLocation)) {
    return {};
  } else {
    var config = babel.transform(fs.readFileSync(configLocation, 'utf8'), {
      presets: ['es2015', 'stage-0']
    });
    return requireFromString(code).code || {};
  }
}

function styleLoader(el) {
  var plugins = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  var src = el.attr('src');
  var content = el.html();
  if (src) {
    if (!el.is('[inline]')) {
      return '<link rel="stylesheet" href="' + src + '">\n';
    } else {
      var fileLocation = path.resolve(this.baseDir, src);
      content = fs.readFileSync(fileLocation, 'utf8');
    }
  }
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var plugin = _step.value;

      content = plugin(el);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return '<style>' + content + '</style>\n';
}

function scriptLoader(el) {
  var plugins = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  var src = el.attr('src');
  var content = el.html();
  if (src) {
    if (!el.is('[inline]')) {
      return '<script src="' + src + '"></script>\n';
    } else {
      var fileLocation = path.resolve(this.baseDir, src);
      content = fs.readFileSync(fileLocation, 'utf8');
    }
  }
  if (this.babel) {
    content = babel.transform(content, {
      presets: ['es2015', 'stage-0'],
      plugins: ['transform-runtime']
    }).code;
  }
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var plugin = _step.value;

      content = plugin(el);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return '<script>\n' + content + '\n</script>\n';
}

function scriptLoader$1(el) {
  var plugins = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  var src = el.attr('src');
  var content = el.html();
  if (src) {
    var fileLocation = path.resolve(this.baseDir, src);
    content = fs.readFileSync(fileLocation, 'utf8');
  }
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var plugin = _step.value;

      content = plugin(el);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return content;
}

function htmlpack() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$entry = _ref.entry;
  var entry = _ref$entry === undefined ? 'entry.html' : _ref$entry;
  var _ref$dest = _ref.dest;
  var dest = _ref$dest === undefined ? 'index.html' : _ref$dest;
  var _ref$babel = _ref.babel;
  var babel = _ref$babel === undefined ? true : _ref$babel;

  var config = loadConfig();
  var opts = objectAssign({}, config, {
    entry: entry,
    dest: dest
  });
  if (opts.babel !== undefined) {
    babel = opts.babel;
  }
  opts.plugins = opts.plugins || {};
  var entryLocation = path.resolve(process.cwd(), opts.entry);
  var self = {
    baseDir: path.dirname(entryLocation),
    babel: babel
  };
  var $input = cheerio.load(fs.readFileSync(entryLocation, 'utf8'));
  var $output = fs.readFileSync('./lib/output.html', 'utf8');
  $output = cheerio.load($output);
  // process style
  $input('style').each(function (i, el) {
    $output('head').append(styleLoader.call(self, $input(el), opts.plugins.head));
  });
  // process script
  $input('script').each(function (i, el) {
    $output('body').append(scriptLoader.call(self, $input(el), opts.plugins.script));
  });
  // process template
  $input('template').each(function (i, el) {
    $output('body').prepend(scriptLoader$1.call(self, $input(el), opts.plugins.template));
  });
  // process head
  $output('head').prepend($input('head').html());
  // get root element
  $output = $output.root().html();
  fs.writeFileSync(path.resolve(process.cwd(), opts.dest), $output, 'utf8');
};

module.exports = htmlpack;