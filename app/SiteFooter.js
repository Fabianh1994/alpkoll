// Sajtens sidfot på ett enda ställe.
//
// Startsidan hade en sidfot med de juridiska länkarna, ortsidorna en utan,
// och de fyra text- och lagsidorna ingen alls. Nu når läsaren
// integritetspolicyn från var som helst — inklusive från policyn själv.
//
// Ingen hook här, så både server- och klientkomponenter kan rendera den.

import Link from 'next/link';

// Innehållssidorna först, de juridiska sist.
//
// Jämför, Liftkortspriser, Nattåget och Sportlov låg tidigare bara i
// menyraden, och den döljs under 600 px. På mobil fanns alltså ingen väg
// alls till tre av sajtens fyra innehållssidor — sidfoten listade bara
// Skidorter, Om oss och de juridiska. Uppmätt på alpkoll.se 2026-09-09:
// vid 390 px syntes varken Nattåget, Liftkortspriser eller Sportlov.
//
// Det är inte bara en väg för läsaren. Internlänkade sidor genomsöks
// oftare — mätningen 2026-08-25 gav 62 procent mot 21 för de olänkade.
const LANKAR = [
  { href: '/', label: 'Skidorter' },
  { href: '/jamfor', label: 'Jämför' },
  { href: '/liftkortspriser', label: 'Liftkortspriser' },
  { href: '/nattaget-till-alperna', label: 'Nattåget' },
  { href: '/sportlov', label: 'Sportlov' },
  { href: '/about', label: 'Om oss' },
  { href: '/privacy', label: 'Integritetspolicy' },
  { href: '/terms', label: 'Användarvillkor' },
  { href: '/affiliate-disclosure', label: 'Affiliateinformation' },
];

export default function SiteFooter() {
  return (
    <footer style={{
      padding: '40px clamp(24px, 4vw, 64px)',
      borderTop: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16, marginBottom: 20,
      }}>
        <span style={{
          fontFamily: 'var(--font-heading)', fontSize: 20,
          color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em',
        }}>ALPKOLL</span>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: 12,
          color: 'rgba(255,255,255,0.15)',
        }}>© 2026 — Jämför berg, hitta ditt.</span>
      </div>

      {/* Hovern låg förut i onMouseEnter, vilket band sidfoten till en
          klientkomponent. Som CSS fungerar den utan JavaScript. */}
      <style>{`
        .site-footer-link { transition: color 0.2s ease; }
        .site-footer-link:hover { color: #D4A574 !important; }
      `}</style>

      <div style={{
        display: 'flex', gap: 24, flexWrap: 'wrap',
        paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.03)',
      }}>
        {LANKAR.map(link => (
          <Link key={link.href} href={link.href} className="site-footer-link" style={{
            fontFamily: 'var(--font-body)', fontSize: 12,
            color: 'rgba(255,255,255,0.25)', textDecoration: 'none',
          }}>{link.label}</Link>
        ))}
        {/* Språkväxlaren är borttagen: alpkoll.com redirectar till .se,
            så länken hade bara skickat besökaren tillbaka hit. */}
      </div>
    </footer>
  );
}
