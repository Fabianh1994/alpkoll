// Underhållsläget: med UNDERHALL = true svarar varje adress på sajten med
// samma stängd-sida i stället för innehållet.
//
// Svaret är 503 med Retry-After, inte 200. 503 säger till Google att
// stängningen är tillfällig, så att sidorna inte ersätts av underhållstexten
// i sökresultaten. Håller stängningen i sig i veckor börjar Google ändå
// släppa sidor ur indexet, och de får arbetas tillbaka efteråt.
//
// Sidan visar ingen annons, ingen partner och ingen avsändare — bara att
// sajten är stängd och vart man kan skriva. hello@alpkoll.com tar emot via
// ImprovMX; adresser på alpkoll.se studsar, den domänen har inga MX-poster.
//
// Typsnitten är sajtens egna, latin-delen av Bebas Neue och Barlow ur
// next/font, kopierade till public/underhall/ så att sidan inte hämtar
// något från Google. Hjältebilden är startsidans och går genom Nexts
// bildoptimering — originalet är 3 MB.
//
// Sätt till false och deploya för att öppna sajten igen. Inget annat
// behöver ändras.
import { NextResponse } from 'next/server'

const UNDERHALL = true

const MEJL = 'hello@alpkoll.com'

const HJALTE = encodeURIComponent(
  'https://odlzoewjwyipiopttucv.supabase.co/storage/v1/object/public/images/valerii-ladomyriak-A9Ci7flea_U-unsplash.jpg'
)
const bild = (w) => `/_next/image?url=${HJALTE}&w=${w}&q=70`

const SIDA = `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#121110">
<title>Alpkoll — vi kommer tillbaka</title>
<link rel="preload" href="/underhall/bebas-neue-400.woff2" as="font" type="font/woff2" crossorigin>
<style>
  @font-face { font-family: "Bebas Neue"; font-weight: 400; font-display: swap; src: url(/underhall/bebas-neue-400.woff2) format("woff2"); }
  @font-face { font-family: "Barlow"; font-weight: 300; font-display: swap; src: url(/underhall/barlow-300.woff2) format("woff2"); }
  @font-face { font-family: "Barlow"; font-weight: 400; font-display: swap; src: url(/underhall/barlow-400.woff2) format("woff2"); }
  @font-face { font-family: "Barlow"; font-weight: 600; font-display: swap; src: url(/underhall/barlow-600.woff2) format("woff2"); }

  :root { --grund: #121110; --text: #f0ece4; --guld: #D4A574; }
  * { box-sizing: border-box; }
  html, body { margin: 0; min-height: 100%; background: var(--grund); color: var(--text); }
  body { font-family: "Barlow", "Segoe UI", system-ui, sans-serif; -webkit-font-smoothing: antialiased; }

  .scen { position: relative; min-height: 100vh; min-height: 100svh; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }
  .scen > picture img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 30%; transform: scale(1.04); }
  .ton { position: absolute; inset: 0; background:
      linear-gradient(180deg, rgba(18,17,16,0.35) 0%, rgba(18,17,16,0.45) 35%, rgba(18,17,16,0.92) 100%),
      linear-gradient(90deg, rgba(18,17,16,0.6) 0%, transparent 65%); }
  .korn { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.05; pointer-events: none; }

  header, main, footer { position: relative; padding-inline: clamp(24px, 5vw, 72px); }
  header { padding-top: 28px; }
  .logga { font-family: "Bebas Neue", Impact, sans-serif; font-size: 26px; letter-spacing: 0.08em; }

  main { max-width: 820px; padding-bottom: clamp(48px, 9vh, 110px); }
  .etikett { font-size: 12px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: var(--guld); margin: 0 0 22px; }
  h1 { font-family: "Bebas Neue", Impact, sans-serif; font-weight: 400; font-size: clamp(64px, 11vw, 132px); line-height: 0.92; letter-spacing: 0.015em; margin: 0 0 28px; }
  h1 span { color: var(--guld); }
  .ingress { font-size: clamp(16px, 1.6vw, 19px); font-weight: 300; line-height: 1.65; color: rgba(240,236,228,0.84); max-width: 34em; text-shadow: 0 1px 12px rgba(18,17,16,0.6); margin: 0 0 40px; }

  .kontakt { display: inline-flex; flex-direction: column; gap: 10px; padding: 22px 26px; border: 1px solid rgba(212,165,116,0.32); border-radius: 6px; background: rgba(18,17,16,0.55); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); max-width: 100%; }
  .kontakt p { margin: 0; font-size: 13px; font-weight: 400; color: rgba(240,236,228,0.6); }
  .kontakt a { font-size: clamp(17px, 2vw, 20px); font-weight: 600; color: var(--text); text-decoration: none; letter-spacing: 0.01em; overflow-wrap: anywhere; }
  .kontakt a span { color: var(--guld); transition: transform 0.25s; display: inline-block; margin-left: 6px; }
  .kontakt a:hover span, .kontakt a:focus-visible span { transform: translateX(4px); }
  .kontakt a:focus-visible { outline: 2px solid var(--guld); outline-offset: 4px; border-radius: 2px; }

  footer { padding-bottom: 24px; font-size: 12px; color: rgba(240,236,228,0.4); letter-spacing: 0.04em; }

  @media (prefers-reduced-motion: no-preference) {
    .in { animation: in 0.9s cubic-bezier(0.16,1,0.3,1) both; }
    .in.d1 { animation-delay: 0.1s; } .in.d2 { animation-delay: 0.25s; } .in.d3 { animation-delay: 0.4s; } .in.d4 { animation-delay: 0.55s; }
    @keyframes in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
  }
</style>
</head>
<body>
<div class="scen">
  <picture>
    <source media="(max-width: 700px)" srcset="${bild(828)}">
    <source media="(max-width: 1300px)" srcset="${bild(1200)}">
    <img src="${bild(1920)}" alt="" fetchpriority="high">
  </picture>
  <div class="ton"></div>
  <svg class="korn" aria-hidden="true"><filter id="k"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#k)"/></svg>

  <header><div class="logga">ALPKOLL</div></header>

  <main>
    <p class="etikett in d1">Tillfälligt stängt</p>
    <h1 class="in d2">Vi kommer<br><span>tillbaka</span></h1>
    <p class="ingress in d3">Alpkoll är stängd en tid medan vi bygger om. När sajten öppnar igen är den bättre än den var, med jämförelserna av skidorter i Norden och Alperna kvar.</p>
    <div class="kontakt in d4">
      <p>Vill du höra av dig under tiden?</p>
      <a href="mailto:${MEJL}">${MEJL}<span aria-hidden="true">→</span></a>
    </div>
  </main>

  <footer>© 2026 Alpkoll</footer>
</div>
</body>
</html>`

export function proxy() {
  if (!UNDERHALL) return NextResponse.next()

  return new NextResponse(SIDA, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // Ett dygn. Google läser det som när det är värt att fråga igen.
      'Retry-After': '86400',
      'Cache-Control': 'no-store',
    },
  })
}

// Allt utom Nexts egna filer, bildoptimeringen och sidans typsnitt.
export const config = {
  matcher: ['/((?!_next/static|_next/image|underhall/).*)'],
}
