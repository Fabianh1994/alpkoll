'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { kreditering } from '../../../lib/kreditering'

// Galleriet under ortens beskrivning.
//
// Hjältebilden visar orten från sitt bästa håll. Galleriet finns för det
// den inte visar: byn som den faktiskt ser ut, backarna, liftarna, vad
// man ser från toppen. Val Thorens är ingen vykortsby och Tignes le Lac
// är höghus — bilderna säger det lika tydligt som texten.
//
// En stor bild och upp till fyra mindre på desktop, en rad att svepa i
// under 700 px. Ett klick öppnar bilden stor med fotograf och licens.
// Bilderna hämtas först när galleriet närmar sig skärmen; hjältebilden
// är den enda som laddas direkt.

const ACCENT = '#D4A574'

export default function Bildgalleri({ bilder, ortnamn }) {
  const [oppen, setOppen] = useState(null)
  const dialog = useRef(null)

  const visa = useCallback((index) => {
    setOppen(index)
    dialog.current?.showModal()
  }, [])

  const stang = useCallback(() => {
    dialog.current?.close()
  }, [])

  const bladdra = useCallback((steg) => {
    setOppen((i) => (i === null ? i : (i + steg + bilder.length) % bilder.length))
  }, [bilder.length])

  useEffect(() => {
    const el = dialog.current
    if (!el) return
    const vidStang = () => setOppen(null)
    const vidTangent = (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); bladdra(1) }
      if (e.key === 'ArrowLeft') { e.preventDefault(); bladdra(-1) }
    }
    el.addEventListener('close', vidStang)
    el.addEventListener('keydown', vidTangent)
    return () => {
      el.removeEventListener('close', vidStang)
      el.removeEventListener('keydown', vidTangent)
    }
  }, [bladdra])

  if (!bilder.length) return null

  const aktuell = oppen === null ? null : bilder[oppen]
  const antal = Math.min(bilder.length, 5)

  // Krediteringen under mosaiken: varje fotograf en gång, med licensen där
  // den är ett villkor. Samma uppgifter står i förstoringen och på /bildkallor.
  const fotografer = []
  for (const b of bilder) {
    const text = b.source === 'unsplash'
      ? `${b.photographer || 'okänd'} (Unsplash)`
      : `${b.photographer || 'okänd'} (${b.license})`
    if (!fotografer.includes(text)) fotografer.push(text)
  }

  return (
    <div style={{ marginBottom: 48 }}>
      <style>{`
        .ortgalleri {
          display: grid;
          gap: 8px;
          grid-template-columns: 2fr 1fr 1fr;
          grid-auto-rows: 168px;
        }
        .ortgalleri[data-antal="5"] > :first-child { grid-row: span 2; }
        .ortgalleri[data-antal="4"] { grid-template-columns: 2fr 1fr; grid-auto-rows: 110px; }
        .ortgalleri[data-antal="4"] > :first-child { grid-row: span 3; }
        .ortgalleri[data-antal="3"] { grid-template-columns: 2fr 1fr; }
        .ortgalleri[data-antal="3"] > :first-child { grid-row: span 2; }
        .ortgalleri[data-antal="2"] { grid-template-columns: 1fr 1fr; grid-auto-rows: 240px; }
        .ortgalleri[data-antal="1"] { grid-template-columns: 1fr; grid-auto-rows: 340px; }
        .ortgalleri-ruta {
          position: relative; overflow: hidden; border-radius: 8px; padding: 0;
          border: 1px solid rgba(255,255,255,0.06); background: #1c1a17; cursor: zoom-in;
        }
        .ortgalleri-ruta img { transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); }
        .ortgalleri-ruta:hover img { transform: scale(1.04); }
        .ortgalleri-ruta:focus-visible { outline: 2px solid ${ACCENT}; outline-offset: 2px; }
        @media (max-width: 700px) {
          .ortgalleri {
            display: flex; overflow-x: auto; scroll-snap-type: x mandatory;
            margin: 0 calc(-1 * clamp(24px, 4vw, 40px)); padding: 0 clamp(24px, 4vw, 40px);
            scrollbar-width: none;
          }
          .ortgalleri::-webkit-scrollbar { display: none; }
          .ortgalleri-ruta { flex: 0 0 84%; aspect-ratio: 3 / 2; scroll-snap-align: center; }
        }
        .ortgalleri-dialog {
          width: min(1400px, 94vw); max-width: none; max-height: 94vh; padding: 0;
          border: 0; border-radius: 10px; background: #121110; color: #f0ece4;
        }
        .ortgalleri-dialog::backdrop { background: rgba(8,7,6,0.88); }
        .ortgalleri-knapp {
          font-family: var(--font-body); font-size: 13px; font-weight: 600; color: #f0ece4;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px; padding: 9px 14px; cursor: pointer; transition: background-color 0.2s;
        }
        .ortgalleri-knapp:hover { background: rgba(212,165,116,0.18); }
        .ortgalleri-knapp:focus-visible { outline: 2px solid ${ACCENT}; outline-offset: 2px; }
      `}</style>

      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: '#f0ece4', letterSpacing: '0.04em', marginBottom: 20 }}>
        Bilder från {ortnamn}
      </h2>

      <div className="ortgalleri" data-antal={antal}>
        {bilder.slice(0, 5).map((b, i) => (
          <button
            key={b.id}
            type="button"
            className="ortgalleri-ruta"
            onClick={() => visa(i)}
            aria-label={`Visa bilden större: ${b.alt}`}
          >
            <Image
              src={b.url}
              alt={b.alt}
              fill
              sizes={i === 0 ? '(max-width: 700px) 84vw, 520px' : '(max-width: 700px) 84vw, 260px'}
              style={{ objectFit: 'cover' }}
            />
          </button>
        ))}
      </div>

      <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: '10px 0 0' }}>
        Foto: {fotografer.join(', ')}.{' '}
        <a href="/bildkallor" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'underline', textUnderlineOffset: 3 }}>Alla bildkällor</a>
      </p>

      <dialog ref={dialog} className="ortgalleri-dialog" aria-label={`Bilder från ${ortnamn}`} onClick={(e) => { if (e.target === dialog.current) stang() }}>
        {aktuell && (
          <figure style={{ margin: 0 }}>
            <div style={{ position: 'relative', width: '100%', height: 'min(76vh, 900px)', background: '#0b0a09' }}>
              <Image
                key={aktuell.id}
                src={aktuell.url}
                alt={aktuell.alt}
                fill
                sizes="94vw"
                style={{ objectFit: 'contain' }}
              />
            </div>
            <figcaption style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px 20px', padding: '14px 18px' }}>
              <div style={{ minWidth: 0, flex: '1 1 320px' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#f0ece4', margin: '0 0 4px', lineHeight: 1.5 }}>{aktuell.alt}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.58)', margin: 0, lineHeight: 1.5 }}>
                  {kreditering(aktuell)}
                  {aktuell.license_url && aktuell.source !== 'unsplash' ? <> · <a href={aktuell.license_url} target="_blank" rel="noopener noreferrer license" style={{ color: ACCENT, textDecoration: 'none' }}>Licensen</a></> : null}
                  {' · '}<a href={aktuell.source_page} target="_blank" rel="noopener noreferrer" style={{ color: ACCENT, textDecoration: 'none' }}>Källa</a>
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontVariantNumeric: 'tabular-nums', marginRight: 4 }}>
                  {oppen + 1} / {bilder.length}
                </span>
                {bilder.length > 1 && (
                  <>
                    <button type="button" className="ortgalleri-knapp" onClick={() => bladdra(-1)} aria-label="Föregående bild">←</button>
                    <button type="button" className="ortgalleri-knapp" onClick={() => bladdra(1)} aria-label="Nästa bild">→</button>
                  </>
                )}
                <button type="button" className="ortgalleri-knapp" onClick={stang} aria-label="Stäng">Stäng</button>
              </div>
            </figcaption>
          </figure>
        )}
      </dialog>
    </div>
  )
}
