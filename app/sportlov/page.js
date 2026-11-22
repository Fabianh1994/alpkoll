import Link from 'next/link'
import SiteHeader from '../SiteHeader'
import SiteFooter from '../SiteFooter'
import Veckovaljaren from './Veckovaljaren'
import { skrivDatum } from '../../lib/valuta'
import { SITE_URL } from '../../lib/lang'
import { AR, KOMMUNER, VECKOR, hamtadeDagar, sportlovetSlut } from '../../lib/sportlov'
import { sasongenSlut } from '../../lib/nattaget'
import { ACCENT, Veckan, brod, kort, rubrik, spann } from './Veckan'

// Samma intervall som ortsidorna. Betyder också att sidan märker att
// sportlovet passerat inom en timme, utan deploy.
export const revalidate = 3600

const titel = `Sportlov ${AR} — vecka 7, 8, 9 eller 10 | Alpkoll`
const beskrivning =
  `Sportlovet ${AR} ligger i vecka 7 till 10 beroende på var du bor. Välj din vecka ` +
  'och se vilken fredag nattåget går. Liftkortet i Alperna kostar lika mycket ' +
  'vilken vecka du än åker.'

export const metadata = {
  title: titel,
  description: beskrivning,
  alternates: { canonical: `${SITE_URL}/sportlov` },
  openGraph: {
    title: titel,
    description: beskrivning,
    url: `${SITE_URL}/sportlov`,
    siteName: 'Alpkoll',
    type: 'article',
    locale: 'sv_SE',
    images: ['/og-image.png'],
  },
  twitter: { card: 'summary_large_image', title: titel, description: beskrivning, images: ['/og-image.png'] },
}

export default function SportlovSida() {
  const passerat = sportlovetSlut()
  // "9 september och 22 november 2026": listan har lästs i omgångar.
  const dagar = hamtadeDagar().map(skrivDatum)
  // Årtalet skrivs bara en gång när alla dagar ligger samma år.
  const ettAr = new Set(hamtadeDagar().map((d) => d.slice(0, 4))).size === 1
  const forsta = dagar.slice(0, -1).map((d) => (ettAr ? d.replace(/ \d{4}$/, '') : d))
  const lasDagar = dagar.length < 2 ? dagar.join('') : `${forsta.join(', ')} och ${dagar[dagar.length - 1]}`
  const tagetGar = !sasongenSlut()

  const veckor = VECKOR.map((v) => ({ nr: v.nr, text: spann(v.start, v.slut) }))
  const barn = Object.fromEntries(
    VECKOR.map((v) => [v.nr, <Veckan key={v.nr} v={v} tagetGar={tagetGar} />])
  )

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>
      <SiteHeader />

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '108px clamp(20px, 5vw, 32px) 100px' }}>
        <h1 style={{ ...rubrik('clamp(38px, 6vw, 60px)'), lineHeight: 1.02, marginBottom: 20 }}>
          Sportlov {AR}
        </h1>

        <p style={{ ...brod, margin: '0 0 14px' }}>
          Sportlovet ligger i vecka 7, 8, 9 eller 10. Vilken du har bestämmer vilken
          fredag nattåget går. I Alperna kostar liftkortet i stort sett lika mycket
          oavsett vecka.
        </p>
        <p style={{ ...brod, fontSize: 14.5, margin: '0 0 30px', color: 'rgba(255,255,255,0.62)' }}>
          Göteborg har vecka 7, Malmö och Uppsala vecka 8, Stockholm vecka 9. Hittar du
          inte din kommun i listorna nedan står veckan på kommunens egen sida.
        </p>

        {passerat ? (
          <div style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)' }}>
            <p style={{ ...brod, fontSize: 15, margin: 0 }}>
              Sportlovet {AR} är passerat. Nästa års veckor beslutas av kommunerna och
              publiceras under våren — sidan uppdateras då.
            </p>
          </div>
        ) : (
          <Veckovaljaren veckor={veckor} barn={barn} />
        )}

        <p style={{ ...brod, fontSize: 13.5, color: 'rgba(255,255,255,0.57)', margin: '30px 0 8px' }}>
          Veckorna räknas måndag till söndag. Kommunuppgifterna är hämtade från{' '}
          {KOMMUNER.length} kommuners egna sidor den {lasDagar}. Sportlovet
          bestäms av varje kommun och kan flyttas, så kolla mot din egen innan du bokar.
        </p>
        <p style={{ ...brod, fontSize: 13.5, color: 'rgba(255,255,255,0.57)', margin: 0 }}>
          Ska det bli Sverige eller Alperna finns{' '}
          <Link href="/salen-eller-alperna" style={{ color: ACCENT }}>Sälen eller Alperna</Link>{' '}
          och <Link href="/are-eller-alperna" style={{ color: ACCENT }}>Åre eller Alperna</Link>.
        </p>
      </main>

      <SiteFooter />
    </div>
  )
}
