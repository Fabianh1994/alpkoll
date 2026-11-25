import { FLYGPLATSER } from '../../lib/resa/flygplatser'
import { TRANSFER, TRANSFER_MATT, SISTA_BITEN } from '../../lib/resa/transfer'
import { flygHint } from '../../lib/resa/flyghint'
import { langd, heltal } from '../../lib/resa/resvag'

// De tre flygplatserna med kortast väg till orten, för den som inte
// skrivit sin adress än. Transfertiden är uppmätt en gång för alla orter
// med samma metod (lib/resa/transfer.js); flygen och priset hämtas från
// Aviasales och uppdateras av sig själva.

const HUB = { ARN: 'Arlanda', GOT: 'Landvetter', CPH: 'Kastrup' }

const lista = (namn) => namn.length <= 1 ? namn.join('') : `${namn.slice(0, -1).join(', ')} och ${namn[namn.length - 1]}`

export default async function TreFlygplatser({ slug, ortnamn }) {
  if (!TRANSFER[slug]?.length) return null
  const hamtade = await Promise.all(TRANSFER[slug].map(async (rad) => ({ rad, h: await flygHint(rad[0]) })))
  // Med flygdata först de med direktflyg, sedan med byte, sist utan flyg;
  // inom varje grupp den kortaste bilvägen, som i TRANSFER.
  const vikt = ({ h }) => (!h ? 0 : h.direkt.length ? 0 : h.medByte ? 1 : 2)
  const sorterade = [...hamtade].sort((a, b) => vikt(a) - vikt(b))
  const rader = sorterade.map((x) => x.rad)
  const hint = sorterade.map((x) => x.h)
  const harFlygdata = hint.some(Boolean)

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '14px 16px', marginBottom: 16 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.52)', marginBottom: 10 }}>
        {rader.length === 1 ? 'Flygplatsen' : `De ${rader.length === 2 ? 'två' : 'tre'} närmaste flygplatserna`}
      </div>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12 }}>
        {rader.map(([kod, km, min], i) => {
          const h = hint[i]
          let flyg = null
          if (h?.direkt?.length) flyg = `Direktflyg från ${lista(h.direkt.map((k) => HUB[k]))}, från ${heltal(h.pris)} kr enkel väg`
          else if (h?.medByte) flyg = `Med byte från Sverige, från ${heltal(h.pris)} kr enkel väg`
          else if (h) flyg = 'Inga flyg från Arlanda, Landvetter eller Kastrup hittades'
          return (
            <li key={kod} style={{ display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr)', columnGap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 20, letterSpacing: '0.05em', color: '#D4A574' }}>{kod}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: '#f0ece4' }}>
                  {FLYGPLATSER[kod].namn}
                  <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.55)' }}> · {langd(min)} med bil till {ortnamn}, {heltal(km)} km</span>
                </div>
                {flyg && <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{flyg}</div>}
              </div>
            </li>
          )
        })}
      </ol>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6, margin: '12px 0 0' }}>
        {SISTA_BITEN[slug] && `${SISTA_BITEN[slug]} `}
        Bilvägen från flygplatsen är uppmätt med OpenStreetMap {TRANSFER_MATT}, utan köer och vinterväglag.
        {harFlygdata && ' Priset är det lägsta Aviasales sett för en kommande enkelresa och ändras hela tiden.'}
        {' '}<a href="#resan-hit" style={{ color: '#D4A574', textDecoration: 'none' }}>Hela resan från din adress ›</a>
      </p>
    </div>
  )
}
