// Booking.com-länkar, spårade via affiliatenätverket CJ.
//
// Booking tar nordiska partner via CJ ("Nordics Affiliate Programme powered
// by CJ"), inte via Partner Hub. Klicket går till CJ:s klicklänk, som
// registrerar det och skickar vidare till adressen i `url`. Formatet är
// avläst i CJ:s GET CODE för länken "Evergreen Link for Booking.com Nordics".
//
// Bookings eget aid ska INTE med i adressen: spårningen är CJ:s.
//
// SPARNING är huvudbrytaren. Satt till false byggs en vanlig söklänk utan
// provision, och annonsmärkningen och CJ-stycket i integritetspolicyn släcks
// i samma deploy — de hänger alla på hasAffiliateId.

const SPARNING = true

const CJ_PID = '101887836'
const CJ_LANK = '15734870'

/**
 * Bygger en söklänk till Booking.com för en destination.
 *
 * @param destination Ort att söka på, t.ex. resort.accommodation_zone
 * @param options.lang  'sv' eller 'en' — styr Bookings gränssnittsspråk
 * @param options.label Vilken knapp som klickades (t.ex. 'resort-sidebar-are').
 *                      Går till CJ som sid, så att rapporterna visar
 *                      placeringen och trafikkällan framgår för Booking.
 */
export function bookingUrl(destination, { lang = 'en', label } = {}) {
  const sok = new URLSearchParams({
    ss: destination,
    lang: lang === 'sv' ? 'sv' : 'en-gb',
    selected_currency: 'EUR',
  })
  const bookingAdress = `https://www.booking.com/searchresults.html?${sok.toString()}`

  if (!SPARNING) return bookingAdress

  const klick = new URLSearchParams()
  if (label) klick.set('sid', label)
  klick.set('url', bookingAdress)

  return `https://www.jdoqocy.com/click-${CJ_PID}-${CJ_LANK}?${klick.toString()}`
}

/** True när länkarna spåras — styr annonsmärkningen och policystycket om CJ. */
export const hasAffiliateId = SPARNING
