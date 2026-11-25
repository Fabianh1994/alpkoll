import SiteHeader from '../SiteHeader'
import SiteFooter from '../SiteFooter'
import Kartsida from './Kartsida'
import { getResorts } from '../../lib/resorts'
import { SITE_URL } from '../../lib/lang'
import { hamtaKurser } from '../../lib/valuta'

// Kartan först: alla orter på en karta. Läsaren väljer ort, byter snabbt
// och jämför upp till tre, med restiden räknad från sin egen adress.
// Restiderna räknas bara för den valda orten och de jämförda (Fabian valde
// det 2026-11-26), så att Googles kvot räcker.

export const revalidate = 3600

const TITEL = 'Reseplanerare för skidresan: alla orter på kartan | Alpkoll'
const BESKRIVNING = 'Välj skidort på kartan och se resan dit från din egen adress med bil, tåg och flyg. Jämför upp till tre orter i Sverige, Norge, Finland och Alperna.'

export const metadata = {
  title: TITEL,
  description: BESKRIVNING,
  alternates: { canonical: `${SITE_URL}/resa` },
  openGraph: { title: TITEL, description: BESKRIVNING, url: `${SITE_URL}/resa`, siteName: 'Alpkoll', type: 'website', locale: 'sv_SE', images: ['/og-image.png'] },
}

export default async function ResaKartsida() {
  const [alla, kurser] = await Promise.all([getResorts(), hamtaKurser()])
  const orter = alla
    .filter((r) => r.latitude != null && r.longitude != null)
    .map((r) => ({
      slug: r.slug,
      namn: r.name,
      lat: Number(r.latitude),
      lng: Number(r.longitude),
      land: r.country,
      portkod: r.nearest_airport_code || null,
      flygplats: r.nearest_airport || null,
      transfer: Number.isFinite(r.transfer_minutes) ? r.transfer_minutes : null,
    }))

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>
      <SiteHeader />
      <Kartsida orter={orter} kurser={kurser} />
      <SiteFooter />
    </div>
  )
}
