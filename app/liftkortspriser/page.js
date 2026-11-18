import Link from 'next/link'
import Tabell from './Tabell'
import SiteHeader from '../SiteHeader'
import SiteFooter from '../SiteFooter'
import { getResorts } from '../../lib/resorts'
import { SITE_URL } from '../../lib/lang'
import { land } from '../../lib/countries'
import { pris, kronorTal, perSkiddag, talet } from '../../lib/pris'
import { hamtaKurser, skrivDatum } from '../../lib/valuta'
import { DEFINITION, VERIFIERADE, UTAN_PRIS, LIFTKORT, STORRE_KORT, harPris, kortKm } from '../../lib/liftkortspriser'

// Samma intervall som ortsidorna. Ett rättat pris i Supabase slår igenom
// här inom en timme, utan ny deploy.
export const revalidate = 3600

const SASONG = '2026/2027'

const titel = `Liftkortspriser ${SASONG} — vad sex skiddagar kostar | Alpkoll`
const beskrivning =
  'Sexdagarspriset för liftkort i Alperna, Andorra och Norden, i kronor, hämtat från ' +
  'varje orts egen prislista. Samma definition för alla orter.'

export const metadata = {
  title: titel,
  description: beskrivning,
  alternates: { canonical: `${SITE_URL}/liftkortspriser` },
  openGraph: {
    title: titel,
    description: beskrivning,
    url: `${SITE_URL}/liftkortspriser`,
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

export default async function Liftkortspriser() {
  const [orter, kurser] = await Promise.all([getResorts(), hamtaKurser()])

  // Bara orter vi kan stå för — se lib/liftkortspriser.js. Orter som bär
  // värden som aldrig hämtats visas inte med pris.
  const rader = orter
    .filter(harPris)
    .map((ort) => {
      const valuta = ort.lift_pass_currency || 'EUR'
      const tal = kronorTal(ort.lift_pass_week_eur, valuta, kurser)
      const km = kortKm(ort)
      const stort = STORRE_KORT[ort.slug]
      const stortTal = stort ? kronorTal(stort.vecka, stort.valuta, kurser) : null
      return {
        ort,
        meta: VERIFIERADE[ort.slug],
        kortnamn: LIFTKORT[ort.slug]?.namn || null,
        dag: pris(ort.lift_pass_day_eur, valuta, kurser),
        dagTal: kronorTal(ort.lift_pass_day_eur, valuta, kurser),
        pris: pris(ort.lift_pass_week_eur, valuta, kurser),
        tal,
        perDag: perSkiddag(tal),
        km,
        kmText: km ? `${talet(km)} km` : null,
        perKm: km && tal ? Math.round(tal / km) : null,
        stort: stort && stortTal
          ? {
              namn: stort.namn,
              galler: stort.galler,
              km: stort.km,
              kmText: stort.km ? `${talet(stort.km)} km` : null,
              dag: pris(stort.dag, stort.valuta, kurser),
              pris: pris(stort.vecka, stort.valuta, kurser),
              perDag: perSkiddag(stortTal),
              perKm: stort.km && stort.perKm !== false ? Math.round(stortTal / stort.km) : null,
            }
          : null,
      }
    })
    .filter((r) => r.pris && Number.isFinite(r.tal))
    .sort((a, b) => a.tal - b.tal)

  // Bara det tabellen behöver går till webbläsaren, inte hela ortraden.
  const tabellrader = rader.map((r) => ({
    slug: r.ort.slug,
    namn: r.ort.name,
    land: land(r.ort.country),
    sasong: r.meta.sasong,
    kortnamn: r.kortnamn,
    dag: r.dag,
    dagTal: r.dagTal,
    pris: r.pris,
    tal: r.tal,
    perDag: r.perDag,
    km: r.km,
    kmText: r.kmText,
    perKm: r.perKm,
    stort: r.stort,
  }))

  const utan = orter
    .filter((ort) => UTAN_PRIS[ort.slug])
    .map((ort) => ({ ort, ...UTAN_PRIS[ort.slug] }))
    .sort((a, b) => a.ort.name.localeCompare(b.ort.name, 'sv'))

  const billigast = rader[0]
  const dyrast = rader[rader.length - 1]

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>
      <SiteHeader />

      <main style={{ padding: '120px clamp(20px, 4vw, 64px) 100px', maxWidth: 1100, margin: '0 auto' }}>

        <p style={{ ...etikett, color: ACCENT, marginBottom: 14 }}>Säsongen {SASONG}</p>
        <h1 style={{
          fontFamily: 'var(--font-heading)', fontSize: 'clamp(34px, 6vw, 56px)', fontWeight: 400,
          letterSpacing: '0.03em', lineHeight: 1.05, margin: '0 0 22px',
        }}>
          Vad kostar sex skiddagar?
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.75,
          color: 'rgba(255,255,255,0.62)', maxWidth: 660, margin: '0 0 16px',
        }}>
          Dagskort, sex dagar och pris per kilometer pist, i kronor, för{' '}
          {rader.length} skidorter i Alperna, Andorra och Norden — och det större kortet där
          orten ingår i ett. Varje pris är hämtat från ortens egen prislista, inte från en
          sammanställning — och alla avser samma sak, så att talen går att ställa
          bredvid varandra.
        </p>

        {billigast && dyrast && (
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.75,
            color: 'rgba(255,255,255,0.62)', maxWidth: 660, margin: '0 0 40px',
          }}>
            Spannet går från{' '}
            <Link href={`/resort/${billigast.ort.slug}`} style={{ color: ACCENT, textDecoration: 'none' }}>
              {billigast.ort.name}
            </Link>{' '}
            på {billigast.pris.kr} till{' '}
            <Link href={`/resort/${dyrast.ort.slug}`} style={{ color: ACCENT, textDecoration: 'none' }}>
              {dyrast.ort.name}
            </Link>{' '}
            på {dyrast.pris.kr} — innan resa och boende är räknade.
          </p>
        )}

        {/* ── Tabellen ──
            Sorterad på kronbeloppet, inte på namn. Den som läser en prislista
            vill veta vad som är billigt, och ordningen är svaret. */}
        <Tabell rader={tabellrader} />

        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 12.5, lineHeight: 1.7,
          color: 'rgba(255,255,255,0.57)', margin: '0 0 60px',
        }}>
          Per km är sexdagarspriset delat med hur många kilometer pist kortet ger.
          Per dag är sexdagarspriset delat med sex. Större kort står med en pil under
          orten och räknas inte in i ordningen.{' '}
          Kronbeloppet är omräknat mot Europeiska centralbankens kurs den{' '}
          {skrivDatum(kurser.datum)} och avrundat till närmaste femtio. Ortens eget
          belopp står under. Raderna märkta{' '}
          <strong style={{ color: 'rgba(255,255,255,0.5)' }}>25/26</strong> avser förra
          säsongen — orten har inte publicerat årets pris än.
        </p>

        {/* ── Noteringar per ort ──
            Bara de orter som har något att säga får en rad här. Att skriva
            en mening om alla trettio hade dränkt de fem som betyder något. */}
        {rader.some((r) => r.meta.not) && (
          <section style={{ marginBottom: 60 }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 400,
              letterSpacing: '0.04em', margin: '0 0 18px',
            }}>Värt att veta om enskilda priser</h2>
            <div style={{ display: 'grid', gap: 8 }}>
              {rader.filter((r) => r.meta.not).map((rad) => (
                <div key={rad.ort.slug} style={{ ...kort, padding: '14px 18px' }}>
                  <Link href={`/resort/${rad.ort.slug}`} style={{
                    fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600,
                    color: ACCENT, textDecoration: 'none',
                  }}>{rad.ort.name}</Link>
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: 13.5, lineHeight: 1.65,
                    color: 'rgba(255,255,255,0.55)',
                  }}> — {rad.meta.not}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Orter utan pris ──
            Frånvaron är innehåll, inte ett hål. Den som undrar varför en ort
            saknas ska få veta det, och skälet är ofta att det är för tidigt. */}
        {utan.length > 0 && (
          <section style={{ marginBottom: 60 }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 400,
              letterSpacing: '0.04em', margin: '0 0 12px',
            }}>{utan.length} orter saknar pris — och varför</h2>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 14.5, lineHeight: 1.7,
              color: 'rgba(255,255,255,0.5)', maxWidth: 660, margin: '0 0 20px',
            }}>
              Vi publicerar hellre ingen siffra än en vi inte kan belägga. Skälet
              står utskrivet för varje ort.
            </p>
            <div style={{ display: 'grid', gap: 8 }}>
              {utan.map(({ ort, skal, typ }) => (
                <div key={ort.slug} style={{ ...kort, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
                    <Link href={`/resort/${ort.slug}`} style={{
                      fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
                      color: '#f0ece4', textDecoration: 'none',
                    }}>{ort.name}</Link>
                    <span style={{ ...etikett, fontSize: 9.5 }}>
                      {typ === 'omrade' ? 'Frågan om området' : typ === 'kalla' ? 'Ingen prislista' : 'Inte publicerat än'}
                    </span>
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: 13.5, lineHeight: 1.65,
                    color: 'rgba(255,255,255,0.5)', margin: '8px 0 0',
                  }}>{skal}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Metod ──
            Står på sidan som bär siffrorna, inte bara på about. Den som ska
            lita på ett pris ska kunna se vad det avser utan att leta. */}
        <section style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 400,
            letterSpacing: '0.04em', margin: '0 0 14px',
          }}>Så är priserna hämtade</h2>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.75,
            color: 'rgba(255,255,255,0.55)', margin: '0 0 12px',
          }}>{DEFINITION}</p>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.75,
            color: 'rgba(255,255,255,0.55)', margin: '0 0 12px',
          }}>
            Flera orter säljer både sammanhängande och valfria dagar, och skillnaden
            kan vara över tio procent. Talen här avser sammanhängande dagar överallt.
            Där orten säljer flera kort räknar vi på det som motsvarar den pist ortens
            sida på Alpkoll redovisar. Ett större regionkort står på en egen rad under
            orten, med sitt eget pris per kilometer. Där veckokortet bara finns som
            dalkort, som i Zillertal, står kortets namn under orten och kilometrarna
            är kortets.
          </p>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.75,
            color: 'rgba(255,255,255,0.55)', margin: 0,
          }}>
            Priset betalas i ortens egen valuta och lagras så. Kronbeloppet räknas om
            vid visning mot dagens ECB-kurs, så att en kursrörelse aldrig ser ut som
            en prishöjning. Kontrollera alltid hos orten innan du bokar — flera
            prissätter dynamiskt.
          </p>
        </section>

      </main>

      <SiteFooter />
    </div>
  )
}
