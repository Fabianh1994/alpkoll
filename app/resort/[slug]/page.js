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

  const verticalDrop = resort.altitude_top - resort.altitude_base
  const estimatedTransferMins = resort.airport_distance_km < 50 ? '30–45 min'
    : resort.airport_distance_km < 100 ? '1–1.5 hrs'
    : resort.airport_distance_km < 150 ? '1.5–2 hrs'
    : resort.airport_distance_km < 200 ? '2–2.5 hrs'
    : resort.airport_distance_km < 300 ? '2.5–3.5 hrs'
    : '3.5+ hrs'

  const mapsUrl = `https://www.google.com/maps?q=${resort.latitude},${resort.longitude}`
  const mapsEmbedUrl = `https://maps.google.com/maps?q=${resort.latitude},${resort.longitude}&z=12&output=embed`
  const bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(resort.accommodation_zone || resort.name)}&lang=en-gb`

  const weekCostLow = Math.round((resort.lift_pass_week_eur + 400) / 50) * 50
  const weekCostHigh = Math.round((resort.lift_pass_week_eur + 900) / 50) * 50

  const scores = [
    { label: 'Snow guarantee',       value: resort.snow_guarantee_score,  color: '#60a5fa' },
    { label: 'Intermediate terrain', value: resort.intermediate_score,    color: '#34d399' },
    { label: 'Expert terrain',       value: resort.expert_score,          color: '#a78bfa' },
    { label: 'Beginner friendly',    value: resort.beginner_score,        color: '#4ade80' },
    { label: 'Off-piste',            value: resort.off_piste_score,       color: '#D4A574' },
    { label: 'Snowpark',             value: resort.snowpark_score,        color: '#f472b6' },
    { label: 'Village charm',        value: resort.village_charm_score,   color: '#fbbf24' },
    { label: 'Après-ski',            value: resort.apres_ski_score,       color: '#fb923c' },
    { label: 'Family friendly',      value: resort.family_friendly_score, color: '#2dd4bf' },
    { label: 'Crowd levels',         value: resort.crowd_score,           color: '#e879f9' },
  ]

  const card = {
    background: '#1c1a17',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 10,
  }

  const sectionTitle = {
    fontFamily: 'var(--font-heading)', fontSize: 22,
    color: '#f0ece4', letterSpacing: '0.04em', marginBottom: 20,
  }

  const fieldLabel = {
    fontFamily: 'var(--font-body)', fontSize: 10,
    color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase',
    letterSpacing: '0.08em', marginBottom: 5,
  }

  const fieldValue = {
    fontFamily: 'var(--font-body)', fontSize: 14,
    fontWeight: 500, color: '#f0ece4',
  }

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
      <div style={{ position: 'relative', height: '75vh', minHeight: 520, overflow: 'hidden' }}>
        <img
          src={resort.image_url || 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200'}
          alt={resort.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(18,17,16,0.3) 0%, rgba(18,17,16,0.1) 35%, rgba(18,17,16,0.9) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(18,17,16,0.5) 0%, transparent 60%)' }} />

        <div style={{ position: 'absolute', top: 80, left: 'clamp(24px, 4vw, 64px)' }}>
          <Link href="/" style={{
            fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
            color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>← All resorts</Link>
        </div>

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
            color: '#f0ece4', letterSpacing: '0.02em', marginBottom: 24,
          }}>{resort.name}</h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              { label: 'Base',      value: `${resort.altitude_base}m` },
              { label: 'Summit',    value: `${resort.altitude_top}m` },
              { label: 'Vertical',  value: `${verticalDrop}m` },
              { label: 'Pistes',    value: `${resort.total_pistes_km}km` },
              { label: 'Lifts',     value: resort.total_lifts },
              { label: 'Day pass',  value: `€${resort.lift_pass_day_eur}` },
              { label: 'Week pass', value: `€${resort.lift_pass_week_eur}` },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(18,17,16,0.75)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 6, padding: '8px 14px',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: 17, color: '#f0ece4', lineHeight: 1 }}>{s.value}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px clamp(24px, 4vw, 64px) 120px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 48, alignItems: 'start' }}>

          {/* ── Left column ── */}
          <div>

            {/* Notes */}
            {resort.notes && (
              <div style={{
                background: 'rgba(212,165,116,0.06)',
                border: '1px solid rgba(212,165,116,0.15)',
                borderLeft: '3px solid #D4A574',
                borderRadius: '0 10px 10px 0',
                padding: '16px 20px', marginBottom: 48,
              }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0 }}>
                  {resort.notes}
                </p>
              </div>
            )}

            {/* ── Snow & conditions ── */}
            <div style={{ marginBottom: 48 }}>
              <h2 style={sectionTitle}>Snow & conditions</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[
                  { label: 'Season opens',  value: resort.season_start },
                  { label: 'Season closes', value: resort.season_end },
                  { label: 'Best months',   value: resort.best_months },
                  { label: 'Avg snowfall',  value: `${resort.avg_snowfall_cm}cm / season` },
                ].map(item => (
                  <div key={item.label} style={{ ...card, padding: '14px 16px' }}>
                    <div style={fieldLabel}>{item.label}</div>
                    <div style={fieldValue}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Altitude profile */}
              <div style={{ ...card, padding: '18px 20px' }}>
                <div style={fieldLabel}>Altitude profile — snow reliability</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginTop: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.min(resort.altitude_top / 40, 100)}%`, background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#f0ece4', minWidth: 48 }}>{resort.altitude_top}m</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.min(resort.altitude_base / 40, 100)}%`, background: 'rgba(255,255,255,0.2)', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.4)', minWidth: 48 }}>{resort.altitude_base}m</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 28, color: '#60a5fa', lineHeight: 1 }}>{verticalDrop}m</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 3 }}>vertical drop</div>
                  </div>
                </div>
                <div style={{ marginTop: 12, fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
                  {resort.altitude_top >= 3000
                    ? `At ${resort.altitude_top}m, snow cover is highly reliable throughout the season. Glacier access available.`
                    : resort.altitude_top >= 2000
                    ? `${resort.altitude_top}m summit provides good snow reliability in mid-season months.`
                    : `Lower altitude resort — best visited in peak season (January–February) for optimal snow.`}
                </div>
              </div>
            </div>

            {/* ── Terrain ── */}
            <div style={{ marginBottom: 48 }}>
              <h2 style={sectionTitle}>Terrain</h2>
              <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
                <div style={{ width: `${resort.blue_percent}%`, background: '#3b82f6' }} />
                <div style={{ width: `${resort.red_percent}%`, background: '#ef4444' }} />
                <div style={{ width: `${resort.black_percent}%`, background: 'rgba(255,255,255,0.5)' }} />
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                {[
                  { label: 'Blue', pct: resort.blue_percent, color: '#3b82f6' },
                  { label: 'Red', pct: resort.red_percent, color: '#ef4444' },
                  { label: 'Black', pct: resort.black_percent, color: 'rgba(255,255,255,0.6)' },
                ].map(t => (
                  <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: t.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{t.label}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: '#f0ece4' }}>{t.pct}%</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Total pistes',   value: `${resort.total_pistes_km}km` },
                  { label: 'Vertical drop',  value: `${verticalDrop}m` },
                  { label: 'Total lifts',    value: resort.total_lifts },
                  { label: 'Lift capacity',  value: resort.lift_capacity_per_hour ? `${(resort.lift_capacity_per_hour / 1000).toFixed(0)}k/hr` : '—' },
                  { label: 'Off-piste',      value: `${resort.off_piste_score}/10` },
                  { label: 'Snowpark',       value: `${resort.snowpark_score}/10` },
                ].map(item => (
                  <div key={item.label} style={{ ...card, padding: '14px 16px' }}>
                    <div style={fieldLabel}>{item.label}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500, color: '#f0ece4' }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Piste map card */}
              <a
                href={resort.piste_map_url || resort.resort_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block', marginTop: 16, textDecoration: 'none',
                  background: '#1c1a17',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 10, padding: '20px 22px',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <svg
                  viewBox="0 0 400 80"
                  style={{
                    position: 'absolute', bottom: 0, right: 0, width: '55%', opacity: 0.04,
                    pointerEvents: 'none',
                  }}
                >
                  <path d="M400,80 L400,35 L350,10 L310,30 L280,5 L240,28 L210,15 L170,38 L130,20 L100,40 L60,25 L30,45 L0,35 L0,80 Z" fill="#D4A574" />
                </svg>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, position: 'relative' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                    background: 'rgba(212,165,116,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A574" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                      <line x1="8" y1="2" x2="8" y2="18" />
                      <line x1="16" y1="6" x2="16" y2="22" />
                    </svg>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: 'var(--font-heading)', fontSize: 16,
                      color: '#f0ece4', letterSpacing: '0.04em', marginBottom: 4,
                    }}>Piste map</div>
                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: 12,
                      color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, margin: '0 0 12px',
                    }}>
                      View the full trail map for {resort.name} — all runs, lifts and mountain restaurants on the official resort map.
                    </p>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
                      color: '#D4A574', letterSpacing: '0.04em',
                    }}>Open piste map →</span>
                  </div>
                </div>
              </a>
            </div>

            {/* ── Resort scores ── */}
            <div style={{ marginBottom: 48 }}>
              <h2 style={sectionTitle}>Resort scores</h2>
              <div style={{ ...card, padding: '20px 24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {scores.map(s => (
                    <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.4)', minWidth: 170 }}>{s.label}</span>
                      <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 2, width: `${(s.value || 0) * 10}%`, background: s.color }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: '#f0ece4', minWidth: 36, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{s.value}/10</span>
                    </div>
                  ))}
                </div>
                <div style={{
                  marginTop: 20, paddingTop: 16,
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{
                    fontFamily: 'var(--font-heading)', fontSize: 32,
                    color: resort.crowd_score >= 7 ? '#4ade80' : resort.crowd_score >= 5 ? '#fbbf24' : '#fb923c',
                    lineHeight: 1,
                  }}>{resort.crowd_score}/10</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: '#f0ece4', marginBottom: 2 }}>Crowd level</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1.4 }}>
                      {resort.crowd_score >= 8
                        ? 'Uncrowded — short lift queues, wide open pistes.'
                        : resort.crowd_score >= 6
                        ? 'Moderate crowds — busiest at peak weeks and weekends.'
                        : 'Popular resort — expect queues at peak times and school holidays.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Getting there ── */}
            <div style={{ marginBottom: 48 }}>
              <h2 style={sectionTitle}>Getting there</h2>
              <div style={{ ...card, padding: '20px 24px', marginBottom: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                  {[
                    { label: 'Nearest airport',    value: resort.nearest_airport },
                    { label: 'Distance',           value: `${resort.airport_distance_km}km` },
                    { label: 'Est. transfer time', value: estimatedTransferMins },
                    { label: 'Stay in',            value: resort.accommodation_zone },
                  ].map(item => (
                    <div key={item.label}>
                      <div style={fieldLabel}>{item.label}</div>
                      <div style={fieldValue}>{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Transport info */}
                {resort.transport_info && (
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: 8, padding: '12px 16px', marginBottom: 16,
                  }}>
                    <div style={fieldLabel}>By train & flight</div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>
                      {resort.transport_info}
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{
                    fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
                    color: 'rgba(255,255,255,0.4)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 6, padding: '9px 16px',
                    textDecoration: 'none', letterSpacing: '0.04em',
                  }}>Open in Google Maps →</a>
                </div>
              </div>

              {/* Google Maps embed */}
              <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', height: 320 }}>
                <iframe
                  src={mapsEmbedUrl}
                  width="100%"
                  height="320"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* ── Where to stay ── */}
            <div style={{ marginBottom: 48 }}>
              <h2 style={sectionTitle}>Where to stay</h2>
              <div style={{ ...card, padding: '20px 24px', marginBottom: 10 }}>
                <div style={{ marginBottom: resort.where_to_stay ? 16 : 0 }}>
                  <div style={fieldLabel}>Accommodation zone</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: '#f0ece4', marginBottom: resort.where_to_stay ? 16 : 0 }}>
                    {resort.accommodation_zone}
                  </div>
                </div>

                {resort.where_to_stay && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>
                    {resort.where_to_stay}
                  </p>
                )}
              </div>

              {/* Booking.com button */}
              <a href={bookingUrl} target="_blank" rel="noopener noreferrer" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: '#003580',
                borderRadius: 10, padding: '18px 22px',
                textDecoration: 'none',
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 3 }}>
                    Find hotels near {resort.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
                    Search accommodation on Booking.com →
                  </div>
                </div>
                <div style={{
                  fontFamily: 'var(--font-heading)', fontSize: 22,
                  color: '#fff', letterSpacing: '0.06em', flexShrink: 0, marginLeft: 16,
                }}>booking.com</div>
              </a>
            </div>

            {/* ── What it costs ── */}
            <div>
              <h2 style={sectionTitle}>What it costs</h2>
              <div style={{ ...card, padding: '20px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                  {[
                    { label: 'Day ski pass',  value: `€${resort.lift_pass_day_eur}` },
                    { label: 'Week ski pass', value: `€${resort.lift_pass_week_eur}` },
                    { label: 'Price tier',    value: resort.price_tier === 1 ? 'Budget' : resort.price_tier === 2 ? 'Mid-range' : 'Premium' },
                    { label: 'Value score',   value: `${resort.value_score}/10` },
                  ].map(item => (
                    <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={fieldLabel}>{item.label}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500, color: '#f0ece4' }}>{item.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{
                  background: 'rgba(212,165,116,0.05)',
                  border: '1px solid rgba(212,165,116,0.1)',
                  borderRadius: 8, padding: '12px 16px',
                }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
                    A typical week at {resort.name} costs <span style={{ color: '#D4A574', fontWeight: 500 }}>€{weekCostLow.toLocaleString('de-DE')}–€{weekCostHigh.toLocaleString('de-DE')}</span> per person including flights, accommodation and ski pass.
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ── Right column — sticky sidebar ── */}
          <div style={{ position: 'sticky', top: 84 }}>

            {/* Plan trip CTA */}
            <div style={{
              background: 'rgba(212,165,116,0.07)',
              border: '1px solid rgba(212,165,116,0.2)',
              borderRadius: 12, padding: '22px', marginBottom: 12,
            }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500, color: '#D4A574', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>Ready to go?</p>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: '#f0ece4', letterSpacing: '0.03em', marginBottom: 8 }}>{resort.name}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, marginBottom: 18 }}>
                Use the trip planner to rank this resort against your skill level, budget and month.
              </p>
              <Link href="/plan" style={{
                display: 'block', textAlign: 'center',
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#121110', background: '#D4A574',
                borderRadius: 6, padding: '14px 24px', textDecoration: 'none',
              }}>Plan this trip →</Link>
            </div>

            {/* Booking.com */}
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer" style={{
              display: 'block', textAlign: 'center',
              fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
              color: '#fff', background: '#003580',
              borderRadius: 6, padding: '12px 24px',
              textDecoration: 'none', marginBottom: 12,
              letterSpacing: '0.04em',
            }}>Find hotels on Booking.com →</a>

            {/* Official site */}
            <a href={resort.resort_url} target="_blank" rel="noopener noreferrer" style={{
              display: 'block', textAlign: 'center',
              fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
              color: 'rgba(255,255,255,0.4)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6, padding: '12px 24px',
              textDecoration: 'none', marginBottom: 12,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>Official resort website →</a>

            {/* Google Maps */}
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{
              display: 'block', textAlign: 'center',
              fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
              color: 'rgba(255,255,255,0.4)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6, padding: '12px 24px',
              textDecoration: 'none', marginBottom: 16,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>View on Google Maps →</a>

            {/* At a glance */}
            <div style={{ ...card, padding: '20px' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>At a glance</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Base altitude',  value: `${resort.altitude_base}m` },
                  { label: 'Summit',         value: `${resort.altitude_top}m` },
                  { label: 'Vertical drop',  value: `${verticalDrop}m` },
                  { label: 'Total pistes',   value: `${resort.total_pistes_km}km` },
                  { label: 'Total lifts',    value: resort.total_lifts },
                  { label: 'Lift capacity',  value: resort.lift_capacity_per_hour ? `${(resort.lift_capacity_per_hour / 1000).toFixed(0)}k/hr` : '—' },
                  { label: 'Day pass',       value: `€${resort.lift_pass_day_eur}` },
                  { label: 'Week pass',      value: `€${resort.lift_pass_week_eur}` },
                  { label: 'Avg snowfall',   value: `${resort.avg_snowfall_cm}cm` },
                  { label: 'Airport',        value: resort.nearest_airport },
                  { label: 'Transfer',       value: estimatedTransferMins },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 8 }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>{row.label}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: '#f0ece4' }}>{row.value}</span>
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