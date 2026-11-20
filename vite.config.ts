/// <reference types="vitest/config" />
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, runnerImport, type Plugin } from 'vite'

// The functions of src/site/html.ts, loaded through Vite so they can read the TypeScript content.
type SiteHtml = {
  renderHead: (locale: 'es' | 'en', siteUrl?: string) => string
  renderNoscript: () => string
  PATHS: { game: string }
}

/**
 * Fills the page's <!-- site:head --> and <!-- site:noscript --> with HTML made from the typed
 * content (src/site/html.ts), and writes robots.txt and sitemap.xml. SITE_URL is the site's final
 * address (set when it is published): without it, the build leaves out the absolute addresses
 * (canonical, share image, sitemap) and says so.
 */
function sitePages(siteUrl: string | undefined): Plugin {
  let root = process.cwd()
  const load = async () => (await runnerImport<SiteHtml>(resolve(root, 'src/site/html.ts'))).module

  return {
    name: 'site-pages',
    configResolved(config) {
      root = config.root
      if (config.command === 'build' && !siteUrl) {
        config.logger.warn('SITE_URL is not set: no canonical address, share image URL or sitemap in this build.')
      }
    },
    transformIndexHtml: {
      order: 'pre',
      async handler(html, ctx) {
        const file = ctx.filename.slice(root.length + 1).replaceAll('\\', '/')
        if (file !== 'index.html') return html
        const site = await load()
        // The page starts in Spanish (<html lang="es">); the game switches to the visitor's language.
        return html
          .replace(/<!-- site:head[^>]*-->/, site.renderHead('es', siteUrl))
          .replace(/<!-- site:noscript[^>]*-->/, site.renderNoscript())
      },
    },
    async generateBundle() {
      const site = await load()
      const base = siteUrl?.replace(/\/$/, '')
      const robots = ['User-agent: *', 'Allow: /', ...(base ? ['', `Sitemap: ${base}/sitemap.xml`] : [])]
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots.join('\n')}\n` })
      if (!base) return
      const urls = [`  <url><loc>${base}${site.PATHS.game}</loc></url>`]
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
      })
    },
  }
}

/**
 * Tells the browser about the first screen's font straight away (instead of after the CSS), so
 * the title doesn't jump when the pixel font arrives: Jersey 10.
 */
function preloadFonts(): Plugin {
  const FONTS: Record<string, RegExp[]> = {
    'index.html': [/jersey-10-latin-400-normal-[\w-]+\.woff2$/],
  }
  let root = process.cwd()
  let base = '/'
  return {
    name: 'preload-fonts',
    apply: 'build',
    configResolved(config) {
      root = config.root
      base = config.base
    },
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const file = ctx.filename.slice(root.length + 1).replaceAll('\\', '/')
        const wanted = FONTS[file] ?? []
        const files = Object.keys(ctx.bundle ?? {}).filter((name) => wanted.some((pattern) => pattern.test(name)))
        return files.map((name) => ({
          tag: 'link',
          attrs: { rel: 'preload', href: `${base}${name}`, as: 'font', type: 'font/woff2', crossorigin: '' },
          injectTo: 'head' as const,
        }))
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), sitePages(env.SITE_URL || undefined), preloadFonts()],
    build: {
      // Never inline images into the JavaScript as base64: the character frames are small PNGs that
      // would all ride in the first download. As files, each one loads only when it is drawn.
      assetsInlineLimit: 0,
    },
    test: {
      environment: 'node',
    },
  }
})
