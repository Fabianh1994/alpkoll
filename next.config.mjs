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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;