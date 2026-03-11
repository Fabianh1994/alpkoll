'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const DEPARTURE_CITIES = [
  { label: 'Stockholm (ARN)', code: 'ARN' },
  { label: 'Gothenburg (GOT)', code: 'GOT' },
  { label: 'Malmö (MMX)', code: 'MMX' },
  { label: 'Oslo (OSL)', code: 'OSL' },
  { label: 'Bergen (BGO)', code: 'BGO' },
  { label: 'Trondheim (TRD)', code: 'TRD' },
  { label: 'Copenhagen (CPH)', code: 'CPH' },
  { label: 'Helsinki (HEL)', code: 'HEL' },
  { label: 'Tampere (TMP)', code: 'TMP' },
  { label: 'London Heathrow (LHR)', code: 'LHR' },
  { label: 'London Gatwick (LGW)', code: 'LGW' },
  { label: 'Manchester (MAN)', code: 'MAN' },
  { label: 'Dublin (DUB)', code: 'DUB' },
];

function OptionGroup({ label, options, value, onChange }) {
  return (
    <div>
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
        color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em',
        textTransform: 'uppercase', marginBottom: 10,
      }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map(opt => {
          const isSelected = value === (opt.value || opt);
          return (
            <button
              key={opt.value || opt}
              onClick={() => onChange(opt.value || opt)}
              style={{
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: isSelected ? 600 : 400,
                padding: '9px 16px',
                borderRadius: 4,
                border: isSelected ? '1px solid rgba(212,165,116,0.6)' : '1px solid rgba(255,255,255,0.08)',
                background: isSelected ? 'rgba(212,165,116,0.12)' : 'rgba(255,255,255,0.03)',
                color: isSelected ? '#D4A574' : 'rgba(255,255,255,0.45)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >{opt.label || opt}</button>
          );
        })}
      </div>
    </div>
  );
}

export default function PlanPage() {
  const [resorts, setResorts] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [preferences, setPreferences] = useState({
    skillLevel: 'Intermediate',
    budget: '50',
    month: 'February',
    priority: 'Snow quality',
  });

  const [rankedResorts, setRankedResorts] = useState([]);
  const [selectedResort, setSelectedResort] = useState(null);
  const [departureCity, setDepartureCity] = useState(DEPARTURE_CITIES[0]);
  const [departurInput, setDeparturInput] = useState('Stockholm (ARN)');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [travelDates, setTravelDates] = useState({ from: '', to: '' });
  const [scrolled, setScrolled] = useState(false);

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

  async function handleFindResorts() {
    setLoading(true);
    setRankedResorts([]);
    try {
      const res = await fetch('/api/score-resorts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resorts, preferences }),
      });
      const data = await res.json();
      const merged = data.scored.slice(0, 10).map(s => ({
        ...resorts.find(r => r.slug === s.slug),
        ai_score: s.score,
        ai_reason: s.reason,
      }));
      setRankedResorts(merged);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  function handleSelectResort(resort) {
    setSelectedResort(resort);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function getFlightLink() {
    if (!selectedResort) return '#';
    const airport = selectedResort.nearest_airport_code || selectedResort.nearest_airport || '';
    const from = travelDates.from.replace(/-/g, '');
    const to = travelDates.to.replace(/-/g, '');
    return `https://www.skyscanner.net/transport/flights/${departureCity.code}/${airport}/${from}/${to}/`;
  }

  function getBookingLink() {
    if (!selectedResort) return '#';
    const area = encodeURIComponent(selectedResort.accommodation_zone || selectedResort.name);
    return `https://www.booking.com/searchresults.html?ss=${area}&checkin=${travelDates.from}&checkout=${travelDates.to}`;
  }

  const inputStyle = {
    width: '100%', fontFamily: 'var(--font-body)', fontSize: 14,
    padding: '12px 16px', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 4, color: '#f0ece4', outline: 'none', boxSizing: 'border-box',
  };

  const labelStyle = {
    fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
    color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em',
    textTransform: 'uppercase', marginBottom: 8, display: 'block',
  };

  const cardStyle = {
    background: '#1c1a17', borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.06)',
    padding: 'clamp(28px, 4vw, 48px)',
    marginBottom: 32,
  };

  const primaryBtn = (disabled) => ({
    width: '100%', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    color: disabled ? 'rgba(18,17,16,0.4)' : '#121110',
    background: disabled ? 'rgba(212,165,116,0.4)' : '#D4A574',
    border: 'none', borderRadius: 3, padding: '18px 32px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s', marginTop: 28,
  });

  function StepIndicator() {
    return (
      <div style={{ display: 'flex', gap: 0, marginBottom: 48, alignItems: 'center' }}>
        {[
          { n: 1, label: 'Resort' },
          { n: 2, label: 'Flights' },
          { n: 3, label: 'Hotel' },
        ].map((s, i) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: step === s.n ? '#D4A574' : step > s.n ? 'rgba(212,165,116,0.3)' : 'rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-heading)', fontSize: 16,
                color: step === s.n ? '#121110' : step > s.n ? '#D4A574' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.3s',
              }}>{step > s.n ? '✓' : s.n}</div>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: step === s.n ? '#f0ece4' : 'rgba(255,255,255,0.25)',
              }}>{s.label}</span>
            </div>
            {i < 2 && (
              <div style={{
                width: 48, height: 1, margin: '0 16px',
                background: step > s.n ? 'rgba(212,165,116,0.3)' : 'rgba(255,255,255,0.08)',
              }} />
            )}
          </div>
        ))}
      </div>
    );
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

      <main style={{
        maxWidth: 780, margin: '0 auto',
        padding: '120px clamp(24px, 4vw, 64px) 120px',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
          color: '#D4A574', letterSpacing: '0.2em', textTransform: 'uppercase',
          marginBottom: 16,
        }}>Plan Your Trip</p>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(42px, 6vw, 72px)',
          fontWeight: 400, lineHeight: 0.95,
          color: '#f0ece4', marginBottom: 16, letterSpacing: '0.02em',
        }}>Resort. Flights.<br /><span style={{ color: '#D4A574' }}>Hotel.</span></h1>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300,
          color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: 56,
        }}>
          Plan your full ski trip in three steps. Claude finds your best resort match, then we help you sort flights and accommodation.
        </p>

        <StepIndicator />

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: 28,
              color: '#f0ece4', letterSpacing: '0.04em', marginBottom: 24,
            }}>Step 1 — Find Your Resort</h2>

            <div style={cardStyle}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

                <OptionGroup
                  label="Skill Level"
                  options={['Beginner', 'Intermediate', 'Advanced', 'Expert']}
                  value={preferences.skillLevel}
                  onChange={v => setPreferences({ ...preferences, skillLevel: v })}
                />

                <OptionGroup
                  label="Max Day Pass (EUR)"
                  options={[
                    { label: 'Up to €30', value: '30' },
                    { label: 'Up to €40', value: '40' },
                    { label: 'Up to €50', value: '50' },
                    { label: 'Up to €60', value: '60' },
                    { label: 'Up to €70', value: '70' },
                    { label: 'Up to €80', value: '80' },
                    { label: 'Any budget', value: 'Any' },
                  ]}
                  value={preferences.budget}
                  onChange={v => setPreferences({ ...preferences, budget: v })}
                />

                <OptionGroup
                  label="Travel Month"
                  options={['December', 'January', 'February', 'March', 'April']}
                  value={preferences.month}
                  onChange={v => setPreferences({ ...preferences, month: v })}
                />

                <OptionGroup
                  label="Top Priority"
                  options={['Snow quality', 'Terrain variety', 'Après ski', 'Village charm', 'Value for money', 'Off-piste']}
                  value={preferences.priority}
                  onChange={v => setPreferences({ ...preferences, priority: v })}
                />

              </div>

              <button onClick={handleFindResorts} disabled={loading} style={primaryBtn(loading)}>
                {loading ? 'Claude is thinking...' : 'Find My Best Resorts →'}
              </button>
            </div>

            {rankedResorts.length > 0 && (
              <div>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: 13,
                  color: 'rgba(255,255,255,0.35)', marginBottom: 16,
                }}>Top 10 matches — click one to continue to flights</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {rankedResorts.map((resort, i) => (
                    <div key={resort.slug} onClick={() => handleSelectResort(resort)}
                      style={{
                        background: '#1c1a17', borderRadius: 6,
                        border: '1px solid rgba(255,255,255,0.06)',
                        padding: '16px 20px',
                        display: 'flex', alignItems: 'center', gap: 16,
                        cursor: 'pointer', transition: 'border-color 0.2s',
                      }}>
                      <div style={{
                        fontFamily: 'var(--font-heading)', fontSize: 28,
                        color: i === 0 ? '#D4A574' : 'rgba(255,255,255,0.15)',
                        minWidth: 36, textAlign: 'center',
                      }}>#{i + 1}</div>
                      <img src={resort.image_url} alt={resort.name}
                        style={{ width: 64, height: 46, objectFit: 'cover', borderRadius: 3, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontFamily: 'var(--font-heading)', fontSize: 20,
                          color: '#f0ece4', letterSpacing: '0.03em', marginBottom: 3,
                        }}>{resort.name}</div>
                        <div style={{
                          fontFamily: 'var(--font-body)', fontSize: 12,
                          color: 'rgba(255,255,255,0.3)', fontStyle: 'italic',
                        }}>{resort.ai_reason}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{
                          fontFamily: 'var(--font-heading)', fontSize: 32, color: '#D4A574',
                        }}>{resort.ai_score}</div>
                        <div style={{
                          fontFamily: 'var(--font-body)', fontSize: 10,
                          color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase',
                        }}>/100</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && selectedResort && (
          <div>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: 28,
              color: '#f0ece4', letterSpacing: '0.04em', marginBottom: 8,
            }}>Step 2 — Find Flights</h2>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 13,
              color: 'rgba(255,255,255,0.35)', marginBottom: 24,
            }}>
              Resort: <span style={{ color: '#D4A574' }}>{selectedResort.name}</span>
              {' '}· Nearest airport: <span style={{ color: '#f0ece4' }}>{selectedResort.nearest_airport || 'See resort page'}</span>
            </p>

            <div style={cardStyle}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                {/* Departure city autocomplete */}
                <div>
                  <label style={labelStyle}>Flying From</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="Type a city or airport..."
                      value={departurInput}
                      onChange={e => {
                        setDeparturInput(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                      style={inputStyle}
                    />
                    {showSuggestions && departurInput.length > 0 && (
                      <div style={{
                        position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                        background: '#1c1a17',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderTop: 'none', borderRadius: '0 0 4px 4px',
                        maxHeight: 240, overflowY: 'auto',
                      }}>
                        {DEPARTURE_CITIES.filter(c =>
                          c.label.toLowerCase().includes(departurInput.toLowerCase())
                        ).map(c => (
                          <div key={c.code}
                            onMouseDown={() => {
                              setDepartureCity(c);
                              setDeparturInput(c.label);
                              setShowSuggestions(false);
                            }}
                            style={{
                              padding: '11px 16px',
                              fontFamily: 'var(--font-body)', fontSize: 13,
                              color: 'rgba(255,255,255,0.7)',
                              cursor: 'pointer',
                              borderBottom: '1px solid rgba(255,255,255,0.04)',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,165,116,0.08)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >{c.label}</div>
                        ))}
                        {DEPARTURE_CITIES.filter(c =>
                          c.label.toLowerCase().includes(departurInput.toLowerCase())
                        ).length === 0 && (
                          <div style={{
                            padding: '11px 16px',
                            fontFamily: 'var(--font-body)', fontSize: 13,
                            color: 'rgba(255,255,255,0.25)', fontStyle: 'italic',
                          }}>No matches — try an airport code like "LHR"</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Dates */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <label style={labelStyle}>Departure Date</label>
                    <input type="date" value={travelDates.from}
                      onChange={e => setTravelDates({ ...travelDates, from: e.target.value })}
                      style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Return Date</label>
                    <input type="date" value={travelDates.to}
                      onChange={e => setTravelDates({ ...travelDates, to: e.target.value })}
                      style={inputStyle} />
                  </div>
                </div>
              </div>

              <a href={getFlightLink()} target="_blank" rel="noopener noreferrer"
                style={{ ...primaryBtn(!travelDates.from || !travelDates.to), display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                Search Flights on Skyscanner →
              </a>

              <button onClick={() => setStep(3)}
                disabled={!travelDates.from || !travelDates.to}
                style={{
                  ...primaryBtn(!travelDates.from || !travelDates.to),
                  marginTop: 12, background: 'transparent',
                  color: travelDates.from && travelDates.to ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                Continue to Hotel →
              </button>
            </div>

            <button onClick={() => setStep(1)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 13,
              color: 'rgba(255,255,255,0.25)', textDecoration: 'underline',
            }}>← Change resort</button>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && selectedResort && (
          <div>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: 28,
              color: '#f0ece4', letterSpacing: '0.04em', marginBottom: 8,
            }}>Step 3 — Find a Hotel</h2>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 13,
              color: 'rgba(255,255,255,0.35)', marginBottom: 24,
            }}>
              Accommodation near <span style={{ color: '#D4A574' }}>{selectedResort.name}</span>
              {travelDates.from && ` · ${travelDates.from} → ${travelDates.to}`}
            </p>

            <div style={cardStyle}>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 14,
                color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 28,
              }}>
                We'll open Booking.com with your dates and resort area pre-filled.
                Browse options and book directly — no middleman, no extra fees.
              </p>

              <a href={getBookingLink()} target="_blank" rel="noopener noreferrer"
                style={{ ...primaryBtn(false), display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                Find Hotels on Booking.com →
              </a>
            </div>

            {/* Trip summary */}
            <div style={{
              background: 'rgba(212,165,116,0.06)', borderRadius: 8,
              border: '1px solid rgba(212,165,116,0.15)',
              padding: '24px 28px', marginTop: 32,
            }}>
              <h3 style={{
                fontFamily: 'var(--font-heading)', fontSize: 20,
                color: '#D4A574', letterSpacing: '0.06em', marginBottom: 16,
              }}>Your Trip Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Resort', value: selectedResort.name },
                  { label: 'Country', value: selectedResort.country },
                  { label: 'Flying from', value: departurInput },
                  { label: 'Dates', value: travelDates.from ? `${travelDates.from} → ${travelDates.to}` : 'Not set' },
                  { label: 'Nearest airport', value: selectedResort.nearest_airport || '—' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', gap: 16 }}>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: 12,
                      color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
                      letterSpacing: '0.08em', minWidth: 120,
                    }}>{row.label}</span>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: 13, color: '#f0ece4',
                    }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
              <button onClick={() => setStep(2)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: 13,
                color: 'rgba(255,255,255,0.25)', textDecoration: 'underline',
              }}>← Back to flights</button>
              <button onClick={() => { setStep(1); setRankedResorts([]); setSelectedResort(null); }} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: 13,
                color: 'rgba(255,255,255,0.25)', textDecoration: 'underline',
              }}>Start over</button>
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
