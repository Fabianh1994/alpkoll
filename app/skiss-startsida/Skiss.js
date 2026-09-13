'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { farOptimeras } from '../../lib/images'

const MORK = '#121110'
const KORT = '#1c1a17'
const TEXT = '#f0ece4'
const SAND = '#D4A574'
const DAMPAD = 'rgba(255,255,255,0.62)'
const SVAG = 'rgba(255,255,255,0.5)'
const LINJE = 'rgba(255,255,255,0.08)'

/** 353 -> "5,9 tim", 45 -> "45 min". */
function tid(minuter) {
  if (!Number.isFinite(minuter)) return ''
  if (minuter < 60) return `${minuter} min`
  return `${(minuter / 60).toFixed(1).replace('.', ',')} tim`
}

function Bild({ src, alt, sizes, priority = false }) {
  if (!src) return null
  return farOptimeras(src) ? (
    <Image src={src} alt={alt} fill sizes={sizes} priority={priority} style={{ objectFit: 'cover' }} />
  ) : (
    <img src={src} alt={alt} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
  )
}

function Modulrubrik({ children, id }) {
  return (
    <h2 id={id} style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 400, letterSpacing: '0.04em', color: TEXT, margin: '0 0 6px', paddingBottom: 8, borderBottom: `2px solid ${SAND}` }}>
      {children}
    </h2>
  )
}

function Stadknapp({ stad, vald, onVal }) {
  return (
    <button type="button" onClick={() => onVal(stad.nyckel)} aria-pressed={vald} style={{
      fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
      padding: '8px 14px', borderRadius: 40, whiteSpace: 'nowrap',
      color: vald ? MORK : TEXT, background: vald ? SAND : KORT,
      border: `1px solid ${vald ? SAND : LINJE}`,
    }}>{stad.namn}</button>
  )
}

/** De fem närmaste, som Aftonbladets toppuffar: en stor och fyra mindre. */
function Toppkort({ ort, resa, stor, plats }) {
  return (
    <Link href={`/resort/${ort.slug}`} className="sk-puff" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
      <div style={{ position: 'relative', aspectRatio: stor ? '16 / 10' : '3 / 2', borderRadius: 4, overflow: 'hidden', background: KORT }}>
        {/* Plats 1 ligger överst på sidan och laddas direkt, inte lat. */}
        <Bild src={ort.bild} alt={ort.namn} priority={stor} sizes={stor ? '(max-width: 900px) 100vw, 640px' : '(max-width: 560px) 50vw, 280px'} />
        <span style={{ position: 'absolute', top: 10, left: 10, fontFamily: 'var(--font-heading)', fontSize: stor ? 30 : 22, lineHeight: 1, color: MORK, background: SAND, borderRadius: 3, padding: stor ? '4px 10px 2px' : '3px 8px 1px' }}>{plats}</span>
      </div>
      <div style={{ padding: '10px 0 0' }}>
        <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: stor ? 'clamp(24px, 3vw, 32px)' : 19, lineHeight: 1.15, color: TEXT, margin: 0 }}>
          {ort.namn}
        </h3>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: stor ? 16 : 14, color: DAMPAD, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
          <span style={{ color: SAND, fontWeight: 600 }}>{tid(resa[1])}</span> · {resa[0]} km · {ort.pist} km pist · {ort.fallhojd} m fallhöjd
          {ort.veckokort ? ` · ${ort.veckokort} för sex dagar` : ''}
        </div>
      </div>
    </Link>
  )
}

function Listrad({ ort, hoger, under }) {
  return (
    <li style={{ borderBottom: `1px solid ${LINJE}` }}>
      <Link href={`/resort/${ort.slug}`} className="sk-puff" style={{ display: 'grid', gridTemplateColumns: '64px minmax(0, 1fr) auto', gap: 12, alignItems: 'center', padding: '10px 0', textDecoration: 'none', color: 'inherit' }}>
        <div style={{ position: 'relative', width: 64, height: 44, borderRadius: 3, overflow: 'hidden', background: KORT }}>
          <Bild src={ort.bild} alt={ort.namn} sizes="64px" />
        </div>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 15.5, fontWeight: 600, color: TEXT, margin: 0 }}>{ort.namn}</h3>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: SVAG }}>{under}</div>
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: SAND, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{hoger}</div>
      </Link>
    </li>
  )
}

function Guide({ guide }) {
  return (
    <Link href={guide.href} className="sk-puff" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
      <div style={{ position: 'relative', aspectRatio: '3 / 2', borderRadius: 4, overflow: 'hidden', background: KORT }}>
        <Bild src={guide.bild} alt={guide.alt} sizes="(max-width: 560px) 100vw, 280px" />
      </div>
      <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 19, lineHeight: 1.2, color: TEXT, margin: '10px 0 0' }}>{guide.rubrik}</h3>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, lineHeight: 1.5, color: DAMPAD, margin: '6px 0 0' }}>{guide.ingress}</p>
    </Link>
  )
}

function Ortkort({ ort, resa, stadNamn }) {
  return (
    <Link href={`/resort/${ort.slug}`} className="sk-puff" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
      <div style={{ position: 'relative', aspectRatio: '4 / 3', borderRadius: 4, overflow: 'hidden', background: KORT }}>
        <Bild src={ort.bild} alt={ort.namn} sizes="(max-width: 560px) 50vw, 240px" />
        {ort.nattag && (
          <span style={{ position: 'absolute', top: 8, left: 8, fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: MORK, background: SAND, borderRadius: 3, padding: '2px 7px' }}>Nattåg</span>
        )}
      </div>
      <div style={{ padding: '8px 0 0' }}>
        <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 17, fontWeight: 600, color: TEXT, margin: 0 }}>{ort.namn}</h3>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: SVAG, marginTop: 1 }}>
          {ort.land} · {ort.pist} km pist · {ort.fallhojd} m fallhöjd
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontFamily: 'var(--font-body)', fontSize: 13, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
          <span style={{ color: DAMPAD }}>{resa ? `${tid(resa[1])} från ${stadNamn}` : ''}</span>
          <span style={{ color: SAND, fontWeight: 600 }}>{ort.veckokort || ''}</span>
        </div>
      </div>
    </Link>
  )
}

export default function Skiss({ orter, stader, bil, storst, runtOm, guider }) {
  // Filmstaden frågar efter biostaden först. Här är det staden du åker
  // ifrån, och den styr allt nedanför. Sparas inte: sajten sätter varken
  // cookies eller localStorage.
  const [stadNyckel, setStadNyckel] = useState('stockholm')
  const [sok, setSok] = useState('')
  const [urval, setUrval] = useState('alla')
  const [visaFler, setVisaFler] = useState(false)
  const stad = stader.find((s) => s.nyckel === stadNyckel)
  const resor = bil[stadNyckel]

  const valjSok = (varde) => {
    setSok(varde)
    const traff = stader.find((s) => s.namn.toLowerCase() === varde.trim().toLowerCase())
    if (traff) { setStadNyckel(traff.nyckel); setSok('') }
  }

  const efterRestid = [...orter].sort((a, b) => resor[a.slug][1] - resor[b.slug][1])
  const topp5 = efterRestid.slice(0, 5)
  const narmastAlperna = efterRestid.filter((o) => !o.nordisk).slice(0, 5)
  const inomTio = efterRestid.filter((o) => resor[o.slug][1] <= 600).sort((a, b) => b.fallhojd - a.fallhojd).slice(0, 5)
  const billigast = orter.filter((o) => o.perDag).sort((a, b) => a.perDag - b.perDag).slice(0, 5)
  const medTag = efterRestid.filter((o) => o.tag).slice(0, 5)
  const rutnat = efterRestid.filter((o) => urval === 'alla' || (urval === 'norden' ? o.nordisk : !o.nordisk))

  const navLank = { fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: DAMPAD, textDecoration: 'none', letterSpacing: '0.03em', textTransform: 'uppercase', whiteSpace: 'nowrap' }
  const valdaStader = (nycklar) => nycklar.map((n) => stader.find((s) => s.nyckel === n)).filter(Boolean)

  return (
    <div style={{ background: MORK, minHeight: '100vh', color: TEXT, paddingBottom: 100 }}>
      <style>{`
        .sk-wrap { max-width: 1180px; margin: 0 auto; padding: 0 20px; }
        .sk-topp5 { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); gap: 24px; }
        .sk-fyra { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px 16px; }
        .sk-moduler { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 32px; }
        .sk-guider { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
        .sk-tag-guider { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: 32px; }
        .sk-rutnat { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 22px 16px; }
        .sk-rad { display: flex; gap: 8px; flex-wrap: wrap; }
        .sk-nav { display: flex; gap: 20px; overflow-x: auto; scrollbar-width: none; }
        .sk-puff h3 { transition: color 0.2s; }
        .sk-puff:hover h3 { color: ${SAND}; }
        .sk-puff:focus-visible, .sk-wrap button:focus-visible, .sk-wrap input:focus-visible { outline: 2px solid ${SAND}; outline-offset: 3px; }
        @media (max-width: 900px) { .sk-topp5, .sk-moduler, .sk-tag-guider { grid-template-columns: minmax(0, 1fr); } }
        @media (max-width: 560px) { .sk-rutnat { grid-template-columns: repeat(2, minmax(0, 1fr)); } .sk-guider { grid-template-columns: minmax(0, 1fr); } }
        @media (prefers-reduced-motion: reduce) { .sk-puff h3 { transition: none; } }
      `}</style>

      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: MORK, borderBottom: `1px solid ${LINJE}` }}>
        <div className="sk-wrap" style={{ display: 'flex', alignItems: 'center', gap: 28, height: 60 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 28, letterSpacing: '0.05em', color: TEXT, textDecoration: 'none', flexShrink: 0 }}>ALPKOLL</Link>
          <nav className="sk-nav" style={{ flex: 1, minWidth: 0 }}>
            <a href="#orterna" style={navLank}>Skidorter</a>
            <Link href="/jamfor" style={navLank}>Jämför</Link>
            <Link href="/liftkortspriser" style={navLank}>Liftkortspriser</Link>
            <Link href="/nattaget-till-alperna" style={navLank}>Nattåget</Link>
            <Link href="/sportlov" style={navLank}>Sportlov</Link>
          </nav>
        </div>
      </header>

      <main className="sk-wrap" style={{ paddingTop: 28 }}>
        <h1 style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Skidorter i Alperna och Norden</h1>

        {/* ── Staden du åker ifrån ── */}
        {/* Fem städer syns från början. Resten ligger bakom "Fler städer"
            och i sökfältet, så att valet inte blir en vägg av knappar. */}
        <section aria-label="Staden du åker ifrån" style={{ display: 'grid', gap: 10 }}>
          <div className="sk-rad" style={{ alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: SVAG, textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 6 }}>Du åker från</span>
            {valdaStader(storst).map((s) => <Stadknapp key={s.nyckel} stad={s} vald={s.nyckel === stadNyckel} onVal={setStadNyckel} />)}
            {/* En stad vald ur sökningen eller den dolda raden syns som vald här. */}
            {!storst.includes(stadNyckel) && !(visaFler && runtOm.includes(stadNyckel)) && (
              <Stadknapp stad={stad} vald onVal={setStadNyckel} />
            )}
            <button type="button" onClick={() => setVisaFler((v) => !v)} aria-expanded={visaFler} style={{
              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: '8px 12px',
              color: SAND, background: 'transparent', border: 'none',
            }}>{visaFler ? 'Färre städer' : 'Fler städer'}</button>
            <input
              type="search" list="sk-stader" value={sok} placeholder="Sök bland 100 städer"
              onChange={(e) => valjSok(e.target.value)}
              aria-label="Sök stad"
              style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: TEXT, background: KORT, border: `1px solid ${LINJE}`, borderRadius: 40, padding: '8px 16px', minWidth: 210 }}
            />
            <datalist id="sk-stader">
              {stader.map((s) => <option key={s.nyckel} value={s.namn} />)}
            </datalist>
          </div>
          {visaFler && (
            <div className="sk-rad">
              {valdaStader(runtOm).map((s) => <Stadknapp key={s.nyckel} stad={s} vald={s.nyckel === stadNyckel} onVal={setStadNyckel} />)}
            </div>
          )}
        </section>

        {/* ── De fem närmaste ── */}
        <section style={{ marginTop: 34 }}>
          <Modulrubrik>Närmast från {stad.namn}</Modulrubrik>
          <div className="sk-topp5" style={{ marginTop: 16 }}>
            <Toppkort ort={topp5[0]} resa={resor[topp5[0].slug]} stor plats={1} />
            <div className="sk-fyra">
              {topp5.slice(1).map((o, i) => <Toppkort key={o.slug} ort={o} resa={resor[o.slug]} plats={i + 2} />)}
            </div>
          </div>
        </section>

        {/* ── Moduler ── */}
        <div className="sk-moduler" style={{ marginTop: 52 }}>
          <section>
            <Modulrubrik>Närmast i Alperna</Modulrubrik>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {narmastAlperna.map((o) => <Listrad key={o.slug} ort={o} hoger={tid(resor[o.slug][1])} under={`${o.land} · ${resor[o.slug][0]} km med bil`} />)}
            </ol>
          </section>
          <section>
            <Modulrubrik>Mest fallhöjd inom tio timmar</Modulrubrik>
            {inomTio.length ? (
              <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {inomTio.map((o) => <Listrad key={o.slug} ort={o} hoger={`${o.fallhojd} m`} under={`${tid(resor[o.slug][1])} från ${stad.namn}`} />)}
              </ol>
            ) : (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, color: DAMPAD, margin: '12px 0 0' }}>Ingen ort ligger inom tio timmars bilresa från {stad.namn}.</p>
            )}
          </section>
          <section>
            <Modulrubrik>Billigast per skiddag</Modulrubrik>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {billigast.map((o) => <Listrad key={o.slug} ort={o} hoger={`${o.perDag} kr`} under={`${o.veckokort} för sex dagar${o.sasong === '25/26' ? ' · förra säsongens pris' : ''}`} />)}
            </ol>
          </section>
        </div>

        {/* ── Tåg och guider ── */}
        <div className="sk-tag-guider" style={{ marginTop: 52 }}>
          <section>
            <Modulrubrik>Med tåg</Modulrubrik>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {medTag.map((o) => <Listrad key={o.slug} ort={o} hoger="" under={`${o.land} · ${o.tag}`} />)}
            </ol>
          </section>
          <section>
            <Modulrubrik>Guider</Modulrubrik>
            <div className="sk-guider" style={{ marginTop: 16 }}>
              {guider.map((g) => <Guide key={g.href} guide={g} />)}
            </div>
          </section>
        </div>

        {/* ── Alla orter, efter restid ── */}
        <section id="orterna" style={{ marginTop: 56, scrollMarginTop: 80 }}>
          <Modulrubrik>Alla orter, närmast först</Modulrubrik>
          <div className="sk-rad" style={{ margin: '14px 0 18px' }}>
            {[['alla', 'Alla'], ['norden', 'Norden'], ['alperna', 'Alperna och Andorra']].map(([v, text]) => (
              <button key={v} type="button" onClick={() => setUrval(v)} aria-pressed={urval === v} style={{
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '6px 12px', borderRadius: 4,
                color: urval === v ? SAND : DAMPAD, background: urval === v ? 'rgba(212,165,116,0.12)' : 'transparent', border: `1px solid ${urval === v ? 'rgba(212,165,116,0.4)' : LINJE}`,
              }}>{text}</button>
            ))}
          </div>
          <div className="sk-rutnat">
            {rutnat.map((o) => <Ortkort key={o.slug} ort={o} resa={resor[o.slug]} stadNamn={stad.namn} />)}
          </div>
        </section>
      </main>
    </div>
  )
}
