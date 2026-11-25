// Varje utgående länk som kan ge provision går genom den här komponenten.
//
// Tre saker ska vara lika överallt och får därför inte skrivas för hand på
// varje sida: adressen byggs av partnerns egen länkbyggare, rel och ny flik
// sätts här, och spårningsnamnet till nätverket (CJ:s sid) följer ett och
// samma mönster. Märkningen "Annons" står i direkt anslutning till länken,
// som marknadsföringslagen kräver — se Annonsmarkning.js.
//
// Spårningsnamnet är <sidtyp>-<placering>-<ortens slug>, t.ex.
// resort-stay-are eller jamfor-besluta-salen. CJ:s rapporter visar det, så
// att det går att se vilka sidor och knappar som ger klick. Ortsidans tre
// gamla namn (resort-mobile-, resort-stay-, resort-sidebar-) är oförändrade,
// så att rapporterna från 22 september går att jämföra bakåt.
//
// Vercel Analytics används inte för klicken. Egna händelser finns inte på
// gratisplanen och Pro tar två egenskaper per händelse — CJ ser redan varje
// klick, med placeringen i namnet.
//
// Ett nytt partnerprogram läggs till i PARTNERS nedan: namnet, om länkarna
// spåras, och hur adressen byggs.

import { bookingUrl, hasAffiliateId as bookingSparas } from '../lib/booking'
import Annonsmarkning from './Annonsmarkning'

const PARTNERS = {
  booking: {
    namn: 'Booking.com',
    sparas: bookingSparas,
    adress: ({ destination, checkin, checkout, sid }) =>
      bookingUrl(destination, { lang: 'sv', label: sid, checkin, checkout }),
  },
  // Flyg via Travelpayouts (Aviasales). Markören är kontots id och står i
  // NEXT_PUBLIC_TRAVELPAYOUTS_MARKER; spårningsnamnet följer efter en punkt,
  // som Travelpayouts läser som SubID. Utan markör blir det en vanlig länk
  // till Aviasales, utan provision och utan annonsmärkning.
  aviasales: {
    namn: 'Aviasales',
    sparas: Boolean(process.env.NEXT_PUBLIC_TRAVELPAYOUTS_MARKER),
    adress: ({ url, sid }) => {
      const marker = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_MARKER
      if (!marker) return url
      const u = new URL(url)
      u.searchParams.set('marker', sid ? `${marker}.${sid}` : marker)
      return u.toString()
    },
  },
  // Transfer från flygplatsen via Travelpayouts (Holiday Taxis). Länken
  // skapas i Travelpayouts när programmet är godkänt och läggs i
  // NEXT_PUBLIC_HOLIDAYTAXIS_LANK; spårningsnamnet läggs efter markören med
  // en punkt, som för Aviasales. Utan länk går knappen rakt till Holiday
  // Taxis, utan provision och utan annonsmärkning.
  holidaytaxis: {
    namn: 'Holiday Taxis',
    sparas: Boolean(process.env.NEXT_PUBLIC_HOLIDAYTAXIS_LANK),
    adress: ({ sid }) => {
      const lank = process.env.NEXT_PUBLIC_HOLIDAYTAXIS_LANK
      if (!lank) return 'https://www.holidaytaxis.com/'
      const u = new URL(lank)
      const marker = u.searchParams.get('marker')
      if (marker && sid) u.searchParams.set('marker', `${marker.split('.')[0]}.${sid}`)
      return u.toString()
    },
  },
  // Uthyrare utan avtal, se lib/varbo.js. Länken går rakt till deras sida,
  // utan spårning och därför utan annonsmärkning och utan rel="sponsored".
  // Får en av dem ett avtal läggs den till som egen partner här.
  direkt: {
    sparas: false,
    adress: ({ url }) => url,
  },
}

/**
 * @param partner   nyckel i PARTNERS
 * @param sid       spårningsnamnet, se ovan
 * @param sok       det partnern ska söka på, t.ex. { destination, checkin, checkout }
 * @param markning  'kompakt', 'full' eller null. null när en gemensam
 *                  märkning redan står ovanför en grupp knappar.
 * @param markningStyle marginaler för märkningen
 */
export default function Partnerlank({
  partner = 'booking',
  sid,
  sok,
  markning = 'kompakt',
  markningStyle,
  style,
  children,
}) {
  const p = PARTNERS[partner]
  const href = p.adress({ ...sok, sid })

  // rel="sponsored" betyder att länken är betald. En länk utan spårning
  // ger ingen provision och märks därför varken för Google eller läsaren.
  const rel = p.sparas ? 'noopener noreferrer sponsored' : 'noopener noreferrer'

  return (
    <>
      {markning && p.sparas && <Annonsmarkning kompakt={markning === 'kompakt'} style={markningStyle} partner={p.namn} aktiv={p.sparas} />}
      <a href={href} target="_blank" rel={rel} style={style}>
        {children}
      </a>
    </>
  )
}
