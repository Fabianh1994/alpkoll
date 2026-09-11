import Link from 'next/link'
import SiteHeader from '../SiteHeader'
import SiteFooter from '../SiteFooter'
import { getResorts } from '../../lib/resorts'
import { getAllaOrtbilder } from '../../lib/ortbilder'
import { SITE_URL } from '../../lib/lang'

// Bildkällor för hela sajten.
//
// Omkring fyrtio av bilderna står under Creative Commons-licenser som
// kräver att fotografen namnges — sidan räknar fram det exakta antalet. Ortsidans galleri gör det i bildtexten, men
// hjältebilden syns också på startsidans kort och på jämförelsesidorna,
// där en bildtext inte får plats. CC-licenserna godtar kreditering på det
// sätt mediet medger — en sida som samlar dem, länkad från varje sida, är
// just det.
//
// Sidan är inte till för sökningar och står därför som noindex.

export const revalidate = 3600

export const metadata = {
  title: 'Bildkällor | Alpkoll',
  description: 'Fotograf, licens och källa för varje bild på Alpkoll.',
  alternates: { canonical: `${SITE_URL}/bildkallor` },
  robots: { index: false, follow: true },
}

const etikett = {
  fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
  color: 'rgba(255,255,255,0.52)', letterSpacing: '0.12em', textTransform: 'uppercase',
}

export default async function Bildkallor() {
  const [orter, bilder] = await Promise.all([getResorts(), getAllaOrtbilder()])
  const namn = Object.fromEntries(orter.map((o) => [o.slug, o.name]))
  const perOrt = orter
    .map((o) => ({ ort: o, bilder: bilder.filter((b) => b.resort_slug === o.slug) }))
    .filter((x) => x.bilder.length > 0)

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>
      <SiteHeader />

      <main style={{ padding: 'clamp(120px, 18vh, 160px) clamp(24px, 4vw, 64px) 80px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 400, letterSpacing: '0.03em', lineHeight: 1.05, margin: '0 0 18px' }}>
            Bildkällor
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,0.65)', margin: '0 0 44px', maxWidth: 640 }}>
            Alla bilder på Alpkoll kommer från Wikimedia Commons eller Unsplash. Här står vem som
            tog dem, under vilken licens, och var originalet finns.
          </p>

          {perOrt.map(({ ort, bilder: lista }) => (
            <section key={ort.slug} style={{ marginBottom: 36 }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 400, letterSpacing: '0.04em', margin: '0 0 12px' }}>
                <Link href={`/resort/${ort.slug}`} style={{ color: '#f0ece4', textDecoration: 'none' }}>{namn[ort.slug]}</Link>
              </h2>
              <ol style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {lista.map((b) => (
                  <li key={b.id} style={{ display: 'grid', gridTemplateColumns: '64px minmax(0, 1fr)', gap: 14, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={etikett}>{b.position === 0 ? 'Hjälte' : `Bild ${b.position + 1}`}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.72)' }}>
                      {b.alt}.{' '}
                      <span style={{ color: 'rgba(255,255,255,0.55)' }}>
                        Foto: {b.photographer || 'okänd'}
                        {b.source === 'unsplash' ? ' / Unsplash, ' : ', '}
                        {b.license_url
                          ? <a href={b.license_url} target="_blank" rel="noopener noreferrer license" style={{ color: '#D4A574', textDecoration: 'none' }}>{b.license}</a>
                          : b.license}
                        {', '}
                        <a href={b.source_page} target="_blank" rel="noopener noreferrer" style={{ color: '#D4A574', textDecoration: 'none' }}>källa</a>
                        {b.attribution_required ? '. Kreditering krävs.' : '.'}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          ))}

          {perOrt.length === 0 && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
              Bildregistret är inte på plats än.
            </p>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
