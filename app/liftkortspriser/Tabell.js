'use client'

// Prislistans tabell, sorterbar.
//
// Sidan räknar fram allt på servern och skickar hit färdiga rader; här
// sker bara sorteringen. Större kort följer sin ort och räknas aldrig in
// i ordningen — de är ett tillval, inte en egen rad att jämföra.

import { Fragment, useState } from 'react'
import Link from 'next/link'

const ACCENT = '#D4A574'
const kort = { background: '#1c1a17', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }
const etikett = {
  fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500,
  color: 'rgba(255,255,255,0.52)', letterSpacing: '0.12em', textTransform: 'uppercase',
}
// Ortnamnet står kvar när tabellen rullas i sidled på mobilen.
const klistrad = { position: 'sticky', left: 0, background: '#1c1a17', zIndex: 1 }
const siffra = {
  fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'rgba(255,255,255,0.55)',
  padding: '14px 12px', textAlign: 'right', whiteSpace: 'nowrap',
}
const underrad = { fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'rgba(255,255,255,0.54)', marginTop: 3 }

// `stigande` är den riktning en kolumn får vid första klicket: priser
// billigast först, kilometer störst först.
const KOLUMNER = [
  { nyckel: 'namn', rubrik: 'Skidort', stigande: true },
  { nyckel: 'dag', rubrik: 'Dagskort', stigande: true, dold: true },
  { nyckel: 'vecka', rubrik: 'Sex dagar', stigande: true },
  { nyckel: 'perDag', rubrik: 'Per dag', stigande: true, dold: true },
  { nyckel: 'km', rubrik: 'Km', stigande: false, dold: true },
  { nyckel: 'perKm', rubrik: 'Per km', stigande: true },
]

const SNABBVAL = [
  { etikett: 'Billigast', nyckel: 'vecka', stigande: true },
  { etikett: 'Dyrast', nyckel: 'vecka', stigande: false },
  { etikett: 'Mest pist för pengarna', nyckel: 'perKm', stigande: true },
  { etikett: 'Mest pist', nyckel: 'km', stigande: false },
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

function varde(rad, nyckel) {
  switch (nyckel) {
    case 'namn': return rad.namn
    case 'dag': return rad.dagTal
    case 'vecka':
    case 'perDag': return rad.tal
    case 'km': return rad.km
    case 'perKm': return rad.perKm
    default: return null
  }
}

// På mobilen ryms bara ort, sex dagar och per km. Resten står under namnet.
function detaljer(r) {
  return [
    r.dag && `Dag ${r.dag.kr}`,
    r.kmText,
    r.sasong && r.sasong !== '26/27' && `pris ${r.sasong}`,
  ].filter(Boolean).join(' · ')
}

const CSS = `
  .lk-ort .lk-pil { color: ${ACCENT}; margin-left: 6px; font-weight: 600; display: inline-block; transition: transform 0.15s; }
  .lk-ort:hover { color: ${ACCENT} !important; }
  .lk-ort:hover .lk-pil, .lk-ort:focus-visible .lk-pil { transform: translateX(3px); }
  @media (prefers-reduced-motion: reduce) { .lk-ort .lk-pil { transition: none; } }
  .lk-mobil { display: none; }
  .lk-tabell { min-width: 760px; }
  @media (max-width: 640px) {
    .lk-dold { display: none; }
    .lk-mobil { display: block; }
    .lk-tabell { min-width: 0; }
    .lk-chip { padding: 9px 13px !important; font-size: 12.5px !important; }
    .lk-gruppnamn { display: none; }
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

function sortera(rader, nyckel, stigande) {
  return [...rader].sort((a, b) => {
    const x = varde(a, nyckel)
    const y = varde(b, nyckel)
    // Saknade värden hamnar sist åt båda hållen.
    if (x == null && y == null) return 0
    if (x == null) return 1
    if (y == null) return -1
    const skillnad = typeof x === 'string' ? x.localeCompare(y, 'sv') : x - y
    return stigande ? skillnad : -skillnad
  })
}

export default function Tabell({ rader }) {
  const [ordning, setOrdning] = useState({ nyckel: 'vecka', stigande: true })
  const [omrade, setOmrade] = useState(ALLA)
  const urval = omrade === ALLA ? rader : rader.filter((r) => r.omrade === omrade)
  const sorterade = sortera(urval, ordning.nyckel, ordning.stigande)

  const klickaKolumn = (k) => {
    setOrdning((o) => (o.nyckel === k.nyckel ? { ...o, stigande: !o.stigande } : { nyckel: k.nyckel, stigande: k.stigande }))
  }

  return (
    <>
      <style>{CSS}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '0 0 16px' }}>
        <div role="group" aria-label="Sortera tabellen" style={grupp}>
          <span className="lk-gruppnamn" style={gruppnamn} aria-hidden="true">Sortera</span>
          {SNABBVAL.map((v) => {
            const vald = ordning.nyckel === v.nyckel && ordning.stigande === v.stigande
            return (
              <button key={v.etikett} type="button" aria-pressed={vald} className="lk-chip" style={chip(vald)}
                onClick={() => setOrdning({ nyckel: v.nyckel, stigande: v.stigande })}
              >{v.etikett}</button>
            )
          })}
          <button
            type="button"
            title="Vänd ordningen"
            aria-label={`Vänd ordningen, nu ${ordning.stigande ? 'lägst först' : 'högst först'}`}
            onClick={() => setOrdning((o) => ({ ...o, stigande: !o.stigande }))}
            className="lk-chip" style={chip(false)}
          >{ordning.stigande ? '↑ Lägst först' : '↓ Högst först'}</button>
        </div>
        <div role="group" aria-label="Visa skidorter i" style={grupp}>
          <span className="lk-gruppnamn" style={gruppnamn} aria-hidden="true">Visa</span>
          {OMRADEN.map((o) => (
            <button key={o.id} type="button" aria-pressed={omrade === o.id} className="lk-chip" style={chip(omrade === o.id)}
              onClick={() => setOmrade(o.id)}
            >{o.etikett}</button>
          ))}
        </div>
      </div>

      <p style={{ ...underrad, fontSize: 12.5, lineHeight: 1.6, margin: '0 0 12px' }}>
        Vuxen, sex dagar i följd, högsäsong, pris i kassan.{' '}
        <b style={{ fontWeight: 500, color: 'rgba(255,255,255,0.75)' }}>ca</b> = omräknat från €, CHF eller NOK.{' '}
        <b style={{ fontWeight: 500, color: 'rgba(255,255,255,0.75)' }}>Per km</b> = sexdagarspriset delat med kilometer pist.
        Dolomiti Superski räknas inte per km, eftersom områdena inte hänger ihop.
      </p>

      <div style={{ ...kort, overflowX: 'auto', marginBottom: 18 }}>
        <table className="lk-tabell" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...etikett, padding: '16px 6px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)' }} />
              {KOLUMNER.map((k, i) => {
                const aktiv = ordning.nyckel === k.nyckel
                return (
                  <th
                    key={k.nyckel}
                    className={k.dold ? 'lk-dold' : undefined}
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
              <th className="lk-dold" style={{ ...etikett, textAlign: 'right', padding: '16px 16px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', whiteSpace: 'nowrap' }}>Säsong</th>
            </tr>
          </thead>
          <tbody>
            {sorterade.map((rad, i) => (
              <Fragment key={rad.slug}>
                <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ ...siffra, fontSize: 12, color: 'rgba(255,255,255,0.47)', padding: '14px 6px 14px 14px', width: 30 }}>{i + 1}</td>
                  <td style={{ padding: '14px 12px', ...klistrad }}>
                    <Link href={`/resort/${rad.slug}`} className="lk-ort" style={{
                      fontFamily: 'var(--font-body)', fontSize: 14.5, fontWeight: 500,
                      color: '#f0ece4', textDecoration: 'none', transition: 'color 0.15s',
                    }}>{rad.namn}<span className="lk-pil" aria-hidden="true">›</span></Link>
                    <div style={underrad}>{rad.land}{rad.kortnamn ? ` · ${rad.kortnamn}` : ''}</div>
                    <div className="lk-mobil" style={underrad}>{detaljer(rad)}</div>
                  </td>
                  <td className="lk-dold" style={siffra}>{rad.dag ? rad.dag.kr : '—'}</td>
                  <td style={{ ...siffra, color: '#f0ece4' }}>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{rad.pris.kr}</div>
                    {rad.pris.ursprung && <div style={underrad}>{rad.pris.ursprung}</div>}
                  </td>
                  <td className="lk-dold" style={siffra}>{rad.perDag ? `${rad.perDag} kr` : '—'}</td>
                  <td className="lk-dold" style={siffra}>{rad.kmText || '—'}</td>
                  <td style={{ ...siffra, color: ACCENT, fontWeight: 600 }}>{rad.perKm ? `${rad.perKm} kr` : '—'}</td>
                  <td className="lk-dold" style={{ ...siffra, paddingRight: 16 }}>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, letterSpacing: '0.04em',
                      padding: '4px 9px', borderRadius: 4,
                      background: rad.sasong === '26/27' ? 'rgba(212,165,116,0.12)' : 'rgba(255,255,255,0.05)',
                      color: rad.sasong === '26/27' ? ACCENT : 'rgba(255,255,255,0.61)',
                    }}>{rad.sasong}</span>
                  </td>
                </tr>
                {rad.stort && (
                  <tr>
                    <td />
                    <td style={{ padding: '0 12px 14px 22px', verticalAlign: 'top', ...klistrad }}>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
                        <span aria-hidden="true" style={{ color: ACCENT }}>↳ </span>Större kort: {rad.stort.namn}
                      </div>
                      <div className="lk-dold" style={{ ...underrad, maxWidth: 240 }}>{rad.stort.galler}</div>
                      <div className="lk-mobil" style={underrad}>{detaljer(rad.stort)}</div>
                    </td>
                    <td className="lk-dold" style={{ ...siffra, paddingTop: 0, verticalAlign: 'top' }}>{rad.stort.dag ? rad.stort.dag.kr : '—'}</td>
                    <td style={{ ...siffra, paddingTop: 0, verticalAlign: 'top', color: 'rgba(255,255,255,0.82)' }}>
                      <div>{rad.stort.pris.kr}</div>
                      {rad.stort.pris.ursprung && <div style={underrad}>{rad.stort.pris.ursprung}</div>}
                    </td>
                    <td className="lk-dold" style={{ ...siffra, paddingTop: 0, verticalAlign: 'top' }}>{rad.stort.perDag ? `${rad.stort.perDag} kr` : '—'}</td>
                    <td className="lk-dold" style={{ ...siffra, paddingTop: 0, verticalAlign: 'top' }}>{rad.stort.kmText || '—'}</td>
                    <td style={{ ...siffra, paddingTop: 0, verticalAlign: 'top', color: 'rgba(212,165,116,0.75)' }}>{rad.stort.perKm ? `${rad.stort.perKm} kr` : '—'}</td>
                    <td className="lk-dold" />
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
