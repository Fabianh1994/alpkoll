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
  // Bara datum från i dag och ett år fram, så att ingen kan bränna
  // flygkvoten på datum som ingen reser.
  const riktigt = (d) => { if (!DATUM.test(d)) return false; const t = new Date(`${d}T00:00:00Z`); return !Number.isNaN(t.getTime()) && t.toISOString().slice(0, 10) === d }
  const idag = new Date().toISOString().slice(0, 10)
  const omEttAr = new Date(Date.now() + 366 * 86400000).toISOString().slice(0, 10)
  if (!riktigt(datum)) return Response.json({ fel: 'ogiltig fråga' }, { status: 400 })
  if (datum < idag || datum > omEttAr) return Response.json({ flyg: [], turRetur: null, utanforFonster: true })

  // Tur och retur: lägsta priset för paret med hemdagen. Bara från Ignav.
  const retur = url.searchParams.get('retur')
  if (retur) {
    const dagar = (Date.parse(retur) - Date.parse(datum)) / 86400000
    if (!riktigt(retur) || !(dagar >= 1 && dagar <= 30)) return Response.json({ fel: 'ogiltig fråga' }, { status: 400 })
    if (retur > omEttAr) return Response.json({ turRetur: null, utanforFonster: true })
    const nyckelTR = process.env.IGNAV_NYCKEL
    if (!nyckelTR) return Response.json({ turRetur: null })
    return Response.json({ turRetur: await ignavTurRetur(fran, till, datum, retur, nyckelTR) })
  }

  // Livedata från Ignav när nyckeln finns; annars, eller om Ignav inte
  // svarar, Aviasales sparade sökningar nedan.
  const ignav = process.env.IGNAV_NYCKEL
  if (ignav && !url.searchParams.get('diag')) {
    const live = await ignavFlyg(fran, till, datum, ignav)
    if (live?.length) return Response.json({ flyg: live, kalla: 'ignav' })
  }

  const nyckel = process.env.TRAVELPAYOUTS_NYCKEL
  if (!nyckel) return Response.json({ flyg: [], saknarNyckel: !ignav })

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
    const live = ignav ? await ignavFlyg(fran, till, datum, ignav) : null
    return Response.json({
      ignav: ignav ? { antal: live?.length ?? null, forsta: live?.[0] ? `${live[0].nummer} ${live[0].avgang} ${live[0].pris} kr` : null } : 'ingen nyckel',
      diag: rader,
    })
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

/** Aviasales sökning för sträckan och dagen, t.ex. ARN2002INN1. Partnerlank sätter markören. */
function aviasalesSok(fran, till, datum) {
  return `https://www.aviasales.com/search/${fran}${datum.slice(8, 10)}${datum.slice(5, 7)}${till}1`
}

/** Aviasales sökning tur och retur, en person: ARN2002INN27021. */
function aviasalesTurRetur(fran, till, datum, retur) {
  const ddmm = (d) => `${d.slice(8, 10)}${d.slice(5, 7)}`
  return `https://www.aviasales.com/search/${fran}${ddmm(datum)}${till}${ddmm(retur)}1`
}

/**
 * Lägsta priset tur och retur från Ignav, med en incheckad väska per
 * person och högst ett byte. En tur och retur-biljett är ofta billigare än
 * två enkla. Cachas tre timmar.
 */
async function ignavTurRetur(fran, till, datum, retur, nyckel) {
  try {
    const svar = await fetch('https://ignav.com/api/fares/round-trip', {
      method: 'POST',
      headers: { 'X-Api-Key': nyckel, 'Content-Type': 'application/json' },
      body: JSON.stringify({ origin: fran, destination: till, departure_date: datum, return_date: retur, max_stops: 1, market: 'SE', checked_bags: 1 }),
      next: { revalidate: 10800 },
    })
    if (!svar.ok) return null
    const d = await svar.json()
    const billigast = (d?.itineraries || [])
      .filter((it) => it.price?.currency === 'SEK' && Number.isFinite(it.price.amount))
      .sort((a, b) => a.price.amount - b.price.amount)[0]
    if (!billigast) return null
    return {
      pris: billigast.price.amount,
      bolag: billigast.outbound?.carrier || null,
      vaska: billigast.baggage_pricing?.status || null,
      lank: aviasalesTurRetur(fran, till, datum, retur),
    }
  } catch {
    return null
  }
}

/**
 * Riktiga avgångar för dagen från Ignav (live, svensk marknad, högst ett
 * byte). Svaret cachas tre timmar per sträcka och dag, så samma sökning från
 * många läsare blir ett anrop. Länken går till Aviasales, där läsaren ser
 * livepriset och Alpkoll får provision.
 */
async function ignavFlyg(fran, till, datum, nyckel) {
  try {
    const svar = await fetch('https://ignav.com/api/fares/one-way', {
      method: 'POST',
      headers: { 'X-Api-Key': nyckel, 'Content-Type': 'application/json' },
      // En incheckad väska per person: på en skidresa ska priset ha med
      // väskan, och Ignav lägger till bolagets avgift för den.
      body: JSON.stringify({ origin: fran, destination: till, departure_date: datum, max_stops: 1, market: 'SE', checked_bags: 1 }),
      next: { revalidate: 10800 },
    })
    if (!svar.ok) return null
    const d = await svar.json()
    const lank = aviasalesSok(fran, till, datum)
    return (d?.itineraries || [])
      .map((it) => {
        const seg = it.outbound?.segments || []
        const forsta = seg[0]
        const sista = seg[seg.length - 1]
        if (!forsta?.departure_time_utc || !sista?.arrival_time_utc) return null
        const avgang = Date.parse(forsta.departure_time_utc)
        const ankomst = Date.parse(sista.arrival_time_utc)
        return {
          fran: forsta.departure_airport,
          till: sista.arrival_airport,
          avgang: new Date(avgang).toISOString(),
          ankomst: new Date(ankomst).toISOString(),
          minuter: Math.round((ankomst - avgang) / 60000),
          byten: seg.length - 1,
          bolag: it.outbound?.carrier || flygbolag(forsta.marketing_carrier_code),
          bolagKod: forsta.marketing_carrier_code || null,
          nummer: forsta.flight_number ? `${forsta.marketing_carrier_code || ''} ${forsta.flight_number}`.trim() : null,
          pris: it.price?.currency === 'SEK' && Number.isFinite(it.price.amount) ? it.price.amount : null,
          // Om priset har med väskan: 'reported_included' (ingår), 'estimated'
          // (avgiften uppskattad och tillagd) eller 'unknown'.
          vaska: it.baggage_pricing?.status || null,
          // Varje flyg för sig, så att bytet syns: var, och hur lång tid.
          delar: seg.map((s) => ({
            fran: s.departure_airport,
            till: s.arrival_airport,
            avgang: s.departure_time_utc ? new Date(Date.parse(s.departure_time_utc)).toISOString() : null,
            ankomst: s.arrival_time_utc ? new Date(Date.parse(s.arrival_time_utc)).toISOString() : null,
            nummer: s.flight_number ? `${s.marketing_carrier_code || ''} ${s.flight_number}`.trim() : null,
          })),
          lank,
          live: true,
        }
      })
      .filter(Boolean)
      .filter((f, i, alla) => alla.findIndex((g) => g.nummer === f.nummer && g.avgang === f.avgang) === i)
      .sort((a, b) => a.avgang.localeCompare(b.avgang))
  } catch {
    return null
  }
}
