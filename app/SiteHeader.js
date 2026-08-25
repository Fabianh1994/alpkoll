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

const LANKAR = [
  { label: 'Skidorter', href: '/#resorts', match: (p) => p === '/' },
  { label: 'Jämför', href: '/jamfor', match: (p) => p.startsWith('/jamfor') },
  { label: 'Liftkortspriser', href: '/liftkortspriser', match: (p) => p === '/liftkortspriser' },
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
        @media (max-width: 600px) {
          .site-nav-links { display: none !important; }
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
        transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-heading)', fontSize: 22, color: '#f0ece4',
          letterSpacing: '0.06em', textDecoration: 'none',
        }}>ALPKOLL</Link>

        <div className="site-nav-links" style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
          {LANKAR.map(item => (
            <Link key={item.href} href={item.href} style={{
              fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
              color: item.match(pathname) ? '#D4A574' : 'rgba(255,255,255,0.45)',
              textDecoration: 'none', letterSpacing: '0.04em',
              textTransform: 'uppercase', transition: 'color 0.25s',
            }}>{item.label}</Link>
          ))}
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
