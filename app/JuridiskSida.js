// Gemensam ram för integritetspolicy, användarvillkor och
// affiliateinformation.
//
// De tre sidorna hade var sin identiska kopia av rubrikblocket och av
// hjälpkomponenten Section, och ingen av dem hade meny eller sidfot — på
// dator fanns ingen väg tillbaka till sajten härifrån.
//
// Typsnitten låg dessutom hårdkodade som 'Bebas Neue' och 'Barlow', som
// aldrig laddas någonstans. Här används sajtens variabler som överallt
// annars, så att ett typsnittsbyte slår igenom också på lagsidorna.

import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

export default function JuridiskSida({ titel, uppdaterad, children }) {
  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>
      <SiteHeader />

      <main style={{
        padding: 'clamp(120px, 18vh, 160px) clamp(24px, 4vw, 64px) 80px',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            fontWeight: 600,
            color: '#D4A574',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            Juridiskt
          </p>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(36px, 5vw, 56px)',
            color: '#f0ece4',
            letterSpacing: '0.03em',
            lineHeight: 1.1,
            marginBottom: 12,
          }}>
            {titel}
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: 'rgba(255,255,255,0.3)',
            marginBottom: 48,
          }}>
            Senast uppdaterad: {uppdaterad}
          </p>

          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.65)',
          }}>
            {children}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export function Avsnitt({ titel, children }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 22,
        color: '#f0ece4',
        letterSpacing: '0.04em',
        marginBottom: 12,
      }}>
        {titel}
      </h2>
      {children}
    </section>
  );
}

/** Länk i löptext — samma accentfärg på alla tre sidor. */
export function Lank({ href, children }) {
  return (
    <a href={href} style={{ color: '#D4A574', textDecoration: 'none' }}>
      {children}
    </a>
  );
}

/** Framhävt ord i löptext, t.ex. inledningen på ett stycke. */
export function Stark({ children }) {
  return <strong style={{ color: '#f0ece4' }}>{children}</strong>;
}

/** Kontaktadressen står på alla tre sidorna — en definition räcker. */
export const KONTAKT = 'hello@alpkoll.com';
