import { ImageResponse } from 'next/og'

// Förhandsbilden när en länk till alpkoll.se delas i en chatt eller i
// sociala medier.
//
// Den låg förut som en färdig PNG i public/, ritad när sajten var engelsk
// och låg på .com: "Compare ski resorts. Plan your trip." och alpkoll.com i
// hörnet. Taggarna runt den var svenska sedan länge, men bilden är det
// mottagaren faktiskt ser — Fabian 2026-09-11, när han skickade länken till
// vänner. "Plan your trip" pekade dessutom på reseplaneraren, som är dold.
//
// Nu ritas bilden ur kod, med sajtens egna typsnitt och färger, så att
// texten inte kan glida isär från sajten igen. Adressen är densamma som
// förut, så sidorna som pekar på /og-image.png behöver inte ändras.
//
// Byggs en gång vid deploy. Chattappar sparar förhandsvisningar länge; en
// länk som redan delats kan visa den gamla bilden ett tag till.

export const dynamic = 'force-static'

const RUBRIK = 'ALPKOLL'
const UNDERRUBRIK = 'Jämför skidorter i Alperna och Norden'
const DOMAN = 'alpkoll.se'

/**
 * Hämtar ett typsnitt från Google Fonts, begränsat till de tecken bilden
 * använder. ImageResponse läser TTF eller OTF, inte woff2 — därför kan
 * next/font inte återanvändas här.
 */
async function typsnitt(familj, text) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${familj}&text=${encodeURIComponent(text)}`)).text()
  const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1]
  if (!url) throw new Error(`Typsnittet ${familj} gick inte att hämta`)
  return (await fetch(url)).arrayBuffer()
}

export async function GET() {
  const [bebas, barlow, barlowHalvfet] = await Promise.all([
    typsnitt('Bebas+Neue', RUBRIK),
    typsnitt('Barlow:wght@500', UNDERRUBRIK),
    typsnitt('Barlow:wght@600', DOMAN),
  ])

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: '#121110' }}>
        {/* Bergssiluetten, samma motiv som den gamla bilden men lägre i kontrast. */}
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: 'absolute', top: 0, left: 0 }}>
          <path d="M0 630 L0 470 L210 190 L520 560 L760 140 L1200 560 L1200 630 Z" fill="#191715" />
          <path d="M0 630 L380 350 L600 540 L910 230 L1200 470 L1200 630 Z" fill="#1f1d19" />
        </svg>

        <div style={{ position: 'absolute', left: 84, top: 168, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 176, lineHeight: 1, letterSpacing: 6, color: '#f0ece4' }}>
            {RUBRIK}
          </div>
          <div style={{ width: 230, height: 6, background: '#D4A574', marginTop: 14, marginBottom: 34 }} />
          <div style={{ fontFamily: 'Barlow', fontWeight: 500, fontSize: 42, color: '#c9c2b6' }}>
            {UNDERRUBRIK}
          </div>
        </div>

        <div style={{ position: 'absolute', left: 84, bottom: 58, fontFamily: 'Barlow', fontWeight: 600, fontSize: 30, letterSpacing: 1, color: '#D4A574' }}>
          {DOMAN}
        </div>

        {/* Logotypen ur public/favicon.svg, utan den rundade bakgrunden. */}
        <svg width="250" height="250" viewBox="0 0 512 512" style={{ position: 'absolute', right: 96, top: 128 }}>
          <path d="M256 72 L430 430 L340 430 L256 200 L172 430 L82 430 Z" fill="#D4A574" />
          <rect x="178" y="300" width="156" height="44" rx="3" fill="#D4A574" />
          <path d="M256 72 L298 165 L214 165 Z" fill="#f0ece4" />
        </svg>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Bebas Neue', data: bebas, weight: 400, style: 'normal' },
        { name: 'Barlow', data: barlow, weight: 500, style: 'normal' },
        { name: 'Barlow', data: barlowHalvfet, weight: 600, style: 'normal' },
      ],
    },
  )
}
