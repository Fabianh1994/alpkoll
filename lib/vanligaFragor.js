import { pris, kronorTal, perSkiddag, talet } from './pris'
import { OMFATTNING, REFERENSVECKA, VERIFIERADE, UTAN_PRIS, harPris } from './liftkortspriser'
import { arNordisk } from './jamfor'
import { arAlport, fallhojd } from './ellerAlperna'
import { brantasteDelen, pistadeDelar } from './delomraden'
import { land } from './countries'
import { STADER, bilresa, linjeMeningar, linjerFor } from './restider'
import { SASONG as NATTAG_SASONG, SVERIGE, nattagFor, restidText, sasongenSlut, stationFor } from './nattaget'

/**
 * Vanliga frågor på ortsidan.
 *
 * Frågorna är de som faktiskt når sidorna, inte påhittade. Search Console
 * 11 september 2026, sajtens första månad i indexet: till /resort/salen
 * ensam gick 104 exponeringar på prisfrågor, 49 på fallhöjd och 32 på
 * Stockholmsfrågor ("sälen stockholm", "stockholm sälen avstånd") — i snitt
 * på position 18 till 28, och utan ett enda klick. Samma tre ämnen bär
 * Hemsedal, Åre, Trysil och St. Anton, plus höjd över havet.
 *
 * Svaret på Stockholmsfrågan fanns redan på sajten, uppmätt i
 * lib/restider.js, men bara på /sportlov. Ortsidan som Google skickade
 * frågan till visade flygplatsen.
 *
 * Varje svar härleds ur datan vid rendering, som på alpsidorna, så att
 * inget svar kan motsäga sifferrutorna längre upp på samma sida. Ingen
 * text skrivs per ort.
 *
 * Sökt men medvetet utelämnat: snödjup är färskvara vi inte bär, namngivna
 * backar och liftar ("väggen sälen", "la gondola åre") finns inte i datan,
 * och säsongens öppning står bara som månad och skiljer knappt orterna åt.
 */

const ORD = ['ingen', 'en', 'två', 'tre', 'fyra', 'fem', 'sex', 'sju', 'åtta', 'nio', 'tio', 'elva', 'tolv']

/** 4 -> "fyra", 19 -> "19". Tal till och med tolv skrivs med bokstäver. */
const antal = (n) => ORD[n] ?? String(n)
const Antal = (n) => {
  const ord = antal(n)
  return ord[0].toUpperCase() + ord.slice(1)
}

/**
 * "Åtta av de elva nordiska orterna på Alpkoll når högre."
 *
 * Över tolv står talet med siffror, och en mening ska inte börja med en
 * siffra. Då vänds den: "Av de 19 orterna utanför Norden på Alpkoll når
 * 13 högre."
 */
function andel(n, av, verb, resten) {
  if (n <= 12) return `${Antal(n)} ${av} ${verb} ${resten}.`
  return `A${av.slice(1)} ${verb} ${n} ${resten}.`
}

const meter = (n) => `${talet(n)} meter`
const km = (n) => `${talet(n)} km`

/** 45 -> "45 minuter", 353 -> "5,9 timmar", 600 -> "10 timmar". */
function tid(minuter) {
  if (!Number.isFinite(minuter) || minuter <= 0) return null
  if (minuter < 90) return `${minuter} minuter`
  return `${(minuter / 60).toFixed(1).replace('.', ',').replace(/,0$/, '')} timmar`
}

/** Orten med högst (riktning 1) eller lägst (riktning -1) värde. */
const ytterst = (orter, varde, riktning) =>
  orter.reduce((bast, r) => (!bast || riktning * (varde(r) - varde(bast)) > 0 ? r : bast), null)

/**
 * Vilka orter en ort rangordnas bland.
 *
 * Landet när det har minst tre orter på sajten, därför att "minst fallhöjd
 * av orterna i Sverige" är den jämförelse en svensk gör. Annars Norden
 * respektive resten — Finland har två orter och Andorra en, och en
 * rangordning mellan två säger ingenting.
 */
function grupp(ort, alla) {
  const iLandet = alla.filter((r) => r.country === ort.country)
  if (iLandet.length >= 3) return { orter: iLandet, namn: `orterna i ${land(ort.country)}` }

  const nordisk = arNordisk(ort)
  return {
    orter: alla.filter((r) => arNordisk(r) === nordisk),
    namn: nordisk ? 'nordiska orterna' : 'orterna utanför Norden',
  }
}

// ── Vad kostar liftkort i … ─────────────────────────────────────────────

function fragaPris(ort, kurser) {
  const fraga = `Vad kostar liftkort i ${ort.name}?`

  // Samma spärr som prisrutan på sidan. Utan pris står skälet, inte ett tal.
  const skalet = () => {
    const skal = UTAN_PRIS[ort.slug]?.skal
    return { fraga, svar: `Vi visar inget liftkortspris för ${ort.name} än.${skal ? ` ${skal}` : ''}` }
  }
  if (!harPris(ort)) return skalet()

  const valuta = ort.lift_pass_currency || 'EUR'
  const dag = pris(ort.lift_pass_day_eur, valuta, kurser)
  const vecka = pris(ort.lift_pass_week_eur, valuta, kurser)
  if (!vecka) return skalet()

  const visa = (p) => (p.ursprung ? `${p.kr} (${p.ursprung})` : p.kr)
  const delar = [
    dag
      ? `Ett dagskort kostar ${visa(dag)} och ett kort för sex dagar ${visa(vecka)}.`
      : `Ett kort för sex dagar kostar ${visa(vecka)}.`,
  ]

  // Samma avrundning som kolumnen "Per skiddag" på /liftkortspriser.
  const perDag = perSkiddag(kronorTal(ort.lift_pass_week_eur, valuta, kurser))
  if (perDag) delar.push(`Med sexdagarskortet blir det runt ${talet(perDag)} kr per skiddag.`)

  // Säsongen står intill priset, av samma skäl som i prisrutan: fyra orter
  // bär 25/26-priser, och utan årtalet läses de som årets.
  const meta = VERIFIERADE[ort.slug]
  const galler = dag ? 'Priserna gäller' : 'Priset gäller'
  if (meta.sasong === '26/27') delar.push(`${galler} säsongen 2026/2027. ${OMFATTNING} ${REFERENSVECKA}`)
  else if (meta.sasong === '25/26') delar.push(`${galler} säsongen 2025/2026. ${OMFATTNING}`)
  else delar.push(OMFATTNING)
  if (meta.not) delar.push(meta.not)

  return { fraga, svar: delar.join(' ') }
}

// ── Hur stor är fallhöjden i … ──────────────────────────────────────────

function fragaFallhojd(ort, alla) {
  const fh = fallhojd(ort)

  // Sälen och Chamonix får inte spannet i första meningen. Deras höjder
  // är lägsta basen och högsta toppen i skilda områden, så "308 m, från
  // 572 till 887 över havet" hade sagt emot sig själv inom en mening —
  // 887 minus 572 är 315. Se lib/delomraden.js.
  const brantast = brantasteDelen(ort)
  const delar = brantast
    ? [`${meter(fh)} i ${brantast.namn}, det brantaste av ${antal(pistadeDelar(ort).length)} områden som liftkortet ger. De ligger var för sig, och hela spannet ${talet(ort.altitude_base)}–${meter(ort.altitude_top)} korsar dem alla.`]
    : [`${meter(fh)}, från ${talet(ort.altitude_base)} till ${meter(ort.altitude_top)} över havet.`]

  if (ort.ski_area) delar.push(`Talen avser hela ${ort.ski_area}, inte bara ${ort.name}.`)

  const g = grupp(ort, alla)
  const storre = g.orter.filter((r) => fallhojd(r) > fh).length
  const mindre = g.orter.filter((r) => fallhojd(r) < fh).length
  const lika = g.orter.filter((r) => r.slug !== ort.slug && fallhojd(r) === fh).length
  const av = `av de ${antal(g.orter.length)} ${g.namn} på Alpkoll`

  // "Störst" och "minst" bara när ingen annan ort delar talet. Les 3
  // Vallées ger tre orter samma fallhöjd, och ett delat förstaställe
  // skrivet som ensamt vore fel.
  if (storre === 0 && lika === 0 && mindre > 0) delar.push(`${ort.name} har störst fallhöjd ${av}.`)
  else if (mindre === 0 && lika === 0 && storre > 0) delar.push(`${ort.name} har minst fallhöjd ${av}.`)
  else if (storre > 0) delar.push(andel(storre, av, 'har', 'större fallhöjd'))

  // Över gränsen mellan Norden och Alperna, som är det valet svensken gör.
  if (arNordisk(ort)) {
    const minstAlp = ytterst(alla.filter(arAlport), fallhojd, -1)
    if (minstAlp && fallhojd(minstAlp) > fh) {
      delar.push(`Alporten med minst fallhöjd, ${minstAlp.name}, har ${meter(fallhojd(minstAlp))}.`)
    }
  } else {
    const storstNorden = ytterst(alla.filter(arNordisk), fallhojd, 1)
    if (storstNorden) delar.push(`Störst i Norden är ${storstNorden.name} med ${meter(fallhojd(storstNorden))}.`)
  }

  return { fraga: `Hur stor är fallhöjden i ${ort.name}?`, svar: delar.join(' ') }
}

// ── Hur högt över havet ligger … ────────────────────────────────────────

function fragaHojd(ort, alla) {
  const nordisk = arNordisk(ort)
  const orter = alla.filter((r) => arNordisk(r) === nordisk)
  const hogre = orter.filter((r) => r.altitude_top > ort.altitude_top).length
  const av = `av de ${antal(orter.length)} ${nordisk ? 'nordiska orterna' : 'orterna utanför Norden'} på Alpkoll`

  const delar = [`Skidområdet börjar på ${meter(ort.altitude_base)} och når ${meter(ort.altitude_top)} över havet.`]
  delar.push(hogre === 0 ? `Ingen ${av} når högre.` : andel(hogre, av, 'når', 'högre'))

  return { fraga: `Hur högt över havet ligger ${ort.name}?`, svar: delar.join(' ') }
}

// ── Hur långt är det / hur tar man sig till … ───────────────────────────

/** Flyget och sista biten, i transferfältets egna ord. */
function flyget(ort) {
  if (!ort.nearest_airport) return null
  const tidDit = tid(ort.transfer_minutes)
  // "med bil från Innsbruck" -> "med bil". Flygplatsen står redan i meningen.
  const fardsatt = (ort.transfer_note || '').replace(/ från .+$/, '')
  const avstand = Number.isFinite(ort.airport_distance_km) ? `Därifrån är det ${km(ort.airport_distance_km)}` : null

  if (avstand && tidDit) return `Flyg till ${ort.nearest_airport}. ${avstand}, ungefär ${tidDit}${fardsatt ? ` ${fardsatt}` : ''}.`
  if (avstand) return `Flyg till ${ort.nearest_airport}. ${avstand}.`
  return `Flyg till ${ort.nearest_airport}.`
}

function fragaResa(ort, idag) {
  const bil = STADER.map((s) => ({ stad: s.namn, resa: bilresa(ort.slug, s.nyckel) })).filter((x) => x.resa)
  const delar = []
  let lank = null

  if (arNordisk(ort) && bil.length) {
    // Bilen först: till de nordiska orterna är det så de flesta åker.
    const [forsta, ...ovriga] = bil
    delar.push(`Från ${forsta.stad} är det ${km(forsta.resa.km)} med bil, ungefär ${tid(forsta.resa.minuter)} utan raster.`)
    if (ovriga.length) {
      delar.push(`Från ${ovriga.map((x) => `${x.stad} ${km(x.resa.km)} (${tid(x.resa.minuter)})`).join(' och från ')}.`)
    }

    // Åre har två nattåg, SJ och Snälltåget, och båda ska stå med.
    for (const linje of linjerFor(ort.slug, idag)) delar.push(...linjeMeningar(linje, idag))

    const flyg = flyget(ort)
    if (flyg) delar.push(flyg)

    return { fraga: `Hur långt är det till ${ort.name} från Stockholm?`, svar: delar.join(' '), lank }
  }

  // Alperna och Grandvalira: flyget först, sedan nattåget där det går.
  const flyg = flyget(ort)
  if (flyg) delar.push(flyg)

  // Samma spärr som nattågsrutan: efter säsongen nämns tåget inte.
  const nattag = sasongenSlut(idag) ? null : nattagFor(ort.slug)
  if (nattag) {
    const station = stationFor(ort.slug)
    const tagMening = `Snälltåget kör nattåg från ${SVERIGE.avgangsort} på ${SVERIGE.avgangsdag}ar, ${NATTAG_SASONG}`
    if (!nattag.buss && station) {
      delar.push(`${tagMening}, och stannar i ${ort.name} efter ${restidText(station.restidMin)}.`)
    } else if (station) {
      delar.push(`${tagMening}. Kliv av i ${station.namn} och ta transferbussen${nattag.hallplats ? ` till ${nattag.hallplats}` : ''}.`)
    } else {
      delar.push(`${tagMening}, med transferbuss${nattag.hallplats ? ` till ${nattag.hallplats}` : ''}.${nattag.not ? ` ${nattag.not}` : ''}`)
    }
    lank = { href: '/nattaget-till-alperna', text: 'Tider och orter →' }
  }

  // Bilen sist, och bara från Malmö: därifrån är den kortast, och från
  // Stockholm är det ingen resa någon planerar.
  const malmo = bil.find((x) => x.stad === 'Malmö')
  if (malmo) delar.push(`Med bil från Malmö är det ${km(malmo.resa.km)}, ungefär ${tid(malmo.resa.minuter)} utan raster.`)

  if (delar.length === 0) return null
  return { fraga: `Hur tar man sig till ${ort.name} från Sverige?`, svar: delar.join(' '), lank }
}

/**
 * Frågorna för en ort, i den ordning de söks: pris, fallhöjd, resan dit,
 * höjd över havet.
 *
 * @param ort     raden ur resorts
 * @param alla    alla publicerade orter, orten själv inräknad
 * @param kurser  från hamtaKurser() i lib/valuta.js
 * @returns       [{ fraga, svar, lank? }] — `svar` är ren text och går
 *                oförändrad in i den strukturerade datan; länken står
 *                bara på sidan.
 */
export function vanligaFragor(ort, alla, kurser, idag = new Date()) {
  return [
    fragaPris(ort, kurser),
    fragaFallhojd(ort, alla),
    fragaResa(ort, idag),
    fragaHojd(ort, alla),
  ].filter(Boolean)
}
