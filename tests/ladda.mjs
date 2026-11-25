// Låter node --test läsa sajtens moduler som Next gör: importer utan
// filändelse och .js-filer som ES-moduler.
import { register } from 'node:module'

register('data:text/javascript,' + encodeURIComponent(`
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
export async function resolve(spec, ctx, next) {
  if ((spec.startsWith('./') || spec.startsWith('../')) && !/\\.[cm]?js$/.test(spec)) {
    const url = new URL(spec + '.js', ctx.parentURL)
    if (existsSync(fileURLToPath(url))) return next(url.href, ctx)
  }
  return next(spec, ctx)
}
export async function load(url, ctx, next) {
  if (url.startsWith('file:') && url.endsWith('.js') && !url.includes('/node_modules/')) {
    return next(url, { ...ctx, format: 'module' })
  }
  return next(url, ctx)
}
`))
