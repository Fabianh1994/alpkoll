'use client'

// Kartan först. Alla orter ligger på kartan; läsaren väljer en, byter med
// ‹ › eller på kartan och lägger upp till tre i jämförelsen. Med en adress
// räknas resan dit med bil, tåg och flyg, men bara för den valda orten och
// de jämförda, så att Googles kvot inte går åt till orter ingen tittar på.
//
// Google laddas först när läsaren trycker Visa kartan eller klickar i
// adressfältet, som integritetspolicyn lovar. Valet minns i webbläsaren,
// så att kartan visas direkt nästa gång.
//
// Allt läsaren valt står i adressen (?ort=, &jamfor=, &fran=, &dag=, &hem=,
// &antal=, &land=), så att en länk visar samma sak för den som får den.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { bibliotek, KARTSTIL } from './google'
import { planeraBil, planeraTag, planeraFlyg } from './planera'
import { AdressFalt, Ikon, CSS } from './Reseplanerare'
import { Kalender, Zoom, datumSpann } from './Kontroller'
import { nastaLordag, plusDagar, svenskTid, langd, heltal, dag as visaDag } from '../../lib/resa/resvag'
import { avstandKm } from '../../lib/resa/flygplatser'
import { giltigtDatum, snabbastSatt, kanTas } from '../../lib/resa/val'
import { kostnad } from '../../lib/resa/kostnad'
import { land as landNamn } from '../../lib/countries'

const GULD = '#D4A574'
const TEXT = '#f0ece4'
const DOV = 'rgba(240,236,228,0.55)'
const LINJE = 'rgba(240,236,228,0.1)'
const SATT = ['bil', 'tag', 'flyg']
const SATTNAMN = { bil: 'Bil', tag: 'Tåg och buss', flyg: 'Flyg' }
const AVRESA = '07:00'
const MAX_JAMFOR = 3
const MINNE = 'alpkoll-karta'

const ALPLANDER = ['Austria', 'Switzerland', 'France', 'Italy', 'Germany']
const ALLA = '__alla'

const idagSv = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Stockholm' })
const nyckelFor = (slug, hem, dit) => hem ? `${slug}|${hem.lat.toFixed(4)},${hem.lng.toFixed(4)}|${dit}` : null

/** "13 tim 20 min", och över ett dygn "1 dygn 4 tim". */
function restid(min) {
  if (!Number.isFinite(min)) return ''
  if (min < 24 * 60) return langd(min)
  const d = Math.floor(min / 1440)
  const t = Math.round((min % 1440) / 60)
  return `${d} dygn${t ? ` ${t} tim` : ''}`
}
const timmar = (min) => `${Math.round(min / 60)} t`

/** Filterknapparna: Alla, de nordiska länderna, Alperna och övriga länder var för sig. */
function filterFor(orter) {
  const finns = new Set(orter.map((o) => o.land))
  const f = [[ALLA, 'Alla']]
  for (const l of ['Sweden', 'Norway', 'Finland']) if (finns.has(l)) f.push([l, landNamn(l)])
  if (ALPLANDER.some((l) => finns.has(l))) f.push(['alperna', 'Alperna'])
  for (const l of [...finns].filter((l) => !['Sweden', 'Norway', 'Finland', ...ALPLANDER].includes(l)).sort()) f.push([l, landNamn(l)])
  return f
}
const passar = (filter, o) => filter === ALLA || (filter === 'alperna' ? ALPLANDER.includes(o.land) : o.land === filter)

function lasMinne() {
  try { return window.localStorage.getItem(MINNE) === 'ja' } catch { return false }
}
function sparaMinne() {
  try { window.localStorage.setItem(MINNE, 'ja') } catch { /* privat läge: frågar igen nästa gång */ }
}

export default function Kartsida({ orter, kurser }) {
  const perSlug = useMemo(() => Object.fromEntries(orter.map((o) => [o.slug, o])), [orter])
  const filterLista = useMemo(() => filterFor(orter), [orter])

  const [lib, setLib] = useState(null)
  const [laddar, setLaddar] = useState(false)
  const [googleFel, setGoogleFel] = useState(null)
  const [hem, setHem] = useState(null)
  const [dit, setDit] = useState(() => nastaLordag())
  const [hemDag, setHemDag] = useState(null)
  const [antal, setAntal] = useState(2)
  const [filter, setFilter] = useState(ALLA)
  const [vald, setVald] = useState(() => (orter.find((o) => o.slug === 'mayrhofen') || orter[0]).slug)
  const [fasta, setFasta] = useState([])
  const [kalender, setKalender] = useState(false)
  const [stor, setStor] = useState(false)
  const [svar, setSvar] = useState({}) // nyckel -> { bil, tag, flyg }; undefined = räknas
  const [last, setLast] = useState(false)
  const [adressNr, setAdressNr] = useState(0)
  const [andrar, setAndrar] = useState(false)

  const hemresa = hemDag && hemDag > dit ? hemDag : plusDagar(dit, 7)
  const ort = perSlug[vald]

  // ── Google, först när läsaren ber om det ─────────────────────────────
  const laddning = useRef(null)
  const starta = useCallback(() => {
    if (laddning.current) return laddning.current
    setLaddar(true)
    setGoogleFel(null)
    laddning.current = bibliotek().then((l) => {
      sparaMinne()
      setLib(l)
      return l
    }).catch((e) => {
      laddning.current = null
      setGoogleFel('Kartan gick inte att ladda. Kontrollera uppkopplingen och försök igen.')
      throw e
    }).finally(() => setLaddar(false))
    return laddning.current
  }, [])

  // ── Läs länken och minnet en gång ────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      const q = new URLSearchParams(window.location.search)
      const o = q.get('ort')
      if (o && perSlug[o]) setVald(o)
      const j = (q.get('jamfor') || '').split(',').filter((s) => perSlug[s]).slice(0, MAX_JAMFOR)
      if (j.length) setFasta(j)
      const l = q.get('land')
      if (l && filterLista.some(([k]) => k === l)) setFilter(l)
      const n = Number(q.get('antal'))
      if (Number.isInteger(n) && n >= 1 && n <= 9) setAntal(n)
      const idag = idagSv()
      const d = q.get('dag')
      const lankDag = giltigtDatum(d) && d >= idag ? d : null
      if (lankDag) setDit(lankDag)
      if (lankDag && giltigtDatum(q.get('hem'))) setHemDag(q.get('hem'))
      const [lat, lng, ...namn] = (q.get('fran') || '').split(',')
      const p = { lat: Number(lat), lng: Number(lng), namn: namn.join(',') || 'Din adress' }
      if (q.get('fran') && Number.isFinite(p.lat) && Number.isFinite(p.lng)) {
        setHem({ ...p, adress: p.namn })
        setAdressNr((x) => x + 1)
      }
      if (lasMinne()) starta().catch(() => {})
      setLast(true)
    }, 0)
    return () => clearTimeout(t)
  }, [perSlug, filterLista, starta])

  // ── Skriv tillståndet i adressen ─────────────────────────────────────
  useEffect(() => {
    if (!last) return
    const q = new URLSearchParams()
    q.set('ort', vald)
    if (fasta.length) q.set('jamfor', fasta.join(','))
    if (filter !== ALLA) q.set('land', filter)
    if (hem) q.set('fran', `${hem.lat.toFixed(5)},${hem.lng.toFixed(5)},${hem.namn}`)
    q.set('dag', dit)
    if (hemDag) q.set('hem', hemresa)
    if (antal !== 2) q.set('antal', String(antal))
    window.history.replaceState(null, '', `${window.location.pathname}?${q}`)
  }, [last, vald, fasta, filter, hem, dit, hemDag, hemresa, antal])

  // ── Räkna resan för vald och jämförda orter ──────────────────────────
  const paborjade = useRef(new Set())
  useEffect(() => {
    if (!hem || !lib) return
    // En kort paus, så att den som bläddrar snabbt med ‹ › inte räknar alla orter på vägen.
    const t = setTimeout(() => {
      const startMs = svenskTid(dit, AVRESA)
      for (const slug of [...new Set([vald, ...fasta])]) {
        const n = nyckelFor(slug, hem, dit)
        if (paborjade.current.has(n)) continue
        paborjade.current.add(n)
        const o = perSlug[slug]
        const mal = { namn: o.namn, lat: o.lat, lng: o.lng }
        const klar = (s) => (r) => setSvar((f) => ({ ...f, [n]: { ...f[n], [s]: r } }))
        const fel = (s) => () => klar(s)({ satt: s, saknas: 'Något gick fel när resan räknades ut.' })
        setSvar((f) => ({ ...f, [n]: f[n] || {} }))
        planeraBil(lib, hem, mal, startMs).then(klar('bil'), fel('bil'))
        planeraTag(lib, hem, mal, startMs).then(klar('tag'), fel('tag'))
        planeraFlyg(lib, hem, mal, o, startMs, dit).then(klar('flyg'), fel('flyg'))
      }
    }, 450)
    return () => clearTimeout(t)
  }, [hem, lib, dit, vald, fasta, perSlug])

  const resorFor = useCallback((slug) => svar[nyckelFor(slug, hem, dit)] || null, [svar, hem, dit])
  const snabbastFor = useCallback((slug) => {
    const r = resorFor(slug)
    if (!r || SATT.some((s) => r[s] === undefined)) return null
    const s = snabbastSatt(r, SATT)
    return s ? { satt: s, min: r[s].min } : null
  }, [resorFor])

  // Orterna i filtret: närmast först när adressen finns, annars i bokstavsordning.
  const synliga = useMemo(() => {
    const l = orter.filter((o) => passar(filter, o))
    if (!hem) return l
    return l.map((o) => ({ ...o, km: avstandKm(hem, o) })).sort((a, b) => a.km - b.km)
  }, [orter, filter, hem])

  // ── Kartan ───────────────────────────────────────────────────────────
  const ruta = useRef(null)
  const karta = useRef(null)
  const nalar = useRef({})
  const hemNal = useRef(null)
  const linje = useRef(null)
  const [kartaKlar, setKartaKlar] = useState(0)

  useEffect(() => {
    if (!lib || !ruta.current || karta.current) return
    const g = lib.google
    const m = new lib.maps.Map(ruta.current, {
      center: { lat: 55, lng: 12 }, zoom: 4, styles: KARTSTIL, backgroundColor: '#121110',
      disableDefaultUI: true, zoomControl: false, gestureHandling: 'greedy', clickableIcons: false,
    })
    karta.current = m
    m.addListener('zoom_changed', () => ruta.current?.classList.toggle('kf-nara', m.getZoom() >= 7))
    const Nal = nalKlass(g, (slug) => { setVald(slug); setStor(false) })
    orter.forEach((o) => { const n = new Nal(o); n.setMap(m); nalar.current[o.slug] = n })
    hemNal.current = (p) => { const n = new Nal(p, true); n.setMap(m); return n }
    g.maps.event.addListenerOnce(m, 'idle', () => setKartaKlar((k) => k + 1))
  }, [lib, orter])

  // Nålarna: namnet alltid för vald och jämförda, och restiden när den är räknad.
  useEffect(() => {
    Object.values(nalar.current).forEach((n) => {
      const s = n.o.slug
      const snabb = snabbastFor(s)
      n.el.classList.toggle('vald', s === vald)
      n.el.classList.toggle('fast', fasta.includes(s))
      n.el.style.display = passar(filter, n.o) ? '' : 'none'
      n.el.setAttribute('aria-label', `${n.o.namn}${snabb ? `, ${restid(snabb.min)}` : ''}`)
      n.el.setAttribute('aria-pressed', String(s === vald))
      n.el.innerHTML = ''
      const b = document.createElement('b')
      b.textContent = n.o.namn
      n.el.appendChild(b)
      if (snabb) {
        const t = document.createElement('span')
        t.textContent = timmar(snabb.min)
        n.el.appendChild(t)
      }
    })
  }, [vald, fasta, filter, kartaKlar, snabbastFor])

  // Hemmet och en streckad linje till den valda orten.
  const hemNalObj = useRef(null)
  useEffect(() => {
    const g = lib?.google
    const m = karta.current
    if (!g || !m) return
    hemNalObj.current?.setMap(null)
    linje.current?.setMap(null)
    hemNalObj.current = null
    linje.current = null
    if (!hem) return
    hemNalObj.current = hemNal.current({ lat: hem.lat, lng: hem.lng, slug: '__hem', namn: 'Hem' })
    if (ort) {
      linje.current = new g.maps.Polyline({
        map: m, path: [hem, { lat: ort.lat, lng: ort.lng }], geodesic: true, strokeOpacity: 0, zIndex: 1, clickable: false,
        icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 0.7, strokeColor: GULD, scale: 2 }, offset: '0', repeat: '12px' }],
      })
    }
  }, [lib, hem, ort, kartaKlar])

  // Kartan visar orterna i filtret, och hemmet om det finns.
  const mobil = useRef(false)
  useEffect(() => {
    const m = karta.current
    const g = lib?.google
    if (!m || !g) return
    mobil.current = window.matchMedia('(max-width: 899px)').matches
    const b = new g.maps.LatLngBounds()
    orter.filter((o) => passar(filter, o)).forEach((o) => b.extend(o))
    if (hem) b.extend(hem)
    m.fitBounds(b, mobil.current ? { top: 64, bottom: 56, left: 20, right: 56 } : 50)
  }, [filter, hem, kartaKlar, lib, orter])

  // Byts orten utanför kartan (‹ › eller listan) flyttas kartan om orten inte syns.
  useEffect(() => {
    const m = karta.current
    if (!m || !ort) return
    const b = m.getBounds()
    if (b && !b.contains({ lat: ort.lat, lng: ort.lng })) m.panTo({ lat: ort.lat, lng: ort.lng })
  }, [ort, kartaKlar])

  // ── Händelser ────────────────────────────────────────────────────────
  const fast = fasta.includes(vald)
  const vaxla = () => setFasta((f) => (fast ? f.filter((s) => s !== vald) : [...f, vald].slice(-MAX_JAMFOR)))
  const bladdra = (steg) => {
    const lista = synliga.some((o) => o.slug === vald) ? synliga : orter
    const i = lista.findIndex((o) => o.slug === vald)
    setVald(lista[(i + steg + lista.length) % lista.length].slug)
  }
  const datumKnapp = useRef(null)
  const stangKalender = useCallback(() => { setKalender(false); datumKnapp.current?.focus() }, [])
  const byttFilter = (k) => {
    setFilter(k)
    const forsta = orter.filter((o) => passar(k, o))
    if (!forsta.some((o) => o.slug === vald) && forsta.length) {
      setVald(hem ? forsta.reduce((a, b) => (avstandKm(hem, a) <= avstandKm(hem, b) ? a : b)).slug : forsta[0].slug)
    }
  }

  const helaResan = (slug) => {
    const q = new URLSearchParams()
    if (hem) q.set('fran', `${hem.lat.toFixed(5)},${hem.lng.toFixed(5)},${hem.namn}`)
    q.set('dag', dit)
    if (hemDag) q.set('hem', hemresa)
    if (antal !== 2) q.set('antal', String(antal))
    return `/resa/${slug}?${q}`
  }

  // ── Delar ────────────────────────────────────────────────────────────
  const Formular = (
    <div style={{ display: 'grid', gap: 10 }}>
      <AdressFalt
        key={adressNr}
        id="kf-fran"
        label="Från"
        placeholder="Din adress eller ort"
        varde={hem}
        onVal={(p) => { setHem(p); if (p) setAndrar(false) }}
        lib={lib}
        laddaLib={starta}
        position
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 96px', gap: 10 }}>
        <div className="resa-falt">
          <span className="kf-etikett" id="kf-datum-etikett">Datum</span>
          <button type="button" ref={datumKnapp} className="resa-input resa-datumknapp" aria-labelledby="kf-datum-etikett kf-datum-text" aria-haspopup="dialog" aria-expanded={kalender} onClick={() => setKalender((k) => !k)}>
            <span style={{ color: GULD, display: 'grid' }}><Kalenderikon /></span>
            <span id="kf-datum-text">{datumSpann(dit, hemresa)}</span>
          </button>
        </div>
        <label className="resa-falt">
          <span className="kf-etikett">Resenärer</span>
          <select value={antal} onChange={(e) => setAntal(Number(e.target.value))} className="resa-input">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      </div>
      {kalender && (
        <Kalender
          dit={dit}
          hem={hemresa}
          min={idagSv()}
          onKlar={(a, b) => { setDit(a); setHemDag(b); stangKalender() }}
          onAvbryt={stangKalender}
        />
      )}
    </div>
  )

  // Med en adress krymper formuläret till en rad, så att orten syns direkt (viktigast på mobilen).
  const Sammanfattning = hem && (
    <button type="button" className="kf-sammanfattning" onClick={() => setAndrar(true)} aria-label={`Ändra resan: från ${hem.namn}, ${datumSpann(dit, hemresa)}, ${antal} ${antal === 1 ? 'resenär' : 'resenärer'}`}>
      <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        Från <b style={{ fontWeight: 600 }}>{hem.namn}</b> · {datumSpann(dit, hemresa)} · {antal} {antal === 1 ? 'resenär' : 'resenärer'}
      </span>
      <span style={{ color: GULD, flexShrink: 0 }}>Ändra</span>
    </button>
  )

  const resor = resorFor(vald)
  const snabbast = resor && SATT.every((s) => resor[s] !== undefined) ? snabbastSatt(resor, SATT) : null

  const Rad = ({ s }) => {
    const r = resor?.[s]
    const basta = snabbast === s && kanTas(r)
    let under = ''
    if (r && !r.saknas) {
      if (s === 'bil') {
        const k = kostnad(r, { vuxna: antal }, null, kurser)
        under = `${r.pauser?.some((p) => p.natt) ? 'en natt på vägen, ' : ''}bränsle och vägavgifter cirka ${heltal(Math.round(k.perPerson / 10) * 10)} kr per person`
      } else if (s === 'tag') {
        under = `${r.byten ? `${r.byten} ${r.byten === 1 ? 'byte' : 'byten'}` : 'utan byte'}, priset står hos tåg- och bussbolagen`
      } else {
        const pris = r.flyget?.pris
        under = [
          Number.isFinite(pris) ? `från ${heltal(Math.round(pris))} kr per person, enkel väg` : 'priset står hos flygbolaget',
          r.tidigare ? 'du behöver åka före 07.00' : null,
          r.flyget?.narliggande ? 'flyget går en annan dag' : null,
        ].filter(Boolean).join(', ')
      }
    }
    return (
      <div className="kf-rad">
        <span style={{ display: 'grid', placeItems: 'center', color: basta ? GULD : 'rgba(240,236,228,0.75)' }}><Ikon satt={s} storlek={18} /></span>
        <span style={{ minWidth: 0 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
            {SATTNAMN[s]}
            {basta && <span className="resa-bricka">Först framme</span>}
          </span>
          <span style={{ display: 'block', fontSize: 13, lineHeight: 1.4, color: DOV }}>
            {r === undefined ? 'Räknar …' : r.saknas ? r.saknas : under}
          </span>
        </span>
        <span style={{ fontSize: 16, fontVariantNumeric: 'tabular-nums', textAlign: 'right', whiteSpace: 'nowrap', color: r === undefined ? DOV : TEXT }}>
          {r === undefined ? <span className="kf-laddar" aria-hidden="true" /> : r.saknas ? '–' : restid(r.min)}
        </span>
      </div>
    )
  }

  const OrtKort = ort && (
    <section aria-labelledby="kf-ortnamn">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div className="kf-etikett">{landNamn(ort.land)}</div>
          <h2 id="kf-ortnamn" aria-live="polite" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: 32, lineHeight: 1.05, margin: '2px 0 0', letterSpacing: '0.02em' }}>{ort.namn}</h2>
        </div>
        <span style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button type="button" aria-label="Förra orten" onClick={() => bladdra(-1)} className="kf-runda"><Pil vanster /></button>
          <button type="button" aria-label="Nästa ort" onClick={() => bladdra(1)} className="kf-runda"><Pil /></button>
        </span>
      </div>

      {hem ? (
        <>
          <p style={{ margin: '6px 0 6px', color: DOV, fontSize: 13.5 }}>
            Dörr till dörr från {hem.namn}, {visaDag(svenskTid(dit, AVRESA))} kl. 07.00
          </p>
          {lib ? SATT.map((s) => <Rad key={s} s={s} />) : (
            <button type="button" className="resa-knapp" style={{ width: '100%', margin: '8px 0' }} onClick={() => starta().catch(() => {})} disabled={laddar}>
              {laddar ? 'Laddar …' : 'Räkna resan hit'}
            </button>
          )}
        </>
      ) : (
        <p style={{ margin: '8px 0 4px', color: DOV, fontSize: 14, lineHeight: 1.55 }}>
          Skriv var du bor, så räknas resan hit med bil, tåg och flyg.
          {ort.flygplats && <> Flyger du landar du i {ort.flygplats}{ort.transfer ? `, ungefär ${langd(ort.transfer)} från orten` : ''}.</>}
        </p>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button type="button" onClick={vaxla} aria-pressed={fast} className="kf-knapp" style={{ flex: 1, borderColor: fast ? GULD : undefined, color: fast ? GULD : TEXT }}>
          {fast ? 'Med i jämförelsen' : `Jämför${fasta.length >= MAX_JAMFOR ? ' (byter ut den första)' : ''}`}
        </button>
        <Link href={helaResan(ort.slug)} className="kf-knapp kf-guld" style={{ flex: 1.3 }}>Visa hela resan ›</Link>
      </div>
    </section>
  )

  const Jamfor = fasta.length > 0 && (
    <section aria-labelledby="kf-jamfor" style={{ marginTop: 22 }}>
      <h3 id="kf-jamfor" className="kf-etikett" style={{ margin: '0 0 8px', fontWeight: 600 }}>Jämför ({fasta.length} av {MAX_JAMFOR})</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5, fontVariantNumeric: 'tabular-nums', tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <td style={{ width: 70 }} />
            {fasta.map((s) => (
              <th key={s} scope="col" style={{ textAlign: 'left', padding: '0 4px 6px', borderBottom: `1px solid ${LINJE}`, fontWeight: 600 }}>
                <button type="button" onClick={() => setVald(s)} className="kf-namnknapp" style={{ color: s === vald ? GULD : TEXT }}>{perSlug[s].namn}</button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SATT.map((k) => {
            const varden = fasta.map((s) => { const r = resorFor(s)?.[k]; return r && !r.saknas ? r.min : null })
            const minst = Math.min(...varden.filter((v) => v != null))
            return (
              <tr key={k}>
                <th scope="row" style={{ textAlign: 'left', fontWeight: 400, color: DOV, padding: '8px 0', borderBottom: `1px solid ${LINJE}` }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Ikon satt={k} storlek={15} />{k === 'tag' ? 'Tåg' : SATTNAMN[k]}</span>
                </th>
                {fasta.map((s, i) => {
                  const r = resorFor(s)?.[k]
                  const v = varden[i]
                  return (
                    <td key={s} style={{ padding: '8px 4px', borderBottom: `1px solid ${LINJE}`, color: v != null && v === minst && fasta.length > 1 ? GULD : r === undefined ? DOV : TEXT }}>
                      {!hem ? '' : r === undefined ? '…' : v == null ? '–' : timmar(v)}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      {!hem && <p style={{ margin: '8px 0 0', fontSize: 12.5, color: DOV }}>Restiderna visas när du skrivit din adress.</p>}
    </section>
  )

  const Lista = (
    <section aria-labelledby="kf-lista" style={{ marginTop: 24 }}>
      <h3 id="kf-lista" className="kf-etikett" style={{ margin: '0 0 6px', fontWeight: 600 }}>{hem ? 'Närmast dig, fågelvägen' : 'Alla orter'}</h3>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {synliga.map((o) => (
          <li key={o.slug}>
            <button type="button" onClick={() => setVald(o.slug)} aria-current={o.slug === vald ? 'true' : undefined} className="kf-listrad" style={{ color: o.slug === vald ? GULD : TEXT }}>
              <span>{o.namn}{fasta.includes(o.slug) && <span style={{ color: GULD }}> ·  jämförs</span>}</span>
              <span style={{ color: DOV }}>{hem ? `${heltal(Math.round(o.km / 10) * 10)} km` : landNamn(o.land)}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )

  const Filter = (
    <div className="kf-filter" role="group" aria-label="Visa orter i">
      {filterLista.map(([k, n]) => (
        <button key={k} type="button" onClick={() => byttFilter(k)} aria-pressed={filter === k} className={`kf-chip${filter === k ? ' vald' : ''}`}>{n}</button>
      ))}
    </div>
  )

  return (
    <main className="kf">
      <style>{CSS + KF_CSS}</style>
      <div className="kf-karta">
        <div ref={ruta} style={{ position: 'absolute', inset: 0 }} />
        {!lib && (
          <div className="kf-tom">
            <div style={{ maxWidth: 320, textAlign: 'center' }}>
              <p style={{ margin: '0 0 14px', fontSize: 14, lineHeight: 1.55, color: DOV }}>
                Kartan kommer från Google, som kan sätta kakor när den laddas.
              </p>
              <button type="button" className="resa-knapp" onClick={() => starta().catch(() => {})} disabled={laddar}>{laddar ? 'Laddar kartan …' : 'Visa kartan'}</button>
              {googleFel && <p role="alert" style={{ margin: '12px 0 0', fontSize: 13, color: '#e8a0a0' }}>{googleFel}</p>}
            </div>
          </div>
        )}
        <div className="kf-filterplats">{Filter}</div>
        {lib && <div className="kf-zoom"><Zoom karta={karta} /></div>}
      </div>

      <aside className={`kf-panel${stor ? ' stor' : ''}`} aria-label="Resan">
        <button type="button" className="kf-handtag" onClick={() => setStor((s) => !s)} aria-label={stor ? 'Visa mer av kartan' : 'Visa mer av resan'} aria-expanded={stor}>
          <span />
        </button>
        <h1 className="kf-rubrik">Resan till skidorten</h1>
        <p className="kf-ingress">Välj ort på kartan, skriv var du bor och jämför bil, tåg och flyg till upp till tre orter.</p>
        {hem && !andrar ? Sammanfattning : Formular}
        {hem && andrar && !kalender && <button type="button" className="resa-lank" onClick={() => setAndrar(false)}>Klar ›</button>}
        <div style={{ height: 22 }} />
        {OrtKort}
        {Jamfor}
        {Lista}
        <p style={{ margin: '22px 0 0', fontSize: 11.5, lineHeight: 1.6, color: 'rgba(240,236,228,0.4)' }}>
          Vägar, tåg och bussar: Google Maps. Flyg: Ignav och Aviasales via Travelpayouts. Restiden räknas dörr till dörr med avresa 07.00.
        </p>
      </aside>
    </main>
  )
}

/** Nålarna är egna knappar ovanpå Googles karta, i Alpkolls färger. */
function nalKlass(g, valj) {
  return class extends g.maps.OverlayView {
    constructor(o, hemma) {
      super()
      this.o = o
      this.el = document.createElement(hemma ? 'div' : 'button')
      this.el.className = hemma ? 'kf-hem' : 'kf-nal'
      if (hemma) {
        this.el.textContent = 'Hem'
        this.el.setAttribute('aria-hidden', 'true')
      } else {
        this.el.type = 'button'
        this.el.onclick = (e) => { e.stopPropagation(); valj(o.slug) }
      }
    }
    onAdd() { this.getPanes().overlayMouseTarget.appendChild(this.el) }
    draw() {
      const p = this.getProjection()?.fromLatLngToDivPixel(new g.maps.LatLng(this.o.lat, this.o.lng))
      if (!p) return
      this.el.style.left = `${p.x}px`
      this.el.style.top = `${p.y}px`
    }
    onRemove() { this.el.remove() }
  }
}

function Kalenderikon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></svg>
}
function Pil({ vanster = false }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={vanster ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} /></svg>
}

const KF_CSS = `
.kf { display: grid; grid-template-columns: minmax(0, 1fr) 440px; height: calc(100vh - 84px); margin-top: 84px; font-family: var(--font-body); color: #f0ece4; }
.kf-karta { position: relative; overflow: hidden; background: #121110; }
.kf-tom { position: absolute; inset: 0; display: grid; place-items: center; padding: 24px; z-index: 2;
  background: radial-gradient(ellipse at 50% 40%, rgba(212,165,116,0.08), transparent 60%), #121110; }
.kf-filterplats { position: absolute; top: 16px; left: 16px; right: 16px; z-index: 6; pointer-events: none; }
.kf-filter { display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; pointer-events: auto; width: max-content; max-width: 100%; }
.kf-filter::-webkit-scrollbar { display: none; }
.kf-chip { flex-shrink: 0; border: 1px solid rgba(240,236,228,0.16); background: rgba(28,26,23,0.94); color: #f0ece4; border-radius: 999px; padding: 8px 13px; font: 500 13px var(--font-body); cursor: pointer; white-space: nowrap; }
.kf-chip.vald { background: #f0ece4; color: #121110; border-color: #f0ece4; }
.kf-chip:focus-visible, .kf-knapp:focus-visible, .kf-runda:focus-visible, .kf-listrad:focus-visible, .kf-namnknapp:focus-visible, .kf-handtag:focus-visible, .kf-nal:focus-visible { outline: 2px solid #D4A574; outline-offset: 2px; }
.kf-zoom { position: absolute; right: 20px; bottom: 44px; width: 42px; height: 82px; z-index: 5; }
.kf-panel { background: #151412; border-left: 1px solid rgba(240,236,228,0.08); padding: 22px 24px 28px; overflow-y: auto; overscroll-behavior: contain; }
.kf-handtag { display: none; }
.kf-sammanfattning { all: unset; box-sizing: border-box; width: 100%; display: flex; justify-content: space-between; gap: 12px; align-items: center; cursor: pointer; padding: 12px 14px; border: 1px solid rgba(240,236,228,0.12); border-radius: 10px; background: #121110; font-size: 14px; color: #f0ece4; }
.kf-sammanfattning:hover { border-color: rgba(212,165,116,0.5); }
.kf-sammanfattning:focus-visible { outline: 2px solid #D4A574; outline-offset: 2px; }
.kf-rubrik { font-family: var(--font-heading); font-weight: 400; font-size: 15px; letter-spacing: .14em; text-transform: uppercase; color: #D4A574; margin: 0 0 4px; }
.kf-ingress { margin: 0 0 16px; font-size: 13.5px; line-height: 1.55; color: rgba(240,236,228,0.55); }
.kf-etikett { font-family: var(--font-body); font-size: 10px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: rgba(240,236,228,0.5); }
.kf-rad { display: grid; grid-template-columns: 26px minmax(0, 1fr) auto; align-items: center; gap: 12px; padding: 11px 0; border-top: 1px solid rgba(240,236,228,0.1); }
.kf-runda { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 999px; border: 1px solid rgba(240,236,228,0.18); background: none; color: #f0ece4; cursor: pointer; }
.kf-knapp { height: 44px; display: grid; place-items: center; border-radius: 8px; border: 1px solid rgba(240,236,228,0.25); background: none; color: #f0ece4; font: 600 14px var(--font-body); cursor: pointer; text-decoration: none; padding: 0 10px; text-align: center; }
.kf-guld { background: #D4A574; border-color: #D4A574; color: #121110 !important; }
.kf-namnknapp { all: unset; cursor: pointer; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.kf-listrad { all: unset; box-sizing: border-box; width: 100%; cursor: pointer; display: flex; justify-content: space-between; gap: 10px; padding: 9px 0; border-top: 1px solid rgba(240,236,228,0.08); font-size: 14px; }
.kf-listrad:hover { color: #D4A574 !important; }
.kf-laddar { display: inline-block; width: 56px; height: 12px; border-radius: 6px; background: linear-gradient(90deg, rgba(240,236,228,0.06), rgba(240,236,228,0.16), rgba(240,236,228,0.06)); background-size: 200% 100%; animation: kf-glans 1.2s linear infinite; }
@keyframes kf-glans { to { background-position: -200% 0; } }
@media (prefers-reduced-motion: reduce) { .kf-laddar { animation: none; } }

.kf-nal { position: absolute; transform: translate(-50%, -50%); display: flex; gap: 6px; align-items: center; white-space: nowrap; padding: 0; width: 12px; height: 12px; border-radius: 999px; border: 2px solid #121110; background: #D4A574; color: #f0ece4; font: 500 12px var(--font-body); cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,.5); }
.kf-nal::before { content: ''; position: absolute; inset: -12px; }
.kf-nal b, .kf-nal span { display: none; font-weight: 500; }
.kf-nal span { color: #D4A574; font-variant-numeric: tabular-nums; }
.kf-nal:hover, .kf-nal:focus-visible, .kf-nal.fast, .kf-nal.vald, .kf-nara .kf-nal { width: auto; height: auto; padding: 5px 9px; background: #1c1a17; border: 1px solid rgba(240,236,228,.18); transform: translate(-50%, -100%); z-index: 4; }
.kf-nal:hover b, .kf-nal:hover span, .kf-nal:focus-visible b, .kf-nal:focus-visible span, .kf-nal.fast b, .kf-nal.fast span, .kf-nal.vald b, .kf-nal.vald span, .kf-nara .kf-nal b, .kf-nara .kf-nal span { display: inline; }
.kf-nal.fast { border-color: #D4A574; z-index: 6; }
.kf-nal.vald { background: #D4A574; color: #121110; z-index: 10; }
.kf-nal.vald span { color: #121110; }
.kf-hem { position: absolute; transform: translate(-50%, -50%); padding: 4px 8px; border-radius: 999px; background: #f0ece4; color: #121110; font: 600 11px var(--font-body); letter-spacing: .04em; box-shadow: 0 2px 8px rgba(0,0,0,.5); pointer-events: none; }

@media (max-width: 899px) {
  .kf { display: block; position: relative; height: calc(100dvh - 84px - 72px); min-height: 480px; }
  .kf-karta { position: absolute; left: 0; right: 0; top: 0; height: 56%; }
  .kf-filterplats { top: 10px; left: 12px; right: 12px; }
  .kf-zoom { right: 12px; top: 56px; bottom: auto; }
  .kf-panel { position: absolute; left: 0; right: 0; bottom: 0; height: 50%; z-index: 8; border-left: 0; border-radius: 18px 18px 0 0; padding: 0 18px 24px; box-shadow: 0 -10px 30px rgba(0,0,0,.5); transition: height .25s ease; }
  .kf-panel.stor { height: 90%; }
  .kf-handtag { display: block; position: sticky; top: 0; z-index: 3; width: calc(100% + 36px); margin: 0 -18px 4px; height: 26px; border: 0; background: #151412; cursor: pointer; }
  .kf-handtag span { display: block; width: 40px; height: 4px; border-radius: 2px; background: rgba(240,236,228,.3); margin: 0 auto; }
  .kf-tom { bottom: 12%; }
  .kf-rubrik, .kf-ingress { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
}
@media (max-width: 899px) and (prefers-reduced-motion: reduce) { .kf-panel { transition: none; } }
`
