import Link from 'next/link'
import SiteHeader from '../SiteHeader'
import SiteFooter from '../SiteFooter'
import Partnerlank from '../Partnerlank'
import { SITE_URL } from '../../lib/lang'
import { bookingSok, BOOKING_BLA } from '../../lib/booking'

// Var ska man bo i Sälen?
//
// Den vanligaste forumfrågan om Sälen (Familjeliv, RikaTillsammans,
// Freeride), och den som Google svarar på med SkiStars egna områdessidor.
// Sidan finns för att svara det SkiStar inte gör: Stöten och Kläppen hör
// till Sälen men ligger utanför SkiPass, och varje område har en nackdel.
//
// Underlaget hämtades 17 november 2026 ur primärkällor, se
// /mnt/project-files/alpkoll/research/salen-omraden-2026-11-17.md i
// projektet. Pisttalen kommer från skiresort.com, samma källa som resten
// av sajten. skiresort.com redovisar SkiStars fyra områden som två par,
// därför står talen per par och inte per område.
//
// Uppdateras en gång om året: liftkortspriset och nyheterna.

const titel = 'Var ska man bo i Sälen? Alla sex områden jämförda | Alpkoll'
const beskrivning =
  'Lindvallen, Högfjället, Tandådalen, Hundfjället, Stöten eller Kläppen? ' +
  'Vem varje område passar, vad det saknar och vilket liftkort som gäller.'

export const metadata = {
  title: titel,
  description: beskrivning,
  alternates: { canonical: `${SITE_URL}/var-bo-i-salen` },
  openGraph: {
    title: titel,
    description: beskrivning,
    url: `${SITE_URL}/var-bo-i-salen`,
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
  color: 'rgba(255,255,255,0.52)', letterSpacing: '0.12em', textTransform: 'uppercase',
}
const brod = {
  fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.75,
  color: 'rgba(255,255,255,0.62)', maxWidth: 660,
}
const rubrik = (storlek) => ({
  fontFamily: 'var(--font-heading)', fontSize: storlek, fontWeight: 400,
  letterSpacing: '0.03em', margin: '0 0 18px', color: '#f0ece4',
})

const KALLOR = {
  skipass: 'https://www.skistar.com/en/Salen/SkiPass-and-Skiing/',
  skibuss: 'https://skistar.com/en/ski-destinations/salen/winter-in-salen/services/ski-bus',
  efn: 'https://efn.se/skistar-hojer-liftkortspriser-i-salen-under-hogsasong',
  lindvallenHogfjallet: 'https://www.skiresort.com/en/ski-resort/lindvallen-hoegfjaellet-saelen/',
  tandadalenHundfjallet: 'https://www.skiresort.com/en/ski-resort/tandaadalen-hundfjaellet-saelen/',
  nasfjallet: 'https://www.svt.se/nyheter/lokalt/dalarna/bolaget-tomdes-nu-vill-ingen-kopa-skidanlaggningen-i-salen',
}

// Vem passar var. Kort svar överst, för den som bara vill ha det.
const KORT_SVAR = [
  { vem: 'Små barn', var: 'Lindvallen eller Hundfjället' },
  { vem: 'Nybörjare', var: 'Högfjället eller Lindvallen' },
  { vem: 'Vill åka brant', var: 'Tandådalen eller Hundfjället' },
  { vem: 'Kompisgäng med afterski', var: 'Högfjället' },
  { vem: 'Snowpark', var: 'Kläppen eller Tandådalen' },
  { vem: 'Utanför SkiStar', var: 'Stöten eller Kläppen' },
]

const OMRADEN = [
  {
    namn: 'Lindvallen',
    agare: 'SkiStar',
    passar: 'Barnfamiljer och nybörjare. SkiStar kallar området ett av Europas största för barn och nybörjare, med Valleberget, rullband och skidskola intill Experiums badhus.',
    nackdel: 'Lite för den som vill åka brant: Lindvallen och Högfjället har tillsammans 3 km svår pist av 42.',
    tal: 'Med Högfjället: 42 km pist, 58 liftar, 579–887 m.',
    kalla: 'https://www.skistar.com/en/ski-destinations/salen/winter-in-salen/ski-areas/lindvallen/',
  },
  {
    namn: 'Högfjället',
    agare: 'SkiStar',
    passar: 'Nybörjare och vuxna sällskap. Mest gröna och blå backar, afterski vid Högfjällshotellet, och ett eget områdespass från 295 kr om dagen.',
    nackdel: 'Minst av områdena, med 6 liftar och 9 backar, och ingen snowpark. Mer åkning kräver liften över till Lindvallen.',
    tal: 'Räknas ihop med Lindvallen, se ovan.',
    kalla: 'https://www.skistar.com/en/ski-destinations/salen/winter-in-salen/ski-areas/hogfjallet/',
  },
  {
    namn: 'Tandådalen',
    agare: 'SkiStar',
    passar: 'Familjer där någon vill utvecklas. Backar från grönt till svart, SkiStars snowpark i Östra Tandådalen och ett lugnare barnområde där.',
    nackdel: 'SkiStar nämner ingen afterski här. Den som vill ut på kvällen får ta bussen.',
    tal: 'Med Hundfjället: 45 km pist, varav 12 km svår, 48 liftar, 572–872 m.',
    kalla: 'https://www.skistar.com/en/ski-destinations/salen/winter-in-salen/ski-areas/tandadalen/',
  },
  {
    namn: 'Hundfjället',
    agare: 'SkiStar',
    passar: 'Familjer med små barn som också vill ha brant åkning i närheten. Trollskogen och barnområdet vid Trollbäckstorget, och Väggen, en av Sveriges brantaste backar.',
    nackdel: 'SkiStar beskriver ingen afterski här. Den som vill ut på kvällen får åka till Lindvallen eller Högfjället.',
    tal: 'Räknas ihop med Tandådalen, se ovan.',
    kalla: 'https://www.skistar.com/en/ski-destinations/salen/winter-in-salen/ski-areas/hundfjallet/',
  },
  {
    namn: 'Stöten',
    agare: 'Eget bolag, eget liftkort',
    passar: 'Familjer som vill ha en egen anläggning utanför SkiStar. Skidskola från 3 år, barnklubb för 3–8 år, och en ny sexstolslift vid Skidtorget till vintern 2026/27.',
    nackdel: 'Mest lätt åkning: 32,5 av 42,5 km pist är lätta. SkiPass gäller inte här.',
    tal: '42,5 km pist, 27 liftar, 438–830 m.',
    kalla: 'https://www.stoten.se/en/skiing-stoten/',
  },
  {
    namn: 'Kläppen',
    agare: 'Familjeägt, eget liftkort',
    passar: 'Familjer med små barn och den som vill åka park. Barn till och med 7 år åker gratis, Kläppen Snowpark är nationalarena för freeski och snowboard, och här finns Sälens enda gondol.',
    nackdel: 'Lägst och minst: 26 km pist och toppen på 655 m. SkiPass gäller inte här.',
    tal: '26 km pist, 22 liftar, 340–655 m.',
    kalla: 'https://www.klappen.se/en/skiing/',
  },
]

export default function VarBoISalen() {
  const salen = { slug: 'salen', name: 'Sälen' }

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>
      <SiteHeader />

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '108px clamp(20px, 5vw, 32px) 100px' }}>
        <h1 style={{ ...rubrik('clamp(36px, 6vw, 58px)'), lineHeight: 1.02, marginBottom: 20 }}>
          Var ska man bo i Sälen?
        </h1>

        <p style={{ ...brod, margin: '0 0 14px' }}>
          Sälen är sex skidområden, inte ett. SkiStars fyra, Lindvallen, Högfjället,
          Tandådalen och Hundfjället, delar liftkort och skibuss. Stöten och Kläppen är
          egna anläggningar med egna liftkort. Var du bor avgör alltså både vilka backar du
          har utanför dörren och vilket liftkort som gäller.
        </p>

        {/* ── Kort svar ── */}
        <div style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)', margin: '28px 0 12px' }}>
          <h2 style={{ ...etikett, margin: '0 0 14px' }}>Kort svar</h2>
          <div style={{ display: 'grid', gap: 8 }}>
            {KORT_SVAR.map((rad) => (
              <div key={rad.vem} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 0.8fr) 1.2fr', gap: 12 }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{rad.vem}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: '#f0ece4' }}>{rad.var}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Områdena ── */}
        <h2 style={{ ...rubrik('clamp(26px, 4vw, 34px)'), marginTop: 44 }}>Områdena ett och ett</h2>
        {OMRADEN.map((o) => (
          <section key={o.namn} style={{ ...kort, padding: 'clamp(20px, 4vw, 28px)', marginBottom: 12 }}>
            <div style={etikett}>{o.agare}</div>
            <h3 style={{ ...rubrik(28), margin: '6px 0 12px' }}>{o.namn}</h3>
            <p style={{ ...brod, fontSize: 15, margin: '0 0 10px' }}>
              <strong style={{ color: '#f0ece4', fontWeight: 500 }}>Passar: </strong>{o.passar}
            </p>
            <p style={{ ...brod, fontSize: 15, margin: '0 0 10px' }}>
              <strong style={{ color: '#f0ece4', fontWeight: 500 }}>Nackdel: </strong>{o.nackdel}
            </p>
            <p style={{ ...brod, fontSize: 13.5, margin: 0, color: 'rgba(255,255,255,0.55)' }}>
              {o.tal}{' '}
              <a href={o.kalla} rel="noopener" style={{ color: ACCENT }}>Källa</a>
            </p>
          </section>
        ))}

        {/* ── Liftkortet ── */}
        <h2 style={{ ...rubrik('clamp(26px, 4vw, 34px)'), marginTop: 44 }}>Liftkortet</h2>
        <p style={{ ...brod, margin: '0 0 14px' }}>
          SkiStars SkiPass gäller i alla fyra SkiStar-områden, och skibussen mellan dem är
          gratis med giltigt kort (<a href={KALLOR.skipass} rel="noopener" style={{ color: ACCENT }}>SkiStar</a>,{' '}
          <a href={KALLOR.skibuss} rel="noopener" style={{ color: ACCENT }}>skibussen</a>). Ett
          veckokort för en vuxen kostar 3 126 kr under sportlovet 2027, drygt 7 % mer än
          året innan (<a href={KALLOR.efn} rel="noopener" style={{ color: ACCENT }}>EFN</a>).
        </p>
        <p style={{ ...brod, margin: '0 0 14px' }}>
          Stöten och Kläppen säljer egna kort, och SkiPass gäller inte där. Bor du i Stöten
          och vill prova Lindvallen köper du alltså två kort.
        </p>
        <p style={{ ...brod, fontSize: 14.5, margin: 0, color: 'rgba(255,255,255,0.57)' }}>
          Näsfjället finns kvar på kartor men är inte med här. Bolaget gick i konkurs 2021,
          och i mars 2026 fanns ingen köpare (<a href={KALLOR.nasfjallet} rel="noopener" style={{ color: ACCENT }}>SVT</a>).
        </p>

        {/* ── Boende ── */}
        <div style={{ ...kort, padding: 'clamp(20px, 4vw, 30px)', marginTop: 36 }}>
          <h2 style={{ ...etikett, margin: '0 0 12px' }}>Boende i Sälen</h2>
          <Partnerlank
            sid="var-bo-i-salen-boende-salen"
            sok={{ destination: bookingSok(salen) }}
            markning="kompakt"
            style={{ display: 'inline-block', background: BOOKING_BLA, borderRadius: 8, padding: '12px 16px', textDecoration: 'none' }}
          >
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: '#fff' }}>Sök boende i Sälen på Booking.com →</span>
          </Partnerlank>
        </div>

        <p style={{ ...brod, fontSize: 14.5, margin: '36px 0 8px' }}>
          Mer om Sälen: <Link href="/resort/salen" style={{ color: ACCENT }}>ortsidan</Link>,{' '}
          <Link href="/jamfor/are-vs-salen" style={{ color: ACCENT }}>Åre eller Sälen</Link>,{' '}
          <Link href="/jamfor/salen-vs-trysil" style={{ color: ACCENT }}>Sälen eller Trysil</Link>,{' '}
          <Link href="/salen-eller-alperna" style={{ color: ACCENT }}>Sälen eller Alperna</Link> och{' '}
          <Link href="/sportlov" style={{ color: ACCENT }}>sportlovet</Link>. Andra orter
          för barn står i <Link href="/skidorter-for-barnfamiljer" style={{ color: ACCENT }}>skidorter för barnfamiljer</Link>.
        </p>
        <p style={{ ...brod, fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
          Pisttalen kommer från skiresort.com, samma källa som resten av sajten{' '}
          (<a href={KALLOR.lindvallenHogfjallet} rel="noopener" style={{ color: ACCENT }}>Lindvallen/Högfjället</a>,{' '}
          <a href={KALLOR.tandadalenHundfjallet} rel="noopener" style={{ color: ACCENT }}>Tandådalen/Hundfjället</a>).
          Där redovisas SkiStars fyra områden som två par, därför står talen per par.
          Beskrivningarna bygger på områdenas egna sidor. Hämtat 17 november 2026.
        </p>
      </main>

      <SiteFooter />
    </div>
  )
}
