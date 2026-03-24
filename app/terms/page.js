// app/terms/page.js
export const metadata = {
  title: 'Terms of Use — Alpkoll',
  description: 'Terms and conditions for using Alpkoll, a ski resort comparison tool.',
};

export default function TermsPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#121110',
      color: '#f0ece4',
      padding: '120px clamp(24px, 4vw, 64px) 80px',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Header */}
        <p style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          color: '#D4A574',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}>
          LEGAL
        </p>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(36px, 5vw, 56px)',
          color: '#f0ece4',
          letterSpacing: '0.03em',
          lineHeight: 1.1,
          marginBottom: 12,
        }}>
          Terms of Use
        </h1>
        <p style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 14,
          color: 'rgba(255,255,255,0.3)',
          marginBottom: 48,
        }}>
          Last updated: March 2026
        </p>

        {/* Content */}
        <div style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 15,
          lineHeight: 1.8,
          color: 'rgba(255,255,255,0.65)',
        }}>
          <Section title="What Alpkoll is">
            <p>
              Alpkoll is a free ski resort comparison tool. We help you explore and compare 
              ski resorts based on publicly available data such as snow conditions, terrain, 
              pricing, and accessibility. We do not sell lift passes, flights, or accommodation directly.
            </p>
          </Section>

          <Section title="No guarantees">
            <p>
              Resort data (prices, snow depths, season dates, piste counts) is collected from 
              public sources and updated manually. While we do our best to keep it accurate, 
              conditions change — always verify critical details with the resort or provider 
              before booking.
            </p>
            <p style={{ marginTop: 12 }}>
              Alpkoll is provided &quot;as is&quot; without warranties of any kind. We are not 
              responsible for decisions made based on information shown on this site.
            </p>
          </Section>

          <Section title="Affiliate links">
            <p>
              Some links on Alpkoll point to third-party services such as Booking.com and 
              Skyscanner. These are affiliate links, which means we may earn a small commission 
              if you make a booking through them. This does not affect the price you pay.
            </p>
            <p style={{ marginTop: 12 }}>
              Affiliate relationships do not influence our resort rankings or recommendations. 
              Scoring is based on a transparent weighted formula using structured data — not 
              on commercial partnerships. See our{' '}
              <a href="/affiliate-disclosure" style={{ color: '#D4A574', textDecoration: 'none' }}>
                Affiliate Disclosure
              </a>{' '}
              for more details.
            </p>
          </Section>

          <Section title="Your use of the site">
            <p>
              You may use Alpkoll for personal, non-commercial purposes. You may not scrape, 
              copy, or redistribute our content or database without permission.
            </p>
          </Section>

          <Section title="Intellectual property">
            <p>
              The Alpkoll name, logo, design, and original content are the property of Alpkoll. 
              Resort photos used on the site are sourced from publicly available materials and 
              are used for informational purposes.
            </p>
          </Section>

          <Section title="Changes to these terms">
            <p>
              We may update these terms from time to time. Continued use of the site after 
              changes are posted constitutes acceptance of the updated terms.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about these terms? Email us at{' '}
              <a href="mailto:hello@alpkoll.com" style={{ color: '#D4A574', textDecoration: 'none' }}>
                hello@alpkoll.com
              </a>.
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 22,
        color: '#f0ece4',
        letterSpacing: '0.04em',
        marginBottom: 12,
      }}>
        {title}
      </h2>
      {children}
    </div>
  );
}