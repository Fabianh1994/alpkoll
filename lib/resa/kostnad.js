import { kravLangsVagen } from './lander'
import { heltal } from './resvag'

/**
 * Vad resan kostar för hela sällskapet, uppdelat i delar.
 *
 * Bara delar med känt belopp räknas in: bränslet (sträckan från Google
 * gånger förbrukning och literpris, som läsaren kan ändra), broar och
 * vinjetter med källa i lib/resa/lander.js, flyget gånger antal resenärer
 * och skidbagaget för de flygbolag vi har kontrollerat. Resten nämns som
 * "tillkommer" utan belopp, hellre än en gissning.
 */

export const STANDARD_FORBRUKNING = 0.7 // liter per mil
export const STANDARD_LITERPRIS = 18 // kr, ett antagande som läsaren kan ändra

/**
 * Skidbagage per flygbolag och riktning, kontrollerat 25 november 2026.
 * Uppdateras varje höst.
 */
export const SKIDBAGAGE = {
  SK: { text: 'Skidväskan räknas som ett incheckat kolli, upp till 23 kg. Den billigaste biljetten har inget incheckat bagage, och då kostar kollit extra.', kort: 'incheckat bagage för skidväskan om biljetten saknar det (hos SAS räknas den som ett vanligt kolli, upp till 23 kg)', eur: 0, kalla: 'https://www.flysas.com/en/travel-info/baggage/sports-equipment' },
  DY: { text: '40–45 € per riktning om den bokas online, dyrare på flygplatsen. Platserna är begränsade, så boka den direkt.', eur: 45, kalla: 'https://www.norwegian.com/en/travel-info/baggage/sports-equipment/' },
  D8: { text: '40–45 € per riktning om den bokas online, dyrare på flygplatsen. Platserna är begränsade, så boka den direkt.', eur: 45, kalla: 'https://www.norwegian.com/en/travel-info/baggage/sports-equipment/' },
}

const kr = (belopp, kurser) => {
  if (!belopp) return null
  if (Number.isFinite(belopp.sek)) return belopp.sek
  if (Number.isFinite(belopp.eur) && kurser?.SEK) return belopp.eur * kurser.SEK
  if (Number.isFinite(belopp.chf) && kurser?.SEK && kurser?.CHF) return (belopp.chf / kurser.CHF) * kurser.SEK
  return null
}

/**
 * @param resa      den valda resan (bil, tag eller flyg)
 * @param personer  { vuxna, barn }
 * @param bil       { forbrukning, literpris }
 * @param kurser    { SEK, CHF } mot euro, från lib/valuta.js
 * @returns { rader: [{ namn, kr, not, kalla }], summa, perPerson, ovrigt: [text], krav: [...] }
 */
export function kostnad(resa, personer, bil, kurser) {
  const antal = Math.max(1, (personer?.vuxna || 0) + (personer?.barn || 0))
  const rader = []
  const ovrigt = []
  let krav = []

  if (resa.satt === 'bil') {
    const e = resa.etapper.find((x) => x.typ === 'bil')
    const mil = (resa.km || 0) / 10
    const forbrukning = bil?.forbrukning ?? STANDARD_FORBRUKNING
    const literpris = bil?.literpris ?? STANDARD_LITERPRIS
    rader.push({
      namn: 'Bränsle',
      kr: mil * forbrukning * literpris,
      not: `${Math.round(mil)} mil × ${String(forbrukning).replace('.', ',')} l/mil × ${literpris} kr/l`,
    })
    krav = kravLangsVagen(e?.path).poster
    for (const k of krav) {
      const belopp = kr(k.belopp, kurser)
      if (belopp != null) rader.push({ namn: k.rubrik.replace(/ i .*$/, ''), kr: belopp, kalla: k.kalla })
      else if (/Färjan|Storebælt/.test(k.rubrik)) ovrigt.push(`${k.rubrik.replace(/^Färjan/, 'färjan')} (pris hos bolaget)`)
    }
    const natter = resa.pauser?.filter((p) => p.natt && !p.egen).length || 0
    if (natter) ovrigt.push(natter === 1 ? 'hotellet för natten på vägen' : `hotellen för ${natter} nätter på vägen`)
  }

  if (resa.satt === 'flyg') {
    const f = resa.flyget
    const flyg = resa.etapper.find((x) => x.typ === 'flyg')
    if (Number.isFinite(f?.pris)) {
      rader.push({ namn: `Flyget, ${antal} ${antal === 1 ? 'person' : 'personer'}`, kr: f.pris * antal, not: `från ${heltal(Math.round(f.pris))} kr per person (vuxenpris, barn kan vara billigare), enkel väg${flyg?.vaska === 'reported_included' ? ', med en incheckad väska' : flyg?.vaska === 'estimated' ? ', med uppskattad väskavgift' : ''}` })
    }
    const bagage = SKIDBAGAGE[flyg?.bolagKod]
    // Priset har redan en incheckad väska per person. Hos bolag där
    // skidväskan räknas som vanligt bagage (eur 0) kostar den inget mer.
    const medVaska = ['reported_included', 'estimated'].includes(flyg?.vaska)
    if (medVaska && bagage && !bagage.eur) {
      ovrigt.push('en resväska till om skidväskan tar er incheckade väska')
    } else if (bagage) {
      const styck = kr({ eur: bagage.eur }, kurser)
      if (styck) rader.push({ namn: `Skidbagage, ${antal} st om alla har egna skidor`, kr: styck * antal, not: bagage.text, kalla: bagage.kalla })
      else ovrigt.push(bagage.kort || `skidbagage: ${bagage.text}`)
    } else {
      ovrigt.push('skidbagage (avgiften står hos flygbolaget)')
    }
    // Vägen mellan hemmet och flygplatsen här hemma kostar också.
    // Parkeringen räknas en gång, på resan dit.
    const iFlyg = resa.etapper.findIndex((x) => x.typ === 'flyg')
    const hemmaSidan = resa.hemat ? resa.etapper.slice(iFlyg + 1) : resa.etapper.slice(0, iFlyg)
    if (hemmaSidan.some((x) => x.typ === 'bil')) {
      if (!resa.hemat) ovrigt.push('parkeringen vid flygplatsen hemma, för hela resan')
    } else if (hemmaSidan.some((x) => ['tag', 'buss', 'annat'].includes(x.typ))) ovrigt.push(resa.hemat ? 'tåg eller buss hem från flygplatsen' : 'tåg eller buss till flygplatsen hemma')
    ovrigt.push(resa.vidare?.valt === 'kollektivt' ? (resa.hemat ? 'tåg eller buss till flygplatsen' : 'tåg eller buss från flygplatsen') : (resa.hemat ? 'transfer till flygplatsen' : 'transfer från flygplatsen'))
  }

  if (resa.satt === 'tag') {
    ovrigt.push('biljetterna (priset står hos tåg- och bussbolagen)')
  }

  const summa = rader.reduce((s, r) => s + (r.kr || 0), 0)
  return { rader, summa, perPerson: summa / antal, antal, ovrigt, krav }
}
