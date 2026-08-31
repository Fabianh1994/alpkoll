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

/** "a, b och c" — svensk uppräkning ur en lista av nattågsorter. */
const lista = (rader) =>
  rader.map((n) => n.ort.name).join(', ').replace(/, ([^,]*)$/, ' och $1')

/**
 * Resan till en ort som en följd av steg, i den ordning den görs.
 *
 * Byggd ur ORTER och STATIONER av samma skäl som meningen överst på sidan:
 * en ort utan utsatt station får inget påhittat mellansteg, den får ett steg
 * som säger rakt ut att stationen inte är utsatt.
 */
function resesteg(n, station) {
  const steg = [{
    plats: SVERIGE.avgangsstation,
    tid: `${SVERIGE.avgangsdag} ${SVERIGE.avgang}`,
    till: 'natten ombord',
  }]

  steg.push(station
    ? { plats: station.namn, tid: `lördag ${station.ut}`, till: n.buss ? 'transferbuss' : null }
    : { plats: 'Station ej utsatt', tid: 'lördag morgon', till: 'transferbuss', svag: true })

  if (n.buss) {
    steg.push({
      plats: n.ort.name,
      tid: n.hallplats ? `Hållplats: ${n.hallplats}` : null,
    })
  }

  return steg
}

/**
 * Summan överst på kortet.
 *
 * För en bussort får restiden inte stå ensam. Den slutar vid stationen, och
 * busstiden är inte publicerad någonstans — den som jämför 22 h 07 min mot
 * ett flyg jämför annars fel tal. Det är samma sorts fel som meningen om
 * bytesfrihet gjorde, fast med en siffra i stället för ett påstående.
 */
function resesumma(n, station) {
  if (!station) return 'Restiden går inte att räkna — stationen är inte utsatt'
  if (!n.buss) return `${restidText(station.restidMin)} från ${SVERIGE.avgangsstation}, hela vägen`
  return `${restidText(station.restidMin)} till ${station.namn} · transferbussen tillkommer`
}

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
  const bussMedStation = medBuss.filter((n) => n.station)
  const bussUtanStation = medBuss.filter((n) => !n.station)

  // Säsongen är över: sidan slutar visa en tidtabell som inte gäller.
  // Se kommentaren överst i lib/nattaget.js — en utgången tidtabell som
  // ser aktuell ut är värre än ingen sida alls.
  const slut = sasongenSlut()

  // Hemtåget kör linjen åt andra hållet. Ordningen vänds här i stället för
  // inuti en kolumn, så att hemresans tabell läser framifrån precis som
  // utresans gör. Det var den vändningen som gjorde den gamla tabellen svår:
  // en kolumn som löpte baklänges bredvid en som löpte framlänges.
  const hemresa = [...STATIONER].reverse()

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
              {/* Mayrhofen får inte bakas in i "från stationen". Snälltåget
                  skriver inte ut vilken station bussen dit utgår från, och
                  meningen ska inte påstå mer än datan bär — det var precis den
                  sortens handskrivna generalisering som gjorde den gamla
                  meningen osann. Korten längre ner säger samma sak. */}
              {bussMedStation.length > 0 && (
                <>
                  Till {lista(bussMedStation)} går transferbuss från stationen.{' '}
                </>
              )}
              {bussUtanStation.length > 0 && (
                <>
                  Till {lista(bussUtanStation)} går transferbuss, men Snälltåget
                  skriver inte ut från vilken station den utgår.
                </>
              )}
            </p>

            <style>{`
              .nt-linje { display: flex; align-items: flex-start; }
              .nt-steg { position: relative; flex: 1; min-width: 0; padding: 34px 18px 0 0; }
              .nt-steg:last-child { padding-right: 0; }
              .nt-steg::before {
                content: ''; position: absolute; top: 19px; left: 0;
                width: 11px; height: 11px; border-radius: 50%;
                background: #D4A574; box-shadow: 0 0 0 4px rgba(212,165,116,0.09);
              }
              .nt-steg::after {
                content: ''; position: absolute; top: 24px; left: 16px; right: 6px; height: 1px;
                background: linear-gradient(90deg, rgba(212,165,116,0.45), rgba(212,165,116,0.13));
              }
              .nt-steg:last-child::after { display: none; }
              .nt-mellan {
                position: absolute; top: 0; left: 16px; white-space: nowrap;
                font-family: var(--font-body); font-size: 10px; font-weight: 500;
                letter-spacing: 0.12em; text-transform: uppercase;
                color: rgba(255,255,255,0.28);
              }
              /* Under 720 px läses resan uppifrån och ner i stället. Etiketten
                 släpper sin absoluta placering och hamnar efter sitt stopp,
                 vilket är där den hör hemma när linjen är lodrät. */
              @media (max-width: 720px) {
                .nt-linje { display: block; }
                .nt-steg { padding: 0 0 22px 26px; }
                .nt-steg:last-child { padding-bottom: 0; }
                .nt-steg::before { top: 3px; }
                .nt-steg::after {
                  top: 18px; left: 5px; right: auto; width: 1px; height: calc(100% - 18px);
                  background: linear-gradient(180deg, rgba(212,165,116,0.45), rgba(212,165,116,0.13));
                }
                .nt-mellan { position: static; display: block; margin-top: 8px; }
              }
            `}</style>

            {/* ── Resan, ort för ort ──
                Tidtabellen låg tidigare som en stationstabell, och orterna som
                ett eget block längre ner. Den som söker på nattåg vet vad Sölden
                är, inte vad Jenbach är — de två blocken måste vara ett. Varje
                kort läses nu som en resa i den ordning den görs: avgång, natten
                ombord, station, buss, by. Stegen byggs ur datan, så en ort utan
                utsatt station kan inte få ett påhittat mellansteg. */}
            <h2 style={rubrik(28)}>Så går resan, ort för ort</h2>
            <p style={{ ...brod, fontSize: 15, margin: '0 0 22px' }}>
              Tåget går från {SVERIGE.avgangsstation} på {SVERIGE.avgangsdag}en, du
              sover ombord, och du är framme på lördagsmorgonen. Hela linjen station
              för station står längst ner.
            </p>
            <div style={{ display: 'grid', gap: 12, marginBottom: 40 }}>
              {nattagsorter.map((n) => {
                const station = stationFor(n.slug)
                return (
                  <Link key={n.slug} href={`/resort/${n.slug}`} style={{
                    ...kort, padding: 'clamp(18px, 3vw, 26px)', textDecoration: 'none', display: 'block',
                    borderColor: n.buss ? 'rgba(255,255,255,0.06)' : 'rgba(212,165,116,0.28)',
                  }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                      gap: 14, flexWrap: 'wrap', marginBottom: 5,
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 400,
                        color: '#f0ece4', letterSpacing: '0.02em',
                      }}>{n.ort.name}</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'rgba(255,255,255,0.3)' }}>
                        {n.ort.total_pistes_km} km pist · {n.ort.total_lifts} liftar
                      </span>
                    </div>
                    {/* Summan. För en bussort får den inte se ut som svaret —
                        restiden slutar vid stationen, och busstiden är inte
                        publicerad någonstans. */}
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: ACCENT, lineHeight: 1.5 }}>
                      {resesumma(n, station)}
                    </div>

                    <div className="nt-linje" style={{ marginTop: 18 }}>
                      {resesteg(n, station).map((p, i) => (
                        <div className="nt-steg" key={i}>
                          <div style={{
                            fontFamily: 'var(--font-body)', fontSize: 14.5, fontWeight: 500,
                            color: p.svag ? 'rgba(255,255,255,0.42)' : '#f0ece4',
                          }}>{p.plats}</div>
                          {p.tid && (
                            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'rgba(255,255,255,0.42)', marginTop: 3 }}>
                              {p.tid}
                            </div>
                          )}
                          {/* Sist i DOM:en med flit: lodrätt läge placerar den
                              efter sitt stopp, vågrätt läge lyfter den med
                              position:absolute upp över strecket. */}
                          {p.till && <span className="nt-mellan">{p.till}</span>}
                        </div>
                      ))}
                    </div>

                    {n.not && (
                      <div style={{
                        fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'rgba(255,255,255,0.3)',
                        marginTop: 16, lineHeight: 1.55,
                      }}>{n.not}</div>
                    )}
                  </Link>
                )
              })}
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
                hela säsongen. Hemresan lämnar Österrike{' '}
                {SVERIGE.stockholmsavgang.retur} och är i Stockholm på{' '}
                {SVERIGE.hemkomstdag}en, {SVERIGE.stockholmsavgang.hemkomst}.
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

            {/* ── Hemresan ──
                Egen sektion, inte en kolumn bredvid utresan. Hemtåget kör
                linjen åt andra hållet, så i en gemensam tabell löpte den
                kolumnen baklänges — och "framme" och "avgår" stod som två
                likadana klockslag utan att säga vilket som var vilket. */}
            <h2 style={rubrik(28)}>Hemresan</h2>
            <p style={{ ...brod, fontSize: 15, margin: '0 0 18px' }}>
              Hemtåget kör samma sträcka åt andra hållet. Det startar i{' '}
              {hemresa[0].namn} på lördagskvällen och plockar upp längs linjen fram
              till {hemresa[hemresa.length - 1].namn} — därför står stationerna här
              i omvänd ordning mot utresan. Klockslagen är avgångar, och du sover
              ombord den här natten också.
            </p>
            <div style={{ ...kort, overflowX: 'auto', marginBottom: 40 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 380 }}>
                <thead>
                  <tr>
                    {['Station', 'Avgår lördag'].map((h, i) => (
                      <th key={h} style={{
                        ...etikett, textAlign: i === 0 ? 'left' : 'right', padding: '16px 16px',
                        borderBottom: '1px solid rgba(255,255,255,0.07)', whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {hemresa.map((s) => (
                    <tr key={s.namn} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{
                        fontFamily: 'var(--font-body)', fontSize: 14.5, fontWeight: 500,
                        color: '#f0ece4', padding: '14px 16px', whiteSpace: 'nowrap',
                      }}>{s.namn}</td>
                      <td style={{
                        fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.55)',
                        padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap',
                      }}>{s.hem}</td>
                    </tr>
                  ))}
                  {/* Ankomsten hem som en egen rad, inte som en mening i
                      löptexten. Resan ska gå att följa till slutet utan att
                      läsaren behöver minnas ett tal från ett annat stycke. */}
                  <tr>
                    <td colSpan={2} style={{
                      fontFamily: 'var(--font-body)', fontSize: 13.5, color: ACCENT,
                      padding: '14px 16px', background: 'rgba(212,165,116,0.05)',
                    }}>
                      Framme {SVERIGE.avgangsstation} — {SVERIGE.hemkomstdag}{' '}
                      {SVERIGE.hemkomst}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── Hela linjen ──
                Referenstabellen, för den som vill se sträckan i ett stycke.
                Bara utresan: en tabell som blandar ankomster och avgångar är
                det som gjorde den gamla svår att läsa. */}
            <h2 style={rubrik(28)}>Hela linjen</h2>
            <p style={{ ...brod, fontSize: 15, margin: '0 0 18px' }}>
              Alla sex stationer i tågets ordning på utresan. Restiden står inte i
              Snälltågets tidtabell — den är räknad ur avgången från{' '}
              {SVERIGE.avgangsstation} och ankomsten till stationen, och den slutar
              vid stationen. Går du vidare med transferbuss tillkommer den tiden.
            </p>
            <div style={{ ...kort, overflowX: 'auto', marginBottom: 40 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 460 }}>
                <thead>
                  <tr>
                    {['Station', 'Framme lördag', `Restid från ${SVERIGE.avgangsstation}`].map((h, i) => (
                      <th key={h} style={{
                        ...etikett, textAlign: i === 0 ? 'left' : 'right', padding: '16px 14px',
                        borderBottom: '1px solid rgba(255,255,255,0.07)', whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Avgången som första rad i tabellen. Den stod förut bara i
                      löptexten, vilket tvingade läsaren att bära med sig
                      utgångspunkten in i en tabell full av ankomsttider. */}
                  <tr>
                    <td colSpan={3} style={{
                      fontFamily: 'var(--font-body)', fontSize: 13.5, color: ACCENT,
                      padding: '14px 14px', background: 'rgba(212,165,116,0.05)',
                    }}>
                      Avgång {SVERIGE.avgangsstation} — {SVERIGE.avgangsdag}{' '}
                      {SVERIGE.avgang}
                    </td>
                  </tr>
                  {STATIONER.map((s) => (
                    <tr key={s.namn} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{
                        fontFamily: 'var(--font-body)', fontSize: 14.5, fontWeight: 500,
                        color: '#f0ece4', padding: '14px 14px', whiteSpace: 'nowrap',
                      }}>{s.namn}</td>
                      {[s.ut, restidText(s.restidMin)].map((v, i) => (
                        <td key={i} style={{
                          fontFamily: 'var(--font-body)', fontSize: 14,
                          color: i === 1 ? ACCENT : 'rgba(255,255,255,0.55)',
                          padding: '14px 14px', textAlign: 'right', whiteSpace: 'nowrap',
                        }}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
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
