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
    // Bara källor vi får använda. Fyra ortbilder hotlänkas i dag från
    // andra företags servrar — igluski.com, snowfinders.co.uk,
    // skiresort.info och en squarespace-sajt. De står medvetet INTE här:
    // att optimera dem skulle innebära att Alpkoll serverar kopior från
    // sin egen domän, vilket är sämre än att bara länka. De renderas som
    // vanliga img-taggar tills bilderna byts ut. Se lib/images.js.
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