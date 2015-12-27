import fs from 'fs'
import path from 'path'
import cheerio from 'cheerio'
import style from './style'

export default function htmlpack (str, {
  dest = 'index.output.html'
} = {}) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string')
  }
  let $input = cheerio.load(str)
  let $output = fs.readFileSync('./lib/output.html', 'utf8')
  $output = cheerio.load($output)
  // process style
  $input('style').each((i, el) => {
    $output('head').append(style($input(el)))
  })
  $output = $output.root().html()
  fs.writeFileSync(path.join(process.cwd(), dest), $output, 'utf8')
};
