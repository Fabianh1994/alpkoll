import { SITE_URL } from '../lib/lang'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Scoring-endpointen är avstängd och har inget att indexera.
      disallow: '/api/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
