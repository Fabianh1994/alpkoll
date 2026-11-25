import { notFound } from 'next/navigation'
import Link from 'next/link'
import SiteHeader from '../../SiteHeader'
import SiteFooter from '../../SiteFooter'
import Flagga from '../../Flagga'
import { getResorts } from '../../../lib/resorts'
import { SITE_URL } from '../../../lib/lang'
import { harPris } from '../../../lib/liftkortspriser'
import { pris, kronorTal } from '../../../lib/pris'
import { hamtaKurser } from '../../../lib/valuta'
import { bilresa, timmar } from '../../../lib/restider'
import { nattagFor } from '../../../lib/nattaget'
import { fallhojd } from '../../../lib/delomraden'
import { indexeradeParFor } from '../../../lib/jamfor'
import { AR } from '../../../lib/sportlov'
import { LANDSIDOR, landsidaFor } from '../../../lib/landsidor'

// Skidorter i ett land — se lib/landsidor.js för varför sidan finns.
//
// Allt med tal räknas fram här ur samma orter som resten av sajten. "Kort
// svar" pekar ut en ort per fråga; vid lika värden vinner den som står
// först i bokstavsordning, så att svaret inte hoppar mellan två orter från
// en timme till nästa.

export const revalidate = 3600
export const dynamicParams = false

export function generateStaticParams() {
  return LANDSIDOR.map((l) => ({ land: l.slug }))
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

const tal = (v) => (Number.isFinite(Number(v)) && v !== null ? Number(v) : null)
const HART = String.fromCharCode(0xa0)
const grupp = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, HART)

/** Orten med högst (eller lägst) värde, eller null om ingen har något. */
function basta(orter, varde, lagst = false) {
  let vald = null
  for (const o of orter) {
    const v = varde(o)
    if (v == null) continue
    if (!vald || (lagst ? v < vald.v : v > vald.v)) vald = { o, v }
  }
  return vald
}

/** Första meningen i ortstexten, som smakprov — resten står på ortsidan. */
function forstaMeningen(text) {
  if (!text) return null
  const m = text.match(/^.+?[.!?](?=\s+[A-ZÅÄÖ0-9]|$)/)
  return m ? m[0] : text
}

/** Ortens alla orter i landet, plus kurserna, för både metadata och sida. */
async function hamta(slug) {
  const land = landsidaFor(slug)
  if (!land) return null
  const alla = await getResorts()
  const orter = alla.filter((o) => o.country === land.country)
  return { land, alla, orter }
}

export async function generateMetadata({ params }) {
  const d = await hamta((await params).land)
  if (!d || d.orter.length === 0) return {}
  const { land, orter } = d

  const namnlista = orter.slice(0, 4).map((o) => o.name)
  const title = `Skidorter ${land.i}: ${orter.length} orter jämförda | Alpkoll`
  const description =
    `${namnlista.join(', ')}${orter.length > 4 ? ' med flera' : ''} ställda mot varandra: ` +
    'pist, fallhöjd, liftkort i kronor, resan dit och vem orten passar. Nackdelarna står med.'
  const url = `${SITE_URL}/skidorter/${land.slug}`

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

export default async function SkidorterILand({ params }) {
  const d = await hamta((await params).land)
  if (!d || d.orter.length === 0) notFound()
  const { land, alla, orter } = d
  const kurser = await hamtaKurser()

  const krTal = (o) => (harPris(o)
    ? kronorTal(o.lift_pass_week_eur, o.lift_pass_currency || 'EUR', kurser)
    : null)
  // Nordiska orter räknas från Stockholm, alporterna från Malmö — samma
  // val som på barnfamiljssidan och i bilMening.
  const fran = land.nordisk ? { nyckel: 'Stockholm', namn: 'Stockholm' } : { nyckel: 'Malmo', namn: 'Malmö' }

  const kortSvar = orter.length > 1 ? [
    { fraga: 'Störst', svar: basta(orter, (o) => tal(o.total_pistes_km)), visa: (v) => `${grupp(v)} km pist` },
    { fraga: 'Längst fallhöjd', svar: basta(orter, (o) => tal(fallhojd(o))), visa: (v) => `${grupp(v)} m` },
    { fraga: 'Snösäkrast', svar: basta(orter, (o) => tal(o.snow_guarantee_score)), visa: (v) => `${v} av 10` },
    { fraga: 'Nybörjare', svar: basta(orter, (o) => tal(o.beginner_score)), visa: (v) => `${v} av 10` },
    { fraga: 'Barnfamiljer', svar: basta(orter, (o) => tal(o.family_friendly_score)), visa: (v) => `${v} av 10` },
    { fraga: 'Avancerade', svar: basta(orter, (o) => tal(o.expert_score)), visa: (v) => `${v} av 10` },
    // Billigast räknas bara när minst två orter har pris; annars är det
    // inget svar utan den enda orten vi känner priset för.
    { fraga: 'Billigast liftkort', svar: orter.filter((o) => krTal(o) != null).length > 1 ? basta(orter, krTal, true) : null, visa: (v, o) => pris(o.lift_pass_week_eur, o.lift_pass_currency || 'EUR', kurser)?.kr },
    land.nordisk
      ? { fraga: `Närmast ${fran.namn}`, svar: basta(orter, (o) => bilresa(o.slug, fran.nyckel)?.minuter ?? null, true), visa: (v) => `${timmar(v)} med bil` }
      : null,
  ].filter((x) => x && x.svar) : []

  // Jämförelser där landets orter är med. Par inom landet först; för
  // alpländerna finns bara kors-paren mot Åre och Sälen, se lib/jamfor.js.
  const namn = new Map(alla.map((o) => [o.slug, o.name]))
  const egna = new Set(orter.map((o) => o.slug))
  const par = indexeradeParFor(alla.map((o) => o.slug))
    .map((p) => ({ p, delar: p.split('-vs-') }))
    .filter((x) => x.delar.some((s) => egna.has(s)))
    .sort((a, b) => b.delar.filter((s) => egna.has(s)).length - a.delar.filter((s) => egna.has(s)).length)
    .slice(0, 12)

  const nattag = orter.filter((o) => nattagFor(o.slug))
  const andra = LANDSIDOR.filter((l) => l.slug !== land.slug)

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>
      <SiteHeader />

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '108px clamp(20px, 5vw, 32px) 100px' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, margin: '0 0 14px' }}>
          <Link href="/" style={{ color: ACCENT, textDecoration: 'none' }}>Alla skidorter</Link>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}> / {land.namn}</span>
        </p>

        <h1 style={{ ...rubrik('clamp(34px, 5.5vw, 54px)'), lineHeight: 1.04, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Flagga country={land.country} />
          Skidorter {land.i}
        </h1>

        <p style={{ ...brod, margin: '0 0 14px' }}>{land.ingress}</p>
        <p style={{ ...brod, fontSize: 14.5, margin: '0 0 30px', color: 'rgba(255,255,255,0.57)' }}>
          {orter.length === 1 ? 'En ort' : `${orter.length} orter`} {land.i} med samma källa för pist och höjder som
          resten av sajten. Poängen är våra egna omdömen.{' '}
          <Link href="/sa-jamfor-vi" style={{ color: ACCENT }}>Så jämför vi</Link>.
        </p>

        {kortSvar.length > 0 && (
          <section style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)', marginBottom: 36 }}>
            <h2 style={{ ...etikett, margin: '0 0 14px' }}>Kort svar</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px 22px' }}>
              {kortSvar.map(({ fraga, svar, visa }) => (
                <div key={fraga}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'rgba(255,255,255,0.52)', marginBottom: 3 }}>{fraga}</div>
                  <Link href={`/resort/${svar.o.slug}`} style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#f0ece4', textDecoration: 'none' }}>{svar.o.name}</Link>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: ACCENT }}> {visa(svar.v, svar.o)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section style={{ marginBottom: 36 }}>
          <h2 style={rubrik('clamp(26px, 4vw, 34px)')}>Orterna</h2>
          {orter.map((o) => {
            const kr = harPris(o) ? pris(o.lift_pass_week_eur, o.lift_pass_currency || 'EUR', kurser)?.kr : null
            const bil = bilresa(o.slug, fran.nyckel)
            const fh = tal(fallhojd(o))
            const siffror = [
              tal(o.total_pistes_km) && `${grupp(o.total_pistes_km)} km pist`,
              fh && fh > 0 && `${grupp(fh)} m fallhöjd`,
              tal(o.altitude_top) && `topp ${grupp(o.altitude_top)} m`,
              kr && `liftkort sex dagar ${kr}`,
            ].filter(Boolean)
            const resvag = land.nordisk
              ? bil && `Med bil ${timmar(bil.minuter)} från ${fran.namn}.`
              : [
                o.nearest_airport && `Flyg till ${o.nearest_airport}.`,
                nattagFor(o.slug) && 'Nattåget från Sverige går hit.',
              ].filter(Boolean).join(' ')
            return (
              <article key={o.slug} style={{ ...kort, padding: 'clamp(18px, 4vw, 26px)', marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                  <h3 style={{ ...rubrik(26), margin: 0 }}>
                    <Link href={`/resort/${o.slug}`} style={{ color: '#f0ece4', textDecoration: 'none' }}>{o.name}</Link>
                  </h3>
                  {o.ski_area && o.ski_area !== o.name && <span style={etikett}>{o.ski_area}</span>}
                </div>
                {siffror.length > 0 && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: ACCENT, margin: '10px 0 8px', lineHeight: 1.6 }}>
                    {siffror.join(' · ')}
                  </p>
                )}
                {forstaMeningen(o.notes) && (
                  <p style={{ ...brod, fontSize: 14.5, margin: '0 0 6px' }}>{forstaMeningen(o.notes)}</p>
                )}
                <p style={{ ...brod, fontSize: 14, margin: 0, color: 'rgba(255,255,255,0.5)' }}>
                  {resvag && <>{resvag} </>}
                  <Link href={`/resort/${o.slug}`} style={{ color: ACCENT }}>Allt om {o.name}</Link>
                </p>
              </article>
            )
          })}
        </section>

        <section style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)', marginBottom: 36 }}>
          <h2 style={{ ...rubrik(22), marginBottom: 12 }}>Tänk på det här</h2>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {land.tankPa.map((t) => (
              <li key={t} style={{ ...brod, fontSize: 15, marginBottom: 6 }}>{t}</li>
            ))}
          </ul>
          {nattag.length > 0 && (
            <p style={{ ...brod, fontSize: 14.5, margin: '12px 0 0' }}>
              Nattåget från Sverige går till {nattag.map((o) => o.name).join(', ').replace(/, ([^,]*)$/, ' och $1')}.{' '}
              <Link href="/nattaget-till-alperna" style={{ color: ACCENT }}>Tider och priser</Link>.
            </p>
          )}
        </section>

        {par.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <h2 style={rubrik(22)}>Jämför orterna</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {par.map(({ p, delar }) => (
                <Link key={p} href={`/jamfor/${p}`} style={{
                  fontFamily: 'var(--font-body)', fontSize: 13.5, color: '#f0ece4', textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 999, padding: '6px 12px',
                }}>
                  {namn.get(delar[0])} eller {namn.get(delar[1])}
                </Link>
              ))}
            </div>
          </section>
        )}

        <p style={{ ...brod, fontSize: 14.5, margin: '30px 0 0' }}>
          Andra länder:{' '}
          {andra.map((l, i) => (
            <span key={l.slug}>
              {i > 0 && (i === andra.length - 1 ? ' och ' : ', ')}
              <Link href={`/skidorter/${l.slug}`} style={{ color: ACCENT }}>{l.namn}</Link>
            </span>
          ))}
          . Se också <Link href="/liftkortspriser" style={{ color: ACCENT }}>liftkortspriser</Link>,{' '}
          <Link href="/skidorter-for-barnfamiljer" style={{ color: ACCENT }}>skidorter för barnfamiljer</Link> och{' '}
          <Link href="/sportlov" style={{ color: ACCENT }}>sportlovet {AR}</Link>.
        </p>
      </main>

      <SiteFooter />
    </div>
  )
}
