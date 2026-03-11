'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ─── Snow quality bar ─────────────────────────────────────────
function SnowBar({ score }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{
        width: 48, height: 4, borderRadius: 2,
        background: 'rgba(255,255,255,0.08)', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${score * 10}%`,
          borderRadius: 2,
          background: score >= 9 ? '#D4A574' : 'rgba(255,255,255,0.25)',
          transition: 'width 0.6s ease',
        }} />
      </div>
      <span style={{
        fontSize: 11,
        fontFamily: 'var(--font-body)',
        color: score >= 9 ? '#D4A574' : 'rgba(255,255,255,0.35)',
        fontVariantNumeric: 'tabular-nums',
      }}>{score}</span>
    </div>
  );
}

// ─── Resort card ──────────────────────────────────────────────
function ResortCard({ resort }) {
  const [hover, setHover] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const flags = {
    'Switzerland': '🇨🇭', 'France': '🇫🇷', 'Austria': '🇦🇹',
    'Japan': '🇯🇵', 'Canada': '🇨🇦', 'USA': '🇺🇸',
    'Norway': '🇳🇴', 'Sweden': '🇸🇪', 'Finland': '🇫🇮',
    'Italy': '🇮🇹', 'Andorra': '🇦🇩', 'New Zealand': '🇳🇿',
  };

  return (
    <Link href={`/resort/${resort.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          borderRadius: 6, overflow: 'hidden', cursor: 'pointer',
          background: '#1c1a17',
          border: '1px solid rgba(255,255,255,0.04)',
          transition: 'border-color 0.35s, transform 0.35s',
          borderColor: hover ? 'rgba(212,165,116,0.2)' : 'rgba(255,255,255,0.04)',
          transform: hover ? 'translateY(-3px)' : 'none',
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: '#141210' }}>
          <img
            src={resort.image_url} alt={resort.name}
            onLoad={() => setLoaded(true)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              opacity: loaded ? 1 : 0,
              transform: hover ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.4s',
            }}
          />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
            background: 'linear-gradient(transparent, #1c1a17)',
          }} />
          <div style={{
            position: 'absolute', top: 12, left: 12,
            fontSize: 11, fontWeight: 500,
            fontFamily: 'var(--font-body)',
            color: 'rgba(255,255,255,0.75)',
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(8px)',
            padding: '4px 10px', borderRadius: 4,
            letterSpacing: '0.03em',
          }}>
            {flags[resort.country] || ''} {resort.country}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '16px 18px 20px' }}>
          <div style={{
            fontSize: 11, color: 'rgba(255,255,255,0.3)',
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4,
          }}>{resort.region}</div>
          <h3 style={{
            fontSize: 24,
            fontFamily: 'var(--font-heading)',
            fontWeight: 400, color: '#f0ece4',
            margin: '0 0 6px', lineHeight: 1.1,
            letterSpacing: '0.03em',
          }}>{resort.name}</h3>
          {resort.notes && (
            <p style={{
              fontSize: 13, fontFamily: 'var(--font-body)',
              color: 'rgba(255,255,255,0.35)', fontStyle: 'italic',
              fontWeight: 300, margin: '0 0 16px', lineHeight: 1.4,
            }}>{resort.notes}</p>
          )}
          {/* Stats */}
          <div style={{
            display: 'flex', gap: 20, fontSize: 12,
            fontFamily: 'var(--font-body)',
            borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 14,
          }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, textTransform: 'uppercase', marginBottom: 3 }}>Summit</div>
              <div style={{ color: '#f0ece4', fontVariantNumeric: 'tabular-nums' }}>{resort.top_altitude}m</div>
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, textTransform: 'uppercase', marginBottom: 3 }}>Pistes</div>
              <div style={{ color: '#f0ece4', fontVariantNumeric: 'tabular-nums' }}>{resort.piste_km}km</div>
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, textTransform: 'uppercase', marginBottom: 3 }}>Snow</div>
              <SnowBar score={resort.snow_score} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Main page ────────────────────────────────────────────────
export default function Home() {
  const [resorts, setResorts] = useState([]);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('All');
  const [scrolled, setScrolled] = useState(false);

  const heroImage = 'https://odlzoewjwyipiopttucv.supabase.co/storage/v1/object/public/images/valerii-ladomyriak-A9Ci7flea_U-unsplash.jpg';

  // ── Fetch resorts ──
  useEffect(() => {
    async function fetchResorts() {
      const { data } = await supabase
        .from('resorts')
        .select('*')
        .order('name');
      if (data) setResorts(data);
    }
    fetchResorts();
  }, []);

  // ── Scroll listener ──
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  // ── Filter logic ──
  const countries = ['All', ...new Set(resorts.map(r => r.country).filter(Boolean))].sort((a, b) => {
    if (a === 'All') return -1;
    return a.localeCompare(b);
  });

  const filtered = resorts.filter(r => {
    const q = search.toLowerCase();
    const matchText = !q
      || r.name?.toLowerCase().includes(q)
      || r.region?.toLowerCase().includes(q)
      || r.country?.toLowerCase().includes(q)
      || r.notes?.toLowerCase().includes(q);
    const matchCountry = country === 'All' || r.country === country;
    return matchText && matchCountry;
  });

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>

      {/* ── Nav ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(24px, 4vw, 64px)', height: 64,
        background: scrolled ? 'rgba(18,17,16,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.04)' : '1px solid transparent',
        transition: 'all 0.5s ease',
      }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 28, color: '#f0ece4', letterSpacing: '0.06em',
          textDecoration: 'none',
        }}>ALPKOLL</Link>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {[
            { label: 'Resorts', href: '#resorts' },
            { label: 'Plan a Trip', href: '/plan' },
            { label: 'About', href: '/about' },
          ].map(item => (
            <a key={item.label} href={item.href} style={{
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
              color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
              letterSpacing: '0.04em', textTransform: 'uppercase',
              transition: 'color 0.25s',
            }}>{item.label}</a>
          ))}
        </div>
      </nav>

      {/* ── Hero ── */}
      <header style={{
        position: 'relative', height: '100vh', minHeight: 600,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '0 clamp(24px, 4vw, 64px) clamp(60px, 10vh, 140px)',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url('${heroImage}')`,
          backgroundSize: 'cover', backgroundPosition: 'center 30%',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(18,17,16,0.3) 0%, rgba(18,17,16,0.5) 40%, rgba(18,17,16,0.85) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(18,17,16,0.5) 0%, transparent 60%)',
        }} />

        {/* Hero text */}
        <div style={{ position: 'relative', maxWidth: 750 }}>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
            color: '#D4A574', letterSpacing: '0.2em', textTransform: 'uppercase',
            marginBottom: 20,
          }}>For skiers who do their homework</p>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(52px, 8vw, 100px)',
            fontWeight: 400, lineHeight: 0.95,
            color: '#f0ece4', marginBottom: 24, letterSpacing: '0.02em',
          }}>
            Every Mountain<br />
            Tells A Different<br />
            <span style={{ color: '#D4A574' }}>Story.</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(14px, 1.4vw, 17px)',
            fontWeight: 300, color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.65, maxWidth: 480, marginBottom: 40,
          }}>
            We compare snow, terrain, price and character across {resorts.length} resorts
            worldwide — so you pick the one that actually fits.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a href="#resorts" style={{
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#121110', background: '#D4A574',
              border: 'none', borderRadius: 3, padding: '15px 32px',
              cursor: 'pointer', textDecoration: 'none', display: 'inline-block',
            }}>Browse Resorts ↓</a>
            <a href="#how" style={{
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 3, padding: '15px 32px',
              textDecoration: 'none', display: 'inline-block',
            }}>How It Works</a>
          </div>
        </div>
      </header>

      {/* ── Resorts section ── */}
      <section id="resorts" style={{
        padding: '80px clamp(24px, 4vw, 64px) 120px',
        maxWidth: 1320, margin: '0 auto',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          flexWrap: 'wrap', gap: 24,
          marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 24,
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: 38, fontWeight: 400,
              color: '#f0ece4', letterSpacing: '0.04em', marginBottom: 4,
            }}>Resorts</h2>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 13,
              color: 'rgba(255,255,255,0.3)',
            }}>{filtered.length} destination{filtered.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Search & filter */}
        <div style={{
          display: 'flex', gap: 10, marginBottom: 40,
          flexWrap: 'wrap', alignItems: 'center',
        }}>
          <input
            type="text"
            placeholder="Search by name, country or vibe..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: '1 1 260px', fontFamily: 'var(--font-body)', fontSize: 13,
              padding: '11px 16px', background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 4, color: '#f0ece4', outline: 'none',
            }}
          />
          <div style={{
            display: 'flex', gap: 0, borderRadius: 4, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            {countries.map(c => (
              <button key={c} onClick={() => setCountry(c)}
                style={{
                  fontFamily: 'var(--font-body)', fontSize: 12,
                  fontWeight: country === c ? 600 : 400,
                  padding: '10px 14px', border: 'none', cursor: 'pointer',
                  background: country === c ? 'rgba(212,165,116,0.15)' : 'rgba(255,255,255,0.02)',
                  color: country === c ? '#D4A574' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.2s',
                  borderRight: '1px solid rgba(255,255,255,0.04)',
                  letterSpacing: '0.03em', textTransform: 'uppercase',
                }}
              >{c}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 20px',
            fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.25)',
          }}>
            <p style={{
              fontFamily: 'var(--font-heading)', fontSize: 28,
              color: 'rgba(255,255,255,0.15)', letterSpacing: '0.04em', marginBottom: 8,
            }}>No Results</p>
            <p style={{ fontSize: 14 }}>Try a different name or country.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}>
            {filtered.map(r => <ResortCard key={r.slug} resort={r} />)}
          </div>
        )}
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: '40px clamp(24px, 4vw, 64px)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16,
      }}>
        <span style={{
          fontFamily: 'var(--font-heading)', fontSize: 20,
          color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em',
        }}>ALPKOLL</span>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: 12,
          color: 'rgba(255,255,255,0.15)',
        }}>© 2026 — Compare mountains, find yours.</span>
      </footer>

    </div>
  );
}