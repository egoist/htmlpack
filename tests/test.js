var fs = require('fs')
var htmlpack = require('../')
var html = fs.readFileSync(__dirname + '/fixture.html', 'utf8')

htmlpack(html)
