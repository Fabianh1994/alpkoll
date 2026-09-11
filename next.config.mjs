/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── alpkoll.com → alpkoll.se ───────────────────────────────────
  // Sajten körs tills vidare enbart på svenska. All .com-trafik
  // flyttas permanent (308) till .se med sökvägen intakt, så att
  // eventuell länkkraft samlas på en domän istället för att splittras.
  //
  // Ta bort hela redirects()-blocket för att öppna .com igen.
  async redirects() {
    const toSwedish = (host) => ({
      source: '/:path*',
      has: [{ type: 'host', value: host }],
      destination: 'https://alpkoll.se/:path*',
      permanent: true,
    })

    return [toSwedish('alpkoll.com'), toSwedish('www.alpkoll.com')]
  },

  images: {
    // Hur länge en optimerad bild sparas: 31 dagar. Adresserna i
    // resort_images ändras aldrig — en ny bild får en ny rad — men Next
    // sparar som standard i fyra timmar, och Wikimedia skickar ingen längre
    // livslängd. Varje Commons-bild räknades alltså om var fjärde timme.
    // Uppmätt på alpkoll.se 2026-09-11: 0,35–1,3 s per bild vid omräkning,
    // 0,2–0,5 s när den redan fanns.
    minimumCacheTTL: 2678400,

    // Standardlistan utan 2048 och 3840. Hjältebilden och förstoringen
    // begärdes i 3840 px på en retinalaptop, 200–900 kB per bild, fast
    // källorna är högst 1920 (Commons) respektive 2560 px (Unsplash) breda.
    // Färre bredder ger också färre varianter att räkna om och cacha.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560],

    // Bara källor vi får använda. Myrkdalens bild hotlänkas fortfarande
    // från skiresort.info och står medvetet INTE här: att optimera den
    // skulle innebära att Alpkoll serverar en kopia från sin egen domän,
    // vilket är sämre än att bara länka. Se lib/images.js. Bilderna i
    // resort_images (migration 025) kommer alla från de två första nedan.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        // Egen Supabase-lagring, bland annat startsidans hjältebild.
        protocol: 'https',
        hostname: 'odlzoewjwyipiopttucv.supabase.co',
      },
    ],
  },
};

export default nextConfig;