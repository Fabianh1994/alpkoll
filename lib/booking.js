// Booking.com affiliate-länkar.
//
// Sätt NEXT_PUBLIC_BOOKING_AID i .env.local (och i Vercel) till ditt
// affiliate-ID från Booking.com Partner Hub. Utan ID byggs en vanlig
// söklänk — sajten fungerar, men klicken ger ingen provision.

const AID = process.env.NEXT_PUBLIC_BOOKING_AID

/**
 * Bygger en söklänk till Booking.com för en destination.
 *
 * @param destination Ort att söka på, t.ex. resort.accommodation_zone
 * @param options.lang  'sv' eller 'en' — styr Bookings gränssnittsspråk
 * @param options.label Spårningsetikett så du ser i Partner Hub vilken
 *                      sidtyp som konverterar (t.ex. 'resort-sidebar')
 */
export function bookingUrl(destination, { lang = 'en', label } = {}) {
  const params = new URLSearchParams({
    ss: destination,
    lang: lang === 'sv' ? 'sv' : 'en-gb',
    selected_currency: 'EUR',
  })

  if (AID) {
    params.set('aid', AID)
    if (label) params.set('label', label)
  }

  return `https://www.booking.com/searchresults.html?${params.toString()}`
}

/** True när affiliate-ID är konfigurerat — användbart för att dölja/visa disclosure. */
export const hasAffiliateId = Boolean(AID)
