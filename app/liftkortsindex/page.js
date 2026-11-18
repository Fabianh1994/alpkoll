import Link from 'next/link'
import SiteHeader from '../SiteHeader'
import SiteFooter from '../SiteFooter'
import { getResorts } from '../../lib/resorts'
import { SITE_URL } from '../../lib/lang'
import { land } from '../../lib/countries'
import { arNordisk } from '../../lib/jamfor'
import { pris, kronorTal } from '../../lib/pris'
import { hamtaKurser, skrivDatum } from '../../lib/valuta'
import { DEFINITION, VERIFIERADE, harPris } from '../../lib/liftkortspriser'

// Liftkortsindex — samma priser som /liftkortspriser, men läst som en
// rapport: vad priserna säger om Sverige mot Alperna, och vad man får för
// pengarna räknat per pistkilometer.
//
// Sidan finns för pressen. En redaktion citerar en mening med ett tal i,
// inte en tabell, så sidan inleds med meningarna. Varje mening räknas
// fram ur samma rader som tabellen — skrivs inget tal för hand, kan inget
// tal bli inaktuellt när en ort byter pris.
//
// Ingen jämförelse mot förra året ännu. Bara tre orter har ett hämtat pris
// för både 25/26 och 26/27 (se migration 022 och 030), och tre orter är
// inget index. Serien börjar med den här säsongen.

export const revalidate = 3600

const SASONG = '2026/2027'
const titel = `Liftkortsindex ${SASONG}: Sverige mot Alperna i kronor | Alpkoll`
const beskrivning =
  'Vad en veckas liftkort kostar i kronor på skidorter i Sverige, Norge, Finland och Alperna, ' +
  'hämtat ur varje orts egen prislista. Och vad man får per kilometer pist.'

export const metadata = {
  title: titel,
  description: beskrivning,
  alternates: { canonical: `${SITE_URL}/liftkortsindex` },
  openGraph: {
    title: titel, description: beskrivning, url: `${SITE_URL}/liftkortsindex`,
    siteName: 'Alpkoll', type: 'article', locale: 'sv_SE', images: ['/og-image.png'],
  },
  twitter: { card: 'summary_large_image', title: titel, description: beskrivning, images: ['/og-image.png'] },
}

const ACCENT = '#D4A574'
const kort = { background: '#1c1a17', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }
const etikett = {
  fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500,
  color: 'rgba(255,255,255,0.52)', letterSpacing: '0.12em', textTransform: 'uppercase',
}
const brod = {
  fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.75,
  color: 'rgba(255,255,255,0.62)', maxWidth: 680,
}
const rubrik = (storlek) => ({
  fontFamily: 'var(--font-heading)', fontSize: storlek, fontWeight: 400,
  letterSpacing: '0.03em', margin: '0 0 18px', color: '#f0ece4',
})

const HART = String.fromCharCode(0xa0)
const kr = (n) => `${String(Math.round(n / 50) * 50).replace(/\B(?=(\d{3})+(?!\d))/g, HART)}${HART}kr`
const krExakt = (n) => `${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, HART)}${HART}kr`

function median(tal) {
  if (!tal.length) return null
  const s = [...tal].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

export default async function Liftkortsindex() {
  const [orter, kurser] = await Promise.all([getResorts(), hamtaKurser()])

  // Samma urval som /liftkortspriser: bara priser vi kan stå för.
  const rader = orter
    .filter(harPris)
    .map((ort) => {
      const valuta = ort.lift_pass_currency || 'EUR'
      const tal = kronorTal(ort.lift_pass_week_eur, valuta, kurser)
      const km = Number(ort.total_pistes_km)
      return {
        ort,
        sasong: VERIFIERADE[ort.slug].sasong,
        visat: pris(ort.lift_pass_week_eur, valuta, kurser),
        tal,
        km: Number.isFinite(km) && km > 0 ? km : null,
        perKm: Number.isFinite(km) && km > 0 ? tal / km : null,
        nordisk: arNordisk(ort),
      }
    })
    .filter((r) => r.visat && Number.isFinite(r.tal))
    .sort((a, b) => a.tal - b.tal)

  const alper = rader.filter((r) => !r.nordisk)
  const sverige = rader.filter((r) => r.ort.country === 'Sweden')
  const norge = rader.filter((r) => r.ort.country === 'Norway')
  const alpMedian = median(alper.map((r) => r.tal))
  const billigastAlp = alper[0]

  const are = rader.find((r) => r.ort.slug === 'are')
  const salen = rader.find((r) => r.ort.slug === 'salen')
  // Alporten vars pris ligger närmast Åres — den jämförelse en svensk
  // faktiskt gör, och den som säger mest om vad pengarna ger.
  const areTvilling = are && alper.length
    ? [...alper].sort((a, b) => Math.abs(a.tal - are.tal) - Math.abs(b.tal - are.tal))[0]
    : null
  // Nordiska orter som kostar mer än den billigaste alporten.
  const dyrareAnAlp = billigastAlp ? rader.filter((r) => r.nordisk && r.tal > billigastAlp.tal) : []

  const perKm = rader.filter((r) => r.perKm).sort((a, b) => a.perKm - b.perKm)
  const procent = (del, hel) => Math.round((1 - del / hel) * 100)

  const fynd = [
    salen && alpMedian && {
      rubrik: `Sälen är ${procent(salen.tal, alpMedian)} procent billigare än en vanlig alport`,
      text: `En veckas liftkort i Sälen kostar ${salen.visat.kr}. Medianen för de ${alper.length} alporterna är ${kr(alpMedian)}.`,
    },
    // Bara när priserna ligger inom fem procent — annars är "lika mycket" fel.
    are && areTvilling && areTvilling.km && are.km && Math.abs(areTvilling.tal - are.tal) / are.tal <= 0.05 && {
      rubrik: `Åre kostar lika mycket som ${areTvilling.ort.name}`,
      text: `Sex dagar i Åre kostar ${are.visat.kr}, i ${areTvilling.ort.name} ${areTvilling.visat.kr}. ` +
        `För pengarna får du ${are.km} kilometer pist i Åre och ${areTvilling.km} i ${areTvilling.ort.name}.`,
    },
    dyrareAnAlp.length > 0 && billigastAlp && {
      rubrik: `${dyrareAnAlp.length === 1 ? 'En nordisk ort kostar' : `${dyrareAnAlp.length} nordiska orter kostar`} mer än den billigaste alporten`,
      text: `${dyrareAnAlp.map((r) => r.ort.name).join(', ').replace(/, ([^,]*)$/, ' och $1')} ` +
        `tar mer för en vecka än ${billigastAlp.ort.name} (${billigastAlp.visat.kr}).`,
    },
    norge.length > 0 && sverige.length > 0 && (() => {
      const no = median(norge.map((r) => r.tal))
      const se = median(sverige.map((r) => r.tal))
      return {
        rubrik: no > se ? 'Liftkortet är dyrare i Norge än i Sverige' : 'Liftkortet är billigare i Norge än i Sverige',
        text: `Medianen för en vecka är ${kr(no)} i Norge och ${kr(se)} i Sverige.`,
      }
    })(),
    perKm.length > 2 && {
      rubrik: `Mest pist för pengarna: ${perKm[0].ort.name}`,
      text: `Räknat per kilometer pist kostar en vecka i ${perKm[0].ort.name} ${krExakt(perKm[0].perKm)}. ` +
        `Dyrast per kilometer är ${perKm.at(-1).ort.name} med ${krExakt(perKm.at(-1).perKm)}.`,
    },
  ].filter(Boolean)

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>
      <SiteHeader />

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '108px clamp(20px, 5vw, 32px) 100px' }}>
        <p style={{ ...etikett, color: ACCENT, marginBottom: 14 }}>Säsongen {SASONG}</p>
        <h1 style={{ ...rubrik('clamp(34px, 5.5vw, 54px)'), lineHeight: 1.04, marginBottom: 20 }}>
          Liftkortsindex: Sverige mot Alperna
        </h1>

        <p style={{ ...brod, margin: '0 0 14px' }}>
          Vad en veckas liftkort kostar i kronor på {rader.length} skidorter i Sverige, Norge,
          Finland och Alperna. Varje pris är hämtat ur ortens egen prislista och avser samma sak:
          vuxen, sex dagar i följd, huvudsäsong.
        </p>
        <p style={{ ...brod, fontSize: 14, margin: '0 0 34px', color: 'rgba(255,255,255,0.55)' }}>
          Omräknat mot ECB:s kurs den {skrivDatum(kurser.datum)}. Fritt att citera med länk till
          alpkoll.se/liftkortsindex.
        </p>

        <section style={{ marginBottom: 44 }}>
          <h2 style={{ ...etikett, margin: '0 0 14px' }}>Vad priserna säger</h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {fynd.map((f) => (
              <div key={f.rubrik} style={{ ...kort, padding: 'clamp(18px, 4vw, 24px)' }}>
                <h3 style={{ ...rubrik(22), margin: '0 0 8px' }}>{f.rubrik}</h3>
                <p style={{ ...brod, fontSize: 15, margin: 0 }}>{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={rubrik('clamp(26px, 4vw, 34px)')}>Pris per kilometer pist</h2>
          <p style={{ ...brod, fontSize: 15, margin: '0 0 18px' }}>
            Veckopriset delat med pistens längd. Ett billigt kort på en liten ort kan ge mindre för
            pengarna än ett dyrt kort på ett stort område.
          </p>
          <div style={{ ...kort, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 0 }}>
              <thead>
                <tr>
                  {['', 'Skidort', 'Sex dagar', 'Per km'].map((h, i) => (
                    <th key={i} style={{
                      ...etikett, textAlign: i >= 2 ? 'right' : 'left', padding: '14px 8px',
                      borderBottom: '1px solid rgba(255,255,255,0.07)', whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {perKm.map((r, i) => (
                  <tr key={r.ort.slug} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.47)', padding: '12px 6px 12px 14px', textAlign: 'right', width: 30 }}>{i + 1}</td>
                    <td style={{ padding: '12px' }}>
                      <Link href={`/resort/${r.ort.slug}`} style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, fontWeight: 500, color: '#f0ece4', textDecoration: 'none' }}>{r.ort.name}</Link>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'rgba(255,255,255,0.54)', marginTop: 3 }}>
                        {land(r.ort.country)} · {r.km} km pist{r.sasong !== '26/27' && ` · pris ${r.sasong}`}
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#f0ece4', padding: '12px', textAlign: 'right', whiteSpace: 'nowrap' }}>{r.visat.kr}</td>
                    <td style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: ACCENT, padding: '12px 14px 12px 12px', textAlign: 'right', whiteSpace: 'nowrap' }}>{krExakt(r.perKm)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p style={{ ...brod, fontSize: 14, margin: '0 0 44px' }}>
          Alla priser med ortens egen valuta och noteringar per ort står på{' '}
          <Link href="/liftkortspriser" style={{ color: ACCENT }}>liftkortspriser</Link>, tillsammans
          med de orter som saknar pris och varför.
        </p>

        <section style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)' }}>
          <h2 style={{ ...rubrik(22), marginBottom: 12 }}>Så är indexet gjort</h2>
          <p style={{ ...brod, fontSize: 14, margin: '0 0 10px' }}>{DEFINITION}</p>
          <p style={{ ...brod, fontSize: 14, margin: '0 0 10px' }}>
            Pistlängden kommer från skiresort.com för alla orter och avser hela det sammankopplade
            området. Där orten säljer flera kort har vi valt det som gäller just det området, inte ett
            större regionkort. Kronbeloppen är avrundade till närmaste femtio; per kilometer visas
            utan avrundning.
          </p>
          <p style={{ ...brod, fontSize: 14, margin: 0 }}>
            Medianen används i stället för medelvärdet, så att en enda mycket dyr ort inte drar upp
            hela gruppen. Orter märkta med förra säsongens pris har inte publicerat årets.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
