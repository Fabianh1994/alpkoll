import { FLYGPLATSER } from './flygplatser'

/**
 * Flyg från Sverige till en flygplats, för ortsidans "tre bästa
 * flygplatserna" innan läsaren skrivit sin adress.
 *
 * Frågar Travelpayouts (Aviasales Data API) om det billigaste kommande
 * flyget från Arlanda, Landvetter och Kastrup: först direktflyg, och bara
 * om inget finns, flyg med byte. Svaret cachas sex timmar, och samma
 * sträcka delas mellan alla orter som har samma flygplats.
 *
 * Utan TRAVELPAYOUTS_NYCKEL returneras null och sidan visar bara
 * transfertiden.
 */

export const NAV = ['ARN', 'GOT', 'CPH']
const API = 'https://api.travelpayouts.com/aviasales/v3/prices_for_dates'

async function billigast(fran, till, direkt, nyckel) {
  const q = new URLSearchParams({
    origin: fran, destination: till, one_way: 'true', direct: String(direkt),
    sorting: 'price', currency: 'sek', market: 'se', limit: '1', token: nyckel,
  })
  try {
    const r = await fetch(`${API}?${q}`, { next: { revalidate: 21600 } })
    if (!r.ok) return null
    const d = await r.json()
    const f = d?.data?.[0]
    return f && Number.isFinite(f.price) ? { fran, pris: f.price, byten: f.transfers ?? 0, datum: f.departure_at } : null
  } catch {
    return null
  }
}

/**
 * @returns null utan nyckel, annars { direkt: ['ARN', ...], pris, medByte }
 *          där pris är det lägsta priset bland direktflygen, eller bland
 *          flygen med byte om inga direktflyg finns.
 */
export async function flygHint(kod) {
  const nyckel = process.env.TRAVELPAYOUTS_NYCKEL
  if (!nyckel || !FLYGPLATSER[kod]) return null
  const direkta = (await Promise.all(NAV.map((h) => billigast(h, kod, true, nyckel)))).filter(Boolean)
  if (direkta.length) {
    return { direkt: direkta.map((d) => d.fran), pris: Math.min(...direkta.map((d) => d.pris)), medByte: false }
  }
  const medByte = (await Promise.all(NAV.map((h) => billigast(h, kod, false, nyckel)))).filter(Boolean)
  if (!medByte.length) return { direkt: [], pris: null, medByte: false }
  return { direkt: [], pris: Math.min(...medByte.map((d) => d.pris)), medByte: true }
}
