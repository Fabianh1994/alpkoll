import { cache } from 'react'
import { supabase } from './supabase'

// Bilderna per ort: hjältebilden först, galleriet efter.
//
// Tabellen resort_images kom i migration 025. Före den bar varje ort en
// enda bild i resorts.image_url, utan fotograf och utan licens — tjugo av
// de tjugosex Commons-bilderna krävde att fotografen namngavs, och ingen
// gjorde det. Nu står licens och fotograf på varje rad, och image_url sätts
// av migrationen till radens position 0 så att startsidans kort,
// jämförelsesidorna och ortsidan visar samma hjältebild.
//
// Urvalet gjordes av Fabian 2026-09-11 bland 610 fria kandidater från
// Wikimedia Commons och Unsplash. Adresserna pekar på originalen; next/image
// hämtar och skalar dem, så Alpkoll lagrar inga egna kopior.
//
// Finns tabellen inte — migrationen är okörd — blir svaret en tom lista
// och ortsidan ser ut som före galleriet. Koden kan alltså gå live före SQL:en.

/** Bilderna för en ort, i visningsordning. */
export const getOrtbilder = cache(async (slug) => {
  const { data, error } = await supabase
    .from('resort_images')
    .select('*')
    .eq('resort_slug', slug)
    .order('position')

  if (error) return []
  return data
})

/** Alla bilder, för sidan med bildkällor. */
export const getAllaOrtbilder = cache(async () => {
  const { data, error } = await supabase
    .from('resort_images')
    .select('*')
    .order('resort_slug')
    .order('position')

  if (error) return []
  return data
})

// Krediteringstexten ligger i lib/kreditering.js, som även galleriet —
// en klientkomponent — kan importera.
