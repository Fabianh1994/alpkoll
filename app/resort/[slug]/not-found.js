import Link from 'next/link'

// Renderas när getResort() inte hittar sluggen. Till skillnad från den
// tidigare inline-varianten ger den här riktig 404-status i stället för
// en "soft 404" med status 200 — Google behöver skillnaden.
export const metadata = {
  title: 'Skidorten hittades inte — Alpkoll',
  robots: { index: false, follow: true },
}

export default function ResortNotFound() {
  return (
    <div
      style={{
        background: '#121110',
        minHeight: '100vh',
        color: '#f0ece4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 clamp(24px, 5vw, 64px)',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 460 }}>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 500,
            color: '#D4A574',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 18,
          }}
        >
          404
        </p>

        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(32px, 6vw, 52px)',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '0.02em',
            marginBottom: 18,
          }}
        >
          Det här berget
          <br />
          finns inte på kartan.
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            fontWeight: 300,
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.7,
            marginBottom: 36,
          }}
        >
          Skidorten du letar efter finns inte hos oss — än. Bläddra bland de
          orter vi har, eller låt planeraren föreslå en som passar dig.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/#resorts"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#121110',
              background: '#D4A574',
              borderRadius: 3,
              padding: '15px 32px',
              textDecoration: 'none',
            }}
          >
            Alla skidorter
          </Link>

          <Link
            href="/plan"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 3,
              padding: '15px 32px',
              textDecoration: 'none',
            }}
          >
            Planera en resa
          </Link>
        </div>
      </div>
    </div>
  )
}
