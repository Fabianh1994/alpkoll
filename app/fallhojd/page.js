import Link from 'next/link'
import Tabell from './Tabell'
import SiteHeader from '../SiteHeader'
import SiteFooter from '../SiteFooter'
import { getResorts } from '../../lib/resorts'
import { SITE_URL } from '../../lib/lang'
import { land } from '../../lib/countries'
import { DELOMRADEN, antalOrd, brantasteDelen, fallhojd, pistadeDelar, spannMening, tal } from '../../lib/delomraden'

// Fallhöjd och höjd över havet för alla orter.
//
// Sidan finns för att det är så folk söker. Search Console 24 oktober–20
// november 2026: "fallhöjd sälen", "trysil fallhöjd", "fallhöjd åre",
// "hemsedal fallhöjd" och "zermatt höjd över havet" var de vanligaste
// frågorna, med runt 20 exponeringar var och inga klick. Till Sälen kom
// "fallhöjd lindvallen", "hundfjället fallhöjd" och "tandådalen
// fallhöjd", som ortsidan inte svarar på i titeln. Därför står Sälens
// områden både i tabellen och i text längre ner.
//
// Talen räknas med fallhojd() i lib/delomraden.js, samma funktion som
// ortsidorna och jämförelserna, så att sidorna inte kan visa olika tal.

// Samma intervall som ortsidorna. En rättad höjd i Supabase slår igenom
// här inom en timme, utan ny deploy.
export const revalidate = 3600

// Orterna beskrivningen nämner: de fyra svenskar oftast söker fallhöjd på.
const SOKTA = ['are', 'salen', 'trysil', 'hemsedal']

export async function generateMetadata() {
  const orter = await getResorts()
  const sokta = orter
    .filter((o) => SOKTA.includes(o.slug))
    .sort((a, b) => fallhojd(b) - fallhojd(a))
    .map((o) => `${o.name} ${tal(fallhojd(o))} m`)

  const titel = `Fallhöjd för ${orter.length} skidorter i Norden och Alperna | Alpkoll`
  const beskrivning =
    (sokta.length ? `${sokta.join(', ')}. ` : '') +
    `Fallhöjd och höjd över havet för ${orter.length} skidorter i Norden, Alperna och Andorra, ` +
    'i en tabell du kan sortera.'
  const url = `${SITE_URL}/fallhojd`

  return {
    title: titel,
    description: beskrivning,
    alternates: { canonical: url },
    openGraph: {
      title: titel,
      description: beskrivning,
      url,
      siteName: 'Alpkoll',
      type: 'article',
      locale: 'sv_SE',
      images: ['/og-image.png'],
    },
    twitter: { card: 'summary_large_image', title: titel, description: beskrivning, images: ['/og-image.png'] },
  }
}

const ACCENT = '#D4A574'
const kort = { background: '#1c1a17', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }
const etikett = {
  fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500,
  color: 'rgba(255,255,255,0.52)', letterSpacing: '0.12em', textTransform: 'uppercase',
}
const brodtext = {
  fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.75,
  color: 'rgba(255,255,255,0.62)', maxWidth: 660,
}
const h2 = {
  fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 400,
  letterSpacing: '0.04em', margin: '0 0 14px',
}

// Filtret går på det engelska landsfältet, inte på den översatta
// etiketten. Andorra hör inte till Alperna och syns under Alla.
const OMRADE = {
  Sweden: 'sverige', Norway: 'norge', Finland: 'finland',
  Austria: 'alperna', France: 'alperna', Italy: 'alperna', Switzerland: 'alperna',
}

// Landen i inledningen, i den ordning läsaren tänker på dem.
const LANDEN = [
  { id: 'sverige', i: 'i Sverige' },
  { id: 'norge', i: 'i Norge' },
  { id: 'finland', i: 'i Finland' },
  { id: 'alperna', i: 'i Alperna' },
]

/** "A", "A och B", "A, B och C". */
function uppraknat(namn) {
  if (namn.length < 2) return namn[0] || ''
  return `${namn.slice(0, -1).join(', ')} och ${namn[namn.length - 1]}`
}

/** Orterna med störst fallhöjd i ett område. Orter i samma skidområde delar tal och står ihop. */
function storst(orter) {
  if (!orter.length) return null
  const max = Math.max(...orter.map(fallhojd).filter(Number.isFinite))
  if (!Number.isFinite(max)) return null
  return { orter: orter.filter((o) => fallhojd(o) === max), meter: max }
}

export default async function Fallhojd() {
  const orter = await getResorts()

  // Bara det tabellen behöver går till webbläsaren, inte hela ortraden.
  const rader = orter.map((ort) => {
    const delar = pistadeDelar(ort)
    const brantast = brantasteDelen(ort)
    return {
      slug: ort.slug,
      namn: ort.name,
      land: land(ort.country),
      omrade: OMRADE[ort.country] || null,
      skidomrade: ort.ski_area && ort.ski_area !== ort.name ? ort.ski_area : null,
      fallhojd: Number.isFinite(fallhojd(ort)) ? fallhojd(ort) : null,
      bas: ort.altitude_base,
      topp: ort.altitude_top,
      km: ort.total_pistes_km,
      brantast: brantast ? brantast.namn : null,
      delar: delar.map((d) => ({
        namn: d.namn,
        fallhojd: d.utanDalnedfart ? null : d.topp - d.bas,
        bas: d.bas,
        topp: d.topp,
        km: d.pist_km,
      })),
    }
  })

  // Inledningen räknas ur samma tal som tabellen, så att den inte kan
  // säga något annat än raderna under den.
  const perLand = LANDEN
    .map((l) => ({ ...l, ...storst(orter.filter((o) => OMRADE[o.country] === l.id)) }))
    .filter((l) => l.orter)
  const [forsta, ...ovriga] = perLand

  // Orterna som består av flera områden, Sälen först: den har flest
  // sökningar på sina delar.
  const flera = orter
    .filter((o) => DELOMRADEN[o.slug])
    .sort((a, b) => (b.slug === 'salen') - (a.slug === 'salen') || a.name.localeCompare(b.name, 'sv'))

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>
      <SiteHeader />

      <main style={{ padding: '120px clamp(20px, 4vw, 64px) 100px', maxWidth: 1100, margin: '0 auto' }}>

        <p style={{ ...etikett, color: ACCENT, marginBottom: 14 }}>Fallhöjd och höjd över havet</p>
        <h1 style={{
          fontFamily: 'var(--font-heading)', fontSize: 'clamp(34px, 6vw, 56px)', fontWeight: 400,
          letterSpacing: '0.03em', lineHeight: 1.05, margin: '0 0 22px',
        }}>
          Fallhöjd i skidorterna
        </h1>

        {forsta && (
          <p style={{ ...brodtext, margin: '0 0 16px' }}>
            Störst fallhöjd {forsta.i} har{' '}
            {forsta.orter.map((o, i) => (
              <span key={o.slug}>
                {i > 0 && (i === forsta.orter.length - 1 ? ' och ' : ', ')}
                <Link href={`/resort/${o.slug}`} style={{ color: ACCENT, textDecoration: 'none' }}>{o.name}</Link>
              </span>
            ))}
            , {tal(forsta.meter)} meter.{' '}
            {ovriga.map((l, i) => (
              <span key={l.id}>
                {i === 0
                  ? `I ${l.i.replace(/^i /, '')} har ${uppraknat(l.orter.map((o) => o.name))} störst fallhöjd`
                  : `${i === ovriga.length - 1 ? ', och i' : ', i'} ${l.i.replace(/^i /, '')} ${uppraknat(l.orter.map((o) => o.name))}`}
                , {tal(l.meter)} meter
              </span>
            ))}
            {ovriga.length > 0 && '.'}
          </p>
        )}

        <p style={{ ...brodtext, margin: '0 0 40px' }}>
          Fallhöjden är skillnaden mellan högsta och lägsta punkt i samma skidområde.
          Höjderna står i meter över havet. Orter som delar skidområde, som de tre i
          Les 3 Vallées, visar samma tal. Där en ort är flera områden som inte hänger
          ihop med lift gäller fallhöjden det område som har störst fallhöjd, och alla
          områden står under orten.
        </p>

        <Tabell rader={rader} />

        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 12.5, lineHeight: 1.7,
          color: 'rgba(255,255,255,0.57)', margin: '0 0 60px',
        }}>
          Alla tal kommer från skiresort.com, samma källa för alla orter, så att de
          går att ställa bredvid varandra. Orternas egen marknadsföring anger ofta
          högre tal.
        </p>

        {/* ── Orter med flera områden ──
            Står i löptext och inte bara i tabellen, eftersom det är här
            frågorna om Lindvallen, Hundfjället och Tandådalen får sitt svar. */}
        {flera.length > 0 && (
          <section style={{ marginBottom: 60 }}>
            <h2 style={h2}>Orter med flera områden</h2>
            <div style={{ display: 'grid', gap: 8 }}>
              {flera.map((ort) => {
                const delar = pistadeDelar(ort)
                return (
                  <div key={ort.slug} style={{ ...kort, padding: '16px 18px' }}>
                    <Link href={`/resort/${ort.slug}`} style={{
                      fontFamily: 'var(--font-body)', fontSize: 14.5, fontWeight: 600,
                      color: ACCENT, textDecoration: 'none',
                    }}>Fallhöjd i {ort.name}</Link>
                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.7,
                      color: 'rgba(255,255,255,0.6)', margin: '6px 0 0',
                    }}>
                      {ort.name} är {antalOrd(delar.length)} områden.{' '}
                      {delar.map((d) => (d.utanDalnedfart
                        ? `${d.namn} ligger ${tal(d.bas)}–${tal(d.topp)} m över havet, men där går ingen nedfart hela vägen till dalen.`
                        : `${d.namn} har ${tal(d.topp - d.bas)} m fallhöjd, ${tal(d.bas)}–${tal(d.topp)} m över havet.`
                      )).join(' ')}{' '}
                      {DELOMRADEN[ort.slug].forbindelse}{spannMening(ort) ? ` ${spannMening(ort)}` : ''}
                    </p>
                    {ort.slug === 'salen' && (
                      <p style={{
                        fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.7,
                        color: 'rgba(255,255,255,0.6)', margin: '8px 0 0',
                      }}>
                        Vilket område som passar dig står i{' '}
                        <Link href="/var-bo-i-salen" style={{ color: ACCENT, textDecoration: 'none' }}>Var ska man bo i Sälen? ›</Link>
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        <section style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)' }}>
          <h2 style={{ ...h2, fontSize: 22 }}>Jämför två orter</h2>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.75,
            color: 'rgba(255,255,255,0.55)', margin: 0,
          }}>
            Två orter sida vid sida, med fallhöjd, pist, liftkort och resväg:{' '}
            <Link href="/jamfor" style={{ color: ACCENT, textDecoration: 'none' }}>Jämför ›</Link>
          </p>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.75,
            color: 'rgba(255,255,255,0.55)', margin: '8px 0 0',
          }}>
            Vad liftkortet kostar på varje ort:{' '}
            <Link href="/liftkortspriser" style={{ color: ACCENT, textDecoration: 'none' }}>Liftkortspriser ›</Link>
          </p>
        </section>

      </main>

      <SiteFooter />
    </div>
  )
}
