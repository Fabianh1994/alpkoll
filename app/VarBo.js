import Link from 'next/link'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import Partnerlank from './Partnerlank'
import { SITE_URL } from '../lib/lang'
import { bookingSok, BOOKING_BLA } from '../lib/booking'
import { VAR_BO, VAR_BO_ORDNING, UTHYRARE, HAMTAD } from '../lib/varbo'

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
const stark = { color: '#f0ece4', fontWeight: 500 }

export function varBoMetadata(slug) {
  const o = VAR_BO[slug]
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

function Uthyrare({ nycklar }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 0', display: 'grid', gap: 6 }}>
      {[...nycklar].sort((x, y) => UTHYRARE[x].namn.localeCompare(UTHYRARE[y].namn, 'sv')).map((k) => {
        const u = UTHYRARE[k]
        return (
          <li key={k} style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, lineHeight: 1.5 }}>
            <Partnerlank
              partner={u.partner || 'direkt'}
              sok={{ url: u.url }}
              markning={null}
              style={{ color: ACCENT, textDecoration: 'none', fontWeight: 500 }}
            >
              {u.namn} ↗
            </Partnerlank>
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>, {u.vad}</span>
          </li>
        )
      })}
    </ul>
  )
}

export default function VarBo({ slug }) {
  const o = VAR_BO[slug]
  const andra = VAR_BO_ORDNING.filter((s) => s !== slug).map((s) => VAR_BO[s])

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>
      <SiteHeader />

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '108px clamp(20px, 5vw, 32px) 100px' }}>
        <h1 style={{ ...rubrik('clamp(36px, 6vw, 58px)'), lineHeight: 1.02, marginBottom: 20 }}>
          Var ska man bo i {o.ort}?
        </h1>

        {o.ingress.map((t, i) => (
          <p key={i} style={{ ...brod, margin: '0 0 14px' }}>{t}</p>
        ))}

        {/* ── Kort svar ── */}
        <div style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)', margin: '28px 0 12px' }}>
          <h2 style={{ ...etikett, margin: '0 0 14px' }}>Kort svar</h2>
          <div style={{ display: 'grid', gap: 8 }}>
            {o.kortSvar.map((rad) => (
              <div key={rad.vem} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 0.8fr) 1.2fr', gap: 12 }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{rad.vem}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: '#f0ece4' }}><MedLankar text={rad.var} omraden={o.omraden} /></span>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '14px 0 0' }}>
            Tryck på ett område för att se vem som hyr ut där.
          </p>
        </div>

        {/* ── Boende för hela orten, högt upp: den som söker "boende <ort>" vill boka ── */}
        <div style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)', marginBottom: 12 }}>
          <h2 style={{ ...etikett, margin: '0 0 12px' }}>Boende i {o.ort}</h2>
          <BookingKnapp ort={o} sid={`var-bo-i-${slug}-boende-${slug}`} />
          <p style={{ ...brod, fontSize: 14, margin: '14px 0 0', color: 'rgba(255,255,255,0.55)' }}>
            Mycket av boendet hyrs ut av liftbolagen och lokala stugförmedlare och finns inte på Booking.
            Vem som hyr ut i varje område står under området nedan.
          </p>
        </div>

        {/* ── Områdena ── */}
        <h2 style={{ ...rubrik('clamp(26px, 4vw, 34px)'), marginTop: 44 }}>Områdena ett och ett</h2>
        {o.omraden.map((a) => (
          <section key={a.namn} id={ankare(a.namn)} style={{ scrollMarginTop: 90, ...kort, padding: 'clamp(20px, 4vw, 28px)', marginBottom: 12 }}>
            <div style={etikett}>{a.agare}</div>
            <h3 style={{ ...rubrik(28), margin: '6px 0 12px' }}>{a.namn}</h3>
            <p style={{ ...brod, fontSize: 15, margin: '0 0 10px' }}>
              <strong style={stark}>Passar: </strong>{a.passar}
            </p>
            <p style={{ ...brod, fontSize: 15, margin: '0 0 10px' }}>
              <strong style={stark}>Nackdel: </strong>{a.nackdel}
            </p>
            <p style={{ ...brod, fontSize: 15, margin: '0 0 10px' }}>
              <strong style={stark}>Till liften: </strong>{a.lift}
            </p>
            {a.boende && (
              <p style={{ ...brod, fontSize: 15, margin: '0 0 10px' }}>
                <strong style={stark}>Boende: </strong>{a.boende}
              </p>
            )}
            <p style={{ ...brod, fontSize: 13.5, margin: '0 0 14px', color: 'rgba(255,255,255,0.55)' }}>
              {a.tal && <>{a.tal}{' '}</>}
              Källor:{' '}
              {[a.kalla, a.kalla2].filter(Boolean).map((url, i) => (
                <span key={url}>{i > 0 && ', '}<a href={url} rel="noopener" style={{ color: ACCENT }}>{vard(url)}</a></span>
              ))}
            </p>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
              <div style={etikett}>Hyr boende i {a.namn}</div>
              <Uthyrare nycklar={a.uthyrare} />
            </div>
          </section>
        ))}

        {/* ── Liftkortet och resan ── */}
        <h2 style={{ ...rubrik('clamp(26px, 4vw, 34px)'), marginTop: 44 }}>{o.liftkortRubrik || 'Liftkortet'}</h2>
        {o.liftkort.map((delar, i) => (
          <Stycke key={i} delar={delar} style={{ ...brod, margin: '0 0 14px' }} />
        ))}
        {o.fotnot && <Stycke delar={o.fotnot} style={{ ...brod, fontSize: 14.5, margin: 0, color: 'rgba(255,255,255,0.57)' }} />}

        <p style={{ ...brod, fontSize: 14.5, margin: '36px 0 8px' }}>
          Mer om {o.ort}: <Link href={`/resort/${slug}`} style={{ color: ACCENT }}>ortsidan</Link> med
          liftkortspris och pistkarta, och <Link href="/tag-till-fjallen" style={{ color: ACCENT }}>tåg till fjällen</Link>.
          Var du bor i{' '}
          {andra.map((a, i) => (
            <span key={a.slug}>
              {i > 0 && ' och '}
              <Link href={a.path} style={{ color: ACCENT }}>{a.ort}</Link>
            </span>
          ))}
          .{o.jamfor && <> Jämför: {o.jamfor.map(([text, href], i) => (
            <span key={href}>{i > 0 && ', '}<Link href={href} style={{ color: ACCENT }}>{text}</Link></span>
          ))}.</>} Andra orter för barn står i <Link href="/skidorter-for-barnfamiljer" style={{ color: ACCENT }}>skidorter för barnfamiljer</Link>.
        </p>
        <Stycke
          delar={[...o.kallor, ` Hämtat ${HAMTAD}. Länkarna till uthyrarna ger ingen provision, och de står i bokstavsordning.`]}
          style={{ ...brod, fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0 }}
        />
      </main>

      <SiteFooter />
    </div>
  )
}
