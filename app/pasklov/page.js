import Link from 'next/link'
import SiteHeader from '../SiteHeader'
import SiteFooter from '../SiteFooter'
import { getResorts } from '../../lib/resorts'
import { skrivDatum } from '../../lib/valuta'
import { SITE_URL } from '../../lib/lang'
import { AR, HAMTAD, PASKDAGEN, PASKLOV, VECKOR, kommunerVecka, ledigtIRad, pasklovetSlut } from '../../lib/pasklov'
import { ACCENT, brod, dag, etikett, kort, rubrik, spann } from '../sportlov/Veckan'
import Snon from './Snon'
import Kommunvaljare from './Kommunvaljare'

// Påsklov 2027: vilken vecka varje kommun har lov, och vilka orter som
// håller snön i slutet av mars. Kommunuppgifterna och skälet till sidan
// står i lib/pasklov.js. Varje kommun har en egen sida, /pasklov/<kommun>,
// eftersom det är så folk söker: "påsklov 2027 stockholm" hade 1 600
// sökningar i månaden 22 november 2026, mer än "påsklov 2027" utan kommun.

// Samma intervall som ortsidorna. En ändrad snösäkerhet i Supabase slår
// igenom inom en timme, och sidan märker att påsklovet passerat utan deploy.
export const revalidate = 3600

// Texten byggs ur raderna i lib/pasklov.js, så att den följer med när
// raderna byts nästa år. Den vecka flest kommuner har är "de flestas".
const listaOrd = (ord) => (ord.length < 2 ? ord.join('') : `${ord.slice(0, -1).join(', ')} och ${ord[ord.length - 1]}`)
const perVecka = VECKOR.map((v) => ({ ...v, kommuner: kommunerVecka(v.nr) }))
const storst = [...perVecka].sort((a, b) => b.kommuner.length - a.kommuner.length)[0]
const ovriga = perVecka.filter((v) => v.nr !== storst.nr && v.kommuner.length)
const veckonummer = listaOrd(VECKOR.map((v) => String(v.nr)))
const undantag = ovriga
  .map((v) => `${listaOrd(v.kommuner.map((k) => k.kommun))} har vecka ${v.nr}, ${v.namn}`)
  .join('. ')
const stockholm = PASKLOV.find((r) => r.kommun === 'Stockholm')
const goteborg = PASKLOV.find((r) => r.kommun === 'Göteborg')
const veckorText = veckonummer.replace(' och ', ' eller ')

const titel = `Påsklov ${AR}: vecka ${veckorText} i din kommun | Alpkoll`
const beskrivning =
  `Påsklovet ${AR} ligger vecka ${storst.nr} i de flesta kommuner. ` +
  (undantag ? `${undantag}. ` : '') +
  'Välj din kommun och se var snön är säkrast i påsk.'

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

/**
 * Den ledighet flest kommuner i veckan får med helger och röda dagar, och
 * hur många som har den. Kommunerna skriver lovet olika (Göteborg 26 mars,
 * Stockholm 30 mars) men de flesta är lediga samma dagar.
 */
function vanligastLedigt(rader) {
  const antal = {}
  for (const r of rader) {
    const l = ledigtIRad(r)
    if (l) antal[`${l.start}|${l.slut}`] = (antal[`${l.start}|${l.slut}`] || 0) + 1
  }
  const [nyckel, n] = Object.entries(antal).sort((a, b) => b[1] - a[1])[0] || []
  if (!nyckel) return null
  const [start, slut] = nyckel.split('|')
  return { start, slut, n }
}

function Kommunlista({ v }) {
  const rader = kommunerVecka(v.nr)
  const ledigt = vanligastLedigt(rader)
  return (
    <section style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)', marginBottom: 14 }}>
      <div style={etikett}>Vecka {v.nr}, {v.namn}</div>
      <h2 style={{ ...rubrik('clamp(26px, 4vw, 34px)'), margin: '8px 0 6px' }}>
        {spann(v.start, v.slut)} {AR}
      </h2>
      {ledigt && (
        <p style={{ ...liten, margin: '0 0 14px' }}>
          Med helger och röda dagar är barnen lediga {spann(ledigt.start, ledigt.slut)} i{' '}
          {ledigt.n === rader.length ? 'alla' : `${ledigt.n} av ${rader.length}`} kommuner här.
          Datumen bredvid kommunen är lovet som kommunen skriver det.
        </p>
      )}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {rader.map((r) => (
          <li key={r.kommun} style={{
            display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
            padding: '9px 0', borderTop: '1px solid rgba(255,255,255,0.06)',
            fontFamily: 'var(--font-body)', fontSize: 15,
          }}>
            <Link href={`/pasklov/${r.slug}`} style={{ color: '#f0ece4', textDecoration: 'none' }}>
              {r.kommun} <span style={{ color: ACCENT }}>›</span>
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.62)' }}>{datum(r)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default async function PasklovSida() {
  const passerat = pasklovetSlut()
  const orter = await getResorts()
  const valbara = [...PASKLOV].sort((a, b) => a.kommun.localeCompare(b.kommun, 'sv'))

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>
      <SiteHeader />

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '108px clamp(20px, 5vw, 32px) 100px' }}>
        <h1 style={{ ...rubrik('clamp(38px, 6vw, 60px)'), lineHeight: 1.02, marginBottom: 20 }}>
          Påsklov {AR}: vecka {veckorText}
        </h1>

        <p style={{ ...brod, margin: '0 0 14px' }}>
          Påskdagen {AR} är den {dag(PASKDAGEN)}. De flesta kommuner har påsklov vecka{' '}
          {storst.nr}, {storst.namn}.{undantag ? ` ${undantag}.` : ''}
        </p>
        {!passerat && stockholm?.start && goteborg?.start && (
          <p style={{ ...brod, fontSize: 14.5, margin: '0 0 26px' }}>
            Långfredagen och annandag påsk är röda dagar, och kommunerna räknar dem olika.
            Stockholm skriver att lovet börjar {dag(stockholm.start)}, Göteborg{' '}
            {dag(goteborg.start)}.
          </p>
        )}

        {passerat ? (
          <div style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)', marginBottom: 30 }}>
            <p style={{ ...brod, fontSize: 15, margin: 0 }}>
              Påsklovet {AR} har passerat. Nästa års veckor beslutas av kommunerna.
            </p>
          </div>
        ) : (
          <>
            <Kommunvaljare kommuner={valbara.map((r) => ({ kommun: r.kommun, slug: r.slug }))} />
            {VECKOR.map((v) => <Kommunlista key={v.nr} v={v} />)}
          </>
        )}

        <p style={{ ...liten, margin: '6px 0 44px' }}>
          Uppgifterna är lästa på {PASKLOV.length} kommuners egna sidor den {skrivDatum(HAMTAD)},
          och varje kommunsida länkar dit. Lovet bestäms av varje kommun och kan ändras, så
          kolla din egen kommun innan du bokar. Står din kommun inte här finns lovet på
          kommunens sida under läsårstider.
        </p>

        <Snon orter={orter} ar={AR} />

        <p style={{ ...liten, margin: '14px 0 0' }}>
          Sportlovet ligger i vecka 7 till 10, se{' '}
          <Link href="/sportlov" style={{ color: ACCENT }}>Sportlov {AR}</Link>.
        </p>
      </main>

      <SiteFooter />
    </div>
  )
}
