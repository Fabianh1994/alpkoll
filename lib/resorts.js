import { cache } from 'react'
import { supabase } from './supabase'

// Alpkoll visar Alperna och Norden. De sex orterna utanför Europa ligger
// kvar i databasen men har published = false sedan migration 003, och
// filtreras bort här — på ett ställe, så att startsida, ortsidor,
// planerare och sitemap inte kan råka visa olika urval.
const PUBLICERADE = (q) => q.eq('published', true)

/**
 * Hämtar en publicerad skidort på slug. Cachad per request med React
 * cache() så att generateMetadata och sidkomponenten delar samma
 * Supabase-anrop istället för att göra två identiska queries.
 *
 * Dolda orter returnerar null, vilket ger 404 — inte en tom sida.
 */
export const getResort = cache(async (slug) => {
  const { data, error } = await PUBLICERADE(
    supabase.from('resorts').select('*')
  )
    .eq('slug', slug)
    .single()

  if (error) return null
  return data
})

/**
 * Ett fel från Supabase kastas i stället för att bli en tom lista.
 *
 * Med en tom lista sparade Next en startsida med "0 skidorter" och visade
 * den i en hel timme (revalidate = 3600) — det hände live 2026-11-17. När
 * felet kastas behåller Next i stället den senast lyckade versionen av
 * sidan, och ett bygge mot en pausad databas stoppas innan det når ut.
 * Noll publicerade orter räknas också som fel: det är aldrig rätt svar.
 */
function kravOrter(data, error, vad) {
  if (error) throw new Error(`Supabase: kunde inte hämta ${vad}: ${error.message}`)
  if (!data?.length) throw new Error(`Supabase: ${vad} gav noll publicerade orter`)
  return data
}

/** Alla publicerade orter, sorterade på namn i svensk bokstavsordning. */
export const getResorts = cache(async () => {
  const { data, error } = await PUBLICERADE(
    supabase.from('resorts').select('*')
  ).order('name')

  kravOrter(data, error, 'orterna')
  // .order('name') sorterar med databasens kollation, där å/ä/ö faller in
  // bland a och o: Åre hamnade tvåa i listan, och Sälen och Sölden före
  // St. Anton. Ordningen läsaren ser sätts här i stället, med samma
  // localeCompare(..., 'sv') som landsfiltret och liftkortspriserna.
  return [...data].sort((a, b) => a.name.localeCompare(b.name, 'sv'))
})

/** Slugs för publicerade orter — sitemap och generateStaticParams. */
export const getResortSlugs = cache(async () => {
  const { data, error } = await PUBLICERADE(
    supabase.from('resorts').select('slug')
  ).order('slug')

  kravOrter(data, error, 'ortadresserna')
  return data.map((r) => r.slug)
})
