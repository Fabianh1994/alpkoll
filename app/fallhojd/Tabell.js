'use client'

// Fallhöjdstabellen, sorterbar. Samma uppbyggnad som prislistans tabell
// i app/liftkortspriser/Tabell.js: sidan räknar fram raderna på servern,
// här sker bara sorteringen. Områdena under en ort följer sin ort och
// räknas aldrig in i ordningen.

import { Fragment, useState } from 'react'
import Link from 'next/link'

const ACCENT = '#D4A574'
const kort = { background: '#1c1a17', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }
const etikett = {
  fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500,
  color: 'rgba(255,255,255,0.52)', letterSpacing: '0.12em', textTransform: 'uppercase',
}
// På mobilen ryms bara orten och fallhöjden. Höjderna och pisten står
// under namnet.
// Ortnamnet står kvar när tabellen rullas i sidled på mobilen.
const klistrad = { position: 'sticky', left: 0, background: '#1c1a17', zIndex: 1 }
const siffra = {
  fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'rgba(255,255,255,0.55)',
  padding: '14px 12px', textAlign: 'right', whiteSpace: 'nowrap',
}
const underrad = { fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'rgba(255,255,255,0.54)', marginTop: 3 }

// `stigande` är den riktning en kolumn får vid första klicket: höjder
// störst först, namn A–Ö.
const KOLUMNER = [
  { nyckel: 'namn', rubrik: 'Skidort', stigande: true },
  { nyckel: 'fallhojd', rubrik: 'Fallhöjd', stigande: false },
  { nyckel: 'bas', rubrik: 'Lägsta', stigande: false, dold: true },
  { nyckel: 'topp', rubrik: 'Högsta', stigande: false, dold: true },
  { nyckel: 'km', rubrik: 'Pist', stigande: false, dold: true },
]

const SNABBVAL = [
  { etikett: 'Störst fallhöjd', nyckel: 'fallhojd', stigande: false },
  { etikett: 'Högst topp', nyckel: 'topp', stigande: false },
  { etikett: 'A–Ö', nyckel: 'namn', stigande: true },
]

// `id` jämförs mot radens `omrade`, som sidan sätter från det engelska
// landsfältet. Etiketten styr aldrig urvalet.
const ALLA = 'alla'
const OMRADEN = [
  { id: ALLA, etikett: 'Alla' },
  { id: 'sverige', etikett: 'Sverige' },
  { id: 'norge', etikett: 'Norge' },
  { id: 'finland', etikett: 'Finland' },
  { id: 'alperna', etikett: 'Alperna' },
]

/** Tusentalsmellanrum, som resten av sajten: 2 337 m, inte 2337. */
function m(n) {
  if (!Number.isFinite(n)) return '—'
  return `${String(n).replace(/\B(?=(\d{3})+$)/g, ' ')} m`
}

function sortera(rader, nyckel, stigande) {
  return [...rader].sort((a, b) => {
    const x = a[nyckel]
    const y = b[nyckel]
    if (x == null && y == null) return 0
    if (x == null) return 1
    if (y == null) return -1
    const skillnad = typeof x === 'string' ? x.localeCompare(y, 'sv') : x - y
    // Lika tal sorteras på namn, så att orter i samma skidområde står ihop i bokstavsordning.
    return (stigande ? skillnad : -skillnad) || a.namn.localeCompare(b.namn, 'sv')
  })
}

const CSS = `
  .fh-ort .fh-pil { color: ${ACCENT}; margin-left: 6px; font-weight: 600; display: inline-block; transition: transform 0.15s; }
  .fh-ort:hover { color: ${ACCENT} !important; }
  .fh-ort:hover .fh-pil, .fh-ort:focus-visible .fh-pil { transform: translateX(3px); }
  @media (prefers-reduced-motion: reduce) { .fh-ort .fh-pil { transition: none; } }
  .fh-mobil { display: none; }
  .fh-tabell { min-width: 640px; }
  @media (max-width: 640px) {
    .fh-dold { display: none; }
    .fh-mobil { display: block; }
    .fh-tabell { min-width: 0; }
    .fh-chip { padding: 9px 13px !important; font-size: 12.5px !important; }
    .fh-gruppnamn { display: none; }
  }
`

function chip(vald) {
  return {
    fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
    padding: '11px 16px', borderRadius: 999, cursor: 'pointer',
    border: `1px solid ${vald ? ACCENT : 'rgba(255,255,255,0.12)'}`,
    background: vald ? 'rgba(212,165,116,0.14)' : 'transparent',
    color: vald ? ACCENT : 'rgba(255,255,255,0.7)',
    transition: 'background 0.15s, border-color 0.15s, color 0.15s',
  }
}

const grupp = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }
const gruppnamn = { ...etikett, marginRight: 4, minWidth: 54 }

export default function Tabell({ rader }) {
  const [ordning, setOrdning] = useState({ nyckel: 'fallhojd', stigande: false })
  const [omrade, setOmrade] = useState(ALLA)
  const urval = omrade === ALLA ? rader : rader.filter((r) => r.omrade === omrade)
  const sorterade = sortera(urval, ordning.nyckel, ordning.stigande)
  // Platsnumret visas bara när ordningen är ett tal. Lika tal får samma
  // plats, så att de tre orterna i Les 3 Vallées inte står som 1, 2 och 3.
  const visaPlats = ordning.nyckel !== 'namn'
  const plats = (i) => {
    const v = sorterade[i][ordning.nyckel]
    return 1 + sorterade.findIndex((r) => r[ordning.nyckel] === v)
  }
  const vandText = ordning.nyckel === 'namn'
    ? (ordning.stigande ? 'A–Ö' : 'Ö–A')
    : (ordning.stigande ? '↑ Lägst först' : '↓ Högst först')

  const klickaKolumn = (k) => {
    setOrdning((o) => (o.nyckel === k.nyckel ? { ...o, stigande: !o.stigande } : { nyckel: k.nyckel, stigande: k.stigande }))
  }

  return (
    <>
      <style>{CSS}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '0 0 16px' }}>
        <div role="group" aria-label="Sortera tabellen" style={grupp}>
          <span className="fh-gruppnamn" style={gruppnamn} aria-hidden="true">Sortera</span>
          {SNABBVAL.map((v) => {
            const vald = ordning.nyckel === v.nyckel && ordning.stigande === v.stigande
            return (
              <button key={v.etikett} type="button" aria-pressed={vald} className="fh-chip" style={chip(vald)}
                onClick={() => setOrdning({ nyckel: v.nyckel, stigande: v.stigande })}
              >{v.etikett}</button>
            )
          })}
          <button
            type="button"
            title="Vänd ordningen"
            aria-label={`Vänd ordningen, nu ${vandText}`}
            onClick={() => setOrdning((o) => ({ ...o, stigande: !o.stigande }))}
            className="fh-chip" style={chip(false)}
          >{vandText}</button>
        </div>
        <div role="group" aria-label="Visa skidorter i" style={grupp}>
          <span className="fh-gruppnamn" style={gruppnamn} aria-hidden="true">Visa</span>
          {OMRADEN.map((o) => (
            <button key={o.id} type="button" aria-pressed={omrade === o.id} className="fh-chip" style={chip(omrade === o.id)}
              onClick={() => setOmrade(o.id)}
            >{o.etikett}</button>
          ))}
        </div>
      </div>

      <p style={{ ...underrad, fontSize: 12.5, lineHeight: 1.6, margin: '0 0 12px' }}>
        Lägsta och högsta punkt i meter över havet.{' '}
        <b style={{ fontWeight: 500, color: 'rgba(255,255,255,0.75)' }}>↳</b> = områden inom orten som inte hänger ihop med lift.
      </p>

      <div style={{ ...kort, overflowX: 'auto', marginBottom: 18 }}>
        <table className="fh-tabell" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...etikett, padding: '16px 6px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>Plats</span>
              </th>
              {KOLUMNER.map((k, i) => {
                const aktiv = ordning.nyckel === k.nyckel
                return (
                  <th
                    key={k.nyckel}
                    className={k.dold ? 'fh-dold' : undefined}
                    aria-sort={aktiv ? (ordning.stigande ? 'ascending' : 'descending') : 'none'}
                    style={{
                      padding: 0, textAlign: i === 0 ? 'left' : 'right',
                      borderBottom: '1px solid rgba(255,255,255,0.07)',
                      ...(i === 0 ? klistrad : null),
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => klickaKolumn(k)}
                      style={{
                        ...etikett, color: aktiv ? ACCENT : etikett.color,
                        background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                        padding: '16px 12px', width: '100%', textAlign: 'inherit',
                      }}
                    >
                      {k.rubrik}
                      <span aria-hidden="true" style={{ display: 'inline-block', width: 12, marginLeft: 4, opacity: aktiv ? 1 : 0.3 }}>
                        {aktiv ? (ordning.stigande ? '↑' : '↓') : '↕'}
                      </span>
                    </button>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {sorterade.map((rad, i) => (
              <Fragment key={rad.slug}>
                <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ ...siffra, fontSize: 12, color: 'rgba(255,255,255,0.47)', padding: '14px 6px 14px 14px', width: 30 }}>{visaPlats ? plats(i) : ''}</td>
                  <td style={{ padding: '14px 12px', ...klistrad }}>
                    <Link href={`/resort/${rad.slug}`} className="fh-ort" style={{
                      fontFamily: 'var(--font-body)', fontSize: 14.5, fontWeight: 500,
                      color: '#f0ece4', textDecoration: 'none', transition: 'color 0.15s',
                    }}>{rad.namn}<span className="fh-pil" aria-hidden="true">›</span></Link>
                    <div style={underrad}>{rad.land}{rad.skidomrade ? ` · ${rad.skidomrade}` : ''}</div>
                    <div className="fh-mobil" style={underrad}>{m(rad.bas).replace(/\u00a0m$/, '')}–{m(rad.topp)} över havet · {rad.km} km pist</div>
                    {rad.brantast && <div style={underrad}>Fallhöjden avser {rad.brantast}</div>}
                  </td>
                  <td style={{ ...siffra, color: ACCENT, fontSize: 15, fontWeight: 600 }}>{m(rad.fallhojd)}</td>
                  <td className="fh-dold" style={siffra}>{m(rad.bas)}</td>
                  <td className="fh-dold" style={{ ...siffra, color: '#f0ece4' }}>{m(rad.topp)}</td>
                  <td className="fh-dold" style={{ ...siffra, paddingRight: 16 }}>{rad.km} km</td>
                </tr>
                {rad.delar.map((d) => (
                  <tr key={d.namn}>
                    <td />
                    <td style={{ padding: '0 12px 12px 22px', verticalAlign: 'top', ...klistrad }}>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
                        <span aria-hidden="true" style={{ color: ACCENT }}>↳ </span>{d.namn}
                      </div>
                      <div className="fh-mobil" style={underrad}>{m(d.bas).replace(/\u00a0m$/, '')}–{m(d.topp)} över havet · {d.km} km pist</div>
                      {d.fallhojd == null && <div style={underrad}>Ingen nedfart hela vägen till dalen</div>}
                    </td>
                    <td style={{ ...siffra, paddingTop: 0, verticalAlign: 'top', color: 'rgba(212,165,116,0.75)' }}>{m(d.fallhojd)}</td>
                    <td className="fh-dold" style={{ ...siffra, paddingTop: 0, verticalAlign: 'top' }}>{m(d.bas)}</td>
                    <td className="fh-dold" style={{ ...siffra, paddingTop: 0, verticalAlign: 'top', color: 'rgba(255,255,255,0.82)' }}>{m(d.topp)}</td>
                    <td className="fh-dold" style={{ ...siffra, paddingTop: 0, verticalAlign: 'top', paddingRight: 16 }}>{d.km} km</td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
