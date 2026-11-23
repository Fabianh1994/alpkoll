// Sajtens sidfot på ett enda ställe.
//
// Startsidan hade en sidfot med de juridiska länkarna, ortsidorna en utan,
// och de fyra text- och lagsidorna ingen alls. Nu når läsaren
// integritetspolicyn från var som helst — inklusive från policyn själv.
//
// Ingen hook här, så både server- och klientkomponenter kan rendera den.

import Link from 'next/link';
import { AVSANDARE, KONTAKT } from '../lib/kontakt';
import { LANDSIDOR } from '../lib/landsidor';
import { anvanderClarity } from '../lib/clarity';
import Kakinstallningar from './Kakinstallningar';

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
  { href: '/fallhojd', label: 'Fallhöjd' },
  { href: '/nattaget-till-alperna', label: 'Tåg till Alperna' },
  { href: '/tag-till-fjallen', label: 'Tåg till fjällen' },
  { href: '/sportlov', label: 'Sportlov' },
  { href: '/pasklov', label: 'Påsklov' },
  // Guiderna från november 2026. De nåddes bara från en eller två andra
  // sidor, och granskningen 2026-11-18 hittade dem inte från startsidan.
  { href: '/skidorter-for-barnfamiljer', label: 'Barnfamiljer' },
  { href: '/var-bo-i-salen', label: 'Var bo i Sälen' },
  { href: '/var-bo-i-are', label: 'Var bo i Åre' },
  { href: '/var-bo-i-trysil', label: 'Var bo i Trysil' },
  { href: '/liftkortsindex', label: 'Liftkortsindex' },
  { href: '/about', label: 'Om oss' },
  { href: '/sa-jamfor-vi', label: 'Så jämför vi' },
  { href: '/privacy', label: 'Integritetspolicy' },
  { href: '/terms', label: 'Användarvillkor' },
  { href: '/affiliate-disclosure', label: 'Affiliateinformation' },
  // Krediteringen för bilder med Creative Commons-licens. Hjältebilden syns
  // på startsidans kort där ingen bildtext får plats, så länken står här,
  // på varje sida. Se app/bildkallor/page.js.
  { href: '/bildkallor', label: 'Bildkällor' },
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
          color: 'rgba(255,255,255,0.46)', letterSpacing: '0.06em',
        }}>ALPKOLL</span>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: 12,
          color: 'rgba(255,255,255,0.46)',
        }}>© 2026 — Jämför berg, hitta ditt.</span>
      </div>

      {/* Hovern låg förut i onMouseEnter, vilket band sidfoten till en
          klientkomponent. Som CSS fungerar den utan JavaScript. */}
      <style>{`
        .site-footer-link { transition: color 0.2s ease; }
        .site-footer-link:hover { color: #D4A574 !important; }
      `}</style>

      {/* En sida per land, på varje sida. Landsidorna nåddes förut bara
          från varandra och från landsnamnet på ortsidorna. */}
      <div style={{
        display: 'flex', gap: '8px 18px', flexWrap: 'wrap', alignItems: 'baseline',
        paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.03)',
        fontFamily: 'var(--font-body)', fontSize: 12,
      }}>
        <span style={{ color: 'rgba(255,255,255,0.38)' }}>Skidorter i</span>
        {LANDSIDOR.map(l => (
          <Link key={l.slug} href={`/skidorter/${l.slug}`} className="site-footer-link" style={{
            color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
          }}>{l.namn}</Link>
        ))}
      </div>

      <div style={{
        display: 'flex', gap: 24, flexWrap: 'wrap',
        paddingTop: 16, marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.03)',
      }}>
        {LANKAR.map(link => (
          <Link key={link.href} href={link.href} className="site-footer-link" style={{
            fontFamily: 'var(--font-body)', fontSize: 12,
            color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
          }}>{link.label}</Link>
        ))}
        {/* Bara när det finns något att samtycka till, se lib/clarity.js. */}
        {anvanderClarity && (
          <Kakinstallningar className="site-footer-link" style={{
            fontFamily: 'var(--font-body)', fontSize: 12,
            color: 'rgba(255,255,255,0.5)',
          }} />
        )}
        {/* Språkväxlaren är borttagen: alpkoll.com redirectar till .se,
            så länken hade bara skickat besökaren tillbaka hit. */}
      </div>

      {/* Avsändaren. Lagen om elektronisk handel kräver namn och
          kontaktuppgift för den som driver sajten, och
          marknadsföringslagen att det framgår vem som svarar för
          marknadsföringen — vilket affiliatelänkarna är. Raden står i
          sidfoten och inte på en undersida, eftersom besökaren ska kunna
          se det oavsett var hen landat. Den gick förlorad när Om oss
          skrevs om utan personliga uppgifter i #55; det som togs bort då
          var en personlig text, inte ansvarsuppgiften. */}
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: 11,
        color: 'rgba(255,255,255,0.38)', margin: '18px 0 0',
      }}>
        Alpkoll drivs av {AVSANDARE}.{' '}
        <a href={`mailto:${KONTAKT}`} className="site-footer-link" style={{
          color: 'rgba(255,255,255,0.38)', textDecoration: 'none',
        }}>{KONTAKT}</a>
      </p>
    </footer>
  );
}
