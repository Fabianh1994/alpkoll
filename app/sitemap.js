import { getResortSlugs } from '../lib/resorts'
import { SITE_URL } from '../lib/lang'

// Genereras om enligt samma intervall som ortsidorna, så nya orter i
// Supabase dyker upp i sitemapen utan ny deploy.
export const revalidate = 3600

export default async function sitemap() {
  const slugs = await getResortSlugs()
  const now = new Date()

  const staticPages = [
    { path: '', changeFrequency: 'daily', priority: 1 },
    { path: '/plan', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.4 },
    { path: '/privacy', changeFrequency: 'yearly', priority: 0.1 },
    { path: '/terms', changeFrequency: 'yearly', priority: 0.1 },
    { path: '/affiliate-disclosure', changeFrequency: 'yearly', priority: 0.1 },
  ]

  return [
    ...staticPages.map(({ path, changeFrequency, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...slugs.map((slug) => ({
      url: `${SITE_URL}/resort/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
  ]
}
