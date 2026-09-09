import Link from 'next/link'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'

// Sajtens 404 för alla adresser utom ortsidorna, som har en egen i
// app/resort/[slug]/not-found.js.
//
// Utan den här filen svarar Next med sin inbyggda sida: "404: This page
// could not be found", på engelska, utan meny och utan sidfot. Den som
// följt en gammal länk hamnade alltså på en återvändsgränd som inte såg
// ut att tillhöra sajten och inte hade någon väg vidare.
//
// robots får noindex men follow: sidan ska inte indexeras, men länkarna
// härifrån är den enda vägen tillbaka för en genomsökare som följt en
// trasig länk.
export const metadata = {
  title: 'Sidan finns inte — Alpkoll',
  robots: { index: false, follow: true },
}

const ACCENT = '#D4A574'

// Dit man rimligen ville. Reseplaneraren står medvetet inte här: den är
// avstängd i lib/features.js och ska inte länkas medan den är det.
const VAGAR = [
  { href: '/#resorts', rubrik: 'Alla skidorter', text: 'Trettio orter i Alperna och Norden.' },
  { href: '/jamfor', rubrik: 'Jämför två orter', text: 'Ställ dem mot varandra på samma siffror.' },
  { href: '/liftkortspriser', rubrik: 'Liftkortspriser', text: 'Vad sex skiddagar kostar, ort för ort.' },
  { href: '/sportlov', rubrik: 'Sportlov', text: 'Vecka 7 till 10, och vad som gäller då.' },
  { href: '/nattaget-till-alperna', rubrik: 'Nattåget', text: 'Tider, orter och vad som gäller ombord.' },
]

export default function NotFound() {
  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>
      <SiteHeader />

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '128px clamp(20px, 5vw, 32px) 100px' }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, color: ACCENT,
          letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 18px',
        }}>404</p>

        <h1 style={{
          fontFamily: 'var(--font-heading)', fontSize: 'clamp(34px, 6vw, 56px)', fontWeight: 400,
          lineHeight: 1.05, letterSpacing: '0.02em', margin: '0 0 18px',
        }}>Den här sidan finns inte.</h1>

        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.75,
          color: 'rgba(255,255,255,0.62)', maxWidth: 560, margin: '0 0 40px',
        }}>
          Adressen leder ingenstans. Antingen har den ändrats, eller så blev det fel
          någonstans på vägen hit. Här är sidorna som finns.
        </p>

        <div style={{ display: 'grid', gap: 10 }}>
          {VAGAR.map((v) => (
            <Link key={v.href} href={v.href} style={{
              background: '#1c1a17', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10, padding: '18px 20px', textDecoration: 'none', display: 'block',
            }}>
              <div style={{
                fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 400,
                color: '#f0ece4', letterSpacing: '0.02em', marginBottom: 4,
              }}>{v.rubrik}</div>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.45)',
              }}>{v.text}</div>
            </Link>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
