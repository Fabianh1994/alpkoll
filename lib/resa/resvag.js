/**
 * Resan dörr till dörr: etapper, tider och de antaganden planeraren gör.
 *
 * Allt här är rena funktioner utan Google, så att samma regler gäller för
 * bil, tåg och flyg och kan läsas på ett ställe.
 *
 * En resa är en lista etapper i tidsordning. Varje etapp har typ, start och
 * slut (millisekunder), varifrån och vart, och vägen som punkter för kartan.
 */

/** Tid på flygplatsen före avgång, i minuter. Alla flyg härifrån till Alperna är inom Schengen. */
export const FLYGPLATS_FORE = 90
/** Från landning till att väskan är hämtad och du står vid bussen. */
export const EFTER_LANDNING = 30
/** Längre än så här bakom ratten utan paus föreslår planeraren ett stopp. */
export const PAUS_EFTER_MIN = 150

export const FARG = {
  bil: '#D4A574',
  transfer: '#D4A574',
  tag: '#8EC5E8',
  buss: '#A7D7A0',
  gang: '#f0ece4',
  flyg: '#f0ece4',
  annat: '#C9B6E4',
}

export const TYPNAMN = {
  bil: 'Bil',
  transfer: 'Transfer',
  tag: 'Tåg',
  buss: 'Buss',
  gang: 'Gå',
  flyg: 'Flyg',
  annat: 'Kollektivtrafik',
}

const TZ = 'Europe/Stockholm'

/** 07.35 — som tiderna skrivs på resten av sajten. */
export function klocka(ms) {
  if (!Number.isFinite(ms)) return ''
  return new Intl.DateTimeFormat('sv-SE', { hour: '2-digit', minute: '2-digit', timeZone: TZ })
    .format(new Date(ms))
    .replace(':', '.')
}

/** "lör 19 dec" */
export function dag(ms) {
  return new Intl.DateTimeFormat('sv-SE', { weekday: 'short', day: 'numeric', month: 'short', timeZone: TZ })
    .format(new Date(ms))
    .replace('.', '')
}

/** Dagar mellan två tidpunkter räknat i svensk tid, för "+1" efter en klocka. */
export function dagarSenare(fran, till) {
  const d = (ms) => new Intl.DateTimeFormat('sv-SE', { timeZone: TZ }).format(new Date(ms))
  return Math.round((Date.parse(d(till)) - Date.parse(d(fran))) / 86400000)
}

/** 355 -> "5 tim 55 min", 45 -> "45 min", 120 -> "2 tim". */
export function langd(min) {
  if (!Number.isFinite(min)) return ''
  const m = Math.round(min)
  if (m < 60) return `${m} min`
  const t = Math.floor(m / 60)
  const r = m % 60
  return r ? `${t} tim ${r} min` : `${t} tim`
}

/** 2807 -> "2 807" med hårt mellanslag. */
export function heltal(n) {
  return new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0 }).format(n).replace(/\s/g, ' ')
}

/** Google och Transitous kallar fordonen olika saker; här blir de tåg, buss eller annat. */
export function fordon(typ) {
  const t = String(typ || '').toUpperCase()
  if (/RAIL|TRAIN|SUBWAY|METRO|TRAM|MONORAIL|FUNICULAR/.test(t)) return 'tag'
  if (/BUS|COACH|TROLLEY|SHARE_TAXI/.test(t)) return 'buss'
  return 'annat'
}

/** Byten = antal åk med kollektivtrafik minus ett. */
export function byten(etapper) {
  const ak = etapper.filter((e) => e.typ === 'tag' || e.typ === 'buss' || e.typ === 'annat' || e.typ === 'flyg').length
  return Math.max(0, ak - 1)
}

/** Sätter ihop en resa ur etapper och räknar start, slut och längd. */
export function resa(satt, etapper, extra = {}) {
  const start = etapper[0]?.start
  const slut = etapper[etapper.length - 1]?.slut
  return { satt, etapper, start, slut, min: (slut - start) / 60000, byten: byten(etapper), ...extra }
}

/**
 * Punkter längs en bilväg där det är dags för paus. Etappens väg och tid
 * fördelas efter avstånd, och en punkt läggs ut var PAUS_EFTER_MIN
 * minut, men inte närmare målet än 40 minuter.
 *
 * @returns [{ lat, lng, efterMin }]
 */
export function pauspunkter(path, totalMin) {
  if (!path?.length || !(totalMin > PAUS_EFTER_MIN)) return []
  const km = [0]
  for (let i = 1; i < path.length; i++) km.push(km[i - 1] + steg(path[i - 1], path[i]))
  const totalKm = km[km.length - 1]
  const punkter = []
  for (let t = PAUS_EFTER_MIN; t < totalMin - 40; t += PAUS_EFTER_MIN) {
    const mal = (t / totalMin) * totalKm
    const i = km.findIndex((k) => k >= mal)
    if (i > 0) punkter.push({ ...path[i], efterMin: t })
  }
  return punkter
}

function steg(a, b) {
  const rad = (x) => (x * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLng = rad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 12742 * Math.asin(Math.sqrt(h))
}

/** Nästa lördag, som förval i datumfältet. YYYY-MM-DD i svensk tid. */
export function nastaLordag(nu = new Date()) {
  const d = new Date(nu)
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7))
  return new Intl.DateTimeFormat('sv-SE', { timeZone: TZ }).format(d)
}

/**
 * Tidpunkt i svensk tid som millisekunder. Vintertid i Sverige och Alperna
 * är UTC+1; planeraren används bara för vintern, och sommartid rättas av
 * Intl nedan.
 */
export function svenskTid(datum, tid) {
  const gissning = Date.parse(`${datum}T${tid}:00+01:00`)
  const visad = new Intl.DateTimeFormat('sv-SE', { hour: '2-digit', minute: '2-digit', timeZone: TZ }).format(new Date(gissning))
  return visad === tid ? gissning : Date.parse(`${datum}T${tid}:00+02:00`)
}

/** "2026-12-05" + 7 -> "2026-12-12". Räknar i kalenderdagar, utan tidszon. */
export function plusDagar(datum, n) {
  const [a, m, d] = String(datum).split('-').map(Number)
  if (!a || !m || !d) return datum
  const t = new Date(Date.UTC(a, m - 1, d + n))
  return t.toISOString().slice(0, 10)
}

/** Datumet i svensk tid för en tidpunkt, som "2026-12-05". */
export function datumFor(msTid) {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: TZ }).format(new Date(msTid))
}
