'use client'

import { Analytics } from '@vercel/analytics/next'

// Vercel Analytics utan läsarens adress: reseplaneraren lägger adressen
// (fran, stuga) i länken så att den går att dela, men den ska inte följa
// med till statistiken. Integritetspolicyn lovar att adressen inte sparas.
const PRIVATA = ['fran', 'stuga']

export default function Analys() {
  return (
    <Analytics
      beforeSend={(h) => {
        try {
          const u = new URL(h.url)
          PRIVATA.forEach((k) => u.searchParams.delete(k))
          return { ...h, url: u.toString() }
        } catch {
          return h
        }
      }}
    />
  )
}
