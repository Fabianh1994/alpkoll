import Link from 'next/link'
import SiteHeader from '../SiteHeader'
import SiteFooter from '../SiteFooter'
import { getResorts } from '../../lib/resorts'
import { SITE_URL } from '../../lib/lang'
import { arNordisk, parSlugsFor } from '../../lib/jamfor'

export const revalidate = 3600

const titel = 'Jämför skidorter — Alperna och Norden | Alpkoll'
const beskrivning =
  'Två skidorter sida vid sida: pist, liftar, höjder, liftkort och resan från Sverige. Samma källa för båda orterna, så talen går att ställa mot varandra.'

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

export default async function JamforIndex() {
  const orter = await getResorts()
  const namn = new Map(orter.map((ort) => [ort.slug, ort.name]))
  const nordisk = new Map(orter.map((ort) => [ort.slug, arNordisk(ort)]))

  // Adressen har slugarna i bokstavsordning, men etiketten behöver det
  // inte. Utan omkastningen står "Alpe d'Huez eller Åre" bredvid "Åre
  // eller Chamonix" i samma lista, och kolumnen ser ut att sakna ordning.
  // Den svenska orten först är också den läsningen listan handlar om:
  // hemifrån och bort.
  const par = parSlugsFor(orter.map((ort) => ort.slug)).map((slug) => {
    const [forsta, andra] = slug.split('-vs-')
    const kors = nordisk.get(forsta) !== nordisk.get(andra)
    const vandOm = kors && !nordisk.get(forsta)

    return {
      slug,
      kors,
      a: vandOm ? andra : forsta,
      b: vandOm ? forsta : andra,
    }
  })

  const efterNamn = (x, y) =>
    `${namn.get(x.a)} ${namn.get(x.b)}`.localeCompare(`${namn.get(y.a)} ${namn.get(y.b)}`, 'sv')

  const grupper = [
    {
      rubrik: 'Norden mot Alperna',
      // Det här är valet svensken faktiskt står inför: stanna hemma
      // eller flyga. Därför står de överst.
      ingress:
        'Åre och Sälen mot de alporter svenska arrangörer säljer mest av. Här ligger den största skillnaden i resan, inte i pistkilometrarna.',
      par: par.filter((p) => p.kors).sort(efterNamn),
    },
    {
      rubrik: 'Norden mot Norden',
      ingress:
        'Alla par bland de elva nordiska orterna — de jämförelser ingen internationell skidsajt gör.',
      par: par.filter((p) => !p.kors).sort(efterNamn),
    },
  ]

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>

      <style>{`
        .jamfor-lista {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 8px;
        }
      `}</style>

      <SiteHeader />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '110px clamp(20px, 4vw, 40px) 120px' }}>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, color: '#D4A574', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>Jämförelser</p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(34px, 7vw, 64px)', fontWeight: 400, lineHeight: 1, color: '#f0ece4', letterSpacing: '0.02em', margin: 0 }}>
          Två orter sida vid sida
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginTop: 18, maxWidth: 620 }}>
          {par.length} jämförelser, alla byggda på samma källa. Alporter ställs
          medvetet inte mot varandra — Chamonix mot Val d&apos;Isère är en sida
          varje internationell skidsajt redan skrivit. Det som saknas är den
          svenska frågan: hemma eller borta, och vilken nordisk ort som passar.
        </p>

        {grupper.map((grupp) => (
          <section key={grupp.rubrik} style={{ marginTop: 56 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: '#f0ece4', letterSpacing: '0.04em', marginBottom: 8 }}>{grupp.rubrik}</h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, margin: '0 0 18px', maxWidth: 620 }}>{grupp.ingress}</p>

            <div className="jamfor-lista">
              {grupp.par.map((p) => (
                <Link key={p.slug} href={`/jamfor/${p.slug}`} style={{
                  background: '#1c1a17',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 8,
                  padding: '13px 16px',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#f0ece4',
                  display: 'block',
                }}>
                  {namn.get(p.a)} <span style={{ color: 'rgba(255,255,255,0.3)' }}>eller</span> {namn.get(p.b)}
                </Link>
              ))}
            </div>
          </section>
        ))}

      </div>

      <SiteFooter />
    </div>
  )
}
