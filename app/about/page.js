// Kort och utan avsändare. Fabian ville inte ha sidan personlig (15 september
// 2026): inget namn, inga skidår, inga orter han åkt. Metoden bakom talen står
// inte här utan på sidorna där talen visas.

import SiteHeader from '../SiteHeader';
import SiteFooter from '../SiteFooter';

export const metadata = {
  title: 'Om Alpkoll',
  description:
    'Alpkoll samlar skidorterna i Sverige, Norden och Alperna på ett ställe, med pist och fallhöjd ur samma källa, liftkortet i kronor och restiden från svenska städer.',
  alternates: { canonical: '/about' },
};

const KONTAKT = 'hello@alpkoll.com';

export default function AboutPage() {
  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>
      <SiteHeader />

      <main style={{
        paddingTop: 'clamp(140px, 20vh, 200px)',
        paddingBottom: 'clamp(80px, 12vh, 140px)',
        paddingLeft: 'clamp(24px, 4vw, 64px)',
        paddingRight: 'clamp(24px, 4vw, 64px)',
        maxWidth: 900,
        margin: '0 auto',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(40px, 7vw, 72px)',
          fontWeight: 400, lineHeight: 0.95,
          color: '#f0ece4', letterSpacing: '0.02em',
          marginBottom: 32,
        }}>Om Alpkoll</h1>
        <div style={{
          width: 48, height: 2, background: '#D4A574', marginBottom: 40, borderRadius: 1,
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 620 }}>
          <p style={brodstil}>
            Alpkoll samlar skidorterna i Sverige, Norden och Alperna på ett
            ställe, med pist och fallhöjd ur samma källa, liftkortet i kronor och
            restiden från svenska städer.
          </p>
          <p style={brodstil}>
            Sajten är för dig som ska bestämma var vinterns skidvecka blir och
            hellre jämför orterna sida vid sida än letar i flik efter flik.
          </p>
          <p style={brodstil}>
            Hittar du en siffra som inte stämmer, skriv till{' '}
            <a href={`mailto:${KONTAKT}`} style={{
              color: '#D4A574', textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}>{KONTAKT}</a>.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

// Brödtexten stod på 0,46 under en rubrik. Här är texten hela sidan och
// bär innehållet, så den ligger på samma nivå som kortens text.
const brodstil = {
  fontFamily: 'var(--font-body)', fontSize: 'clamp(16px, 1.4vw, 18px)', fontWeight: 300,
  color: 'rgba(255,255,255,0.72)', lineHeight: 1.75,
};
