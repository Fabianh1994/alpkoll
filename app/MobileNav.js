'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function MobileNav() {
  const pathname = usePathname();

  const tabs = [
    {
      label: 'Skidorter',
      href: '/#resorts',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#D4A574' : 'rgba(255,255,255,0.57)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3l4 8 5-5 5 15H2L8 3z" />
        </svg>
      ),
      isActive: pathname === '/',
    },
    {
      label: 'Jämför',
      href: '/jamfor',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#D4A574' : 'rgba(255,255,255,0.57)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="7" height="16" rx="1" />
          <rect x="14" y="4" width="7" height="16" rx="1" />
        </svg>
      ),
      isActive: pathname.startsWith('/jamfor'),
    },
    // Sportlov, Liftkortspriser och Nattåget stod förut bara i toppmenyn,
    // som är dold på telefon. Det är sidorna som ska dra söktrafik, och en
    // sida ingen länkar till blir sämre genomsökt (62 mot 21 procent,
    // mätningen 2026-08-25). Om oss ligger kvar i sidfoten.
    {
      label: 'Sportlov',
      href: '/sportlov',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#D4A574' : 'rgba(255,255,255,0.57)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="8" y1="3" x2="8" y2="7" />
          <line x1="16" y1="3" x2="16" y2="7" />
        </svg>
      ),
      isActive: pathname.startsWith('/sportlov'),
    },
    {
      label: 'Priser',
      href: '/liftkortspriser',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#D4A574' : 'rgba(255,255,255,0.57)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" />
          <circle cx="7.5" cy="7.5" r="1.2" />
        </svg>
      ),
      isActive: pathname === '/liftkortspriser',
    },
    {
      label: 'Nattåg',
      href: '/nattaget-till-alperna',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#D4A574' : 'rgba(255,255,255,0.57)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="3" width="14" height="14" rx="3" />
          <line x1="5" y1="11" x2="19" y2="11" />
          <line x1="8" y1="21" x2="10" y2="17" />
          <line x1="16" y1="21" x2="14" y2="17" />
        </svg>
      ),
      isActive: pathname === '/nattaget-till-alperna',
    },
  ];

  return (
    <>
      <div style={{ height: 72, display: 'block' }} className="mobile-nav-spacer" />

      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: 'rgba(18,17,16,0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        // Fem flikar delar bredden lika, så att de får plats på en smal
        // telefon och var och en blir en ordentlig tryckyta.
        justifyContent: 'space-around',
        alignItems: 'stretch',
        paddingTop: 10,
        paddingBottom: 'env(safe-area-inset-bottom, 10px)',
        height: 'auto',
        minHeight: 60,
      }} className="mobile-nav">
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              flex: 1,
              minHeight: 48,
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
          >
            {tab.icon(tab.isActive)}
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.04em',
              color: tab.isActive ? '#D4A574' : 'rgba(255,255,255,0.57)',
              textTransform: 'uppercase',
            }}>{tab.label}</span>
          </Link>
        ))}
      </nav>

      <style>{`
        @media (min-width: 769px) {
          .mobile-nav { display: none !important; }
          .mobile-nav-spacer { display: none !important; }
        }
      `}</style>
    </>
  );
}