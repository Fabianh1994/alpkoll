import Link from 'next/link'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import { getResorts } from '../lib/resorts'
import { pris } from '../lib/pris'
import { hamtaKurser } from '../lib/valuta'
import { parFor, motparten } from '../lib/jamfor'
import { alpjamforelse, arAlport, NATTAG_SASONG } from '../lib/ellerAlperna'

const ACCENT = '#D4A574'
const kort = { background: '#1c1a17', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }
const etikett = {
  fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500,
  color: 'rgba(255,255,255,0.28)', letterSpacing: '0.12em', textTransform: 'uppercase',
}
const brod = {
  fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.8,
  color: 'rgba(255,255,255,0.62)', maxWidth: 680,
}
const rubrik = (storlek) => ({
  fontFamily: 'var(--font-heading)', fontSize: storlek, fontWeight: 400,
  letterSpacing: '0.04em', margin: '0 0 16px',
})

/**
 * Räkneord i text, siffror i tabeller.
 *
 * "18 av 18" läser som ett fel snarare än som ett svar, och "1 av dem" är
 * inte svenska. Sidans meningar ska gå att läsa högt.
 */
const ORD = ['noll', 'en', 'två', 'tre', 'fyra', 'fem', 'sex', 'sju', 'åtta', 'nio', 'tio', 'elva', 'tolv']
const ord = (n) => (Number.isInteger(n) && n >= 0 && n < ORD.length ? ORD[n] : String(n))
const avAntal = (n, total) => (n === total ? `alla ${total}` : `${ord(n)} av ${total}`)
const storVersal = (t) => t.charAt(0).toUpperCase() + t.slice(1)

/** "1 200 kr" utan "ca" — spann behöver inte hedga två gånger. */
const rundat = (tal) =>
  tal === null || tal === undefined
    ? null
    : `${String(Math.round(tal / 50) * 50).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} kr`

function Tal({ etikett: e, ort, alper, enhet = '' }) {
  return (
    <div style={{ ...kort, padding: '18px 20px' }}>
      <div style={{ ...etikett, marginBottom: 12 }}>{e}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 30, color: ACCENT, letterSpacing: '0.02em' }}>
          {ort}{enhet && <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}> {enhet}</span>}
        </span>
      </div>
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.42)',
        marginTop: 8, lineHeight: 1.6,
      }}>{alper}</div>
    </div>
  )
}

/**
 * "Åre eller Alperna?" — ortens tal mot alporternas som grupp.
 *
 * Delad mellan /are-eller-alperna och /salen-eller-alperna. Adresserna är
 * egna sidor och inte en dynamisk rutt, eftersom sökordet ligger i själva
 * sökvägen och bara två orter någonsin ska ha en sådan sida: de två
 * svenskarna faktiskt väljer mellan Alperna och hemma.
 */
export default async function OrtEllerAlperna({ slug }) {
  const [orter, kurser] = await Promise.all([getResorts(), hamtaKurser()])
  const ort = orter.find((r) => r.slug === slug)
  if (!ort) return null

  const j = alpjamforelse(ort, orter, kurser)
  const publicerade = orter.map((r) => r.slug)

  // Paren mot alporter finns redan och rankar. Sidan ska mata dem, inte
  // konkurrera med dem — därför ligger de som fortsättning längst ned.
  const alppar = parFor(ort.slug, publicerade)
    .map((par) => ({ par, annan: orter.find((r) => r.slug === motparten(par, ort.slug)) }))
    .filter((x) => x.annan && arAlport(x.annan))
    .sort((a, b) => a.annan.name.localeCompare(b.annan.name, 'sv'))

  const ortKort = pris(ort.lift_pass_week_eur, ort.lift_pass_currency || 'EUR', kurser)

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>
      <SiteHeader />

      <main style={{ padding: '120px clamp(20px, 4vw, 64px) 100px', maxWidth: 1000, margin: '0 auto' }}>

        <p style={{ ...etikett, color: ACCENT, marginBottom: 14 }}>Beslutet före bokningen</p>
        <h1 style={{
          fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px, 7vw, 62px)', fontWeight: 400,
          letterSpacing: '0.03em', lineHeight: 1.03, margin: '0 0 26px',
        }}>
          {ort.name} eller Alperna?
        </h1>

        {/* ── Svaret först ──
            Sidan öppnar med slutsatsen, inte med metoden. Den som söker på
            frågan vill ha ett svar, inte en tabell att tolka själv. */}
        <p style={{ ...brod, margin: '0 0 18px' }}>
          {j.storre === j.antal
            ? `Alla ${j.antal} alporter på Alpkoll är större än ${ort.name}`
            : `${j.storre} av ${j.antal} alporter är större än ${ort.name}`}
          {j.hogre === j.antal ? ', och alla har mer fallhöjd. ' : `, och ${j.hogre} har mer fallhöjd. `}
          {j.billigare === 0
            ? `Ingen av dem har ett billigare liftkort för sex dagar`
            : `Men ${ord(j.billigare)} av dem har ett billigare liftkort för sex dagar`}
          {j.nattag.length > 0
            ? `, och ${ord(j.nattag.length)} når du med nattåg från Sverige utan att flyga.`
            : ', och resan dit kräver flyg.'}
        </p>
        <p style={{ ...brod, margin: '0 0 46px' }}>
          Det gör valet till något annat än en storleksfråga. Nedan står talen,
          och sedan det som sällan står någon annanstans: vad resan faktiskt
          innebär från Sverige.
        </p>

        {/* ── Talen ── */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={rubrik(28)}>Talen</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
            <Tal
              etikett="Pist"
              ort={ort.total_pistes_km} enhet="km"
              alper={`Alperna: ${j.pist.alper.lag}–${j.pist.alper.hog} km, median ${j.pist.alper.median}. ${storVersal(avAntal(j.storre, j.antal))} är större.`}
            />
            <Tal
              etikett="Fallhöjd"
              ort={ort.vertical_drop_m} enhet="m"
              alper={`Alperna: ${j.fallhojd.alper.lag}–${j.fallhojd.alper.hog} m, median ${j.fallhojd.alper.median}. Det är den tydligaste skillnaden.`}
            />
            <Tal
              etikett="Snösäkerhet"
              ort={`${j.sno.ort}/10`}
              alper={`Alperna: ${j.sno.alper.lag}–${j.sno.alper.hog}, median ${j.sno.alper.median}. Höjden gör skillnaden, latituden tar igen en del.`}
            />
            <Tal
              etikett="Liftkort, sex dagar"
              ort={ortKort ? ortKort.kr : '—'}
              alper={`Alperna: ${rundat(j.liftkort.alper.lag)}–${rundat(j.liftkort.alper.hog)}, median ${rundat(j.liftkort.alper.median)}. ${j.billigare === 0 ? 'Ingen är billigare än' : `${storVersal(avAntal(j.billigare, j.antal))} är billigare än`} ${ort.name}.`}
            />
            <Tal
              etikett="Veckan totalt"
              ort={rundat(j.vecka.ort)}
              alper={`Alperna: ${rundat(j.vecka.alper.lag)}–${rundat(j.vecka.alper.hog)}, median ${rundat(j.vecka.alper.median)}. Resa, boende och liftkort per person.`}
            />
            <Tal
              etikett="Säsongens längd"
              ort={j.sasong.ort} enhet="dagar"
              alper={`Alperna: ${j.sasong.alper.lag}–${j.sasong.alper.hog} dagar, median ${j.sasong.alper.median}.`}
            />
          </div>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 12.5, lineHeight: 1.7,
            color: 'rgba(255,255,255,0.33)', margin: '14px 0 0',
          }}>
            Pist, liftar och höjder kommer från skiresort.com för samtliga orter, så
            att talen är jämförbara. Priser är hämtade från varje orts egen prislista
            och räknas om till kronor mot Europeiska centralbankens kurs —{' '}
            <Link href="/liftkortspriser" style={{ color: ACCENT, textDecoration: 'none' }}>
              se hela prislistan
            </Link>.
          </p>
        </section>

        {/* ── Resan ──
            Det här är sidans skäl att finnas. Pistkilometer kan vem som helst
            räkna upp; uppmätt restid från Sverige och nattåget till Österrike
            har ingen internationell skidsajt. */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={rubrik(28)}>Resan, som är det som faktiskt skiljer</h2>

          <div style={{ ...kort, padding: 'clamp(20px, 4vw, 28px)', marginBottom: 10 }}>
            <div style={{ ...etikett, color: ACCENT, marginBottom: 10 }}>Till {ort.name}</div>
            <p style={{ ...brod, fontSize: 15, margin: 0 }}>{ort.transport_info}</p>
          </div>

          {j.nattag.length > 0 && (
            <div style={{ ...kort, padding: 'clamp(20px, 4vw, 28px)', borderColor: 'rgba(212,165,116,0.22)' }}>
              <div style={{ ...etikett, color: ACCENT, marginBottom: 10 }}>
                Till Alperna — utan att flyga
              </div>
              <p style={{ ...brod, fontSize: 15, margin: '0 0 16px' }}>
                Snälltåget kör nattåg Malmö–Österrike {NATTAG_SASONG}. Med det når du{' '}
                {j.nattag.length} av orterna nedan direkt, utan flygplats och utan
                transfer. Det är den jämförelse som sällan görs: {ort.name} med tåg mot
                Alperna med tåg, i stället för mot Alperna med flyg.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                {j.nattag.map((r) => (
                  <Link key={r.slug} href={`/resort/${r.slug}`} style={{
                    background: 'rgba(212,165,116,0.06)', border: '1px solid rgba(212,165,116,0.14)',
                    borderRadius: 8, padding: '12px 14px', textDecoration: 'none', display: 'block',
                  }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: '#f0ece4' }}>
                      {r.name}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
                      {r.total_pistes_km} km pist · {r.vertical_drop_m} m fallhöjd
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── Paren ──
            De här sidorna finns redan och är de enda på sajten Google
            genomsökt i någon omfattning. Sidan matar dem vidare. */}
        {alppar.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <h2 style={rubrik(28)}>{ort.name} mot en alport i taget</h2>
            <p style={{ ...brod, fontSize: 15, margin: '0 0 18px' }}>
              Har du redan en ort i huvudet finns jämförelsen färdig, med samma tal
              ställda mot varandra rad för rad.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
              {alppar.map(({ par, annan }) => (
                <Link key={par} href={`/jamfor/${par}`} style={{ ...kort, padding: '12px 15px', textDecoration: 'none', display: 'block' }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 500, color: '#f0ece4' }}>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>mot</span> {annan.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.32)', marginTop: 5 }}>
                    {annan.total_pistes_km} km pist
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Vem väljer vad ──
            Härlett ur poängen, inte skrivet som tycke. Varje mening går att
            spåra till ett fält. */}
        <section style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)' }}>
          <h2 style={rubrik(22)}>Vem {ort.name} passar</h2>
          <p style={{ ...brod, fontSize: 14.5, margin: '0 0 12px' }}>
            {ort.name} står på {ort.beginner_score}/10 för nybörjare och{' '}
            {ort.family_friendly_score}/10 för barnfamiljer, mot{' '}
            {ort.expert_score}/10 för den avancerade.{' '}
            {ort.beginner_score >= 8 || ort.family_friendly_score >= 8
              ? 'Det är en ort byggd för den som är ny eller åker med barn — och den styrkan påverkas inte av att Alperna är större.'
              : 'Det är en ort som klarar hela sällskapet utan att vara extrem åt något håll.'}
          </p>
          <p style={{ ...brod, fontSize: 14.5, margin: 0 }}>
            {storVersal(avAntal(j.hogre, j.antal))} alporter har mer fallhöjd än {ort.name}s{' '}
            {ort.vertical_drop_m} meter, och det är den skillnad som märks mest i
            backen. Söker du långa nedfarter och höghöjdssnö är Alperna svaret.
            Söker du kortare resa, färre restimmar med barn och ett liftkort på{' '}
            {ortKort ? ortKort.kr : '—'} är det inte självklart.
          </p>
        </section>

      </main>

      <SiteFooter />
    </div>
  )
}
