import { getResortSlugs } from '../lib/resorts'
import { SITE_URL } from '../lib/lang'
import { PLANERAREN_SYNLIG } from '../lib/features'
import { indexeradeParFor } from '../lib/jamfor'
import { KOMMUNER, kommunSlug } from '../lib/sportlov'
import { PASKLOV } from '../lib/pasklov'
import { LANDSIDOR } from '../lib/landsidor'
import { VAR_BO, VAR_BO_ORDNING } from '../lib/varbo'

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
    // Samma priser läst som rapport, för pressen. Se app/liftkortsindex/page.js.
    { path: '/liftkortsindex', changeFrequency: 'weekly', priority: 0.8 },
    // Fallhöjd och höjd över havet för alla orter. De vanligaste
    // sökfrågorna i Search Console i november 2026, se app/fallhojd/page.js.
    { path: '/fallhojd', changeFrequency: 'monthly', priority: 0.9 },
    // Frågan varje svensk skidåkare ställer före bokningen, och den enda
    // kategori sajten kan vinna — se lib/ellerAlperna.js.
    { path: '/are-eller-alperna', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/salen-eller-alperna', changeFrequency: 'monthly', priority: 0.9 },
    // Nattåget ligger lika högt som prislistan: det är den uppgift på
    // sajten som ingen internationell skidsajt kan bära. monthly och inte
    // yearly trots att tidtabellen byts en gång om året — sidan byter
    // innehåll när säsongen tar slut, och den ändringen ska hämtas.
    { path: '/nattaget-till-alperna', changeFrequency: 'monthly', priority: 0.9 },
    // Sportlovssidan ligger lika högt av samma skäl: veckan är svensk, och
    // vilken fredag nattåget går just den veckan står ingen annanstans.
    // Sidan tystnar av sig själv när sista sportlovsveckan passerats.
    { path: '/sportlov', changeFrequency: 'monthly', priority: 0.9 },
    // Påsklovet per kommun och snön i slutet av mars, se lib/pasklov.js.
    { path: '/pasklov', changeFrequency: 'monthly', priority: 0.8 },
    // Var man ska bo, per ort. Boende söks ca 11 000 gånger i månaden.
    // Se lib/varbo.js.
    // Bara orter som är publicerade, så att sidan inte länkar till en dold ortsida.
    ...VAR_BO_ORDNING.filter((s) => slugs.includes(s)).map((s) => ({ path: VAR_BO[s].path, changeFrequency: 'monthly', priority: 0.8 })),
    { path: '/skidorter-for-barnfamiljer', changeFrequency: 'monthly', priority: 0.8 },
    // Vilka svenska orter tåget når, se lib/fjalltag.js.
    { path: '/tag-till-fjallen', changeFrequency: 'monthly', priority: 0.8 },
    // En sida per land, se lib/landsidor.js.
    ...LANDSIDOR.map((l) => ({ path: `/skidorter/${l.slug}`, changeFrequency: 'monthly', priority: 0.8 })),
    { path: '/about', changeFrequency: 'monthly', priority: 0.4 },
    // Rankningsinformationen enligt marknadsföringslagen. Ligger över de
    // juridiska sidorna i prioritet eftersom den beskriver innehållet.
    { path: '/sa-jamfor-vi', changeFrequency: 'monthly', priority: 0.4 },
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
    // En sida per kommun vi läst sportlovet för, se lib/sportlov.js.
    ...KOMMUNER.map((k) => ({
      url: `${SITE_URL}/sportlov/${kommunSlug(k.kommun)}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
    // Och för påsklovet, se lib/pasklov.js.
    ...PASKLOV.map((r) => ({
      url: `${SITE_URL}/pasklov/${r.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
    ...slugs.map((slug) => ({
      url: `${SITE_URL}/resort/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
    { url: `${SITE_URL}/resa`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ...slugs.map((slug) => ({
      url: `${SITE_URL}/resa/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    })),
    // Bara de par som ska indexeras, och bara där båda orterna är
    // publicerade. Par-listorna står i koden och publiceringen i
    // databasen; utan filtret hade en dold ort lagt en 404 i sitemapen.
    //
    // Sitemapen ska bara innehålla sidor vi faktiskt vill se indexerade.
    // Sedan november 2026 är det alla kuraterade par — se INDEXERADE_PAR
    // i lib/jamfor.js.
    ...indexeradeParFor(slugs).map((par) => ({
      url: `${SITE_URL}/jamfor/${par}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    })),
  ]
}
