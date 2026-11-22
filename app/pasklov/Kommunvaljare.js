'use client'

// Väljaren överst på /pasklov. Granskningen 22 november 2026: på mobilen
// fick en förälder i Uppsala scrolla förbi trettio rader för att hitta sin
// kommun. Ett val tar besökaren direkt till /pasklov/<kommun>.
//
// Listan nedanför står kvar som vanliga länkar, så att sökmotorer och den
// som inte använder väljaren når samma sidor.

import { useRouter } from 'next/navigation'

export default function Kommunvaljare({ kommuner }) {
  const router = useRouter()
  return (
    <label style={{ display: 'block', margin: '0 0 28px' }}>
      <span style={{
        display: 'block', fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500,
        color: 'rgba(255,255,255,0.52)', letterSpacing: '0.12em', textTransform: 'uppercase',
        marginBottom: 8,
      }}>
        Välj din kommun
      </span>
      <select
        defaultValue=""
        onChange={(e) => {
          const slug = e.target.value
          // Tillbaka till platshållaren, så att samma kommun går att välja igen
          // efter bakåtknappen.
          e.target.value = ''
          if (slug) router.push(`/pasklov/${slug}`)
        }}
        style={{
          width: '100%', maxWidth: 420, padding: '13px 14px', borderRadius: 10,
          background: '#1c1a17', color: '#f0ece4', border: '1px solid rgba(212,165,116,0.42)',
          fontFamily: 'var(--font-body)', fontSize: 16,
        }}
      >
        <option value="" disabled>Kommun</option>
        {kommuner.map((k) => <option key={k.slug} value={k.slug}>{k.kommun}</option>)}
      </select>
    </label>
  )
}
