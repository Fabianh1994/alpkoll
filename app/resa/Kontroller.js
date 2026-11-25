'use client'
// Egna kontroller i Alpkolls stil för kartan och datumen: zoomknappar i
// stället för Googles vita och en svensk datumväljare i stället för
// webbläsarens. Används av reseplaneraren och kartsidan.

import { useEffect, useRef, useState } from 'react'

const GULD = '#D4A574'
const TEXT = '#f0ece4'
const DOV = 'rgba(240,236,228,0.55)'

const MANADER = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december']
const MAN_KORT = ['jan', 'feb', 'mars', 'apr', 'maj', 'juni', 'juli', 'aug', 'sep', 'okt', 'nov', 'dec']
const VECKODAG = ['sön', 'mån', 'tis', 'ons', 'tors', 'fre', 'lör']
const dagNr = (d) => Number(d.slice(8, 10))
const manNr = (d) => Number(d.slice(5, 7)) - 1
const iso = (y, m, d) => new Date(Date.UTC(y, m, d)).toISOString().slice(0, 10)
const veckodag = (d) => VECKODAG[new Date(`${d}T12:00:00Z`).getUTCDay()]

/** "lör 20 feb", eller kort "20 feb". */
export function datumKort(d, medDag = true) {
  return `${medDag ? `${veckodag(d)} ` : ''}${dagNr(d)} ${MAN_KORT[manNr(d)]}`
}

/** "lör 20 – lör 27 feb" eller över månadsskifte "fre 26 feb – fre 5 mars". */
export function datumSpann(a, b) {
  if (!b) return datumKort(a)
  return manNr(a) === manNr(b) ? `${veckodag(a)} ${dagNr(a)} – ${datumKort(b)}` : `${datumKort(a)} – ${datumKort(b)}`
}

/** Zoomknappar för en Google-karta, i Alpkolls mörka stil. */
export function Zoom({ karta, style }) {
  const steg = (n) => { const m = karta.current; if (m) m.setZoom(m.getZoom() + n) }
  const k = { width: 40, height: 40, display: 'grid', placeItems: 'center', background: 'rgba(28,26,23,0.94)', color: TEXT, border: 0, cursor: 'pointer', padding: 0 }
  const ikon = (plus) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M5 12h14" />{plus && <path d="M12 5v14" />}
    </svg>
  )
  return (
    <div style={{ position: 'absolute', zIndex: 5, display: 'grid', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(240,236,228,0.16)', boxShadow: '0 4px 14px rgba(0,0,0,.45)', ...style }}>
      <button type="button" aria-label="Zooma in" onClick={() => steg(1)} style={{ ...k, borderBottom: '1px solid rgba(240,236,228,0.1)' }}>{ikon(true)}</button>
      <button type="button" aria-label="Zooma ut" onClick={() => steg(-1)} style={k}>{ikon(false)}</button>
    </div>
  )
}

/**
 * Svensk datumväljare för avresa och hemresa. En månad i taget, veckan
 * börjar på måndag. Första trycket väljer avresan, andra hemresan, och
 * dagarna emellan markeras. Valet gäller först när läsaren trycker Klar;
 * Esc stänger utan att ändra något.
 */
export function Kalender({ dit, hem, min, onKlar, onAvbryt }) {
  // En gammal länk kan ha en avresa som redan passerat; då börjar valet om.
  const start = min && dit < min ? min : dit
  const [a, setA] = useState(start)
  const [b, setB] = useState(hem && hem > start ? hem : null)
  const [valjer, setValjer] = useState('dit')
  const [visa, setVisa] = useState(() => ({ y: Number(start.slice(0, 4)), m: manNr(start) }))
  const ruta = useRef(null)

  useEffect(() => {
    ruta.current?.querySelector('[data-dag][aria-pressed="true"]')?.focus()
    const esc = (e) => { if (e.key === 'Escape') onAvbryt() }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onAvbryt])

  const forsta = new Date(Date.UTC(visa.y, visa.m, 1))
  const tomma = (forsta.getUTCDay() + 6) % 7
  const antal = new Date(Date.UTC(visa.y, visa.m + 1, 0)).getUTCDate()
  const flytta = (n) => setVisa(({ y, m }) => ({ y: y + Math.floor((m + n) / 12), m: (((m + n) % 12) + 12) % 12 }))
  const forstaManad = min && visa.y * 12 + visa.m <= Number(min.slice(0, 4)) * 12 + manNr(min)
  const valj = (d) => {
    if (valjer === 'dit' || d <= a) { setA(d); setB(null); setValjer('hem') } else { setB(d); setValjer('dit') }
  }
  const natter = b ? Math.round((Date.parse(b) - Date.parse(a)) / 86400000) : 0
  const pil = (bak) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={bak ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
    </svg>
  )
  const runda = { width: 34, height: 34, display: 'grid', placeItems: 'center', borderRadius: 999, border: '1px solid rgba(240,236,228,0.16)', background: 'none', color: TEXT, cursor: 'pointer', padding: 0 }

  return (
    <div ref={ruta} role="dialog" aria-label="Välj datum för avresa och hemresa" style={{ background: '#151412', border: '1px solid rgba(240,236,228,0.14)', borderRadius: 16, padding: '14px 14px 12px', boxShadow: '0 12px 32px rgba(0,0,0,.55)', maxWidth: 380, fontFamily: 'var(--font-body)', color: TEXT }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {[['dit', 'Avresa', a], ['hem', 'Hemresa', b]].map(([k, n, v]) => (
          <button key={k} type="button" onClick={() => setValjer(k)} aria-pressed={valjer === k}
            style={{ flex: 1, textAlign: 'left', padding: '7px 10px', borderRadius: 10, cursor: 'pointer', background: valjer === k ? 'rgba(212,165,116,0.12)' : 'none', border: `1px solid ${valjer === k ? GULD : 'rgba(240,236,228,0.12)'}`, color: TEXT, fontFamily: 'inherit' }}>
            <span style={{ display: 'block', fontSize: 10.5, letterSpacing: '0.1em', color: DOV }}>{n.toUpperCase()}</span>
            <span style={{ fontSize: 14 }}>{v ? datumKort(v) : 'Välj dag'}</span>
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <button type="button" aria-label="Förra månaden" onClick={() => flytta(-1)} disabled={forstaManad} style={{ ...runda, opacity: forstaManad ? 0.3 : 1 }}>{pil(true)}</button>
        <span aria-live="polite" style={{ fontSize: 15, fontWeight: 600 }}>{MANADER[visa.m].replace(/^./, (c) => c.toUpperCase())} {visa.y}</span>
        <button type="button" aria-label="Nästa månad" onClick={() => flytta(1)} style={runda}>{pil(false)}</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', rowGap: 2, textAlign: 'center' }}>
        {['M', 'T', 'O', 'T', 'F', 'L', 'S'].map((d, i) => <span key={i} aria-hidden="true" style={{ fontSize: 11, color: DOV, padding: '4px 0', letterSpacing: '0.06em' }}>{d}</span>)}
        {Array.from({ length: tomma }, (_, i) => <span key={`t${i}`} />)}
        {Array.from({ length: antal }, (_, i) => {
          const d = iso(visa.y, visa.m, i + 1)
          const ande = d === a || d === b
          const mellan = b && d > a && d < b
          const forbi = min && d < min
          return (
            <span key={d} style={{ display: 'grid', placeItems: 'center', background: mellan || (ande && b) ? 'rgba(212,165,116,0.14)' : 'none', borderRadius: b && d === a ? '999px 0 0 999px' : d === b ? '0 999px 999px 0' : 0 }}>
              <button type="button" data-dag disabled={forbi} onClick={() => valj(d)} aria-pressed={ande} aria-label={`${datumKort(d)} ${visa.y}`}
                style={{ width: '100%', maxWidth: 38, aspectRatio: '1', minWidth: 0, borderRadius: 999, border: 0, padding: 0, cursor: forbi ? 'default' : 'pointer', fontSize: 14, fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums', background: ande ? GULD : 'none', color: ande ? '#121110' : forbi ? 'rgba(240,236,228,0.25)' : TEXT, fontWeight: ande ? 600 : 400 }}>
                {i + 1}
              </button>
            </span>
          )
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginTop: 10 }}>
        <span style={{ fontSize: 12.5, color: DOV }}>{b ? `${natter} ${natter === 1 ? 'natt' : 'nätter'}` : 'Välj dagen du åker hem'}</span>
        <span style={{ display: 'flex', gap: 6 }}>
          <button type="button" onClick={onAvbryt} style={{ height: 36, padding: '0 14px', borderRadius: 8, border: '1px solid rgba(240,236,228,0.16)', background: 'none', color: TEXT, cursor: 'pointer', fontFamily: 'inherit' }}>Avbryt</button>
          <button type="button" onClick={() => onKlar(a, b)} disabled={!b} style={{ height: 36, padding: '0 18px', borderRadius: 8, border: 0, background: b ? GULD : 'rgba(212,165,116,0.3)', color: '#121110', fontWeight: 600, cursor: b ? 'pointer' : 'default', fontFamily: 'inherit' }}>Klar</button>
        </span>
      </div>
    </div>
  )
}
