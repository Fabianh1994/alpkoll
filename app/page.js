'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const heroImage = 'https://odlzoewjwyipiopttucv.supabase.co/storage/v1/object/public/images/valerii-ladomyriak-A9Ci7flea_U-unsplash.jpg';

function NoiseOverlay() {
  return (
    <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1, opacity: 0.038 }}>
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}

function MagBtn({ children, href, primary = false, pill = false }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const onMove = useCallback((e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setOffset({ x: (e.clientX - r.left - r.width / 2) * 0.14, y: (e.clientY - r.top - r.height / 2) * 0.14 });
  }, []);
  const style = {
    fontFamily: 'var(--font-body)', fontSize: pill ? 11 : 13, fontWeight: primary ? 600 : 500,
    letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block',
    padding: pill ? '8px 18px' : '15px 32px', borderRadius: pill ? 40 : 3, cursor: 'pointer',
    transform: `translate(${offset.x}px,${offset.y}px) scale(${hover ? 1.03 : 1})`,
    transition: 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.4s, background 0.25s',
    ...(primary ? {
      color: '#121110', background: hover ? '#e0b68a' : '#D4A574', border: 'none',
      boxShadow: hover ? '0 8px 28px rgba(212,165,116,0.28)' : 'none',
    } : {
      color: hover ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.6)', background: 'transparent',
      border: `1px solid ${hover ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.15)'}`,
    }),
  };
  return (
    <a ref={ref} href={href} style={style}
      onMouseEnter={() => setHover(true)} onMouseMove={onMove}
      onMouseLeave={() => { setOffset({ x: 0, y: 0 }); setHover(false); }}>
      {children}
    </a>
  );
}

function ResortCard({ resort }) {
  const [hover, setHover] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const flags = {
    'Switzerland': '🇨🇭', 'France': '🇫🇷', 'Austria': '🇦🇹', 'Japan': '🇯🇵',
    'Canada': '🇨🇦', 'USA': '🇺🇸', 'Norway': '🇳🇴', 'Sweden': '🇸🇪',
    'Finland': '🇫🇮', 'Italy': '🇮🇹', 'Andorra': '🇦🇩', 'New Zealand': '🇳🇿', 'Bulgaria': '🇧🇬',
  };
  return (
    <Link href={`/resort/${resort.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
        borderRadius: 6, overflow: 'hidden', cursor: 'pointer', background: '#1c1a17',
        border: '1px solid rgba(255,255,255,0.04)', transition: 'border-color 0.35s, transform 0.35s, box-shadow 0.35s',
        borderColor: hover ? 'rgba(212,165,116,0.2)' : 'rgba(255,255,255,0.04)',
        transform: hover ? 'translateY(-3px)' : 'none',
        boxShadow: hover ? '0 12px 36px rgba(0,0,0,0.32)' : 'none',
      }}>
        <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: '#141210' }}>
          <img src={resort.image_url} alt={resort.name} onLoad={() => setLoaded(true)} style={{
            width: '100%', height: '100%', objectFit: 'cover', opacity: loaded ? 1 : 0,
            transform: hover ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 1s cubic-bezier(0.16,1,0.3,1), opacity 0.4s',
          }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(transparent, #1c1a17)' }} />
          <div style={{ position: 'absolute', top: 12, left: 12, fontSize: 11, fontWeight: 500, fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.75)', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 4, letterSpacing: '0.03em' }}>
            {flags[resort.country] || ''} {resort.country}
          </div>
        </div>
        <div style={{ padding: '16px 18px 24px' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{resort.region}</div>
          <h3 style={{ fontSize: 24, fontFamily: 'var(--font-heading)', fontWeight: 400, color: '#f0ece4', margin: '0 0 10px', lineHeight: 1.1, letterSpacing: '0.03em' }}>{resort.name}</h3>
          {resort.notes && (
            <p style={{ fontSize: 13, fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.4)', fontWeight: 300, margin: 0, lineHeight: 1.6 }}>{resort.notes}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [resorts, setResorts] = useState([]);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('All');
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    async function fetchResorts() {
      const { data } = await supabase.from('resorts').select('*').order('name');
      if (data) setResorts(data);
    }
    fetchResorts();
  }, []);

  useEffect(() => {
    const onScroll = () => { setScrolled(window.scrollY > 40); setScrollY(window.scrollY); };
    window.addEventListener('scroll', onScroll, { passive: true });
    setTimeout(() => setHeroVisible(true), 200);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const parallaxY = scrollY * 0.3;
  const countries = ['All', ...new Set(resorts.map(r => r.country).filter(Boolean))].sort((a, b) => a === 'All' ? -1 : a.localeCompare(b));
  const filtered = resorts.filter(r => {
    const q = search.toLowerCase();
    const matchText = !q || r.name?.toLowerCase().includes(q) || r.region?.toLowerCase().includes(q) || r.country?.toLowerCase().includes(q) || r.notes?.toLowerCase().includes(q);
    return matchText && (country === 'All' || r.country === country);
  });

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>
      <NoiseOverlay />

      <style>{`
        @media (max-width: 600px) {
          .nav-links { display: none !important; }
        }
      `}</style>

      <nav style={{
        position: 'fixed', top: 14, left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: 52, width: 'min(92vw, 860px)',
        background: scrolled ? 'rgba(18,17,16,0.88)' : 'rgba(18,17,16,0.18)',
        backdropFilter: scrolled ? 'blur(20px)' : 'blur(6px)',
        border: `1px solid ${scrolled ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)'}`,
        borderRadius: 50, transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: '#f0ece4', letterSpacing: '0.06em', textDecoration: 'none' }}>ALPKOLL</Link>
        <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
          <div className="nav-links" style={{ display: 'flex', gap: 22 }}>
            {[{ label: 'Resorts', href: '#resorts' }, { label: 'About', href: '/about' }].map(item => (
              <a key={item.label} href={item.href} style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', letterSpacing: '0.04em', textTransform: 'uppercase', transition: 'color 0.25s' }}>{item.label}</a>
            ))}
          </div>
          <MagBtn href="/plan" primary pill>Plan Trip</MagBtn>
        </div>
      </nav>

      <header style={{ position: 'relative', height: '100vh', minHeight: 600, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 clamp(24px, 4vw, 64px) clamp(60px, 10vh, 140px)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${heroImage}')`, backgroundSize: 'cover', backgroundPosition: 'center 30%', transform: `scale(1.06) translateY(-${parallaxY * 0.25}px)`, willChange: 'transform' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(18,17,16,0.3) 0%, rgba(18,17,16,0.5) 40%, rgba(18,17,16,0.85) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(18,17,16,0.5) 0%, transparent 60%)' }} />
        <div style={{ position: 'relative', maxWidth: 750 }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: '#D4A574', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20, opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(18px)', transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s' }}>For skiers who do their homework</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(52px, 8vw, 100px)', fontWeight: 400, lineHeight: 0.95, color: '#f0ece4', marginBottom: 24, letterSpacing: '0.02em', opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(26px)', transition: 'all 1.1s cubic-bezier(0.16,1,0.3,1) 0.5s' }}>
            Every Mountain<br />Tells A Different<br /><span style={{ color: '#D4A574' }}>Story.</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(14px, 1.4vw, 17px)', fontWeight: 300, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, maxWidth: 480, marginBottom: 40, opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(22px)', transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.7s' }}>
            We compare snow, terrain, price and character across {resorts.length} resorts worldwide — so you pick the one that actually fits.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(18px)', transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.9s' }}>
            <MagBtn href="#resorts" primary>Browse Resorts ↓</MagBtn>
            <MagBtn href="/plan">Plan a Trip</MagBtn>
          </div>
        </div>
      </header>

      <section style={{ padding: '60px clamp(24px, 4vw, 64px)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(15px,1.5vw,17px)', fontWeight: 300, color: 'rgba(255,255,255,0.28)', lineHeight: 1.75, marginBottom: 22 }}>Most ski tools show you a list of resorts and hope you figure it out.</p>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(40px,5.5vw,68px)', fontWeight: 400, color: '#f0ece4', lineHeight: 1, marginBottom: 22 }}>We Match The Mountain<br />To The <span style={{ color: '#D4A574' }}>Skier.</span></h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(13px,1.3vw,15px)', fontWeight: 300, color: 'rgba(255,255,255,0.38)', lineHeight: 1.75, maxWidth: 480, margin: '0 auto' }}>Snow depth, terrain mix, village vibe, budget, travel time — we score everything so you spend less time researching and more time actually skiing.</p>
        </div>
      </section>

      <section id="resorts" style={{ padding: '80px clamp(24px, 4vw, 64px) 120px', maxWidth: 1320, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 24 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 38, fontWeight: 400, color: '#f0ece4', letterSpacing: '0.04em', marginBottom: 4 }}>Resorts</h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>{filtered.length} destination{filtered.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 40, flexWrap: 'wrap', alignItems: 'center' }}>
          <input type="text" placeholder="Search by name, country or vibe..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: '1 1 260px', fontFamily: 'var(--font-body)', fontSize: 13, padding: '11px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, color: '#f0ece4', outline: 'none' }} />
          <div style={{ display: 'flex', gap: 0, borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
            {countries.map(c => (
              <button key={c} onClick={() => setCountry(c)} style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: country === c ? 600 : 400, padding: '10px 14px', border: 'none', cursor: 'pointer', background: country === c ? 'rgba(212,165,116,0.15)' : 'rgba(255,255,255,0.02)', color: country === c ? '#D4A574' : 'rgba(255,255,255,0.3)', transition: 'all 0.2s', borderRight: '1px solid rgba(255,255,255,0.04)', letterSpacing: '0.03em', textTransform: 'uppercase' }}>{c}</button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.25)' }}>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 28, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.04em', marginBottom: 8 }}>No Results</p>
            <p style={{ fontSize: 14 }}>Try a different name or country.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {filtered.map(r => <ResortCard key={r.slug} resort={r} />)}
          </div>
        )}
      </section>

      <footer style={{ padding: '40px clamp(24px, 4vw, 64px)', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em' }}>ALPKOLL</span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>© 2026 — Compare mountains, find yours.</span>
      </footer>
    </div>
  );
}