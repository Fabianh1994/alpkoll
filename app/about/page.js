// Sidan var helt engelsk och en klientkomponent — bara för att menyn
// behövde ett scroll-läge. Menyn ligger nu i SiteHeader, så sidan kan
// renderas på servern. Det ger den både egen metadata och ett antal orter
// som hämtas ur databasen i stället för att stå hårdkodat och bli fel.

import { getResorts } from '../../lib/resorts';
import { PLANERAREN_SYNLIG } from '../../lib/features';
import SiteHeader from '../SiteHeader';
import SiteFooter from '../SiteFooter';

export const revalidate = 3600;

export const metadata = {
  title: 'Om Alpkoll — varför sajten finns och hur siffrorna tas fram',
  description:
    'Alpkoll jämför skidorter på samma underlag: en källa för alla siffror, uppmätt restid och nackdelar utskrivna. Byggd av en skidåkare i Stockholm.',
  alternates: { canonical: '/about' },
};

const KONTAKT = 'hello@alpkoll.com';

export default async function AboutPage() {
  const orter = await getResorts();
  const antalOrter = orter.length;
  const antalLander = new Set(orter.map((r) => r.country).filter(Boolean)).size;

  // Databasen kan svara tomt. Då säger vi ingenting om antal i stället för
  // att skriva ut en nolla som ser ut som ett påstående.
  const omfattning =
    antalOrter > 0
      ? `I dag ligger ${antalOrter} skidorter i ${antalLander} länder inne, jämförda på samma underlag.`
      : 'Varje ort är jämförd på samma underlag.';

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>
      <SiteHeader />

      {/* ── Hero ─────────────────────────────── */}
      <header style={{
        paddingTop: 'clamp(140px, 20vh, 200px)',
        paddingBottom: 'clamp(60px, 10vh, 100px)',
        paddingLeft: 'clamp(24px, 4vw, 64px)',
        paddingRight: 'clamp(24px, 4vw, 64px)',
        maxWidth: 900,
        margin: '0 auto',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
          color: '#D4A574', letterSpacing: '0.2em', textTransform: 'uppercase',
          marginBottom: 24,
        }}>Om Alpkoll</p>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(40px, 7vw, 72px)',
          fontWeight: 400, lineHeight: 0.95,
          color: '#f0ece4', letterSpacing: '0.02em',
          marginBottom: 32,
        }}>
          För dig som<br />
          gör din <span style={{ color: '#D4A574' }}>hemläxa.</span>
        </h1>
        <div style={{
          width: 48, height: 2, background: '#D4A574', marginBottom: 32, borderRadius: 1,
        }} />
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(15px, 1.4vw, 18px)',
          fontWeight: 300, color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.7, maxWidth: 600,
        }}>
          Att planera en skidresa ska inte behöva betyda tjugo öppna flikar.
          Alpkoll samlar det du faktiskt behöver veta på ett ställe — så att
          tiden går åt till att åka i stället för att leta.
        </p>
      </header>

      <Avdelare />

      {/* ── Bakgrunden ───────────────────────── */}
      <section style={{
        maxWidth: 900, margin: '0 auto',
        padding: 'clamp(60px, 8vh, 100px) clamp(24px, 4vw, 64px)',
      }}>
        <Etikett>Bakgrunden</Etikett>
        <Rubrik>Tjugo flikar. Noll svar.</Rubrik>
        <Brodtext>
          <p style={brodstil}>
            Varje skidresa börjar likadant. Du öppnar en ortssajt, sedan en till,
            sedan en väderprognos, sedan en flygsökning, sedan en forumtråd från
            2019. Innan du vet ordet av har du tjugo flikar uppe och kan
            fortfarande inte jämföra Val Thorens med Åre på något vettigt sätt.
          </p>
          <p style={brodstil}>
            Alpkoll kom ur den irritationen. Sajten samlar det som faktiskt går
            att jämföra — snösäkerhet, terräng, pris, restid, höjd över havet,
            pistkilometer — och ställer orterna bredvid varandra. {omfattning}
          </p>
        </Brodtext>
      </section>

      <Avdelare />

      {/* ── Så fungerar det ──────────────────── */}
      <section style={{
        maxWidth: 900, margin: '0 auto',
        padding: 'clamp(60px, 8vh, 100px) clamp(24px, 4vw, 64px)',
      }}>
        <Etikett>Så fungerar det</Etikett>
        <Rubrik marginBottom={40}>Data, inte tyckande.</Rubrik>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 24,
        }}>
          {[
            {
              number: '01',
              title: 'En källa för alla',
              text: 'Pist, liftar och höjder kommer från skiresort.com för samtliga orter. Orternas egen marknadsföring anger ofta högre tal — Verbier uppger 90 liftar där skiresort.com räknar 68 — men blandade källor gör orterna ojämförbara. Siffrorna avser hela det sammankopplade området, inte byns egen sektor.',
            },
            {
              number: '02',
              title: 'Mätt, inte gissat',
              text: 'Restiden från flygplatsen är uppmätt ort för ort. Tidigare räknades den fram ur avståndet, vilket gav en biltransfer till bilfria Zermatt. Där bil eller nattåg är den verkliga vägen står det i texten i stället.',
            },
            {
              number: '03',
              title: 'Nackdelar skrivs ut',
              text: 'Zermatt är dyrt, Val Thorens är ingen vykortsby, Kitzbühel lutar sig mot konstsnö. Ingen ort betalar för att ligga högre upp. En jämförelsesajt som bara berömmer hjälper ingen att välja.',
            },
          ].map((step) => (
            <div key={step.number} style={{
              background: '#1c1a17',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: 6,
              padding: 'clamp(24px, 3vw, 32px)',
            }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 32, color: 'rgba(212,165,116,0.2)',
                letterSpacing: '0.02em',
                display: 'block', marginBottom: 16,
              }}>{step.number}</span>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 20, fontWeight: 400, color: '#f0ece4',
                letterSpacing: '0.03em', marginBottom: 12,
              }}>{step.title}</h3>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 300,
                color: 'rgba(255,255,255,0.4)', lineHeight: 1.7,
              }}>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <Avdelare />

      {/* ── Vem ligger bakom ─────────────────── */}
      <section style={{
        maxWidth: 900, margin: '0 auto',
        padding: 'clamp(60px, 8vh, 100px) clamp(24px, 4vw, 64px)',
      }}>
        <Etikett>Vem ligger bakom</Etikett>
        <Rubrik>En skidåkare. Ett problem.</Rubrik>
        <Brodtext>
          <p style={brodstil}>
            Alpkoll byggs av en skidåkare i Stockholm som tröttnade på att
            planera resor den svåra vägen. Det började som ett sätt att få
            ordning på siffrorna åt sig själv och blev något som kanske är
            till nytta för fler.
          </p>
          <p style={brodstil}>
            Det här är ett fristående projekt. Inget riskkapital, ingen
            koncern bakom. En person som försöker göra skidreseplanering
            lite mindre jobbig.
          </p>
        </Brodtext>
      </section>

      <Avdelare />

      {/* ── På gång ──────────────────────────── */}
      <section style={{
        maxWidth: 900, margin: '0 auto',
        padding: 'clamp(60px, 8vh, 100px) clamp(24px, 4vw, 64px)',
      }}>
        <Etikett>På gång</Etikett>
        <Rubrik marginBottom={40}>Det här är bara början.</Rubrik>

        <div style={{
          display: 'flex', flexDirection: 'column', gap: 16,
          maxWidth: 620,
        }}>
          {[
            // Planeraren är dold tills den är genomgången — se lib/features.js.
            // Står den som "på gång" när den redan syns blir sidan fel, därför
            // följer punkten flaggan.
            ...(PLANERAREN_SYNLIG
              ? []
              : [{
                  label: 'Reseplanerare',
                  desc: 'Berätta vad du vill ha och vad det får kosta, så rangordnas orterna efter dina önskemål. Fungerar, men är avstängd tills varje förklaringstext och poäng är genomgången.',
                }]),
            {
              label: 'Jämför två orter sida vid sida',
              desc: 'I dag är varje ortssida en egen ö. Nästa steg är att kunna ställa två orter mot varandra, rad för rad.',
            },
            {
              label: 'Fler nordiska orter',
              desc: 'Vemdalen, Idre Fjäll, Branäs, Romme och Kungsberget saknas — orter många svenskar faktiskt åker till.',
            },
            {
              label: 'Snö och väder',
              desc: 'Snödjup och prognoser, så att valet av vecka blir lika underbyggt som valet av ort.',
            },
          ].map((item) => (
            <div key={item.label} style={{
              display: 'flex', gap: 16, alignItems: 'flex-start',
              padding: '20px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#D4A574', flexShrink: 0,
                marginTop: 8,
              }} />
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 18, fontWeight: 400, color: '#f0ece4',
                  letterSpacing: '0.03em', marginBottom: 6,
                }}>{item.label}</h3>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 300,
                  color: 'rgba(255,255,255,0.4)', lineHeight: 1.65,
                }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Avdelare />

      {/* ── Kontakt ──────────────────────────── */}
      <section style={{
        maxWidth: 900, margin: '0 auto',
        padding: 'clamp(60px, 8vh, 100px) clamp(24px, 4vw, 64px)',
      }}>
        <Etikett>Hör av dig</Etikett>
        <Rubrik>Frågor? Idéer? Hittat ett fel?</Rubrik>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300,
          color: 'rgba(255,255,255,0.45)', lineHeight: 1.75,
          marginBottom: 32, maxWidth: 620,
        }}>
          Alpkoll är under uppbyggnad och blir bättre av synpunkter. Har du en
          ort som borde finnas med, hittat en siffra som inte stämmer, eller
          bara vill säga hej — hör av dig.
        </p>
        <a href={`mailto:${KONTAKT}`} style={{
          fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: '#121110', background: '#D4A574',
          border: 'none', borderRadius: 3, padding: '15px 32px',
          cursor: 'pointer', textDecoration: 'none',
          display: 'inline-block',
        }}>{KONTAKT}</a>
      </section>

      <SiteFooter />
    </div>
  );
}

const brodstil = {
  fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300,
  color: 'rgba(255,255,255,0.45)', lineHeight: 1.75,
};

function Avdelare() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(24px, 4vw, 64px)' }}>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
    </div>
  );
}

function Etikett({ children }) {
  return (
    <p style={{
      fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
      color: '#D4A574', letterSpacing: '0.2em', textTransform: 'uppercase',
      marginBottom: 20,
    }}>{children}</p>
  );
}

function Rubrik({ children, marginBottom = 28 }) {
  return (
    <h2 style={{
      fontFamily: 'var(--font-heading)',
      fontSize: 'clamp(28px, 4vw, 40px)',
      fontWeight: 400, color: '#f0ece4', letterSpacing: '0.02em',
      marginBottom, lineHeight: 1.05,
    }}>{children}</h2>
  );
}

function Brodtext({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 620 }}>
      {children}
    </div>
  );
}
