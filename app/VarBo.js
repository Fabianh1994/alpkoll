import Link from 'next/link'
import Image from 'next/image'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import Partnerlank from './Partnerlank'
import { SITE_URL } from '../lib/lang'
import { bookingSok, BOOKING_BLA } from '../lib/booking'
import { VAR_BO, VAR_BO_ORDNING, UTHYRARE, HAMTAD } from '../lib/varbo'
import { getOrtbilder } from '../lib/ortbilder'
import { kreditering } from '../lib/kreditering'
import { farOptimeras } from '../lib/images'

// Sidan "Var ska man bo i <ort>?", gemensam för alla orter i lib/varbo.js.
// Innehållet står där. Den här filen bestämmer bara hur det ser ut.

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

function ort(slug) {
  const o = VAR_BO[slug]
  if (!o) throw new Error(`VAR_BO i lib/varbo.js saknar ${slug}`)
  return o
}

export function varBoMetadata(slug) {
  const o = ort(slug)
  const url = `${SITE_URL}${o.path}`
  return {
    title: o.titel,
    description: o.beskrivning,
    alternates: { canonical: url },
    openGraph: {
      title: o.titel,
      description: o.beskrivning,
      url,
      siteName: 'Alpkoll',
      type: 'article',
      locale: 'sv_SE',
      images: ['/og-image.png'],
    },
    twitter: { card: 'summary_large_image', title: o.titel, description: o.beskrivning, images: ['/og-image.png'] },
  }
}

// Källans namn som läsaren känner igen: skistar.com, aresweden.com.
const vard = (url) => new URL(url).hostname.replace(/^www\./, '')

// Ankare för ett område, så att kort svar kan länka ner till kortet.
const ankare = (namn) => namn.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')

// Områdesnamnen i ett svar blir länkar till sina kort.
function MedLankar({ text, omraden }) {
  const namn = omraden.map((a) => a.namn).sort((x, y) => y.length - x.length)
  if (namn.length === 0) return text
  const re = new RegExp(`(${namn.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g')
  return text.split(re).map((del, i) =>
    namn.includes(del)
      ? <a key={i} href={`#${ankare(del)}`} style={{ color: '#f0ece4', textDecorationColor: 'rgba(212,165,116,0.6)', textUnderlineOffset: 3 }}>{del}</a>
      : <span key={i}>{del}</span>
  )
}

// Ett stycke i datan är en lista av text och [länktext, adress].
function Stycke({ delar, style }) {
  return (
    <p style={style}>
      {delar.map((d, i) =>
        typeof d === 'string'
          ? <span key={i}>{d}</span>
          : <a key={i} href={d[1]} rel="noopener" style={{ color: ACCENT }}>{d[0]}</a>
      )}
    </p>
  )
}

function BookingKnapp({ ort, sid }) {
  const destination = bookingSok({ slug: ort.slug, name: ort.ort })
  if (!destination) return null
  return (
    <Partnerlank
      sid={sid}
      sok={{ destination }}
      markning="kompakt"
      markningStyle={{ marginBottom: 8 }}
      style={{ display: 'inline-block', background: BOOKING_BLA, borderRadius: 8, padding: '12px 16px', textDecoration: 'none' }}
    >
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: '#fff' }}>
        Sök boende i {ort.ort} på Booking.com →
      </span>
    </Partnerlank>
  )
}

const dold = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }

// Uthyrarna som små kort, två eller tre i bredd på dator och ett på mobil.
function Uthyrare({ nycklar }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 8 }}>
      {[...nycklar].sort((x, y) => UTHYRARE[x].namn.localeCompare(UTHYRARE[y].namn, 'sv')).map((k) => {
        const u = UTHYRARE[k]
        return (
          <li key={k}>
            <Partnerlank
              partner={u.partner || 'direkt'}
              sok={{ url: u.url }}
              markning={null}
              style={{ display: 'block', height: '100%', boxSizing: 'border-box', padding: '11px 14px', borderRadius: 8, border: '1px solid rgba(212,165,116,0.28)', background: 'rgba(212,165,116,0.05)', textDecoration: 'none' }}
            >
              <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: ACCENT }}>
                {u.namn} <span aria-hidden="true">↗</span>
              </span>
              <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.45, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{u.vad}</span>
              <span style={dold}> (öppnas i ny flik)</span>
            </Partnerlank>
          </li>
        )
      })}
    </ul>
  )
}

// Krediteringen ligger på bilden, som på ortsidan. CC BY kräver att
// fotografen namnges där bilden visas.
function Kreditering({ bild, style }) {
  return (
    <a href={bild.source_page} target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', textShadow: '0 1px 6px rgba(0,0,0,0.7)', ...style }}>
      {kreditering(bild)}
    </a>
  )
}

const chip = {
  display: 'inline-block', padding: '8px 14px', borderRadius: 999,
  border: '1px solid rgba(255,255,255,0.12)', background: '#1c1a17',
  fontFamily: 'var(--font-body)', fontSize: 14, color: '#f0ece4', textDecoration: 'none',
}

export default async function VarBo({ slug }) {
  const o = ort(slug)
  const andra = VAR_BO_ORDNING.filter((s) => s !== slug).map((s) => VAR_BO[s])

  // Ortens bilder ur resort_images. Svarar Supabase inte blir listan tom
  // och sidan visas utan bilder, som före.
  const bilder = (await getOrtbilder(slug)).filter((b) => farOptimeras(b.url))
  const hjalte = bilder.find((b) => b.position === 0)
  const omradesbild = (a) => a.bild != null
    ? bilder.find((b) => b.position === a.bild && b.alt?.includes(a.namn))
    : null

  const lasVidare = [
    [`${o.ort}: liftkort och pistkarta`, `/resort/${slug}`],
    ...andra.map((a) => [`Boende i ${a.ort}`, a.path]),
    ...(o.jamfor || []),
    ['Tåg till fjällen', '/tag-till-fjallen'],
    ['Skidorter för barnfamiljer', '/skidorter-for-barnfamiljer'],
  ]

  const rubrikH1 = (
    <h1 style={{ ...rubrik('clamp(38px, 7vw, 68px)'), lineHeight: 0.98, margin: 0 }}>
      Var ska man bo i {o.ort}?
    </h1>
  )

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>
      <style>{`
        .vb-fakta { display: grid; grid-template-columns: 104px 1fr; gap: 6px 16px; margin: 0; }
        .vb-fakta dt { padding-top: 3px; }
        .vb-fakta dd { margin: 0 0 8px; }
        @media (max-width: 560px) {
          .vb-fakta { grid-template-columns: 1fr; gap: 2px; }
          .vb-fakta dd { margin-bottom: 12px; }
          .vb-omradesbild { height: 170px !important; }
          .vb-svar { padding: 11px 13px !important; }
        }
        .vb-kallor summary { cursor: pointer; list-style: none; }
        .vb-kallor summary::-webkit-details-marker { display: none; }
        .vb-kallor[open] .vb-pil { transform: rotate(90deg); }
      `}</style>
      <SiteHeader />

      {/* ── Bild och rubrik ── */}
      {hjalte ? (
        <div style={{ position: 'relative', height: 'clamp(340px, 54vh, 540px)', overflow: 'hidden' }}>
          <Image src={hjalte.url} alt={hjalte.alt || o.ort} fill priority sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center 40%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(18,17,16,0.45) 0%, rgba(18,17,16,0.05) 35%, rgba(18,17,16,0.92) 100%)' }} />
          <Kreditering bild={hjalte} style={{ top: 84, right: 'clamp(20px, 4vw, 48px)', maxWidth: '50%', textAlign: 'right' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
            <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 clamp(20px, 5vw, 32px) 30px' }}>
              <p style={{ ...etikett, color: ACCENT, letterSpacing: '0.2em', margin: '0 0 10px' }}>Boende · {o.omraden.length} områden</p>
              {rubrikH1}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '108px clamp(20px, 5vw, 32px) 0' }}>
          <p style={{ ...etikett, color: ACCENT, letterSpacing: '0.2em', margin: '0 0 10px' }}>Boende · {o.omraden.length} områden</p>
          {rubrikH1}
        </div>
      )}

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '28px clamp(20px, 5vw, 32px) 100px' }}>
        {o.ingress.map((t, i) => (
          <p key={i} style={{ ...brod, fontSize: 17, color: 'rgba(255,255,255,0.72)', margin: '0 0 14px' }}>{t}</p>
        ))}

        {/* ── Kort svar ── */}
        <h2 style={{ ...etikett, margin: '30px 0 10px' }}>Kort svar</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
          {o.kortSvar.map((rad) => (
            <div key={rad.vem} className="vb-svar" style={{ ...kort, padding: '14px 16px' }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 4 }}>{rad.vem}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, color: '#f0ece4', lineHeight: 1.4 }}><MedLankar text={rad.var} omraden={o.omraden} /></div>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '10px 0 0' }}>
          Tryck på ett område för att se vem som hyr ut där.
        </p>

        {/* ── Boende för hela orten, högt upp: den som söker "boende <ort>" vill boka ── */}
        <div style={{ ...kort, borderColor: 'rgba(212,165,116,0.25)', padding: 'clamp(20px, 4vw, 28px)', margin: '24px 0 0' }}>
          <h2 style={{ ...etikett, margin: '0 0 12px' }}>Boende i hela {o.ort}</h2>
          <BookingKnapp ort={o} sid={`var-bo-i-${slug}-boende-${slug}`} />
          <p style={{ ...brod, fontSize: 14, margin: '14px 0 0', color: 'rgba(255,255,255,0.55)' }}>
            Mycket av boendet hyrs ut av liftbolagen och lokala stugförmedlare och finns inte på Booking.
            Vem som hyr ut i varje område står under området nedan.
          </p>
        </div>

        {/* ── Områdena ── */}
        <h2 style={{ ...rubrik('clamp(28px, 4.5vw, 38px)'), marginTop: 52 }}>Områdena ett och ett</h2>
        {o.omraden.map((a) => {
          const bild = omradesbild(a)
          return (
            <section key={a.namn} id={ankare(a.namn)} style={{ scrollMarginTop: 90, ...kort, overflow: 'hidden', marginBottom: 14 }}>
              {bild && (
                <div className="vb-omradesbild" style={{ position: 'relative', height: 230 }}>
                  <Image src={bild.url} alt={bild.alt} fill sizes="(max-width: 900px) 100vw, 860px" style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 55%, rgba(28,26,23,0.85) 100%)' }} />
                  <Kreditering bild={bild} style={{ bottom: 10, right: 14 }} />
                </div>
              )}
              <div style={{ padding: 'clamp(20px, 4vw, 28px)' }}>
                <div style={etikett}>{a.agare}</div>
                <h3 style={{ ...rubrik('clamp(30px, 5vw, 36px)'), margin: '4px 0 16px' }}>{a.namn}</h3>
                <dl className="vb-fakta">
                  {[['Passar', a.passar], ['Nackdel', a.nackdel], ['Till liften', a.lift], ['Boende', a.boende]].filter(([, v]) => v).map(([k, v]) => (
                    <div key={k} style={{ display: 'contents' }}>
                      <dt style={{ ...etikett, color: ACCENT }}>{k}</dt>
                      <dd style={{ ...brod, fontSize: 15, lineHeight: 1.65 }}>{v}</dd>
                    </div>
                  ))}
                </dl>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, lineHeight: 1.6, margin: '4px 0 18px', color: 'rgba(255,255,255,0.5)' }}>
                  {a.tal && <>{a.tal}{' '}</>}
                  Källor:{' '}
                  {[a.kalla, a.kalla2].filter(Boolean).map((url, i, alla) => {
                    // Två källor på samma webbplats får sidans namn efter värden.
                    const dubbel = alla.filter((u) => vard(u) === vard(url)).length > 1
                    const text = dubbel ? `${vard(url)} (${i === 0 ? 'området' : 'mer'})` : vard(url)
                    return <span key={url}>{i > 0 && ', '}<a href={url} rel="noopener" style={{ color: 'rgba(212,165,116,0.85)' }}>{text}</a></span>
                  })}
                </p>
                <div style={etikett}>Hyr boende i {a.namn}</div>
                <Uthyrare nycklar={a.uthyrare} />
              </div>
            </section>
          )
        })}

        {/* ── Liftkortet och resan ── */}
        <h2 style={{ ...rubrik('clamp(28px, 4.5vw, 38px)'), marginTop: 52 }}>{o.liftkortRubrik || 'Liftkortet'}</h2>
        {o.liftkort.map((delar, i) => (
          <Stycke key={i} delar={delar} style={{ ...brod, margin: '0 0 14px' }} />
        ))}
        {o.fotnot && <Stycke delar={o.fotnot} style={{ ...brod, fontSize: 14.5, margin: 0, color: 'rgba(255,255,255,0.57)' }} />}

        {/* ── Läs vidare: länkar som knappar i stället för ett långt stycke ── */}
        <h2 style={{ ...etikett, margin: '44px 0 12px' }}>Läs vidare</h2>
        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {lasVidare.map(([text, href]) => (
            <Link key={href} href={href} style={chip}>{text[0].toUpperCase() + text.slice(1)}</Link>
          ))}
        </nav>

        <details className="vb-kallor" style={{ marginTop: 28, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
          <summary style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
            <span className="vb-pil" aria-hidden="true" style={{ display: 'inline-block', marginRight: 6, transition: 'transform .15s' }}>›</span>
            Källor och hur sidan är gjord
          </summary>
          <Stycke
            delar={[...o.kallor, ` Hämtat ${HAMTAD}. Uthyrarna står i bokstavsordning.`]}
            style={{ ...brod, fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '10px 0 0' }}
          />
        </details>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '10px 0 0' }}>
          Länkarna till uthyrarna ger ingen provision.
        </p>
      </main>

      <SiteFooter />
    </div>
  )
}
