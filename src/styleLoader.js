import fs from 'fs'
import path from 'path'

export default function styleLoader (el, plugins = []) {
  let src = el.attr('src')
  let content = el.html()
  if (src) {
    if (!el.is('[inline]')) {
      return `<link rel="stylesheet" href="${src}">\n`
    } else {
      const fileLocation = path.resolve(this.baseDir, src)
      content = fs.readFileSync(fileLocation, 'utf8')
    }
  }
  for (let plugin of plugins) {
    content = plugin(el)
  }
  return `<style>${content}</style>\n`
}
