/**
 * Svenskt påsklov 2027.
 *
 * Ligger i kod av samma skäl som lib/sportlov.js: det är en skolkalender,
 * inte en egenskap hos en skidort.
 *
 * Sidan finns för att det är så folk söker. Google Ads-volymerna för
 * Sverige (hämtade 22 november 2026) gav runt 5 500 sökningar i månaden
 * på "påsklov 2027" och "påsken 2027" med varianter, och Alpkoll hade
 * ingen sida om påsken.
 *
 * Samma regel som sportlovet: en kommun kommer med bara när vi läst
 * kommunens egen sida, och sidan länkar dit. Kommunerna är desamma som
 * i lib/sportlov.js, och länken är samma sida.
 *
 * Datumen står som kommunen skriver dem. Långfredag (26 mars) och
 * annandag påsk (29 mars) är röda dagar, och kommunerna räknar dem olika:
 * Stockholm skriver 30 mars–2 april, Göteborg 26 mars–2 april. Båda har
 * ledigt samma dagar efter påsk.
 *
 *
 * ── UPPDATERAS VARJE ÅR ───────────────────────────────────────────────
 *
 * Byt AR, PASKDAGEN, VECKOR, HAMTAD och raderna i PASKLOV, lästa på nytt
 * från kommunernas sidor. Påsken flyttar sig varje år, så veckorna gör
 * det också. Sidan tystnar av sig själv när sista påsklovsdagen passerats.
 */

import { KOMMUNER, kommunSlug } from './sportlov'

/** Året påsklovet infaller. */
export const AR = '2027'

/** Påskdagen 2027. */
export const PASKDAGEN = '2027-03-28'

/** Dagen kommunuppgifterna lästes. */
export const HAMTAD = '2026-11-22'

/** Veckorna påsklovet ligger i, måndag till söndag. */
// namn är veckans namn i löptext. Vecka 12 slutar på påskdagen och är
// alltså påskveckan, inte veckan före påsk.
export const VECKOR = [
  { nr: 12, start: '2027-03-22', slut: '2027-03-28', namn: 'påskveckan' },
  { nr: 13, start: '2027-03-29', slut: '2027-04-04', namn: 'veckan efter påsk' },
]

/**
 * Påsklovet per kommun. vecka är den vecka lovet i huvudsak ligger i.
 * start och slut är lovets första och sista dag som kommunen skriver
 * dem; null där kommunen bara anger veckan (Jönköping).
 *
 * Skövde och Örebro skriver 22–29 mars: lovet är vecka 12 och annandag
 * påsk läggs till. Eskilstuna börjar torsdag 25 mars och har resten av lovet
 * vecka 13.
 */
const RADER = [
  { kommun: 'Borlänge', vecka: 13, start: '2027-03-26', slut: '2027-04-02' },
  { kommun: 'Borås', vecka: 13, start: '2027-03-26', slut: '2027-04-02' },
  { kommun: 'Eskilstuna', vecka: 13, start: '2027-03-25', slut: '2027-04-02' },
  { kommun: 'Gävle', vecka: 13, start: '2027-03-30', slut: '2027-04-02' },
  { kommun: 'Göteborg', vecka: 13, start: '2027-03-26', slut: '2027-04-02' },
  { kommun: 'Halmstad', vecka: 13, start: '2027-03-30', slut: '2027-04-02' },
  { kommun: 'Helsingborg', vecka: 12, start: '2027-03-22', slut: '2027-03-25' },
  { kommun: 'Huddinge', vecka: 13, start: '2027-03-30', slut: '2027-04-02' },
  { kommun: 'Hudiksvall', vecka: 13, start: '2027-03-30', slut: '2027-04-02' },
  { kommun: 'Härjedalen', vecka: 13, start: '2027-03-26', slut: '2027-04-04' },
  { kommun: 'Jönköping', vecka: 13, start: null, slut: null },
  { kommun: 'Karlstad', vecka: 13, start: '2027-03-30', slut: '2027-04-02' },
  { kommun: 'Kristianstad', vecka: 13, start: '2027-03-30', slut: '2027-04-02' },
  { kommun: 'Linköping', vecka: 13, start: '2027-03-29', slut: '2027-04-02' },
  { kommun: 'Luleå', vecka: 13, start: '2027-03-30', slut: '2027-04-02' },
  { kommun: 'Lund', vecka: 12, start: '2027-03-22', slut: '2027-03-25' },
  { kommun: 'Malmö', vecka: 12, start: '2027-03-22', slut: '2027-03-28' },
  { kommun: 'Malung-Sälen', vecka: 13, start: '2027-03-30', slut: '2027-04-02' },
  { kommun: 'Norrköping', vecka: 13, start: '2027-03-30', slut: '2027-04-02' },
  { kommun: 'Sigtuna', vecka: 13, start: '2027-03-30', slut: '2027-04-02' },
  { kommun: 'Skellefteå', vecka: 13, start: '2027-03-30', slut: '2027-04-02' },
  { kommun: 'Skövde', vecka: 12, start: '2027-03-22', slut: '2027-03-29' },
  { kommun: 'Sollefteå', vecka: 13, start: '2027-03-26', slut: '2027-04-02' },
  { kommun: 'Solna', vecka: 13, start: '2027-03-29', slut: '2027-04-02' },
  { kommun: 'Stockholm', vecka: 13, start: '2027-03-30', slut: '2027-04-02' },
  { kommun: 'Sundsvall', vecka: 13, start: '2027-03-30', slut: '2027-04-02' },
  { kommun: 'Söderhamn', vecka: 13, start: '2027-03-30', slut: '2027-04-02' },
  { kommun: 'Uddevalla', vecka: 13, start: '2027-03-30', slut: '2027-04-02' },
  { kommun: 'Umeå', vecka: 13, start: '2027-03-30', slut: '2027-04-02' },
  { kommun: 'Uppsala', vecka: 13, start: '2027-03-30', slut: '2027-04-02' },
  { kommun: 'Varberg', vecka: 13, start: '2027-03-30', slut: '2027-04-02' },
  { kommun: 'Västerås', vecka: 13, start: '2027-03-30', slut: '2027-04-02' },
  { kommun: 'Växjö', vecka: 13, start: '2027-03-29', slut: '2027-04-02' },
  { kommun: 'Åre', vecka: 13, start: '2027-03-29', slut: '2027-04-02' },
  { kommun: 'Östersund', vecka: 13, start: '2027-03-29', slut: '2027-04-02' },
  // Tillagda 22 november 2026, se KOMMUNER i lib/sportlov.js.
  { kommun: 'Gotland', vecka: 13, start: '2027-03-30', slut: '2027-04-02' },
  { kommun: 'Kalmar', vecka: 13, start: '2027-03-30', slut: '2027-04-02' },
  { kommun: 'Kungsbacka', vecka: 13, start: '2027-03-29', slut: '2027-04-02' },
  { kommun: 'Mölndal', vecka: 13, start: '2027-03-30', slut: '2027-04-02' },
  { kommun: 'Nacka', vecka: 13, start: '2027-03-30', slut: '2027-04-02' },
  { kommun: 'Nyköping', vecka: 13, start: '2027-03-30', slut: '2027-04-02' },
  { kommun: 'Täby', vecka: 13, start: '2027-03-29', slut: '2027-04-02' },
  { kommun: 'Örebro', vecka: 12, start: '2027-03-22', slut: '2027-03-29' },
]

const SPORTLOV = Object.fromEntries(KOMMUNER.map((k) => [k.kommun, k]))

/**
 * Raderna med kommunens sida som källa, adressdelen för /pasklov/<slug>
 * och pa för "på Gotland". Slug och källa kommer från sportlovsraden, så
 * att samma kommun har samma adress under /sportlov och /pasklov.
 */
export const PASKLOV = RADER.map((r) => ({
  ...r,
  kalla: SPORTLOV[r.kommun]?.kalla,
  pa: Boolean(SPORTLOV[r.kommun]?.pa),
  slug: kommunSlug(r.kommun),
}))

/** Kommunens påsklovsrad ur adressdelen, eller null. */
export const pasklovFranSlug = (slug) => PASKLOV.find((r) => r.slug === slug) || null

/** Kommunerna med påsklov en viss vecka, i svensk bokstavsordning. */
export const kommunerVecka = (nr) =>
  PASKLOV.filter((r) => r.vecka === nr).sort((a, b) => a.kommun.localeCompare(b.kommun, 'sv'))

/** Sista dagen någon i listan har påsklov. Efter den tystnar sidan. */
export const PASKLOV_SLUT = RADER.reduce((max, r) => (r.slut && r.slut > max ? r.slut : max), '')

/** Har hela påsklovet passerat? */
export function pasklovetSlut(idag = new Date()) {
  return idag > new Date(`${PASKLOV_SLUT}T23:59:59+02:00`)
}

/**
 * Röda dagar runt påsken 2027 som faller på en vardag: långfredagen och
 * annandag påsk. Skolan är stängd då oavsett vad kommunen kallar lovet.
 */
export const RODA_DAGAR = ['2027-03-26', '2027-03-29']

const iso = (d) => d.toISOString().slice(0, 10)
const ledigDag = (d) => {
  const vd = d.getUTCDay()
  return vd === 0 || vd === 6 || RODA_DAGAR.includes(iso(d))
}

/**
 * Första och sista lediga dagen i rad runt kommunens lov, med helger och
 * röda dagar. Stockholms 30 mars–2 april blir 26 mars–4 april: långfredag,
 * påskhelgen och annandagen före, helgen efter. null utan datum.
 */
export function ledigtIRad(rad) {
  if (!rad?.start) return null
  const fran = new Date(`${rad.start}T12:00:00Z`)
  const till = new Date(`${rad.slut}T12:00:00Z`)
  for (;;) {
    const d = new Date(fran); d.setUTCDate(d.getUTCDate() - 1)
    if (!ledigDag(d)) break
    fran.setTime(d.getTime())
  }
  for (;;) {
    const d = new Date(till); d.setUTCDate(d.getUTCDate() + 1)
    if (!ledigDag(d)) break
    till.setTime(d.getTime())
  }
  const dagar = Math.round((till - fran) / 86400000) + 1
  return { start: iso(fran), slut: iso(till), dagar }
}

/** Veckans rad, eller null. */
export const veckan = (nr) => VECKOR.find((v) => v.nr === nr) || null

/**
 * Första lördag–lördag som ryms i ledigheten, eller null. Skidveckor i
 * fjällen och på nattåget räknas lördag till lördag.
 */
export function skidveckaInom(ledigt) {
  if (!ledigt) return null
  const d = new Date(`${ledigt.start}T12:00:00Z`)
  while (d.getUTCDay() !== 6) d.setUTCDate(d.getUTCDate() + 1)
  const hem = new Date(d); hem.setUTCDate(hem.getUTCDate() + 7)
  if (iso(hem) > ledigt.slut) return null
  return { start: iso(d), slut: iso(hem) }
}
