import Link from 'next/link'
import { land } from '../../lib/countries'
import { manad } from '../../lib/months'
import { arNordisk } from '../../lib/jamfor'
import { ACCENT, brod, etikett, rubrik } from '../sportlov/Veckan'

// "Var finns snön i påsk?" — samma avsnitt på /pasklov och på varje
// /pasklov/<kommun>, så att de två inte kan säga olika saker.
//
// Granskningen 22 november 2026 fann att en lista med över trettio rader
// inte hjälper någon att välja. Nu visas de sex snösäkraste i Norden och i
// Alperna, och resten ligger i en <details> som finns i första HTML-svaret.

// Alporterna listan tar med: högsta betyget för snösäkerhet. Alla
// publicerade orter har säsong in i april enligt databasen, så säsongen
// skiljer dem inte åt. Snösäkerheten gör det. Grandvalira i Andorra
// faller bort på samma gräns.
const ALP_GRANS = 9

// Hur många rader som syns innan "Visa alla".
const SYNLIGA = 6

/** 1450 -> "1 450", utan att hänga på serverns språkdata. */
const tal = (v) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

const ordning = (a, b) =>
  (b.snow_guarantee_score || 0) - (a.snow_guarantee_score || 0) || (b.altitude_top || 0) - (a.altitude_top || 0)

/**
 * Databasen har stängningsmånaden, inte dagen. Påsklovet vecka 13 slutar
 * 4 april, så en ort som stänger "i april" kan ha stängt innan lovet är
 * slut. Raden säger därför olika saker för april och för maj.
 */
function stanger(m) {
  if (!m) return ''
  if (m === 4) return ' · stänger i april enligt plan'
  return ` · öppet in i ${manad(m)} enligt plan`
}

function Rad({ o }) {
  return (
    <li style={{
      display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
      padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.06)',
      fontFamily: 'var(--font-body)', fontSize: 15,
    }}>
      <span>
        <Link href={`/resort/${o.slug}`} style={{ color: '#f0ece4', textDecoration: 'none' }}>
          {o.name} <span style={{ color: ACCENT }}>›</span>
        </Link>
        <span style={{ color: 'rgba(255,255,255,0.52)', fontSize: 13.5 }}> {land(o.country)}</span>
      </span>
      <span style={{ color: 'rgba(255,255,255,0.62)', fontSize: 14 }}>
        Snösäkerhet {o.snow_guarantee_score}/10
        {Number.isFinite(o.altitude_top) ? ` · toppen ${tal(o.altitude_top)} m` : ''}
        {stanger(o.season_end_month)}
      </span>
    </li>
  )
}

function Ortlista({ orter }) {
  const lista = { listStyle: 'none', margin: 0, padding: 0 }
  const forst = orter.slice(0, SYNLIGA)
  const resten = orter.slice(SYNLIGA)
  return (
    <div style={{ margin: '0 0 30px' }}>
      <ul style={lista}>{forst.map((o) => <Rad key={o.slug} o={o} />)}</ul>
      {resten.length > 0 && (
        <details>
          <summary style={{
            cursor: 'pointer', color: ACCENT, fontFamily: 'var(--font-body)', fontSize: 14,
            padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            Visa {resten.length} till
          </summary>
          <ul style={lista}>{resten.map((o) => <Rad key={o.slug} o={o} />)}</ul>
        </details>
      )}
    </div>
  )
}

export default function Snon({ orter, ar }) {
  // Påsklovet slutar i april, så en ort som stänger i mars kommer inte med.
  const oppna = orter.filter((o) => (o.season_end_month || 0) >= 4)
  const norden = oppna.filter((o) => arNordisk(o) && o.snow_guarantee_score).sort(ordning)
  const alperna = oppna.filter((o) => !arNordisk(o) && o.snow_guarantee_score >= ALP_GRANS).sort(ordning)
  const liten = { ...brod, fontSize: 13.5, color: 'rgba(255,255,255,0.57)' }

  return (
    <section>
      <h2 style={rubrik('clamp(28px, 4.5vw, 40px)')}>Var finns snön i påsk?</h2>
      <p style={{ ...brod, margin: '0 0 14px' }}>
        Påsken {ar} ligger tidigt, och de snösäkraste orterna står överst. Nedfarterna till
        byn smälter först, och på lägre orter kan backen vara hård på morgonen och blöt på
        eftermiddagen.
      </p>
      <p style={{ ...brod, fontSize: 14.5, margin: '0 0 22px' }}>
        Vi vet vilken månad orterna planerar att stänga, inte vilken dag. En ort som stänger i
        april kan stänga strax efter påsk, så kolla ortens sista dag innan du bokar vecka 13.
      </p>

      <h3 style={{ ...etikett, fontSize: 11, margin: '0 0 10px' }}>Sverige, Norge och Finland</h3>
      <Ortlista orter={norden} />

      <h3 style={{ ...etikett, fontSize: 11, margin: '0 0 10px' }}>Alperna: högst snösäkerhet</h3>
      <Ortlista orter={alperna} />

      <p style={{ ...liten, margin: 0 }}>
        Snösäkerheten är Alpkolls betyg från 1 till 10 för hela säsongen, och samma tal står på
        ortsidan. Alporterna i listan har {ALP_GRANS} eller 10. Ett år med lite snö kan nedre
        delen av en ort stänga tidigare än planerat.
      </p>
    </section>
  )
}
