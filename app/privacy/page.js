// app/privacy/page.js
export const metadata = {
  title: 'Privacy Policy — Alpkoll',
  description: 'How Alpkoll handles your data. GDPR-compliant, EU-hosted, no tracking cookies.',
};

export default function PrivacyPage() {
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
          Privacy Policy
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
          <Section title="Who we are">
            <p>
              Alpkoll is a ski resort comparison tool operated from Sweden. You can reach us at{' '}
              <a href="mailto:hello@alpkoll.com" style={{ color: '#D4A574', textDecoration: 'none' }}>
                hello@alpkoll.com
              </a>.
            </p>
          </Section>

          <Section title="What data we collect">
            <p>
              <strong style={{ color: '#f0ece4' }}>We collect as little as possible.</strong> Alpkoll does not require 
              you to create an account, and we do not store any personal information in our database.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong style={{ color: '#f0ece4' }}>Analytics:</strong> We use Vercel Web Analytics, which is a 
              privacy-friendly analytics tool that does not use cookies and does not collect personal data. It tracks 
              anonymous page view counts only — no IP addresses, no device fingerprinting, no cross-site tracking.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong style={{ color: '#f0ece4' }}>Affiliate links:</strong> When you click links to Booking.com 
              or Skyscanner, those services may set their own cookies on their websites. We have no control over 
              this — please review their respective privacy policies.
            </p>
          </Section>

          <Section title="Where data is stored">
            <p>
              Our resort database is hosted on Supabase in Stockholm, Sweden (EU region eu-north-1). 
              Our website is hosted on Vercel. No personal user data is stored in either system.
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              Alpkoll itself does not set any cookies. We do not use tracking cookies, advertising cookies, 
              or analytics cookies. Third-party services linked from our site (such as Booking.com and 
              Skyscanner) may use cookies on their own domains.
            </p>
          </Section>

          <Section title="Your rights under GDPR">
            <p>
              Since we do not collect personal data, there is typically nothing to request access to or delete. 
              However, if you believe we hold any of your data, you have the right to:
            </p>
            <ul style={{ marginTop: 8, paddingLeft: 20 }}>
              <li>Request access to your data</li>
              <li>Request correction or deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>File a complaint with the Swedish Authority for Privacy Protection (IMY)</li>
            </ul>
            <p style={{ marginTop: 12 }}>
              Contact us at{' '}
              <a href="mailto:hello@alpkoll.com" style={{ color: '#D4A574', textDecoration: 'none' }}>
                hello@alpkoll.com
              </a>{' '}
              for any privacy-related requests.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              We may update this policy from time to time. The &quot;last updated&quot; date at the top 
              of this page will reflect any changes.
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