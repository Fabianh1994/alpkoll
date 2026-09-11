/**
 * Restid hemifrån.
 *
 * transfer_minutes i databasen är sista biten, från flygplatsen till byn.
 * Den säger ingenting om hur lång resan är från Sverige, och det är den
 * frågan folk faktiskt söker på: "sälen stockholm" gav 20 exponeringar i
 * Search Console i augusti, och resefrågorna 45 tillsammans.
 *
 * Talen låg tidigare utspridda i transport_info som löptext — "fyra och en
 * halv timme från Stockholm" för Sälen, "knappt sex timmar" för Trysil.
 * De gick inte att ställa bredvid varandra, och de var inte mätta enligt
 * någon metod. Sälens fyra och en halv timme visade sig vara för optimistisk
 * med en och en halv timme.
 *
 *
 * ── BILEN: SAMMA METOD FÖR ALLA ORTER ─────────────────────────────────
 *
 * Varje sträcka är beräknad med OSRM mot OpenStreetMaps vägnät, från
 * stadens centrum till ortens koordinat i databasen. Hämtat 2026-09-09.
 *
 * Att det är en och samma ruttmotor för alla trettio orter är hela
 * poängen, av samma skäl som skiresort.com är enda källa för pisttalen:
 * blandade källor gör orterna ojämförbara. En sträcka går att räkna om
 * och få samma svar.
 *
 * Vad talen INTE vet: trafik, vinterväglag, färjor och raster. En
 * februarikörning över Hardangervidda tar längre tid än motorvägssnitt.
 * Talen är därför ett jämförelsemått mellan orter, inte en utlovad
 * ankomsttid — och de skrivs ut som ungefärliga.
 */

/** Städerna vi räknar ifrån, med koordinaten som användes. */
export const STADER = [
  { namn: 'Stockholm', nyckel: 'Stockholm', lat: 59.3293, lon: 18.0686 },
  { namn: 'Göteborg', nyckel: 'Goteborg', lat: 57.7089, lon: 11.9746 },
  { namn: 'Malmö', nyckel: 'Malmo', lat: 55.605, lon: 13.0038 },
]

/** Dagen sträckorna räknades. */
export const BIL_HAMTAD = '2026-09-09'

/** slug -> stad -> [kilometer, minuter]. */
export const BIL = {
  'alpe-d-huez': { Stockholm: [2375, 1521], Goteborg: [2032, 1289], Malmo: [1758, 1108] },
  'are': { Stockholm: [654, 519], Goteborg: [849, 767], Malmo: [1264, 931] },
  'chamonix': { Stockholm: [2186, 1390], Goteborg: [1843, 1158], Malmo: [1569, 976] },
  'cortina-d-ampezzo': { Stockholm: [2217, 1423], Goteborg: [1875, 1191], Malmo: [1600, 1010] },
  'courchevel': { Stockholm: [2308, 1493], Goteborg: [1965, 1261], Malmo: [1691, 1079] },
  'geilo': { Stockholm: [745, 636], Goteborg: [510, 431], Malmo: [780, 616] },
  'grandvalira': { Stockholm: [2846, 1810], Goteborg: [2503, 1578], Malmo: [2229, 1397] },
  'hemavan': { Stockholm: [900, 739], Goteborg: [1254, 1034], Malmo: [1511, 1151] },
  'hemsedal': { Stockholm: [727, 619], Goteborg: [491, 415], Malmo: [761, 599] },
  'ischgl': { Stockholm: [2053, 1301], Goteborg: [1710, 1069], Malmo: [1436, 888] },
  'kitzbuehel': { Stockholm: [2023, 1267], Goteborg: [1680, 1036], Malmo: [1406, 854] },
  'les-arcs': { Stockholm: [2286, 1511], Goteborg: [1943, 1279], Malmo: [1669, 1098] },
  'levi': { Stockholm: [1223, 958], Goteborg: [1577, 1254], Malmo: [1834, 1370] },
  'livigno': { Stockholm: [2097, 1347], Goteborg: [1754, 1115], Malmo: [1480, 934] },
  'madonna-di-campiglio': { Stockholm: [2276, 1466], Goteborg: [1933, 1234], Malmo: [1659, 1053] },
  'mayrhofen': { Stockholm: [2054, 1287], Goteborg: [1711, 1056], Malmo: [1437, 874] },
  'meribel': { Stockholm: [2301, 1486], Goteborg: [1958, 1254], Malmo: [1684, 1073] },
  'myrkdalen': { Stockholm: [917, 822], Goteborg: [681, 618], Malmo: [951, 803] },
  'riksgransen': { Stockholm: [1365, 1055], Goteborg: [1719, 1351], Malmo: [1975, 1467] },
  'ruka': { Stockholm: [1320, 1053], Goteborg: [1674, 1349], Malmo: [1931, 1465] },
  'saas-fee': { Stockholm: [2234, 1419], Goteborg: [1891, 1187], Malmo: [1617, 1005] },
  'salen': { Stockholm: [397, 353], Goteborg: [464, 415], Malmo: [734, 600] },
  'solden': { Stockholm: [2032, 1310], Goteborg: [1689, 1078], Malmo: [1415, 896] },
  'st-anton': { Stockholm: [2015, 1264], Goteborg: [1672, 1032], Malmo: [1398, 851] },
  'tignes': { Stockholm: [2273, 1506], Goteborg: [1931, 1274], Malmo: [1656, 1093] },
  'trysil': { Stockholm: [467, 418], Goteborg: [499, 383], Malmo: [768, 568] },
  'val-thorens': { Stockholm: [2320, 1504], Goteborg: [1978, 1272], Malmo: [1703, 1091] },
  'verbier': { Stockholm: [2169, 1372], Goteborg: [1827, 1140], Malmo: [1552, 958] },
  'voss': { Stockholm: [886, 781], Goteborg: [651, 576], Malmo: [920, 761] },
  'zermatt': { Stockholm: [2244, 1429], Goteborg: [1901, 1197], Malmo: [1626, 1016] },
}

/**
 * Snälltågets tre vinterlinjer.
 *
 * Samma operatör tar svensken till både fjällen och Alperna, vilket är
 * värt att skriva ut: den som kan tänka sig tåg till Sälen kan tänka sig
 * tåg till Kitzbühel.
 *
 * ── UPPDATERAS VARJE HÖST, TILLSAMMANS MED lib/nattaget.js ────────────
 *
 * Snälltåget skriver själva att tiderna kan avvika på grund av banarbeten,
 * och Sälenlinjens tider var uttryckligen preliminära när de hämtades.
 * Därför står klockslagen bara där de är publicerade som tider, och sidan
 * säger vad som gäller i stället för att låtsas om exakthet.
 *
 * Hämtat 2026-09-09 från snalltaget.se.
 */
export const TAGLINJER = [
  {
    id: 'fjallen-jamtland',
    // Orten ortsidan nämner linjen på, och sista trafikdagen. Efter den
    // slutar ortsidan tala om tåget — se linjeFor nedan.
    ort: 'are',
    slut: '2027-05-02',
    rubrik: 'Nattåget till Åre',
    period: '16 december 2026 till 2 maj 2027',
    dagar: 'onsdag, torsdag, lördag och söndag',
    // Stockholm 22.55 -> Åre 07.35 är åtta timmar och fyrtio minuter.
    // Räknas inte fram här: klockslagen är hämtade, differensen är den
    // enda uppgiften vi lägger till, och den står i restidMin.
    fran: [
      { stad: 'Stockholm', avgang: '22.55', restidMin: 520 },
      { stad: 'Malmö', avgang: '15.25–16.35', restidMin: null },
    ],
    framme: 'Åre 07.35, Östersund 06.05, Vemdalen-Röjan 08.10',
    kalla: 'https://www.snalltaget.se/tag-till-jamtland-harjedalen-vinter',
    forbehall: 'Snälltåget anger att tiderna kan avvika på grund av banarbeten.',
  },
  {
    id: 'salen-mora',
    ort: 'salen',
    slut: '2027-04-10',
    rubrik: 'Tåget till Sälen',
    period: 'lördagar 19 december 2026 till 10 april 2027',
    dagar: 'lördagar',
    fran: [
      { stad: 'Malmö', avgang: '05.55', restidMin: null },
      { stad: 'Stockholm', avgang: '10.55', restidMin: null },
    ],
    framme: 'Mora 14.05, buss vidare till Lindvallen, Högfjället, Tandådalen och Hundfjället 16.50–17.25',
    // Rutten går via Stockholm de flesta lördagar och via Göteborg fyra
    // gånger. Datumen står här därför att 13 februari är lördagen som
    // startar Göteborgs sportlovsvecka — se app/sportlov.
    viaGoteborgUt: ['2027-01-23', '2027-02-13', '2027-03-06', '2027-03-13'],
    viaGoteborgHem: ['2027-01-30', '2027-02-20', '2027-03-13', '2027-03-20'],
    kalla: 'https://www.snalltaget.se/tag-till-salen',
    forbehall: 'Tiderna var preliminära när de hämtades och fastställs under hösten.',
  },
]

/**
 * Linjen till en ort, eller null när orten saknar linje eller linjens
 * säsong är över. Samma hållning som sasongenSlut i lib/nattaget.js: en
 * utgången tidtabell som ser aktuell ut är värre än ingen uppgift alls.
 *
 * Båda linjerna slutar efter omställningen till sommartid, därav +02:00.
 */
export function linjeFor(slug, idag = new Date()) {
  const linje = TAGLINJER.find((t) => t.ort === slug)
  if (!linje) return null
  return idag > new Date(`${linje.slut}T23:59:59+02:00`) ? null : linje
}

/** Bilresan till en ort från en stad, eller null. */
export function bilresa(slug, stadNyckel) {
  const rad = BIL[slug]
  const v = rad && rad[stadNyckel]
  return v ? { km: v[0], minuter: v[1] } : null
}

/**
 * 519 -> "8,5 tim". Timmar med en decimal, eftersom en halvtimme är
 * skillnad nog att planera efter på en åttatimmarsresa.
 */
export function timmar(minuter) {
  if (!Number.isFinite(minuter) || minuter <= 0) return null
  return (minuter / 60).toFixed(1).replace('.', ',') + ' tim'
}

/** Orterna sorterade på bilrestid från en stad. */
export function narmastMedBil(stadNyckel, slugs) {
  return slugs
    .map((slug) => ({ slug, ...bilresa(slug, stadNyckel) }))
    .filter((x) => x.minuter)
    .sort((a, b) => a.minuter - b.minuter)
}
