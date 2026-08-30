import Link from 'next/link'
import SiteHeader from '../SiteHeader'
import SiteFooter from '../SiteFooter'
import { getResorts } from '../../lib/resorts'
import { skrivDatum } from '../../lib/valuta'
import { SITE_URL } from '../../lib/lang'
import {
  HAMTAD, KOMFORT, ORTER, PRAKTISKT, SASONG, SASONG_SLUT,
  STATIONER, SVERIGE, restidText, sasongenSlut, stationFor, stockholmstillagg,
} from '../../lib/nattaget'

// Samma intervall som ortsidorna. Betyder också att sidan märker att
// säsongen tagit slut inom en timme efter att den gjort det, utan deploy.
export const revalidate = 3600

const titel = 'Nattåg till Alperna — tider, orter och vad som gäller | Alpkoll'
const beskrivning =
  'Snälltågets nattåg Malmö–Österrike vintern 2026/27: avgångar, alla sex ' +
  'stationer med restid, vilka skidorter du når och vad skidorna kostar ombord.'

export const metadata = {
  title: titel,
  description: beskrivning,
  alternates: { canonical: `${SITE_URL}/nattaget-till-alperna` },
  openGraph: {
    title: titel,
    description: beskrivning,
    url: `${SITE_URL}/nattaget-till-alperna`,
    siteName: 'Alpkoll',
    type: 'article',
    locale: 'sv_SE',
    images: ['/og-image.png'],
  },
  twitter: { card: 'summary_large_image', title: titel, description: beskrivning, images: ['/og-image.png'] },
}

const ACCENT = '#D4A574'
const kort = { background: '#1c1a17', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }
const etikett = {
  fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500,
  color: 'rgba(255,255,255,0.28)', letterSpacing: '0.12em', textTransform: 'uppercase',
}
const brod = {
  fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.75,
  color: 'rgba(255,255,255,0.62)', maxWidth: 660,
}
const rubrik = (storlek) => ({
  fontFamily: 'var(--font-heading)', fontSize: storlek, fontWeight: 400,
  letterSpacing: '0.03em', margin: '0 0 18px',
})

export default async function NattagetTillAlperna() {
  const orter = await getResorts()

  // Orterna i tågets ordning längs linjen, inte i bokstavsordning. Den som
  // läser en tidtabell läser den framifrån.
  const ordning = STATIONER.map((s) => s.namn)
  const nattagsorter = ORTER
    .map((n) => ({ ...n, ort: orter.find((r) => r.slug === n.slug) }))
    .filter((n) => n.ort)
    .sort((a, b) => {
      const ai = a.station ? ordning.indexOf(a.station) : 99
      const bi = b.station ? ordning.indexOf(b.station) : 99
      return ai - bi || a.ort.name.localeCompare(b.ort.name, 'sv')
    })

  const utanBuss = nattagsorter.filter((n) => !n.buss)
  const medBuss = nattagsorter.filter((n) => n.buss)

  // Säsongen är över: sidan slutar visa en tidtabell som inte gäller.
  // Se kommentaren överst i lib/nattaget.js — en utgången tidtabell som
  // ser aktuell ut är värre än ingen sida alls.
  const slut = sasongenSlut()

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>
      <SiteHeader />

      <main style={{ padding: '120px clamp(20px, 4vw, 64px) 100px', maxWidth: 1100, margin: '0 auto' }}>

        <p style={{ ...etikett, color: ACCENT, marginBottom: 14 }}>
          {slut ? 'Säsongen är slut' : 'Säsongen 2026/27'}
        </p>
        <h1 style={{
          fontFamily: 'var(--font-heading)', fontSize: 'clamp(34px, 6vw, 56px)', fontWeight: 400,
          letterSpacing: '0.03em', lineHeight: 1.05, margin: '0 0 22px',
        }}>
          Nattåg till Alperna
        </h1>

        {slut ? (
          <p style={{ ...brod, margin: '0 0 40px' }}>
            Snälltågets vintertrafik till Österrike upphörde den {skrivDatum(SASONG_SLUT)}.
            Tidtabellen för nästa säsong brukar publiceras under hösten. Så snart den
            finns står den här — tills dess visar vi hellre ingenting än tider som
            inte gäller.
          </p>
        ) : (
          <>
            {/* Direktsvaret först. Det är det en läsare skummar efter och
                det en språkmodell citerar — därför står hela svaret i en
                mening, med orterna namngivna. */}
            <p style={{ ...brod, margin: '0 0 16px' }}>
              Ja, det går tåg från Sverige till Alperna. Snälltåget kör nattåg{' '}
              {SVERIGE.avgangsort}–Österrike {SASONG}, med avgång{' '}
              {SVERIGE.avgangsdag} {SVERIGE.avgang} och framme i Alperna på
              lördagsmorgonen. Hemresan går från Österrike lördag kväll och är i{' '}
              {SVERIGE.avgangsort} {SVERIGE.hemkomst} på {SVERIGE.hemkomstdag}en.
            </p>
            <p style={{ ...brod, margin: '0 0 40px' }}>
              {utanBuss.length > 0 && (
                <>
                  Av skidorterna på Alpkoll stannar tåget i{' '}
                  {utanBuss.map((n) => n.ort.name).join(' och ')}.{' '}
                </>
              )}
              {medBuss.length > 0 && (
                <>
                  Till {medBuss.map((n) => n.ort.name).join(', ').replace(/, ([^,]*)$/, ' och $1')}{' '}
                  går transferbuss från stationen.
                </>
              )}
            </p>

            {/* ── Tidtabellen ── */}
            <h2 style={rubrik(28)}>Tider och restid</h2>
            <p style={{ ...brod, fontSize: 15, margin: '0 0 18px' }}>
              Restiden står inte i Snälltågets tidtabell — den är räknad ur
              avgången från {SVERIGE.avgangsstation} och ankomsten till
              stationen.
            </p>
            <div style={{ ...kort, overflowX: 'auto', marginBottom: 40 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
                <thead>
                  <tr>
                    {['Station', 'Framme lördag', 'Hem lördag', 'Restid från Malmö'].map((h, i) => (
                      <th key={h} style={{
                        ...etikett, textAlign: i === 0 ? 'left' : 'right', padding: '16px 14px',
                        borderBottom: '1px solid rgba(255,255,255,0.07)', whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {STATIONER.map((s) => (
                    <tr key={s.namn} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{
                        fontFamily: 'var(--font-body)', fontSize: 14.5, fontWeight: 500,
                        color: '#f0ece4', padding: '14px 14px', whiteSpace: 'nowrap',
                      }}>{s.namn}</td>
                      {[s.ut, s.hem, restidText(s.restidMin)].map((v, i) => (
                        <td key={i} style={{
                          fontFamily: 'var(--font-body)', fontSize: 14,
                          color: i === 2 ? ACCENT : 'rgba(255,255,255,0.55)',
                          padding: '14px 14px', textAlign: 'right', whiteSpace: 'nowrap',
                        }}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Sportlovsavgången ──
                Egen rubrik och inte en fotnot: det är den enda avgången från
                Stockholm hela säsongen, och den ligger på Stockholms sportlov. */}
            <div style={{ ...kort, padding: 'clamp(20px, 4vw, 28px)', borderColor: 'rgba(212,165,116,0.22)', marginBottom: 40 }}>
              <div style={{ ...etikett, color: ACCENT, marginBottom: 10 }}>
                Direkt från Stockholm — en gång per säsong
              </div>
              <p style={{ ...brod, fontSize: 15, margin: 0 }}>
                {SVERIGE.stockholmsavgang.datum} går tåget hela vägen från Stockholm,
                avgång {SVERIGE.stockholmsavgang.avgang}. Det är{' '}
                {SVERIGE.stockholmsavgang.anledning}, och det är enda gången på
                hela säsongen. Hemresan går {SVERIGE.stockholmsavgang.retur} och
                är i Stockholm {SVERIGE.stockholmsavgang.hemkomst}.
                {stationFor('kitzbuehel') && (
                  <> Stockholm–Kitzbühel tar då{' '}
                    {restidText(stationFor('kitzbuehel').restidMin + stockholmstillagg())}.</>
                )}
              </p>
              <p style={{ ...brod, fontSize: 15, margin: '14px 0 0' }}>
                Övriga fredagar går tåget från {SVERIGE.avgangsstation}, med
                anslutningar från {SVERIGE.anslutningar.slice(0, -1).join(', ')} och{' '}
                {SVERIGE.anslutningar[SVERIGE.anslutningar.length - 1]}.
              </p>
            </div>

            {/* ── Orterna ── */}
            <h2 style={rubrik(28)}>Skidorterna du når</h2>
            <p style={{ ...brod, fontSize: 15, margin: '0 0 18px' }}>
              Snälltåget namnger var bussen släpper av i byn. Det är den uppgiften
              som avgör om resan slutar vid liften eller en promenad därifrån.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10, marginBottom: 40 }}>
              {nattagsorter.map((n) => (
                <Link key={n.slug} href={`/resort/${n.slug}`} style={{
                  ...kort, padding: '16px 18px', textDecoration: 'none', display: 'block',
                  borderColor: n.buss ? 'rgba(255,255,255,0.06)' : 'rgba(212,165,116,0.28)',
                }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500, color: '#f0ece4' }}>
                    {n.ort.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: ACCENT, marginTop: 6, lineHeight: 1.5 }}>
                    {n.buss
                      ? n.station
                        ? `Buss från ${n.station}`
                        : 'Buss från tåget'
                      : `Tåget stannar här · ${restidText(stationFor(n.slug)?.restidMin)}`}
                  </div>
                  {n.hallplats && (
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
                      Hållplats: {n.hallplats}
                    </div>
                  )}
                  {n.not && (
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'rgba(255,255,255,0.3)', marginTop: 6, lineHeight: 1.5 }}>
                      {n.not}
                    </div>
                  )}
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>
                    {n.ort.total_pistes_km} km pist · {n.ort.total_lifts} liftar
                  </div>
                </Link>
              ))}
            </div>

            {/* ── Kostnad och praktiskt ──
                Ingen biljettprislapp. Snälltåget publicerar ingen prislista;
                priset sätts dynamiskt per datum och komfortnivå i bokningen.
                Ett enda fångat belopp hade åldrats osynligt — samma fel som
                lift_pass_week_eur led av. Det som är fast står här i stället. */}
            <h2 style={rubrik(28)}>Vad det kostar, och vad som gäller ombord</h2>
            <p style={{ ...brod, fontSize: 15, margin: '0 0 18px' }}>
              Biljettpriset sätts per avgång och komfortnivå i Snälltågets bokning,
              och det finns ingen publicerad prislista att återge. Tilläggen är
              däremot fasta, och det är de som brukar överraska.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 10, marginBottom: 22 }}>
              {[
                { label: 'Skidor', value: `${PRAKTISKT.skidincheckningKr} kr`, not: PRAKTISKT.skidincheckningNot },
                { label: 'Frukost', value: `${PRAKTISKT.frukostKr} kr`, not: 'förbokas, hämtas ombord' },
                { label: 'Biljett', value: 'Tur och retur', not: `enkel går bara ${PRAKTISKT.baraTurOchReturUndantag}` },
                { label: 'Husdjur', value: 'Nej', not: 'uppehållen är för korta' },
              ].map((r) => (
                <div key={r.label} style={{ ...kort, padding: '14px 16px' }}>
                  <div style={etikett}>{r.label}</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: '#f0ece4', margin: '6px 0 4px' }}>{r.value}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>{r.not}</div>
                </div>
              ))}
            </div>
            <div style={{ ...kort, padding: '18px 20px', marginBottom: 40 }}>
              <div style={{ ...etikett, marginBottom: 12 }}>Komfortnivåer</div>
              {KOMFORT.map((k) => (
                <div key={k.namn} style={{ marginBottom: 10 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: '#f0ece4' }}>
                    {k.namn}
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'rgba(255,255,255,0.5)' }}>
                    {' — '}{k.beskrivning}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        <p style={{ ...brod, fontSize: 13.5, color: 'rgba(255,255,255,0.35)', margin: '0 0 8px' }}>
          Tider och villkor är hämtade från Snälltåget den {skrivDatum(HAMTAD)}.
          Biljetter bokas hos{' '}
          <a href="https://www.snalltaget.se/tag-till-osterrike-vinter" rel="noopener noreferrer" target="_blank" style={{ color: ACCENT }}>
            Snälltåget
          </a>. Alpkoll säljer inga resor och tar ingen ersättning för den här sidan.
        </p>
        <p style={{ ...brod, fontSize: 13.5, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
          Vill du ställa tåget mot att flyga finns{' '}
          <Link href="/are-eller-alperna" style={{ color: ACCENT }}>Åre eller Alperna</Link>{' '}
          och <Link href="/salen-eller-alperna" style={{ color: ACCENT }}>Sälen eller Alperna</Link>,
          och vad liftkortet kostar står i{' '}
          <Link href="/liftkortspriser" style={{ color: ACCENT }}>prislistan</Link>.
        </p>
      </main>

      <SiteFooter />
    </div>
  )
}
