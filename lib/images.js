// Vilka bilder som får visas och optimeras.
//
// next/image laddar om bilden och serverar den från Alpkolls egen domän
// i modernt format och rätt storlek. Det är en stor vinst för
// laddningstiden — men det förutsätter att vi faktiskt får använda
// bilden, eftersom vi då distribuerar en kopia snarare än att länka.
//
// En bild från någon annan värd visas inte alls: utanOlicensieradBild()
// tar bort den när orterna hämtas. Myrkdalens bild hotlänkades från
// skiresort.info utan licens fram till november 2026; migration 037 gav
// orten en bild från Wikimedia Commons med licens och fotograf.
//
// Voss, Geilo och Grandvalira hotlänkades också fram till migration 025,
// som gav dem bilder från Wikimedia Commons och Unsplash med licens och
// fotograf — se lib/ortbilder.js.

const TILLATNA_VARDAR = [
  'upload.wikimedia.org',
  'images.unsplash.com',
  'odlzoewjwyipiopttucv.supabase.co',
]

/** Får bilden optimeras av next/image? */
export function farOptimeras(url) {
  if (!url) return false
  try {
    return TILLATNA_VARDAR.includes(new URL(url).hostname)
  } catch {
    return false
  }
}

/**
 * Orten utan image_url när bilden ligger hos en värd vi inte får kopiera
 * från. Används där orterna hämtas, så att ingen sida kan råka visa en
 * hotlänkad bild.
 */
export function utanOlicensieradBild(ort) {
  if (!ort?.image_url || farOptimeras(ort.image_url)) return ort
  return { ...ort, image_url: null }
}
