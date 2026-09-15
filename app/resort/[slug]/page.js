import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { farOptimeras } from '../../../lib/images'
import { PLANERAREN_SYNLIG } from '../../../lib/features'
import SiteHeader from '../../SiteHeader'
import SiteFooter from '../../SiteFooter'
import { getResort, getResorts, getResortSlugs } from '../../../lib/resorts'
import { bookingUrl } from '../../../lib/booking'
import { getLang, SITE_URL } from '../../../lib/lang'
import { manadVersal } from '../../../lib/months'
import { pris } from '../../../lib/pris'
import { hamtaKurser, skrivDatum } from '../../../lib/valuta'
import { arNordisk, motparten, naraOrter, parFor } from '../../../lib/jamfor'
import { alpsidaFor, NATTAG_SASONG } from '../../../lib/ellerAlperna'
import { nattagFor, restidText, sasongenSlut, stationFor } from '../../../lib/nattaget'
import { restid } from '../../../lib/travel'
import { linjeMeningar, linjerFor } from '../../../lib/restider'
import { land } from '../../../lib/countries'
import { OMFATTNING, REFERENSVECKA, VERIFIERADE, harPris, UTAN_PRIS } from '../../../lib/liftkortspriser'
import { vanligaFragor } from '../../../lib/vanligaFragor'
import { getOrtbilder } from '../../../lib/ortbilder'
import { kreditering } from '../../../lib/kreditering'
import Bildgalleri from './Bildgalleri'

// Ortsidorna genereras statiskt vid bygget och byggs om en gång i timmen.
// Möjligt först sedan rotlayouten slutade läsa request-headers (se lib/lang.js).
export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getResortSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const slug = (await params).slug
  const resort = await getResort(slug)

  if (!resort) {
    return { title: 'Skidorten hittades inte — Alpkoll' }
  }

  const baseUrl = SITE_URL
  const place = `${resort.name}, ${land(resort.country)}`

  // "Snögaranti" betyder i svensk resebransch pengarna tillbaka. Den
  // synliga etiketten rättades tidigare, men beskrivningen — den text
  // Google visar — missades och stod kvar på alla 32 ortsidor.
  // Beskrivningen är det Google visar och ska tala samma språk som sidan.
  // Veckopasset stod i euro medan sidan numera skriver kronor.
  //
  // Vad taggarna bär är uppmätt, inte antaget. Search Console 8 september
  // 2026, sajtens första sex veckor i indexet: prisfrågor 151 exponeringar,
  // fallhöjdsfrågor 59 — och noll klick på båda. Fallhöjden stod elva
  // gånger på sidan och inte en gång i taggen, dagskortet inte alls, och
  // "Snösäkerhet 6/10" avslutade beskrivningen utan att matcha en enda
  // fråga. Beskrivningen väger inte på position, bara på om någon som
  // redan ser sidan klickar. Titeln väger på båda — därför står sökorden
  // där också.
  const kurser = await hamtaKurser()

  // Samma spärr som /liftkortspriser. Sju orter bär tal i databasen som
  // aldrig hämtats ur ortens egen prislista, och just de talen får inte
  // stå i det Google visar — se lib/liftkortspriser.js. Därför lovar
  // titeln inte heller ett liftkortspris för de orterna.
  const prisAttVisa = harPris(resort)
  const valutan = resort.lift_pass_currency || 'EUR'
  const dagspass = prisAttVisa ? pris(resort.lift_pass_day_eur, valutan, kurser) : null
  const veckopass = prisAttVisa ? pris(resort.lift_pass_week_eur, valutan, kurser) : null

  const title = prisAttVisa
    ? `${place} — fallhöjd, pist och liftkortspris | Alpkoll`
    : `${place} — fallhöjd, pist och snö | Alpkoll`

  const fallhojd = resort.altitude_top - resort.altitude_base
  const liftkortet = [
    dagspass ? `${dagspass.kr}/dag` : null,
    veckopass ? `${veckopass.kr} för sex dagar` : null,
  ].filter(Boolean).join(', ')

  const description = `${resort.name}: ${fallhojd} m fallhöjd, ${resort.total_pistes_km} km pist, ${resort.total_lifts} liftar.${liftkortet ? ` Liftkort ${liftkortet}.` : ''} ${resort.altitude_base}–${resort.altitude_top} m, flygplats ${resort.nearest_airport}.`

  const path = `/resort/${resort.slug}`

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}${path}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}${path}`,
      siteName: 'Alpkoll',
      type: 'article',
      locale: 'sv_SE',
      images: resort.image_url
        ? [{ url: resort.image_url, width: 1200, height: 630, alt: resort.name }]
        : ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: resort.image_url ? [resort.image_url] : ['/og-image.png'],
    },
  }
}

export default async function ResortPage({ params }) {
  const slug = (await params).slug
  const resort = await getResort(slug)

  if (!resort) notFound()

  const lang = getLang()
  const verticalDrop = resort.altitude_top - resort.altitude_base
  const estimatedTransferMins = restid(resort)

  const mapsUrl = `https://www.google.com/maps?q=${resort.latitude},${resort.longitude}`
  const mapsEmbedUrl = `https://maps.google.com/maps?q=${resort.latitude},${resort.longitude}&z=12&output=embed`
  // Affiliate-länkar med separata labels så Partner Hub visar vilken
  // placering som faktiskt konverterar.
  const heroImageUrl = resort.image_url
    || 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200'

  // Bilderna ur resort_images: position 0 är hjältebilden, resten galleriet.
  // Migration 025 satte image_url till samma adress som position 0, men
  // krediteringen läggs bara på hjältebilden när adresserna faktiskt är
  // desamma — annars hade en fotograf kunnat stå under någon annans bild.
  const bilder = await getOrtbilder(resort.slug)
  const hjalte = bilder[0]?.position === 0 && bilder[0].url === resort.image_url ? bilder[0] : null
  const galleri = bilder.filter((b) => b.position > 0)

  const bookingDestination = resort.accommodation_zone || resort.name
  const bookingHrefMobile = bookingUrl(bookingDestination, { lang, label: `resort-mobile-${resort.slug}` })
  const bookingHrefStay = bookingUrl(bookingDestination, { lang, label: `resort-stay-${resort.slug}` })
  const bookingHrefSidebar = bookingUrl(bookingDestination, { lang, label: `resort-sidebar-${resort.slug}` })

  // Priserna visas i kronor med ortens eget belopp inom parentes — sajten
  // är svensk och läsaren ska slippa räkna om i huvudet. Omräkningen sker
  // mot ECB:s dagskurs, se lib/valuta.js.
  //
  // Här stod förut också en veckokostnad ur est_weekly_cost_eur. Den är
  // borta ur hela sajten: fältet var aldrig hämtat någonstans ifrån. Alla
  // trettio värdena var delbara med femtio, trettio orter delade på sexton
  // tal, och fyra orter bar en veckokostnad utan att ha något känt
  // liftkortspris alls. Se migration 024 för hela underlaget.
  const kurser = await hamtaKurser()
  const valuta = resort.lift_pass_currency || 'EUR'

  // Samma spärr som /liftkortspriser och som taggarna. Sju orter bär tal
  // i databasen som aldrig hämtats ur en prislista, och ortsidan skrev ut
  // dem ändå: Ruka stod som "släpps 2 oktober" i prislistan och som
  // "Veckokort ca 3 150 kr" här. Ett rättat Ischgl bredvid ett orättat
  // Ruka är sämre än två gamla tal — så priserna visas nu på samma villkor
  // överallt, och där de saknas står skälet i stället för ett streck.
  const prisAttVisa = harPris(resort)
  const dagskort = prisAttVisa ? pris(resort.lift_pass_day_eur, valuta, kurser) : null
  const veckokort = prisAttVisa ? pris(resort.lift_pass_week_eur, valuta, kurser) : null
  const utanPris = prisAttVisa ? null : UTAN_PRIS[resort.slug]

  // Vad talet betyder, inte varför vi saknar ett annat tal. Rutan sade
  // förut att resa och boende varierar för mycket för att sätta en siffra
  // på — en ursäkt för något som inte står på sidan, och som besökaren
  // aldrig frågat efter. Det som faktiskt behövs för att förstå 3 744 kr
  // är vad kortet omfattar och vilken säsong det gäller.
  //
  // Säsongen är inte en detalj. Fyra orter bär 25/26-priser därför att de
  // inte publicerat nästa säsong — st-anton, madonna-di-campiglio, geilo
  // och riksgransen. /liftkortspriser märker ut dem med en etikett per
  // rad; ortsidan gjorde det inte alls, och visade alltså förra årets
  // pris som om det vore årets.
  const prismeta = prisAttVisa ? VERIFIERADE[resort.slug] : null
  const sasongen =
    prismeta?.sasong === '26/27' ? 'Säsongen 2026/2027.'
      : prismeta?.sasong === '25/26' ? 'Säsongen 2025/2026.'
        : null

  /** Sant när kronbeloppet är omräknat ur en annan valuta och alltså avrundat. */
  const omraknat = Boolean(dagskort?.ursprung || veckokort?.ursprung)

  /** "ca 5 150 kr (469 €)" som ren sträng, för rutor utan egen styling. */
  const rakt = (p) => (p ? (p.ursprung ? `${p.kr} (${p.ursprung})` : p.kr) : '—')

  // Jämförelserna orten förekommer i. Utan det här blocket nås
  // /jamfor-sidorna bara från väljaren och sitemapen, och ortsidan
  // förblir den återvändsgränd den varit sedan sajten byggdes: du står
  // på Åre-sidan och det finns ingen väg vidare till Åre mot Sälen.
  //
  // Talen står med i länken så att den säger något innan man klickar.
  // Samma två som på korten i väljaren, av samma skäl.
  const allaOrter = await getResorts()
  const jamforelser = parFor(resort.slug, allaOrter.map((r) => r.slug))
    .map((par) => ({ par, annan: allaOrter.find((r) => r.slug === motparten(par, resort.slug)) }))
    .filter((x) => x.annan)

  const jamforGrupper = [
    { rubrik: 'I Norden', par: jamforelser.filter((x) => arNordisk(x.annan)) },
    { rubrik: 'I Alperna', par: jamforelser.filter((x) => !arNordisk(x.annan)) },
  ].filter((g) => g.par.length > 0)

  // Sex ortsidor att gå vidare till. Skilt från jämförelserna ovan: de
  // länkar till /jamfor-sidor, det här till andra ortsidor. Det är den
  // kanten som saknades i länkgrafen — se naraOrter i lib/jamfor.js.
  const nara = naraOrter(resort, allaOrter)

  // Åre och Sälen har en egen sida mot Alperna som helhet. Den är sajtens
  // enda ingång till frågan besökaren faktiskt ställer före bokningen.
  const alpsida = alpsidaFor(resort.slug)

  // Nattågsrutan visas bara för de orter tåget faktiskt går till, och bara
  // under säsongen. Efter 14 mars vore en tidtabell på en ortsida ett
  // påstående om ett tåg som inte går — se lib/nattaget.js.
  const nattag = sasongenSlut() ? null : nattagFor(resort.slug)

  // Tågen till de svenska orterna, med operatören utskriven. Åre har två
  // nattåg från Stockholm, och sidan beskrev dem förut som ett — se
  // lib/restider.js. Linjerna faller bort när deras sista dag passerat.
  const taglinjer = linjerFor(resort.slug)

  // Frågorna som når sidan i Search Console, besvarade ur samma fält som
  // sifferrutorna — se lib/vanligaFragor.js.
  const fragor = vanligaFragor(resort, allaOrter, kurser)

  const scores = [
    // "Snögaranti" betyder i svensk resebransch ett avtalsvillkor —
    // pengarna tillbaka om snön uteblir. Poängen är en bedömning av
    // sannolikhet, inte en utfästelse.
    { label: 'Snösäkerhet',          value: resort.snow_guarantee_score,  color: '#60a5fa' },
    { label: 'Mellannivå',           value: resort.intermediate_score,    color: '#34d399' },
    { label: 'Avancerad nivå',       value: resort.expert_score,          color: '#a78bfa' },
    { label: 'Nybörjarnivå',         value: resort.beginner_score,        color: '#4ade80' },
    { label: 'Offpist',              value: resort.off_piste_score,       color: '#D4A574' },
    { label: 'Snowpark',             value: resort.snowpark_score,        color: '#f472b6' },
    { label: 'Bykänsla',             value: resort.village_charm_score,   color: '#fbbf24' },
    { label: 'Afterski',             value: resort.apres_ski_score,       color: '#fb923c' },
    { label: 'Familjevänligt',       value: resort.family_friendly_score, color: '#2dd4bf' },
    // Högt crowd_score betyder FÄRRE människor. Etiketten måste peka åt
    // samma håll som skalan — "Trängsel 9/10" hade sagt tvärtom.
    { label: 'Gott om plats',        value: resort.crowd_score,           color: '#e879f9' },
  ]

  const card = {
    background: '#1c1a17',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 10,
  }

  const sectionTitle = {
    fontFamily: 'var(--font-heading)', fontSize: 22,
    color: '#f0ece4', letterSpacing: '0.04em', marginBottom: 20,
  }

  const fieldLabel = {
    fontFamily: 'var(--font-body)', fontSize: 10,
    color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase',
    letterSpacing: '0.08em', marginBottom: 5,
  }

  const fieldValue = {
    fontFamily: 'var(--font-body)', fontSize: 14,
    fontWeight: 500, color: '#f0ece4',
  }

  const erbjudanden = harPris(resort)
    ? [
        { namn: 'Dagskort', belopp: resort.lift_pass_day_eur },
        { namn: 'Liftkort sex dagar', belopp: resort.lift_pass_week_eur },
      ]
        .filter((p) => Number.isFinite(p.belopp))
        .map((p) => ({
          '@type': 'Offer',
          name: p.namn,
          price: p.belopp,
          priceCurrency: valuta,
          category: 'Liftkort',
          url: `${SITE_URL}/resort/${resort.slug}`,
        }))
    : []

  // Strukturerad data för Google. Medvetet utan aggregateRating —
  // poängen är vår egen redaktionella bedömning, inte användarbetyg,
  // och att presentera den som betyg vore missvisande.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SkiResort',
    name: resort.name,
    description: resort.notes || undefined,
    url: `${SITE_URL}/resort/${resort.slug}`,
    image: bilder.length ? bilder.map((b) => b.url) : resort.image_url || undefined,
    sameAs: resort.resort_url || undefined,
    address: {
      '@type': 'PostalAddress',
      addressRegion: resort.region || undefined,
      // Strukturerad data läses av maskiner, inte av besökare — här ska
      // det engelska landsnamnet stå kvar.
      addressCountry: resort.country || undefined,
    },
    geo:
      resort.latitude && resort.longitude
        ? {
            '@type': 'GeoCoordinates',
            latitude: resort.latitude,
            longitude: resort.longitude,
            elevation: resort.altitude_base,
          }
        : undefined,
    // Liftkortet i maskinläsbar form. Beloppen står i ortens egen valuta
    // och med källans exakta tal — kronorpriset på sidan är en omräkning
    // som dessutom avrundas till närmaste femtio för alporterna, och ett
    // avrundat tal hör inte hemma i data som läses som fakta. Sidan visar
    // originalet inom parentes, så talen går att känna igen.
    //
    // Samma spärr som beskrivningen: bara priser vi kan belägga. De sju
    // orter som saknar hämtat pris får ingen Offer alls hellre än en med
    // ett tal ur databasen som ingen prislista stöder.
    makesOffer: erbjudanden.length ? erbjudanden : undefined,
  }

  // Frågorna i maskinläsbar form, med exakt samma svarstext som syns på
  // sidan. Länkarna står bara i den synliga versionen.
  const fragorLd = fragor.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: fragor.map((f) => ({
          '@type': 'Question',
          name: f.fraga,
          acceptedAnswer: { '@type': 'Answer', text: f.svar },
        })),
      }
    : null

  return (
    <div style={{ background: '#121110', minHeight: '100vh', color: '#f0ece4' }}>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {fragorLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(fragorLd) }}
        />
      )}

      <style>{`
        .resort-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 48px;
          align-items: start;
        }
        .resort-sidebar {
          position: sticky;
          top: 84px;
        }
        .resort-sidebar-mobile-cta {
          display: none;
        }
        @media (max-width: 768px) {
          .resort-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .resort-sidebar {
            display: none;
          }
          .resort-sidebar-mobile-cta {
            display: block;
            margin-bottom: 48px;
          }
          .hero-stat-pills {
            gap: 6px;
          }
          .hero-stat-pills > div {
            padding: 6px 10px;
          }
        }
      `}</style>

      <SiteHeader />

      {/* ── Hero ── */}
      <div style={{ position: 'relative', height: '75vh', minHeight: 520, overflow: 'hidden' }}>
        {/* Hjältebilden är sidans LCP-element. Den optimeras när källan
            får kopieras — se lib/images.js. */}
        {farOptimeras(heroImageUrl) ? (
          <Image
            src={heroImageUrl}
            alt={hjalte?.alt || resort.name}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          />
        ) : (
          <img
            src={heroImageUrl}
            alt={hjalte?.alt || resort.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
          />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(18,17,16,0.3) 0%, rgba(18,17,16,0.1) 35%, rgba(18,17,16,0.9) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(18,17,16,0.5) 0%, transparent 60%)' }} />

        <div style={{ position: 'absolute', top: 80, left: 'clamp(24px, 4vw, 64px)' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}>← Alla skidorter</Link>
        </div>

        {/* Hjältebildens kreditering, uppe till höger där den inte krockar
            med sifferrutorna. Licenser som CC BY kräver att fotografen
            namnges där bilden visas. */}
        {hjalte && (
          <a href={hjalte.source_page} target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', top: 84, right: 'clamp(24px, 4vw, 64px)', maxWidth: '45%', textAlign: 'right', fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}>
            {kreditering(hjalte)}
          </a>
        )}

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 clamp(24px, 4vw, 64px) 48px' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, color: '#D4A574', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>{resort.region} · {land(resort.country)}</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(40px, 8vw, 88px)', fontWeight: 400, lineHeight: 0.95, color: '#f0ece4', letterSpacing: '0.02em', marginBottom: 24 }}>{resort.name}</h1>

          <div className="hero-stat-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              { label: 'Lägsta',     value: `${resort.altitude_base} m` },
              { label: 'Högsta',     value: `${resort.altitude_top} m` },
              { label: 'Fallhöjd',   value: `${verticalDrop} m` },
              { label: 'Pist',       value: `${resort.total_pistes_km} km` },
              { label: 'Liftar',     value: resort.total_lifts },
              // Prisrutorna faller bort helt för de orter vi inte har ett
              // hämtat pris för, i stället för att visa "—". Ett streck i
              // hjältebilden ser ut som saknad data i en tabell som annars
              // är full; skälet står i prissektionen längre ner.
              ...(dagskort ? [{ label: 'Dagskort', value: dagskort.kr }] : []),
              ...(veckokort ? [{ label: 'Veckokort', value: veckokort.kr }] : []),
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(18,17,16,0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '8px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: 17, color: '#f0ece4', lineHeight: 1 }}>{s.value}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'rgba(255,255,255,0.54)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px clamp(24px, 4vw, 40px) 120px' }}>

        {/* Mobile-only CTA — shows above content on small screens */}
        <div className="resort-sidebar-mobile-cta">
          {PLANERAREN_SYNLIG && (
            <div style={{ background: 'rgba(212,165,116,0.07)', border: '1px solid rgba(212,165,116,0.2)', borderRadius: 12, padding: '22px', marginBottom: 12 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500, color: '#D4A574', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>Redo att åka?</p>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: '#f0ece4', letterSpacing: '0.03em', marginBottom: 18 }}>{resort.name}</p>
              <Link href="/plan" style={{ display: 'block', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#121110', background: '#D4A574', borderRadius: 6, padding: '14px 24px', textDecoration: 'none' }}>Planera resan →</Link>
            </div>
          )}
          <a href={bookingHrefMobile} target="_blank" rel="noopener noreferrer sponsored" style={{ display: 'block', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: '#fff', background: '#003580', borderRadius: 6, padding: '12px 24px', textDecoration: 'none', letterSpacing: '0.04em' }}>Hitta boende på Booking.com →</a>
        </div>

        <div className="resort-grid">

          {/* ── Left column ── */}
          <div>

            {resort.notes && (
              <div style={{ background: 'rgba(212,165,116,0.06)', border: '1px solid rgba(212,165,116,0.15)', borderLeft: '3px solid #D4A574', borderRadius: '0 10px 10px 0', padding: '16px 20px', marginBottom: 48 }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0 }}>{resort.notes}</p>
              </div>
            )}

            {/* ── Bilder ──
                Direkt efter beskrivningen: det är där känslan av platsen
                hör hemma, före siffrorna. Se Bildgalleri.js. */}
            <Bildgalleri bilder={galleri} ortnamn={resort.name} />

            {/* Snow & conditions */}
            <div style={{ marginBottom: 48 }}>
              <h2 style={sectionTitle}>Snö och förhållanden</h2>
              {/* Tre rutor, inte fyra. Snöfallet togs bort och ingenting
                  ersatte det — höjden står redan i stapeln strax nedanför
                  och i sammanfattningen, och ett upprepat tal är inte
                  bättre än ett tal vi inte kan belägga. auto-fit håller
                  raden jämn på både tre och två kolumner. */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginBottom: 16 }}>
                {[
                  { label: 'Säsongen öppnar',  value: manadVersal(resort.season_start_month) || '—' },
                  { label: 'Säsongen stänger', value: manadVersal(resort.season_end_month) || '—' },
                  // "Bäst i" stod här och läste best_months_nums, som är
                  // exakt januari–mars för 29 av 32 orter. Det var ett
                  // standardvärde som såg ut som ett omdöme om orten.
                  // Konstsnötäckningen skiljer däremot orterna åt på
                  // riktigt — 0 % i Riksgränsen, 95 % i Madonna di
                  // Campiglio — och hör hemma under snö och förhållanden.
                  { label: 'Konstsnö',         value: Number.isFinite(resort.snowmaking_coverage_pct) ? `${resort.snowmaking_coverage_pct} % av pisten` : '—' },
                  // "Snöfall per säsong" stod här och läste avg_snowfall_cm.
                  // Fältet är hämtat 2026-08-12: skiresort.com — sajtens enda
                  // källa — bär ingen säsongssiffra alls, bara aktuellt
                  // snödjup. Kontrollerat på både en alport och en nordisk
                  // ort. Talen kan alltså inte komma därifrån, och
                  // fördelningen bekräftar det: alla 30 publicerade värden
                  // delbara med tio, elva unika tal bland trettio. Samma
                  // signatur som pistfördelningen hade före migration 013.
                  //
                  // Snösäkerheten står kvar som poäng längre ner, och
                  // höjdstapeln nedanför säger samma sak med tal vi kan
                  // belägga. Ingen ruta ersätter den borttagna.
                ].map(item => (
                  <div key={item.label} style={{ ...card, padding: '14px 16px' }}>
                    <div style={fieldLabel}>{item.label}</div>
                    <div style={fieldValue}>{item.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ ...card, padding: '18px 20px' }}>
                <div style={fieldLabel}>Höjd och fallhöjd</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginTop: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.min(resort.altitude_top / 40, 100)}%`, background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#f0ece4', minWidth: 48 }}>{resort.altitude_top}m</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.min(resort.altitude_base / 40, 100)}%`, background: 'rgba(255,255,255,0.2)', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.61)', minWidth: 48 }}>{resort.altitude_base}m</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 28, color: '#60a5fa', lineHeight: 1 }}>{verticalDrop}m</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>fallhöjd</div>
                  </div>
                </div>
                {/* Här stod en mening som räknades fram ur toppens höjd, och
                    den sade emot sidan på fyra sätt. Kitzbühel (2 000 m) fick
                    "god snösäkerhet" medan ortstexten säger att snön är osäker.
                    Alpe d'Huez fick "pålitlig hela säsongen" medan texten säger
                    opålitlig i mars. Riksgränsen fick "kom i januari" fast orten
                    öppnar i februari. Och alla elva orter över 3 000 m fick
                    "åkning på glaciär", även Courchevel och Méribel. Toppens
                    höjd säger inte hur snön är i byn. Stapeln visar talen;
                    snösäkerheten står som poäng längre ner. */}
              </div>
            </div>

            {/* Terrain */}
            <div style={{ marginBottom: 48 }}>
              <h2 style={sectionTitle}>Terräng</h2>

              {/* Utan den här raden ser tre orter i Les 3 Vallées ut att ha
                  identiska siffror av misstag. Se migration 004. */}
              {resort.ski_area && (
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: 12,
                  color: 'rgba(255,255,255,0.57)', lineHeight: 1.6,
                  margin: '-12px 0 18px',
                }}>
                  Pist, liftar och höjder avser hela{' '}
                  <span style={{ color: '#D4A574' }}>{resort.ski_area}</span> — området
                  du kommer åt med liftkortet, inte bara {resort.name}.
                </p>
              )}

              <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
                <div style={{ width: `${resort.blue_percent}%`, background: '#3b82f6' }} />
                <div style={{ width: `${resort.red_percent}%`, background: '#ef4444' }} />
                <div style={{ width: `${resort.black_percent}%`, background: 'rgba(255,255,255,0.5)' }} />
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                {[
                  { label: 'Blå', pct: resort.blue_percent, color: '#3b82f6' },
                  { label: 'Röd', pct: resort.red_percent, color: '#ef4444' },
                  { label: 'Svart', pct: resort.black_percent, color: 'rgba(255,255,255,0.6)' },
                ].map(t => (
                  <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: t.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.61)' }}>{t.label}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: '#f0ece4' }}>{t.pct}%</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Pist totalt',    value: `${resort.total_pistes_km} km` },
                  { label: 'Fallhöjd',       value: `${verticalDrop} m` },
                  { label: 'Antal liftar',   value: resort.total_lifts },
                  { label: 'Liftkapacitet',  value: resort.lift_capacity_per_hour ? `${resort.lift_capacity_per_hour.toLocaleString('sv-SE')} personer/tim` : '—' },
                  { label: 'Offpist',        value: `${resort.off_piste_score}/10` },
                  { label: 'Snowpark',       value: `${resort.snowpark_score}/10` },
                ].map(item => (
                  <div key={item.label} style={{ ...card, padding: '14px 16px' }}>
                    <div style={fieldLabel}>{item.label}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500, color: '#f0ece4' }}>{item.value}</div>
                  </div>
                ))}
              </div>
              <a href={resort.piste_map_url || resort.resort_url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: 16, textDecoration: 'none', background: '#1c1a17', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
                <svg viewBox="0 0 400 80" style={{ position: 'absolute', bottom: 0, right: 0, width: '55%', opacity: 0.04, pointerEvents: 'none' }}>
                  <path d="M400,80 L400,35 L350,10 L310,30 L280,5 L240,28 L210,15 L170,38 L130,20 L100,40 L60,25 L30,45 L0,35 L0,80 Z" fill="#D4A574" />
                </svg>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, position: 'relative' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0, background: 'rgba(212,165,116,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A574" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                      <line x1="8" y1="2" x2="8" y2="18" />
                      <line x1="16" y1="6" x2="16" y2="22" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 16, color: '#f0ece4', letterSpacing: '0.04em', marginBottom: 4 }}>Pistkarta</div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.57)', lineHeight: 1.5, margin: '0 0 12px' }}>Se hela pistkartan för {resort.name} — alla nedfarter, liftar och fjällrestauranger på ortens officiella karta.</p>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: '#D4A574', letterSpacing: '0.04em' }}>Öppna pistkartan →</span>
                  </div>
                </div>
              </a>
            </div>

            {/* Resort scores */}
            <div style={{ marginBottom: 48 }}>
              <h2 style={sectionTitle}>Vårt omdöme</h2>
              <div style={{ ...card, padding: '20px 24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {scores.map(s => (
                    <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.61)', minWidth: 170 }}>{s.label}</span>
                      <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 2, width: `${(s.value || 0) * 10}%`, background: s.color }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: '#f0ece4', minWidth: 36, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{s.value}/10</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 32, color: resort.crowd_score >= 7 ? '#4ade80' : resort.crowd_score >= 5 ? '#fbbf24' : '#fb923c', lineHeight: 1 }}>{resort.crowd_score}/10</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: '#f0ece4', marginBottom: 2 }}>Gott om plats</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.54)', lineHeight: 1.4 }}>
                      {resort.crowd_score >= 8 ? 'Gott om plats — korta liftköer och vidöppna pister.' : resort.crowd_score >= 6 ? 'Måttlig trängsel — mest folk under högsäsong och helger.' : 'Populär ort — räkna med köer under högsäsong och skollov.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Getting there */}
            <div style={{ marginBottom: 48 }}>
              <h2 style={sectionTitle}>Ta sig dit</h2>
              <div style={{ ...card, padding: '20px 24px', marginBottom: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                  {[
                    // "Flyg till", inte "Närmaste flygplats" — fältet anger porten
                    // hit, den flygplats man faktiskt kan boka sig till från
                    // Sverige. Den geografiskt närmaste saknar ibland trafik.
                    { label: 'Flyg till',          value: resort.nearest_airport },
                    { label: 'Avstånd',            value: `${resort.airport_distance_km} km` },
                    { label: 'Ungefärlig restid',  value: estimatedTransferMins },
                    { label: 'Boendeområde',       value: resort.accommodation_zone },
                  ].map(item => (
                    <div key={item.label}>
                      <div style={fieldLabel}>{item.label}</div>
                      <div style={fieldValue}>{item.value}</div>
                    </div>
                  ))}
                </div>
                {resort.transport_info && (
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
                    {/* "Med tåg och flyg" stod över texter som mest handlade
                        om bilen. Sedan migration 029 säger texten hur man
                        reser, och bilens tider står i frågorna längre ner. */}
                    <div style={fieldLabel}>Resan dit</div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>{resort.transport_info}</p>
                  </div>
                )}
                {taglinjer.length > 0 && (
                  <div style={{ background: 'rgba(212,165,116,0.06)', border: '1px solid rgba(212,165,116,0.16)', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
                    <div style={{ ...fieldLabel, color: '#D4A574' }}>Med tåg</div>
                    {taglinjer.map((linje, i) => (
                      <p key={linje.id} style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: i === 0 ? '4px 0 0' : '10px 0 0' }}>
                        {linjeMeningar(linje).join(' ')}{' '}
                        <a href={linje.kalla} target="_blank" rel="noopener noreferrer" style={{ color: '#D4A574', textDecoration: 'none' }}>{linje.kallnamn} →</a>
                      </p>
                    ))}
                  </div>
                )}
                {/* Nattåget, för de fem orter det faktiskt går till.
                    Uppgiften stod tidigare bara på alpsidorna, som Åre och
                    Sälen länkar till — alltså aldrig på den ortsida resan
                    handlar om. Texten kommer ur lib/nattaget.js så att den
                    inte kan säga "utan byte" om en ort som kräver buss. */}
                {nattag && (
                  <div style={{ background: 'rgba(212,165,116,0.06)', border: '1px solid rgba(212,165,116,0.16)', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
                    <div style={{ ...fieldLabel, color: '#D4A574' }}>Med nattåg från Sverige</div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: '4px 0 0' }}>
                      {nattag.buss
                        ? `Snälltåget kör Malmö–Österrike ${NATTAG_SASONG}. ${nattag.station
                            ? `Kliv av i ${nattag.station} och ta transferbussen${nattag.hallplats ? `, som stannar vid ${nattag.hallplats}` : ''}.`
                            : `Sista biten går med transferbuss${nattag.hallplats ? ` till hållplatsen vid ${nattag.hallplats}` : ''}.`}`
                        : `Snälltåget kör Malmö–Österrike ${NATTAG_SASONG} och stannar i ${resort.name} — ingen flygplats, ingen buss, inget byte. Restiden från Malmö är ${restidText(stationFor(resort.slug)?.restidMin)}.`}
                      {' '}
                      <Link href="/nattaget-till-alperna" style={{ color: '#D4A574', textDecoration: 'none' }}>Tider och orter →</Link>
                    </p>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.61)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '9px 16px', textDecoration: 'none', letterSpacing: '0.04em' }}>Visa på Google Maps →</a>
                </div>
              </div>
              <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', height: 320 }}>
                <iframe src={mapsEmbedUrl} width="100%" height="320" style={{ border: 0, display: 'block' }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </div>

            {/* Where to stay */}
            <div style={{ marginBottom: 48 }}>
              <h2 style={sectionTitle}>Var du bor</h2>
              <div style={{ ...card, padding: '20px 24px', marginBottom: 10 }}>
                <div style={{ marginBottom: resort.where_to_stay ? 16 : 0 }}>
                  <div style={fieldLabel}>Boendeområde</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: '#f0ece4', marginBottom: resort.where_to_stay ? 16 : 0 }}>{resort.accommodation_zone}</div>
                </div>
                {resort.where_to_stay && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>{resort.where_to_stay}</p>
                )}
              </div>
              <a href={bookingHrefStay} target="_blank" rel="noopener noreferrer sponsored" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#003580', borderRadius: 10, padding: '18px 22px', textDecoration: 'none' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 3 }}>Hitta boende nära {resort.name}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Sök boende på Booking.com →</div>
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: '#fff', letterSpacing: '0.06em', flexShrink: 0, marginLeft: 16 }}>booking.com</div>
              </a>
            </div>

            {/* What it costs */}
            <div style={{ marginBottom: 48 }}>
              {/*
                Rubriken hette "Vad det kostar" och innehöll varken ordet
                liftkort eller ortens namn. Frågorna som når sidan gör
                det: "liftkort sälen pris", "vad kostar liftkort i sälen",
                "liftkort hemsedal pris", "sälen skipass pris". En rubrik
                som bär samma ord som frågan är det ortsidan har och som
                den generella prislistan aldrig kan få — den sidan har
                noll exponeringar på sex månader just för att den svarar
                på en fråga ingen ställer.
              */}
              <h2 style={sectionTitle}>Liftkort och priser i {resort.name}</h2>
              <div style={{ ...card, padding: '20px 24px' }}>
                {prisAttVisa ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                    {[
                      // Prisklass läste price_tier, vars klasser överlappar:
                      // klass 1 spänner 900–1 550 € och klass 3 spänner
                      // 1 300–2 600 €. Cortina d'Ampezzo och Kitzbühel stod
                      // som Budget, Hemavan som Premium fast Hemavan är
                      // billigast av de tre. Prisvärde läste value_score,
                      // vars vanligaste värde är 4 — satt på 12 orter utan
                      // att gå att härleda ur något annat fält.
                      //
                      // Kvar står de två tal som kommer ur samma källa som
                      // resten av sifferrutorna.
                      { label: 'Dagskort',      value: rakt(dagskort) },
                      { label: 'Veckokort',     value: rakt(veckokort) },
                    ].map(item => (
                      <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '12px 14px' }}>
                        <div style={fieldLabel}>{item.label}</div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500, color: '#f0ece4' }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                ) : null}
                <div style={{ background: 'rgba(212,165,116,0.05)', border: '1px solid rgba(212,165,116,0.1)', borderRadius: 8, padding: '12px 16px' }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.57)', lineHeight: 1.6 }}>
                    {prisAttVisa ? (
                      <>
                        {sasongen ? <>{sasongen}{' '}</> : null}
                        {OMFATTNING}{' '}
                        {/* Referensveckan ligger i februari 2027 och gäller
                            därför bara 26/27-priser — se lib/liftkortspriser.js. */}
                        {prismeta?.sasong === '26/27' ? <>{REFERENSVECKA}{' '}</> : null}
                        {prismeta?.not ? <>{prismeta.not}{' '}</> : null}
                        Hämtat ur ortens egen prislista.{' '}
                        {omraknat
                          ? <>Kronbeloppen är omräknade mot Europeiska centralbankens kurs den {skrivDatum(kurser.datum)} och avrundade till närmaste femtio.{' '}</>
                          : null}
                      </>
                    ) : (
                      <>
                        Vi visar inget liftkortspris för {resort.name}.{' '}
                        {utanPris?.skal ? <>{utanPris.skal}{' '}</> : null}
                        Ett pris vi inte kan belägga mot ortens egen prislista är sämre än inget pris — se{' '}
                        <Link href="/liftkortspriser" style={{ color: '#D4A574', textDecoration: 'none' }}>hela prislistan</Link>.
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Vanliga frågor ──
                Direkt efter priserna, eftersom prisfrågan är den som söks
                mest. Utfällda och inte hopfällda: svaret är det besökaren
                kom för, och en fråga man måste klicka på för att läsa
                svaret är en omväg. */}
            {fragor.length > 0 && (
              <div style={{ marginBottom: 48 }}>
                <h2 style={sectionTitle}>Vanliga frågor om {resort.name}</h2>
                <div style={{ ...card, padding: '0 24px' }}>
                  {fragor.map((f, i) => (
                    <div key={f.fraga} style={{ padding: '20px 0', borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)' }}>
                      <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: '#f0ece4', lineHeight: 1.4, margin: '0 0 8px' }}>
                        {f.fraga}
                      </h3>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'rgba(255,255,255,0.62)', lineHeight: 1.7, margin: 0 }}>
                        {f.svar}
                        {f.lank ? <>{' '}<Link href={f.lank.href} style={{ color: '#D4A574', textDecoration: 'none' }}>{f.lank.text}</Link></> : null}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Jämförelser ──
                Ortsidan var en återvändsgränd: ingen väg härifrån till
                någon annan ort, trots att sajtens namn lovar jämförelse.
                Länkarna bär talen så att de säger något oklickade. */}
            <div>
              <h2 style={sectionTitle}>{resort.name} mot andra orter</h2>

              {alpsida && (
                <Link href={alpsida} style={{
                  display: 'block', ...card, padding: '16px 18px', marginBottom: 16,
                  textDecoration: 'none', borderColor: 'rgba(212,165,116,0.22)',
                }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, fontWeight: 600, color: '#D4A574' }}>
                    {resort.name} eller Alperna? →
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'rgba(255,255,255,0.62)', marginTop: 5, lineHeight: 1.6 }}>
                    Storlek, pris i kronor och hur lång resan är — inklusive alporterna du når med nattåg.
                  </div>
                </Link>
              )}

              {/* Fem orter ingår inte i något kuraterat par — Courchevel,
                  Méribel, Verbier, Saas-Fee och Grandvalira. De skulle
                  annars förbli exakt den återvändsgränd blocket finns för
                  att laga. Väljaren tar vilka två orter som helst, så det
                  finns någonstans att skicka dem. */}
              {jamforGrupper.length === 0 && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.61)', lineHeight: 1.7, margin: '0 0 14px' }}>
                  Vi har ingen färdig jämförelse för {resort.name} ännu, men du
                  kan ställa orten mot vilken som helst av de andra.
                </p>
              )}

              {jamforGrupper.map((grupp) => (
                  <div key={grupp.rubrik} style={{ marginBottom: 20 }}>
                    {jamforGrupper.length > 1 && (
                      <div style={{ ...fieldLabel, marginBottom: 10 }}>{grupp.rubrik}</div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 8 }}>
                      {grupp.par.map(({ par, annan }) => (
                        <Link key={par} href={`/jamfor/${par}`} style={{ ...card, padding: '12px 14px', textDecoration: 'none', display: 'block' }}>
                          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 500, color: '#f0ece4' }}>
                            <span style={{ color: 'rgba(255,255,255,0.54)' }}>mot</span> {annan.name}
                          </div>
                          <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 5 }}>
                            {annan.total_pistes_km} km pist
                            {' · '}{annan.altitude_top - annan.altitude_base} m fallhöjd
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              <Link href="/jamfor" style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: '#D4A574', textDecoration: 'none', letterSpacing: '0.04em' }}>Välj vilka två orter du vill →</Link>
            </div>

            {/* ── Liknande orter ──
                Länkar till andra ORTSIDOR, inte till jämförelser. Blocket
                ovan pekar på /jamfor-sidor; den här kanten saknades helt.
                Fem orter — Courchevel, Méribel, Verbier, Saas-Fee och
                Grandvalira — ingår inte i något par och hade därför en enda
                inlänk från hela sajten, startsidan. Nu har varje ortsida sex
                inlänkar till på köpet. Se naraOrter i lib/jamfor.js. */}
            <div style={{ marginTop: 40 }}>
              <h2 style={sectionTitle}>Liknande orter</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 8 }}>
                {nara.map((annan) => (
                  <Link key={annan.slug} href={`/resort/${annan.slug}`} style={{ ...card, padding: '12px 14px', textDecoration: 'none', display: 'block' }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 500, color: '#f0ece4' }}>
                      {annan.name}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 5 }}>
                      {land(annan.country)} · {annan.total_pistes_km} km pist
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* ── Right column — sticky sidebar (desktop only) ── */}
          <div className="resort-sidebar">
            {PLANERAREN_SYNLIG && (
              <div style={{ background: 'rgba(212,165,116,0.07)', border: '1px solid rgba(212,165,116,0.2)', borderRadius: 12, padding: '22px', marginBottom: 12 }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500, color: '#D4A574', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>Redo att åka?</p>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: '#f0ece4', letterSpacing: '0.03em', marginBottom: 8 }}>{resort.name}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.57)', lineHeight: 1.6, marginBottom: 18 }}>Använd reseplaneraren för att se hur orten står sig mot din nivå, budget och månad.</p>
                <Link href="/plan" style={{ display: 'block', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#121110', background: '#D4A574', borderRadius: 6, padding: '14px 24px', textDecoration: 'none' }}>Planera resan →</Link>
              </div>
            )}
            <a href={bookingHrefSidebar} target="_blank" rel="noopener noreferrer sponsored" style={{ display: 'block', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: '#fff', background: '#003580', borderRadius: 6, padding: '12px 24px', textDecoration: 'none', marginBottom: 12, letterSpacing: '0.04em' }}>Hitta boende på Booking.com →</a>
            <a href={resort.resort_url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.61)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '12px 24px', textDecoration: 'none', marginBottom: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Ortens officiella webbplats →</a>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.61)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '12px 24px', textDecoration: 'none', marginBottom: 16, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Visa på Google Maps →</a>
            <div style={{ ...card, padding: '20px' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>I korthet</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Lägsta',         value: `${resort.altitude_base} m` },
                  { label: 'Högsta',         value: `${resort.altitude_top} m` },
                  { label: 'Fallhöjd',       value: `${verticalDrop} m` },
                  { label: 'Pist totalt',    value: `${resort.total_pistes_km} km` },
                  { label: 'Antal liftar',   value: resort.total_lifts },
                  { label: 'Liftkapacitet',  value: resort.lift_capacity_per_hour ? `${resort.lift_capacity_per_hour.toLocaleString('sv-SE')} personer/tim` : '—' },
                  // Raderna faller bort helt när priset inte är hämtat, av
                  // samma skäl som i hjältebilden: ett streck läses som
                  // "vi vet inte" i en lista där allt annat står ifyllt.
                  ...(dagskort ? [{ label: 'Dagskort', value: dagskort.kr }] : []),
                  ...(veckokort ? [{ label: 'Veckokort', value: veckokort.kr }] : []),
                  // "Snöfall i snitt" läste avg_snowfall_cm — se kommentaren
                  // under Snö och förhållanden om varför fältet inte visas.
                  { label: 'Konstsnö',       value: Number.isFinite(resort.snowmaking_coverage_pct) ? `${resort.snowmaking_coverage_pct} %` : '—' },
                  { label: 'Flyg till',      value: resort.nearest_airport },
                  { label: 'Restid',         value: estimatedTransferMins },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 8 }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.52)' }}>{row.label}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: '#f0ece4' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <SiteFooter />

    </div>
  )
}