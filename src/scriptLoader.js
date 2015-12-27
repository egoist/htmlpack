import fs from 'fs'
import path from 'path'
import babel from 'babel-core'

export default function scriptLoader (el, plugins = []) {
  let src = el.attr('src')
  let content = el.html()
  if (src) {
    if (!el.is('[inline]')) {
      return `<script src="${src}"></script>\n`
    } else {
      const fileLocation = path.resolve(this.baseDir, src)
      content = fs.readFileSync(fileLocation, 'utf8')
    }
  }
  if (this.babel) {
    content = babel.transform(content, {
      presets: [require('babel-preset-es2015'), require('babel-preset-stage-0')],
      plugins: [require('babel-plugin-transform-runtime')]
    }).code
  }
  for (let plugin of plugins) {
    content = plugin(el)
  }
  return `<script>\n${content}\n</script>\n`
}
