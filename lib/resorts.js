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

/** Alla publicerade orter, sorterade på namn i svensk bokstavsordning. */
export const getResorts = cache(async () => {
  const { data, error } = await PUBLICERADE(
    supabase.from('resorts').select('*')
  ).order('name')

  if (error) return []
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

  if (error) return []
  return data.map((r) => r.slug)
})
