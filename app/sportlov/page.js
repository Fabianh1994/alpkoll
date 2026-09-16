import Link from 'next/link'
import SiteHeader from '../SiteHeader'
import SiteFooter from '../SiteFooter'
import Veckovaljaren from './Veckovaljaren'
import { skrivDatum } from '../../lib/valuta'
import { SITE_URL } from '../../lib/lang'
import { AR, HAMTAD, KOMMUNER, VECKOR, kommunerMed, nattagsresa, skidveckan, soldenLage, sportlovetSlut } from '../../lib/sportlov'
import { SVERIGE, sasongenSlut } from '../../lib/nattaget'
import { STADER, TAGLINJER, bilresa, timmar } from '../../lib/restider'

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
  color: 'rgba(255,255,255,0.52)', letterSpacing: '0.12em', textTransform: 'uppercase',
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
/**
 * Målen i restidstabellen.
 *
 * Tre nordiska och en alport, inte trettio: tabellen ska gå att läsa i ett
 * ögonkast på en telefon. Sälen, Trysil och Åre är de mest sökta orterna i
 * Search Console, och Kitzbühel är den enda alport nattåget når utan byte.
 */
const RESMAL = [
  { slug: 'salen', namn: 'Sälen' },
  { slug: 'trysil', namn: 'Trysil' },
  { slug: 'are', namn: 'Åre' },
  { slug: 'kitzbuehel', namn: 'Kitzbühel' },
]

/**
 * Längsta sträckan i tabellen, räknad en gång.
 *
 * Skalan är gemensam för alla tre städerna i stället för att börja om per
 * stad. Annars hade Sälen från Stockholm och Sälen från Malmö fått lika
 * långa staplar trots fyra timmars skillnad, och stapeln sagt emot talet
 * bredvid sig.
 */
const MAX_MINUTER = Math.max(
  ...STADER.flatMap((s) => RESMAL.map((r) => bilresa(r.slug, s.nyckel)?.minuter || 0))
)

function Veckan({ v, tagetGar }) {
  const resa = nattagsresa(v.nr)
  // Sälentåget går via Göteborg fyra lördagar, och två av dem bär en
  // sportlovsvecka. Jämförs mot skidveckans egna lördagar i stället för
  // mot veckonummer, så att en ändrad tidtabell flyttar svaret själv.
  const skidvecka = skidveckan(v.nr)
  const salen = TAGLINJER.find((t) => t.id === 'salen-mora')
  const snall = TAGLINJER.find((t) => t.id === 'fjallen-jamtland')
  // SJ:s klockslag visas bara när de gäller vintern. Höstens tider har ett
  // slutdatum i december och säger ingenting om ett tåg i februari.
  const sj = TAGLINJER.find((t) => t.id === 'sj-jamtland')
  const sjAvgang = sj && !sj.tiderGallerTill ? sj.fran.find((f) => f.stad === 'Stockholm')?.avgang : null
  const salenViaGoteborg = Boolean(
    skidvecka
    && salen?.viaGoteborgUt.includes(skidvecka.start)
    && salen?.viaGoteborgHem.includes(skidvecka.slut)
  )
  // Jämför mot Snälltågets publicerade datum i stället för mot ett
  // veckonummer skrivet för hand. Ändrar Snälltåget avgången i höst
  // flyttar markeringen med den, i stället för att bli kvar på fel vecka.
  const harStockholm = SVERIGE.stockholmsavgang.datum === skrivDatum(resa.ut)
  const kommuner = kommunerMed(v.nr)

  return (
    <>
      <div style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)', marginBottom: 12 }}>
        <div style={etikett}>Sportlov vecka {v.nr}</div>
        {/* Veckans datum är sidans avsnittsrubrik, inte etiketten ovanför.
            Väljaren skriver ut alla fyra veckorna och döljer tre, så en h2
            per block hade gett fyra likadana rubriker i dokumentet. Datumet
            skiljer sig åt mellan veckorna och beskriver det som faktiskt är
            ett eget avsnitt. fontWeight och margin står uttryckligen för att
            rubriktaggen inte ska flytta något: preflight nollar dem redan,
            men inline style vinner oavsett vad som ändras i CSS:en. */}
        <h2 style={{
          fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 38px)',
          fontWeight: 400, color: '#f0ece4', margin: '8px 0 0', letterSpacing: '0.02em',
        }}>{spann(v.start, v.slut)} {AR}</h2>
      </div>

      {/* ── Nattåget ──
          Sidans egentliga svar. Att veckan ligger där den ligger vet läsaren
          redan; vilken fredag tåget går den veckan står ingen annanstans. */}
      <div style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)', marginBottom: 12 }}>
        <h3 style={{ ...etikett, margin: '0 0 12px' }}>Nattåget den här veckan</h3>
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
              <p style={{ ...brod, fontSize: 14.5, margin: '14px 0 0', color: 'rgba(255,255,255,0.62)' }}>
                Tåget från Stockholm går bara {SVERIGE.stockholmsavgang.datum}, alltså
                inte den här veckan. Härifrån gäller {SVERIGE.avgangsstation}, med
                anslutning från {SVERIGE.anslutningar.slice(0, -1).join(', ')} och{' '}
                {SVERIGE.anslutningar[SVERIGE.anslutningar.length - 1]}.
              </p>
            )}
            <p style={{ ...brod, fontSize: 13.5, margin: '16px 0 0', color: 'rgba(255,255,255,0.57)' }}>
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
        <h3 style={{ ...etikett, margin: '0 0 12px' }}>Vad veckan gör med priset</h3>
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
        <p style={{ ...brod, fontSize: 13.5, margin: '16px 0 0', color: 'rgba(255,255,255,0.57)' }}>
          Liftkortspriserna ort för ort står i{' '}
          <Link href="/liftkortspriser" style={{ color: ACCENT }}>prislistan</Link>.
        </p>
      </div>

      {/* ── Resan hemifrån ──
          Restiden folk faktiskt söker på. transfer_minutes i databasen är
          sista biten från flygplatsen och svarar inte på frågan; talen här
          är hela sträckan, räknade med en och samma ruttmotor. */}
      <div style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)', marginBottom: 12 }}>
        <h3 style={{ ...etikett, margin: '0 0 12px' }}>Så lång tid tar resan</h3>
        {/* Var en matris med fyra sifferkolumner och minWidth 420. Vid 375 px
            fanns inte plats, så den fjärde orten låg utanför skärmen bakom
            systemets egen ljusa rullningslist, mitt i ett mörkt kort.
            Staplarna bär samma tal utan att något hamnar utanför, och visar
            dessutom det matrisen dolde: från Stockholm är Kitzbühel 21,1
            timmar mot Sälens 5,9, alltså en annan storleksordning och inte
            en kolumn till. Talet står kvar i klartext till höger — stapeln
            är en läshjälp, inte källan. */}
        <div style={{ margin: '0 0 18px' }}>
          {STADER.map((s) => {
            const rader = RESMAL.map((r) => ({ ...r, minuter: bilresa(r.slug, s.nyckel)?.minuter }))
            // Kortaste restiden från just den staden markeras, så att
            // raden går att läsa utan att jämföra fyra tal i huvudet.
            const kortast = Math.min(...rader.map((r) => r.minuter).filter(Boolean))
            return (
              <div key={s.nyckel} style={{ marginBottom: 20 }}>
                <div style={{ ...etikett, marginBottom: 9 }}>Med bil från {s.namn}</div>
                {rader.map((r) => {
                  const ar = r.minuter === kortast
                  return (
                    <div key={r.slug} style={{
                      display: 'grid', gridTemplateColumns: '78px 1fr 58px',
                      alignItems: 'center', gap: 10, padding: '5px 0',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-body)', fontSize: 13.5,
                        fontWeight: ar ? 500 : 400,
                        color: ar ? ACCENT : 'rgba(255,255,255,0.72)',
                      }}>{r.namn}</span>
                      <span style={{
                        height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)',
                        overflow: 'hidden',
                      }}>
                        {/* Golvet på 4 % är för att den kortaste sträckan ska
                            synas som en stapel och inte som ingenting. Ingen
                            rad ligger i dag i närheten av det. */}
                        <span style={{
                          display: 'block', height: '100%', borderRadius: 3,
                          width: r.minuter ? `${Math.max(4, (r.minuter / MAX_MINUTER) * 100)}%` : 0,
                          background: ar ? ACCENT : 'rgba(255,255,255,0.26)',
                        }} />
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-body)', fontSize: 13,
                        color: ar ? ACCENT : 'rgba(255,255,255,0.55)',
                        textAlign: 'right', whiteSpace: 'nowrap',
                      }}>{r.minuter ? timmar(r.minuter) : '—'}</span>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
        <p style={{ ...brod, fontSize: 15, margin: 0 }}>
          Bor du i Malmö är Kitzbühel närmare än Åre. Det är en och en halv timme
          kortare med bil, och skillnaden mot Trysil är knappt fem timmar. Från
          Stockholm ser det helt annorlunda ut: dit är Sälen sex timmar och Alperna
          över tjugo.
        </p>
        {/* Åre har två nattåg från Stockholm. Linjerna hämtas per id och inte
            per plats i listan: meningen läste förut TAGLINJER[0], som slutade
            vara Snälltåget när SJ lades först. */}
        <p style={{ ...brod, fontSize: 14.5, margin: '14px 0 0' }}>
          Till Åre går två nattåg från Stockholm. SJ kör varje dag
          {sjAvgang ? `, med avgång ${sjAvgang}` : ', men har inte publicerat vinterns tider än'}.
          Snälltåget kör {snall.dagar}, med avgång {snall.fran[0].avgang} och framme {snall.framme.split(',')[0]}.
          Till Sälen går det på lördagar via Mora, med buss sista biten.
          {salenViaGoteborg && ' Den här veckan går det via Göteborg både ut och hem.'}
        </p>
        <p style={{ ...brod, fontSize: 13.5, margin: '16px 0 0', color: 'rgba(255,255,255,0.57)' }}>
          Biltiderna är körtid utan trafik, raster och vinterväglag, räknade med samma
          ruttmotor för alla orter så att de går att jämföra. Räkna med mer i februari.
          Tågtiderna kan ändras av banarbeten, och Sälenlinjens är preliminära tills
          Snälltåget fastställer tidtabellen i höst.
        </p>
      </div>

      {/* ── Kommunerna ──
          Orientering, uttryckligen inte facit. Se lib/sportlov.js. */}
      {kommuner.length > 0 && (
        <div style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)' }}>
          <h3 style={{ ...etikett, margin: '0 0 10px' }}>
            Kommuner med vecka {v.nr}
          </h3>
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
          {KOMMUNER.length} kommuners egna sidor den {skrivDatum(HAMTAD)}. Sportlovet
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
