// Vilka bilder som får optimeras.
//
// next/image laddar om bilden och serverar den från Alpkolls egen domän
// i modernt format och rätt storlek. Det är en stor vinst för
// laddningstiden — men det förutsätter att vi faktiskt får använda
// bilden, eftersom vi då distribuerar en kopia snarare än att länka.
//
// Fyra ortbilder hotlänkas i dag från andra företags servrar:
//   voss        -> content.igluski.com        (brittisk skidresebyrå)
//   geilo       -> snowfinders.co.uk          (brittisk researrangör)
//   myrkdalen   -> skiresort.info             (vår egen datakälla)
//   grandvalira -> images.squarespace-cdn.com
//
// De renderas som vanliga img-taggar: oförändrat mot i dag, men utan att
// Alpkoll börjar servera kopior. När bilderna byts mot något licensierat
// — Wikimedia Commons, eller ortens egen pressbild — hamnar de
// automatiskt i den optimerade vägen.

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
