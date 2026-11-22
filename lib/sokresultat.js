// Det Google visar för en ortsida: titeln och beskrivningen.
//
// Underlaget är Search Console 11 augusti–13 november 2026. Ortsidorna
// hade 5 535 exponeringar och 20 klick (0,36 %), jämförelsesidorna 2,3 %.
// Folk klickar när de väljer mellan två orter, inte när de letar en
// siffra. Därför slutar beskrivningen med jämförelsen, och den nämner
// bara orter som den här sidan faktiskt länkar en jämförelse till.
//
// Säsongen skrivs i titeln när priset avser den säsong som pågår, och
// annars i beskrivningen bredvid priset ("liftkort 2025/26: ..."), så att
// ett pris aldrig står utan säsong.
//
// Search Console 24 oktober–20 november 2026: 1 861 exponeringar, 15
// klick. De vanligaste frågorna var "fallhöjd sälen/åre/trysil/hemsedal"
// och "zermatt höjd över havet", ingen gav ett klick. De frågorna tar
// /fallhojd för alla orter på en gång. Ortsidan svarar på det större:
// ska jag åka hit, och hur kommer jag dit (beslut 22 november 2026).

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
//
// "Pistkarta" i stället för "pister": Google Ads-volymer för Sverige
// (hämtade 22 november 2026) ger ca 29 000 sökningar i månaden på
// "pistkarta <ort>" (trysil pistkarta 3 600, åre pistkarta 3 600) och
// ca 26 000 på "liftkort <ort>". Sidan länkar redan ortens pistkarta.
// Underlaget är projektets sökordskarta från 22 november 2026.
// En ort utan kartadress visar inget pistkartekort, och då säger
// titeln "pister" som förut.
export function ortTitel({ namn, harPris, harPistkarta = false, sasong, nu }) {
  const pist = harPistkarta ? 'pistkarta' : 'pister'
  if (!harPris) return `${namn}: ${pist}, snö och resan dit | Alpkoll`
  const ar = sasong === aktuellSasong(nu) ? ` ${sasongUtskriven(sasong)}` : ''
  return `${namn}${ar}: liftkort, ${pist} och resan dit | Alpkoll`
}

// Beskrivningen hålls under ungefär 155 tecken; Google klipper vid
// ungefär 155 på datorn och kortare på mobilen. Den har fyra delar, i
// den här ordningen:
//
//   fakta     pist, fallhöjd och dagspris, det folk söker på
//   starkast  de två första under "Starkast" i Vårt omdöme, med sidans
//             egna etiketter. Det är skälet att klicka, och det skiljer
//             orterna åt. En fast mening som "vårt omdöme och var du bor" hade
//             stått likadan på alla 50 sidor (docs/copy.md, Framräknade
//             meningar).
//   resan     bilresan från närmaste av Stockholm, Göteborg och Malmö för
//             nordiska orter inom sju timmar, annars flyget, och för
//             orter nattåget når även det
//   jämför    en eller två orter sidan länkar en jämförelse till
//
// Sexdagarspriset står på sidan och i /liftkortspriser.
export function ortBeskrivning({
  namn, fallhojd, pistKm, dagspass, sasong, nu, starkast = [], resan = null, jamforMed = [],
}) {
  const ar = sasong && sasong !== aktuellSasong(nu) ? sasongUtskriven(sasong) : null
  const pris = dagspass ? `, liftkort${ar ? ` ${ar}:` : ''} ${dagspass}/dag` : ''
  const fakta = `${namn}: ${pistKm} km pist, ${fallhojd} m fallhöjd${pris}.`
  const hogst = starkast.length ? ` Starkast: ${starkast.slice(0, 2).join(' och ')}.` : ''
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
export function resanKort({ nordisk, bil = [], nattag = false, flyg = null }) {
  // Bilen bara när den är den rimliga vägen. Voss är 9,6 timmar från
  // Göteborg, och dit flyger man till Bergen.
  const narmast = [...bil].sort((a, b) => a.minuter - b.minuter)[0]
  if (nordisk && narmast && narmast.minuter <= 420) {
    const tim = (narmast.minuter / 60).toFixed(1).replace('.', ',').replace(/,0$/, '')
    return `Ungefär ${tim} timmar med bil från ${narmast.stad}`
  }
  // Flygplatsen som skiresort.com och databasen kallar den.
  const plats = flyg === 'Scandinavian Mountains' ? 'Sälen (Scandinavian Mountains)' : flyg
  // Nattåget går en gång i veckan och oftast vidare med buss, så flyget
  // står först, som i vanliga frågor (lib/vanligaFragor.js).
  if (plats && nattag) return `Flyg till ${plats} eller nattåg från Malmö`
  if (plats) return `Flyg till ${plats}`
  if (nattag) return 'Nattåg från Malmö'
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
