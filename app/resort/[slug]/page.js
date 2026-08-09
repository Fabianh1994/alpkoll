import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getResort, getResortSlugs } from '../../../lib/resorts'
import { bookingUrl } from '../../../lib/booking'
import { getLang, SITE_URL } from '../../../lib/lang'
import { manadVersal, manadslista } from '../../../lib/months'
import { restid } from '../../../lib/travel'

// Ortsidorna genereras statiskt vid bygget och byggs om en gång i timmen.
// Möjligt först sedan rotlayouten slutade läsa request-headers (se lib/lang.js).
export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getResortSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const slug = (await params).slug
  const resort = await getResort(slug)

  if (!resort) {
    return { title: 'Skidorten hittades inte — Alpkoll' }
  }

  const baseUrl = SITE_URL
  const place = `${resort.name}, ${resort.country}`

  const title = `${place} — snö, terräng, priser | Alpkoll`

  const description = `${resort.name}: ${resort.total_pistes_km} km pist, ${resort.total_lifts} liftar, ${resort.altitude_base}–${resort.altitude_top} m. Veckopass €${resort.lift_pass_week_eur}, närmaste flygplats ${resort.nearest_airport}. Snögaranti ${resort.snow_guarantee_score}/10.`

  const path = `/resort/${resort.slug}`

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}${path}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}${path}`,
      siteName: 'Alpkoll',
      type: 'article',
      locale: 'sv_SE',
      images: resort.image_url
        ? [{ url: resort.image_url, width: 1200, height: 630, alt: resort.name }]
        : ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: resort.image_url ? [resort.image_url] : ['/og-image.png'],
    },
  }
}

export default async function ResortPage({ params }) {
  const slug = (await params).slug
  const resort = await getResort(slug)

  if (!resort) notFound()

  const lang = getLang()
  const verticalDrop = resort.altitude_top - resort.altitude_base
  const estimatedTransferMins = restid(resort)

  const mapsUrl = `https://www.google.com/maps?q=${resort.latitude},${resort.longitude}`
  const mapsEmbedUrl = `https://maps.google.com/maps?q=${resort.latitude},${resort.longitude}&z=12&output=embed`
  // Affiliate-länkar med separata labels så Partner Hub visar vilken
  // placering som faktiskt konverterar.
  const bookingDestination = resort.accommodation_zone || resort.name
  const bookingHrefMobile = bookingUrl(bookingDestination, { lang, label: `resort-mobile-${resort.slug}` })
  const bookingHrefStay = bookingUrl(bookingDestination, { lang, label: `resort-stay-${resort.slug}` })
  const bookingHrefSidebar = bookingUrl(bookingDestination, { lang, label: `resort-sidebar-${resort.slug}` })

  const weekCostLow = Math.round((resort.lift_pass_week_eur + 400) / 50) * 50
  const weekCostHigh = Math.round((resort.lift_pass_week_eur + 900) / 50) * 50

  const scores = [
    // "Snögaranti" betyder i svensk resebransch ett avtalsvillkor —
    // pengarna tillbaka om snön uteblir. Poängen är en bedömning av
    // sannolikhet, inte en utfästelse.
    { label: 'Snösäkerhet',          value: resort.snow_guarantee_score,  color: '#60a5fa' },
    { label: 'Mellannivå',           value: resort.intermediate_score,    color: '#34d399' },
    { label: 'Avancerad nivå',       value: resort.expert_score,          color: '#a78bfa' },
    { label: 'Nybörjarnivå',         value: resort.beginner_score,        color: '#4ade80' },
    { label: 'Offpist',              value: resort.off_piste_score,       color: '#D4A574' },
    { label: 'Snowpark',             value: resort.snowpark_score,        color: '#f472b6' },
    { label: 'Bykänsla',             value: resort.village_charm_score,   color: '#fbbf24' },
    { label: 'Afterski',             value: resort.apres_ski_score,       color: '#fb923c' },
    { label: 'Familjevänligt',       value: resort.family_friendly_score, color: '#2dd4bf' },
    // Högt crowd_score betyder FÄRRE människor. Etiketten måste peka åt
    // samma håll som skalan — "Trängsel 9/10" hade sagt tvärtom.
    { label: 'Gott om plats',        value: resort.crowd_score,           color: '#e879f9' },
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

  // Strukturerad data för Google. Medvetet utan aggregateRating —
  // poängen är vår egen redaktionella bedömning, inte användarbetyg,
  // och att presentera den som betyg vore missvisande.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SkiResort',
    name: resort.name,
    description: resort.notes || undefined,
    url: `${SITE_URL}/resort/${resort.slug}`,
    image: resort.image_url || undefined,
    sameAs: resort.resort_url || undefined,
    address: {
      '@type': 'PostalAddress',
      addressRegion: resort.region || undefined,
      addressCountry: resort.country || undefined,
    },
    geo:
      resort.latitude && resort.longitude
        ? {
            '@type': 'GeoCoordinates',
            latitude: resort.latitude,
            longitude: resort.longitude,
            elevation: resort.altitude_base,
          }
        : undefined,
  }

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <style>{`
        .resort-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 48px;
          align-items: start;
        }
        .resort-sidebar {
          position: sticky;
          top: 84px;
        }
        .resort-sidebar-mobile-cta {
          display: none;
        }
        @media (max-width: 768px) {
          .resort-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .resort-sidebar {
            display: none;
          }
          .resort-sidebar-mobile-cta {
            display: block;
            margin-bottom: 48px;
          }
          .nav-links-desktop {
            display: none;
          }
          .hero-stat-pills {
            gap: 6px;
          }
          .hero-stat-pills > div {
            padding: 6px 10px;
          }
        }
      `}</style>

      {/* ── Pill Nav ── */}
      <nav style={{
        position: 'fixed', top: 14, left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: 52, width: 'min(92vw, 860px)',
        background: 'rgba(18,17,16,0.88)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 50,
      }}>
        <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: '#f0ece4', letterSpacing: '0.06em', textDecoration: 'none' }}>
          ALPKOLL
        </Link>
        <div className="nav-links-desktop" style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
          {[{ label: 'Skidorter', href: '/#resorts' }, { label: 'Om oss', href: '/about' }].map(item => (
            <a key={item.label} href={item.href} style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {item.label}
            </a>
          ))}
          <Link href="/plan" style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, color: '#121110', background: '#D4A574', textDecoration: 'none', padding: '8px 18px', borderRadius: 40, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Planera resa
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{ position: 'relative', height: '75vh', minHeight: 520, overflow: 'hidden' }}>
        <img
          src={resort.image_url || 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200'}
          alt={resort.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(18,17,16,0.3) 0%, rgba(18,17,16,0.1) 35%, rgba(18,17,16,0.9) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(18,17,16,0.5) 0%, transparent 60%)' }} />

        <div style={{ position: 'absolute', top: 80, left: 'clamp(24px, 4vw, 64px)' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}>← Alla skidorter</Link>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 clamp(24px, 4vw, 64px) 48px' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, color: '#D4A574', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>{resort.region} · {resort.country}</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(40px, 8vw, 88px)', fontWeight: 400, lineHeight: 0.95, color: '#f0ece4', letterSpacing: '0.02em', marginBottom: 24 }}>{resort.name}</h1>

          <div className="hero-stat-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              { label: 'Lägsta',     value: `${resort.altitude_base} m` },
              { label: 'Högsta',     value: `${resort.altitude_top} m` },
              { label: 'Fallhöjd',   value: `${verticalDrop} m` },
              { label: 'Pist',       value: `${resort.total_pistes_km} km` },
              { label: 'Liftar',     value: resort.total_lifts },
              { label: 'Dagskort',   value: `€${resort.lift_pass_day_eur}` },
              { label: 'Veckokort',  value: `€${resort.lift_pass_week_eur}` },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(18,17,16,0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '8px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: 17, color: '#f0ece4', lineHeight: 1 }}>{s.value}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px clamp(24px, 4vw, 40px) 120px' }}>

        {/* Mobile-only CTA — shows above content on small screens */}
        <div className="resort-sidebar-mobile-cta">
          <div style={{ background: 'rgba(212,165,116,0.07)', border: '1px solid rgba(212,165,116,0.2)', borderRadius: 12, padding: '22px', marginBottom: 12 }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500, color: '#D4A574', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>Redo att åka?</p>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: '#f0ece4', letterSpacing: '0.03em', marginBottom: 18 }}>{resort.name}</p>
            <Link href="/plan" style={{ display: 'block', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#121110', background: '#D4A574', borderRadius: 6, padding: '14px 24px', textDecoration: 'none' }}>Planera resan →</Link>
          </div>
          <a href={bookingHrefMobile} target="_blank" rel="noopener noreferrer sponsored" style={{ display: 'block', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: '#fff', background: '#003580', borderRadius: 6, padding: '12px 24px', textDecoration: 'none', letterSpacing: '0.04em' }}>Hitta boende på Booking.com →</a>
        </div>

        <div className="resort-grid">

          {/* ── Left column ── */}
          <div>

            {resort.notes && (
              <div style={{ background: 'rgba(212,165,116,0.06)', border: '1px solid rgba(212,165,116,0.15)', borderLeft: '3px solid #D4A574', borderRadius: '0 10px 10px 0', padding: '16px 20px', marginBottom: 48 }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0 }}>{resort.notes}</p>
              </div>
            )}

            {/* Snow & conditions */}
            <div style={{ marginBottom: 48 }}>
              <h2 style={sectionTitle}>Snö och förhållanden</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[
                  { label: 'Säsongen öppnar',  value: manadVersal(resort.season_start_month) || '—' },
                  { label: 'Säsongen stänger', value: manadVersal(resort.season_end_month) || '—' },
                  { label: 'Bäst i',           value: manadslista(resort.best_months_nums) || '—' },
                  { label: 'Snöfall per säsong', value: `${resort.avg_snowfall_cm} cm` },
                ].map(item => (
                  <div key={item.label} style={{ ...card, padding: '14px 16px' }}>
                    <div style={fieldLabel}>{item.label}</div>
                    <div style={fieldValue}>{item.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ ...card, padding: '18px 20px' }}>
                <div style={fieldLabel}>Höjd och snösäkerhet</div>
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
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 3 }}>fallhöjd</div>
                  </div>
                </div>
                <div style={{ marginTop: 12, fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
                  {resort.altitude_top >= 3000
                    ? `Med ${resort.altitude_top} m på toppen är snön pålitlig hela säsongen, och det finns åkning på glaciär.`
                    : resort.altitude_top >= 2000
                    ? `Toppen på ${resort.altitude_top} m ger god snösäkerhet mitt i säsongen.`
                    : `Lägre belägen ort — kom i januari eller februari för säkrast snö.`}
                </div>
              </div>
            </div>

            {/* Terrain */}
            <div style={{ marginBottom: 48 }}>
              <h2 style={sectionTitle}>Terräng</h2>

              {/* Utan den här raden ser tre orter i Les 3 Vallées ut att ha
                  identiska siffror av misstag. Se migration 004. */}
              {resort.ski_area && (
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: 12,
                  color: 'rgba(255,255,255,0.35)', lineHeight: 1.6,
                  margin: '-12px 0 18px',
                }}>
                  Pist, liftar och höjder avser hela{' '}
                  <span style={{ color: '#D4A574' }}>{resort.ski_area}</span> — området
                  du kommer åt med liftkortet, inte bara {resort.name}.
                </p>
              )}

              <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
                <div style={{ width: `${resort.blue_percent}%`, background: '#3b82f6' }} />
                <div style={{ width: `${resort.red_percent}%`, background: '#ef4444' }} />
                <div style={{ width: `${resort.black_percent}%`, background: 'rgba(255,255,255,0.5)' }} />
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                {[
                  { label: 'Blå', pct: resort.blue_percent, color: '#3b82f6' },
                  { label: 'Röd', pct: resort.red_percent, color: '#ef4444' },
                  { label: 'Svart', pct: resort.black_percent, color: 'rgba(255,255,255,0.6)' },
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
                  { label: 'Pist totalt',    value: `${resort.total_pistes_km} km` },
                  { label: 'Fallhöjd',       value: `${verticalDrop} m` },
                  { label: 'Antal liftar',   value: resort.total_lifts },
                  { label: 'Liftkapacitet',  value: resort.lift_capacity_per_hour ? `${resort.lift_capacity_per_hour.toLocaleString('sv-SE')} personer/tim` : '—' },
                  { label: 'Offpist',        value: `${resort.off_piste_score}/10` },
                  { label: 'Snowpark',       value: `${resort.snowpark_score}/10` },
                ].map(item => (
                  <div key={item.label} style={{ ...card, padding: '14px 16px' }}>
                    <div style={fieldLabel}>{item.label}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500, color: '#f0ece4' }}>{item.value}</div>
                  </div>
                ))}
              </div>
              <a href={resort.piste_map_url || resort.resort_url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: 16, textDecoration: 'none', background: '#1c1a17', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
                <svg viewBox="0 0 400 80" style={{ position: 'absolute', bottom: 0, right: 0, width: '55%', opacity: 0.04, pointerEvents: 'none' }}>
                  <path d="M400,80 L400,35 L350,10 L310,30 L280,5 L240,28 L210,15 L170,38 L130,20 L100,40 L60,25 L30,45 L0,35 L0,80 Z" fill="#D4A574" />
                </svg>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, position: 'relative' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0, background: 'rgba(212,165,116,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A574" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                      <line x1="8" y1="2" x2="8" y2="18" />
                      <line x1="16" y1="6" x2="16" y2="22" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 16, color: '#f0ece4', letterSpacing: '0.04em', marginBottom: 4 }}>Pistkarta</div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, margin: '0 0 12px' }}>Se hela pistkartan för {resort.name} — alla nedfarter, liftar och fjällrestauranger på ortens officiella karta.</p>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: '#D4A574', letterSpacing: '0.04em' }}>Öppna pistkartan →</span>
                  </div>
                </div>
              </a>
            </div>

            {/* Resort scores */}
            <div style={{ marginBottom: 48 }}>
              <h2 style={sectionTitle}>Vårt omdöme</h2>
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
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 32, color: resort.crowd_score >= 7 ? '#4ade80' : resort.crowd_score >= 5 ? '#fbbf24' : '#fb923c', lineHeight: 1 }}>{resort.crowd_score}/10</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: '#f0ece4', marginBottom: 2 }}>Gott om plats</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1.4 }}>
                      {resort.crowd_score >= 8 ? 'Gott om plats — korta liftköer och vidöppna pister.' : resort.crowd_score >= 6 ? 'Måttlig trängsel — mest folk under högsäsong och helger.' : 'Populär ort — räkna med köer under högsäsong och skollov.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Getting there */}
            <div style={{ marginBottom: 48 }}>
              <h2 style={sectionTitle}>Ta sig dit</h2>
              <div style={{ ...card, padding: '20px 24px', marginBottom: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                  {[
                    // "Flyg till", inte "Närmaste flygplats" — fältet anger porten
                    // hit, den flygplats man faktiskt kan boka sig till från
                    // Sverige. Den geografiskt närmaste saknar ibland trafik.
                    { label: 'Flyg till',          value: resort.nearest_airport },
                    { label: 'Avstånd',            value: `${resort.airport_distance_km} km` },
                    { label: 'Ungefärlig restid',  value: estimatedTransferMins },
                    { label: 'Boendeområde',       value: resort.accommodation_zone },
                  ].map(item => (
                    <div key={item.label}>
                      <div style={fieldLabel}>{item.label}</div>
                      <div style={fieldValue}>{item.value}</div>
                    </div>
                  ))}
                </div>
                {resort.transport_info && (
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
                    <div style={fieldLabel}>Med tåg och flyg</div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>{resort.transport_info}</p>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '9px 16px', textDecoration: 'none', letterSpacing: '0.04em' }}>Visa på Google Maps →</a>
                </div>
              </div>
              <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', height: 320 }}>
                <iframe src={mapsEmbedUrl} width="100%" height="320" style={{ border: 0, display: 'block' }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </div>

            {/* Where to stay */}
            <div style={{ marginBottom: 48 }}>
              <h2 style={sectionTitle}>Var du bor</h2>
              <div style={{ ...card, padding: '20px 24px', marginBottom: 10 }}>
                <div style={{ marginBottom: resort.where_to_stay ? 16 : 0 }}>
                  <div style={fieldLabel}>Boendeområde</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: '#f0ece4', marginBottom: resort.where_to_stay ? 16 : 0 }}>{resort.accommodation_zone}</div>
                </div>
                {resort.where_to_stay && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>{resort.where_to_stay}</p>
                )}
              </div>
              <a href={bookingHrefStay} target="_blank" rel="noopener noreferrer sponsored" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#003580', borderRadius: 10, padding: '18px 22px', textDecoration: 'none' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 3 }}>Hitta boende nära {resort.name}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Sök boende på Booking.com →</div>
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: '#fff', letterSpacing: '0.06em', flexShrink: 0, marginLeft: 16 }}>booking.com</div>
              </a>
            </div>

            {/* What it costs */}
            <div>
              <h2 style={sectionTitle}>Vad det kostar</h2>
              <div style={{ ...card, padding: '20px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                  {[
                    { label: 'Dagskort',      value: `€${resort.lift_pass_day_eur}` },
                    { label: 'Veckokort',     value: `€${resort.lift_pass_week_eur}` },
                    { label: 'Prisklass',     value: resort.price_tier === 1 ? 'Budget' : resort.price_tier === 2 ? 'Mellanklass' : 'Premium' },
                    { label: 'Prisvärde',     value: `${resort.value_score}/10` },
                  ].map(item => (
                    <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={fieldLabel}>{item.label}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500, color: '#f0ece4' }}>{item.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'rgba(212,165,116,0.05)', border: '1px solid rgba(212,165,116,0.1)', borderRadius: 8, padding: '12px 16px' }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
                    En vanlig vecka i {resort.name} kostar <span style={{ color: '#D4A574', fontWeight: 500 }}>€{weekCostLow.toLocaleString('sv-SE')}–€{weekCostHigh.toLocaleString('sv-SE')}</span> per person inklusive flyg, boende och liftkort.
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ── Right column — sticky sidebar (desktop only) ── */}
          <div className="resort-sidebar">
            <div style={{ background: 'rgba(212,165,116,0.07)', border: '1px solid rgba(212,165,116,0.2)', borderRadius: 12, padding: '22px', marginBottom: 12 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500, color: '#D4A574', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>Redo att åka?</p>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: '#f0ece4', letterSpacing: '0.03em', marginBottom: 8 }}>{resort.name}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, marginBottom: 18 }}>Använd reseplaneraren för att se hur orten står sig mot din nivå, budget och månad.</p>
              <Link href="/plan" style={{ display: 'block', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#121110', background: '#D4A574', borderRadius: 6, padding: '14px 24px', textDecoration: 'none' }}>Planera resan →</Link>
            </div>
            <a href={bookingHrefSidebar} target="_blank" rel="noopener noreferrer sponsored" style={{ display: 'block', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: '#fff', background: '#003580', borderRadius: 6, padding: '12px 24px', textDecoration: 'none', marginBottom: 12, letterSpacing: '0.04em' }}>Hitta boende på Booking.com →</a>
            <a href={resort.resort_url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '12px 24px', textDecoration: 'none', marginBottom: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Ortens officiella webbplats →</a>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '12px 24px', textDecoration: 'none', marginBottom: 16, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Visa på Google Maps →</a>
            <div style={{ ...card, padding: '20px' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>I korthet</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Lägsta',         value: `${resort.altitude_base} m` },
                  { label: 'Högsta',         value: `${resort.altitude_top} m` },
                  { label: 'Fallhöjd',       value: `${verticalDrop} m` },
                  { label: 'Pist totalt',    value: `${resort.total_pistes_km} km` },
                  { label: 'Antal liftar',   value: resort.total_lifts },
                  { label: 'Liftkapacitet',  value: resort.lift_capacity_per_hour ? `${resort.lift_capacity_per_hour.toLocaleString('sv-SE')} personer/tim` : '—' },
                  { label: 'Dagskort',       value: `€${resort.lift_pass_day_eur}` },
                  { label: 'Veckokort',      value: `€${resort.lift_pass_week_eur}` },
                  { label: 'Snöfall i snitt', value: `${resort.avg_snowfall_cm} cm` },
                  { label: 'Flyg till',      value: resort.nearest_airport },
                  { label: 'Restid',         value: estimatedTransferMins },
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
      <footer style={{ padding: '40px clamp(24px, 4vw, 64px)', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.06em' }}>ALPKOLL</span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>© 2026 — Jämför berg, hitta ditt.</span>
      </footer>

    </div>
  )
}