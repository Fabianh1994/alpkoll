/**
 * Snälltågets nattåg Malmö–Österrike, vintern 2026/27.
 *
 * Varför det ligger i kod och inte i databasen: det här beskriver en
 * tågoperatörs tidtabell, inte en egenskap hos orten. Ischgl slutar inte
 * vara Ischgl för att Snälltåget lägger om linjen. Samma skäl som stod i
 * lib/ellerAlperna.js när listan var fyra slugs på en rad — men nu med
 * stationerna och bussarna med, eftersom det var just de som saknades.
 *
 * Hämtat 2026-08-30 från snalltaget.se/tag-till-osterrike-vinter och
 * snalltaget.se/anslutande-transfer-osterrike.
 *
 *
 * ── Felet den här filen rättar ────────────────────────────────────────
 *
 * Alpsidorna skrev: "Med det når du 4 av orterna nedan direkt, utan
 * flygplats och utan transfer." De fyra var Sölden, Ischgl, St. Anton och
 * Mayrhofen, och tåget stannar inte i någon av dem — alla fyra kräver
 * transferbuss. Orten tåget faktiskt stannar i, Kitzbühel, saknades i
 * listan. Meningen namngav alltså fyra orter som kräver byte och
 * utelämnade den enda som inte gör det.
 *
 * Därför är listan inte längre skriven för hand. Sidan räknar fram sin
 * mening ur STATIONER och ORTER nedan, så att ett påstående om bytesfrihet
 * inte kan överleva att datan ändras.
 */

export const SASONG = '18 december 2026 till 14 mars 2027'

/** Avgång från Sverige och ankomst hem. Tåg 305 ut, 304 hem. */
export const SVERIGE = {
  // Stationsnamnet för tabeller, stadsnamnet för löptext. "Malmö C–
  // Österrike" läser som en biljett, inte som en mening.
  avgangsstation: 'Malmö C',
  avgangsort: 'Malmö',
  avgang: '14.55',
  avgangsdag: 'fredag',
  hemkomst: '15.45',
  hemkomstdag: 'söndag',
  // Stockholm står med i tidtabellen men bara för en enda avgång.
  // Skrivs den ut utan förbehåll läser den som ett veckotåg.
  stockholmsavgang: {
    datum: '26 februari 2027',
    avgang: '09.00',
    retur: '6 mars 2027',
    hemkomst: '22.15',
    anledning: 'Stockholms sportlov, vecka 9',
  },
  anslutningar: ['Stockholm', 'Södertälje', 'Norrköping', 'Linköping', 'Nässjö', 'Alvesta'],
}

/**
 * Stationerna i Österrike, i tågets ordning.
 *
 * `ut` är ankomst på lördagsmorgonen, `hem` avgång på lördagskvällen.
 * `restidMin` är räknad från Malmö 14.55 på fredagen — inte hämtad, utan
 * uträknad ur de två klockslagen, vilket är den enda uppgiften på sidan
 * som inte står i tidtabellen i klartext.
 */
export const STATIONER = [
  { namn: 'St. Johann im Pongau', ut: '10.16', hem: '22.47', restidMin: 1161 },
  { namn: 'Zell am See',          ut: '10.57', hem: '21.06', restidMin: 1202 },
  { namn: 'St. Johann in Tirol',  ut: '11.42', hem: '20.22', restidMin: 1247 },
  { namn: 'Kitzbühel',            ut: '11.53', hem: '20.11', restidMin: 1258 },
  { namn: 'Jenbach',              ut: '12.41', hem: '19.23', restidMin: 1306 },
  { namn: 'Innsbruck Hbf',        ut: '13.02', hem: '19.00', restidMin: 1327 },
]

/**
 * Alpkolls orter som går att nå med tåget, och hur.
 *
 * `station` är där man kliver av. `hallplats` är var bussen släpper av i
 * byn — Snälltåget namnger platsen, vilket är mer än vad någon svensk
 * skidsajt skriver ut.
 *
 * Snälltågets transferbussar går även till Obertauern, Wagrain,
 * Bad Gastein, Saalbach-Hinterglemm, Zell am Ziller och Obergurgl. De
 * står inte här därför att de inte är publicerade orter på Alpkoll.
 */
export const ORTER = [
  {
    slug: 'kitzbuehel',
    station: 'Kitzbühel',
    buss: false,
    hallplats: null,
    not: 'Tåget stannar i orten. Ingen buss, ingen flygplats, inget byte.',
  },
  {
    slug: 'solden',
    station: 'Innsbruck Hbf',
    buss: true,
    hallplats: 'Freizeit Arena',
    not: null,
  },
  {
    slug: 'ischgl',
    station: 'Innsbruck Hbf',
    buss: true,
    hallplats: 'Florianplatz',
    not: null,
  },
  {
    slug: 'st-anton',
    station: 'Innsbruck Hbf',
    buss: true,
    hallplats: 'Terminal Ost',
    not: null,
  },
  {
    // Snälltåget listar hållplatsen i Mayrhofen men skriver inte ut vilken
    // station transfern utgår från. Jenbach är Zillertals järnvägsknut och
    // anges som utgångsstation för Zell am Ziller, längre ner i samma dal
    // — men att dra slutsatsen därav vore att gissa. Fältet står tomt tills
    // det går att belägga.
    slug: 'mayrhofen',
    station: null,
    buss: true,
    hallplats: 'Sport & Spa Hotel Strass',
    not: 'Snälltåget skriver inte ut vilken station bussen till Mayrhofen utgår från.',
  },
]

/** Slugs som går att nå med tåget. Ersätter den handskrivna listan. */
export const NATTAGSORTER = ORTER.map((o) => o.slug)

/** Orterna tåget stannar i, utan buss. */
export const UTAN_BUSS = ORTER.filter((o) => !o.buss)

/** Uppgiften för en ort, eller null. */
export const nattagFor = (slug) => ORTER.find((o) => o.slug === slug) || null

/** 1258 -> "20 h 58 min". */
export function restidText(minuter) {
  if (!Number.isFinite(minuter)) return null
  const h = Math.floor(minuter / 60)
  const m = minuter % 60
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}

/** Stationens rad, för en ort som har en utsatt station. */
export const stationFor = (slug) => {
  const ort = nattagFor(slug)
  return ort?.station ? STATIONER.find((s) => s.namn === ort.station) || null : null
}

/**
 * Praktiska tal en svensk söker på och som ingen skidsajt svarar på.
 * Priser i kronor, hämtade samma dag som tidtabellen.
 */
export const PRAKTISKT = {
  skidincheckningKr: 698,
  skidincheckningNot: 'tur och retur, obligatorisk i sittplats och delad kupé',
  frukostKr: 99,
  baraTurOchRetur: true,
  baraTurOchReturUndantag: '19 december 2026 och 12 mars 2027',
  djurTillatna: false,
}
