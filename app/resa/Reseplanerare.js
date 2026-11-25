'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { bibliotek, harNyckel } from './google'
import { planeraBil, planeraTag, planeraFlyg, byggFlygresa, stoppLangsVagen } from './planera'
import ResKarta from './ResKarta'
import Partnerlank from '../Partnerlank'
import {
  FARG, TYPNAMN, FLYGPLATS_FORE, klocka, dag, dagarSenare, langd, heltal, nastaLordag, svenskTid, plusDagar, datumFor,
} from '../../lib/resa/resvag'
import { FLYGPLATSER } from '../../lib/resa/flygplatser'
import { kostnad, STANDARD_FORBRUKNING, STANDARD_LITERPRIS } from '../../lib/resa/kostnad'

// Reseplaneraren: från din dörr till stugan, med bil, tåg och flyg.
//
// Läsaren skriver sin adress, och de tre resorna räknas fram samtidigt. Ett
// kort per färdsätt visar hela restiden dörr till dörr; det valda kortet
// ritas på kartan och skrivs ut steg för steg under den. Bilresan får
// pauser med lunchställen utan att läsaren behöver be om dem.

const ACCENT = '#D4A574'
const TEXT = '#f0ece4'
const KORT = '#1c1a17'
const SATT = ['bil', 'tag', 'flyg']
const SATTNAMN = { bil: 'Bil', tag: 'Tåg och buss', flyg: 'Flyg' }

const etikett = {
  fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em',
  textTransform: 'uppercase', color: 'rgba(240,236,228,0.5)',
}

export default function Reseplanerare({ ort, kurser }) {
  const [lib, setLib] = useState(null)
  const [laddarGoogle, setLaddarGoogle] = useState(false)
  const [googleFel, setGoogleFel] = useState(null)

  const [hem, setHem] = useState(null)
  const [stuga, setStuga] = useState(null)
  const [visaStuga, setVisaStuga] = useState(false)
  const [datum, setDatum] = useState(() => nastaLordag())
  const [tid, setTid] = useState('07:00')
  const [antal, setAntal] = useState(2)
  const [hemDatumVal, setHemDatum] = useState('')
  const [riktning, setRiktning] = useState('dit')
  const sparade = useRef({})

  const [resor, setResor] = useState(null) // { bil, tag, flyg } — undefined = räknas
  const [valt, setValt] = useState(null)
  const [aktiv, setAktiv] = useState(null)
  const [stopp, setStopp] = useState([])
  const [soker, setSoker] = useState(false)
  const [aterstalld, setAterstalld] = useState(0)
  const anvandarenValde = useRef(false)
  const sokning = useRef(0)
  const resultat = useRef(null)

  const mal = useMemo(() => (stuga
    ? { namn: stuga.namn, lat: stuga.lat, lng: stuga.lng }
    : { namn: ort.namn, lat: ort.lat, lng: ort.lng }), [stuga, ort])

  // Hemresan förvals en vecka efter avresan, tills läsaren väljer själv.
  const hemDatum = hemDatumVal || plusDagar(datum, 7)
  const hemTid = '10:00'

  const laddaLib = useCallback(async () => {
    if (lib) return lib
    setLaddarGoogle(true)
    try {
      const l = await bibliotek()
      setLib(l)
      return l
    } catch (e) {
      setGoogleFel('Kartan gick inte att ladda. Kontrollera uppkopplingen och försök igen.')
      throw e
    } finally {
      setLaddarGoogle(false)
    }
  }, [lib])

  // Dit räknas när läsaren trycker på Visa resan; hem först när läsaren
  // väljer hemresan, så att Googles kvot inte går åt i onödan. Båda sparas
  // tills formuläret ändras.
  const sok = useCallback(async (e, rikt = 'dit') => {
    e?.preventDefault?.()
    if (!hem) return
    const l = await laddaLib().catch(() => null)
    if (!l) return
    const nr = ++sokning.current
    if (e) sparade.current = {}
    setRiktning(rikt)
    anvandarenValde.current = false
    setValt(null)
    setAktiv(null)
    setStopp([])
    if (sparade.current[rikt]) { setResor(sparade.current[rikt]); return }
    setSoker(true)
    setResor({})

    const hemat = rikt === 'hem'
    const [fran, till] = hemat ? [mal, hem] : [hem, mal]
    const dag = hemat ? hemDatum : datum
    const startMs = svenskTid(dag, hemat ? hemTid : tid)
    const samlat = {}
    const klar = (satt) => (r) => {
      if (nr !== sokning.current) return
      samlat[satt] = r
      setResor((f) => ({ ...f, [satt]: r }))
      if (!anvandarenValde.current && !r.saknas) {
        setValt((v) => v || satt)
      }
    }
    const fel = (satt) => () => klar(satt)({ satt, saknas: 'Något gick fel när resan räknades ut.' })

    const bil = planeraBil(l, fran, till, startMs).then(klar('bil'), fel('bil'))
    const tag = planeraTag(l, fran, till, startMs).then(klar('tag'), fel('tag'))
    const flyg = planeraFlyg(l, fran, till, ort, startMs, dag, { hemat }).then(klar('flyg'), fel('flyg'))
    await Promise.all([bil, tag, flyg])
    if (nr === sokning.current) {
      sparade.current[rikt] = samlat
      setSoker(false)
      if (!hemat) setTimeout(() => resultat.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    }
  }, [hem, mal, ort, datum, tid, hemDatum, laddaLib])

  // En delad länk fyller i formuläret. Google laddas först när läsaren
  // trycker på Visa resan, som utan länk.
  useEffect(() => {
    const t = setTimeout(() => {
      const q = new URLSearchParams(window.location.search)
      const plats = (v) => {
        const [lat, lng, ...namn] = (v || '').split(',')
        const p = { lat: Number(lat), lng: Number(lng), namn: namn.join(',') || 'Delad adress' }
        return Number.isFinite(p.lat) && Number.isFinite(p.lng) && v ? { ...p, adress: p.namn } : null
      }
      // Antalet resenärer gäller även utan adress, t.ex. ?antal=4 från en familjesida.
      const n = Number(q.get('antal'))
      if (Number.isInteger(n) && n >= 1 && n <= 9) setAntal(n)
      const f = plats(q.get('fran'))
      if (!f) return
      setHem(f)
      const st = plats(q.get('stuga'))
      if (st) { setStuga(st); setVisaStuga(true) }
      if (/^\d{4}-\d{2}-\d{2}$/.test(q.get('dag') || '')) setDatum(q.get('dag'))
      if (/^\d{2}:\d{2}$/.test(q.get('tid') || '')) setTid(q.get('tid'))
      if (/^\d{4}-\d{2}-\d{2}$/.test(q.get('hem') || '')) setHemDatum(q.get('hem'))
      setAterstalld((n) => n + 1)
    }, 0)
    return () => clearTimeout(t)
  }, [])

  // Pauserna längs bilvägen hämtas av sig själva när bilresan är klar.
  const bilresa = resor?.bil
  useEffect(() => {
    if (!lib || !bilresa?.pauser?.length) return
    let aktuell = true
    stoppLangsVagen(lib, bilresa.pauser).then((s) => aktuell && setStopp(s)).catch(() => {})
    return () => { aktuell = false }
  }, [lib, bilresa])

  // När alla tre är klara väljs den snabbaste, om läsaren inte valt själv.
  useEffect(() => {
    if (!resor || anvandarenValde.current) return
    if (SATT.some((s) => resor[s] === undefined)) return
    const snabbast = SATT.filter((s) => resor[s] && !resor[s].saknas).sort((a, b) => resor[a].slut - resor[b].slut)[0]
    if (snabbast) setValt(snabbast)
  }, [resor])

  const hemat = riktning === 'hem'
  const [franPunkt, tillPunkt] = hemat ? [mal, hem] : [hem, mal]

  const valjFlyg = useCallback(async (f) => {
    const r = resor?.flyg
    if (!lib || !r?.bilDit) return
    const ny = await byggFlygresa(lib, franPunkt, tillPunkt, f, r.bilDit[f.fran], r.bilFran[f.till], { hemat }).catch(() => null)
    if (ny) {
      const flyg = { ...r, ...ny, tidigare: false }
      if (sparade.current[riktning]) sparade.current[riktning] = { ...sparade.current[riktning], flyg }
      setResor((x) => ({ ...x, flyg }))
    }
  }, [lib, resor, franPunkt, tillPunkt, hemat, riktning])

  const vald = valt && resor?.[valt] && !resor[valt].saknas ? resor[valt] : null
  const snabbast = resor && SATT.filter((s) => resor[s] && !resor[s].saknas).sort((a, b) => resor[a].slut - resor[b].slut)[0]

  return (
    <div className="resa">
      <style>{CSS}</style>

      <form onSubmit={sok} className="resa-form" style={{ background: KORT, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 'clamp(18px, 3vw, 28px)' }}>
        <div className="resa-falt-rad">
          <AdressFalt
            key={`fran-${aterstalld}`}
            id="resa-fran"
            label="Från"
            placeholder="Din adress, t.ex. Götgatan 12, Stockholm"
            varde={hem}
            onVal={setHem}
            lib={lib}
            laddaLib={laddaLib}
            position
          />
          <div className="resa-till">
            <span style={etikett}>Till</span>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 26, letterSpacing: '0.04em', color: TEXT, lineHeight: 1.2, marginTop: 6 }}>
              {stuga ? stuga.namn : ort.namn}
            </div>
            {!visaStuga && (
              <button type="button" className="resa-lank" onClick={() => setVisaStuga(true)}>
                + Lägg till stugans eller hotellets adress
              </button>
            )}
          </div>
        </div>

        {visaStuga && (
          <div style={{ marginTop: 14 }}>
            <AdressFalt
              key={`stuga-${aterstalld}`}
              id="resa-stuga"
              label="Stugan eller hotellet"
              placeholder={`Adress eller namn i ${ort.namn}`}
              varde={stuga}
              onVal={setStuga}
              lib={lib}
              laddaLib={laddaLib}
              nara={{ lat: ort.lat, lng: ort.lng }}
            />
          </div>
        )}

        <div className="resa-falt-rad resa-tid" style={{ marginTop: 14 }}>
          <label className="resa-falt">
            <span style={etikett}>Dag</span>
            <input type="date" lang="sv" value={datum} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDatum(e.target.value)} className="resa-input" />
          </label>
          <label className="resa-falt">
            <span style={etikett}>Åk tidigast</span>
            <input type="time" lang="sv" value={tid} step={900} onChange={(e) => setTid(e.target.value)} className="resa-input" />
          </label>
          <label className="resa-falt">
            <span style={etikett}>Hem</span>
            <input type="date" lang="sv" value={hemDatum} min={datum} onChange={(e) => setHemDatum(e.target.value)} className="resa-input" />
          </label>
          <label className="resa-falt">
            <span style={etikett}>Resenärer</span>
            <select value={antal} onChange={(e) => setAntal(Number(e.target.value))} className="resa-input">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => <option key={n} value={n}>{n} {n === 1 ? 'person' : 'personer'}</option>)}
            </select>
          </label>
          <button type="submit" disabled={!hem || soker} className="resa-knapp">
            {soker ? 'Räknar ut resan …' : 'Visa resan'}
          </button>
        </div>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(240,236,228,0.45)', margin: '14px 0 0', lineHeight: 1.6 }}>
          {laddarGoogle ? 'Laddar kartan från Google …' : 'Adressökningen och kartan kommer från Google och laddas när du klickar i fältet. Adressen sparas inte av Alpkoll.'}
          {googleFel && <span style={{ color: '#e8a0a0', display: 'block' }}>{googleFel}</span>}
          {!harNyckel() && <span style={{ color: '#e8a0a0', display: 'block' }}>Planeraren saknar Google-nyckel i den här miljön.</span>}
        </p>
      </form>

      {resor && (
        <div ref={resultat} style={{ scrollMarginTop: 80 }}>
          <div className="resa-riktning" role="tablist" aria-label="Dit eller hem">
            {[['dit', `Dit · ${dag(svenskTid(datum, tid))}`], ['hem', `Hem · ${dag(svenskTid(hemDatum, hemTid))}`]].map(([r, text]) => (
              <button
                key={r}
                type="button"
                role="tab"
                aria-selected={riktning === r}
                className={`resa-riktknapp${riktning === r ? ' vald' : ''}`}
                disabled={soker && riktning !== r}
                onClick={() => riktning !== r && sok(null, r)}
              >
                {versal(text)}
              </button>
            ))}
          </div>
          {hemat && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'rgba(240,236,228,0.5)', margin: '10px 0 0' }}>
              Hemresan räknas från klockan 10.00, när de flesta boenden checkar ut.
            </p>
          )}
          <div className="resa-kort-rad" role="tablist" aria-label="Färdsätt">
            {SATT.map((s) => (
              <Sattkort
                key={s}
                satt={s}
                r={resor[s]}
                vald={valt === s}
                snabbast={snabbast === s}
                onClick={() => { anvandarenValde.current = true; setValt(s); setAktiv(null) }}
              />
            ))}
          </div>

          <div className="resa-yta">
            <div className="resa-karta">
              <ResKarta
                lib={lib}
                resa={vald}
                hem={hem}
                mal={mal}
                stopp={valt === 'bil' ? stopp : []}
                aktiv={aktiv}
                onValjEtapp={setAktiv}
              />
              <Teckenforklaring resa={vald} />
            </div>

            <div className="resa-steg">
              {vald ? (
                <Tidslinje
                  resa={vald}
                  ort={ort}
                  mal={tillPunkt}
                  hemat={hemat}
                  aktiv={aktiv}
                  setAktiv={setAktiv}
                  stopp={valt === 'bil' ? stopp : []}
                  onValjFlyg={valjFlyg}
                />
              ) : null}
              {vald ? (
                <>
                  <Kostnad resa={vald} antal={antal} kurser={kurser} hemat={hemat} />
                  <Spara resa={vald} hem={hem} stuga={stuga} fran={franPunkt} till={tillPunkt} ort={ort} datum={datum} tid={tid} hemDatum={hemDatum} antal={antal} />
                </>
              ) : (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(240,236,228,0.55)', margin: 0 }}>
                  {soker ? 'Räknar ut resorna …' : 'Välj ett färdsätt ovanför.'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Vad resan kostar ────────────────────────────────────────────────────

function Kostnad({ resa, antal, kurser, hemat }) {
  const [forbrukning, setForbrukning] = useState(STANDARD_FORBRUKNING)
  const [literpris, setLiterpris] = useState(STANDARD_LITERPRIS)
  const k = kostnad(resa, { vuxna: antal, barn: 0 }, { forbrukning, literpris }, kurser)
  const tal = { fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }

  return (
    <section style={{ marginTop: 22 }}>
      {resa.satt === 'bil' && k.krav.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <h3 style={{ ...etikett, margin: '0 0 10px' }}>Det här gäller på vägen</h3>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {k.krav.map((x) => (
              <li key={x.rubrik} style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, lineHeight: 1.55, color: 'rgba(240,236,228,0.75)' }}>
                <span style={{ fontWeight: 600, color: TEXT }}>{x.rubrik}.</span> {x.text}
                {x.kalla && <> <a href={x.kalla} target="_blank" rel="noopener noreferrer" style={{ color: ACCENT, textDecoration: 'none', whiteSpace: 'nowrap' }}>Källa ›</a></>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px 16px' }}>
        <h3 style={{ ...etikett, margin: '0 0 10px' }}>Vad kostar resan {hemat ? 'hem' : 'dit'}</h3>
        {k.rader.length > 0 && (
          <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '8px 16px', fontFamily: 'var(--font-body)', fontSize: 13.5 }}>
            {k.rader.map((x) => (
              <div key={x.namn} style={{ display: 'contents' }}>
                <dt style={{ color: 'rgba(240,236,228,0.8)' }}>
                  {x.namn}
                  {x.not && <span style={{ display: 'block', fontSize: 12, color: 'rgba(240,236,228,0.45)' }}>{x.not}</span>}
                </dt>
                <dd style={{ margin: 0, color: TEXT, textAlign: 'right', ...tal }}>{heltal(Math.round(x.kr))} kr</dd>
              </div>
            ))}
            <dt style={{ fontWeight: 600, color: TEXT, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 8 }}>
              {resa.satt === 'bil' ? 'Hela bilen' : 'Totalt'}
            </dt>
            <dd style={{ margin: 0, fontWeight: 600, color: ACCENT, textAlign: 'right', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 8, ...tal }}>
              {heltal(Math.round(k.summa))} kr
            </dd>
          </dl>
        )}
        {k.rader.length > 0 && k.antal > 1 && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'rgba(240,236,228,0.55)', margin: '6px 0 0', textAlign: 'right' }}>
            {heltal(Math.round(k.perPerson))} kr per person, enkel väg
          </p>
        )}
        {k.ovrigt.length > 0 && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'rgba(240,236,228,0.55)', lineHeight: 1.6, margin: k.rader.length ? '10px 0 0' : 0 }}>
            Tillkommer: {k.ovrigt.join(', ').replace(/^./, (c) => c.toUpperCase())}.
          </p>
        )}
        {resa.satt === 'bil' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'rgba(240,236,228,0.6)' }}>
              Förbrukning
              <input type="number" inputMode="decimal" min="0.2" max="2" step="0.1" value={forbrukning} onChange={(e) => setForbrukning(Number(e.target.value) || STANDARD_FORBRUKNING)} className="resa-input resa-litet" /> l/mil
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'rgba(240,236,228,0.6)' }}>
              Literpris
              <input type="number" inputMode="decimal" min="5" max="40" step="0.5" value={literpris} onChange={(e) => setLiterpris(Number(e.target.value) || STANDARD_LITERPRIS)} className="resa-input resa-litet" /> kr
            </label>
          </div>
        )}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'rgba(240,236,228,0.4)', lineHeight: 1.55, margin: '10px 0 0' }}>
          {resa.satt === 'bil' && `Literpriset ${STANDARD_LITERPRIS} kr och förbrukningen är antaganden; ändra dem till din bil. `}
          {resa.satt === 'flyg' && (resa.flyget?.live ? 'Flygpriset är dagens lägsta för det flyget och kan ha ändrats. ' : 'Flygpriset är det lägsta Aviasales sett nyligen och kan ha ändrats. ')}
          Euro och franc räknas om till kronor med dagens kurs.
        </p>
      </div>
    </section>
  )
}

// ── Dela och spara ──────────────────────────────────────────────────────

const plats = (p) => `${p.lat.toFixed(4)},${p.lng.toFixed(4)},${(p.adress || p.namn || '').replace(/,/g, ' ')}`

function Spara({ resa, hem, stuga, fran, till, ort, datum, tid, hemDatum, antal }) {
  const [kopierad, setKopierad] = useState(false)

  const lank = () => {
    const q = new URLSearchParams({ fran: plats(hem), dag: datum, tid, hem: hemDatum, antal: String(antal) })
    if (stuga) q.set('stuga', plats(stuga))
    return `${window.location.origin}${window.location.pathname}?${q}#resan-hit`
  }

  const dela = async () => {
    const url = lank()
    const titel = `Resan till ${ort.namn}`
    try {
      if (navigator.share) { await navigator.share({ title: titel, url }); return }
      await navigator.clipboard.writeText(url)
      setKopierad(true)
      setTimeout(() => setKopierad(false), 2500)
    } catch { /* avbrutet av läsaren */ }
  }

  const kalender = () => {
    const ics = kalenderfil(resa, till, lank())
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
    a.download = `resan-till-${ort.slug}.ics`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }

  const lage = resa.satt === 'tag' ? 'transit' : 'driving'
  const maps = `https://www.google.com/maps/dir/?api=1&origin=${fran.lat},${fran.lng}&destination=${till.lat},${till.lng}&travelmode=${lage}`

  return (
    <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <button type="button" className="resa-sparknapp" onClick={dela}>{kopierad ? 'Länken är kopierad' : 'Dela resan'}</button>
        <button type="button" className="resa-sparknapp" onClick={kalender}>Lägg i kalendern</button>
        {resa.satt !== 'flyg' && (
          <a className="resa-sparknapp" href={maps} target="_blank" rel="noopener noreferrer">Öppna i Google Maps ›</a>
        )}
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'rgba(240,236,228,0.4)', margin: '8px 0 0', lineHeight: 1.5 }}>
        Länken innehåller adressen du skrev, så tänk på vem du delar den med.
      </p>
    </div>
  )
}

/** En kalenderhändelse för hela resan, med stegen i beskrivningen. */
function kalenderfil(resa, mal, url) {
  const utc = (ms) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const esc = (t) => String(t).replace(/\\/g, '\\\\').replace(/[,;]/g, (m) => `\\${m}`).replace(/\n/g, '\\n')
  const steg = resa.etapper
    .filter((e) => e.typ !== 'vanta')
    .map((e) => `${klocka(e.start)} ${TYPNAMN[e.typ] || ''}${e.linje ? ` ${e.linje}` : ''} till ${e.till?.namn || ''}`.trim())
  const rader = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Alpkoll//Reseplaneraren//SV', 'BEGIN:VEVENT',
    `UID:${resa.start}-${Math.round(mal.lat * 1e4)}@alpkoll.se`,
    `DTSTAMP:${utc(Date.now())}`,
    `DTSTART:${utc(resa.start)}`,
    `DTEND:${utc(resa.slut)}`,
    `SUMMARY:${esc(`Resan till ${mal.namn} (${SATTNAMN[resa.satt].toLowerCase()})`)}`,
    `DESCRIPTION:${esc([...steg, '', url].join('\n'))}`,
    `LOCATION:${esc(mal.namn)}`,
    'END:VEVENT', 'END:VCALENDAR',
  ]
  return rader.join('\r\n')
}

// ── Adressfältet ────────────────────────────────────────────────────────

function AdressFalt({ id, label, placeholder, varde, onVal, lib, laddaLib, position = false, nara }) {
  const [text, setText] = useState(varde?.adress || varde?.namn || '')
  const [forslag, setForslag] = useState([])
  const [oppen, setOppen] = useState(false)
  const [markerad, setMarkerad] = useState(-1)
  const [hamtarPos, setHamtarPos] = useState(false)
  const session = useRef(null)
  const timer = useRef(null)
  const senaste = useRef('')

  useEffect(() => () => clearTimeout(timer.current), [])

  const hamtaForslag = (input, l = lib) => {
    clearTimeout(timer.current)
    if (!l || input.length < 3) {
      setForslag([])
      return
    }
    timer.current = setTimeout(async () => {
      const { AutocompleteSessionToken, AutocompleteSuggestion } = l.places
      if (!session.current) session.current = new AutocompleteSessionToken()
      try {
        const fraga = { input, sessionToken: session.current, language: 'sv', region: 'se' }
        if (nara) fraga.locationBias = { center: nara, radius: 30000 }
        else fraga.includedRegionCodes = ['se', 'no', 'dk', 'fi']
        const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(fraga)
        setForslag((suggestions || []).filter((x) => x.placePrediction).slice(0, 5))
        setOppen(true)
        setMarkerad(-1)
      } catch {
        setForslag([])
      }
    }, 220)
  }

  const valj = async (s) => {
    const p = s.placePrediction
    const place = p.toPlace()
    await place.fetchFields({ fields: ['location', 'formattedAddress', 'displayName'] })
    const huvud = p.mainText?.text || place.displayName || p.text?.text
    session.current = null
    setText(p.text?.text || place.formattedAddress)
    setForslag([])
    setOppen(false)
    onVal({ namn: huvud, adress: p.text?.text || place.formattedAddress, lat: place.location.lat(), lng: place.location.lng() })
  }

  const minPosition = () => {
    if (!navigator.geolocation) return
    setHamtarPos(true)
    laddaLib().catch(() => {})
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setHamtarPos(false)
        setText('Din position')
        onVal({ namn: 'Din position', adress: 'Din position', lat: p.coords.latitude, lng: p.coords.longitude })
      },
      () => setHamtarPos(false),
      { enableHighAccuracy: false, timeout: 10000 },
    )
  }

  return (
    <div className="resa-falt" style={{ position: 'relative' }}>
      <label htmlFor={id} style={etikett}>{label}</label>
      <input
        id={id}
        className="resa-input"
        type="text"
        autoComplete="off"
        role="combobox"
        aria-expanded={oppen && forslag.length > 0}
        aria-controls={`${id}-lista`}
        placeholder={placeholder}
        value={text}
        onFocus={() => {
          // Skriver läsaren innan Google hunnit laddas hämtas förslagen när det är klart.
          laddaLib().then((l) => { if (!lib && senaste.current) hamtaForslag(senaste.current, l) }).catch(() => {})
          if (forslag.length) setOppen(true)
        }}
        onBlur={() => setTimeout(() => setOppen(false), 150)}
        onChange={(e) => { senaste.current = e.target.value; setText(e.target.value); hamtaForslag(e.target.value); if (varde) onVal(null) }}
        onKeyDown={(e) => {
          if (!oppen || !forslag.length) return
          if (e.key === 'ArrowDown') { e.preventDefault(); setMarkerad((m) => Math.min(m + 1, forslag.length - 1)) }
          if (e.key === 'ArrowUp') { e.preventDefault(); setMarkerad((m) => Math.max(m - 1, 0)) }
          if (e.key === 'Enter' && markerad >= 0) { e.preventDefault(); valj(forslag[markerad]) }
          if (e.key === 'Escape') setOppen(false)
        }}
      />
      {varde && <span aria-hidden="true" style={{ position: 'absolute', right: 12, top: 35, color: ACCENT, fontSize: 14 }}>✓</span>}
      {oppen && forslag.length > 0 && (
        <ul id={`${id}-lista`} role="listbox" className="resa-lista">
          {forslag.map((s, i) => (
            <li
              key={s.placePrediction.placeId}
              role="option"
              aria-selected={i === markerad}
              onMouseDown={(e) => { e.preventDefault(); valj(s) }}
              className={i === markerad ? 'markerad' : ''}
            >
              <span style={{ color: TEXT }}>{s.placePrediction.mainText?.text}</span>
              <span style={{ color: 'rgba(240,236,228,0.45)', marginLeft: 8, fontSize: 13 }}>{s.placePrediction.secondaryText?.text}</span>
            </li>
          ))}
          <li className="resa-google" aria-hidden="true">Förslag från Google</li>
        </ul>
      )}
      {position && (
        <button type="button" className="resa-lank" onClick={minPosition} disabled={hamtarPos}>
          {hamtarPos ? 'Hämtar din position …' : '◎ Använd min position'}
        </button>
      )}
    </div>
  )
}

// ── Korten för bil, tåg och flyg ────────────────────────────────────────

function Ikon({ satt, farg = 'currentColor', storlek = 18 }) {
  const p = { width: storlek, height: storlek, viewBox: '0 0 24 24', fill: 'none', stroke: farg, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  if (satt === 'bil' || satt === 'transfer') return <svg {...p}><path d="M5 16V11l2-5h10l2 5v5" /><path d="M3 16h18v2H3z" /><circle cx="7.5" cy="18.5" r="1.5" /><circle cx="16.5" cy="18.5" r="1.5" /><path d="M5 11h14" /></svg>
  if (satt === 'tag') return <svg {...p}><rect x="6" y="3" width="12" height="13" rx="3" /><path d="M6 10h12" /><circle cx="9" cy="13" r=".6" /><circle cx="15" cy="13" r=".6" /><path d="M8 20l2-4M16 20l-2-4" /></svg>
  if (satt === 'buss') return <svg {...p}><rect x="5" y="3" width="14" height="14" rx="2" /><path d="M5 11h14M7 20v-3M17 20v-3" /></svg>
  if (satt === 'flyg') return <svg {...p}><path d="M10.5 13.5 3 11l1.5-1.5 7.5 1L16 6.5c1-1 2.5-1.5 3-1s0 2-1 3L14 12.5l1 7.5-1.5 1.5-2.5-7.5L7.5 17l.5 2.5-1 1L5.5 18 3 16.5l1-1 2.5.5z" /></svg>
  if (satt === 'gang') return <svg {...p}><circle cx="13" cy="4" r="1.6" /><path d="M10 21l2-6 3 3v3M9 12l2-5 3 2 3 3M12 15l-1-4" /></svg>
  if (satt === 'vanta') return <svg {...p}><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></svg>
  return <svg {...p}><circle cx="12" cy="12" r="4" /></svg>
}

function Sattkort({ satt, r, vald, snabbast, onClick }) {
  const raknar = r === undefined
  const saknas = r?.saknas
  return (
    <button
      type="button"
      role="tab"
      aria-selected={vald}
      onClick={onClick}
      disabled={raknar || !!saknas}
      className={`resa-sattkort${vald ? ' vald' : ''}`}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: vald ? ACCENT : 'rgba(240,236,228,0.75)' }}>
        <Ikon satt={satt} />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, letterSpacing: '0.02em' }}>{SATTNAMN[satt]}</span>
        {snabbast && !raknar && !saknas && <span className="resa-bricka">Först framme</span>}
      </span>
      {raknar && <span className="resa-skelett" aria-label="Räknas ut" />}
      {saknas && <span style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'rgba(240,236,228,0.45)', lineHeight: 1.45, textAlign: 'left' }}>{saknas}</span>}
      {!raknar && !saknas && (
        <>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 30, letterSpacing: '0.03em', color: TEXT, lineHeight: 1 }}>{langd(r.min)}</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(240,236,228,0.6)' }}>
            {klocka(r.start)} → {klocka(r.slut)}{dagarSenare(r.start, r.slut) > 0 ? ` +${dagarSenare(r.start, r.slut)}` : ''}
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(240,236,228,0.45)' }}>{underrad(r)}</span>
        </>
      )}
    </button>
  )
}

const versal = (t) => t.charAt(0).toUpperCase() + t.slice(1)

function underrad(r) {
  if (r.satt === 'bil') {
    const natt = r.pauser?.some((p) => p.natt)
    const antal = (r.pauser?.length || 0) - (natt ? 1 : 0)
    const delar = [`${heltal(r.km)} km`]
    if (antal) delar.push(`${antal} ${antal === 1 ? 'paus' : 'pauser'}`)
    if (natt) delar.push('en övernattning')
    return delar.join(' · ')
  }
  if (r.satt === 'flyg') {
    const f = r.flyget
    const delar = [f.bolag, `${f.fran}–${f.till}`]
    if (Number.isFinite(f.pris)) delar.push(`från ${heltal(f.pris)} kr/person`)
    return delar.filter(Boolean).join(' · ')
  }
  return r.byten === 0 ? 'Inga byten' : r.byten === 1 ? '1 byte' : `${r.byten} byten`
}

function Teckenforklaring({ resa }) {
  if (!resa) return null
  const typer = [...new Set(resa.etapper.map((e) => e.typ).filter((t) => t !== 'vanta'))]
  return (
    <div className="resa-forklaring">
      {typer.map((t) => (
        <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 18, height: 0, borderTop: `3px ${t === 'gang' ? 'dotted' : t === 'flyg' || t === 'transfer' ? 'dashed' : 'solid'} ${FARG[t] || FARG.annat}` }} />
          {TYPNAMN[t]}
        </span>
      ))}
    </div>
  )
}

// ── Tidslinjen ──────────────────────────────────────────────────────────

function Tidslinje({ resa, ort, mal, hemat, aktiv, setAktiv, stopp, onValjFlyg }) {
  const rader = []
  resa.etapper.forEach((e, i) => {
    const forra = resa.etapper[i - 1]
    if (forra && e.typ !== 'vanta' && forra.typ !== 'vanta' && e.start - forra.slut >= 5 * 60000) {
      rader.push({ vant: true, plats: forra.till?.namn, min: (e.start - forra.slut) / 60000, start: forra.slut, key: `v${i}` })
    }
    rader.push({ e, i, key: `e${i}` })
    // Bilresans pauser står i tidslinjen, på ungefär den tid du är där.
    if (e.typ === 'bil' && resa.satt === 'bil') {
      ;(stopp.length ? stopp : resa.pauser || []).forEach((p, j) => {
        rader.push({ paus: true, p, nr: j + 1, start: p.startMs ?? e.start + p.efterMin * 60000, laddar: !stopp.length, key: `p${i}-${j}` })
      })
    }
  })

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '4px 14px', marginBottom: 18 }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 30, letterSpacing: '0.03em', color: TEXT, margin: 0, fontWeight: 400 }}>
          {SATTNAMN[resa.satt]} · {langd(resa.min)}
        </h2>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(240,236,228,0.55)' }}>{versal(dag(resa.start))}</span>
      </div>

      {resa.flyget?.narliggande && (
        <p className="resa-notis">Inget flyg har synts för just den dagen. Här är närmaste dag med flyg, {dag(Date.parse(resa.flyget.avgang))}. Sök på ditt datum hos Aviasales för att se alla avgångar.</p>
      )}

      {resa.tidigare && !resa.flyget?.narliggande && (
        <p className="resa-notis">Inget flyg den dagen går att hinna om du åker {klocka(resa.valdStart)}. Här är dagens snabbaste resa med flyg, och då behöver du åka hemifrån {klocka(resa.start)}.</p>
      )}

      <ol className="resa-lista-steg">
        {rader.map((r) => r.paus ? (
          <Pausrad key={r.key} r={r} ort={ort} />
        ) : r.vant ? (
          <li key={r.key} className="resa-rad vanta-rad">
            <span className="resa-klocka" />
            <span className="resa-prick liten" />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'rgba(240,236,228,0.45)' }}>
              Byte{r.plats ? ` i ${r.plats}` : ''} · {langd(r.min)} väntetid
            </span>
          </li>
        ) : (
          <Etapprad key={r.key} e={r.e} i={r.i} aktiv={aktiv === r.i} onClick={() => setAktiv(aktiv === r.i ? null : r.i)} ort={ort} />
        ))}
        <li className="resa-rad">
          <span className="resa-klocka" style={{ color: ACCENT }}>{klocka(resa.slut)}{dagarSenare(resa.start, resa.slut) > 0 && <sup style={{ fontSize: 10, marginLeft: 1 }}>+{dagarSenare(resa.start, resa.slut)}</sup>}</span>
          <span className="resa-prick" style={{ background: ACCENT, borderColor: ACCENT }} />
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: TEXT }}>{hemat ? 'Framme hemma' : `Framme i ${mal.namn}`}</div>
          </div>
        </li>
      </ol>

      {resa.satt === 'flyg' && resa.alternativ?.length > 1 && (
        <AndraFlyg alternativ={resa.alternativ} valt={resa.flyget} onValj={onValjFlyg} />
      )}

      <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(240,236,228,0.4)', lineHeight: 1.6, margin: '22px 0 0' }}>
        {resa.satt === 'bil' && `Körtiden är Googles för normal trafik${resa.pausMin ? `, och ${resa.pauser?.some((p) => p.natt) ? 'pauserna och natten' : 'pauserna'} lägger till ${langd(resa.pausMin)}` : ''}. Vinterväglag och köer gör resan längre. `}
        {resa.satt === 'flyg' && `Vi räknar med att du är på flygplatsen ${langd(FLYGPLATS_FORE)} före avgång. ${resa.flyget?.live ? 'Flygen och priserna är hämtade live för dagen och sparas i högst tre timmar; priset kan ha ändrats när du bokar.' : 'Flygen kommer från Aviasales sökningar de senaste dygnen; priset gäller när det syntes och kan ha ändrats.'} `}
        {resa.etapper.some((e) => ['tag', 'buss', 'annat'].includes(e.typ)) && 'Tåg- och busstiderna är Googles tidtabeller. Kontrollera tiden hos bolaget innan du bokar.'}
      </p>
    </div>
  )
}

function Etapprad({ e, aktiv, onClick, ort }) {
  const farg = e.typ === 'vanta' ? 'rgba(240,236,228,0.3)' : (FARG[e.typ] || FARG.annat)
  const { titel, rad, extra } = beskriv(e, ort)
  return (
    <li className={`resa-rad${aktiv ? ' aktiv' : ''}${e.typ === 'vanta' ? ' vanta-rad' : ''}`}>
      <span className="resa-klocka">{klocka(e.start)}</span>
      <span className="resa-prick" style={{ borderColor: farg }} />
      <span className="resa-strack" style={{ background: farg, opacity: e.typ === 'vanta' ? 0.4 : 0.9, ...(e.typ === 'gang' ? { background: 'none', borderLeft: `2px dotted ${farg}` } : {}) }} />
      <div style={{ minWidth: 0 }}>
        <button type="button" onClick={onClick} className="resa-etapp-knapp" disabled={e.typ === 'vanta'}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: farg }}>
            <Ikon satt={e.typ} farg={farg} storlek={16} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: e.typ === 'vanta' ? 13 : 15, fontWeight: e.typ === 'vanta' ? 400 : 600, color: e.typ === 'vanta' ? 'rgba(240,236,228,0.55)' : TEXT }}>{titel}</span>
          </span>
        </button>
        {rad && <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(240,236,228,0.55)', lineHeight: 1.55, marginTop: 3 }}>{rad}</div>}
        {extra}
      </div>
    </li>
  )
}

function beskriv(e, ort) {
  const tidsrad = (delar) => delar.filter(Boolean).join(' · ')
  switch (e.typ) {
    case 'bil':
      return { titel: `Bil till ${e.till.namn}`, rad: tidsrad([`${heltal(e.km)} km`, `${langd(e.min)} körning`]) }
    case 'transfer':
      return {
        titel: `Transfer till ${e.till.namn}${e.till.kod ? ' flygplats' : ''}`,
        rad: tidsrad([`${heltal(e.km)} km`, `${langd(e.min)} med bil`]),
        extra: (
          <div style={{ marginTop: 10 }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'rgba(240,236,228,0.55)', lineHeight: 1.55, margin: '0 0 8px' }}>
              Delad transferbuss eller egen taxi från flygplatsen bokas i förväg. Priset ser du när du söker, och hyrbil går också.
            </p>
            <Partnerlank partner="holidaytaxis" sid={`resa-transfer-${ort.slug}`} style={knappLiten} markningStyle={{ marginBottom: 6 }}>
              Boka transfer hos Holiday Taxis ›
            </Partnerlank>
          </div>
        ),
      }
    case 'gang':
      return { titel: `Gå till ${e.till?.namn || 'nästa hållplats'}`, rad: langd(e.min) }
    case 'vanta':
      return { titel: e.namn, rad: langd((e.slut - e.start) / 60000) }
    case 'flyg': {
      const kod = `${e.fran.kod}–${e.till.kod}`
      return {
        titel: `${e.bolag || 'Flyg'}${e.linje ? ` ${e.linje.replace(/^\S+\s/, '')}` : ''} till ${e.till.namn}`,
        rad: tidsrad([kod, langd(e.min), e.byten ? `${e.byten} byte` : 'direkt', Number.isFinite(e.pris) ? `från ${heltal(e.pris)} kr` : null, `landar ${klocka(e.slut)}`]),
        extra: e.lank && (
          <div style={{ marginTop: 10 }}>
            <Partnerlank partner="aviasales" sid={`resa-flyg-${ort.slug}`} sok={{ url: e.lank }} style={knappLiten} markningStyle={{ marginBottom: 6 }}>
              Se livepris och boka ›
            </Partnerlank>
          </div>
        ),
      }
    }
    default: {
      const namn = TYPNAMN[e.typ]
      const nummer = e.typ === 'tag' && e.tagnummer && e.tagnummer !== e.linje ? ` ${e.tagnummer}` : ''
      return {
        titel: `${namn} ${e.linje || ''}${nummer}${e.riktning ? ` mot ${e.riktning}` : ''}`.replace(/\s+/g, ' ').trim(),
        rad: tidsrad([
          e.bolag,
          `${e.fran.namn} ${klocka(e.start)} → ${e.till.namn} ${klocka(e.slut)}`,
          e.hallplatser ? `${e.hallplatser} hållplatser` : null,
          langd((e.slut - e.start) / 60000),
        ]),
        extra: e.lank && (
          <div style={{ marginTop: 8 }}>
            <Partnerlank partner="direkt" sok={{ url: e.lank }} markning={null} style={{ ...knappLiten, background: 'none', color: ACCENT, padding: 0, border: 0 }}>
              Biljett hos {e.bolag} ›
            </Partnerlank>
          </div>
        ),
      }
    }
  }
}

const knappLiten = {
  display: 'inline-block', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
  color: '#121110', background: ACCENT, borderRadius: 6, padding: '8px 14px', textDecoration: 'none',
}

/** Mellan 11 och 14 svensk tid heter pausen lunch. */
function arLunch(ms) {
  const t = Number(new Intl.DateTimeFormat('sv-SE', { hour: 'numeric', timeZone: 'Europe/Stockholm' }).format(new Date(ms)))
  return t >= 11 && t < 14
}

function Pausrad({ r, ort }) {
  const { p, nr, start, laddar } = r
  const incheckning = datumFor(start)
  const fortsatt = start + (p.langdMin || 0) * 60000
  return (
    <li className="resa-rad">
      <span className="resa-klocka" style={{ color: 'rgba(240,236,228,0.6)', fontWeight: 500 }}>ca {klocka(Math.round(start / 900000) * 900000)}</span>
      <span style={{ width: 18, height: 18, borderRadius: 9, border: `2px solid ${ACCENT}`, background: '#1c1a17', color: ACCENT, fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', marginTop: 1, position: 'relative', zIndex: 1, marginLeft: -2 }}>{nr}</span>
      <span className="resa-strack" style={{ background: FARG.bil, opacity: 0.9 }} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: TEXT }}>
          {p.natt ? 'Övernatta' : arLunch(start) ? 'Lunch' : 'Paus'}{p.ort ? ` i ${p.ort}` : ''}
          <span style={{ fontWeight: 400, fontSize: 12.5, color: 'rgba(240,236,228,0.5)', marginLeft: 8 }}>
            {p.natt ? `vidare ${klocka(fortsatt)} nästa morgon · ` : p.langdMin ? `${p.langdMin} min · ` : ''}efter {langd(Math.round(p.efterMin / 15) * 15)} bakom ratten
          </span>
        </div>
        {p.natt && p.ort && (
          <div style={{ marginTop: 8 }}>
            <Partnerlank
              partner="booking"
              sid={`resa-natt-${ort.slug}`}
              sok={{ destination: p.ort, checkin: incheckning, checkout: plusDagar(incheckning, 1) }}
              style={knappLiten}
              markningStyle={{ marginBottom: 6 }}
            >
              Hotell i {p.ort} på Booking ›
            </Partnerlank>
          </div>
        )}
        {laddar && <span className="resa-skelett" style={{ width: '70%' }} aria-label="Hämtar lunchställen" />}
        {!!p.platser?.length && (
          <ul style={{ listStyle: 'none', margin: '8px 0 0', padding: '10px 12px', display: 'grid', gap: 6, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8 }}>
            <li style={{ ...etikett, fontSize: 9.5, marginBottom: 2 }}>Mest besökta matställena i närheten enligt Google</li>
            {p.platser.map((pl, j) => (
              <li key={`${pl.namn}-${j}`} style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, lineHeight: 1.4 }}>
                {pl.lank
                  ? <a href={pl.lank} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(240,236,228,0.88)', textDecoration: 'none' }}>{pl.namn} <span style={{ color: ACCENT }}>›</span></a>
                  : <span style={{ color: 'rgba(240,236,228,0.88)' }}>{pl.namn}</span>}
                {pl.typ && <span style={{ color: 'rgba(240,236,228,0.4)' }}> · {pl.typ}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  )
}

function AndraFlyg({ alternativ, valt, onValj }) {
  return (
    <section style={{ marginTop: 26 }}>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, letterSpacing: '0.04em', color: TEXT, margin: '0 0 12px', fontWeight: 400 }}>Flyg samma dag</h3>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
        {alternativ.map((f) => {
          const arValt = f.nummer === valt.nummer && f.avgang === valt.avgang && f.till === valt.till
          return (
            <li key={`${f.nummer}${f.avgang}${f.till}`}>
              <button type="button" onClick={() => onValj(f)} disabled={arValt} className={`resa-flygrad${arValt ? ' vald' : ''}`}>
                <span style={{ fontWeight: 600, color: TEXT }}>{klocka(Date.parse(f.avgang))}–{klocka(Date.parse(f.ankomst))}</span>
                <span>{f.bolag} · {f.fran}–{f.till}{f.byten ? ` · ${f.byten} byte` : ''}</span>
                <span style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  {Number.isFinite(f.pris) ? `${heltal(f.pris)} kr` : ''}
                  <span style={{ display: 'block', fontSize: 11.5, color: 'rgba(240,236,228,0.45)' }}>framme ca {klocka(f.framme)}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(240,236,228,0.4)', margin: '8px 0 0' }}>
        Flygplatser: {[...new Set(alternativ.flatMap((f) => [f.fran, f.till]))].map((k) => `${k} ${FLYGPLATSER[k]?.namn || ''}`).join(', ')}.
      </p>
    </section>
  )
}

const CSS = `
.resa-falt-rad { display: grid; grid-template-columns: 1fr; gap: 14px; }
@media (min-width: 760px) {
  .resa-falt-rad { grid-template-columns: 1.4fr 1fr; align-items: start; }
  .resa-tid { grid-template-columns: repeat(4, minmax(0, 1fr)) 1.2fr; align-items: end; }
}
.resa-falt { display: flex; flex-direction: column; gap: 6px; }
.resa-input {
  width: 100%; box-sizing: border-box; background: #121110; color: #f0ece4; color-scheme: dark;
  border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 13px 14px;
  font-family: var(--font-body); font-size: 16px; outline: none; transition: border-color .15s;
}
.resa-input:focus { border-color: #D4A574; }
.resa-litet { width: 72px; padding: 7px 8px; font-size: 14px; }
select.resa-input { appearance: none; cursor: pointer; }
.resa-input::placeholder { color: rgba(240,236,228,0.35); }
.resa-knapp {
  background: #D4A574; color: #121110; border: 0; border-radius: 8px; padding: 14px 20px;
  font-family: var(--font-body); font-size: 15px; font-weight: 600; letter-spacing: .02em; cursor: pointer;
  transition: opacity .15s, transform .15s;
}
.resa-knapp:hover:not(:disabled) { transform: translateY(-1px); }
.resa-knapp:disabled { opacity: .45; cursor: default; }
.resa-knapp:focus-visible, .resa-lank:focus-visible, .resa-sattkort:focus-visible, .resa-etapp-knapp:focus-visible, .resa-flygrad:focus-visible { outline: 2px solid #D4A574; outline-offset: 2px; }
.resa-lank {
  align-self: flex-start; background: none; border: 0; padding: 6px 0 0; cursor: pointer;
  font-family: var(--font-body); font-size: 13px; color: #D4A574;
}
.resa-lista {
  position: absolute; z-index: 20; top: 100%; left: 0; right: 0; margin: 4px 0 0; padding: 6px 0; list-style: none;
  background: #24211d; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; box-shadow: 0 12px 30px rgba(0,0,0,.45);
}
.resa-lista li { padding: 10px 14px; font-family: var(--font-body); font-size: 14.5px; cursor: pointer; }
.resa-lista li:hover, .resa-lista li.markerad { background: rgba(212,165,116,0.12); }
.resa-lista li.resa-google { cursor: default; font-size: 11px; color: rgba(240,236,228,0.35); padding: 6px 14px 4px; }
.resa-lista li.resa-google:hover { background: none; }
.resa-riktning { display: inline-flex; gap: 4px; margin-top: 22px; padding: 4px; background: #1c1a17; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; }
.resa-riktknapp { background: none; border: 0; border-radius: 7px; padding: 8px 14px; cursor: pointer; font-family: var(--font-body); font-size: 13.5px; font-weight: 600; color: rgba(240,236,228,0.6); }
.resa-riktknapp.vald { background: #D4A574; color: #121110; }
.resa-riktknapp:disabled { opacity: .5; cursor: default; }
.resa-riktknapp:focus-visible { outline: 2px solid #D4A574; outline-offset: 2px; }
.resa-kort-rad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 22px 0 14px; }
.resa-sattkort {
  display: flex; flex-direction: column; align-items: flex-start; gap: 8px; text-align: left; cursor: pointer;
  background: #1c1a17; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 14px 14px 16px;
  min-height: 132px; transition: border-color .15s, background .15s;
}
.resa-sattkort:hover:not(:disabled) { border-color: rgba(212,165,116,0.45); }
.resa-sattkort.vald { border-color: #D4A574; background: linear-gradient(180deg, rgba(212,165,116,0.10), #1c1a17 70%); }
.resa-sattkort:disabled { cursor: default; }
.resa-bricka { font-family: var(--font-body); font-size: 10px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: #121110; background: #D4A574; border-radius: 4px; padding: 2px 6px; }
@media (max-width: 560px) {
  .resa-kort-rad { grid-template-columns: 1fr; }
  .resa-sattkort { min-height: 0; display: grid; grid-template-columns: auto 1fr; column-gap: 14px; row-gap: 2px; align-items: center; }
  .resa-sattkort > span:first-child { grid-column: 1 / -1; }
}
.resa-skelett { display: block; width: 80%; height: 14px; border-radius: 4px; background: linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.12), rgba(255,255,255,0.05)); background-size: 200% 100%; animation: resa-glans 1.2s linear infinite; margin-top: 8px; }
@keyframes resa-glans { from { background-position: 200% 0 } to { background-position: -200% 0 } }
@media (prefers-reduced-motion: reduce) { .resa-skelett { animation: none; } }
.resa-yta { display: grid; grid-template-columns: 1fr; gap: 18px; }
.resa-karta { position: relative; height: 58vh; min-height: 360px; border-radius: 14px; overflow: hidden; border: 1px solid rgba(255,255,255,0.07); }
/* På mobil kommer svaret först: tidslinjen överst, kartan under den. */
@media (max-width: 979px) {
  .resa-steg { order: -1; }
  .resa-karta { height: 46vh; min-height: 300px; }
}
@media (min-width: 980px) {
  .resa-yta { grid-template-columns: minmax(0, 1.35fr) minmax(360px, 1fr); align-items: start; }
  .resa-karta { position: sticky; top: 88px; height: calc(100vh - 120px); max-height: 760px; }
}
.resa-forklaring {
  position: absolute; left: 10px; top: 10px; display: flex; flex-wrap: wrap; gap: 6px 14px; max-width: calc(100% - 70px);
  background: rgba(18,17,16,0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 12px;
  font-family: var(--font-body); font-size: 12px; color: rgba(240,236,228,0.75);
}
.resa-steg { background: #1c1a17; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: clamp(18px, 3vw, 26px); }
.resa-lista-steg { list-style: none; margin: 0; padding: 0; }
.resa-rad { position: relative; display: grid; grid-template-columns: 46px 18px minmax(0, 1fr); column-gap: 10px; padding: 0 0 18px; }
.resa-rad.vanta-rad { padding-bottom: 14px; }
.resa-klocka { font-family: var(--font-body); font-size: 14px; font-weight: 600; color: #f0ece4; text-align: right; padding-top: 1px; font-variant-numeric: tabular-nums; }
.resa-prick { width: 12px; height: 12px; border-radius: 50%; border: 2.5px solid #f0ece4; background: #1c1a17; margin: 4px 0 0 1px; position: relative; z-index: 1; box-sizing: border-box; }
.resa-prick.liten { width: 8px; height: 8px; border-width: 0; background: rgba(240,236,228,0.25); margin: 5px 0 0 3px; }
.resa-strack { position: absolute; left: calc(46px + 10px + 6px); top: 18px; bottom: 0; width: 3px; border-radius: 2px; transform: translateX(-1px); }
.resa-etapp-knapp { background: none; border: 0; padding: 0; text-align: left; cursor: pointer; }
.resa-etapp-knapp:disabled { cursor: default; }
.resa-rad.aktiv .resa-etapp-knapp span span { text-decoration: underline; text-decoration-color: #D4A574; text-underline-offset: 4px; }
.resa-notis { font-family: var(--font-body); font-size: 13px; line-height: 1.6; color: #f0ece4; background: rgba(212,165,116,0.12); border-left: 3px solid #D4A574; border-radius: 4px; padding: 10px 12px; margin: 0 0 16px; }
.resa-flygrad {
  width: 100%; display: flex; align-items: center; gap: 12px; cursor: pointer; text-align: left;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px 12px;
  font-family: var(--font-body); font-size: 13px; color: rgba(240,236,228,0.65);
}
.resa-flygrad:hover:not(:disabled) { border-color: rgba(212,165,116,0.45); }
.resa-sparknapp {
  display: inline-flex; align-items: center; background: transparent; color: #f0ece4; cursor: pointer; text-decoration: none;
  border: 1px solid rgba(255,255,255,0.14); border-radius: 8px; padding: 9px 14px;
  font-family: var(--font-body); font-size: 13px; font-weight: 500;
}
.resa-sparknapp:hover { border-color: #D4A574; }
.resa-sparknapp:focus-visible { outline: 2px solid #D4A574; outline-offset: 2px; }
.resa-flygrad.vald { border-color: #D4A574; cursor: default; }
`
