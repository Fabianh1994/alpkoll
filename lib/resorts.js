import { cache } from 'react'
import { supabase } from './supabase'

/**
 * Hämtar en skidort på slug. Cachad per request med React cache() så att
 * generateMetadata och sidkomponenten delar samma Supabase-anrop istället
 * för att göra två identiska queries.
 */
export const getResort = cache(async (slug) => {
  const { data, error } = await supabase
    .from('resorts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data
})

/** Alla slugs — används av sitemap.js. */
export const getResortSlugs = cache(async () => {
  const { data, error } = await supabase
    .from('resorts')
    .select('slug')
    .order('slug')

  if (error) return []
  return data.map((r) => r.slug)
})
