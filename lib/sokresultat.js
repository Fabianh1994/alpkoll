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

// Titeln säger vad sidan hjälper till med: att välja ort och komma dit.
// Fallhöjden står kvar i beskrivningen, men frågan "fallhöjd sälen"
// besvaras för alla orter på /fallhojd. En ortsida som bara lovar en
// siffra blir läst i Google och inte klickad (beslut 22 november 2026).
export function ortTitel({ namn, harPris, sasong, nu }) {
  if (!harPris) return `${namn}: pister, snö och resan dit | Alpkoll`
  const ar = sasong === aktuellSasong(nu) ? ` ${sasongUtskriven(sasong)}` : ''
  return `${namn}${ar}: liftkort, pister och resan dit | Alpkoll`
}

// Beskrivningen hålls under ungefär 155 tecken; Google klipper vid
// ungefär 155 på datorn och kortare på mobilen. Den har fyra delar, i
// den här ordningen:
//
//   fakta     pist, fallhöjd och dagspris, det folk söker på
//   betyg     ortens två högsta betyg ur Vårt omdöme, alltså vem orten
//             passar. Det är skälet att klicka, och det skiljer orterna
//             åt. En fast mening som "vårt omdöme och var du bor" hade
//             stått likadan på alla 50 sidor (docs/copy.md, Framräknade
//             meningar).
//   resan     bilresan från närmaste av Stockholm, Göteborg och Malmö för
//             nordiska orter inom tio timmar, annars nattåget eller flyget
//   jämför    en eller två orter sidan länkar en jämförelse till
//
// Sexdagarspriset står på sidan och i /liftkortspriser. Säsongen för
// priset står i titeln.
export function ortBeskrivning({
  namn, fallhojd, pistKm, dagspass, betyg = [], resan = null, jamforMed = [],
}) {
  const fakta = `${namn}: ${pistKm} km pist, ${fallhojd} m fallhöjd${dagspass ? `, liftkort ${dagspass}/dag` : ''}.`
  const hogst = betyg.length ? ` Högst betyg: ${betyg.slice(0, 2).join(' och ')}.` : ''
  const resa = resan ? ` ${resan}.` : ''

  // Två orter att jämföra med, eller en, eller ingen, när texten annars
  // blir för lång och Google klipper bort slutet.
  const jamfor = (antal) => {
    const andra = jamforMed.slice(0, antal)
    return andra.length ? ` Jämför med ${andra.join(' och ')}.` : ''
  }
  for (const antal of [2, 1, 0]) {
    const text = `${fakta}${hogst}${resa}${jamfor(antal)}`
    if (text.length <= 155 || antal === 0) return text
  }
}

/**
 * Resan i en kort mening, eller null.
 *
 * @param bil     [{ stad, minuter }] för de städer som har en mätt bilresa
 * @param nattag  stationens namn när nattåget från Malmö når orten
 * @param flyg    flygplatsen, nearest_airport
 */
export function resanKort({ nordisk, bil = [], nattag = null, flyg = null }) {
  const narmast = [...bil].sort((a, b) => a.minuter - b.minuter)[0]
  if (nordisk && narmast && narmast.minuter <= 600) {
    const tim = (narmast.minuter / 60).toFixed(1).replace('.', ',').replace(/,0$/, '')
    return `${tim} timmar med bil från ${narmast.stad}`
  }
  if (nattag) return `Nattåg från Malmö till ${nattag}`
  if (flyg) return `Flyg till ${flyg}`
  return null
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
