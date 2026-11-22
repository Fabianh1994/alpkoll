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
//
// Search Console 24 oktober–20 november 2026: 1 861 exponeringar, 15
// klick. De vanligaste frågorna var "fallhöjd sälen/åre/trysil/hemsedal"
// och "zermatt höjd över havet", ingen gav ett klick. Titeln bär därför
// "höjd över havet" i stället för "pister", och /fallhojd svarar på
// samma frågor för alla orter på en gång.

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
  if (!harPris) return `${namn}: fallhöjd, höjd över havet och pister | Alpkoll`
  const ar = sasong === aktuellSasong(nu) ? ` ${sasongUtskriven(sasong)}` : ''
  return `${namn}: fallhöjd, höjd över havet och liftkort${ar} | Alpkoll`
}

// Beskrivningen hålls under ungefär 155 tecken. Förut var den 150–200,
// och Google klipper vid ungefär 155 på datorn och kortare på mobilen,
// så "Jämför med ..." föll bort för de längsta orterna. Sexdagarspriset
// fick ge plats: det står på sidan och i /liftkortspriser, och det är
// dagspriset folk söker ("liftkort sälen pris").
//
// "Över havet" står utskrivet därför att det är så folk frågar:
// "zermatt höjd över havet", "sälen höjd över havet". Ett spann som
// "1 562–3 899 m" svarar på frågan men innehåller inte orden.
//
// För en ort som är flera skilda områden (lib/delomraden.js) går
// fallhöjden inte att räkna ur spannet, och 308 m bredvid "572 till
// 887 m" hade sett ut som ett räknefel. Då står bara hur högt pisten
// når, `pistTopp`, som är den högsta pistade delens topp. Databasens
// topp duger inte: i Chamonix är den Aiguille du Midi, en lift utan pist.
export function ortBeskrivning({
  namn, fallhojd, pistKm, liftar, bas, topp, pistTopp = null, dagspass, sasong, jamforMed = [],
}) {
  const hojd = pistTopp
    ? `pist upp till ${pistTopp} m över havet`
    : `från ${bas} till ${topp} m över havet`
  const fakta = `${namn}: fallhöjd ${fallhojd} m, ${hojd}. ${pistKm} km pist, ${liftar} liftar.`

  const ar = sasongUtskriven(sasong)
  const liftkort = dagspass ? ` Liftkort${ar ? ` ${ar}` : ''}: ${dagspass}/dag.` : ''

  // Två orter att jämföra med, eller en när texten annars blir för lång
  // och Google klipper bort slutet.
  const jamfor = (antal) => {
    const andra = jamforMed.slice(0, antal)
    return andra.length ? ` Jämför med ${andra.join(' och ')}.` : ''
  }
  const lang = `${fakta}${liftkort}${jamfor(2)}`
  return lang.length <= 155 ? lang : `${fakta}${liftkort}${jamfor(1)}`
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
