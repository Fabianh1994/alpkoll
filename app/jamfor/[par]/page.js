import { notFound, permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import SiteHeader from '../../SiteHeader'
import SiteFooter from '../../SiteFooter'
import { getResort, getResortSlugs } from '../../../lib/resorts'
import { SITE_URL } from '../../../lib/lang'
import { land } from '../../../lib/countries'
import { restid } from '../../../lib/travel'
import { farOptimeras } from '../../../lib/images'
import { hamtaKurser, skrivDatum } from '../../../lib/valuta'
import { pris } from '../../../lib/pris'
import {
  GRUPPER,
  HUVUDPUNKTER,
  PASSAR,
  arNordisk,
  jamforelseMeningar,
  parSlugsFor,
  tolkaPar,
} from '../../../lib/jamfor'

// Samma intervall som ortsidorna. En rättad siffra i Supabase slår
// igenom på jämförelsesidan inom en timme, utan ny deploy.
export const revalidate = 3600

// De kuraterade paren byggs i förväg. Övriga par renderas vid första
// besöket — väljaren på /jamfor släpper fram vilka två orter som helst,
// och en sida som inte finns hade gjort väljaren meningslös.
export async function generateStaticParams() {
  const publicerade = await getResortSlugs()
  return parSlugsFor(publicerade).map((par) => ({ par }))
}

/** Paret som två orter, eller null när adressen inte kan visas. */
async function hamtaPar(parSlug) {
  const tolkat = tolkaPar(parSlug)
  if (!tolkat) return null

  const orter = await Promise.all(tolkat.slugs.map((slug) => getResort(slug)))
  // Dolda och påhittade orter ger båda null här, och båda ska ge 404.
  if (orter.some((ort) => !ort)) return null

  return { ...tolkat, orter }
}

export async function generateMetadata({ params }) {
  const parSlug = (await params).par
  const par = await hamtaPar(parSlug)

  if (!par) return { title: 'Jämförelsen hittades inte — Alpkoll' }

  const [a, b] = par.kanonisk ? par.orter : [...par.orter].reverse()

  const title = `${a.name} eller ${b.name}? Jämförelse | Alpkoll`
  const kurser = await hamtaKurser()
  const vecka = (r) => pris(r.est_weekly_cost_eur, r.lift_pass_currency || 'EUR', kurser)?.kr

  const description = `${a.name} mot ${b.name}: ${a.total_pistes_km} km pist mot ${b.total_pistes_km}${vecka(a) && vecka(b) ? `, veckan kostar ${vecka(a)} mot ${vecka(b)}` : ''}. Samma källa för båda orterna.`
  const url = `${SITE_URL}/jamfor/${par.kanoniskSlug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    // Vi marknadsför de kuraterade paren. Övriga svarar för besökaren som
    // valt dem i väljaren, men ska inte tävla med våra egna sidor i
    // sökresultaten — och alport mot alport är en sida vi ändå inte kan
    // vinna mot de internationella skidsajterna.
    robots: par.kurerat ? undefined : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Alpkoll',
      type: 'article',
      locale: 'sv_SE',
      images: a.image_url ? [{ url: a.image_url, width: 1200, height: 630, alt: a.name }] : ['/og-image.png'],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/og-image.png'] },
  }
}

/**
 * Värdet att märka ut, eller null.
 *
 * Null när fältet saknar riktning — mer blå pist är en fördel för
 * nybörjaren och en nackdel för den som vill ha brant — och null när
 * orterna står lika, eftersom två markerade rutor inte utser någon.
 */
function bastaVardet(falt, orter) {
  if (!falt.riktning) return null

  const varden = orter.map(falt.varde)
  if (varden.some((v) => !Number.isFinite(v))) return null

  const basta = falt.riktning === 'hog' ? Math.max(...varden) : Math.min(...varden)
  if (varden.every((v) => v === basta)) return null

  return basta
}

const ACCENT = '#D4A574'

const kort = {
  background: '#1c1a17',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 10,
}

const rubrik = {
  fontFamily: 'var(--font-heading)',
  fontSize: 22,
  color: '#f0ece4',
  letterSpacing: '0.04em',
  marginBottom: 16,
}

const etikett = {
  fontFamily: 'var(--font-body)',
  fontSize: 10,
  color: 'rgba(255,255,255,0.25)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
}

const brodtext = {
  fontFamily: 'var(--font-body)',
  fontSize: 13,
  color: 'rgba(255,255,255,0.5)',
  lineHeight: 1.7,
  margin: 0,
}

/**
 * Ett pris i två delar, eller vilket annat fältvärde som helst.
 *
 * `visa` returnerar { kr, ursprung } för prisfälten och en sträng för
 * resten, så renderingen skiljer på dem här i stället för att varje
 * anropsställe ska behöva veta vilket fält som är ett pris.
 *
 * `staplat` lägger originalvalutan under kronbeloppet i stället för inom
 * parentes efter. Under de stora talen blir en parentes trång och drar
 * blicken fel; i en tabellrad är det tvärtom parentesen som håller ihop.
 */
function Falt({ varde, staplat = false, blek = 'rgba(255,255,255,0.3)' }) {
  if (!varde) return '—'
  if (typeof varde === 'string') return varde
  if (!varde.ursprung) return varde.kr

  if (staplat) {
    return (
      <>
        {varde.kr}
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 400, color: blek, marginTop: 3, letterSpacing: 0 }}>
          {varde.ursprung}
        </div>
      </>
    )
  }

  return (
    <>
      {varde.kr}{' '}
      <span style={{ color: blek, fontWeight: 400 }}>({varde.ursprung})</span>
    </>
  )
}

/** Ortbilden. Hotlänkade bilder optimeras inte — se lib/images.js. */
function Ortbild({ ort }) {
  const url = ort.image_url
    || 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200'

  return farOptimeras(url) ? (
    <Image src={url} alt={ort.name} fill priority sizes="50vw" style={{ objectFit: 'cover' }} />
  ) : (
    <img src={url} alt={ort.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  )
}

export default async function JamforPage({ params }) {
  const parSlug = (await params).par
  const par = await hamtaPar(parSlug)

  if (!par) notFound()

  // are-vs-solden och solden-vs-are är samma jämförelse. Den omvända
  // ordningen får en permanent vidarebefordran i stället för en egen sida
  // med identiskt innehåll — annars hade Google fått välja vilken av två
  // adresser som räknas.
  if (!par.kanonisk) permanentRedirect(`/jamfor/${par.kanoniskSlug}`)

  const kurser = await hamtaKurser()

  const orter = par.orter
  const [a, b] = orter

  // Tre meningar, inte alla. Resten av skillnaderna syns i talen ovanför
  // dem; en punktlista som upprepar tabellen är brus.
  const ingress = jamforelseMeningar(a, b, kurser).slice(0, 3).join(' ')

  const korsPar = arNordisk(a) !== arNordisk(b)

  // "Sverige" över båda bilderna säger ingenting när paret är Åre mot
  // Sälen. Landskapet skiljer dem åt; landet gör det bara när de ligger i
  // olika länder.
  const overskrift = (ort) =>
    a.country === b.country ? ort.region : land(ort.country)

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>

      <style>{`
        .jamfor-hjalte {
          display: grid;
          grid-template-columns: 1fr 1fr;
          height: 46vh;
          min-height: 300px;
        }
        .jamfor-tva { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .jamfor-rad {
          display: grid;
          grid-template-columns: 1fr 150px 1fr;
          align-items: center;
          gap: 10px;
          padding: 15px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .jamfor-rad:last-child { border-bottom: none; }
        .jamfor-tabell { width: 100%; border-collapse: collapse; }
        .jamfor-tabell td, .jamfor-tabell th {
          text-align: left;
          padding: 10px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .jamfor-detaljer summary {
          cursor: pointer;
          list-style: none;
          padding: 15px 20px;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          color: ${ACCENT};
          letter-spacing: 0.04em;
        }
        .jamfor-detaljer summary::-webkit-details-marker { display: none; }
        .jamfor-detaljer[open] summary { border-bottom: 1px solid rgba(255,255,255,0.06); }
        @media (max-width: 640px) {
          .jamfor-hjalte { height: 34vh; min-height: 200px; }
          .jamfor-tva { grid-template-columns: 1fr; }
          .jamfor-rad { grid-template-columns: 1fr 96px 1fr; padding: 13px 12px; gap: 6px; }
          .jamfor-tabell td, .jamfor-tabell th { padding: 9px 12px; }
        }
      `}</style>

      <SiteHeader />

      {/* ── Hjälten ──
          Två orter, två bilder. Sidan ska säga vad den handlar om innan
          man läst ett ord. */}
      <div className="jamfor-hjalte">
        {orter.map((ort) => (
          <div key={ort.slug} style={{ position: 'relative', overflow: 'hidden' }}>
            <Ortbild ort={ort} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(18,17,16,0.45) 0%, rgba(18,17,16,0.15) 40%, rgba(18,17,16,0.95) 100%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 clamp(14px, 3vw, 32px) 22px' }}>
              <p style={{ ...etikett, color: ACCENT, letterSpacing: '0.16em', marginBottom: 6 }}>{overskrift(ort)}</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(26px, 5vw, 52px)', fontWeight: 400, lineHeight: 1, color: '#f0ece4', letterSpacing: '0.02em', margin: 0 }}>{ort.name}</h2>
            </div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '44px clamp(20px, 4vw, 40px) 110px' }}>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(26px, 4.5vw, 40px)', fontWeight: 400, lineHeight: 1.1, color: '#f0ece4', letterSpacing: '0.02em', margin: 0 }}>
          {a.name} eller {b.name}?
        </h1>
        {ingress && <p style={{ ...brodtext, fontSize: 14.5, marginTop: 14 }}>{ingress}</p>}

        {/* ── Kort svar ──
            Tre tal, inte arton. Valda för att de avgör valet och för att
            de går att lita på — se HUVUDPUNKTER i lib/jamfor.js. */}
        <section style={{ marginTop: 40 }}>
          <div style={kort}>
            {HUVUDPUNKTER.map((punkt) => {
              const basta = bastaVardet(punkt, orter)
              return (
                <div key={punkt.etikett} className="jamfor-rad">
                  {orter.map((ort, i) => (
                    <div key={ort.slug} style={{ order: i === 0 ? 0 : 2, textAlign: i === 0 ? 'right' : 'left' }}>
                      <div style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(19px, 3.4vw, 27px)',
                        lineHeight: 1.1,
                        color: basta !== null && punkt.varde(ort) === basta ? ACCENT : 'rgba(255,255,255,0.55)',
                      }}><Falt varde={punkt.visa(ort, kurser)} staplat /></div>
                    </div>
                  ))}
                  <div style={{ order: 1, textAlign: 'center' }}>
                    <div style={{ ...etikett, lineHeight: 1.35 }}>{punkt.etikett}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 9.5, color: 'rgba(255,255,255,0.18)', marginTop: 2 }}>{punkt.enhet}</div>
                  </div>
                </div>
              )
            })}
          </div>
          <p style={{ ...brodtext, fontSize: 11.5, marginTop: 10, color: 'rgba(255,255,255,0.3)' }}>
            Veckan är en uppskattning per ort med resa, boende och liftkort —
            inte ett pris vi hämtat, och den varierar med vecka och arrangör.
            Kronbeloppen är omräknade från ortens egen valuta{' '}
            {kurser.farsk
              ? <>mot Europeiska centralbankens kurs den {skrivDatum(kurser.datum)}</>
              : <>mot en sparad kurs, eftersom centralbankens inte gick att nå</>}
            {' '}och avrundade till närmaste femtio. Beloppet inom parentes är
            det orten faktiskt tar betalt.
          </p>
        </section>

        {/* ── Vem orten passar ── */}
        <section style={{ marginTop: 48 }}>
          <h2 style={rubrik}>Vem orten passar</h2>
          <div style={{ ...kort, padding: '6px 20px 18px' }}>
            {PASSAR.map((rad) => (
              <div key={rad.etikett} style={{ marginTop: 16 }}>
                <div style={{ ...etikett, marginBottom: 8 }}>{rad.etikett}</div>
                {orter.map((ort) => {
                  const varde = ort[rad.falt]
                  const vinner = varde > orter.find((o) => o !== ort)?.[rad.falt]
                  return (
                    <div key={ort.slug} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'rgba(255,255,255,0.4)', minWidth: 84, flexShrink: 0 }}>{ort.name}</span>
                      <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 3, width: `${(varde || 0) * 10}%`, background: vinner ? ACCENT : 'rgba(255,255,255,0.22)' }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, fontWeight: 500, color: vinner ? ACCENT : 'rgba(255,255,255,0.45)', minWidth: 16, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{varde ?? '—'}</span>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
          <p style={{ ...brodtext, fontSize: 11.5, marginTop: 10, color: 'rgba(255,255,255,0.3)' }}>
            De fyra är redaktionella omdömen på en skala 1–10, inte mätvärden.
            Vad varje steg betyder står i poängskalan.
          </p>
        </section>

        {/* ── Resan ──
            Pist och liftar kan läsaren hitta var som helst; hur orten nås
            härifrån står ingen annanstans. */}
        <section style={{ marginTop: 48 }}>
          <h2 style={rubrik}>Resan från Sverige</h2>
          <div className="jamfor-tva">
            {orter.map((ort) => (
              <div key={ort.slug} style={{ ...kort, padding: '16px 18px' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 17, color: '#f0ece4', letterSpacing: '0.03em', marginBottom: 12 }}>{ort.name}</div>
                <div style={{ display: 'flex', gap: 20, marginBottom: ort.transport_info ? 12 : 0 }}>
                  <div>
                    <div style={{ ...etikett, marginBottom: 4 }}>Flyg till</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 500, color: '#f0ece4' }}>{ort.nearest_airport || '—'}</div>
                  </div>
                  <div>
                    <div style={{ ...etikett, marginBottom: 4 }}>Sista biten</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 500, color: '#f0ece4' }}>{restid(ort)}</div>
                  </div>
                </div>
                {ort.transport_info && <p style={{ ...brodtext, fontSize: 12 }}>{ort.transport_info}</p>}
              </div>
            ))}
          </div>

          {korsPar && (
            <p style={{ ...brodtext, fontSize: 11.5, marginTop: 10, color: 'rgba(255,255,255,0.3)' }}>
              Sista biten mäter bara sträckan från flygplatsen och går inte att
              ställa mot varandra över gränsen mellan Norden och Alperna — den
              nordiska orten nås ofta med bil eller nattåg utan att man flyger
              alls. Läs styckena, inte klockslagen.
            </p>
          )}
        </section>

        {/* ── Alla siffror ──
            Hopfälld. Den är för den som vill kontrollera, inte för den som
            ska välja. Tabellen tar N orter, inte exakt två. */}
        <section style={{ marginTop: 48 }}>
          <details className="jamfor-detaljer" style={{ ...kort }}>
            <summary>Alla siffror, fält för fält →</summary>
            <div style={{ overflowX: 'auto' }}>
              <table className="jamfor-tabell">
                <thead>
                  <tr>
                    <th style={{ ...etikett, fontWeight: 500 }}>Fält</th>
                    {orter.map((ort) => (
                      <th key={ort.slug} style={{ fontFamily: 'var(--font-heading)', fontSize: 15, color: '#f0ece4', letterSpacing: '0.04em', fontWeight: 400 }}>{ort.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {GRUPPER.map((grupp) => (
                    <Fragmentgrupp key={grupp.rubrik} grupp={grupp} orter={orter} kurser={kurser} />
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </section>

        {/* ── Vidare ── */}
        <section style={{ marginTop: 48 }}>
          <div className="jamfor-tva">
            {orter.map((ort) => (
              <Link key={ort.slug} href={`/resort/${ort.slug}`} style={{ ...kort, padding: '16px 18px', textDecoration: 'none', display: 'block' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 17, color: '#f0ece4', letterSpacing: '0.03em', marginBottom: 3 }}>{ort.name}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>{ort.region} · {land(ort.country)}</div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: ACCENT, letterSpacing: '0.04em' }}>Hela sidan om {ort.name} →</span>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <Link href="/jamfor" style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}>← Välj två andra orter</Link>
          </div>
        </section>

        {/* Källan står på sidan som bär siffrorna, inte bara på about. */}
        <p style={{ ...brodtext, fontSize: 11.5, marginTop: 44, color: 'rgba(255,255,255,0.28)' }}>
          Pist, liftar, höjder och liftkortspriser är hämtade från
          skiresort.com för båda orterna — blandade källor gör orter
          ojämförbara. Talen avser hela det sammankopplade skidområdet, det
          liftkortet ger tillgång till, inte bara byns egen sektor.
        </p>

      </div>

      <SiteFooter />
    </div>
  )
}

/** En rubrikrad följd av gruppens fält. */
function Fragmentgrupp({ grupp, orter, kurser }) {
  return (
    <>
      <tr>
        <td colSpan={orter.length + 1} style={{ background: 'rgba(255,255,255,0.02)' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{grupp.rubrik}</span>
        </td>
      </tr>
      {grupp.falt.map((falt) => {
        const basta = bastaVardet(falt, orter)
        return (
          <tr key={falt.etikett}>
            <td style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{falt.etikett}</td>
            {orter.map((ort) => {
              const vinnare = basta !== null && falt.varde(ort) === basta
              return (
                <td key={ort.slug} style={{
                  fontFamily: 'var(--font-body)', fontSize: 13,
                  fontWeight: vinnare ? 600 : 500,
                  color: vinnare ? ACCENT : '#f0ece4',
                  fontVariantNumeric: 'tabular-nums',
                }}><Falt varde={falt.visa(ort, kurser)} blek="rgba(255,255,255,0.28)" /></td>
              )
            })}
          </tr>
        )
      })}
    </>
  )
}
