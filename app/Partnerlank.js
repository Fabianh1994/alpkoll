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
    sparas: bookingSparas,
    adress: ({ destination, checkin, checkout, sid }) =>
      bookingUrl(destination, { lang: 'sv', label: sid, checkin, checkout }),
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
      {markning && <Annonsmarkning kompakt={markning === 'kompakt'} style={markningStyle} />}
      <a href={href} target="_blank" rel={rel} style={style}>
        {children}
      </a>
    </>
  )
}
