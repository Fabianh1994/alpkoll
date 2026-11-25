// Små hjälpare för reseplanerarens formulär och val. Ligger här, utan
// React, så att de går att testa (tests/resa.test.mjs).

/**
 * Ett riktigt datum som YYYY-MM-DD, inte bara rätt form. Året måste vara
 * rimligt: medan man skriver årtalet rapporterar Chrome mellanlägen som
 * 0002-02-20, och de ska inte sparas.
 */
export function giltigtDatum(d) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d || '')) return false
  const ar = Number(d.slice(0, 4))
  if (ar < 2020 || ar > 2100) return false
  const t = new Date(`${d}T12:00:00Z`)
  return !Number.isNaN(t.getTime()) && t.toISOString().slice(0, 10) === d
}

/** Ett tal inom gränserna, annars null. Tar både 0,7 och 0.7. */
export function rimligt(text, min, max) {
  const s = String(text ?? '').trim().replace(',', '.')
  if (!s) return null
  const n = Number(s)
  return Number.isFinite(n) && n >= min && n <= max ? n : null
}

/**
 * Aviasales-länk för rätt antal vuxna. Sökvägen slutar med antalet, t.ex.
 * /search/ARN2002INN1 eller tur och retur /search/ARN2002INN27021. Bara
 * sökvägen ändras; en frågesträng (Travelpayouts länkar har en) lämnas.
 */
export function medResenarer(url, antal) {
  const n = Math.min(Math.max(1, Math.floor(Number(antal) || 1)), 9)
  if (!url || n === 1) return url
  let u
  try { u = new URL(url) } catch { return url }
  const m = u.pathname.match(/^(\/search\/[A-Z]{3}\d{4}[A-Z]{3}(?:\d{4})?)1$/)
  if (!m) return url
  u.pathname = `${m[1]}${n}`
  return u.toString()
}

/**
 * En resa man faktiskt kan ta: inte saknad, inte ett flyg som kräver att
 * man åker före den valda tiden, och inte ett flyg ett annat datum.
 */
export function kanTas(r) {
  return !!r && !r.saknas && !r.tidigare && !r.flyget?.narliggande
}

/** Färdsättet som är framme först, i första hand bland resor man kan ta. */
export function snabbastSatt(resor, satt) {
  const forst = (lista) => lista.sort((a, b) => resor[a].slut - resor[b].slut)[0] || null
  return forst(satt.filter((s) => kanTas(resor[s]))) || forst(satt.filter((s) => resor[s] && !resor[s].saknas))
}
