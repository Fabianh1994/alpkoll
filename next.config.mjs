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