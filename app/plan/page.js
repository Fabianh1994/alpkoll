'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ── Scoring formula ──────────────────────────────────────────────
const PRIORITY_BOOSTS = {
  snow:    { snow: 30, terrain: 0,  value: 0,  access: 0,  family: 0,  apres: 0  },
  terrain: { snow: 5,  terrain: 30, value: 0,  access: 0,  family: 0,  apres: 0  },
  value:   { snow: 0,  terrain: 0,  value: 30, access: 5,  family: 5,  apres: 0  },
  access:  { snow: 0,  terrain: 0,  value: 5,  access: 30, family: 0,  apres: 0  },
  family:  { snow: 5,  terrain: 0,  value: 5,  access: 5,  family: 30, apres: 0  },
  apres:   { snow: 0,  terrain: 5,  value: 0,  access: 0,  family: 0,  apres: 30 },
};

function calcWeights(priorities) {
  const w = { snow: 16, terrain: 16, value: 16, access: 16, family: 16, apres: 16 };
  const rankMult = [1.5, 1.2, 1.0];
  priorities.forEach((p, i) => {
    const b = PRIORITY_BOOSTS[p];
    const m = rankMult[i] || 1;
    Object.keys(b).forEach(k => { w[k] += b[k] * m; });
  });
  const total = Object.values(w).reduce((a, b) => a + b, 0);
  Object.keys(w).forEach(k => { w[k] = w[k] / total; });
  return w;
}

function getSkillScore(resort, skill) {
  const map = {
    Beginner:     resort.beginner_score,
    Intermediate: resort.intermediate_score,
    Advanced:     (resort.intermediate_score + resort.expert_score) / 2,
    Expert:       resort.expert_score,
  };
  return (map[skill] || resort.intermediate_score) / 10;
}

function getAccessScore(resort) {
  const km = resort.airport_distance_km;
  if (!km) return 0.5;
  if (km < 50)  return 1.0;
  if (km < 100) return 0.9;
  if (km < 150) return 0.75;
  if (km < 200) return 0.6;
  if (km < 300) return 0.45;
  return 0.3;
}

function isOpenInMonth(resort, month) {
  const monthMap = {
    December: 12, January: 1, February: 2,
    March: 3, April: 4, May: 5,
    June: 6, July: 7, August: 8,
    September: 9, October: 10, November: 11,
  };
  const seasonStartMap = {
    November: 11, December: 12, October: 10,
    September: 9, February: 2,
  };
  const seasonEndMap = {
    April: 4, May: 5, June: 6,
    October: 10, March: 3,
  };
  const m = monthMap[month];
  const start = seasonStartMap[resort.season_start] || 12;
  const end = seasonEndMap[resort.season_end] || 4;
  if (start <= end) return m >= start && m <= end;
  return m >= start || m <= end;
}

function isBudgetFit(resort, budget) {
  if (!budget) return true;
  const pass = resort.lift_pass_week_eur;
  const accommodation = budget * 0.50;
  const flights = budget * 0.15;
  const remaining = budget - flights - accommodation;
  return pass <= remaining * 1.2;
}

function scoreResort(resort, weights, skill) {
  const snowRaw    = (resort.snow_guarantee_score || 5) / 10;
  const terrainRaw = getSkillScore(resort, skill);
  const valueRaw   = (resort.value_score || 5) / 10;
  const accessRaw  = getAccessScore(resort);
  const familyRaw  = (resort.family_friendly_score || 5) / 10;
  const apresRaw   = (resort.apres_ski_score || 5) / 10;

  const score =
    snowRaw    * weights.snow +
    terrainRaw * weights.terrain +
    valueRaw   * weights.value +
    accessRaw  * weights.access +
    familyRaw  * weights.family +
    apresRaw   * weights.apres;

  return Math.round(score * 100);
}

function getWhyText(resort, priorities, skill) {
  if (!priorities.length) {
    return `Solid all-round resort with ${resort.snow_guarantee_score >= 8 ? 'reliable snow' : 'good terrain variety'}.`;
  }
  const p = priorities[0];
  const reasons = {
    snow:    `Snow guarantee score ${resort.snow_guarantee_score}/10. ${resort.altitude_top > 2500 ? 'High altitude ensures reliable cover.' : 'Good snow record for its altitude.'}`,
    terrain: `${resort.total_pistes_km}km of piste, ${resort.black_percent}% black runs. ${resort.off_piste_score >= 8 ? 'Exceptional off-piste access.' : 'Good terrain variety.'}`,
    value:   `Week pass €${resort.lift_pass_week_eur}. ${resort.value_score >= 8 ? 'Excellent value for money.' : 'Reasonable pricing for what it offers.'}`,
    access:  `${resort.airport_distance_km}km from ${resort.nearest_airport} airport. ${resort.airport_distance_km < 100 ? 'Very easy to reach.' : 'Manageable transfer.'}`,
    family:  `Family score ${resort.family_friendly_score}/10. ${resort.beginner_score >= 7 ? 'Strong beginner terrain and ski school.' : 'Good facilities for families.'}`,
    apres:   `Après-ski score ${resort.apres_ski_score}/10. ${resort.apres_ski_score >= 9 ? 'Among the best nightlife in the Alps.' : 'Good bar and restaurant scene.'}`,
  };
  return reasons[p] || reasons.snow;
}

// ── Design tokens ────────────────────────────────────────────────
const T = {
  bg: '#121110', card: '#1c1a17', text: '#f0ece4',
  accent: '#D4A574', muted: 'rgba(255,255,255,0.3)',
  border: 'rgba(255,255,255,0.06)',
};

const cardStyle = {
  background: T.card, borderRadius: 10,
  border: `1px solid ${T.border}`,
  padding: 'clamp(24px, 3vw, 40px)',
  marginBottom: 28,
};

const labelStyle = {
  fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500,
  color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em',
  textTransform: 'uppercase', marginBottom: 8, display: 'block',
};

function PillGroup({ label, options, value, onChange, multi = false, maxSelect = 1, selected = [] }) {
  return (
    <div>
      <div style={{ ...labelStyle, display: 'block', marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
        {options.map(opt => {
          const val = opt.value || opt;
          const isOn = multi ? selected.includes(val) : value === val;
          const isDisabled = multi && !isOn && selected.length >= maxSelect;
          return (
            <button
              key={val}
              onClick={() => !isDisabled && onChange(val)}
              style={{
                fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
                padding: '7px 15px', borderRadius: 20,
                border: isOn
                  ? '1px solid #D4A574'
                  : '1px solid rgba(255,255,255,0.1)',
                background: isOn ? 'rgba(212,165,116,0.1)' : 'rgba(255,255,255,0.02)',
                color: isOn ? '#D4A574' : isDisabled ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.45)',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.18s',
              }}
            >
              {multi && isOn && selected.indexOf(val) >= 0 && (
                <span style={{ marginRight: 5, fontSize: 10 }}>
                  {selected.indexOf(val) + 1}
                </span>
              )}
              {opt.label || opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />;
}

// ── Main component ───────────────────────────────────────────────
export default function PlanPage() {
  const [resorts, setResorts] = useState([]);
  const [step, setStep] = useState(1);

  // Step 1 state
  const [month, setMonth] = useState('February');
  const [skill, setSkill] = useState('Intermediate');
  const [party, setParty] = useState('Couple');
  const [priorities, setPriorities] = useState([]);
  const [days, setDays] = useState(7);
  const [budget, setBudget] = useState(1500);

  // Step 2 state (results + resort selection)
  const [rankedResorts, setRankedResorts] = useState([]);
  const [selectedResort, setSelectedResort] = useState(null);

  // Step 3 state (flights + hotel)
  const [departureInput, setDepartureInput] = useState('Stockholm (ARN)');
  const [departureCode, setDepartureCode] = useState('ARN');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [travelDates, setTravelDates] = useState({ from: '', to: '' });

  useEffect(() => {
    supabase.from('resorts').select('*').then(({ data }) => {
      if (data) setResorts(data);
    });
  }, []);

  // ── Priority toggle ──
  function togglePriority(p) {
    setPriorities(prev => {
      if (prev.includes(p)) return prev.filter(x => x !== p);
      if (prev.length >= 3) return prev;
      return [...prev, p];
    });
  }

  // ── Run scoring ──
  function runScoring() {
    const weights = calcWeights(priorities);
    const scored = resorts
      .filter(r => isOpenInMonth(r, month))
      .filter(r => isBudgetFit(r, budget))
      .map(r => ({
        ...r,
        score: scoreResort(r, weights, skill),
        why: getWhyText(r, priorities, skill),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 7);
    setRankedResorts(scored);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function selectResort(resort) {
    setSelectedResort(resort);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Links ──
  const AIRPORTS = [
    { label: 'Stockholm (ARN)', code: 'ARN' },
    { label: 'Gothenburg (GOT)', code: 'GOT' },
    { label: 'Oslo (OSL)', code: 'OSL' },
    { label: 'Copenhagen (CPH)', code: 'CPH' },
    { label: 'Helsinki (HEL)', code: 'HEL' },
    { label: 'London Heathrow (LHR)', code: 'LHR' },
    { label: 'London Gatwick (LGW)', code: 'LGW' },
    { label: 'Manchester (MAN)', code: 'MAN' },
    { label: 'Amsterdam (AMS)', code: 'AMS' },
    { label: 'Frankfurt (FRA)', code: 'FRA' },
    { label: 'Zurich (ZRH)', code: 'ZRH' },
    { label: 'Paris CDG (CDG)', code: 'CDG' },
    { label: 'Dublin (DUB)', code: 'DUB' },
  ];

  function getFlightLink() {
    if (!selectedResort) return '#';
    const to = selectedResort.nearest_airport_code || selectedResort.nearest_airport || '';
    const from = travelDates.from?.replace(/-/g, '') || '';
    const back = travelDates.to?.replace(/-/g, '') || '';
    return `https://www.skyscanner.net/transport/flights/${departureCode}/${to}/${from}/${back}/`;
  }

  function getBookingLink() {
    if (!selectedResort) return '#';
    const area = encodeURIComponent(selectedResort.accommodation_zone || selectedResort.name);
    return `https://www.booking.com/searchresults.html?ss=${area}&checkin=${travelDates.from}&checkout=${travelDates.to}`;
  }

  // ── Step indicator ──
  function StepDot({ n }) {
    const active = step === n;
    const done = step > n;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: active ? T.accent : done ? 'rgba(212,165,116,0.25)' : 'rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 600,
          color: active ? '#121110' : done ? T.accent : 'rgba(255,255,255,0.2)',
          transition: 'all 0.3s',
        }}>{done ? '✓' : n}</div>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: active ? T.text : 'rgba(255,255,255,0.2)',
        }}>
          {n === 1 ? 'What you want' : n === 2 ? 'Your resorts' : 'Book it'}
        </span>
      </div>
    );
  }

  const inputStyle = {
    width: '100%', fontFamily: 'var(--font-body)', fontSize: 13,
    padding: '11px 16px', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 4, color: T.text, outline: 'none', boxSizing: 'border-box',
  };

  const ctaStyle = (disabled) => ({
    width: '100%', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    color: disabled ? 'rgba(18,17,16,0.4)' : '#121110',
    background: disabled ? 'rgba(212,165,116,0.35)' : T.accent,
    border: 'none', borderRadius: 6, padding: '16px 32px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background 0.2s', marginTop: 24,
    display: 'block', textAlign: 'center', textDecoration: 'none',
  });

  const backLink = {
    background: 'none', border: 'none', cursor: 'pointer',
    fontFamily: 'var(--font-body)', fontSize: 12,
    color: 'rgba(255,255,255,0.25)', textDecoration: 'underline',
    marginTop: 12, padding: 0,
  };

  // ── Budget breakdown ──
  const flights = Math.round(budget * 0.15);
  const hotel = Math.round(budget * 0.50);
  const onMtn = budget - flights - hotel;

  return (
    <div style={{ background: T.bg, minHeight: '100vh', color: T.text }}>

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
          color: T.text, letterSpacing: '0.06em', textDecoration: 'none',
        }}>ALPKOLL</Link>
        <div style={{ display: 'flex', gap: 28 }}>
          {[
            { label: 'Resorts', href: '/#resorts' },
            { label: 'Plan a Trip', href: '/plan' },
            { label: 'About', href: '/about' },
          ].map(item => (
            <a key={item.label} href={item.href} style={{
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
              color: item.label === 'Plan a Trip' ? T.accent : 'rgba(255,255,255,0.4)',
              textDecoration: 'none', letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>{item.label}</a>
          ))}
        </div>
      </nav>

      <main style={{
        maxWidth: 740, margin: '0 auto',
        padding: '110px clamp(24px, 4vw, 48px) 120px',
      }}>

        {/* Header */}
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
          color: T.accent, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12,
        }}>Trip Planner</p>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(40px, 6vw, 68px)',
          fontWeight: 400, lineHeight: 0.95, color: T.text,
          marginBottom: 14, letterSpacing: '0.02em',
        }}>Find Your<br /><span style={{ color: T.accent }}>Mountain.</span></h1>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 300,
          color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: 48,
          maxWidth: 480,
        }}>
          Tell us what you want, set your budget, and we'll rank every resort in our database against your preferences.
        </p>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 40 }}>
          <StepDot n={1} />
          <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          <StepDot n={2} />
          <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          <StepDot n={3} />
        </div>

        {/* ── STEP 1 — What you want ── */}
        {step === 1 && (
          <div style={{ animation: 'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
            <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }`}</style>

            <div style={{ marginBottom: 8 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500, color: T.accent, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>Step 1 of 3</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, color: T.text, letterSpacing: '0.04em', marginBottom: 4 }}>What are you looking for?</h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 24 }}>Tell us about your trip — we'll find resorts that actually fit.</p>
            </div>

            <div style={cardStyle}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

                <PillGroup
                  label="When are you going?"
                  options={['December', 'January', 'February', 'March', 'April']}
                  value={month}
                  onChange={setMonth}
                />

                <Divider />

                <PillGroup
                  label="Skill level"
                  options={['Beginner', 'Intermediate', 'Advanced', 'Expert']}
                  value={skill}
                  onChange={setSkill}
                />

                <Divider />

                <PillGroup
                  label="Travelling as"
                  options={['Solo', 'Couple', 'Group', 'Family with kids']}
                  value={party}
                  onChange={setParty}
                />

                <Divider />

                <div>
                  <div style={{ ...labelStyle, display: 'block', marginBottom: 4 }}>
                    What matters most?
                    <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.2)', textTransform: 'none', letterSpacing: 0, marginLeft: 8 }}>
                      Pick up to 3 — first pick counts most
                    </span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.25)', marginBottom: 10 }}>
                    {priorities.length === 0 && 'Nothing selected yet — we\'ll use balanced weights'}
                    {priorities.length > 0 && priorities.length < 3 && `${priorities.length} selected — pick ${3 - priorities.length} more or continue`}
                    {priorities.length === 3 && '3 selected — click any to deselect'}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {[
                      { key: 'snow',    icon: '❄', label: 'Best snow',     hint: 'Reliable cover, high altitude' },
                      { key: 'terrain', icon: '⛰', label: 'Big terrain',   hint: 'Piste km, off-piste, vertical' },
                      { key: 'value',   icon: '💰', label: 'Best value',    hint: 'Pass price, accommodation' },
                      { key: 'access',  icon: '✈', label: 'Easy to reach', hint: 'Short airport transfer' },
                      { key: 'family',  icon: '🏠', label: 'Family',        hint: 'Ski school, gentle slopes' },
                      { key: 'apres',   icon: '🎉', label: 'Après-ski',     hint: 'Bars, nightlife, scene' },
                    ].map(({ key, icon, label, hint }) => {
                      const isOn = priorities.includes(key);
                      const rank = priorities.indexOf(key);
                      const isDisabled = !isOn && priorities.length >= 3;
                      return (
                        <div key={key} onClick={() => !isDisabled && togglePriority(key)}
                          style={{
                            border: isOn ? '1px solid #D4A574' : '1px solid rgba(255,255,255,0.07)',
                            borderRadius: 10, padding: '12px 13px',
                            background: isOn ? 'rgba(212,165,116,0.07)' : 'rgba(255,255,255,0.02)',
                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                            opacity: isDisabled ? 0.3 : 1,
                            position: 'relative', transition: 'all 0.18s', userSelect: 'none',
                          }}>
                          {isOn && (
                            <div style={{
                              position: 'absolute', top: 7, right: 9,
                              width: 16, height: 16, borderRadius: '50%',
                              background: T.accent, color: '#121110',
                              fontSize: 9, fontWeight: 700,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>{rank + 1}</div>
                          )}
                          <div style={{ fontSize: 16, marginBottom: 6 }}>{icon}</div>
                          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: T.text, marginBottom: 2 }}>{label}</div>
                          <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(255,255,255,0.3)', lineHeight: 1.4 }}>{hint}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 — Budget */}
            <div style={{ marginBottom: 8 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500, color: T.accent, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>Step 2 of 3</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, color: T.text, letterSpacing: '0.04em', marginBottom: 4 }}>How much can it cost?</h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 24 }}>Total per person — flights, hotel, ski pass and food included.</p>
            </div>

            <div style={cardStyle}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

                <PillGroup
                  label="Trip length"
                  options={[
                    { label: '4 days', value: 4 },
                    { label: '1 week', value: 7 },
                    { label: '10 days', value: 10 },
                    { label: '2 weeks', value: 14 },
                  ]}
                  value={days}
                  onChange={setDays}
                />

                <Divider />

                <div>
                  <div style={{ ...labelStyle, display: 'block', marginBottom: 12 }}>Total budget per person</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 14 }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: 'rgba(255,255,255,0.3)' }}>€</span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 52, color: T.text, lineHeight: 1, letterSpacing: '-0.01em' }}>
                      {budget.toLocaleString('de-DE')}
                    </span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.3)', marginLeft: 6 }}>per person, total</span>
                  </div>

                  <input
                    type="range" min={400} max={5000} step={50} value={budget}
                    onChange={e => setBudget(parseInt(e.target.value))}
                    style={{
                      width: '100%', height: 4, borderRadius: 2, outline: 'none',
                      cursor: 'pointer', marginBottom: 6, appearance: 'none',
                      background: `linear-gradient(to right, #D4A574 ${(budget - 400) / 4600 * 100}%, rgba(255,255,255,0.1) ${(budget - 400) / 4600 * 100}%)`,
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
                    <span>€400</span><span>€5,000</span>
                  </div>

                  {/* Breakdown */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 16 }}>
                    {[
                      { cat: '✈ Flights', val: `€${flights}`, note: 'Return pp' },
                      { cat: '🏨 Hotel', val: `€${hotel}`, note: `${days} nights pp` },
                      { cat: '🎿 On mountain', val: `€${onMtn}`, note: `Pass + food, ${days} days` },
                    ].map(b => (
                      <div key={b.cat} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px' }}>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>{b.cat}</div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500, color: T.text }}>{b.val}</div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>{b.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={runScoring} style={ctaStyle(false)}>
                Show me my resorts →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2 — Results ── */}
        {step === 2 && (
          <div style={{ animation: 'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
            <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }`}</style>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500, color: T.accent, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>Step 2 of 3</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, color: T.text, letterSpacing: '0.04em', marginBottom: 4 }}>Your resorts</h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 24 }}>
              Ranked by how well they match your preferences. Click one to continue.
            </p>

            {/* Summary chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 24 }}>
              {[
                month,
                skill,
                party,
                priorities.length ? priorities.map(p => ({ snow: '❄ Snow', terrain: '⛰ Terrain', value: '💰 Value', access: '✈ Access', family: '🏠 Family', apres: '🎉 Après' }[p])).join(' · ') : 'Balanced',
                `€${budget.toLocaleString('de-DE')}`,
                `${days} days`,
              ].map(chip => (
                <span key={chip} style={{
                  fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
                  padding: '4px 12px', borderRadius: 20,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: 'rgba(255,255,255,0.45)',
                }}>{chip}</span>
              ))}
            </div>

            {rankedResorts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-body)' }}>
                No resorts matched your filters. Try a higher budget or different month.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {rankedResorts.map((resort, i) => (
                  <div key={resort.slug} onClick={() => selectResort(resort)}
                    style={{
                      background: T.card, borderRadius: 10,
                      border: `1px solid ${i === 0 ? 'rgba(212,165,116,0.2)' : T.border}`,
                      padding: '14px 18px',
                      display: 'flex', alignItems: 'center', gap: 16,
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,165,116,0.3)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = i === 0 ? 'rgba(212,165,116,0.2)' : T.border; e.currentTarget.style.transform = 'none'; }}
                  >
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.2)', minWidth: 20 }}>#{i + 1}</div>
                    <img src={resort.image_url} alt={resort.name}
                      style={{ width: 60, height: 44, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
                        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: T.text, letterSpacing: '0.03em' }}>{resort.name}</span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{resort.country}</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.45 }}>{resort.why}</div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 7, flexWrap: 'wrap' }}>
                        {resort.snow_guarantee_score >= 8 && <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 8, background: 'rgba(29,158,117,0.12)', color: '#1D9E75' }}>Snow {resort.snow_guarantee_score}</span>}
                        {resort.total_pistes_km >= 200 && <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 8, background: 'rgba(83,74,183,0.12)', color: '#534AB7' }}>{resort.total_pistes_km}km</span>}
                        {resort.value_score >= 8 && <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 8, background: 'rgba(186,117,23,0.12)', color: '#BA7517' }}>Great value</span>}
                        {resort.airport_distance_km <= 100 && <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 8, background: 'rgba(59,139,212,0.12)', color: '#185FA5' }}>{resort.airport_distance_km}km transfer</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 34, color: i === 0 ? T.accent : 'rgba(255,255,255,0.4)', lineHeight: 1 }}>{resort.score}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>/100</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => setStep(1)} style={{ ...backLink, marginTop: 20 }}>← Edit preferences</button>
          </div>
        )}

        {/* ── STEP 3 — Book it ── */}
        {step === 3 && selectedResort && (
          <div style={{ animation: 'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1)' }}>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500, color: T.accent, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>Step 3 of 3</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, color: T.text, letterSpacing: '0.04em', marginBottom: 4 }}>Book your trip</h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 24 }}>
              Resort: <span style={{ color: T.accent }}>{selectedResort.name}</span>
              {' '}· Nearest airport: <span style={{ color: T.text }}>{selectedResort.nearest_airport}</span>
              {' '}· {selectedResort.airport_distance_km}km transfer
            </p>

            <div style={cardStyle}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                <div>
                  <label style={labelStyle}>Flying from</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="Type city or airport..."
                      value={departureInput}
                      onChange={e => { setDepartureInput(e.target.value); setShowSuggestions(true); }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                      style={inputStyle}
                    />
                    {showSuggestions && (
                      <div style={{
                        position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                        background: T.card, border: '1px solid rgba(255,255,255,0.1)',
                        borderTop: 'none', borderRadius: '0 0 6px 6px',
                        maxHeight: 220, overflowY: 'auto',
                      }}>
                        {AIRPORTS.filter(a => a.label.toLowerCase().includes(departureInput.toLowerCase())).map(a => (
                          <div key={a.code}
                            onMouseDown={() => { setDepartureInput(a.label); setDepartureCode(a.code); setShowSuggestions(false); }}
                            style={{ padding: '10px 16px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', borderBottom: `1px solid ${T.border}` }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,165,116,0.08)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >{a.label}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Departure date</label>
                    <input type="date" value={travelDates.from}
                      onChange={e => setTravelDates({ ...travelDates, from: e.target.value })}
                      style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Return date</label>
                    <input type="date" value={travelDates.to}
                      onChange={e => setTravelDates({ ...travelDates, to: e.target.value })}
                      style={inputStyle} />
                  </div>
                </div>
              </div>

              <a href={getFlightLink()} target="_blank" rel="noopener noreferrer"
                style={ctaStyle(!travelDates.from || !travelDates.to)}>
                Search flights on Skyscanner →
              </a>

              <a href={getBookingLink()} target="_blank" rel="noopener noreferrer"
                style={{ ...ctaStyle(!travelDates.from || !travelDates.to), marginTop: 10, background: 'transparent', color: travelDates.from && travelDates.to ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.08)' }}>
                Find hotels on Booking.com →
              </a>
            </div>

            {/* Trip summary */}
            <div style={{
              background: 'rgba(212,165,116,0.05)', borderRadius: 10,
              border: '1px solid rgba(212,165,116,0.12)',
              padding: '22px 24px', marginBottom: 20,
            }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: T.accent, letterSpacing: '0.06em', marginBottom: 14 }}>Trip summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {[
                  { label: 'Resort', value: `${selectedResort.name}, ${selectedResort.country}` },
                  { label: 'Score', value: `${selectedResort.score}/100` },
                  { label: 'Dates', value: travelDates.from ? `${travelDates.from} → ${travelDates.to}` : 'Not set' },
                  { label: 'Flying from', value: departureInput },
                  { label: 'Fly to', value: `${selectedResort.nearest_airport} airport` },
                  { label: 'Transfer', value: `${selectedResort.airport_distance_km}km to resort` },
                  { label: 'Budget', value: `€${budget.toLocaleString('de-DE')} per person` },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', minWidth: 100 }}>{row.label}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: T.text }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href={`/resort/${selectedResort.slug}`} style={{
              display: 'block', textAlign: 'center', padding: '12px',
              fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
              color: 'rgba(255,255,255,0.35)', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6,
              marginBottom: 12, letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>View full resort details →</Link>

            <div style={{ display: 'flex', gap: 20 }}>
              <button onClick={() => setStep(2)} style={backLink}>← Back to results</button>
              <button onClick={() => { setStep(1); setRankedResorts([]); setSelectedResort(null); setPriorities([]); }} style={backLink}>Start over</button>
            </div>
          </div>
        )}

      </main>

      <footer style={{
        padding: '40px clamp(24px, 4vw, 64px)',
        borderTop: `1px solid ${T.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.06em' }}>ALPKOLL</span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>© 2026 — Compare mountains, find yours.</span>
      </footer>

    </div>
  );
}