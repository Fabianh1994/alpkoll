import { getResorts } from '../../lib/resorts'
import { hamtaKurser } from '../../lib/valuta'
import { pris, kronorTal, perSkiddag } from '../../lib/pris'
import { harPris, VERIFIERADE } from '../../lib/liftkortspriser'
import { arNordisk } from '../../lib/jamfor'
import { land } from '../../lib/countries'
import { TAGLINJER } from '../../lib/restider'
import { NATTAGSORTER, nattagFor } from '../../lib/nattaget'
import { AVRESESTADER, BIL_AVRESA } from '../../lib/avresestader'
import Skiss from './Skiss'

// Skiss av en ny startsida: Aftonbladets upplägg, Filmstadens stadsval, och
// innehåll som räknas fram ur staden du åker ifrån i stället för nyheter.
// Inte länkad någonstans och inte indexerad.
export const revalidate = 3600

export const metadata = {
  title: 'Skiss: ny startsida | Alpkoll',
  robots: { index: false, follow: false },
}

export default async function SkissStartsida() {
  const [resorts, kurser] = await Promise.all([getResorts(), hamtaKurser()])

  const orter = resorts.map((r) => {
    const valuta = r.lift_pass_currency || 'EUR'
    const visaPris = harPris(r)
    const vecka = visaPris ? pris(r.lift_pass_week_eur, valuta, kurser) : null
    const kr = visaPris ? kronorTal(r.lift_pass_week_eur, valuta, kurser) : null
    const alpTag = nattagFor(r.slug)
    return {
      slug: r.slug,
      namn: r.name,
      land: land(r.country),
      bild: r.image_url,
      pist: r.total_pistes_km,
      fallhojd: r.altitude_top - r.altitude_base,
      nordisk: arNordisk(r),
      veckokort: vecka?.kr ?? null,
      perDag: kr ? perSkiddag(kr) : null,
      sasong: visaPris ? VERIFIERADE[r.slug]?.sasong ?? null : null,
      // Hur tåget når orten, i ett par ord. Ur lib/nattaget.js och
      // lib/restider.js, inte skrivet per ort.
      tag: alpTag
        ? (alpTag.buss ? 'Nattåg och buss' : 'Nattåget stannar här')
        : TAGLINJER.some((t) => t.ort === r.slug) ? 'Tåg från Stockholm' : null,
      nattag: NATTAGSORTER.includes(r.slug) || TAGLINJER.some((t) => t.ort === r.slug),
    }
  })

  // Snabbvalen. Den största tätorten i varje län, eftersom de fem största
  // tätorterna rakt av ger "Upplands Väsby och Sollentuna" bredvid Stockholm.
  // Länet är de två första siffrorna i SCB:s kod, och listan är redan
  // sorterad på folkmängd. De fem största länsstäderna står först, resten
  // från norr till söder så att raden läses som en karta.
  const lanSett = new Set()
  const perLan = []
  for (const s of AVRESESTADER) {
    const lan = s.scbKod.slice(0, 2)
    if (lanSett.has(lan)) continue
    lanSett.add(lan)
    perLan.push(s)
  }
  const storst = perLan.slice(0, 5).map((s) => s.nyckel)
  const runtOm = perLan.slice(5).sort((a, b) => b.lat - a.lat).map((s) => s.nyckel)

  const guider = [
    { href: '/nattaget-till-alperna', rubrik: 'Nattåget till Alperna', ingress: 'Stationerna, restiden från Malmö och bussarna vidare till Ischgl, St. Anton och Sölden.', bild: orter.find((o) => o.slug === 'kitzbuehel')?.bild, alt: 'Kitzbühel' },
    { href: '/sportlov', rubrik: 'Sportlovet 2027', ingress: 'Vecka 7 till 10, vilken fredag tåget går och vad veckan gör med liftkortet.', bild: orter.find((o) => o.slug === 'salen')?.bild, alt: 'Sälen' },
    { href: '/are-eller-alperna', rubrik: 'Åre eller Alperna?', ingress: 'Pist, fallhöjd och liftkort i kronor mot alporterna, och resan hemifrån.', bild: orter.find((o) => o.slug === 'are')?.bild, alt: 'Åre' },
    { href: '/liftkortspriser', rubrik: 'Liftkortspriser', ingress: 'Sex skiddagar i 23 orter, i kronor och per dag.', bild: orter.find((o) => o.slug === 'st-anton')?.bild, alt: 'St. Anton' },
  ]

  return (
    <Skiss
      orter={orter}
      stader={AVRESESTADER.map((s) => ({ nyckel: s.nyckel, namn: s.namn }))}
      bil={BIL_AVRESA}
      storst={storst}
      runtOm={runtOm}
      guider={guider}
    />
  )
}
