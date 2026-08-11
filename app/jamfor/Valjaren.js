'use client'

// Väljaren på /jamfor.
//
// Sidan var först en lista med 83 textlänkar — en sitemap som råkat hamna
// framför besökaren. Den som klickar "Jämför" har oftast redan två orter i
// huvudet, och att leta rätt på dem i en lista på 83 rader är fel arbete
// att be om.
//
// Korten bär bild och de två tal som skiljer orterna mest, så skillnaden
// syns redan medan man väljer. Alla 30 publicerade orter går att välja,
// inte bara de kuraterade paren: en väljare som svarar "den jämförelsen
// finns inte" på 352 av 435 par är inget verktyg. Vilka par vi
// marknadsför är en annan fråga och avgörs i lib/jamfor.js.

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const ACCENT = '#D4A574'

const URVAL = [
  { id: 'alla', etikett: 'Alla' },
  { id: 'norden', etikett: 'Norden' },
  { id: 'alperna', etikett: 'Alperna' },
]

/**
 * Jämförbar form av en söksträng.
 *
 * Halva ortnamnen på sajten bär tecken som ingen skriver när det går
 * fort: Åre, Sälen, Sölden, Kitzbühel, Riksgränsen, Méribel. NFD delar
 * bokstaven i grundtecken och accent, och regexen kastar accenten — så
 * "solden" hittar Sölden och "meribel" hittar Méribel.
 *
 * Det gäller åt båda hållen. Skriver någon "Åre" med rätt tecken matchar
 * det fortfarande, eftersom namnet normaliseras på samma sätt.
 *
 * Accentintervallet skrivs som \u-koder och inte som tecknen själva. Ett
 * kombinerande tecken i källkoden går inte att skilja från ingenting när
 * man läser filen — samma skäl som det hårda mellanslaget i lib/pris.js.
 */
const ACCENTER = new RegExp('[\\u0300-\\u036f]', 'g')

const normalisera = (text) =>
  String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(ACCENTER, '')
    .trim()

export default function Valjaren({ orter }) {
  const [valda, setValda] = useState([])
  const [urval, setUrval] = useState('alla')
  const [sok, setSok] = useState('')
  const sokRuta = useRef(null)

  // Tredje klicket ersätter den först valda i stället för att göra
  // ingenting. Att tvinga fram ett avmarkerande klick är en osynlig regel.
  const vaxla = (slug) =>
    setValda((f) =>
      f.includes(slug) ? f.filter((s) => s !== slug) : [...f, slug].slice(-2)
    )

  const sokbara = useMemo(
    () => orter.map((o) => ({ ...o, sokord: normalisera(`${o.name} ${o.land} ${o.region || ''}`) })),
    [orter]
  )

  const fras = normalisera(sok)

  // Namn som börjar på det man skrivit läggs först. Skriver man "va" ska
  // Val Thorens ligga före Riksgränsen, som bara råkar innehålla samma två
  // bokstäver längre in.
  const synliga = useMemo(() => {
    const iUrvalet = sokbara.filter(
      (o) => urval === 'alla' || (urval === 'norden' ? o.nordisk : !o.nordisk)
    )
    if (!fras) return iUrvalet

    const traffar = iUrvalet.filter((o) => o.sokord.includes(fras))
    return traffar.sort((x, y) => {
      const xb = normalisera(x.name).startsWith(fras)
      const yb = normalisera(y.name).startsWith(fras)
      return xb === yb ? 0 : xb ? -1 : 1
    })
  }, [sokbara, urval, fras])

  // Enter väljer den översta träffen och tömmer rutan, så att hela flödet
  // går att göra från tangentbordet: skriv, enter, skriv, enter.
  const sokTangent = (e) => {
    if (e.key !== 'Enter' || !synliga.length) return
    e.preventDefault()
    vaxla(synliga[0].slug)
    setSok('')
  }

  const [a, b] = valda
  const klar = valda.length === 2
  const adress = klar ? `/jamfor/${[a, b].sort().join('-vs-')}` : null
  const namn = (slug) => orter.find((o) => o.slug === slug)?.name

  return (
    <>
      <style>{`
        .valj-rutnat {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
          gap: 12px;
        }
        .valj-kort {
          background: #1c1a17;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          text-align: left;
          padding: 0;
          transition: border-color 0.2s, transform 0.2s;
        }
        .valj-kort:hover { transform: translateY(-2px); }
        .valj-kort[data-vald='true'] { border-color: ${ACCENT}; }
        .valj-lada {
          position: sticky;
          top: 78px;
          z-index: 50;
          background: rgba(18,17,16,0.94);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px 16px;
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 12px;
          align-items: center;
        }
        .valj-sok {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }
        .valj-sok input::placeholder { color: rgba(255,255,255,0.28); }
        .valj-sok input:focus { border-color: ${ACCENT}; }
        @media (max-width: 640px) {
          .valj-sok > div:first-child { flex-basis: 100%; }
          .valj-rutnat { grid-template-columns: 1fr 1fr; gap: 8px; }
          .valj-lada { grid-template-columns: 1fr 1fr; }
          .valj-lada > :last-child { grid-column: 1 / -1; }
        }
      `}</style>

      {/* ── Lådan ──
          Klistrad överst så att valet syns medan man bläddrar bland
          korten längre ner. */}
      <div className="valj-lada">
        {[0, 1].map((i) => (
          <div key={i} style={{
            border: `1px dashed ${valda[i] ? 'transparent' : 'rgba(255,255,255,0.14)'}`,
            background: valda[i] ? 'rgba(212,165,116,0.1)' : 'transparent',
            borderRadius: 8, padding: '10px 12px', minHeight: 46,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {i === 0 ? 'Första orten' : 'Andra orten'}
            </span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 17, color: valda[i] ? '#f0ece4' : 'rgba(255,255,255,0.2)', letterSpacing: '0.03em', marginTop: 2 }}>
              {valda[i] ? namn(valda[i]) : 'välj nedan'}
            </span>
          </div>
        ))}

        {klar ? (
          <Link href={adress} style={{
            fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            color: '#121110', background: ACCENT, borderRadius: 8,
            padding: '13px 22px', textDecoration: 'none', textAlign: 'center',
            whiteSpace: 'nowrap',
          }}>Jämför →</Link>
        ) : (
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.22)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, padding: '13px 22px', textAlign: 'center', whiteSpace: 'nowrap',
          }}>Jämför →</span>
        )}
      </div>

      {/* ── Sök och urval ──
          Sökrutan finns för att den som redan vet vilka två orter hon
          menar inte ska behöva leta i ett rutnät på trettio kort. */}
      <div className="valj-sok" style={{ margin: '28px 0 16px' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <input
            ref={sokRuta}
            type="search"
            value={sok}
            onChange={(e) => setSok(e.target.value)}
            onKeyDown={sokTangent}
            placeholder="Skriv ortens namn…"
            aria-label="Sök skidort"
            style={{
              width: '100%', boxSizing: 'border-box',
              fontFamily: 'var(--font-body)', fontSize: 13.5, color: '#f0ece4',
              background: '#1c1a17', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 40, padding: '11px 40px 11px 18px', outline: 'none',
            }}
          />
          {sok && (
            <button
              type="button"
              onClick={() => { setSok(''); sokRuta.current?.focus() }}
              aria-label="Rensa sökningen"
              style={{
                position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
                width: 26, height: 26, borderRadius: '50%', border: 'none',
                background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.55)',
                fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1, cursor: 'pointer',
              }}
            >×</button>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
        {URVAL.map((v) => (
          <button key={v.id} onClick={() => setUrval(v.id)} style={{
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: urval === v.id ? '#121110' : 'rgba(255,255,255,0.45)',
            background: urval === v.id ? ACCENT : 'transparent',
            border: `1px solid ${urval === v.id ? ACCENT : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 40, padding: '7px 16px', cursor: 'pointer',
          }}>{v.etikett}</button>
        ))}
        </div>
      </div>

      {/* ── Korten ──
          Bild plus de två tal som skiljer orterna mest, så skillnaden
          syns redan medan man väljer. */}
      {synliga.length === 0 && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, margin: '4px 0 0' }}>
          Ingen ort heter något i den stilen — åtminstone ingen av de {orter.length} vi har.
          {urval !== 'alla' && ' Prova "Alla" om du filtrerat bort halva listan.'}
        </p>
      )}

      <div className="valj-rutnat">
        {synliga.map((ort) => {
          const plats = valda.indexOf(ort.slug)
          const vald = plats !== -1

          return (
            <button
              key={ort.slug}
              type="button"
              className="valj-kort"
              data-vald={vald}
              aria-pressed={vald}
              onClick={() => vaxla(ort.slug)}
            >
              <div style={{ position: 'relative', aspectRatio: '16 / 10', overflow: 'hidden' }}>
                {ort.optimeras ? (
                  <Image src={ort.bild} alt="" fill sizes="220px" style={{ objectFit: 'cover' }} />
                ) : (
                  <img src={ort.bild} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
                <div style={{ position: 'absolute', inset: 0, background: vald ? 'rgba(212,165,116,0.2)' : 'rgba(18,17,16,0.25)' }} />
                {vald && (
                  <span style={{
                    position: 'absolute', top: 8, right: 8, width: 22, height: 22,
                    borderRadius: '50%', background: ACCENT, color: '#121110',
                    fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{plats + 1}</span>
                )}
              </div>

              <div style={{ padding: '11px 13px 13px' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 17, color: '#f0ece4', letterSpacing: '0.03em', lineHeight: 1.1 }}>{ort.name}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 10.5, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>{ort.land}</div>
                <div style={{ display: 'flex', gap: 14, marginTop: 10 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'rgba(255,255,255,0.5)' }}>
                    <b style={{ color: '#f0ece4', fontWeight: 600 }}>{ort.pist}</b> km pist
                  </span>
                  {ort.vecka && (
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'rgba(255,255,255,0.5)' }}>
                      <b style={{ color: '#f0ece4', fontWeight: 600 }}>{ort.vecka}</b>/vecka
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </>
  )
}
