import fs from 'fs'
import path from 'path'
import cheerio from 'cheerio'
import objectAssign from 'object-assign'
import loadConfig from './loadConfig'
import styleLoader from './styleLoader'
import scriptLoader from './scriptLoader'
import templateLoader from './templateLoader'

export default function htmlpack (args = {}) {
  const config = loadConfig()
  for (let arg in args) {
    config[arg] = args[arg]
  }
  if (config.babel === undefined) {
    config.babel = true
  }
  config.entry = config.entry || 'entry.html'
  config.dest = config.dest || 'index.html'
  config.plugins = config.plugins || {}
  const entryLocation = path.resolve(process.cwd(), config.entry)
  const self = {
    baseDir: path.dirname(entryLocation),
    babel: config.babel
  }
  let $input = cheerio.load(fs.readFileSync(entryLocation, 'utf8'))
  let $output = fs.readFileSync(__dirname + '/lib/output.html', 'utf8')
  $output = cheerio.load($output)
  // process style
  $input('style').each((i, el) => {
    $output('head').append(styleLoader.call(self, $input(el), config.plugins.head))
  })
  // process script
  $input('script').each((i, el) => {
    $output('body').append(scriptLoader.call(self, $input(el), config.plugins.script))
  })
  // process template
  $input('template').each((i, el) => {
    $output('body').prepend(templateLoader.call(self, $input(el), config.plugins.template))
  })
  // process head
  $output('head').prepend($input('head').html())
  // get root element
  $output = $output.root().html()
  fs.writeFileSync(path.resolve(process.cwd(), config.dest), $output, 'utf8')
};
