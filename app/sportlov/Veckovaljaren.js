'use client'

// Veckoväljaren.
//
// Alla fyra veckor renderas i markup:en och den valda visas — de tre andra
// döljs med display:none i stället för att aldrig skrivas ut. Skälet är det
// som stod i HomeClient när ortlistan flyttades till servern: innehåll som
// bara finns efter ett klick finns inte för den som läser första HTML-svaret.
// Här väger det tyngre än vanligt, eftersom hela sidans poäng ligger i vad
// som skiljer veckorna åt.

import { useState } from 'react'

const ACCENT = '#D4A574'

export default function Veckovaljaren({ veckor, barn }) {
  // Nio som förval därför att det är den enda veckan med en egen avgång
  // från Stockholm. Att förvälja en vecka är inte att påstå att den är
  // läsarens — etiketten ovanför frågar, och alla fyra står kvar synliga.
  const [vald, setVald] = useState(9)

  return (
    <>
      <div role="group" aria-label="Välj sportlovsvecka" style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(132px, 1fr))',
        gap: 10, marginBottom: 28,
      }}>
        {veckor.map((v) => {
          const pa = v.nr === vald
          return (
            <button
              key={v.nr}
              type="button"
              onClick={() => setVald(v.nr)}
              aria-pressed={pa}
              style={{
                background: pa ? 'rgba(212,165,116,0.1)' : '#1c1a17',
                border: `1px solid ${pa ? 'rgba(212,165,116,0.42)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 10, padding: '16px 14px', cursor: 'pointer', textAlign: 'left',
                // Bara färgerna byter värde. Se app/globals.css om varför
                // ingen övergång på sajten står som 'all' längre.
                transition: 'background 0.2s, border-color 0.2s',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 400,
                color: pa ? ACCENT : '#f0ece4', letterSpacing: '0.02em', lineHeight: 1,
              }}>Vecka {v.nr}</div>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 12.5, marginTop: 7,
                color: pa ? 'rgba(212,165,116,0.75)' : 'rgba(255,255,255,0.38)',
              }}>{v.text}</div>
            </button>
          )
        })}
      </div>

      {veckor.map((v) => (
        <div key={v.nr} style={{ display: v.nr === vald ? 'block' : 'none' }}>
          {barn[v.nr]}
        </div>
      ))}
    </>
  )
}
