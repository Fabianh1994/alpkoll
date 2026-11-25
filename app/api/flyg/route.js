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

  // Datan bygger på vad folk sökt på, så en enskild dag kan sakna flyg.
  // Därför prövas först dagen med svenska sökningar, sedan dagen med alla
  // marknader, och sist hela månaden, där bara flyg tre dagar runt datumet
  // behålls och märks som närliggande.
  const fraga = (avgang, marknad, antal = '30') => {
    const q = new URLSearchParams({
      origin: fran, destination: till, one_way: 'true', sorting: 'price',
      unique: 'false', currency: 'sek', limit: antal, token: nyckel,
    })
    if (avgang) q.set('departure_at', avgang)
    if (marknad) q.set('market', marknad)
    return q
  }
  const steg = [
    { namn: 'dagen-se', q: fraga(datum, 'se') },
    { namn: 'dagen', q: fraga(datum, null) },
    // Månaden sorteras på pris, så alla dagar hämtas innan de närmaste väljs.
    { namn: 'manaden', q: fraga(datum.slice(0, 7), null, '1000'), narliggande: true },
  ]

  // ?diag=1 visar hur många flyg varje steg gav, utan nyckeln, för felsökning.
  if (url.searchParams.get('diag')) {
    const rader = await Promise.all([...steg, { namn: 'utan-datum', q: fraga(null, null, '5') }].map(async (s) => {
      try {
        const d = await (await fetch(`${API}?${s.q}`, { cache: 'no-store' })).json()
        return { steg: s.namn, success: d?.success ?? null, error: d?.error ?? null, antal: d?.data?.length ?? 0, forsta: d?.data?.[0]?.departure_at ?? null }
      } catch (e) {
        return { steg: s.namn, fel: String(e) }
      }
    }))
    return Response.json({ diag: rader })
  }

  let data
  let kalla = null
  let apiFel = null
  for (const s of steg) {
    try {
      const svar = await fetch(`${API}?${s.q}`, {
        headers: { 'Accept-Encoding': 'gzip, deflate' },
        next: { revalidate: 10800 },
      })
      if (!svar.ok) return Response.json({ flyg: [], fel: `travelpayouts ${svar.status}` }, { status: 502 })
      const d = await svar.json()
      if (d?.success === false) apiFel = d.error || 'okänt fel'
      let rader = d?.data || []
      if (s.narliggande) {
        const mitt = Date.parse(`${datum}T12:00:00Z`)
        rader = rader.filter((f) => Math.abs(Date.parse(f.departure_at) - mitt) <= 3.5 * 864e5)
      }
      if (rader.length) { data = { data: rader }; kalla = s.namn; break }
    } catch {
      return Response.json({ flyg: [], fel: 'travelpayouts svarade inte' }, { status: 502 })
    }
  }
  if (!data) return Response.json({ flyg: [], ...(apiFel ? { fel: apiFel } : {}) })

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
        narliggande: f.departure_at.slice(0, 10) !== datum,
      }
    })
    // Samma flyg kan stå flera gånger med olika pris; det billigaste räcker.
    .filter((f, i, alla) => alla.findIndex((g) => g.nummer === f.nummer && g.avgang === f.avgang) === i)
    .sort((a, b) => a.avgang.localeCompare(b.avgang))

  return Response.json({ flyg, kalla })
}
