'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PlanPage() {
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [preferences, setPreferences] = useState({
    skillLevel: 'Intermediate',
    budget: '50',
    month: 'February',
    priority: 'Snow quality',
  });

  useEffect(() => {
    async function fetchResorts() {
      const { data } = await supabase.from('resorts').select('*');
      if (data) setResorts(data);
    }
    fetchResorts();
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  async function handleSubmit() {
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch('/api/score-resorts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resorts, preferences }),
      });
      const data = await res.json();
      // Merge scores with full resort data
      const merged = data.scored.map(s => ({
        ...resorts.find(r => r.slug === s.slug),
        ai_score: s.score,
        ai_reason: s.reason,
      }));
      setResults(merged);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const inputStyle = {
    width: '100%', fontFamily: 'var(--font-body)', fontSize: 14,
    padding: '12px 16px', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 4, color: '#f0ece4', outline: 'none',
  };

  const labelStyle = {
    fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
    color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em',
    textTransform: 'uppercase', marginBottom: 8, display: 'block',
  };

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(24px, 4vw, 64px)', height: 64,
        background: scrolled ? 'rgba(18,17,16,0.95)' : 'rgba(18,17,16,0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 28, color: '#f0ece4', letterSpacing: '0.06em',
          textDecoration: 'none',
        }}>ALPKOLL</Link>
        <div style={{ display: 'flex', gap: 28 }}>
          {[
            { label: 'Resorts', href: '/#resorts' },
            { label: 'Plan a Trip', href: '/plan' },
            { label: 'About', href: '/about' },
          ].map(item => (
            <a key={item.label} href={item.href} style={{
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
              color: item.label === 'Plan a Trip' ? '#D4A574' : 'rgba(255,255,255,0.4)',
              textDecoration: 'none', letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>{item.label}</a>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main style={{
        maxWidth: 780, margin: '0 auto',
        padding: '120px clamp(24px, 4vw, 64px) 120px',
      }}>

        {/* Header */}
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
          color: '#D4A574', letterSpacing: '0.2em', textTransform: 'uppercase',
          marginBottom: 16,
        }}>AI-Powered</p>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(42px, 6vw, 72px)',
          fontWeight: 400, lineHeight: 0.95,
          color: '#f0ece4', marginBottom: 16, letterSpacing: '0.02em',
        }}>Find Your<br /><span style={{ color: '#D4A574' }}>Perfect Resort.</span></h1>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300,
          color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: 56,
        }}>
          Tell us what matters to you — Claude scores all {resorts.length} resorts and ranks them by fit.
        </p>

        {/* Form */}
        <div style={{
          background: '#1c1a17', borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.06)',
          padding: 'clamp(28px, 4vw, 48px)',
          marginBottom: 48,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>

            {/* Skill level */}
            <div>
              <label style={labelStyle}>Skill Level</label>
              <select
                value={preferences.skillLevel}
                onChange={e => setPreferences({ ...preferences, skillLevel: e.target.value })}
                style={inputStyle}
              >
                {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div>
              <label style={labelStyle}>Max Day Pass (EUR)</label>
              <select
                value={preferences.budget}
                onChange={e => setPreferences({ ...preferences, budget: e.target.value })}
                style={inputStyle}
              >
                {['30', '40', '50', '60', '70', '80', 'Any'].map(b => (
                  <option key={b} value={b}>{b === 'Any' ? 'Any budget' : `Up to €${b}`}</option>
                ))}
              </select>
            </div>

            {/* Month */}
            <div>
              <label style={labelStyle}>Travel Month</label>
              <select
                value={preferences.month}
                onChange={e => setPreferences({ ...preferences, month: e.target.value })}
                style={inputStyle}
              >
                {['December', 'January', 'February', 'March', 'April'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label style={labelStyle}>Top Priority</label>
              <select
                value={preferences.priority}
                onChange={e => setPreferences({ ...preferences, priority: e.target.value })}
                style={inputStyle}
              >
                {['Snow quality', 'Terrain variety', 'Après ski', 'Village charm', 'Value for money', 'Off-piste'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              marginTop: 36, width: '100%',
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: loading ? 'rgba(18,17,16,0.5)' : '#121110',
              background: loading ? 'rgba(212,165,116,0.4)' : '#D4A574',
              border: 'none', borderRadius: 3, padding: '18px 32px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Claude is thinking...' : 'Find My Best Resorts →'}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: 32,
              color: '#f0ece4', letterSpacing: '0.04em', marginBottom: 24,
            }}>Your Ranked Resorts</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {results.map((resort, i) => (
                <Link key={resort.slug} href={`/resort/${resort.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{
                    background: '#1c1a17', borderRadius: 6,
                    border: '1px solid rgba(255,255,255,0.06)',
                    padding: '20px 24px',
                    display: 'flex', alignItems: 'center', gap: 20,
                    transition: 'border-color 0.2s',
                    cursor: 'pointer',
                  }}>
                    {/* Rank */}
                    <div style={{
                      fontFamily: 'var(--font-heading)', fontSize: 32,
                      color: i === 0 ? '#D4A574' : 'rgba(255,255,255,0.15)',
                      minWidth: 40, textAlign: 'center', lineHeight: 1,
                    }}>#{i + 1}</div>

                    {/* Image */}
                    <img src={resort.image_url} alt={resort.name}
                      style={{ width: 72, height: 52, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: 'var(--font-heading)', fontSize: 22,
                        color: '#f0ece4', letterSpacing: '0.03em', marginBottom: 4,
                      }}>{resort.name}</div>
                      <div style={{
                        fontFamily: 'var(--font-body)', fontSize: 13,
                        color: 'rgba(255,255,255,0.35)', fontStyle: 'italic',
                      }}>{resort.ai_reason}</div>
                    </div>

                    {/* Score */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{
                        fontFamily: 'var(--font-heading)', fontSize: 36,
                        color: '#D4A574', lineHeight: 1,
                      }}>{resort.ai_score}</div>
                      <div style={{
                        fontFamily: 'var(--font-body)', fontSize: 10,
                        color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}>/ 100</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        padding: '40px clamp(24px, 4vw, 64px)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
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