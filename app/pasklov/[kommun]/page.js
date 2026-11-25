import { notFound } from 'next/navigation'
import Link from 'next/link'
import SiteHeader from '../../SiteHeader'
import SiteFooter from '../../SiteFooter'
import { getResorts } from '../../../lib/resorts'
import { skrivDatum } from '../../../lib/valuta'
import { SITE_URL } from '../../../lib/lang'
import { AR, HAMTAD, PASKDAGEN, PASKLOV, ledigtIRad, pasklovFranSlug, pasklovetSlut, skidveckaInom, veckan } from '../../../lib/pasklov'
import { kommunFranSlug, veckan as sportlovsveckan } from '../../../lib/sportlov'
import { ACCENT, BOENDE_ORTER, brod, dag, etikett, kort, rubrik, spann } from '../../sportlov/Veckan'
import Snon from '../Snon'
import Partnerlank from '../../Partnerlank'
import Annonsmarkning from '../../Annonsmarkning'
import { BOOKING_BLA, bookingSok } from '../../../lib/booking'

// En sida per kommun, samma upplägg som /sportlov/<kommun>.
//
// Folk söker "påsklov 2027 stockholm" (1 600 sökningar i månaden 22
// november 2026), inte "påsklov 2027". Sidan svarar direkt med kommunens
// vecka och datum, räknar ut hur många dagar i rad familjen är ledig med
// helger och röda dagar, och visar var snön är säkrast. Källan är
// kommunens egen sida, samma som för sportlovet.

export const revalidate = 3600
export const dynamicParams = false

export function generateStaticParams() {
  return PASKLOV.map((r) => ({ kommun: r.slug }))
}

const i = (rad) => (rad.pa ? 'på' : 'i')

// Hur många kommuner med samma lovdagar som namnges. Stockholms datum delas
// av över tjugo kommuner, och en rad med tjugo länkar läser ingen.
const SAMMA_VISAS = 6

/** Andra kommuner med exakt samma lovdagar, i svensk bokstavsordning. */
const sammaDatum = (rad) =>
  PASKLOV
    .filter((r) => r.slug !== rad.slug && r.start && r.start === rad.start && r.slut === rad.slut)
    .sort((a, b) => a.kommun.localeCompare(b.kommun, 'sv'))

/** "30 mars–2 april", eller "vecka 13" där kommunen bara anger veckan. */
const lovet = (rad) => (rad.start ? spann(rad.start, rad.slut) : `vecka ${rad.vecka}`)

export async function generateMetadata({ params }) {
  const rad = pasklovFranSlug((await params).kommun)
  if (!rad) return {}

  // Google-texten, ändrad 25 november 2026. Search Console 22–24 november:
  // kommunsidorna hade 465 visningar på snittplats 6,7 och inga klick.
  // Datumet stod i titeln, och samma datum står i alla träffar runt
  // omkring, kommunens egen sida först. Den som bara ville ha datumet fick
  // det utan att klicka. Det ingen annan träff säger är hur många dagar i
  // rad barnen är lediga, så det står i titeln. Beskrivningen börjar med
  // lovdagarna och säger sedan vilken skidvecka som ryms.
  const ledigt = ledigtIRad(rad)
  const skidvecka = skidveckaInom(ledigt)
  const title = ledigt
    ? `Påsklov ${AR} ${rad.kommun} v. ${rad.vecka}: ${ledigt.dagar} dagar ledigt i rad | Alpkoll`
    : `Påsklov ${AR} ${rad.kommun}: vecka ${rad.vecka} | Alpkoll`
  const description = ledigt
    ? `Lovet är ${lovet(rad)} ${AR}. Barnen är lediga ${spann(ledigt.start, ledigt.slut)}` +
      (skidvecka ? `, så en skidvecka ${spann(skidvecka.start, skidvecka.slut)} ryms. ` : '. ') +
      'Se var snön är säkrast i påsk.'
    : `${rad.kommun} har påsklov vecka ${rad.vecka}. Se var snön är säkrast i påsk.`
  const url = `${SITE_URL}/pasklov/${rad.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title, description, url,
      siteName: 'Alpkoll', type: 'article', locale: 'sv_SE', images: ['/og-image.png'],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/og-image.png'] },
  }
}

export default async function PasklovKommun({ params }) {
  const rad = pasklovFranSlug((await params).kommun)
  if (!rad) notFound()
  const v = veckan(rad.vecka)
  const ledigt = ledigtIRad(rad)
  const skidvecka = skidveckaInom(ledigt)
  const passerat = pasklovetSlut()
  const orter = await getResorts()
  const sportlov = kommunFranSlug(rad.slug)
  const sv = sportlov && sportlovsveckan(sportlov.vecka)
  const liten = { ...brod, fontSize: 14, margin: '0 0 30px', color: 'rgba(255,255,255,0.57)' }
  const samma = sammaDatum(rad)
  const sammaVisas = samma.slice(0, SAMMA_VISAS)
  const sammaResten = samma.length - sammaVisas.length
  // Boendeknapparna försvinner när skidveckans första lördag har passerat,
  // så att ingen erbjuds en incheckning bakåt i tiden.
  const boendeKvar = skidvecka && new Date() < new Date(`${skidvecka.start}T00:00:00+01:00`)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: `Påsklov ${AR}`, item: `${SITE_URL}/pasklov` },
      { '@type': 'ListItem', position: 2, name: rad.kommun, item: `${SITE_URL}/pasklov/${rad.slug}` },
    ],
  }

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '108px clamp(20px, 5vw, 32px) 100px' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, margin: '0 0 14px' }}>
          <Link href="/pasklov" style={{ color: ACCENT, textDecoration: 'none' }}>Påsklov {AR}</Link>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}> / {rad.kommun}</span>
        </p>

        <h1 style={{ ...rubrik('clamp(34px, 5.5vw, 54px)'), lineHeight: 1.04, marginBottom: 20 }}>
          Påsklov {AR} {i(rad)} {rad.kommun}: vecka {rad.vecka}
        </h1>

        <p style={{ ...brod, margin: '0 0 14px' }}>
          {rad.start
            ? <>{rad.kommun} har påsklov vecka {rad.vecka}, {lovet(rad)} {AR}. </>
            : <>{rad.kommun} har påsklov vecka {rad.vecka}. Kommunen anger veckan men inte dagarna. </>}
          {v && <>Vecka {v.nr} är {v.namn}, och påskdagen är den {dag(PASKDAGEN)}.</>}
        </p>
        {ledigt && (
          <p style={{ ...brod, margin: '0 0 14px' }}>
            Med helger och röda dagar är barnen lediga {skrivDag(ledigt.start)} till{' '}
            {skrivDag(ledigt.slut)}, {ledigt.dagar} dagar i rad.
            {skidvecka && <> En skidvecka lördag till lördag ryms: ut {dag(skidvecka.start)}, hem {dag(skidvecka.slut)}.</>}
          </p>
        )}
        <p style={liten}>
          Uppgiften kommer från{' '}
          <a href={rad.kalla} rel="noopener" style={{ color: ACCENT }}>kommunens egen sida</a>,
          läst {skrivDatum(HAMTAD)}. Fristående skolor kan ha egna lov, så kolla med skolan
          innan du bokar.
        </p>

        {!passerat && boendeKvar && (
          <div style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)', marginBottom: 30 }}>
            <h2 style={{ ...etikett, margin: '0 0 12px' }}>Boende i påsk</h2>
            <p style={{ ...brod, fontSize: 15, margin: '0 0 14px' }}>
              Sökningen gäller lördag till lördag, {spann(skidvecka.start, skidvecka.slut)}.
            </p>
            <Annonsmarkning kompakt style={{ marginBottom: 10 }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
              {BOENDE_ORTER.map((ort) => (
                <Partnerlank
                  key={ort.slug}
                  sid={`pasklov-${rad.slug}-${ort.slug}`}
                  sok={{ destination: bookingSok(ort), checkin: skidvecka.start, checkout: skidvecka.slut }}
                  markning={null}
                  style={{ display: 'block', background: BOOKING_BLA, borderRadius: 8, padding: '12px 14px', textDecoration: 'none' }}
                >
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600, color: '#fff' }}>{ort.name}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.72)', marginTop: 2 }}>Booking.com →</div>
                </Partnerlank>
              ))}
            </div>
          </div>
        )}

        {passerat && (
          <div style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)', marginBottom: 30 }}>
            <p style={{ ...brod, fontSize: 15, margin: 0 }}>
              Påsklovet {AR} har passerat. Nästa års veckor beslutas av kommunerna.
            </p>
          </div>
        )}

        <Snon orter={orter} ar={AR} />

        <p style={{ ...brod, fontSize: 13.5, color: 'rgba(255,255,255,0.57)', margin: '30px 0 0' }}>
          {sv && (
            <>
              Sportlovet {i(rad)} {rad.kommun} är vecka {sv.nr}, se{' '}
              <Link href={`/sportlov/${rad.slug}`} style={{ color: ACCENT }}>sportlov {AR} {i(rad)} {rad.kommun}</Link>.{' '}
            </>
          )}
          {samma.length > 0 && (
            <>
              Samma lovdagar har{' '}
              {sammaVisas.map((k, n) => (
                <span key={k.slug}>
                  {n > 0 && (n === sammaVisas.length - 1 && !sammaResten ? ' och ' : ', ')}
                  <Link href={`/pasklov/${k.slug}`} style={{ color: 'rgba(255,255,255,0.72)' }}>{k.kommun}</Link>
                </span>
              ))}
              {sammaResten > 0 && ` och ${sammaResten} kommuner till`}.{' '}
            </>
          )}
          Alla kommuner står på{' '}
          <Link href="/pasklov" style={{ color: ACCENT }}>påsklovssidan</Link>.
        </p>
      </main>

      <SiteFooter />
    </div>
  )
}

const VECKODAGAR = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag']

/** "fredag 26 mars", utan årtal. */
function skrivDag(isoDatum) {
  const d = new Date(`${isoDatum}T12:00:00Z`)
  return `${VECKODAGAR[d.getUTCDay()]} ${dag(isoDatum)}`
}
