export default function stylePlugin (el) {
  const src = el.attr('src')
  const content = el.html()
  if (src) {
    return `<link rel="stylesheet" href="${src}">`
  } else {
    return `<style>${content}</style>`
  }
}
