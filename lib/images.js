// Vilka bilder som får optimeras.
//
// next/image laddar om bilden och serverar den från Alpkolls egen domän
// i modernt format och rätt storlek. Det är en stor vinst för
// laddningstiden — men det förutsätter att vi faktiskt får använda
// bilden, eftersom vi då distribuerar en kopia snarare än att länka.
//
// En ortbild hotlänkas fortfarande från ett annat företags server:
//   myrkdalen   -> skiresort.info             (vår egen datakälla)
//
// Den renderas som en vanlig img-tagg, utan att Alpkoll serverar en kopia.
// Voss, Geilo och Grandvalira hotlänkades också fram till migration 025,
// som gav dem bilder från Wikimedia Commons och Unsplash med licens och
// fotograf — se lib/ortbilder.js. Myrkdalen har inga vinterbilder i någon
// fri källa; nästa steg är ortens egen pressbild.

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
