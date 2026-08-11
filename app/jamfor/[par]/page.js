import { notFound, permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import SiteHeader from '../../SiteHeader'
import SiteFooter from '../../SiteFooter'
import { getResort, getResortSlugs } from '../../../lib/resorts'
import { SITE_URL } from '../../../lib/lang'
import { land } from '../../../lib/countries'
import { restid } from '../../../lib/travel'
import {
  GRUPPER,
  arNordisk,
  jamforelseMeningar,
  parSlugsFor,
  tolkaPar,
} from '../../../lib/jamfor'

// Samma intervall som ortsidorna. En rättad siffra i Supabase slår
// igenom på jämförelsesidan inom en timme, utan ny deploy.
export const revalidate = 3600

export async function generateStaticParams() {
  const publicerade = await getResortSlugs()
  return parSlugsFor(publicerade).map((par) => ({ par }))
}

/** Paret som två orter, eller null när adressen inte ska ha en sida. */
async function hamtaPar(parSlug) {
  const tolkat = tolkaPar(parSlug)
  if (!tolkat) return null

  const orter = await Promise.all(tolkat.slugs.map((slug) => getResort(slug)))
  // En dold ort ger null här. Paret står i koden, publiceringen i
  // databasen — går de isär ska sidan försvinna, inte krascha.
  if (orter.some((ort) => !ort)) return null

  return { ...tolkat, orter }
}

export async function generateMetadata({ params }) {
  const parSlug = (await params).par
  const par = await hamtaPar(parSlug)

  if (!par) return { title: 'Jämförelsen hittades inte — Alpkoll' }

  // Metadata beskriver alltid den kanoniska sidan. Den omvända adressen
  // svarar med en vidarebefordran och visar aldrig den här titeln.
  const [a, b] = par.kanonisk ? par.orter : [...par.orter].reverse()

  const title = `${a.name} eller ${b.name}? Jämförelse | Alpkoll`
  const description = `${a.name} mot ${b.name}: ${a.total_pistes_km} km pist mot ${b.total_pistes_km}, ${a.total_lifts} liftar mot ${b.total_lifts}, veckokort €${a.lift_pass_week_eur} mot €${b.lift_pass_week_eur}. Samma källa för båda orterna.`
  const url = `${SITE_URL}/jamfor/${par.kanoniskSlug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Alpkoll',
      type: 'article',
      locale: 'sv_SE',
      images: ['/og-image.png'],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/og-image.png'] },
  }
}

/**
 * Värdet att märka ut i en rad, eller null.
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
  marginBottom: 18,
}

const etikett = {
  fontFamily: 'var(--font-body)',
  fontSize: 10,
  color: 'rgba(255,255,255,0.25)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 5,
}

const brodtext = {
  fontFamily: 'var(--font-body)',
  fontSize: 13,
  color: 'rgba(255,255,255,0.5)',
  lineHeight: 1.7,
  margin: 0,
}

export default async function JamforPage({ params }) {
  const parSlug = (await params).par
  const par = await hamtaPar(parSlug)

  if (!par) notFound()

  // are-vs-solden och solden-vs-are är samma jämförelse. Den omvända
  // ordningen får en permanent vidarebefordran i stället för en egen
  // sida med identiskt innehåll — annars hade Google fått välja vilken
  // av två adresser som räknas.
  if (!par.kanonisk) permanentRedirect(`/jamfor/${par.kanoniskSlug}`)

  const orter = par.orter
  const [a, b] = orter
  const meningar = jamforelseMeningar(a, b)

  // Ett kors-par ställer Norden mot Alperna. Då är restiden från
  // flygplatsen inte jämförbar mellan kolumnerna, och det måste stå
  // på sidan — inte bara i koden.
  const korsPar = arNordisk(a) !== arNordisk(b)

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>

      <style>{`
        .jamfor-tva {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .jamfor-tabell {
          width: 100%;
          border-collapse: collapse;
        }
        .jamfor-tabell td, .jamfor-tabell th {
          text-align: left;
          padding: 11px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        @media (max-width: 640px) {
          .jamfor-tva { grid-template-columns: 1fr; }
          .jamfor-tabell td, .jamfor-tabell th { padding: 10px 12px; }
        }
      `}</style>

      <SiteHeader />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '110px clamp(20px, 4vw, 40px) 120px' }}>

        <Link href="/jamfor" style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}>← Alla jämförelser</Link>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, color: '#D4A574', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '28px 0 10px' }}>
          {land(a.country)} mot {land(b.country)}
        </p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(34px, 7vw, 64px)', fontWeight: 400, lineHeight: 1, color: '#f0ece4', letterSpacing: '0.02em', margin: 0 }}>
          {a.name} eller {b.name}?
        </h1>
        <p style={{ ...brodtext, fontSize: 14, marginTop: 18, maxWidth: 620 }}>
          Båda orternas siffror kommer ur samma källa och avser hela det
          sammankopplade skidområdet. Det gör dem jämförbara — vilket de
          inte är när man läser två orters egna webbplatser.
        </p>

        {/* ── Resan från Sverige ──
            Överst med flit. Pist och liftar kan läsaren hitta var som
            helst; hur orten nås härifrån står ingen annanstans. */}
        <section style={{ marginTop: 56 }}>
          <h2 style={rubrik}>Resan från Sverige</h2>
          <div className="jamfor-tva">
            {orter.map((ort) => (
              <div key={ort.slug} style={{ ...kort, padding: '18px 20px' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 19, color: '#f0ece4', letterSpacing: '0.03em', marginBottom: 16 }}>{ort.name}</div>
                <div style={{ display: 'flex', gap: 24, marginBottom: ort.transport_info ? 16 : 0 }}>
                  <div>
                    <div style={etikett}>Flyg till</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: '#f0ece4' }}>{ort.nearest_airport || '—'}</div>
                  </div>
                  <div>
                    <div style={etikett}>Från flygplatsen</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: '#f0ece4' }}>{restid(ort)}</div>
                  </div>
                </div>
                {ort.transport_info && (
                  <p style={{ ...brodtext, fontSize: 12.5 }}>{ort.transport_info}</p>
                )}
              </div>
            ))}
          </div>

          {korsPar && (
            <div style={{ background: 'rgba(212,165,116,0.06)', border: '1px solid rgba(212,165,116,0.15)', borderLeft: '3px solid #D4A574', borderRadius: '0 10px 10px 0', padding: '14px 18px', marginTop: 12 }}>
              <p style={{ ...brodtext, fontSize: 12.5 }}>
                Restiden ovan mäter bara sträckan från flygplatsen till orten,
                och går inte att jämföra rakt av mellan Norden och Alperna:
                den nordiska orten nås ofta med bil eller nattåg utan att man
                flyger alls. Läs styckena, inte klockslagen.
              </p>
            </div>
          )}
        </section>

        {/* ── Meningarna ──
            Härledda ur fälten i lib/jamfor.js, inte skrivna för paret.
            Se kommentaren där om varför. */}
        {meningar.length > 0 && (
          <section style={{ marginTop: 56 }}>
            <h2 style={rubrik}>Skillnaden i korthet</h2>
            <div style={{ ...kort, padding: '8px 22px 18px' }}>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {meningar.map((mening) => (
                  <li key={mening} style={{ display: 'flex', gap: 12, paddingTop: 14 }}>
                    <span aria-hidden="true" style={{ color: '#D4A574', lineHeight: 1.7 }}>·</span>
                    <p style={brodtext}>{mening}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ── Tabellen ──
            Byggd för N orter, inte för exakt två. En väljare för tre
            orter blir då en fråga om urval, inte om att skriva om den. */}
        <section style={{ marginTop: 56 }}>
          <h2 style={rubrik}>Alla siffror</h2>
          <div style={{ ...kort, overflowX: 'auto' }}>
            <table className="jamfor-tabell">
              <thead>
                <tr>
                  <th style={{ ...etikett, marginBottom: 0, fontWeight: 500 }}>Fält</th>
                  {orter.map((ort) => (
                    <th key={ort.slug} style={{ fontFamily: 'var(--font-heading)', fontSize: 16, color: '#f0ece4', letterSpacing: '0.04em', fontWeight: 400 }}>{ort.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GRUPPER.map((grupp) => (
                  <Fragmentgrupp key={grupp.rubrik} grupp={grupp} orter={orter} />
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ ...brodtext, fontSize: 12, marginTop: 12 }}>
            Markerat värde är det bättre — men bara på raderna där ett håll
            faktiskt är bättre. Lägsta höjden, pistfördelningen och konstsnön
            står omarkerade: mer blå pist är en fördel för nybörjaren och en
            nackdel för den som vill ha brant, och vem som läser vet vi inte.
            Snöfallet står omarkerat av ett annat skäl — vi har inte mätt det
            fältet mot källan än.
          </p>
        </section>

        {/* ── Vidare ── */}
        <section style={{ marginTop: 56 }}>
          <h2 style={rubrik}>Läs mer om orterna</h2>
          <div className="jamfor-tva">
            {orter.map((ort) => (
              <Link key={ort.slug} href={`/resort/${ort.slug}`} style={{ ...kort, padding: '18px 20px', textDecoration: 'none', display: 'block' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 19, color: '#f0ece4', letterSpacing: '0.03em', marginBottom: 4 }}>{ort.name}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>{ort.region} · {land(ort.country)}</div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: '#D4A574', letterSpacing: '0.04em' }}>Hela sidan om {ort.name} →</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Källan står på sidan som bär siffrorna, inte bara på about. */}
        <p style={{ ...brodtext, fontSize: 12, marginTop: 40, color: 'rgba(255,255,255,0.3)' }}>
          Pist, liftar, höjder och liftkortspriser är hämtade från
          skiresort.com för båda orterna, eftersom blandade källor gör orter
          ojämförbara. Talen avser hela det sammankopplade skidområdet — det
          liftkortet ger tillgång till — inte bara byns egen sektor.
          Veckokostnaden är en uppskattning per ort och varierar med vecka,
          boende och arrangör.
        </p>

      </div>

      <SiteFooter />
    </div>
  )
}

/** En rubrikrad följd av gruppens fält. */
function Fragmentgrupp({ grupp, orter }) {
  return (
    <>
      <tr>
        <td colSpan={orter.length + 1} style={{ background: 'rgba(255,255,255,0.02)' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600, color: '#D4A574', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{grupp.rubrik}</span>
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
                  fontFamily: 'var(--font-body)', fontSize: 13.5,
                  fontWeight: vinnare ? 600 : 500,
                  color: vinnare ? '#D4A574' : '#f0ece4',
                  fontVariantNumeric: 'tabular-nums',
                }}>{falt.visa(ort) || '—'}</td>
              )
            })}
          </tr>
        )
      })}
    </>
  )
}
