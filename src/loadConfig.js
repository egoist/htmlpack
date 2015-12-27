import path from 'path'
import fs from 'fs'
import pathExists from 'path-exists'
import babel from 'babel-core'
import requireFromString from 'require-from-string'

export default function loadConfig () {
  const configLocation = path.join(process.cwd(), 'htmlpack.config.js')
  if (!pathExists.sync(configLocation)) {
    return {}
  } else {
    const config = babel.transform(fs.readFileSync(configLocation, 'utf8'), {
      presets: ['es2015', 'stage-0']
    })
    return requireFromString(code).code || {}
  }
}
