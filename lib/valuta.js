// Växelkurser, hämtade i stället för inskrivna.
//
// Liftkortspriserna lagras i den valuta orten faktiskt tar betalt i.
// Zermatt kostar 432 CHF, inte "ungefär 462 euro" — och en euro-siffra i
// databasen är en omräkning som var sann den dag den skrevs och sedan
// tyst blir fel. Samma fälla som lift_pass_week_eur gick i: ett tal som
// ingen migration rör åldras utan att någon märker det.
//
// Därför konverteras här, vid visning, mot ECB:s dagskurser. Sajten är
// svensk och priserna visas i kronor.
//
// Källan är frankfurter.dev, som serverar Europeiska centralbankens
// referenskurser utan nyckel. ECB publicerar en gång per bankdag, så en
// timmes cache är gott om marginal — och det är samma intervall som
// ortsidorna revalideras med.

const KALLA = 'https://api.frankfurter.dev/v1/latest?base=EUR&symbols=SEK,CHF,NOK'

const MANADER = [
  'januari', 'februari', 'mars', 'april', 'maj', 'juni',
  'juli', 'augusti', 'september', 'oktober', 'november', 'december',
]

/**
 * "2026-08-11" -> "11 augusti 2026".
 *
 * ECB:s datum är maskinläsbart och hör hemma så i ett API, men "kursen
 * den 2026-08-11" är inte svenska. Skrivs för hand i stället för med
 * toLocaleDateString, av samma skäl som beloppen i lib/pris.js: samma
 * datum ska se likadant ut oavsett serverns ICU-data.
 */
export function skrivDatum(iso) {
  const delar = String(iso || '').split('-')
  if (delar.length !== 3) return null

  const [ar, manad, dag] = delar
  const namn = MANADER[Number(manad) - 1]
  return namn ? `${Number(dag)} ${namn} ${ar}` : null
}

/**
 * Reservkurser om ECB inte svarar.
 *
 * Alternativet vore att dölja priset när hämtningen fallerar, men då
 * försvinner en av sidans bärande siffror för att någon annans server är
 * nere. Kurserna är från 2026-08-11 och behöver inte vara färska för att
 * duga — de ska hindra att sidan går sönder, inte konkurrera med ECB.
 *
 * Att de är daterade i koden är med flit: blir de gamla ska det synas när
 * någon läser filen.
 */
const RESERV = { datum: '2026-08-11', SEK: 10.9635, CHF: 0.9351, NOK: 10.9705 }

/**
 * Kurser mot euro, som { SEK, CHF, NOK, datum, farsk }.
 *
 * `farsk` är false när reservkurserna används, så att den som vill kan
 * låta bli att skriva ut ett datum vi inte står för.
 */
export async function hamtaKurser() {
  try {
    const svar = await fetch(KALLA, { next: { revalidate: 3600 } })
    if (!svar.ok) throw new Error(`ECB svarade ${svar.status}`)

    const data = await svar.json()
    const { SEK, CHF, NOK } = data.rates || {}

    // Alla tre måste finnas och vara rimliga. En nolla eller ett saknat
    // fält skulle annars ge ett pris på noll kronor, vilket ser ut som
    // ett erbjudande i stället för ett fel.
    if (![SEK, CHF, NOK].every((k) => Number.isFinite(k) && k > 0)) {
      throw new Error('ofullständigt kurssvar')
    }

    return { SEK, CHF, NOK, datum: data.date || RESERV.datum, farsk: true }
  } catch {
    return { ...RESERV, farsk: false }
  }
}
