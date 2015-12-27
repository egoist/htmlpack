var execa = require('execa')

describe('main', function () {
  it('should work', function (done) {
     execa
      .shell('node ./cli.js --no-babel --entry tests/fixture.html --dest tests/index.html')
      .then(function (result) {
        done()
      })
      .catch(function (err) {
        done(err)
      })
  })
})
