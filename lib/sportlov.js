/**
 * Svenskt sportlov, läsåret 2026/2027.
 *
 * Varför det ligger i kod och inte i databasen: samma skäl som nattågets
 * tidtabell i lib/nattaget.js. Det här beskriver en skolkalender, inte en
 * egenskap hos en skidort. Sälen slutar inte vara Sälen för att Göteborg
 * flyttar sitt sportlov.
 *
 *
 * ── SIDAN FRÅGAR, DEN GISSAR INTE ─────────────────────────────────────
 *
 * /sportlov låter besökaren välja sin egen vecka i stället för att slå
 * upp den åt hen. Det är ett medvetet val, taget 9 september 2026 efter
 * att alternativet undersökts:
 *
 * Sportlovet beslutas av kommunen, och ingen myndighet för register över
 * besluten. Sammanställningarna som finns går inte att lita på — se
 * docs/sportlovsveckor.md för de tre mätningarna som avgjorde det. Ett
 * eget register hade krävt 290 kommunsidor som måste läsas om varje år,
 * och en enda felaktig rad hade skickat en familj till fjället fel vecka.
 *
 * Besökaren vet vilken vecka hen har. Att fråga kostar ett klick och kan
 * inte bli fel; att gissa är gratis för oss och dyrt för den som tror på
 * gissningen.
 *
 * KOMMUNER nedan är därför bara orientering — trettiofem kommuner lästa
 * på kommunens egen sida, till för den som vill se att veckorna verkligen
 * ligger olika. Listan är inte sidans grund och behöver inte bli komplett.
 *
 *
 * ── UPPDATERAS VARJE ÅR ───────────────────────────────────────────────
 *
 * Byt LASAR, VECKOR och HAMTAD. Veckornas datum är måndag till söndag för
 * respektive ISO-vecka; kontrollera dem mot en kalender för det nya året.
 * Kontrollera samtidigt KOMMUNER mot kommunernas sidor, eller korta ner
 * listan — den är utbytbar.
 *
 * Sidan tystnar av sig själv när sista sportlovsveckan passerats, av
 * samma skäl som nattågssidan gör det.
 */

/** Läsåret uppgifterna avser. */
export const LASAR = '2026/2027'

/** Året sportlovet infaller, för rubriker och titel. */
export const AR = '2027'

/** Dagen kommunuppgifterna hämtades. */
export const HAMTAD = '2026-09-09'

/**
 * Veckorna sportlovet kan ligga i, måndag till söndag.
 *
 * Sju till tio är hela spannet — ingen av de trettiofem kommuner vi läst
 * ligger utanför det.
 */
export const VECKOR = [
  { nr: 7, start: '2027-02-15', slut: '2027-02-21' },
  { nr: 8, start: '2027-02-22', slut: '2027-02-28' },
  { nr: 9, start: '2027-03-01', slut: '2027-03-07' },
  { nr: 10, start: '2027-03-08', slut: '2027-03-14' },
]

/** Sista dagen någon i landet har sportlov. Efter den tystnar sidan. */
export const SPORTLOV_SLUT = VECKOR[VECKOR.length - 1].slut

/** Har hela sportlovet passerat? */
export function sportlovetSlut(idag = new Date()) {
  return idag > new Date(`${SPORTLOV_SLUT}T23:59:59+01:00`)
}

/** Veckans rad, eller null. */
export const veckan = (nr) => VECKOR.find((v) => v.nr === nr) || null

/**
 * Nattågets resa för en sportlovsvecka.
 *
 * Snälltåget går fredag eftermiddag och är framme på lördagsmorgonen;
 * hemtåget lämnar Österrike på lördagskvällen och är hemma på söndagen.
 * Skidveckan är alltså lördag till lördag, och den fredag som bär en
 * sportlovsvecka är fredagen före veckans måndag.
 *
 * Datumen räknas fram i stället för att skrivas som en lista, och det är
 * inte en förenkling: uträkningen går att kontrollera. Snälltågets enda
 * Stockholmsavgång är publicerad till 26 februari 2027 med hemresa 6 mars,
 * och det är precis vad den här funktionen ger för vecka 9 — den vecka
 * Snälltåget själva anger som skälet till avgången.
 */
export function nattagsresa(nr) {
  const v = veckan(nr)
  if (!v) return null

  const mandag = new Date(`${v.start}T12:00:00Z`)
  const iso = (dagar) => {
    const d = new Date(mandag)
    d.setUTCDate(d.getUTCDate() + dagar)
    return d.toISOString().slice(0, 10)
  }

  return {
    // Fredagen före veckans måndag.
    ut: iso(-3),
    // Lördagen efter, när hemtåget lämnar Österrike.
    hemFranAlperna: iso(5),
    // Söndagen efter, när det är framme i Sverige.
    hemma: iso(6),
  }
}

/**
 * Skidveckan för en sportlovsvecka: lördag till lördag.
 *
 * Både Snälltågets alptåg och Sälentåget är byggda kring den rytmen —
 * alptåget går fredag kväll och är framme på lördagsmorgonen, Sälentåget
 * går på lördagen. Bytesdagen i fjällen är lördag, inte måndag, så den
 * som har sportlov vecka 9 åker redan lördagen den 27 februari.
 */
export function skidveckan(nr) {
  const resa = nattagsresa(nr)
  if (!resa) return null

  const lordag = new Date(`${resa.ut}T12:00:00Z`)
  lordag.setUTCDate(lordag.getUTCDate() + 1)
  return { start: lordag.toISOString().slice(0, 10), slut: resa.hemFranAlperna }
}

/**
 * Sista dagen Sölden tar sitt högsta veckopris.
 *
 * Sölden är den enda ort i basen vars pris byter nivå mitt i sportlovs-
 * perioden: 478,50 € till och med det här datumet, 469 € därefter.
 * Uppgiften står i noten på ortens rad i lift_pass_prices och hämtades
 * 2026-08-12 ur ortens egen prislista.
 *
 * Datumet ligger här och inte i sidans text, så att jämförelsen nedan görs
 * mot ett datum i stället för mot veckonummer skrivna för hand. Ett
 * veckonummer blir tyst fel när orten flyttar sin gräns; ett datum flyttar
 * hela svaret med sig.
 */
export const SOLDEN_HOGPRIS_SLUT = '2027-02-26'

/**
 * Var veckans skidvecka ligger i förhållande till Söldens prisgräns.
 *
 * Tre utfall, inte två. Skidveckan är lördag till lördag, och vecka 8
 * börjar 20 februari och slutar 27 — alltså på var sin sida om gränsen.
 * Att kalla den "före sänkningen" hade varit fel med en dag, och ett
 * prispåstående som är fel med en dag är fel.
 */
export function soldenLage(nr) {
  const vecka = skidveckan(nr)
  if (!vecka) return null

  if (vecka.slut <= SOLDEN_HOGPRIS_SLUT) return 'fore'
  if (vecka.start > SOLDEN_HOGPRIS_SLUT) return 'efter'
  return 'over'
}

/**
 * Trettiofem kommuner, var och en läst på kommunens egen sida.
 *
 * Orientering, inte facit — se förklaringen överst. Källänken per rad
 * finns för att den som tvivlar ska kunna gå till samma sida vi läste.
 */
export const KOMMUNER = [
  { kommun: 'Borlänge', vecka: 9, kalla: 'https://www.borlange.se/barn-och-utbildning/grundskola/lasarstider-lov-ledighet' },
  { kommun: 'Borås', vecka: 7, kalla: 'https://www.boras.se/utbildningochforskola/grundskola/lasarstiderochledighet.4.78ce08f715f682a938570344.html' },
  { kommun: 'Eskilstuna', vecka: 8, kalla: 'https://www.eskilstuna.se/forskola-och-skola/lasar-lov-och-studiedagar' },
  { kommun: 'Gävle', vecka: 9, kalla: 'https://www.gavle.se/utbildning-och-barnomsorg/grundskola-och-anpassad-grundskola/lov-ledigheter-och-franvaro-inom-grundskola-och-anpassad-grundskola/lasarsdata/' },
  { kommun: 'Göteborg', vecka: 7, kalla: 'https://goteborg.se/wps/portal?uri=gbglnk%3Agbg.page.89bc849d-4184-4b24-a1bd-e105258a9bc1' },
  { kommun: 'Halmstad', vecka: 8, kalla: 'https://www.halmstad.se/barnochutbildning/grundskolaochfritidshem/lasarstiderlovochstudiedagargrundskola.n1386.html' },
  { kommun: 'Helsingborg', vecka: 8, kalla: 'https://helsingborg.se/forskola-och-utbildning/helsingborgs-stads-skolor/lasarstider-och-lov/' },
  { kommun: 'Huddinge', vecka: 9, kalla: 'https://www.huddinge.se/forskola-skola/grundskola/lov-grundskolan' },
  { kommun: 'Hudiksvall', vecka: 10, kalla: 'https://hudiksvall.se/Sidor/Barn-och-utbildning/Grundskola/Lasarstider-och-lov-for-grundskola.html' },
  { kommun: 'Härjedalen', vecka: 10, kalla: 'https://www.herjedalen.se/skola-och-forskola/grundskola-6-16-ar/lasarstider.html' },
  { kommun: 'Jönköping', vecka: 7, kalla: 'https://www.jonkoping.se/barn--utbildning/grundskola-anpassad-grundskola-och-fritidshem/lasarstider-lov-studiedagar-och-ledigheter-i-grundskola-och-anpassad-grundskola' },
  { kommun: 'Karlstad', vecka: 9, kalla: 'https://karlstad.se/forskola-skola-och-utbildning/grundskola/lasarstider-och-lov-i-grundskolan' },
  { kommun: 'Kristianstad', vecka: 8, kalla: 'https://www.kristianstad.se/barnochutbildning/grundskola/lovochlasar.2238.html' },
  { kommun: 'Linköping', vecka: 8, kalla: 'https://www.linkoping.se/forskola-och-utbildning/grundskola/lov-och-lasarstider-for-grundskola-och-anpassad-grundskola' },
  { kommun: 'Luleå', vecka: 9, kalla: 'https://www.lulea.se/utbildning--forskola/lov-lasar-ledigheter.html' },
  { kommun: 'Lund', vecka: 8, kalla: 'https://lund.se/forskola-och-skola/grundskola/lasar-och-lov-i-grundskolan' },
  { kommun: 'Malmö', vecka: 8, kalla: 'https://malmo.se/Bo-och-leva/Utbildning-och-forskola/Grundskola/For-elever-och-vardnadshavare-i-grundskolan/Lasar-och-lov-i-grundskolan.html' },
  { kommun: 'Malung-Sälen', vecka: 9, kalla: 'https://malung-salen.se/skola-och-barnomsorg/lasarstider-och-ledighet' },
  { kommun: 'Norrköping', vecka: 8, kalla: 'https://norrkoping.se/skola-och-forskola/aktuellt/lov-och-lasarstider' },
  { kommun: 'Sigtuna', vecka: 9, kalla: 'https://www.sigtuna.se/utbildning-och-barnomsorg/grundskola/lasarstider-och-lov.html' },
  { kommun: 'Skellefteå', vecka: 10, kalla: 'https://skelleftea.se/invanare/startsida/forskola-skola-och-utbildning/grundskola/lov-lasarstider-och-ledigheter' },
  { kommun: 'Skövde', vecka: 7, kalla: 'https://www.skovde.se/barnomsorg-utbildning/lasarstider-och-lov/' },
  { kommun: 'Sollefteå', vecka: 10, kalla: 'https://www.solleftea.se/Utbildning--barnomsorg/lasarstider' },
  { kommun: 'Solna', vecka: 9, kalla: 'https://www.solna.se/barn--utbildning/terminer-och-lov' },
  { kommun: 'Stockholm', vecka: 9, kalla: 'https://grundskola.stockholm/terminer-och-lov/' },
  { kommun: 'Sundsvall', vecka: 10, kalla: 'https://sundsvall.se/kommun/utbildning-och-forskola/grundskola/lasarstider-och-lov' },
  { kommun: 'Söderhamn', vecka: 10, kalla: 'https://www.soderhamn.se/sidor/forskola-skola-och-utbildning/grundskola/lov-ledighet-och-lasarstider.html' },
  { kommun: 'Uddevalla', vecka: 8, kalla: 'https://www.uddevalla.se/utbildning-och-barnomsorg/grundskola/lasarstider-och-lov.html' },
  { kommun: 'Umeå', vecka: 10, kalla: 'https://www.umea.se/forskolaskolaochutbildning/grundskola/lasarstiderochlov.4.27a2de8b172da059ace1ee0.html' },
  { kommun: 'Uppsala', vecka: 8, kalla: 'https://www.uppsala.se/skola-forskola-och-komvux/gymnasieskola/lasarstider-och-lov/lasarstider-for-grundskola-och-gymnasium/' },
  { kommun: 'Varberg', vecka: 8, kalla: 'https://varberg.se/forskola-skola-och-utbildning/grundskola/lasarstider-och-lov-i-grundskolan' },
  { kommun: 'Västerås', vecka: 9, kalla: 'https://www.vasteras.se/barn-och-utbildning/grundskola/terminer-lov-och-ledigheter-i-grundskola.html' },
  { kommun: 'Växjö', vecka: 8, kalla: 'https://www.vaxjo.se/sidor/forskola-och-skola/skola-6---16-ar/lasarstider-grundskola.html' },
  { kommun: 'Åre', vecka: 10, kalla: 'https://are.se/forskola-och-skola/grundskola/lasarstider-och-lov' },
  { kommun: 'Östersund', vecka: 10, kalla: 'https://www.ostersund.se/barn-och-utbildning/grundskola-och-anpassad-grundskola/lov-ledigheter-lasarstider.html' },
]

/** Kommunerna som har en viss vecka, i bokstavsordning. */
export const kommunerMed = (nr) =>
  KOMMUNER.filter((k) => k.vecka === nr).sort((a, b) => a.kommun.localeCompare(b.kommun, 'sv'))
