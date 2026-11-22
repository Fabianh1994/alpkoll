import { notFound } from 'next/navigation'
import Link from 'next/link'
import SiteHeader from '../../SiteHeader'
import SiteFooter from '../../SiteFooter'
import { skrivDatum } from '../../../lib/valuta'
import { SITE_URL } from '../../../lib/lang'
import {
  AR, KOMMUNER, hamtadFor, kommunFranSlug, kommunSlug, skidveckan, sportlovetSlut, veckan,
} from '../../../lib/sportlov'
import { sasongenSlut } from '../../../lib/nattaget'
import { ACCENT, Veckan, brod, dag, kort, rubrik, spann } from '../Veckan'

// En sida per kommun vi läst på kommunens egen sida.
//
// Folk söker "sportlov stockholm 2027", inte "sportlov 2027". Huvudsidan
// låter besökaren välja vecka; här vet sidan redan svaret, eftersom det
// står i kommunens eget beslut, och kan visa veckan direkt. Allt under
// rubriken är samma vecka som på /sportlov — samma komponent, så att de
// två inte kan säga olika saker.

export const revalidate = 3600
export const dynamicParams = false

export function generateStaticParams() {
  return KOMMUNER.map((k) => ({ kommun: kommunSlug(k.kommun) }))
}

/** "1–5 mars", måndag till fredag — skoldagarna som är lediga. */
function skoldagar(v) {
  const fredag = new Date(`${v.start}T12:00:00Z`)
  fredag.setUTCDate(fredag.getUTCDate() + 4)
  return spann(v.start, fredag.toISOString().slice(0, 10))
}

export async function generateMetadata({ params }) {
  const rad = kommunFranSlug((await params).kommun)
  if (!rad) return {}
  const v = veckan(rad.vecka)

  const title = `Sportlov ${AR} ${rad.kommun}: vecka ${v.nr}, ${skoldagar(v)} | Alpkoll`
  const description =
    `${rad.kommun} har sportlov vecka ${v.nr}, ${skoldagar(v)} ${AR}. ` +
    'Vilken fredag nattåget till Alperna går, vad veckan gör med liftkortspriset och hur lång resan till fjällen är.'
  const url = `${SITE_URL}/sportlov/${kommunSlug(rad.kommun)}`

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

export default async function SportlovKommun({ params }) {
  const rad = kommunFranSlug((await params).kommun)
  if (!rad) notFound()
  const v = veckan(rad.vecka)
  const vecka = skidveckan(rad.vecka)

  const passerat = sportlovetSlut()
  const tagetGar = !sasongenSlut()

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>
      <SiteHeader />

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '108px clamp(20px, 5vw, 32px) 100px' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, margin: '0 0 14px' }}>
          <Link href="/sportlov" style={{ color: ACCENT, textDecoration: 'none' }}>Sportlov {AR}</Link>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}> / {rad.kommun}</span>
        </p>

        <h1 style={{ ...rubrik('clamp(34px, 5.5vw, 54px)'), lineHeight: 1.04, marginBottom: 20 }}>
          Sportlov {AR} {rad.pa ? 'på' : 'i'} {rad.kommun}: vecka {v.nr}
        </h1>

        <p style={{ ...brod, margin: '0 0 14px' }}>
          {rad.kommun} har sportlov vecka {v.nr}, måndag till fredag {skoldagar(v)} {AR}.
          I fjällen och på nattåget räknas veckan lördag till lördag, så den som vill
          använda hela lovet reser lördag {dag(vecka.start)} och
          åker hem lördag {dag(vecka.slut)}.
        </p>
        <p style={{ ...brod, fontSize: 14, margin: '0 0 30px', color: 'rgba(255,255,255,0.57)' }}>
          Uppgiften kommer från{' '}
          <a href={rad.kalla} rel="noopener" style={{ color: ACCENT }}>kommunens egen sida</a>,
          läst {skrivDatum(hamtadFor(rad))}. Fristående skolor kan ha egna lov, så kolla med
          skolan innan du bokar.
        </p>

        {passerat ? (
          <div style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)' }}>
            <p style={{ ...brod, fontSize: 15, margin: 0 }}>
              Sportlovet {AR} är passerat. Nästa års veckor beslutas av kommunerna och
              publiceras under våren — sidan uppdateras då.
            </p>
          </div>
        ) : (
          <Veckan v={v} tagetGar={tagetGar} />
        )}

        <p style={{ ...brod, fontSize: 13.5, color: 'rgba(255,255,255,0.57)', margin: '30px 0 0' }}>
          Alla veckor och kommuner står på{' '}
          <Link href="/sportlov" style={{ color: ACCENT }}>sportlovssidan</Link>. Ska det bli
          Sverige eller Alperna finns{' '}
          <Link href="/salen-eller-alperna" style={{ color: ACCENT }}>Sälen eller Alperna</Link>{' '}
          och <Link href="/are-eller-alperna" style={{ color: ACCENT }}>Åre eller Alperna</Link>.
        </p>
      </main>

      <SiteFooter />
    </div>
  )
}
