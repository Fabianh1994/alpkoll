import Link from 'next/link'
import SiteHeader from '../SiteHeader'
import SiteFooter from '../SiteFooter'
import { getResorts } from '../../lib/resorts'
import { skrivDatum } from '../../lib/valuta'
import { SITE_URL } from '../../lib/lang'
import { land } from '../../lib/countries'
import { manad } from '../../lib/months'
import { arNordisk } from '../../lib/jamfor'
import { AR, HAMTAD, PASKLOV, VECKOR, kommunerVecka, pasklovetSlut } from '../../lib/pasklov'
import { ACCENT, brod, etikett, kort, rubrik, spann } from '../sportlov/Veckan'

// Påsklov 2027: vilken vecka varje kommun har lov, och vilka orter som
// håller snön i slutet av mars. Kommunuppgifterna och skälet till sidan
// står i lib/pasklov.js.

// Samma intervall som ortsidorna. En ändrad snösäkerhet i Supabase slår
// igenom inom en timme, och sidan märker att påsklovet passerat utan deploy.
export const revalidate = 3600

// Alporterna listan tar med: högsta betyget för snösäkerhet. Alla
// publicerade orter har säsong in i april enligt databasen, så säsongen
// skiljer dem inte åt. Snösäkerheten gör det.
const ALP_GRANS = 9

const titel = `Påsklov ${AR}: vecka 12 eller 13 i din kommun | Alpkoll`
const beskrivning =
  `Påsklovet ${AR} ligger vecka 13 i de flesta kommuner. Malmö, Lund, Helsingborg ` +
  `och Skövde har vecka 12, före påsk. Se din kommun och vilka skidorter som har ` +
  'säkrast snö i slutet av mars.'

export const metadata = {
  title: titel,
  description: beskrivning,
  alternates: { canonical: `${SITE_URL}/pasklov` },
  openGraph: {
    title: titel,
    description: beskrivning,
    url: `${SITE_URL}/pasklov`,
    siteName: 'Alpkoll',
    type: 'article',
    locale: 'sv_SE',
    images: ['/og-image.png'],
  },
  twitter: { card: 'summary_large_image', title: titel, description: beskrivning, images: ['/og-image.png'] },
}

const liten = { ...brod, fontSize: 13.5, color: 'rgba(255,255,255,0.57)' }

/** "30 mars–2 april" ur kommunens rad, eller bara veckan. */
function datum(r) {
  return r.start ? spann(r.start, r.slut) : `vecka ${r.vecka}`
}

function Kommunlista({ v }) {
  const rader = kommunerVecka(v.nr)
  return (
    <section style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)', marginBottom: 14 }}>
      <div style={etikett}>Vecka {v.nr}, {v.namn}</div>
      <h2 style={{ ...rubrik('clamp(26px, 4vw, 34px)'), margin: '8px 0 16px' }}>
        {spann(v.start, v.slut)} {AR}
      </h2>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {rader.map((r) => (
          <li key={r.kommun} style={{
            display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
            padding: '9px 0', borderTop: '1px solid rgba(255,255,255,0.06)',
            fontFamily: 'var(--font-body)', fontSize: 15,
          }}>
            <a href={r.kalla} target="_blank" rel="noopener noreferrer" style={{ color: '#f0ece4', textDecoration: 'none' }}>
              {r.kommun} <span style={{ color: ACCENT }}>›</span>
            </a>
            <span style={{ color: 'rgba(255,255,255,0.62)' }}>{datum(r)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Ortlista({ orter }) {
  return (
    <ul style={{ listStyle: 'none', margin: '0 0 30px', padding: 0 }}>
      {orter.map((o) => (
        <li key={o.slug} style={{
          display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
          padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.06)',
          fontFamily: 'var(--font-body)', fontSize: 15,
        }}>
          <span>
            <Link href={`/resort/${o.slug}`} style={{ color: '#f0ece4', textDecoration: 'none' }}>
              {o.name} <span style={{ color: ACCENT }}>›</span>
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.52)', fontSize: 13.5 }}> {land(o.country)}</span>
          </span>
          <span style={{ color: 'rgba(255,255,255,0.62)', fontSize: 14 }}>
            Snösäkerhet {o.snow_guarantee_score}/10 · toppen {o.altitude_top.toLocaleString('sv-SE')} m
            {o.season_end_month ? ` · öppet till ${manad(o.season_end_month)}` : ''}
          </span>
        </li>
      ))}
    </ul>
  )
}

const ordning = (a, b) =>
  (b.snow_guarantee_score || 0) - (a.snow_guarantee_score || 0) || (b.altitude_top || 0) - (a.altitude_top || 0)

export default async function PasklovSida() {
  const passerat = pasklovetSlut()
  const orter = await getResorts()
  // Påsklovet slutar i april, så en ort som stänger i mars kommer inte med.
  const oppna = orter.filter((o) => (o.season_end_month || 0) >= 4)
  const allaOppna = oppna.length === orter.length
  const norden = oppna.filter((o) => arNordisk(o) && o.snow_guarantee_score).sort(ordning)
  const alperna = oppna
    .filter((o) => !arNordisk(o) && o.country !== 'Andorra' && o.snow_guarantee_score >= ALP_GRANS)
    .sort(ordning)

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>
      <SiteHeader />

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '108px clamp(20px, 5vw, 32px) 100px' }}>
        <h1 style={{ ...rubrik('clamp(38px, 6vw, 60px)'), lineHeight: 1.02, marginBottom: 20 }}>
          Påsklov {AR}
        </h1>

        <p style={{ ...brod, margin: '0 0 14px' }}>
          Påskdagen {AR} är den 28 mars. De flesta kommuner har påsklov vecka 13, veckan
          efter påsk. Malmö, Lund, Helsingborg och Skövde har vecka 12, veckan före.
        </p>
        <p style={{ ...brod, fontSize: 14.5, margin: '0 0 30px' }}>
          Långfredag 26 mars och annandag påsk 29 mars är röda dagar. Därför skriver
          kommunerna olika första dag för samma lov: Stockholm skriver 30 mars, Göteborg
          26 mars. Klicka på kommunen för att läsa på kommunens egen sida.
        </p>

        {passerat ? (
          <div style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)', marginBottom: 30 }}>
            <p style={{ ...brod, fontSize: 15, margin: 0 }}>
              Påsklovet {AR} är passerat. Nästa års veckor beslutas av kommunerna, och sidan
              uppdateras när de är publicerade.
            </p>
          </div>
        ) : (
          VECKOR.map((v) => <Kommunlista key={v.nr} v={v} />)
        )}

        <p style={{ ...liten, margin: '6px 0 44px' }}>
          Uppgifterna är lästa på {PASKLOV.length} kommuners egna sidor den {skrivDatum(HAMTAD)}.
          Lovet bestäms av varje kommun och kan ändras, så kolla din egen kommun innan du
          bokar. Står din kommun inte här finns lovet på kommunens sida under läsårstider.
        </p>

        <h2 style={rubrik('clamp(28px, 4.5vw, 40px)')}>Var finns snön i påsk?</h2>
        <p style={{ ...brod, margin: '0 0 22px' }}>
          Påsken {AR} ligger tidigt.{' '}
          {allaOppna
            ? 'I slutet av mars har alla orter på Alpkoll fortfarande öppet, så det som skiljer dem åt är hur säker snön är.'
            : 'Listorna tar med orterna som har öppet in i april, ordnade efter hur säker snön är.'} Nedfarterna till byn är det som
          smälter först, och på lägre orter kan backen vara hård på morgonen och blöt på
          eftermiddagen.
        </p>

        <h3 style={{ ...etikett, fontSize: 11, margin: '0 0 10px' }}>Sverige, Norge och Finland</h3>
        <Ortlista orter={norden} />

        <h3 style={{ ...etikett, fontSize: 11, margin: '0 0 10px' }}>
          Alperna, orterna med snösäkerhet {ALP_GRANS} eller 10
        </h3>
        <Ortlista orter={alperna} />

        <p style={{ ...liten, margin: '0 0 8px' }}>
          Snösäkerheten är Alpkolls betyg från 1 till 10, och samma tal står på ortsidan.
          Öppet till anger månaden orten planerar att stänga. Ett år med lite snö kan
          nedre delen stänga tidigare.
        </p>
        <p style={{ ...liten, margin: 0 }}>
          Sportlovet ligger i vecka 7 till 10, se{' '}
          <Link href="/sportlov" style={{ color: ACCENT }}>Sportlov {AR}</Link>.
        </p>
      </main>

      <SiteFooter />
    </div>
  )
}
