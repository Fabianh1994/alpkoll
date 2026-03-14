import { supabase } from '../../../lib/supabase'
import Link from 'next/link'

export default async function ResortPage({ params }) {
  const slug = (await params).slug

  const { data: resort, error } = await supabase
    .from('resorts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !resort) {
    return (
      <div style={{ background: '#121110', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>Resort not found</p>
          <Link href="/" style={{ fontFamily: 'var(--font-body)', color: '#D4A574', textDecoration: 'none' }}>← Back to resorts</Link>
        </div>
      </div>
    )
  }

  const scores = [
    { label: 'Snow guarantee', value: resort.snow_guarantee_score, color: '#60a5fa' },
    { label: 'Intermediate terrain', value: resort.intermediate_score, color: '#34d399' },
    { label: 'Expert terrain', value: resort.expert_score, color: '#a78bfa' },
    { label: 'Beginner friendly', value: resort.beginner_score, color: '#4ade80' },
    { label: 'Off-piste', value: resort.off_piste_score, color: '#D4A574' },
    { label: 'Snowpark', value: resort.snowpark_score, color: '#f472b6' },
    { label: 'Village charm', value: resort.village_charm_score, color: '#fbbf24' },
    { label: 'Après-ski', value: resort.apres_ski_score, color: '#fb923c' },
    { label: 'Family friendly', value: resort.family_friendly_score, color: '#2dd4bf' },
  ]

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(24px, 4vw, 64px)', height: 64,
        background: 'rgba(18,17,16,0.95)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-heading)', fontSize: 28,
          color: '#f0ece4', letterSpacing: '0.06em', textDecoration: 'none',
        }}>ALPKOLL</Link>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {[
            { label: 'Resorts', href: '/#resorts' },
            { label: 'Plan a Trip', href: '/plan' },
            { label: 'About', href: '/about' },
          ].map(item => (
            <a key={item.label} href={item.href} style={{
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
              color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
              letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>{item.label}</a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: 'relative', height: '70vh', minHeight: 480, overflow: 'hidden' }}>
        <img
          src={resort.image_url || 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200'}
          alt={resort.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        {/* Overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(18,17,16,0.3) 0%, rgba(18,17,16,0.15) 40%, rgba(18,17,16,0.85) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(18,17,16,0.5) 0%, transparent 60%)' }} />

        {/* Back link */}
        <div style={{ position: 'absolute', top: 80, left: 'clamp(24px, 4vw, 64px)' }}>
          <Link href="/" style={{
            fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
            color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>← All resorts</Link>
        </div>

        {/* Hero text */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '0 clamp(24px, 4vw, 64px) 48px',
        }}>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
            color: '#D4A574', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10,
          }}>{resort.region} · {resort.country}</p>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(48px, 8vw, 88px)',
            fontWeight: 400, lineHeight: 0.95,
            color: '#f0ece4', letterSpacing: '0.02em', marginBottom: 20,
          }}>{resort.name}</h1>

          {/* Quick stats row in hero */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { label: 'Summit', value: `${resort.altitude_top}m` },
              { label: 'Pistes', value: `${resort.total_pistes_km}km` },
              { label: 'Lifts', value: resort.total_lifts },
              { label: 'Day pass', value: `€${resort.lift_pass_day_eur}` },
              { label: 'Week pass', value: `€${resort.lift_pass_week_eur}` },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(18,17,16,0.7)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 6, padding: '8px 14px',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: '#f0ece4', lineHeight: 1 }}>{s.value}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px clamp(24px, 4vw, 64px) 120px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40, alignItems: 'start' }}>

          {/* Left column */}
          <div>

            {/* Notes highlight */}
            {resort.notes && (
              <div style={{
                background: 'rgba(212,165,116,0.06)',
                border: '1px solid rgba(212,165,116,0.15)',
                borderLeft: '3px solid #D4A574',
                borderRadius: '0 10px 10px 0',
                padding: '16px 20px', marginBottom: 40,
              }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65 }}>
                  {resort.notes}
                </p>
              </div>
            )}

            {/* Score bars */}
            <div style={{ marginBottom: 48 }}>
              <h2 style={{
                fontFamily: 'var(--font-heading)', fontSize: 22,
                color: '#f0ece4', letterSpacing: '0.04em', marginBottom: 20,
              }}>Resort scores</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                {scores.map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: 12,
                      color: 'rgba(255,255,255,0.45)', minWidth: 160,
                    }}>{s.label}</span>
                    <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 2,
                        width: `${(s.value || 0) * 10}%`,
                        background: s.color,
                        transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
                      }} />
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
                      color: '#f0ece4', minWidth: 32, textAlign: 'right',
                      fontVariantNumeric: 'tabular-nums',
                    }}>{s.value}/10</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Terrain breakdown */}
            <div style={{ marginBottom: 48 }}>
              <h2 style={{
                fontFamily: 'var(--font-heading)', fontSize: 22,
                color: '#f0ece4', letterSpacing: '0.04em', marginBottom: 20,
              }}>Terrain breakdown</h2>

              {/* Visual bar */}
              <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: 16 }}>
                <div style={{ width: `${resort.blue_percent}%`, background: '#3b82f6' }} />
                <div style={{ width: `${resort.red_percent}%`, background: '#ef4444' }} />
                <div style={{ width: `${resort.black_percent}%`, background: 'rgba(255,255,255,0.4)' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Blue — easy', value: resort.blue_percent, color: '#3b82f6' },
                  { label: 'Red — intermediate', value: resort.red_percent, color: '#ef4444' },
                  { label: 'Black — expert', value: resort.black_percent, color: 'rgba(255,255,255,0.6)' },
                ].map(t => (
                  <div key={t.label} style={{
                    background: '#1c1a17', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 8, padding: '14px 16px', textAlign: 'center',
                  }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 32, color: t.color, lineHeight: 1, marginBottom: 6 }}>{t.value}%</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{t.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Season & snow */}
            <div style={{ marginBottom: 48 }}>
              <h2 style={{
                fontFamily: 'var(--font-heading)', fontSize: 22,
                color: '#f0ece4', letterSpacing: '0.04em', marginBottom: 20,
              }}>Season & snow</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Season opens', value: resort.season_start },
                  { label: 'Season closes', value: resort.season_end },
                  { label: 'Avg snowfall', value: `${resort.avg_snowfall_cm}cm per season` },
                  { label: 'Best months', value: resort.best_months },
                ].map(item => (
                  <div key={item.label} style={{
                    background: '#1c1a17', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 8, padding: '14px 16px',
                  }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>{item.label}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: '#f0ece4' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Getting there */}
            <div>
              <h2 style={{
                fontFamily: 'var(--font-heading)', fontSize: 22,
                color: '#f0ece4', letterSpacing: '0.04em', marginBottom: 20,
              }}>Getting there</h2>
              <div style={{
                background: '#1c1a17', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10, padding: '20px 24px',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                  {[
                    { label: 'Nearest airport', value: resort.nearest_airport },
                    { label: 'Transfer distance', value: `${resort.airport_distance_km}km` },
                    { label: 'Stay in', value: resort.accommodation_zone },
                  ].map(item => (
                    <div key={item.label}>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>{item.label}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: '#f0ece4' }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right column — sticky sidebar */}
          <div style={{ position: 'sticky', top: 84 }}>

            {/* Plan trip CTA */}
            <div style={{
              background: 'rgba(212,165,116,0.07)',
              border: '1px solid rgba(212,165,116,0.2)',
              borderRadius: 12, padding: '24px',
              marginBottom: 16,
            }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500, color: '#D4A574', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>Ready to go?</p>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: '#f0ece4', letterSpacing: '0.03em', marginBottom: 8 }}>{resort.name}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, marginBottom: 20 }}>
                Use the trip planner to score this resort against your skill level, budget and travel month.
              </p>
              <Link href="/plan" style={{
                display: 'block', textAlign: 'center',
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#121110', background: '#D4A574',
                border: 'none', borderRadius: 6, padding: '14px 24px',
                textDecoration: 'none', transition: 'background 0.2s',
              }}>Plan this trip →</Link>
            </div>

            {/* Official site */}
            <a href={resort.resort_url} target="_blank" rel="noopener noreferrer" style={{
              display: 'block', textAlign: 'center',
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6, padding: '13px 24px',
              textDecoration: 'none', marginBottom: 16,
              transition: 'all 0.2s',
            }}>Official resort website →</a>

            {/* Key numbers */}
            <div style={{
              background: '#1c1a17', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12, padding: '20px 20px',
            }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Key numbers</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Base altitude', value: `${resort.altitude_base}m` },
                  { label: 'Summit', value: `${resort.altitude_top}m` },
                  { label: 'Total pistes', value: `${resort.total_pistes_km}km` },
                  { label: 'Total lifts', value: resort.total_lifts },
                  { label: 'Day pass', value: `€${resort.lift_pass_day_eur}` },
                  { label: 'Week pass', value: `€${resort.lift_pass_week_eur}` },
                  { label: 'Avg snowfall', value: `${resort.avg_snowfall_cm}cm` },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{row.label}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: '#f0ece4' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: '40px clamp(24px, 4vw, 64px)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.06em' }}>ALPKOLL</span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>© 2026 — Compare mountains, find yours.</span>
      </footer>

    </div>
  )
}
