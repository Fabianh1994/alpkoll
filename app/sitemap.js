import { getResortSlugs } from '../lib/resorts'
import { SITE_URL } from '../lib/lang'
import { PLANERAREN_SYNLIG } from '../lib/features'
import { indexeradeParFor } from '../lib/jamfor'

// Genereras om enligt samma intervall som ortsidorna, så nya orter i
// Supabase dyker upp i sitemapen utan ny deploy.
export const revalidate = 3600

export default async function sitemap() {
  const slugs = await getResortSlugs()
  const now = new Date()

  const staticPages = [
    { path: '', changeFrequency: 'daily', priority: 1 },
    // Reseplaneraren utelämnas medan den är dold — se lib/features.js.
    ...(PLANERAREN_SYNLIG
      ? [{ path: '/plan', changeFrequency: 'weekly', priority: 0.9 }]
      : []),
    { path: '/jamfor', changeFrequency: 'weekly', priority: 0.9 },
    // Prislistan ändras när orterna släpper nya priser, inte dagligen,
    // men den är sajtens starkaste enskilda sida och ligger högt.
    { path: '/liftkortspriser', changeFrequency: 'weekly', priority: 0.9 },
    // Frågan varje svensk skidåkare ställer före bokningen, och den enda
    // kategori sajten kan vinna — se lib/ellerAlperna.js.
    { path: '/are-eller-alperna', changeFrequency: 'monthly', priority: 0.9 },
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
    // Bara de par som ska indexeras, och bara där båda orterna är
    // publicerade. Par-listorna står i koden och publiceringen i
    // databasen; utan filtret hade en dold ort lagt en 404 i sitemapen.
    //
    // Sitemapen ska bara innehålla sidor vi faktiskt vill se indexerade.
    // Alla 83 kuraterade par byggs och länkas fortfarande — se
    // INDEXERADE_PAR i lib/jamfor.js för varför de inte alla ligger här.
    ...indexeradeParFor(slugs).map((par) => ({
      url: `${SITE_URL}/jamfor/${par}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    })),
  ]
}
