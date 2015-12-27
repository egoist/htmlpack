import fs from 'fs'
import path from 'path'

export default function scriptLoader (el, plugins = []) {
  let src = el.attr('src')
  let content = el.html()
  if (src) {
    const fileLocation = path.resolve(this.baseDir, src)
    content = fs.readFileSync(fileLocation, 'utf8')
  }
  for (let plugin of plugins) {
    content = plugin(el)
  }
  return content
}
