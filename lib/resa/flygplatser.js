import { TRANSFER } from './transfer'

/**
 * Flygplatserna reseplaneraren räknar med.
 *
 * Koordinaterna kommer från OurAirports (ourairports.com/data, public
 * domain), hämtade 2026-11-25. De används till två saker: vägen hemifrån
 * till avreseflygplatsen räknas mot dem, och flygbågen på kartan ritas
 * mellan dem.
 *
 * AVRESA är flygplatser man reser från i Sverige, plus Köpenhamn och Oslo
 * som är närmast för många i Skåne och Värmland. Vilka flyg som faktiskt
 * går avgörs inte här utan av flygdatan (app/api/flyg), så en flygplats
 * utan flyg till orten faller bort av sig själv.
 */

export const FLYGPLATSER = {
  // Sverige
  ARN: { namn: 'Stockholm Arlanda', lat: 59.6485, lng: 17.9288 },
  BMA: { namn: 'Stockholm Bromma', lat: 59.3544, lng: 17.9417 },
  NYO: { namn: 'Stockholm Skavsta', lat: 58.7897, lng: 16.9115 },
  VST: { namn: 'Västerås', lat: 59.5894, lng: 16.6336 },
  GOT: { namn: 'Göteborg Landvetter', lat: 57.6628, lng: 12.2798 },
  MMX: { namn: 'Malmö Sturup', lat: 55.5356, lng: 13.3763 },
  AGH: { namn: 'Ängelholm-Helsingborg', lat: 56.2961, lng: 12.8471 },
  HAD: { namn: 'Halmstad', lat: 56.6911, lng: 12.8202 },
  RNB: { namn: 'Ronneby', lat: 56.2667, lng: 15.265 },
  VXO: { namn: 'Växjö', lat: 56.9291, lng: 14.728 },
  JKG: { namn: 'Jönköping', lat: 57.7576, lng: 14.0687 },
  NRK: { namn: 'Norrköping', lat: 58.5863, lng: 16.2506 },
  VBY: { namn: 'Visby', lat: 57.6628, lng: 18.3462 },
  ORB: { namn: 'Örebro', lat: 59.2237, lng: 15.038 },
  KSD: { namn: 'Karlstad', lat: 59.4447, lng: 13.3374 },
  SDL: { namn: 'Sundsvall-Härnösand', lat: 62.5281, lng: 17.4439 },
  OSD: { namn: 'Åre Östersund', lat: 63.1935, lng: 14.5042 },
  UME: { namn: 'Umeå', lat: 63.7918, lng: 20.2828 },
  SFT: { namn: 'Skellefteå', lat: 64.6248, lng: 21.0769 },
  LLA: { namn: 'Luleå', lat: 65.5438, lng: 22.122 },
  KRN: { namn: 'Kiruna', lat: 67.822, lng: 20.3368 },
  HMV: { namn: 'Hemavan', lat: 65.8061, lng: 15.0828 },
  SCR: { namn: 'Scandinavian Mountains (Sälen)', lat: 61.1651, lng: 12.8335 },
  // Grannländer
  CPH: { namn: 'Köpenhamn Kastrup', lat: 55.6179, lng: 12.656 },
  OSL: { namn: 'Oslo Gardermoen', lat: 60.1939, lng: 11.1004 },
  TRF: { namn: 'Sandefjord Torp', lat: 59.1867, lng: 10.2586 },
  BGO: { namn: 'Bergen', lat: 60.2934, lng: 5.2181 },
  TRD: { namn: 'Trondheim', lat: 63.4578, lng: 10.924 },
  EVE: { namn: 'Harstad/Narvik', lat: 68.4913, lng: 16.6781 },
  KTT: { namn: 'Kittilä', lat: 67.701, lng: 24.8468 },
  RVN: { namn: 'Rovaniemi', lat: 66.5633, lng: 25.8298 },
  KAO: { namn: 'Kuusamo', lat: 65.9876, lng: 29.2394 },
  // Alperna och vägen dit
  INN: { namn: 'Innsbruck', lat: 47.2603, lng: 11.3439 },
  SZG: { namn: 'Salzburg', lat: 47.7933, lng: 13.0043 },
  MUC: { namn: 'München', lat: 48.3538, lng: 11.7861 },
  FDH: { namn: 'Friedrichshafen', lat: 47.6713, lng: 9.5115 },
  ZRH: { namn: 'Zürich', lat: 47.458, lng: 8.5481 },
  BSL: { namn: 'Basel-Mulhouse', lat: 47.6007, lng: 7.5211 },
  GVA: { namn: 'Genève', lat: 46.2381, lng: 6.109 },
  LYS: { namn: 'Lyon', lat: 45.726, lng: 5.0901 },
  GNB: { namn: 'Grenoble', lat: 45.3629, lng: 5.3294 },
  CMF: { namn: 'Chambéry', lat: 45.6381, lng: 5.8802 },
  TRN: { namn: 'Turin', lat: 45.2008, lng: 7.6496 },
  MXP: { namn: 'Milano Malpensa', lat: 45.6306, lng: 8.7281 },
  LIN: { namn: 'Milano Linate', lat: 45.4451, lng: 9.2767 },
  BGY: { namn: 'Bergamo', lat: 45.6694, lng: 9.7089 },
  VRN: { namn: 'Verona', lat: 45.395, lng: 10.8873 },
  VCE: { namn: 'Venedig', lat: 45.5053, lng: 12.3519 },
  BZO: { namn: 'Bolzano', lat: 46.4592, lng: 11.3261 },
  TLS: { namn: 'Toulouse', lat: 43.6291, lng: 1.3638 },
  BCN: { namn: 'Barcelona', lat: 41.2971, lng: 2.0785 },
}

/** Flygplatser man kan resa ifrån. */
const AVRESA = [
  'ARN', 'BMA', 'NYO', 'VST', 'GOT', 'MMX', 'AGH', 'HAD', 'RNB', 'VXO', 'JKG', 'NRK',
  'VBY', 'ORB', 'KSD', 'SDL', 'OSD', 'UME', 'SFT', 'LLA', 'KRN', 'CPH', 'OSL',
]

/** De tre stora, som har flest utrikesflyg. Den närmaste av dem tas alltid med. */
const NAV = ['ARN', 'GOT', 'CPH']

/** Avstånd i km fågelvägen. */
export function avstandKm(a, b) {
  const rad = (x) => (x * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLng = rad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(h))
}

/**
 * Avreseflygplatser att pröva för en adress: de två närmaste, och den
 * närmaste av Arlanda, Landvetter och Kastrup om den inte redan är med.
 */
export function avreseFor(hem) {
  const sorterade = AVRESA
    .map((kod) => ({ kod, km: avstandKm(hem, FLYGPLATSER[kod]) }))
    .sort((a, b) => a.km - b.km)
  const valda = sorterade.slice(0, 2).map((x) => x.kod)
  const nav = sorterade.find((x) => NAV.includes(x.kod))
  if (nav && !valda.includes(nav.kod)) valda.push(nav.kod)
  return valda
}

/**
 * Ankomstflygplatser för en ort: porten i databasen först, sedan de med
 * kortast bilväg till orten (lib/resa/transfer.js), så att ett direktflyg
 * till München inte missas för att porten heter Innsbruck.
 */
export function ankomstFor(slug, portkod) {
  const alla = [portkod, ...(TRANSFER[slug] || []).map(([kod]) => kod)].filter((k) => k && FLYGPLATSER[k])
  return [...new Set(alla)]
}

/**
 * Vanliga bytesflygplatser på vägen till Alperna, som inte finns i
 * FLYGPLATSER. Används bara för att skriva ut var bytet sker och rita
 * flygbågen via den; koordinaterna är avrundade till två decimaler.
 */
export const BYTESPLATSER = {
  FRA: { namn: 'Frankfurt', lat: 50.03, lng: 8.57 },
  AMS: { namn: 'Amsterdam', lat: 52.31, lng: 4.76 },
  CDG: { namn: 'Paris', lat: 49.01, lng: 2.55 },
  VIE: { namn: 'Wien', lat: 48.11, lng: 16.57 },
  WAW: { namn: 'Warszawa', lat: 52.17, lng: 20.97 },
  HEL: { namn: 'Helsingfors', lat: 60.32, lng: 24.96 },
  BRU: { namn: 'Bryssel', lat: 50.90, lng: 4.48 },
  LHR: { namn: 'London Heathrow', lat: 51.47, lng: -0.45 },
  IST: { namn: 'Istanbul', lat: 41.28, lng: 28.75 },
  DUS: { namn: 'Düsseldorf', lat: 51.29, lng: 6.77 },
  BER: { namn: 'Berlin', lat: 52.37, lng: 13.50 },
  HAM: { namn: 'Hamburg', lat: 53.63, lng: 9.99 },
  RIX: { namn: 'Riga', lat: 56.92, lng: 23.97 },
}

/** Namn och läge för en flygplatskod, eller null. */
export function flygplats(kod) {
  return FLYGPLATSER[kod] || BYTESPLATSER[kod] || null
}
