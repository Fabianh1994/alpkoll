'use client';

// Sajtens meny på ett enda ställe.
//
// Den fanns tidigare i tre kopior — HomeClient, ortsidan och about — vilket
// var precis därför en länk till den dolda planeraren låg kvar på about när
// de andra två städades. De juridiska sidorna hade ingen meny alls: på dator
// fanns ingen väg tillbaka till sajten därifrån.

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { PLANERAREN_SYNLIG } from '../lib/features';
import { LANDSIDOR } from '../lib/landsidor';

// Menyn har två rullgardiner så att alla innehållssidor får plats på en
// rad. Förut stod sex länkar i menyn och barnfamiljer, landsidorna, Var bo
// i Sälen och liftkortsindex syntes inte alls (Fabian 2026-11-18).
//
// Rullgardinernas länkar ligger alltid i HTML och visas med CSS
// (:hover och :focus-within), så Google ser dem och tangentbordet når dem
// utan JavaScript. Mätningen 2026-08-25 gav 62 procent genomsökta bland
// länkade sidor mot 21 bland olänkade — därför står allt i menyn.
const MENY = [
  {
    label: 'Skidorter', href: '/#resorts',
    match: (p) => p === '/' || p.startsWith('/skidorter/') || p.startsWith('/resort/'),
    under: [
      { label: 'Alla skidorter', href: '/#resorts' },
      ...LANDSIDOR.map((l) => ({ label: l.namn, href: `/skidorter/${l.slug}` })),
    ],
  },
  { label: 'Jämför', href: '/jamfor', match: (p) => p.startsWith('/jamfor') },
  { label: 'Liftkortspriser', href: '/liftkortspriser', match: (p) => p === '/liftkortspriser' },
  {
    label: 'Guider', href: '/sportlov',
    match: (p) => ['/sportlov', '/nattaget-till-alperna', '/tag-till-fjallen', '/skidorter-for-barnfamiljer', '/var-bo-i-salen', '/liftkortsindex'].includes(p) || p.startsWith('/sportlov/'),
    under: [
      { label: 'Sportlov', href: '/sportlov' },
      { label: 'Tåg till Alperna', href: '/nattaget-till-alperna' },
      { label: 'Tåg till fjällen', href: '/tag-till-fjallen' },
      { label: 'Skidorter för barnfamiljer', href: '/skidorter-for-barnfamiljer' },
      { label: 'Var bo i Sälen', href: '/var-bo-i-salen' },
      { label: 'Liftkortsindex', href: '/liftkortsindex' },
    ],
  },
  { label: 'Om oss', href: '/about', match: (p) => p === '/about' },
];

/**
 * @param genomskinligOverst  Startsidan låter hjältebilden lysa igenom menyn
 *                            tills läsaren scrollat. Övriga sidor börjar
 *                            direkt i innehåll och håller menyn tät hela tiden.
 */
export default function SiteHeader({ genomskinligOverst = false }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!genomskinligOverst) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [genomskinligOverst]);

  const tat = !genomskinligOverst || scrolled;

  return (
    <>
      <style>{`
        /* Samma brytpunkt som bottenmenyn i MobileNav, så att aldrig
           båda menyerna syns samtidigt. */
        @media (max-width: 768px) {
          .site-nav-links { display: none !important; }
        }
        .meny-grupp { position: relative; }
        .meny-lank { transition: color 0.25s; }
        .meny-lank:hover, .meny-lank:focus-visible { color: #D4A574 !important; }
        .meny-lank:focus-visible { outline: 2px solid #D4A574; outline-offset: 4px; border-radius: 2px; }
        .meny-under {
          position: absolute; top: 100%; left: -16px; padding-top: 18px;
          opacity: 0; visibility: hidden; transform: translateY(-4px);
          transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
        }
        .meny-grupp:hover .meny-under, .meny-grupp:focus-within .meny-under {
          opacity: 1; visibility: visible; transform: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .meny-under { transition: none; }
        }
      `}</style>

      <nav style={{
        position: 'fixed', top: 14, left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: 52, width: 'min(92vw, 860px)',
        background: tat ? 'rgba(18,17,16,0.88)' : 'rgba(18,17,16,0.18)',
        backdropFilter: tat ? 'blur(20px)' : 'blur(6px)',
        WebkitBackdropFilter: tat ? 'blur(20px)' : 'blur(6px)',
        border: `1px solid ${tat ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)'}`,
        borderRadius: 50,
        // Bara de tre egenskaper som faktiskt byter värde när menyn blir
        // tät. 'all' fick webbläsaren att bevaka varje egenskap på
        // elementet, transform och border-radius inräknade, fast de står
        // stilla hela tiden.
        transition: 'background 0.6s cubic-bezier(0.16,1,0.3,1), backdrop-filter 0.6s cubic-bezier(0.16,1,0.3,1), border-color 0.6s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-heading)', fontSize: 22, color: '#f0ece4',
          letterSpacing: '0.06em', textDecoration: 'none',
        }}>ALPKOLL</Link>

        <div className="site-nav-links" style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
          {MENY.map(item => {
            const aktiv = item.match(pathname);
            const lank = (
              <Link href={item.href} className="meny-lank" aria-current={aktiv ? 'page' : undefined} style={{
                fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
                color: aktiv ? '#D4A574' : 'rgba(255,255,255,0.46)',
                textDecoration: 'none', letterSpacing: '0.04em',
                textTransform: 'uppercase', whiteSpace: 'nowrap',
              }}>{item.label}{item.under && <span aria-hidden="true" style={{ marginLeft: 4, fontSize: 9 }}>▾</span>}</Link>
            );
            if (!item.under) return <span key={item.label}>{lank}</span>;
            return (
              <div key={item.label} className="meny-grupp">
                {lank}
                <div className="meny-under">
                  <ul style={{
                    listStyle: 'none', margin: 0, padding: '10px 0', minWidth: 230,
                    background: 'rgba(18,17,16,0.96)', backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
                    boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
                  }}>
                    {item.under.map(u => (
                      <li key={u.href}>
                        <Link href={u.href} className="meny-lank" style={{
                          display: 'block', padding: '9px 18px',
                          fontFamily: 'var(--font-body)', fontSize: 13,
                          color: pathname === u.href ? '#D4A574' : 'rgba(255,255,255,0.7)',
                          textDecoration: 'none',
                        }}>{u.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
          {PLANERAREN_SYNLIG && (
            <Link href="/plan" style={{
              fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
              color: '#121110', background: '#D4A574', textDecoration: 'none',
              padding: '8px 18px', borderRadius: 40,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>Planera resa</Link>
          )}
        </div>
      </nav>
    </>
  );
}
