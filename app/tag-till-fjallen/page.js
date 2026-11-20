import Link from 'next/link'
import SiteHeader from '../SiteHeader'
import SiteFooter from '../SiteFooter'
import { getResorts } from '../../lib/resorts'
import { SITE_URL } from '../../lib/lang'
import { land } from '../../lib/countries'
import { FJALLTAG, SASONG, HAMTAD } from '../../lib/fjalltag'

// Tåg till fjällen: vilka skidorter på Alpkoll du når med tåg i vinter.
//
// "tåg till fjällen" och "tåg till Åre/Sälen" ställs till ChatGPT och
// Google, och svaren hämtas i dag från STF, SkiStar, Snälltåget och en
// DN-guide från 2019. Ingen av dem ställer orterna bredvid varandra med
// samma fråga: går tåget hela vägen, krävs buss, eller går det inte alls?
// Sidan svarar på det ort för ort ur lib/fjalltag.js, med operatörens
// tider och en länk till källan.

export const revalidate = 3600

const ADRESS = `${SITE_URL}/tag-till-fjallen`
const titel = `Tåg till fjällen ${SASONG}: skidorterna du når med tåg | Alpkoll`
const beskrivning =
  `Tåg till fjällen vintern ${SASONG}: Åre och Riksgränsen med nattåg hela vägen, ` +
  'Sälen och Vemdalen med tåg och buss, och orterna dit tåget inte går. Tider från Snälltåget och SJ.'

export const metadata = {
  title: titel,
  description: beskrivning,
  alternates: { canonical: ADRESS },
  openGraph: {
    title: titel,
    description: beskrivning,
    url: ADRESS,
    siteName: 'Alpkoll',
    type: 'article',
    locale: 'sv_SE',
    modifiedTime: HAMTAD,
    images: ['/og-image.png'],
  },
  twitter: { card: 'summary_large_image', title: titel, description: beskrivning, images: ['/og-image.png'] },
}

const ACCENT = '#D4A574'
const kort = { background: '#1c1a17', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }
const etikett = {
  fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500,
  color: 'rgba(255,255,255,0.52)', letterSpacing: '0.12em', textTransform: 'uppercase',
}
const brod = {
  fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.75,
  color: 'rgba(255,255,255,0.62)', maxWidth: 660,
}
const rubrik = (storlek) => ({
  fontFamily: 'var(--font-heading)', fontSize: storlek, fontWeight: 400,
  letterSpacing: '0.03em', margin: '0 0 18px', color: '#f0ece4',
})

const TYPER = [
  { typ: 'hela-vagen', rubrik: 'Tåget går hela vägen' },
  { typ: 'buss', rubrik: 'Tåg och buss sista biten' },
  { typ: 'inget', rubrik: 'Inget tåg i närheten' },
]

const datum = (iso) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

/** "a, b och c" */
const lista = (namn) => namn.reduce((acc, n, i, arr) =>
  i === 0 ? n : i === arr.length - 1 ? `${acc} och ${n}` : `${acc}, ${n}`, '')

export default async function TagTillFjallen() {
  const orter = await getResorts()
  const ort = new Map(orter.map((o) => [o.slug, o]))
  const rader = FJALLTAG.filter((f) => ort.has(f.slug)).map((f) => ({ ...f, ort: ort.get(f.slug) }))

  const helaVagen = rader.filter((r) => r.typ === 'hela-vagen' && r.ort.country === 'Sweden').map((r) => r.ort.name)
  // Korta svaret och första frågan gäller Sverige. Norska orter med tåg
  // står i korten nedanför, men inte i en mening om svenska fjällen.
  const medBuss = rader.filter((r) => r.typ === 'buss' && r.ort.country === 'Sweden').map((r) => r.ort.name)
  const utan = rader.filter((r) => r.typ === 'inget' && r.ort.country === 'Sweden').map((r) => r.ort.name)

  const fragor = [
    {
      fraga: 'Vilka skidorter i Sverige kan man ta tåget till?',
      svar: `Tåget går hela vägen till ${lista(helaVagen)}.` +
        (medBuss.length ? ` Till ${lista(medBuss)} tar du tåget och sedan buss sista biten.` : '') +
        (utan.length ? ` Till ${lista(utan)} går inget tåg.` : ''),
    },
    {
      fraga: 'Går det tåg till Sälen?',
      svar: 'Ja, från vintern 2026/27. Snälltåget kör lördagar från Malmö via Stockholm till Mora, och en transferbuss tar dig vidare till Lindvallen, Högfjället, Tandådalen, Hundfjället och Stöten.',
    },
    {
      fraga: 'Går det nattåg till Åre?',
      svar: 'Ja. Snälltåget kör nattåg från Malmö via Stockholm till Åre, Duved och Storlien, och SJ kör nattåg från Stockholm. Tåget stannar mitt i Åre by.',
    },
    {
      fraga: 'Går det tåg till Alperna?',
      svar: 'Ja. Snälltåget kör nattåg från Malmö till Österrike på fredagar under vintern, med stopp i bland annat Kitzbühel och Innsbruck.',
    },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: `Tåg till fjällen ${SASONG}`,
        description: beskrivning,
        dateModified: HAMTAD,
        inLanguage: 'sv-SE',
        mainEntityOfPage: ADRESS,
        image: `${SITE_URL}/og-image.png`,
        author: { '@type': 'Organization', name: 'Alpkoll', url: SITE_URL },
        publisher: { '@type': 'Organization', name: 'Alpkoll', url: SITE_URL },
      },
      {
        '@type': 'FAQPage',
        mainEntity: fragor.map((f) => ({
          '@type': 'Question', name: f.fraga, acceptedAnswer: { '@type': 'Answer', text: f.svar },
        })),
      },
    ],
  }

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '108px clamp(20px, 5vw, 32px) 100px' }}>
        <h1 style={{ ...rubrik('clamp(34px, 5.5vw, 54px)'), lineHeight: 1.04, marginBottom: 12 }}>
          Tåg till fjällen {SASONG}
        </h1>
        <p style={{ ...etikett, margin: '0 0 24px' }}>
          Tiderna hämtade <time dateTime={HAMTAD}>{datum(HAMTAD)}</time> från Snälltåget och SJ · Alpkoll
        </p>

        <section style={{ ...kort, borderLeft: `3px solid ${ACCENT}`, padding: 'clamp(18px, 4vw, 24px)', marginBottom: 30 }}>
          <h2 style={{ ...etikett, color: ACCENT, margin: '0 0 10px' }}>Kort svar</h2>
          <p style={{ ...brod, color: 'rgba(255,255,255,0.82)', margin: 0 }}>
            Till <strong style={{ color: '#f0ece4' }}>{lista(helaVagen)}</strong> går nattåget hela vägen.
            Till <strong style={{ color: '#f0ece4' }}>{lista(medBuss)}</strong> tar du tåget och sedan buss sista biten,
            och Sälen har fått ett eget tåg till Mora från den här vintern.
            {utan.length > 0 && <> Till {lista(utan)} går inget tåg.</>}
          </p>
        </section>

        {TYPER.map(({ typ, rubrik: r }) => {
          const grupp = rader.filter((x) => x.typ === typ)
          if (grupp.length === 0) return null
          return (
            <section key={typ} style={{ marginBottom: 36 }}>
              <h2 style={rubrik('clamp(26px, 4vw, 34px)')}>{r}</h2>
              {grupp.map((x) => (
                <article key={x.slug} style={{ ...kort, padding: 'clamp(18px, 4vw, 26px)', marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                    <h3 style={{ ...rubrik(26), margin: 0 }}>
                      <Link href={`/resort/${x.slug}`} style={{ color: '#f0ece4', textDecoration: 'none' }}>Tåg till {x.ort.name}</Link>
                    </h3>
                    <span style={etikett}>{land(x.ort.country)}{x.station ? ` · station ${x.station}` : ''}</span>
                  </div>
                  <p style={{ ...brod, fontSize: 15, margin: '12px 0 0', color: 'rgba(255,255,255,0.78)' }}>{x.sammanfattning}</p>
                  {x.linjer.map((l) => (
                    <div key={l.bolag} style={{ marginTop: 14 }}>
                      <p style={{ ...brod, fontSize: 14.5, margin: '0 0 8px' }}>
                        <strong style={{ color: '#f0ece4', fontWeight: 600 }}>{l.bolag}: </strong>{l.text}
                        {l.hem && <> {l.hem}</>}
                      </p>
                      {l.tider && (
                        <table style={{ borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 14 }}>
                          <tbody>
                            {l.tider.map((t) => (
                              <tr key={t.plats}>
                                <td style={{ padding: '3px 18px 3px 0', color: 'rgba(255,255,255,0.65)' }}>{t.plats}</td>
                                <td style={{ padding: '3px 0', color: ACCENT, fontVariantNumeric: 'tabular-nums' }}>{t.tid}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                      <p style={{ ...brod, fontSize: 12.5, margin: '6px 0 0', color: 'rgba(255,255,255,0.48)' }}>
                        Källa: <a href={l.kalla} rel="noopener" target="_blank" style={{ color: 'rgba(255,255,255,0.6)' }}>{new URL(l.kalla).hostname.replace('www.', '')}</a>
                      </p>
                    </div>
                  ))}
                </article>
              ))}
            </section>
          )
        })}

        <section style={{ ...kort, padding: 'clamp(18px, 4vw, 26px)', marginBottom: 36 }}>
          <h2 style={{ ...rubrik(24), marginBottom: 10 }}>Tåg till Alperna</h2>
          <p style={{ ...brod, fontSize: 15, margin: 0 }}>
            Snälltåget kör också nattåg från Malmö till Österrike på fredagar under vintern.
            Tider, stationer och vilka skidorter du når står på{' '}
            <Link href="/nattaget-till-alperna" style={{ color: ACCENT }}>tåg till Alperna</Link>.
          </p>
        </section>

        <section style={{ marginBottom: 30 }}>
          <h2 style={rubrik('clamp(24px, 3.6vw, 30px)')}>Vanliga frågor</h2>
          {fragor.map((f) => (
            <div key={f.fraga} style={{ marginBottom: 18 }}>
              <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 16.5, fontWeight: 600, color: '#f0ece4', margin: '0 0 6px' }}>{f.fraga}</h3>
              <p style={{ ...brod, fontSize: 15, margin: 0 }}>{f.svar}</p>
            </div>
          ))}
        </section>

        <p style={{ ...brod, fontSize: 14, margin: 0, color: 'rgba(255,255,255,0.5)' }}>
          Tiderna är bolagens egna och kan ändras av banarbeten. Kontrollera alltid tiden när du bokar.
          Vidare: <Link href="/skidorter/sverige" style={{ color: ACCENT }}>skidorter i Sverige</Link> och{' '}
          <Link href="/skidorter-for-barnfamiljer" style={{ color: ACCENT }}>skidorter för barnfamiljer</Link>.
        </p>
      </main>

      <SiteFooter />
    </div>
  )
}
