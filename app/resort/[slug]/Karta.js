'use client'

import { useState } from 'react'

// Google-kartan laddas först när läsaren klickar.
//
// En inbäddad Google Maps-ruta hämtar skript och kan sätta kakor från
// Google så fort sidan öppnas. Integritetspolicyn lovar att ingenting från
// någon annan laddas medan man är kvar på Alpkoll, så rutan visar en
// knapp tills läsaren själv väljer kartan. Texten under knappen säger
// vad som händer, och samma sak står i /privacy under "Kakor".
export default function Karta({ embedUrl, namn }) {
  const [visa, setVisa] = useState(false)

  if (visa) {
    return (
      <iframe
        src={embedUrl}
        title={`Karta över ${namn}`}
        width="100%"
        height="320"
        style={{ border: 0, display: 'block' }}
        allowFullScreen=""
        referrerPolicy="no-referrer-when-downgrade"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setVisa(true)}
      className="ort-karta"
      style={{
        width: '100%', height: 320, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer',
        border: 0, background: 'radial-gradient(ellipse at 50% 40%, #24201b 0%, #1c1a17 70%)',
        color: '#f0ece4', fontFamily: 'var(--font-body)',
      }}
    >
      <style>{`.ort-karta:focus-visible { outline: 2px solid #D4A574; outline-offset: -4px; }`}</style>
      <span style={{ fontSize: 13, fontWeight: 500, color: '#D4A574', border: '1px solid rgba(212,165,116,0.35)', borderRadius: 6, padding: '10px 18px', letterSpacing: '0.04em' }}>
        Visa karta
      </span>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', maxWidth: 260, lineHeight: 1.5 }}>
        Kartan kommer från Google, som kan sätta kakor när den laddas.
      </span>
    </button>
  )
}
