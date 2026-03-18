'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function MobileNav() {
  const pathname = usePathname();

  const tabs = [
    {
      label: 'Resorts',
      href: '/#resorts',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#D4A574' : 'rgba(255,255,255,0.35)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3l4 8 5-5 5 15H2L8 3z" />
        </svg>
      ),
      isActive: pathname === '/',
    },
    {
      label: 'About',
      href: '/about',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#D4A574' : 'rgba(255,255,255,0.35)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
      isActive: pathname === '/about',
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
        justifyContent: 'center',
        gap: 64,
        alignItems: 'center',
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
              gap: 4,
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
          >
            {tab.icon(tab.isActive)}
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.04em',
              color: tab.isActive ? '#D4A574' : 'rgba(255,255,255,0.35)',
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