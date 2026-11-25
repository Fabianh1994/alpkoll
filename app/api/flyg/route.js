import { FLYGPLATSER } from '../../../lib/resa/flygplatser'
import { flygbolag } from '../../../lib/resa/flygbolag'

// Flyg mellan två flygplatser en viss dag, för reseplaneraren.
//
// Datan kommer från Travelpayouts (Aviasales Data API): riktiga flyg med
// bolag, flightnummer, avgångstid, restid och pris, så som de syntes i
// Aviasales sökningar de senaste dygnen. Det är inte en livesökning — den
// kräver 50 000 besökare i månaden — men tiderna är flygbolagens egna och
// priset uppdateras av sig själv. Livepriset ser läsaren när länken öppnas.
//
// Nyckeln ligger i TRAVELPAYOUTS_NYCKEL och lämnar aldrig servern. Saknas
// den svarar routen tomt, och planeraren visar flygalternativet utan
// avgångar i stället för att gå sönder.
//
// Svaret cachas tre timmar per sträcka och dag, så att samma sökning från
// många läsare blir ett anrop.

const API = 'https://api.travelpayouts.com/aviasales/v3/prices_for_dates'
const IATA = /^[A-Z]{3}$/
const DATUM = /^\d{4}-\d{2}-\d{2}$/

export async function GET(request) {
  const url = new URL(request.url)
  const fran = url.searchParams.get('fran') || ''
  const till = url.searchParams.get('till') || ''
  const datum = url.searchParams.get('datum') || ''

  if (!IATA.test(fran) || !IATA.test(till) || !DATUM.test(datum) || !FLYGPLATSER[fran] || !FLYGPLATSER[till]) {
    return Response.json({ fel: 'ogiltig fråga' }, { status: 400 })
  }

  const nyckel = process.env.TRAVELPAYOUTS_NYCKEL
  if (!nyckel) return Response.json({ flyg: [], saknarNyckel: true })

  const fraga = new URLSearchParams({
    origin: fran,
    destination: till,
    departure_at: datum,
    one_way: 'true',
    sorting: 'price',
    unique: 'false',
    currency: 'sek',
    market: 'se',
    limit: '30',
    token: nyckel,
  })

  let data
  try {
    const svar = await fetch(`${API}?${fraga}`, {
      headers: { 'Accept-Encoding': 'gzip, deflate' },
      next: { revalidate: 10800 },
    })
    if (!svar.ok) return Response.json({ flyg: [], fel: `travelpayouts ${svar.status}` }, { status: 502 })
    data = await svar.json()
  } catch {
    return Response.json({ flyg: [], fel: 'travelpayouts svarade inte' }, { status: 502 })
  }

  const flyg = (data?.data || [])
    .filter((f) => f.departure_at && Number.isFinite(f.duration_to ?? f.duration))
    .map((f) => {
      const minuter = f.duration_to ?? f.duration
      const avgang = new Date(f.departure_at)
      return {
        fran: f.origin_airport || fran,
        till: f.destination_airport || till,
        avgang: avgang.toISOString(),
        ankomst: new Date(avgang.getTime() + minuter * 60000).toISOString(),
        minuter,
        byten: f.transfers ?? 0,
        bolag: flygbolag(f.airline),
        bolagKod: f.airline || null,
        nummer: f.flight_number ? `${f.airline || ''} ${f.flight_number}`.trim() : null,
        pris: Number.isFinite(f.price) ? f.price : null,
        lank: f.link ? `https://www.aviasales.com${f.link}` : null,
      }
    })
    // Samma flyg kan stå flera gånger med olika pris; det billigaste räcker.
    .filter((f, i, alla) => alla.findIndex((g) => g.nummer === f.nummer && g.avgang === f.avgang) === i)
    .sort((a, b) => a.avgang.localeCompare(b.avgang))

  return Response.json({ flyg })
}
