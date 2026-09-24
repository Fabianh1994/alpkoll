// Underhållsläget: med UNDERHALL = true svarar varje adress på sajten med
// samma korta sida i stället för innehållet.
//
// Svaret är 503 med Retry-After, inte 200. 503 säger till Google att
// stängningen är tillfällig, så att sidorna inte ersätts av underhållstexten
// i sökresultaten. Håller stängningen i sig i veckor börjar Google ändå
// släppa sidor ur indexet, och de får arbetas tillbaka efteråt.
//
// Sidan nämner varken avsändare, partner eller kontaktuppgifter. Den visar
// ingen annons och ingen länk, och säger bara att sajten är stängd.
//
// Sätt till false och deploya för att öppna sajten igen. Inget annat
// behöver ändras.
import { NextResponse } from 'next/server'

const UNDERHALL = true

const SIDA = `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Alpkoll — tillfälligt stängd</title>
<style>
  html, body { height: 100%; margin: 0; }
  body {
    background: #121110; color: #f0ece4;
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    display: flex; align-items: center; justify-content: center;
    padding: 0 24px;
  }
  main { max-width: 440px; }
  p.namn { font-size: 13px; font-weight: 600; letter-spacing: 0.2em; color: #D4A574; margin: 0 0 18px; }
  h1 { font-size: 30px; font-weight: 500; line-height: 1.2; margin: 0 0 12px; }
  p { font-size: 16px; line-height: 1.6; color: rgba(240,236,228,0.62); margin: 0; }
</style>
</head>
<body>
<main>
  <p class="namn">ALPKOLL</p>
  <h1>Sajten är tillfälligt stängd</h1>
  <p>Den öppnar igen senare.</p>
</main>
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

// Allt utom Next:s egna filer, som ingen sida längre hämtar.
export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
