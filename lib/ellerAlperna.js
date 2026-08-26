import { kronorTal } from './pris'
import { VERIFIERADE } from './liftkortspriser'

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
 * Snälltåget kör Malmö–Österrike vintertid, 18 december 2026 till 14 mars
 * 2027. Listan står i kod och inte i databasen därför att den beskriver en
 * tågoperatörs tidtabell, inte en egenskap hos orten — den kan ändras utan
 * att något om orten ändras.
 *
 * Att i stället läsa ut det ur transport_info vore att tolka prosa för att
 * göra ett påstående. Bara Sölden nämner Snälltåget i klartext i dag.
 */
export const NATTAGSORTER = ['solden', 'ischgl', 'st-anton', 'mayrhofen']

export const NATTAG_SASONG = '18 december 2026 till 14 mars 2027'

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

    fallhojd: { ort: ort.vertical_drop_m, alper: spann(alper.map((r) => r.vertical_drop_m)) },
    hogre: alper.filter((r) => r.vertical_drop_m > ort.vertical_drop_m).length,

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

    nattag: alper.filter((r) => NATTAGSORTER.includes(r.slug)),
  }
}
