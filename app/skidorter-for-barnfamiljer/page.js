import Link from 'next/link'
import SiteHeader from '../SiteHeader'
import SiteFooter from '../SiteFooter'
import { getResorts } from '../../lib/resorts'
import { SITE_URL } from '../../lib/lang'
import { land } from '../../lib/countries'
import { arNordisk } from '../../lib/jamfor'
import { harPris } from '../../lib/liftkortspriser'
import { pris } from '../../lib/pris'
import { hamtaKurser } from '../../lib/valuta'
import { STADER, bilresa, narmastMedBil, timmar } from '../../lib/restider'
import { nattagFor } from '../../lib/nattaget'
import { AR } from '../../lib/sportlov'
import { MOTIVERINGAR, SAKNAS, UPPDATERAD, PUBLICERAD, SASONG } from '../../lib/barnfamiljer'

// Skidorter för barnfamiljer.
//
// "bästa skidorten för barnfamiljer" och "skidresa med barn" är bland de
// vanligaste frågorna i forumen (Familjeliv, RikaTillsammans) och i
// Googles "andra frågar även" på Sälensökningarna. Svaren som rankar i dag
// är resebolagens egna listor, som bara tar med orter de säljer.
//
// Sidan ställer orterna mot varandra på det en barnfamilj väljer på:
// familjepoängen och nybörjarpoängen (redaktionella, se docs/poangskala.md),
// hur mycket folk det är, bilresan hemifrån och liftkortet i kronor. Alla
// orter ur samma urval som resten av sajten, så en ort Alpkoll inte säljer
// något hos kommer med på samma villkor som de andra.
//
// Poängen är omdömen. Talen visas därför utskrivna bredvid placeringen,
// så att läsaren ser att 9 och 8 är nära.
//
// Sedan november 2026 är sidan byggd för att kunna citeras av ChatGPT och
// Googles AI-svar: ett kort svar överst, en numrerad topplista med årtal i
// rubriken, en motivering och en nackdel per ort (lib/barnfamiljer.js),
// källor, ett synligt uppdateringsdatum och strukturerad data (ItemList,
// Article och FAQPage). ChatGPT svarade på "vilken skidort är bäst för en
// barnfamilj?" med listor från Freeride, Bokafjällen och Gogo, alla med
// årtal i titeln och en motivering per ort.

export const revalidate = 3600

const ADRESS = `${SITE_URL}/skidorter-for-barnfamiljer`
const titel = `Bästa skidorten för barnfamiljer ${SASONG}: topplista Sverige och Alperna | Alpkoll`
const beskrivning =
  `Bästa skidorterna för barnfamiljer ${SASONG}, rankade på barnvänlighet, lätta backar, ` +
  'hur mycket folk det är, bilresan hemifrån och liftkortet i kronor. Med motivering och nackdel för varje ort.'

/** "2026-11-20" -> "20 november 2026" */
const datum = (iso) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

export const metadata = {
  title: titel,
  description: beskrivning,
  alternates: { canonical: ADRESS },
  openGraph: {
    title: titel,
    description: beskrivning,
    url: ADRESS,
    publishedTime: PUBLICERAD,
    modifiedTime: UPPDATERAD,
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
  letterSpacing: '0.03em', margin: '0 0 18px', color: '#f0ece4',
})

// Orter med minst den här familjepoängen räknas som byggda för barn.
// 8 är strecket över "normal alport" (7) i skalan.
const GRANS = 8

const tal = (v) => (Number.isFinite(Number(v)) ? Number(v) : null)

/** Familjepoäng först, nybörjarpoäng vid lika, sedan gott om plats. */
function ordning(a, b) {
  return (tal(b.family_friendly_score) ?? 0) - (tal(a.family_friendly_score) ?? 0)
    || (tal(b.beginner_score) ?? 0) - (tal(a.beginner_score) ?? 0)
    || (tal(b.crowd_score) ?? 0) - (tal(a.crowd_score) ?? 0)
}

function Poang({ namn, varde }) {
  if (varde == null) return null
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '108px 1fr 26px', alignItems: 'center', gap: 10, padding: '3px 0' }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'rgba(255,255,255,0.58)' }}>{namn}</span>
      <span style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <span style={{ display: 'block', height: '100%', width: `${varde * 10}%`, background: varde >= GRANS ? ACCENT : 'rgba(255,255,255,0.3)', borderRadius: 3 }} />
      </span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: '#f0ece4', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{varde}</span>
    </div>
  )
}

export default async function SkidorterForBarnfamiljer() {
  const [orter, kurser] = await Promise.all([getResorts(), hamtaKurser()])

  const familjeorter = orter
    .filter((o) => (tal(o.family_friendly_score) ?? 0) >= GRANS)
    .sort(ordning)
  const ovriga = orter
    .filter((o) => (tal(o.family_friendly_score) ?? 0) < GRANS)
    .sort(ordning)

  const namn = new Map(orter.map((o) => [o.slug, o.name]))
  const familjeSlugs = familjeorter.map((o) => o.slug)

  const nordiska = familjeorter.filter(arNordisk)
  const alporter = familjeorter.filter((o) => !arNordisk(o))
  const svenska = nordiska.filter((o) => o.country === 'Sweden')

  // Kort svar: meningen en AI-tjänst eller en stressad förälder kan citera
  // rakt av. Härleds ur samma ordning som listan, så den inte kan säga emot.
  const lista = (orter) => orter.map((o) => o.name).reduce((acc, n, i, arr) =>
    i === 0 ? n : i === arr.length - 1 ? `${acc} och ${n}` : `${acc}, ${n}`, '')
  const motiv = (o) => MOTIVERINGAR[o.slug]?.kort
  const toppSverige = svenska.slice(0, 3)
  const toppAlperna = alporter.slice(0, 3)

  const fragor = [
    toppSverige.length > 0 && {
      fraga: 'Vilken skidort i Sverige är bäst för barnfamiljer?',
      svar: `${toppSverige[0].name}, följt av ${lista(toppSverige.slice(1))}. ` +
        toppSverige.map((o) => motiv(o) && `${o.name}: ${motiv(o)}.`).filter(Boolean).join(' '),
    },
    toppAlperna.length > 0 && {
      fraga: 'Vilken skidort i Alperna är bäst för barnfamiljer?',
      svar: `${lista(toppAlperna)}. ` +
        toppAlperna.map((o) => motiv(o) && `${o.name}: ${motiv(o)}.`).filter(Boolean).join(' '),
    },
    {
      fraga: 'Var åker barn gratis i liftarna?',
      svar: 'I Branäs åker barn upp till sex år gratis och i Idre Fjäll barn under åtta. I Alta Badia åker barn under åtta år gratis med en betalande vuxen, och i Saas-Fee barn under nio när en förälder köper sexdagarskort.',
    },
    {
      fraga: 'Sverige eller Alperna med små barn?',
      svar: 'Med barn under skolåldern är Sverige oftast enklare: bilresan i stället för flyg och transfer, boende vid backen och lätt pist. Alperna ger mer snö högt upp och längre backar, och passar bättre när barnen åker själva i röd pist.',
    },
  ].filter(Boolean)

  const topplistan = [...nordiska, ...alporter]
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${ADRESS}#artikel`,
        headline: `Bästa skidorterna för barnfamiljer ${SASONG}`,
        description: beskrivning,
        datePublished: PUBLICERAD,
        dateModified: UPPDATERAD,
        inLanguage: 'sv-SE',
        mainEntityOfPage: ADRESS,
        image: `${SITE_URL}/og-image.png`,
        author: { '@type': 'Organization', name: 'Alpkoll', url: SITE_URL },
        publisher: { '@type': 'Organization', name: 'Alpkoll', url: SITE_URL, logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon-512.png` } },
      },
      {
        '@type': 'ItemList',
        name: `Bästa skidorterna för barnfamiljer ${SASONG}`,
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        numberOfItems: topplistan.length,
        itemListElement: topplistan.map((o, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: o.name,
          url: `${SITE_URL}/resort/${o.slug}`,
          ...(MOTIVERINGAR[o.slug] ? { description: MOTIVERINGAR[o.slug].varfor } : {}),
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: fragor.map((f) => ({
          '@type': 'Question',
          name: f.fraga,
          acceptedAnswer: { '@type': 'Answer', text: f.svar },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Alpkoll', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Skidorter för barnfamiljer', item: ADRESS },
        ],
      },
    ],
  }

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '108px clamp(20px, 5vw, 32px) 100px' }}>
        <h1 style={{ ...rubrik('clamp(34px, 5.5vw, 54px)'), lineHeight: 1.04, marginBottom: 12 }}>
          Bästa skidorterna för barnfamiljer {SASONG}
        </h1>
        <p style={{ ...etikett, margin: '0 0 24px' }}>
          Uppdaterad <time dateTime={UPPDATERAD}>{datum(UPPDATERAD)}</time> · Alpkoll
        </p>

        {/* ── Kort svar ── */}
        {toppSverige.length > 0 && (
          <section style={{ ...kort, borderLeft: `3px solid ${ACCENT}`, padding: 'clamp(18px, 4vw, 24px)', marginBottom: 24 }}>
            <h2 style={{ ...etikett, color: ACCENT, margin: '0 0 10px' }}>Kort svar</h2>
            <p style={{ ...brod, color: 'rgba(255,255,255,0.82)', margin: 0 }}>
              Bäst för barnfamiljer i Sverige {SASONG} är <strong style={{ color: '#f0ece4' }}>{lista(toppSverige)}</strong>.{' '}
              {toppSverige.map((o) => motiv(o) && <span key={o.slug}>{o.name}: {motiv(o)}. </span>)}
              {toppAlperna.length > 0 && (
                <>I Alperna ligger <strong style={{ color: '#f0ece4' }}>{lista(toppAlperna)}</strong> högst.</>
              )}
            </p>
          </section>
        )}

        <p style={{ ...brod, margin: '0 0 14px' }}>
          Med barn väljer man ort på andra saker än pistkilometer: lätta backar nära
          boendet, skidskola, hur mycket folk det är och hur länge barnen sitter i bilen.
          Här står orterna i Sverige, Norge, Finland och Alperna rankade på just det.
        </p>
        <p style={{ ...brod, fontSize: 14.5, margin: '0 0 30px', color: 'rgba(255,255,255,0.57)' }}>
          {familjeorter.length > 0 && (
            <>
              {familjeorter.length} av {orter.length} orter får minst {GRANS} av 10 för barnfamiljer.{' '}
            </>
          )}
          Ordningen följer familjepoängen, sedan nybörjarpoängen och sist hur mycket plats det är i backen.
          Poängen är våra egna omdömen, satta mot fasta ankare: Sälen är 10, en vanlig alport 7.{' '}
          <Link href="/sa-jamfor-vi" style={{ color: ACCENT }}>Så sätter vi poängen</Link>.
        </p>

        {/* ── Närmast hemifrån ──
            Restiden är det barnfamiljer oftast nämner först i forumen, och
            det enda på sidan som är mätt och inte bedömt. */}
        {familjeSlugs.length > 0 && (
          <section style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)', marginBottom: 36 }}>
            <h2 style={{ ...etikett, margin: '0 0 14px' }}>Närmaste familjeorten med bil</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18 }}>
              {STADER.map((s) => (
                <div key={s.nyckel}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 6 }}>Från {s.namn}</div>
                  {narmastMedBil(s.nyckel, familjeSlugs).slice(0, 3).map((x) => (
                    <div key={x.slug} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '3px 0' }}>
                      <Link href={`/resort/${x.slug}`} style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#f0ece4', textDecoration: 'none' }}>{namn.get(x.slug)}</Link>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: ACCENT }}>{timmar(x.minuter)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <p style={{ ...brod, fontSize: 12.5, margin: '14px 0 0', color: 'rgba(255,255,255,0.5)' }}>
              Körtid utan trafik och raster, räknad med samma ruttmotor för alla orter. Räkna med mer med barn i bilen.
            </p>
          </section>
        )}

        {[
          { rubrik: `Topplistan: Sverige och Norden ${SASONG}`, lista: nordiska },
          { rubrik: `Topplistan: Alperna ${SASONG}`, lista: alporter },
        ].filter((g) => g.lista.length > 0).map((grupp) => (
          <section key={grupp.rubrik} style={{ marginBottom: 36 }}>
            <h2 style={rubrik('clamp(26px, 4vw, 34px)')}>{grupp.rubrik}</h2>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {grupp.lista.map((o, plats) => {
              const m = MOTIVERINGAR[o.slug]
              const kr = harPris(o) ? pris(o.lift_pass_week_eur, o.lift_pass_currency || 'EUR', kurser)?.kr : null
              // Till alporterna räknas bilen från Malmö, samma val som
              // bilMening i lib/restider.js: 22 timmar från Stockholm
              // hjälper ingen att välja.
              const fran = arNordisk(o) ? { nyckel: 'Stockholm', namn: 'Stockholm' } : { nyckel: 'Malmo', namn: 'Malmö' }
              const bil = bilresa(o.slug, fran.nyckel)
              const tag = nattagFor(o.slug)
              return (
                <li key={o.slug} style={{ ...kort, padding: 'clamp(18px, 4vw, 26px)', marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                    <h3 style={{ ...rubrik(26), margin: 0 }}>
                      <span style={{ color: ACCENT, marginRight: 10 }}>{plats + 1}.</span>
                      <Link href={`/resort/${o.slug}`} style={{ color: '#f0ece4', textDecoration: 'none' }}>{o.name}</Link>
                    </h3>
                    <span style={etikett}>{land(o.country)}</span>
                  </div>
                  <div style={{ margin: '14px 0 12px', maxWidth: 420 }}>
                    <Poang namn="Barnfamilj" varde={tal(o.family_friendly_score)} />
                    <Poang namn="Nybörjare" varde={tal(o.beginner_score)} />
                    <Poang namn="Gott om plats" varde={tal(o.crowd_score)} />
                  </div>
                  {m && (
                    <>
                      <p style={{ ...brod, fontSize: 15, margin: '0 0 8px', color: 'rgba(255,255,255,0.78)' }}>
                        <strong style={{ color: '#f0ece4', fontWeight: 600 }}>Därför: </strong>{m.varfor}
                      </p>
                      <p style={{ ...brod, fontSize: 15, margin: '0 0 12px' }}>
                        <strong style={{ color: '#f0ece4', fontWeight: 600 }}>Nackdel: </strong>{m.nackdel}
                      </p>
                    </>
                  )}
                  <p style={{ ...brod, fontSize: 14, margin: 0 }}>
                    {bil && <>Med bil {timmar(bil.minuter)} från {fran.namn}. </>}
                    {tag && <>Nattåget går hit. </>}
                    {kr && <>Liftkort för sex dagar {kr}. </>}
                    {o.slug === 'salen' && (
                      <Link href="/var-bo-i-salen" style={{ color: ACCENT }}>Vilket område i Sälen?</Link>
                    )}
                  </p>
                  {m?.kallor?.length > 0 && (
                    <p style={{ ...brod, fontSize: 12.5, margin: '10px 0 0', color: 'rgba(255,255,255,0.48)' }}>
                      Källor:{' '}
                      {m.kallor.map((k, i) => (
                        <span key={k.url}>
                          {i > 0 && ', '}
                          <a href={k.url} rel="noopener" target="_blank" style={{ color: 'rgba(255,255,255,0.6)' }}>{k.namn}</a>
                        </span>
                      ))}
                    </p>
                  )}
                </li>
              )
            })}
            </ol>
          </section>
        ))}

        {ovriga.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <h2 style={rubrik(22)}>Möjligt med barn, men inte byggt för det</h2>
            <p style={{ ...brod, fontSize: 14.5, margin: '0 0 10px' }}>
              Orterna nedan fungerar med barn men får under {GRANS} av 10. Vad som drar ner
              står på respektive ortsida.
            </p>
            <p style={{ ...brod, fontSize: 14.5, margin: 0 }}>
              {ovriga.map((o, i) => (
                <span key={o.slug}>
                  {i > 0 && ', '}
                  <Link href={`/resort/${o.slug}`} style={{ color: 'rgba(255,255,255,0.72)' }}>{o.name}</Link>
                  {tal(o.family_friendly_score) != null && <span style={{ color: 'rgba(255,255,255,0.45)' }}> ({tal(o.family_friendly_score)})</span>}
                </span>
              ))}.
            </p>
          </section>
        )}

        {/* ── Saknas ──
            Orter som AI-svaren och topplistorna nämner men som inte finns i
            databasen. Utan raden ser listan ut att ha valt bort dem. */}
        {SAKNAS.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <h2 style={rubrik(22)}>Saknas i jämförelsen</h2>
            <p style={{ ...brod, fontSize: 14.5, margin: '0 0 10px' }}>
              Två svenska familjeorter finns inte i vår databas än, så vi kan inte ranka dem
              på samma siffror som de andra:
            </p>
            <ul style={{ ...brod, fontSize: 14.5, margin: 0, paddingLeft: 20 }}>
              {SAKNAS.map((x) => (
                <li key={x.namn} style={{ marginBottom: 6 }}>
                  <strong style={{ color: '#f0ece4', fontWeight: 600 }}>{x.namn}</strong> {x.text} (
                  <a href={x.kalla.url} rel="noopener" target="_blank" style={{ color: 'rgba(255,255,255,0.7)' }}>{x.kalla.namn}</a>).
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Vanliga frågor ── samma text som FAQPage i jsonLd. */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={rubrik('clamp(24px, 3.6vw, 30px)')}>Vanliga frågor</h2>
          {fragor.map((f) => (
            <div key={f.fraga} style={{ marginBottom: 18 }}>
              <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 16.5, fontWeight: 600, color: '#f0ece4', margin: '0 0 6px' }}>{f.fraga}</h3>
              <p style={{ ...brod, fontSize: 15, margin: 0 }}>{f.svar}</p>
            </div>
          ))}
        </section>

        <section style={{ marginBottom: 30 }}>
          <h2 style={rubrik(22)}>Källor och metod</h2>
          <p style={{ ...brod, fontSize: 14.5, margin: 0 }}>
            Pistfördelning, liftar och höjder kommer från skiresort.com för alla orter. Barnområden,
            barnpriser och skidskolor kommer från orternas egna sidor, skiresort.com:s familjebetyg,
            Ski Club GB och Snowthere, länkade under varje ort. Körtiderna är uppmätta med samma
            ruttmotor för alla orter, och liftkortspriset är sexdagarskortet för en vuxen i
            högsäsong, omräknat till kronor. Ingen ort kan betala för sin placering.{' '}
            <Link href="/sa-jamfor-vi" style={{ color: ACCENT }}>Så jämför vi</Link>.
          </p>
        </section>

        <p style={{ ...brod, fontSize: 14.5, margin: '30px 0 0' }}>
          Vidare: <Link href="/var-bo-i-salen" style={{ color: ACCENT }}>var ska man bo i Sälen</Link>,{' '}
          <Link href="/sportlov" style={{ color: ACCENT }}>sportlovet {AR}</Link>,{' '}
          <Link href="/jamfor" style={{ color: ACCENT }}>jämför två orter</Link> och{' '}
          <Link href="/liftkortspriser" style={{ color: ACCENT }}>liftkortspriser</Link>.
        </p>
      </main>

      <SiteFooter />
    </div>
  )
}
