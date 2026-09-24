// Booking.com-länkar, spårade via affiliatenätverket CJ.
//
// Booking tar nordiska partner via CJ ("Nordics Affiliate Programme powered
// by CJ"), inte via Partner Hub. Klicket går till CJ:s klicklänk, som
// registrerar det och skickar vidare till adressen i `url`. Formatet är
// avläst i CJ:s GET CODE för länken "Evergreen Link for Booking.com Nordics".
//
// Bookings eget aid ska INTE med i adressen: spårningen är CJ:s.
//
// SPARNING är huvudbrytaren. Satt till false byggs en vanlig söklänk utan
// provision, och annonsmärkningen och CJ-stycket i integritetspolicyn släcks
// i samma deploy — de hänger alla på hasAffiliateId.

const SPARNING = true

// Booking Blue enligt Booking.com Brand Standards 2.1 (dec 2020). Vit logga på
// den här blå är ett av deras två godkända huvudalternativ.
export const BOOKING_BLA = '#003B95'

const CJ_PID = '101887836'
const CJ_LANK = '15734870'

/**
 * Bygger en söklänk till Booking.com för en destination.
 *
 * @param destination Ort att söka på, t.ex. resort.accommodation_zone
 * @param options.lang  'sv' eller 'en' — styr Bookings gränssnittsspråk
 * @param options.label Vilken knapp som klickades (t.ex. 'resort-sidebar-are').
 *                      Går till CJ som sid, så att rapporterna visar
 *                      placeringen och trafikkällan framgår för Booking.
 * @param options.checkin  'YYYY-MM-DD'. Med datumen satta öppnar Booking en
 *                         sökning med priser för just de nätterna — på
 *                         sportlovssidan är veckan redan vald.
 * @param options.checkout 'YYYY-MM-DD'. Utan båda datumen skickas inget av dem.
 */
export function bookingUrl(destination, { lang = 'en', label, checkin, checkout } = {}) {
  const sok = new URLSearchParams({
    ss: destination,
    lang: lang === 'sv' ? 'sv' : 'en-gb',
    selected_currency: 'SEK',
  })
  if (checkin && checkout) {
    sok.set('checkin', checkin)
    sok.set('checkout', checkout)
  }
  const bookingAdress = `https://www.booking.com/searchresults.html?${sok.toString()}`

  if (!SPARNING) return bookingAdress

  const klick = new URLSearchParams()
  if (label) klick.set('sid', label)
  klick.set('url', bookingAdress)

  return `https://www.jdoqocy.com/click-${CJ_PID}-${CJ_LANK}?${klick.toString()}`
}

/** True när länkarna spåras — styr annonsmärkningen och policystycket om CJ. */
export const hasAffiliateId = SPARNING

/**
 * Vad Booking ska söka på för varje ort.
 *
 * Knapparna sökte förut på `accommodation_zone`, som är skriven för läsaren
 * ("Lindvallen, Högfjället, Tandådalen", "Zermatt (bilfritt)"), inte för
 * Bookings sökruta. Provat 24 september 2026: 12 av 30 orter landade rätt.
 * Åtta gav Bookings startsida med errorc_searchstring_not_found — Sälen,
 * Chamonix, Hemsedal, Cortina, Myrkdalen, Les Arcs, Zermatt och Tignes — och
 * nio landade på fel plats: Riksgränsen på Kiruna centralstation, Ischgl på
 * grannbyn Mathon med 15 boenden, Trysil, Levi och Voss på ett enda boende.
 *
 * Varje sträng nedan är provad i Bookings sökning samma dag, utan datum.
 * Talet i kommentaren är hur många boenden Booking visade och är en
 * kontroll, inte en uppgift att visa. Strängar som redan fungerade står
 * kvar oförändrade, så att klicken går till samma sökning som förut.
 *
 * Delområden provades också. "Lindvallen" gav ett boende och "Tandådalen"
 * inget, mot 44 för "Sälen" — knappar per delområde hade gett sämre
 * sökningar än en knapp för hela orten.
 *
 * null betyder ingen knapp. Hemavan gav "inga boenden hittades" i alla
 * stavningar som provades; en knapp dit hade lett till en tom sida.
 *
 * Listan ligger i kod och inte i databasen av samma skäl som
 * lib/delomraden.js: den beskriver hur vi söker hos en partner, inte en
 * egenskap hos orten.
 */
const BOOKING_SOK = {
  'alpe-d-huez': "Alpe d'Huez, Huez", // 181, L'Alpe-d'Huez
  chamonix: 'Chamonix', // 850, Chamonix-Mont-Blanc
  'cortina-d-ampezzo': "Cortina d'Ampezzo", // 165
  courchevel: 'Courchevel 1850', // 376, Courchevel
  geilo: 'Geilo', // 70
  grandvalira: 'Pas de la Casa, Soldeu, El Tarter', // 344, Grandvalira
  hemavan: null, // inga boenden
  hemsedal: 'Hemsedal', // 64
  ischgl: 'Ischgl', // 72
  kitzbuehel: 'Kitzbühel', // 119
  'les-arcs': 'Les Arcs', // 1 969
  levi: 'Levi', // 324
  livigno: 'Livigno', // 341, Livigno Ski Area
  'madonna-di-campiglio': 'Madonna di Campiglio', // 124
  mayrhofen: 'Mayrhofen, Hippach', // 115, Mayrhofen
  meribel: 'Méribel', // 196
  myrkdalen: 'Myrkdalen', // 1
  riksgransen: 'Riksgränsen', // 41
  ruka: 'Ruka', // 285
  'saas-fee': 'Saas-Fee', // 144
  'st-anton': 'St. Anton', // 85, Sankt Anton am Arlberg
  salen: 'Sälen', // 44
  solden: 'Sölden', // 157
  tignes: 'Tignes', // 419
  trysil: 'Trysil', // 86
  'val-thorens': 'Val Thorens', // 418
  verbier: 'Verbier', // 97
  voss: 'Voss', // 71
  zermatt: 'Zermatt', // 237
  are: 'Åre, Duved', // 81, Åre
}

/**
 * Söksträngen för en ort, eller null om orten inte ska ha någon knapp.
 *
 * En ort som saknas i listan får sitt namn. Det är oprövat — lägg till
 * orten ovan när den publiceras, efter att ha provat strängen hos Booking.
 */
export function bookingSok(resort) {
  if (resort.slug in BOOKING_SOK) return BOOKING_SOK[resort.slug]
  return resort.name
}
