import { kronorTal } from './pris'
import { VERIFIERADE } from './liftkortspriser'
import { NATTAGSORTER, nattagFor } from './nattaget'

/**
 * Underlaget för sidorna "Åre eller Alperna" och "Sälen eller Alperna".
 *
 * Varför de sidorna finns: mätning 2026-08-25 visade att alpkoll.se syns på
 * "åre eller st anton" men inte på "åre eller alperna". Parsidorna rankar
 * alltså för den fråga de svarar på — men den frågan ställs av några
 * hundra, medan frågan mot regionen är den varje svensk skidåkare ställer
 * innan hon bokar. Vi hade tretton sidor mot enskilda alporter och noll mot
 * Alperna som helhet.
 *
 * Det är också den enda kategori sajten kan vinna. På pistkilometer och
 * liftar förlorar vi mot skiresort.com, som har samma tal och rankar redan.
 * "Ska en svensk åka till Åre eller till Alperna" är inte en sakfråga utan
 * ett beslut, och det avgörs av restid, nattåg och vad veckan kostar i
 * kronor — fält ingen internationell skidsajt har.
 */

/** Vad som räknas som Alperna. Grandvalira ligger i Pyrenéerna och är inte med. */
const ALPLANDER = new Set(['France', 'Austria', 'Italy', 'Switzerland'])

export const arAlport = (resort) => ALPLANDER.has(resort.country)

/**
 * Alporterna som nås med nattåg från Sverige, utan flyg.
 *
 * Listan stod tidigare här som fyra slugs på en rad. Den var fel på två
 * sätt samtidigt: den utelämnade Kitzbühel, som tåget faktiskt stannar i,
 * och den låg till grund för en mening som påstod att de fyra nåddes utan
 * transfer — alla fyra kräver buss.
 *
 * Datan ligger nu i lib/nattaget.js med stationer, busshållplatser och
 * restider, mätt mot Snälltågets tidtabell 2026-08-30. Skälet att den
 * fortfarande står i kod och inte i databasen är oförändrat: den beskriver
 * en tågoperatörs tidtabell, inte en egenskap hos orten.
 */
export { NATTAGSORTER } from './nattaget'
export { SASONG as NATTAG_SASONG } from './nattaget'

/**
 * Orterna som har en egen "eller Alperna"-sida.
 *
 * Bara de två svenskar faktiskt väljer mellan Alperna och hemma. Listan
 * finns för att ortsidan ska kunna länka dit — utan internlänk hade sidan
 * legat ogenomsökt, vilket är exakt det mätningen 2026-08-25 visade:
 * 62 procent av de länkade sidorna var genomsökta mot 21 av de olänkade.
 */
export const HAR_ALPSIDA = ['are', 'salen']

export const alpsidaFor = (slug) => (HAR_ALPSIDA.includes(slug) ? `/${slug}-eller-alperna` : null)

/**
 * Fallhöjden räknas ur höjderna, aldrig ur `vertical_drop_m`.
 *
 * Kolumnen går isär med `altitude_top − altitude_base` för nitton av de
 * trettio publicerade orterna, och den går isär åt två olika håll. Rukas
 * 292 meter ligger i ett spann på 201 och är omöjligt oavsett hur fältet
 * definieras. Val Thorens 930 mot 2 130 är i stället en definitionskrock:
 * kolumnen bär ortens egen fallhöjd medan höjderna avser hela det
 * sammankopplade området, precis som pist och liftar gör enligt
 * konventionen i CLAUDE.md.
 *
 * Följden syntes live. Ortsidan räknade fram 939 meter för Åre medan den
 * här sidan läste 894 ur kolumnen och skrev ut talet i brödtext — samma
 * sajt, samma ort, två tal. `lib/jamfor.js` hade redan gjort det här
 * valet för jämförelsetabellen; nu gör alla sidor likadant.
 */
export const fallhojd = (r) => r.altitude_top - r.altitude_base

/** Samma avrundning som lib/pris.js visar med. */
const till50 = (tal) => Math.round(tal / 50) * 50

/** Medianen, för att ett spann inte ska styras av ett enda ytterläge. */
function median(tal) {
  const sorterade = tal.filter(Number.isFinite).sort((a, b) => a - b)
  if (!sorterade.length) return null
  const mitt = Math.floor(sorterade.length / 2)
  const varde = sorterade.length % 2 ? sorterade[mitt] : (sorterade[mitt - 1] + sorterade[mitt]) / 2
  // Halva kilometer och halva höjdmeter är precision talen inte har, och
  // "219.5" skrivs dessutom med engelsk decimalpunkt i en svensk mening.
  return Math.round(varde)
}

const spann = (tal) => {
  const rena = tal.filter(Number.isFinite)
  return rena.length ? { lag: Math.min(...rena), hog: Math.max(...rena), median: median(rena) } : null
}

/**
 * Ortens tal mot alporternas, som siffror sidan kan skriva meningar av.
 *
 * Allt härleds ur databasen vid rendering. Ingen mening om Alperna står
 * skriven i klartext, så inget påstående kan motsäga fälten den dag en
 * ort läggs till eller ett pris rättas.
 */
export function alpjamforelse(ort, alla, kurser) {
  const alper = alla.filter(arAlport)
  if (!ort || alper.length === 0) return null

  // Samma filter som /liftkortspriser: bara priser vi kan stå för.
  // Utan det satte Chamonix spannets botten på 3 150 kr med ett belopp som
  // aldrig hämtats, och sidan hade motsagt prislistan som utesluter det.
  const kr = (r) =>
    VERIFIERADE[r.slug] ? kronorTal(r.lift_pass_week_eur, r.lift_pass_currency || 'EUR', kurser) : null
  const veckaKr = (r) => kronorTal(r.est_weekly_cost_eur, 'EUR', kurser)

  const ortKort = kr(ort)
  const alpKort = spann(alper.map(kr))

  return {
    antal: alper.length,
    lander: [...new Set(alper.map((r) => r.country))].length,

    pist: { ort: ort.total_pistes_km, alper: spann(alper.map((r) => r.total_pistes_km)) },
    // Hur många alporter som faktiskt är större säger mer än ett spann:
    // "alla utom en" är ett tydligare svar än "100 till 600 kilometer".
    storre: alper.filter((r) => r.total_pistes_km > ort.total_pistes_km).length,

    fallhojd: { ort: fallhojd(ort), alper: spann(alper.map(fallhojd)) },
    hogre: alper.filter((r) => fallhojd(r) > fallhojd(ort)).length,

    sno: { ort: ort.snow_guarantee_score, alper: spann(alper.map((r) => r.snow_guarantee_score)) },
    sasong: { ort: ort.season_length_days, alper: spann(alper.map((r) => r.season_length_days)) },

    liftkort: { ort: ortKort, alper: alpKort },
    // Billigare än orten, i kronor. Det är den jämförelse en svensk gör.
    //
    // Jämförelsen görs på det AVRUNDADE beloppet, inte på det exakta.
    // Sidan visar allt avrundat till närmaste femtio — det är precisionen
    // varken kursen eller priset har — och en jämförelse på exakta tal gav
    // "3 750 kr" bredvid "3 750 kr" med påståendet att den ena är billigare.
    // Fyra kronor är inte en skillnad när talet säger ungefär.
    billigare:
      ortKort === null
        ? null
        : alper.filter((r) => {
            const k = kr(r)
            return k !== null && till50(k) < till50(ortKort)
          }).length,

    vecka: { ort: veckaKr(ort), alper: spann(alper.map(veckaKr)) },

    // Varje ort får sin nattågsuppgift med sig — station, buss eller inte,
    // och hållplatsens namn i byn. Sidan kan då skriva ut skillnaden mellan
    // "tåget stannar här" och "buss från Innsbruck" i stället för att
    // påstå att alla nås likadant, vilket var felet före 2026-08-30.
    nattag: alper
      .filter((r) => NATTAGSORTER.includes(r.slug))
      .map((r) => ({ ...r, nattaget: nattagFor(r.slug) })),
  }
}
