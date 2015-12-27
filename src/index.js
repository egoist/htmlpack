import fs from 'fs'
import path from 'path'
import cheerio from 'cheerio'
import objectAssign from 'object-assign'
import loadConfig from './loadConfig'
import styleLoader from './styleLoader'
import scriptLoader from './scriptLoader'
import templateLoader from './templateLoader'

export default function htmlpack ({
  entry = 'entry.html',
  dest = 'index.html',
  babel = true
} = {}) {
  const config = loadConfig()
  const opts = objectAssign({}, config, {
    entry,
    dest
  })
  if (opts.babel !== undefined) {
    babel = opts.babel
  }
  opts.plugins = opts.plugins || {}
  const entryLocation = path.resolve(process.cwd(), opts.entry)
  const self = {
    baseDir: path.dirname(entryLocation),
    babel
  }
  let $input = cheerio.load(fs.readFileSync(entryLocation, 'utf8'))
  let $output = fs.readFileSync('./lib/output.html', 'utf8')
  $output = cheerio.load($output)
  // process style
  $input('style').each((i, el) => {
    $output('head').append(styleLoader.call(self, $input(el), opts.plugins.head))
  })
  // process script
  $input('script').each((i, el) => {
    $output('body').append(scriptLoader.call(self, $input(el), opts.plugins.script))
  })
  // process template
  $input('template').each((i, el) => {
    $output('body').prepend(templateLoader.call(self, $input(el), opts.plugins.template))
  })
  // process head
  $output('head').prepend($input('head').html())
  // get root element
  $output = $output.root().html()
  fs.writeFileSync(path.resolve(process.cwd(), opts.dest), $output, 'utf8')
};
