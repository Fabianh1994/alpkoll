import Link from 'next/link'
import { notFound } from 'next/navigation'
import SiteHeader from '../../SiteHeader'
import SiteFooter from '../../SiteFooter'
import Reseplanerare from '../Reseplanerare'
import Partnerlank from '../../Partnerlank'
import { getResort, getResortSlugs } from '../../../lib/resorts'
import { bookingSok } from '../../../lib/booking'
import { SITE_URL } from '../../../lib/lang'
import { hamtaKurser } from '../../../lib/valuta'

// Resan dörr till dörr till en ort: din adress in, bil, tåg och flyg ut,
// ritat på kartan längs de riktiga vägarna. Planeraren själv är en
// klientkomponent; sidan ger den orten och resten av ramen.

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getResortSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const r = await getResort(slug)
  if (!r) return {}
  const adress = `${SITE_URL}/resa/${slug}`
  const titel = `Resan till ${r.name} dörr till dörr: bil, tåg och flyg | Alpkoll`
  const beskrivning = `Skriv din adress och se hela resan till ${r.name} på kartan: bilvägen med pauser, tåg och buss med byten, och flyg med vägen till flygplatsen och transfern.`
  return {
    title: titel,
    description: beskrivning,
    alternates: { canonical: adress },
    openGraph: { title: titel, description: beskrivning, url: adress, siteName: 'Alpkoll', type: 'website', locale: 'sv_SE', images: ['/og-image.png'] },
  }
}

export default async function ResaSida({ params }) {
  const { slug } = await params
  const r = await getResort(slug)
  if (!r || r.latitude == null || r.longitude == null) notFound()

  const ort = {
    slug: r.slug,
    namn: r.name,
    lat: Number(r.latitude),
    lng: Number(r.longitude),
    portkod: r.nearest_airport_code || null,
  }
  const boende = bookingSok(r)
  const kurser = await hamtaKurser()

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>
      <SiteHeader />
      <main style={{ maxWidth: 1240, margin: '0 auto', padding: '104px clamp(16px, 4vw, 32px) 90px' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,236,228,0.5)', margin: '0 0 10px' }}>
          <Link href={`/resort/${r.slug}`} style={{ color: '#D4A574', textDecoration: 'none' }}>{r.name}</Link> · Resan dit
        </p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: 'clamp(38px, 6vw, 64px)', letterSpacing: '0.03em', lineHeight: 1, margin: '0 0 12px' }}>
          Resan till {r.name}
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 2vw, 17px)', lineHeight: 1.65, color: 'rgba(240,236,228,0.68)', maxWidth: 640, margin: '0 0 26px' }}>
          Skriv var du bor, så visas resan dörr till dörr med bil, tåg och flyg, sida vid sida och ritad på kartan.
        </p>

        <Reseplanerare ort={ort} kurser={kurser} />

        {boende && (
          <section style={{ marginTop: 34, background: '#1c1a17', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 'clamp(18px, 3vw, 26px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: 26, letterSpacing: '0.03em', margin: '0 0 4px' }}>Boende i {r.name}</h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(240,236,228,0.6)', margin: 0 }}>
                Har du redan bokat? Lägg till adressen ovanför, så går resan ända fram.
              </p>
            </div>
            <div>
              <Partnerlank sid={`resa-boende-${r.slug}`} sok={{ destination: boende }} style={{ display: 'inline-block', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: '#121110', background: '#D4A574', borderRadius: 8, padding: '12px 18px', textDecoration: 'none' }}>
                Sök boende på Booking ›
              </Partnerlank>
            </div>
          </section>
        )}

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, lineHeight: 1.7, color: 'rgba(240,236,228,0.4)', margin: '28px 0 0', maxWidth: 760 }}>
          Vägar, tåg och bussar: Google Maps. Flyg: Ignav (live) och Aviasales via Travelpayouts.
          {' '}<Link href={`/resort/${r.slug}`} style={{ color: 'rgba(240,236,228,0.6)' }}>Mer om {r.name}</Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
