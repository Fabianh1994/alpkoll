// Märkningen vid varje affiliatelänk.
//
// Marknadsföringslagen kräver att det framgår att en länk är kommersiell
// och vem som står bakom den, och att det framgår *i direkt anslutning
// till länken*. Branschrekommendationen från IAB Sverige och
// Tidningsutgivarna, september 2025, säger samma sak och föreslår ordet
// "Annons".
//
// rel="sponsored" räcker alltså inte. Det attributet är en signal till
// Google och syns aldrig för läsaren. Sidan /affiliate-disclosure räcker
// heller inte på egen hand — en upplysning på en undersida är inte i
// direkt anslutning till någonting.
//
// SAMMA REKOMMENDATION SÄGER ATT LÄNKAR UTAN KOMMERSIELLT SAMARBETE INTE
// SKA MÄRKAS, eftersom de inte är marknadsföring. Därför hänger
// märkningen på hasAffiliateId och inte på att länken går till
// Booking.com: utan ID byggs en vanlig söklänk som inte ger någon
// provision, och att kalla den "Annons" vore ett påstående som inte är
// sant. Märkningen tänds automatiskt samma deploy som spårningen.
//
// Vid knappen står bara "Annons" och partnerns namn (Fabian 2026-11-25:
// en hel mening vid varje knapp blev för mycket). Förklaringen om
// provision står en gång i sidfoten, SiteFooter.js.

import { hasAffiliateId } from '../lib/booking'

/**
 * @param kompakt  finns kvar för anropen, men märkningen är numera alltid kort
 * @param style    marginaler från platsen där märkningen står
 * @param partner  vem länken går till, t.ex. 'Aviasales'
 * @param aktiv    om länken ger provision; utelämnad gäller Bookings ID
 */
export default function Annonsmarkning({ kompakt = false, style, partner = 'Booking.com', aktiv }) {
  // Andra partner än Booking avgör själva om länken är kommersiell (aktiv).
  if (!(aktiv ?? hasAffiliateId)) return null

  return (
    <p style={{
      fontFamily: 'var(--font-body)', fontSize: 11, lineHeight: 1.5,
      color: 'rgba(255,255,255,0.5)', margin: 0, ...style,
    }}>
      <span style={{
        fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
        color: '#D4A574', marginRight: 6,
      }}>
        Annons
      </span>
      {partner}
    </p>
  )
}
