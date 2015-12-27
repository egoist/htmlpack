var fs = require('fs')
var htmlpack = require('../')

htmlpack({
  entry: 'tests/fixture.html',
  dest: 'tests/index.html'
})
