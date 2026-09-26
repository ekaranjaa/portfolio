import type { APIRoute } from 'astro'

// The whole site is open to crawlers; the sitemap URL follows the `site` set in astro.config.mjs.
const getRobotsTxt = (sitemapURL: URL) => `\
User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`

export const GET: APIRoute = ({ site }) => {
    const sitemapURL = new URL('sitemap-index.xml', site)
    return new Response(getRobotsTxt(sitemapURL))
}
