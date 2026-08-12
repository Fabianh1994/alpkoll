import Link from 'next/link'
import SiteHeader from '../SiteHeader'
import SiteFooter from '../SiteFooter'
import Valjaren from './Valjaren'
import { getResorts } from '../../lib/resorts'
import { SITE_URL } from '../../lib/lang'
import { land } from '../../lib/countries'
import { pris, VALUTA_VECKOKOSTNAD } from '../../lib/pris'
import { hamtaKurser } from '../../lib/valuta'
import { farOptimeras } from '../../lib/images'
import { arNordisk, parSlugsFor } from '../../lib/jamfor'

export const revalidate = 3600

const titel = 'Jämför skidorter — Alperna och Norden | Alpkoll'
const beskrivning =
  'Välj två skidorter och ställ dem mot varandra: storlek, vad veckan kostar, fallhöjd och resan från Sverige. Samma källa för båda orterna.'

export const metadata = {
  title: titel,
  description: beskrivning,
  alternates: { canonical: `${SITE_URL}/jamfor` },
  openGraph: {
    title: titel,
    description: beskrivning,
    url: `${SITE_URL}/jamfor`,
    siteName: 'Alpkoll',
    type: 'website',
    locale: 'sv_SE',
    images: ['/og-image.png'],
  },
}

// En handfull utvalda par under väljaren, inte alla 83. Listan finns för
// att ge sidan en ingång åt den som inte vet vad hon letar efter, och för
// att ge de kuraterade sidorna interna länkar. Resten når Google via
// sitemapen.
const UTVALDA = [
  'are-vs-salen',
  'are-vs-solden',
  'salen-vs-trysil',
  'are-vs-trysil',
  'ischgl-vs-salen',
  'hemsedal-vs-trysil',
  'are-vs-chamonix',
  'riksgransen-vs-salen',
]

export default async function JamforIndex() {
  const [orter, kurser] = await Promise.all([getResorts(), hamtaKurser()])

  const forValjaren = orter.map((ort) => ({
    slug: ort.slug,
    name: ort.name,
    land: land(ort.country),
    // Följer med för sökningen, inte för kortet: "jämtland" och "tyrolen"
    // är rimliga saker att skriva när man inte minns ortens namn.
    region: ort.region,
    nordisk: arNordisk(ort),
    bild: ort.image_url || 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
    optimeras: farOptimeras(ort.image_url),
    pist: ort.total_pistes_km,
    // Kortet visar bara kronbeloppet. Originalvalutan hör hemma där man
    // fattar beslutet, inte i ett rutnät man ögnar igenom.
    vecka: pris(ort.est_weekly_cost_eur, VALUTA_VECKOKOSTNAD, kurser)?.kr || null,
  }))

  const namn = new Map(orter.map((ort) => [ort.slug, ort.name]))
  const kuraterade = new Set(parSlugsFor(orter.map((o) => o.slug)))
  const utvalda = UTVALDA.filter((par) => kuraterade.has(par))

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>
      <SiteHeader />

      <div style={{ maxWidth: 980, margin: '0 auto', padding: '104px clamp(20px, 4vw, 40px) 110px' }}>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, color: '#D4A574', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>Jämför</p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 400, lineHeight: 1, color: '#f0ece4', letterSpacing: '0.02em', margin: 0 }}>
          Välj två orter
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: '16px 0 30px', maxWidth: 560 }}>
          Storlek, vad veckan kostar, fallhöjd och resan från Sverige — sida vid
          sida, ur samma källa för båda orterna. Det sista går inte att läsa sig
          till på ortens egen webbplats.
        </p>

        <Valjaren orter={forValjaren} />

        {utvalda.length > 0 && (
          <section style={{ marginTop: 56 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: '#f0ece4', letterSpacing: '0.04em', marginBottom: 14 }}>Vanliga jämförelser</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {utvalda.map((par) => {
                const [x, y] = par.split('-vs-')
                return (
                  <Link key={par} href={`/jamfor/${par}`} style={{
                    fontFamily: 'var(--font-body)', fontSize: 12.5, fontWeight: 500,
                    color: 'rgba(255,255,255,0.55)', textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 40,
                    padding: '9px 16px',
                  }}>{namn.get(x)} <span style={{ color: 'rgba(255,255,255,0.25)' }}>eller</span> {namn.get(y)}</Link>
                )
              })}
            </div>
          </section>
        )}

      </div>

      <SiteFooter />
    </div>
  )
}
