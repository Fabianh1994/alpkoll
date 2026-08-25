// Jämförelsesidorna — /jamfor/<a>-vs-<b>.
//
// Två frågor som ser ut som en men inte är det:
//
//   Vad får besökaren jämföra?  Vilka två publicerade orter som helst.
//                               Väljaren på /jamfor hade varit oanvändbar
//                               annars — 30 orter ger 435 par, och en
//                               väljare som svarar "den jämförelsen finns
//                               inte" på 352 av dem är inget verktyg.
//
//   Vad får Google se?          De kuraterade paren nedan, och bara dem.
//                               Övriga svarar men står som noindex och
//                               ligger inte i sitemapen.
//
// Kuraterade är två sorter:
//
//   Kors-par   {Åre, Sälen} mot alporter. Det här är sidorna som svarar på
//              det val svensken faktiskt står inför: stanna i Norden eller
//              åka till Alperna. Listan över alporter är redaktionell —
//              databasen har inget fält för hur ofta en svensk överväger en
//              ort, och pistkilometer är fel mått på det.
//
//   Nordiska   alla par bland de elva nordiska orterna.
//
// Alporter ställs medvetet inte mot varandra bland de kuraterade. Chamonix
// mot Val d'Isère är en sida varje internationell skidsajt redan skrivit;
// den kan vi inte vinna, och den ska därför inte tävla om vår plats i
// sökresultaten. Den som ändå vill se paret får det — bara inte indexerat.

import { pris, VALUTA_VECKOKOSTNAD } from './pris'

// Priser visas i kronor med ortens eget belopp inom parentes. `visa` får
// därför kurserna som andra argument och returnerar för prisfälten ett
// { kr, ursprung } i stället för en sträng — sidan sätter parentesen
// mindre och blekare, vilket den inte kan om delarna redan är hopslagna.
//
// Valutan ligger ännu inte i databasen; alla belopp är euro tills
// prisomhämtningen landar. Därför står 'EUR' hårdkodat nedan, på ett
// ställe, i stället för utspritt i varje fält.
//
// Den gäller liftkortsfälten och bara dem. est_weekly_cost_eur är euro
// oavsett vad orten tar betalt för sitt kort — se VALUTA_VECKOKOSTNAD i
// lib/pris.js.
const VALUTA = (r) => r.lift_pass_currency || 'EUR'

export const SVENSKA_KORSORTER = ['are', 'salen']

export const ALPORTER_FOR_KORS = [
  // Österrike — störst för svenskar, och de fyra första nås med nattåg.
  'solden', 'ischgl', 'st-anton', 'mayrhofen', 'kitzbuehel',
  // Frankrike
  'chamonix', 'val-thorens', 'alpe-d-huez', 'les-arcs', 'tignes',
  // Italien
  'livigno', 'madonna-di-campiglio', 'cortina-d-ampezzo',
  // Schweiz
  'zermatt',
]

export const NORDISKA_ORTER = [
  'are', 'salen', 'hemavan', 'riksgransen',
  'trysil', 'hemsedal', 'geilo', 'voss', 'myrkdalen',
  'levi', 'ruka',
]

const NORDEN = new Set(['Sweden', 'Norway', 'Finland'])

/** Ligger orten i Norden? Avgör om resan dit kräver flyg. */
export const arNordisk = (resort) => NORDEN.has(resort.country)

const SKILJETECKEN = '-vs-'

/**
 * Kanonisk adress för ett par. Slugarna sorteras i bokstavsordning så att
 * paret alltid får samma adress oavsett vilken ort som nämns först —
 * annars hade are-vs-solden och solden-vs-are blivit två sidor med
 * identiskt innehåll, och Google fått välja vilken som räknas.
 */
export function parSlug(a, b) {
  return [a, b].sort().join(SKILJETECKEN)
}

/**
 * Tolkar en adress till sina två slugar.
 *
 * Ingen ortslug innehåller "-vs-", så delningen är entydig även för
 * sammansatta slugar som alpe-d-huez och val-thorens.
 *
 * Returnerar null bara för adresser som inte är två skilda slugar alls.
 * Om orterna finns avgörs av databasen, inte här.
 *
 * `kanonisk` är false när ordningen är omvänd — sidan svarar då med en
 * permanent vidarebefordran istället för innehåll. `kurerat` säger om paret
 * är ett av de 83 vi bygger och länkar; `indexerat` om det dessutom ska
 * indexeras. Ett kurerat par som inte är indexerat svarar och länkas som
 * vanligt, men står som noindex — se INDEXERADE_PAR.
 */
export function tolkaPar(slug) {
  const delar = String(slug || '').split(SKILJETECKEN)
  if (delar.length !== 2) return null

  const [forst, sedan] = delar
  if (!forst || !sedan || forst === sedan) return null

  const kanonisk = parSlug(forst, sedan)

  return {
    slugs: [forst, sedan],
    kanoniskSlug: kanonisk,
    kanonisk: kanonisk === slug,
    kurerat: PAR_ADRESSER.has(kanonisk),
    indexerat: INDEXERADE_PAR.has(kanonisk),
  }
}

/** Alla par som ska ha en sida, som kanoniska adresser. */
function byggParAdresser() {
  const par = new Set()

  for (const svensk of SVENSKA_KORSORTER) {
    for (const alport of ALPORTER_FOR_KORS) {
      par.add(parSlug(svensk, alport))
    }
  }

  for (let i = 0; i < NORDISKA_ORTER.length; i++) {
    for (let j = i + 1; j < NORDISKA_ORTER.length; j++) {
      par.add(parSlug(NORDISKA_ORTER[i], NORDISKA_ORTER[j]))
    }
  }

  return par
}

export const PAR_ADRESSER = byggParAdresser()

/** Kanoniska adresser för generateStaticParams och sitemap. */
export const allaParSlugs = () => [...PAR_ADRESSER].sort()

/**
 * Paren som är länkade från /jamfor.
 *
 * Listan har två jobb och det är samma lista med flit: den ger sidan en
 * ingång åt den som inte vet vad hon letar efter, och den avgör vad som
 * får indexeras. Mätning 2026-08-25 visade varför de hör ihop — 62 % av
 * de länkade paren var genomsökta av Google, mot 21 % av de olänkade.
 * Internlänken är det som avgör om sidan hämtas alls.
 */
export const LANKADE_PAR = [
  'are-vs-salen',
  'are-vs-solden',
  'salen-vs-trysil',
  'are-vs-trysil',
  'ischgl-vs-salen',
  'hemsedal-vs-trysil',
  'are-vs-chamonix',
  'riksgransen-vs-salen',
]

/**
 * Paren Google redan indexerat, per Search Console 2026-08-25.
 *
 * En ögonblicksbild, inte en regel. Den finns för att en avgränsning som
 * bara behöll de åtta länkade hade satt noindex på tjugoen sidor som
 * fungerar — de var 21 av sajtens 32 indexerade sidor, alltså två
 * tredjedelar av det som faktiskt syns i Google. Att kasta bort dem för
 * att lösa ett problem som gäller de sidor som INTE är indexerade vore
 * att betala för fixen med det den skulle skydda.
 *
 * Sjutton av de tjugoen innehåller Åre eller Sälen. Det är inte en
 * slump: de två orterna förekommer i 24 par var, alla andra i tio eller
 * två. Genomsökningen följer internlänkvolym.
 *
 * Listan ska krympa. Ett par som varken får internlänkar eller behåller
 * sin plats i indexet hör inte hemma här vid nästa genomgång.
 */
const INDEXERADE_2026_08 = [
  'alpe-d-huez-vs-are',
  'are-vs-chamonix',
  'are-vs-geilo',
  'are-vs-hemsedal',
  'are-vs-ischgl',
  'are-vs-riksgransen',
  'are-vs-ruka',
  'are-vs-salen',
  'are-vs-st-anton',
  'are-vs-trysil',
  'are-vs-val-thorens',
  'are-vs-zermatt',
  'cortina-d-ampezzo-vs-salen',
  'geilo-vs-hemavan',
  'hemavan-vs-myrkdalen',
  'hemavan-vs-riksgransen',
  'hemavan-vs-voss',
  'hemsedal-vs-salen',
  'ischgl-vs-salen',
  'salen-vs-trysil',
  'salen-vs-voss',
]

/**
 * Paren som får ligga i sitemapen och indexeras — unionen av de två
 * listorna ovan.
 *
 * Alla 83 kuraterade par byggs och länkas fortfarande; väljaren och
 * ortsidorna behöver dem, och länkkraften ska fortsätta flöda till
 * ortsidorna. Skillnaden gäller bara vad vi ber Google indexera. 83
 * parsidor var 70 % av sajtens genomsökningsyta på en domän utan
 * inlänkar, och 62 av dem hade Google aldrig hämtat — de trängde undan
 * ortsidorna i kön.
 */
export const INDEXERADE_PAR = new Set([...LANKADE_PAR, ...INDEXERADE_2026_08])

/** Indexerbara par där båda orterna är publicerade. Speglar parSlugsFor. */
export function indexeradeParFor(publiceradeSlugs) {
  const publicerade = new Set(publiceradeSlugs)
  return [...INDEXERADE_PAR].sort().filter((par) =>
    par.split(SKILJETECKEN).every((slug) => publicerade.has(slug))
  )
}

/**
 * Paren där båda orterna faktiskt är publicerade.
 *
 * Listorna ovan är redaktionella och står i koden; publiceringen står i
 * databasen. Går de isär — en ort döljs som Davos och Crans-Montana i
 * migration 013 — ska sidan inte byggas och adressen inte ligga i
 * sitemapen. Utan det här filtret hade en dold ort gett en länkad 404.
 */
export function parSlugsFor(publiceradeSlugs) {
  const publicerade = new Set(publiceradeSlugs)
  return allaParSlugs().filter((par) =>
    par.split(SKILJETECKEN).every((slug) => publicerade.has(slug))
  )
}

/** Paren en given ort förekommer i, för länkar från ortsidan. */
export function parFor(slug, publiceradeSlugs) {
  return parSlugsFor(publiceradeSlugs).filter((par) =>
    par.split(SKILJETECKEN).includes(slug)
  )
}

/** Den andra orten i ett par. */
export function motparten(par, slug) {
  return par.split(SKILJETECKEN).find((s) => s !== slug) || null
}

/**
 * Orterna som ligger närmast en given ort, för länkar mellan ortsidor.
 *
 * Varför blocket finns: ortsidan hade en enda inlänk från sajten själv —
 * startsidan — plus en per parsida orten förekommer i. Åre och Sälen
 * ligger i tjugofyra par var och blev därmed välbesökta av Google, medan
 * Courchevel, Méribel, Verbier, Saas-Fee och Grandvalira inte ingår i
 * något par alls och alltså hade **en** inlänk var.
 *
 * Mätning 2026-08-25 mot Search Console: 62 % av de internlänkade
 * parsidorna var genomsökta mot 21 % av de olänkade, och sjutton av de
 * tjugoen indexerade parsidorna innehåller Åre eller Sälen. Genomsökningen
 * följer internlänkvolym. Sex länkar per ortsida ger 180 nya kanter i
 * länkgrafen och lyfter de fem svältfödda från en inlänk till sju.
 *
 * Urvalet faller genom fyra nivåer och fyller på tills antalet är nått, så
 * att även Grandvalira — ensam ort i Andorra, ingen parsida — får sex
 * länkar. Inom varje nivå sorteras på närhet i pistlängd, eftersom det är
 * det tal som avgör om två orter är jämförbara alternativ.
 */
function egnaVal(resort, alla, antal) {
  const andra = alla.filter((r) => r.slug !== resort.slug)
  const km = (r) => (Number.isFinite(r?.total_pistes_km) ? r.total_pistes_km : 0)
  const storleksnara = (a, b) =>
    Math.abs(km(a) - km(resort)) - Math.abs(km(b) - km(resort)) ||
    a.slug.localeCompare(b.slug)

  const nivaer = [
    // Samma sammankopplade område. Les 3 Vallées är det enda i dag, och
    // där är grannorten det mest relevanta som finns.
    andra.filter((r) => resort.ski_area && r.ski_area === resort.ski_area),
    // Samma land — det svensken faktiskt väljer mellan.
    andra.filter((r) => r.country === resort.country),
    // Samma halva av sajten: Norden eller Alperna.
    andra.filter((r) => arNordisk(r) === arNordisk(resort)),
    // Sista utvägen, så att listan alltid blir full.
    andra,
  ]

  const valda = []
  for (const niva of nivaer) {
    for (const kandidat of [...niva].sort(storleksnara)) {
      if (valda.length >= antal) return valda
      if (!valda.some((v) => v.slug === kandidat.slug)) valda.push(kandidat)
    }
  }
  return valda
}

/**
 * Orterna en ortsida ska länka till — egna val plus de som valt oss.
 *
 * Relationen görs symmetrisk med flit. Första försöket lät varje ort välja
 * sina sex närmaste, och då blev utfallet det omvända mot det avsedda:
 * Frankrikes sju orter fyllde hela sin kvot inom landet och tittade aldrig
 * ut, medan Grandvalira — ensam ort i Andorra — hamnade i nästan ingens
 * lista och fick två inlänkar totalt. Uppmätt i bygget, inte gissat.
 *
 * Med symmetrin gäller att den vi pekar på pekar tillbaka. Varje ort väljer
 * sex, alltså får varje ort minst sex inlänkar, oavsett hur liten dess
 * hörna av kartan är. Det är den egenskap blocket finns för.
 */
export function naraOrter(resort, alla, antal = 6) {
  const egna = egnaVal(resort, alla, antal)
  const pekarHit = alla.filter(
    (r) =>
      r.slug !== resort.slug &&
      !egna.some((v) => v.slug === r.slug) &&
      egnaVal(r, alla, antal).some((v) => v.slug === resort.slug)
  )
  return [...egna, ...pekarHit]
}

// ── Fälten som jämförs ────────────────────────────────────────────────
//
// `riktning` säger vilket håll som är bättre, och används för att märka ut
// det vinnande värdet i tabellen. Den lämnas null där ett högre värde inte
// är bättre utan bara annorlunda: mer blå pist är en fördel för nybörjaren
// och en nackdel för den som vill ha brant, och att döma i den frågan vore
// att låtsas veta vem som läser.

const nummer = (v) => (Number.isFinite(v) ? v.toLocaleString('sv-SE') : null)

// ── Punkterna som bär jämförelsen ─────────────────────────────────────
//
// Sidan visade först arton rader på en gång, alla lika tunga. Det var för
// mycket direkt, och fälten var för svaga: liftkapacitet, längsta nedfart
// och antalet snabba liftar avgör inget resval. De ligger kvar i tabellen
// längre ner för den som vill kontrollera, men de bär inte sidan.
//
// Tre tal står överst. De är valda för att de avgör valet och för att de
// går att lita på: pistkilometrarna och höjderna är kontrollerade mot
// källan, veckokostnaden är ifylld per ort. Snöfallet står inte här — se
// kommentaren om avg_snowfall_cm längre ner.

export const HUVUDPUNKTER = [
  {
    etikett: 'Storleken på området',
    riktning: 'hog',
    varde: (r) => r.total_pistes_km,
    visa: (r) => nummer(r.total_pistes_km) && `${nummer(r.total_pistes_km)} km`,
    enhet: 'pist',
  },
  {
    etikett: 'Vad veckan kostar',
    riktning: 'lag',
    varde: (r) => r.est_weekly_cost_eur,
    visa: (r, kurser) => pris(r.est_weekly_cost_eur, VALUTA_VECKOKOSTNAD, kurser),
    enhet: 'per person',
  },
  {
    // Ur höjderna, inte ur vertical_drop_m — det fältet är större än
    // skillnaden mellan topp och botten för nio orter.
    etikett: 'Fallhöjd',
    riktning: 'hog',
    varde: (r) => r.altitude_top - r.altitude_base,
    visa: (r) => nummer(r.altitude_top - r.altitude_base) && `${nummer(r.altitude_top - r.altitude_base)} m`,
    enhet: 'topp till botten',
  },
]

// Vem orten passar. Poängen är redaktionella omdömen på skalan i
// docs/poangskala.md, inte mätvärden — därför står de som staplar med
// utsatt tal och aldrig som ett samlat betyg.
export const PASSAR = [
  { etikett: 'Nybörjare',  falt: 'beginner_score' },
  { etikett: 'Mellannivå', falt: 'intermediate_score' },
  { etikett: 'Avancerad',  falt: 'expert_score' },
  { etikett: 'Barnfamilj', falt: 'family_friendly_score' },
]

export const GRUPPER = [
  {
    rubrik: 'Området',
    falt: [
      { etikett: 'Pist totalt',    riktning: 'hog', varde: (r) => r.total_pistes_km,        visa: (r) => nummer(r.total_pistes_km) && `${nummer(r.total_pistes_km)} km` },
      { etikett: 'Antal liftar',   riktning: 'hog', varde: (r) => r.total_lifts,            visa: (r) => nummer(r.total_lifts) },
      { etikett: 'Varav snabba',   riktning: 'hog', varde: (r) => r.high_speed_lifts,       visa: (r) => nummer(r.high_speed_lifts) },
      { etikett: 'Längsta nedfart', riktning: 'hog', varde: (r) => r.longest_run_km,        visa: (r) => nummer(r.longest_run_km) && `${nummer(r.longest_run_km)} km` },
      { etikett: 'Liftkapacitet',  riktning: 'hog', varde: (r) => r.lift_capacity_per_hour, visa: (r) => nummer(r.lift_capacity_per_hour) && `${nummer(r.lift_capacity_per_hour)} pers/tim` },
    ],
  },
  {
    rubrik: 'Höjd',
    falt: [
      { etikett: 'Lägsta',   riktning: null,  varde: (r) => r.altitude_base, visa: (r) => nummer(r.altitude_base) && `${nummer(r.altitude_base)} m` },
      { etikett: 'Högsta',   riktning: 'hog', varde: (r) => r.altitude_top,  visa: (r) => nummer(r.altitude_top) && `${nummer(r.altitude_top)} m` },
      // Fallhöjden räknas ur höjderna i stället för att läsas ur
      // vertical_drop_m, som är större än skillnaden mellan topp och botten
      // för nio orter — Ruka har 292 m fallhöjd på ett berg som spänner 201.
      { etikett: 'Fallhöjd', riktning: 'hog', varde: (r) => r.altitude_top - r.altitude_base, visa: (r) => nummer(r.altitude_top - r.altitude_base) && `${nummer(r.altitude_top - r.altitude_base)} m` },
    ],
  },
  {
    rubrik: 'Terräng',
    falt: [
      { etikett: 'Blå',   riktning: null, varde: (r) => r.blue_percent,  visa: (r) => nummer(r.blue_percent) && `${r.blue_percent} %` },
      { etikett: 'Röd',   riktning: null, varde: (r) => r.red_percent,   visa: (r) => nummer(r.red_percent) && `${r.red_percent} %` },
      { etikett: 'Svart', riktning: null, varde: (r) => r.black_percent, visa: (r) => nummer(r.black_percent) && `${r.black_percent} %` },
    ],
  },
  {
    rubrik: 'Snö',
    falt: [
      // "Snöfall per säsong" stod här och läste avg_snowfall_cm. Fältet
      // är borttaget ur allt som renderas, inte bara nedtonat: mätningen
      // 2026-08-12 visar att skiresort.com — sajtens enda källa — inte
      // bär någon säsongssiffra alls, bara aktuellt snödjup. Talen kan
      // alltså inte komma därifrån, och går inte att kontrollera mot
      // något. Kolumnen ligger kvar i databasen; orter döljs och fält
      // slutar visas, ingetdera raderas.
      { etikett: 'Konstsnö',           riktning: null,  varde: (r) => r.snowmaking_coverage_pct,  visa: (r) => nummer(r.snowmaking_coverage_pct) && `${r.snowmaking_coverage_pct} % av pisten` },
    ],
  },
  {
    rubrik: 'Pris',
    falt: [
      { etikett: 'Dagskort',     riktning: 'lag', varde: (r) => r.lift_pass_day_eur,   visa: (r, k) => pris(r.lift_pass_day_eur, VALUTA(r), k) },
      { etikett: 'Veckokort',    riktning: 'lag', varde: (r) => r.lift_pass_week_eur,  visa: (r, k) => pris(r.lift_pass_week_eur, VALUTA(r), k) },
      { etikett: 'Vecka totalt', riktning: 'lag', varde: (r) => r.est_weekly_cost_eur, visa: (r, k) => pris(r.est_weekly_cost_eur, VALUTA_VECKOKOSTNAD, k) },
    ],
  },
]

// Resan har medvetet ingen grupp i tabellen. transfer_minutes mäter bara
// sista biten: Åre står på 60 minuter från Östersund och Chamonix på 75
// från Genève, vilket ställt i två kolumner får Chamonix att se ut att
// ligga en kvart längre bort — fast Åre nås med nattåg från Stockholm och
// Chamonix kräver flyg. Talet är jämförbart inom en region, aldrig mellan
// Norden och Alperna, och en tabell inbjuder till just den jämförelsen.
//
// Sidan har i stället ett eget stycke om resan, överst, där restiden står
// bredvid transport_info och läsaren ser vad talet faktiskt mäter.

// ── Meningarna ────────────────────────────────────────────────────────
//
// Ingen jämförelsesida har prosa skriven för sitt par. 83 par hade blivit
// 83 texter som var för sig kan hamna i strid med fälten så fort en
// migration rättar en siffra — och migration 013 rättade priset på 28
// orter på en dag. Meningarna nedan räknas fram ur samma tal som tabellen
// visar och kan därför inte motsäga den.
//
// Trösklarna finns för att en mening ska bära. "Ischgl har 239 km pist
// mot Söldens 144" är en upplysning; "Trysil har 71 km mot Hemsedals 68"
// är brus som får läsaren att tro att skillnaden betyder något.
//
// Om resan från Sverige sägs ingenting här. Att Åre nås med nattåg och
// Livigno kräver flyg är sidans viktigaste skillnad, men den står bara i
// transport_info — som är prosa. Att läsa ut ett påstående ur den vore
// att gissa; sidan visar texten som den är tills fälten för bil och
// nattåg finns.

/** Ordnar paret efter ett fält, högsta värdet först. Null om något saknas. */
function ordna(a, b, valj) {
  const va = valj(a)
  const vb = valj(b)
  if (!Number.isFinite(va) || !Number.isFinite(vb)) return null

  const forst = va >= vb
  return {
    hog: forst ? a : b,
    lag: forst ? b : a,
    hogV: forst ? va : vb,
    lagV: forst ? vb : va,
    skillnad: Math.abs(va - vb),
    kvot: Math.min(va, vb) > 0 ? Math.max(va, vb) / Math.min(va, vb) : null,
  }
}

/** 1.39 -> 39. Andelen mer, avrundad. */
const merProcent = (kvot) => Math.round((kvot - 1) * 100)

/**
 * Meningarna som beskriver skillnaden mellan två orter.
 *
 * Returnerar en lista strängar i fallande ordning efter vad som skiljer
 * mest i praktiken: storleken på området först, priset sist. Listan kan
 * vara kort — två orter som liknar varandra ska ge få meningar, inte
 * påhittade skillnader.
 */
export function jamforelseMeningar(a, b, kurser) {
  const meningar = []

  const pist = ordna(a, b, (r) => r.total_pistes_km)
  if (pist?.kvot >= 1.25) {
    meningar.push(
      `${pist.hog.name} har ${nummer(pist.hogV)} km pist mot ${nummer(pist.lagV)} km i ${pist.lag.name} — ${merProcent(pist.kvot)} % mer att åka på.`
    )
  } else if (pist) {
    meningar.push(
      `Områdena är ungefär lika stora: ${nummer(pist.hogV)} km pist i ${pist.hog.name}, ${nummer(pist.lagV)} km i ${pist.lag.name}.`
    )
  }

  const liftar = ordna(a, b, (r) => r.total_lifts)
  if (liftar?.kvot >= 1.4) {
    meningar.push(
      `${liftar.hog.name} har ${nummer(liftar.hogV)} liftar, ${liftar.lag.name} ${nummer(liftar.lagV)}.`
    )
  }

  const topp = ordna(a, b, (r) => r.altitude_top)
  if (topp && topp.skillnad >= 400) {
    meningar.push(
      `Högsta punkten ligger ${nummer(topp.skillnad)} m högre i ${topp.hog.name}: ${nummer(topp.hogV)} m mot ${nummer(topp.lagV)} m.`
    )
  }

  const fall = ordna(a, b, (r) => r.altitude_top - r.altitude_base)
  if (fall && fall.skillnad >= 400) {
    meningar.push(
      `Fallhöjden är ${nummer(fall.hogV)} m i ${fall.hog.name} och ${nummer(fall.lagV)} m i ${fall.lag.name}.`
    )
  }

  // Andelarna säger inte vilken ort som är bäst, bara vem terrängen
  // passar. Att döma i den frågan vore att låtsas veta vem som läser —
  // samma skäl som riktning är null för de fälten i tabellen.
  const bla = ordna(a, b, (r) => r.blue_percent)
  if (bla && bla.skillnad >= 10) {
    meningar.push(
      `${bla.hog.name} har ${bla.hogV} % blå pist mot ${bla.lagV} % i ${bla.lag.name}.`
    )
  }

  const svart = ordna(a, b, (r) => r.black_percent)
  if (svart && svart.skillnad >= 8) {
    meningar.push(
      `Svart pist utgör ${svart.hogV} % av ${svart.hog.name} och ${svart.lagV} % av ${svart.lag.name}.`
    )
  }

  // Ingen mening om avg_snowfall_cm — fältet visas inte längre alls, se
  // kommentaren i GRUPPER ovan.

  const konstsno = ordna(a, b, (r) => r.snowmaking_coverage_pct)
  if (konstsno && konstsno.skillnad >= 25) {
    meningar.push(
      `Konstsnön täcker ${konstsno.hogV} % av pisten i ${konstsno.hog.name} och ${konstsno.lagV} % i ${konstsno.lag.name}.`
    )
  }

  // Beloppen skrivs i kronor, som överallt annars på sidan. Utan kurser
  // skrivs ingen prismening alls — hellre en mening mindre än ett belopp
  // i en valuta läsaren får räkna om själv mitt i en svensk text.
  const kronor = (belopp, ort) => pris(belopp, VALUTA(ort), kurser)?.kr

  const vecka = ordna(a, b, (r) => r.lift_pass_week_eur)
  if (vecka?.kvot >= 1.15 && kronor(vecka.hogV, vecka.hog) && kronor(vecka.lagV, vecka.lag)) {
    meningar.push(
      `Veckokortet kostar ${kronor(vecka.hogV, vecka.hog)} i ${vecka.hog.name}, ${merProcent(vecka.kvot)} % mer än ${kronor(vecka.lagV, vecka.lag)} i ${vecka.lag.name}.`
    )
  }

  const total = ordna(a, b, (r) => r.est_weekly_cost_eur)
  if (total?.kvot >= 1.2 && kronor(total.hogV, total.hog) && kronor(total.lagV, total.lag)) {
    meningar.push(
      `Hela veckan kostar uppskattningsvis ${kronor(total.hogV, total.hog)} per person i ${total.hog.name} mot ${kronor(total.lagV, total.lag)} i ${total.lag.name}, resa och boende inräknat.`
    )
  }

  return meningar
}
