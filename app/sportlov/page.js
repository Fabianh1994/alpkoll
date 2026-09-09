import Link from 'next/link'
import SiteHeader from '../SiteHeader'
import SiteFooter from '../SiteFooter'
import Veckovaljaren from './Veckovaljaren'
import { skrivDatum } from '../../lib/valuta'
import { SITE_URL } from '../../lib/lang'
import { AR, HAMTAD, KOMMUNER, VECKOR, kommunerMed, nattagsresa, soldenLage, sportlovetSlut } from '../../lib/sportlov'
import { SVERIGE, sasongenSlut } from '../../lib/nattaget'

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

const ACCENT = '#D4A574'
const kort = { background: '#1c1a17', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }
const etikett = {
  fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500,
  color: 'rgba(255,255,255,0.28)', letterSpacing: '0.12em', textTransform: 'uppercase',
}
const brod = {
  fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.75,
  color: 'rgba(255,255,255,0.62)', maxWidth: 660,
}
const rubrik = (storlek) => ({
  fontFamily: 'var(--font-heading)', fontSize: storlek, fontWeight: 400,
  letterSpacing: '0.03em', margin: '0 0 18px',
})

const MANADER = [
  'januari', 'februari', 'mars', 'april', 'maj', 'juni',
  'juli', 'augusti', 'september', 'oktober', 'november', 'december',
]

/** "15–21 februari" ur två ISO-datum, utan att upprepa månaden i onödan. */
function spann(start, slut) {
  const [, m1, d1] = start.split('-')
  const [, m2, d2] = slut.split('-')
  const manad = (m) => MANADER[Number(m) - 1]
  return m1 === m2
    ? `${Number(d1)}–${Number(d2)} ${manad(m2)}`
    : `${Number(d1)} ${manad(m1)} – ${Number(d2)} ${manad(m2)}`
}

/** "26 februari" — datum utan årtal, för löptext inom ett känt år. */
function dag(iso) {
  return (skrivDatum(iso) || '').replace(new RegExp(` ${AR}$`), '')
}

/**
 * Innehållet för en vecka.
 *
 * Byggs ur VECKOR och nattagsresa() i stället för att skrivas fyra gånger,
 * så att ingen vecka kan få en avgång som inte följer av tidtabellen.
 */
function Veckan({ v, tagetGar }) {
  const resa = nattagsresa(v.nr)
  // Jämför mot Snälltågets publicerade datum i stället för mot ett
  // veckonummer skrivet för hand. Ändrar Snälltåget avgången i höst
  // flyttar markeringen med den, i stället för att bli kvar på fel vecka.
  const harStockholm = SVERIGE.stockholmsavgang.datum === skrivDatum(resa.ut)
  const kommuner = kommunerMed(v.nr)

  return (
    <>
      <div style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)', marginBottom: 12 }}>
        <div style={etikett}>Sportlov vecka {v.nr}</div>
        <div style={{
          fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 38px)',
          color: '#f0ece4', margin: '8px 0 0', letterSpacing: '0.02em',
        }}>{spann(v.start, v.slut)} {AR}</div>
      </div>

      {/* ── Nattåget ──
          Sidans egentliga svar. Att veckan ligger där den ligger vet läsaren
          redan; vilken fredag tåget går den veckan står ingen annanstans. */}
      <div style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)', marginBottom: 12 }}>
        <div style={{ ...etikett, marginBottom: 12 }}>Nattåget den här veckan</div>
        {tagetGar ? (
          <>
            <p style={{ ...brod, fontSize: 15, margin: 0 }}>
              Skidveckan går lördag till lördag, så tåget du vill ha är det som avgår{' '}
              <strong style={{ color: '#f0ece4', fontWeight: 500 }}>
                {SVERIGE.avgangsdag} {dag(resa.ut)}
              </strong>{' '}
              från {SVERIGE.avgangsstation}, {SVERIGE.avgang}. Du sover ombord och är
              framme på lördagsmorgonen. Hemresan lämnar Österrike{' '}
              {dag(resa.hemFranAlperna)} på kvällen och är i Sverige{' '}
              {SVERIGE.hemkomstdag}en därpå, {SVERIGE.hemkomst}.
            </p>
            {harStockholm ? (
              <div style={{
                marginTop: 18, padding: '16px 18px', borderRadius: 8,
                background: 'rgba(212,165,116,0.07)', border: '1px solid rgba(212,165,116,0.22)',
              }}>
                <div style={{ ...etikett, color: ACCENT, marginBottom: 8 }}>
                  Den här veckan slipper du åka till Malmö
                </div>
                <p style={{ ...brod, fontSize: 14.5, margin: 0 }}>
                  {SVERIGE.stockholmsavgang.datum} går tåget hela vägen från Stockholm,{' '}
                  {SVERIGE.stockholmsavgang.avgang}. Det är enda gången i vinter.
                  Hemresan går {SVERIGE.stockholmsavgang.retur} och är i Stockholm på{' '}
                  {SVERIGE.hemkomstdag}en, {SVERIGE.stockholmsavgang.hemkomst}.
                </p>
              </div>
            ) : (
              <p style={{ ...brod, fontSize: 14.5, margin: '14px 0 0', color: 'rgba(255,255,255,0.42)' }}>
                Tåget från Stockholm går bara {SVERIGE.stockholmsavgang.datum}, alltså
                inte den här veckan. Härifrån gäller {SVERIGE.avgangsstation}, med
                anslutning från {SVERIGE.anslutningar.slice(0, -1).join(', ')} och{' '}
                {SVERIGE.anslutningar[SVERIGE.anslutningar.length - 1]}.
              </p>
            )}
            <p style={{ ...brod, fontSize: 13.5, margin: '16px 0 0', color: 'rgba(255,255,255,0.35)' }}>
              Kitzbühel når du utan byte. Till Sölden, Ischgl, St. Anton och Mayrhofen
              går transferbuss från stationen. Vilken hållplats som gäller står i{' '}
              <Link href="/nattaget-till-alperna" style={{ color: ACCENT }}>nattågsguiden</Link>.
            </p>
          </>
        ) : (
          <p style={{ ...brod, fontSize: 15, margin: 0 }}>
            Snälltågets tidtabell för den här vintern har gått ut, och nästa säsong
            är inte publicerad. Den kommer under hösten.
          </p>
        )}
      </div>

      {/* ── Priset ──
          Det svar som förvånar: veckan spelar ingen roll i Alperna. Det står
          här i stället för i prislistan, därför att det är just den vecka
          läsaren valde och just den vecka frågan gällde. */}
      <div style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)', marginBottom: 12 }}>
        <div style={{ ...etikett, marginBottom: 12 }}>Vad veckan gör med priset</div>
        <p style={{ ...brod, fontSize: 15, margin: 0 }}>
          I Alperna: ingenting. Ischgl tar samma pris hela säsongen. Alpe d&apos;Huez,
          Les Arcs, Livigno och Kitzbühel har prisband som täcker hela sportlovet i ett
          stycke. Flyttar du resan en vecka betalar du lika mycket.
        </p>
        <p style={{ ...brod, fontSize: 15, margin: '14px 0 0' }}>
          Sölden är undantaget. Där kostar veckan 478,50 € till och med 26 februari och
          469 € efter det.{' '}{{
            fore: `Vecka ${v.nr} ligger helt i det dyrare bandet.`,
            over: `Vecka ${v.nr} spänner över gränsen: sänkningen kommer på veckans sista dag.`,
            efter: `Vecka ${v.nr} ligger helt efter sänkningen.`,
          }[soldenLage(v.nr)]}
        </p>
        <p style={{ ...brod, fontSize: 15, margin: '14px 0 0' }}>
          I Sverige och Norge är det tvärtom. Åre, Sälen, Hemsedal och Trysil sätter
          priset efter vilken dag du startar. Talen på sajten gäller veckan som börjar
          1 mars, så för en annan vecka kan de stämma dåligt.
        </p>
        <p style={{ ...brod, fontSize: 13.5, margin: '16px 0 0', color: 'rgba(255,255,255,0.35)' }}>
          Liftkortspriserna ort för ort står i{' '}
          <Link href="/liftkortspriser" style={{ color: ACCENT }}>prislistan</Link>.
        </p>
      </div>

      {/* ── Kommunerna ──
          Orientering, uttryckligen inte facit. Se lib/sportlov.js. */}
      {kommuner.length > 0 && (
        <div style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)' }}>
          <div style={{ ...etikett, marginBottom: 10 }}>
            Kommuner med vecka {v.nr}
          </div>
          <p style={{ ...brod, fontSize: 14.5, margin: 0 }}>
            {kommuner.map((k) => k.kommun).join(', ')}.
          </p>
        </div>
      )}
    </>
  )
}

export default function SportlovSida() {
  const passerat = sportlovetSlut()
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
          fredag nattåget går. Liftkortet kostar lika mycket oavsett.
        </p>
        <p style={{ ...brod, fontSize: 14.5, margin: '0 0 30px', color: 'rgba(255,255,255,0.42)' }}>
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

        <p style={{ ...brod, fontSize: 13.5, color: 'rgba(255,255,255,0.35)', margin: '30px 0 8px' }}>
          Veckorna räknas måndag till söndag. Kommunuppgifterna är hämtade från{' '}
          {KOMMUNER.length} kommuners egna sidor den {skrivDatum(HAMTAD)}. Sportlovet
          bestäms av varje kommun och kan flyttas, så kolla mot din egen innan du bokar.
        </p>
        <p style={{ ...brod, fontSize: 13.5, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
          Ska det bli Sverige eller Alperna finns{' '}
          <Link href="/salen-eller-alperna" style={{ color: ACCENT }}>Sälen eller Alperna</Link>{' '}
          och <Link href="/are-eller-alperna" style={{ color: ACCENT }}>Åre eller Alperna</Link>.
        </p>
      </main>

      <SiteFooter />
    </div>
  )
}
