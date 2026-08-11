// Jämförelsesidorna — /jamfor/<a>-vs-<b>.
//
// Två sorters par får en sida:
//
//   Kors-par   {Åre, Sälen} mot alporter. Det här är sidorna som svarar på
//              det val svensken faktiskt står inför: stanna i Norden eller
//              åka till Alperna. Listan över alporter är redaktionell —
//              databasen har inget fält för hur ofta en svensk överväger en
//              ort, och pistkilometer är fel mått på det.
//
//   Nordiska   alla par bland de elva nordiska orterna.
//
// Alporter ställs medvetet inte mot varandra. Chamonix mot Val d'Isère är en
// sida varje internationell skidsajt redan skrivit; den kan vi inte vinna.

import { euro } from './pris'

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
 * Returnerar null för adresser som inte är ett par vi bygger. `kanonisk`
 * är false när ordningen är omvänd — sidan svarar då med en permanent
 * vidarebefordran istället för innehåll.
 */
export function tolkaPar(slug) {
  const delar = String(slug || '').split(SKILJETECKEN)
  if (delar.length !== 2) return null

  const [forst, sedan] = delar
  if (!forst || !sedan || forst === sedan) return null

  const kanonisk = parSlug(forst, sedan)
  if (!PAR_ADRESSER.has(kanonisk)) return null

  return {
    slugs: [forst, sedan],
    kanoniskSlug: kanonisk,
    kanonisk: kanonisk === slug,
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

// ── Fälten som jämförs ────────────────────────────────────────────────
//
// `riktning` säger vilket håll som är bättre, och används för att märka ut
// det vinnande värdet i tabellen. Den lämnas null där ett högre värde inte
// är bättre utan bara annorlunda: mer blå pist är en fördel för nybörjaren
// och en nackdel för den som vill ha brant, och att döma i den frågan vore
// att låtsas veta vem som läser.

const nummer = (v) => (Number.isFinite(v) ? v.toLocaleString('sv-SE') : null)

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
      // Riktningen är null tills fältet är mätt mot källan — se
      // kommentaren om avg_snowfall_cm i jamforelseMeningar. Att märka ut
      // ett värde som det bättre är att gå i god för det.
      { etikett: 'Snöfall per säsong', riktning: null,  varde: (r) => r.avg_snowfall_cm,          visa: (r) => nummer(r.avg_snowfall_cm) && `${nummer(r.avg_snowfall_cm)} cm` },
      { etikett: 'Konstsnö',           riktning: null,  varde: (r) => r.snowmaking_coverage_pct,  visa: (r) => nummer(r.snowmaking_coverage_pct) && `${r.snowmaking_coverage_pct} % av pisten` },
    ],
  },
  {
    rubrik: 'Pris',
    falt: [
      { etikett: 'Dagskort',    riktning: 'lag', varde: (r) => r.lift_pass_day_eur,   visa: (r) => nummer(r.lift_pass_day_eur) && `€${nummer(r.lift_pass_day_eur)}` },
      { etikett: 'Veckokort',   riktning: 'lag', varde: (r) => r.lift_pass_week_eur,  visa: (r) => nummer(r.lift_pass_week_eur) && `€${nummer(r.lift_pass_week_eur)}` },
      { etikett: 'Vecka totalt', riktning: 'lag', varde: (r) => r.est_weekly_cost_eur, visa: (r) => nummer(r.est_weekly_cost_eur) && `€${nummer(r.est_weekly_cost_eur)}` },
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
export function jamforelseMeningar(a, b) {
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

  // Ingen mening om avg_snowfall_cm. Fältet bär samma signatur som
  // pistfördelningen gjorde innan migration 013: alla 30 publicerade
  // värden är delbara med tio och det finns bara elva unika tal bland
  // dem. Det är inte bevis för att fältet är gissat, men det är samma
  // mönster som en gång såg ut som research och inte var det — och en
  // mening under "Skillnaden i korthet" är ett starkare påstående än en
  // rad i tabellen. Raden står kvar, som på ortsidorna; meningen väntar
  // tills fältet är mätt mot källan.

  const konstsno = ordna(a, b, (r) => r.snowmaking_coverage_pct)
  if (konstsno && konstsno.skillnad >= 25) {
    meningar.push(
      `Konstsnön täcker ${konstsno.hogV} % av pisten i ${konstsno.hog.name} och ${konstsno.lagV} % i ${konstsno.lag.name}.`
    )
  }

  // Liftkortet skrivs med € före talet, som i tabellen och på
  // ortsidorna. Veckokostnaden nedan är den enda summa som skrivs på
  // svenskt vis — den är en uppskattning, inte ett pris, och euro() i
  // lib/pris.js håller ihop den formen med ortsidan.
  const vecka = ordna(a, b, (r) => r.lift_pass_week_eur)
  if (vecka?.kvot >= 1.15) {
    meningar.push(
      `Veckokortet kostar €${nummer(vecka.hogV)} i ${vecka.hog.name}, ${merProcent(vecka.kvot)} % mer än €${nummer(vecka.lagV)} i ${vecka.lag.name}.`
    )
  }

  const total = ordna(a, b, (r) => r.est_weekly_cost_eur)
  if (total?.kvot >= 1.2) {
    meningar.push(
      `Hela veckan kostar uppskattningsvis ${euro(total.hogV)} per person i ${total.hog.name} mot ${euro(total.lagV)} i ${total.lag.name}, resa och boende inräknat.`
    )
  }

  return meningar
}
