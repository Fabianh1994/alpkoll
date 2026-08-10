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

import { formateraRestid } from './travel'

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
      { etikett: 'Snöfall per säsong', riktning: 'hog', varde: (r) => r.avg_snowfall_cm,          visa: (r) => nummer(r.avg_snowfall_cm) && `${nummer(r.avg_snowfall_cm)} cm` },
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
  {
    rubrik: 'Resan',
    falt: [
      { etikett: 'Flyg till',        riktning: null, varde: () => null, visa: (r) => r.nearest_airport || null },
      // Etiketten säger "från flygplatsen" med flit. transfer_minutes mäter
      // bara sista biten: Åre står på 60 minuter från Östersund och
      // Chamonix på 75 från Genève, vilket läst rakt av får Chamonix att se
      // ut att ligga en kvart längre bort — fast Åre nås med nattåg från
      // Stockholm och Chamonix kräver flyg. Talet är jämförbart inom en
      // region, aldrig mellan Norden och Alperna.
      { etikett: 'Från flygplatsen', riktning: null, varde: () => null, visa: (r) => formateraRestid(r.transfer_minutes) },
    ],
  },
]
