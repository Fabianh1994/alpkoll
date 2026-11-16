// Det Google visar för en ortsida: titeln och beskrivningen.
//
// Underlaget är Search Console 11 augusti–13 november 2026. Ortsidorna
// hade 5 535 exponeringar och 20 klick (0,36 %), jämförelsesidorna 2,3 %.
// Folk klickar när de väljer mellan två orter, inte när de letar en
// siffra. Därför slutar beskrivningen med jämförelsen, och den nämner
// bara orter som den här sidan faktiskt länkar en jämförelse till.
//
// Titeln bär sökorden så som de skrivs: "fallhöjd sälen", "liftkort
// hemsedal pris", "sälen priser". Landet stod förut i titeln och tog
// plats från dem; det står kvar på sidan.
//
// Säsongen skrivs bara ut i titeln när priset avser den säsong som pågår.
// St. Anton bär 25/26 tills orten publicerat 26/27, och då lovar titeln
// inget årtal. Beskrivningen skriver alltid ut vilken säsong talet avser.

/** Säsongen som pågår, som "26/27". Ny säsong räknas från 1 juli. */
export function aktuellSasong(nu = new Date()) {
  const ar = nu.getFullYear()
  const start = nu.getMonth() >= 6 ? ar : ar - 1
  return `${String(start).slice(2)}/${String(start + 1).slice(2)}`
}

/** "26/27" -> "2026/27". Annat, som "Gällande", ger null. */
export function sasongUtskriven(sasong) {
  return /^\d\d\/\d\d$/.test(sasong || '') ? `20${sasong}` : null
}

export function ortTitel({ namn, harPris, sasong, nu }) {
  if (!harPris) return `${namn}: fallhöjd, pister och snö | Alpkoll`
  const ar = sasong === aktuellSasong(nu) ? ` ${sasongUtskriven(sasong)}` : ''
  return `${namn}: fallhöjd, pister och pris på liftkort${ar} | Alpkoll`
}

export function ortBeskrivning({
  namn, fallhojd, pistKm, liftar, bas, topp, dagspass, veckopass, sasong, jamforMed = [],
}) {
  const fakta = `${namn}: ${fallhojd} m fallhöjd, ${pistKm} km pist, ${liftar} liftar, ${bas}–${topp} m.`

  const priser = [
    dagspass ? `${dagspass}/dag` : null,
    veckopass ? `${veckopass} för sex dagar` : null,
  ].filter(Boolean).join(', ')
  const ar = sasongUtskriven(sasong)
  const liftkort = priser ? ` Liftkort${ar ? ` ${ar}` : ''}: ${priser}.` : ''

  const andra = jamforMed.slice(0, 2)
  const jamfor = andra.length ? ` Jämför med ${andra.join(' och ')}.` : ''

  return `${fakta}${liftkort}${jamfor}`
}

// Vilka orter beskrivningen nämner. De som svenskar oftast väljer mellan
// står först — de fyra stod för 17 av 23 klick på jämförelsesidorna.
const FORST = ['are', 'salen', 'trysil', 'hemsedal']

/** Ordnar motparterna så att de mest sökta kommer först. */
export function jamforOrdning(motparter) {
  const plats = (slug) => {
    const i = FORST.indexOf(slug)
    return i === -1 ? FORST.length : i
  }
  return [...motparter].sort((a, b) => plats(a.slug) - plats(b.slug))
}
