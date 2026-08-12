// Vad en vecka kostar.
//
// Ortsidan räknade tidigare fram kostnaden som veckokortet plus 400 till
// 900 euro. Samma påslag för Sälen som för Zermatt, oavsett om man kör
// dit eller flyger. Formeln träffade det researchade est_weekly_cost_eur
// för två av 32 orter och låg systematiskt lågt — Courchevel visade
// 750–1 250 € där fältet säger 2 000 €.
//
// est_weekly_cost_eur är ifyllt för samtliga 32 publicerade orter och
// spänner 900–2 600 €. Det är fortfarande en uppskattning, men en per ort
// i stället för en formel, och texten säger att det är en uppskattning.
//
// price_tier används inte och ska inte användas: klasserna överlappar —
// klass 1 spänner 900–1 550 € och klass 3 spänner 1 300–2 600 € — och gav
// Cortina d'Ampezzo etiketten Budget medan billigare Hemavan fick Premium.

// Hårt mellanslag. Skrivet med fromCharCode i stället för tecknet själv,
// eftersom ett U+00A0 i källkoden inte går att skilja från ett vanligt
// mellanslag när man läser filen.
const HART = String.fromCharCode(0xa0)

/**
 * 1400 -> "1 400 €", med hårda mellanslag både i tusentalet och före
 * valutan. Utan dem kan beloppet brytas mitt i talet, eller lämna
 * euro-tecknet ensamt på nästa rad i ett smalt kort.
 *
 * Grupperingen görs för hand i stället för med toLocaleString: samma tal
 * ska se likadant ut oavsett vilken ICU-data servern och webbläsaren har.
 */
export function euro(belopp) {
  if (!Number.isFinite(belopp) || belopp <= 0) return null
  const grupperat = String(Math.round(belopp)).replace(/\B(?=(\d{3})+(?!\d))/g, HART)
  return `${grupperat}${HART}€`
}

// veckokostnad() stod här och gav "ca 1 400 €". Den är ersatt av pris()
// nedan, som visar kronor med ortens eget belopp inom parentes — sajten
// är svensk och läsaren ska slippa räkna om i huvudet.

// ── Kronor ────────────────────────────────────────────────────────────
//
// Läsaren är svensk och ska inte behöva räkna om i huvudet. Beloppen
// lagras i den valuta orten tar betalt i och räknas om här mot ECB:s
// dagskurser — se lib/valuta.js om varför omräkningen inte ligger i
// databasen.

/**
 * Valutan för est_weekly_cost_eur, som alltid är euro.
 *
 * Fältet får medvetet inte följa `lift_pass_currency`. Den kolumnen säger
 * vad orten tar betalt för liftkortet, och veckokostnaden är inte ett
 * liftkortspris utan en researchad uppskattning i euro för hela resan —
 * namnet säger det och spannet 900–2 600 säger det.
 *
 * Kopplade fälten ihop hade dagen då Åre får 'SEK' gjort att 1 600 €
 * renderades som "1 600 kr", en elftedel av beloppet, utan att någon rad
 * i veckokostnaden hade ändrats. Ett fält ska inte kunna byta enhet för
 * att ett annat fält fick en valuta.
 */
export const VALUTA_VECKOKOSTNAD = 'EUR'

/**
 * Till vilken jämnhet kronbeloppet avrundas.
 *
 * Femtio, inte tio. Tio kronor på ett femtusenkronorsbelopp är två
 * promilles precision, och varken kursen eller priset är så exakt: ECB:s
 * kurs rör sig mer än så mellan två dagar, och flera orter prissätter
 * dynamiskt så att talet gäller den dag det hämtades. Ett jämnt
 * femtiotal säger åt läsaren att detta är ungefär, vilket det är.
 *
 * Det exakta beloppet finns kvar inom parentes i ortens egen valuta, så
 * ingenting går förlorat — det som avrundas är omräkningen, inte priset.
 */
export const AVRUNDNING_KR = 50

/**
 * 432 CHF -> "4 620 kr". Returnerar null när beloppet eller kursen saknas.
 *
 * @param belopp  i ortens egen valuta
 * @param valuta  'EUR' | 'SEK' | 'CHF' | 'NOK'
 * @param kurser  från hamtaKurser() i lib/valuta.js
 */
export function kronor(belopp, valuta, kurser) {
  if (!Number.isFinite(belopp) || belopp <= 0 || !kurser) return null

  const kod = String(valuta || 'EUR').toUpperCase()
  if (kod === 'SEK') return formateraKronor(belopp)

  // Kurserna står som "så här många X går på en euro". Vägen till kronor
  // går därför alltid via euro, även för de nordiska valutorna.
  const perEuro = kod === 'EUR' ? 1 : kurser[kod]
  if (!Number.isFinite(perEuro) || perEuro <= 0) return null

  return formateraKronor((belopp / perEuro) * kurser.SEK)
}

function formateraKronor(belopp) {
  const avrundat = Math.round(belopp / AVRUNDNING_KR) * AVRUNDNING_KR
  if (avrundat <= 0) return null

  // Samma handgjorda gruppering som euro() ovan, av samma skäl: talet ska
  // se likadant ut oavsett vilken ICU-data servern och webbläsaren har.
  const grupperat = String(avrundat).replace(/\B(?=(\d{3})+(?!\d))/g, HART)
  return `${grupperat}${HART}kr`
}

/** Grupperar tusental och lämnar decimalerna ifred. 1234.5 -> "1 234,50". */
function talet(belopp) {
  const [heltal, decimaler] = (
    Number.isInteger(belopp) ? String(belopp) : belopp.toFixed(2).replace(/0$/, '')
  ).split('.')

  // Grupperingen görs bara på heltalsdelen. Slås den på hela strängen
  // hoppar den över tal med decimaler helt, eftersom kommatecknet bryter
  // uppslaget — 1 400,50 hade blivit "1400,50".
  const grupperat = heltal.replace(/\B(?=(\d{3})+$)/g, HART)
  return decimaler ? `${grupperat},${decimaler}` : grupperat
}

/**
 * Beloppet som orten själv skriver det. 469 EUR -> "469 €".
 *
 * Halvtal förekommer — Bad Gastein tar 78,50 € om dagen — och behålls,
 * eftersom parentesen finns just för att vara exakt.
 */
function ursprungligt(belopp, kod) {
  if (!Number.isFinite(belopp) || belopp <= 0) return null

  const tecken = { EUR: '€', SEK: 'kr' }[kod] || kod
  return `${talet(belopp)}${HART}${tecken}`
}

/**
 * Priset i två delar: kronor att visa stort, originalvalutan att visa
 * litet inom parentes.
 *
 *   pris(469, 'EUR', k)  -> { kr: 'ca 5 150 kr', ursprung: '469 €' }
 *   pris(432, 'CHF', k)  -> { kr: 'ca 4 950 kr', ursprung: '432 CHF' }
 *   pris(3744, 'SEK', k) -> { kr: '3 744 kr', ursprung: null }
 *
 * Delarna hålls isär i stället för att slås ihop till en sträng, så att
 * varje sida kan sätta parentesen mindre och blekare utan att behöva
 * plocka isär texten igen.
 *
 * "ca" står på själva talet och inte i en fotnot. Ett avrundat belopp som
 * ser exakt ut är ett påstående vi inte kan stå för, och läsaren ska
 * slippa leta reda på förbehållet någon annanstans på sidan.
 *
 * Svenska belopp visas exakt, utan "ca" och utan parentes: där finns
 * varken omräkning eller avrundning att ta höjd för. Att avrunda 3 744
 * till 3 750 och sedan skriva "(3 744 kr)" bredvid vore att först
 * förstöra talet och sedan be om ursäkt för det.
 */
export function pris(belopp, valuta, kurser) {
  if (!Number.isFinite(belopp) || belopp <= 0) return null

  const kod = String(valuta || 'EUR').toUpperCase()
  if (kod === 'SEK') return { kr: ursprungligt(belopp, 'SEK'), ursprung: null }

  const kr = kronor(belopp, kod, kurser)
  if (!kr) return null

  return { kr: `ca ${kr}`, ursprung: ursprungligt(belopp, kod) }
}
