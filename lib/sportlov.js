/**
 * Svenska sportlovsveckor, läsåret 2026/2027.
 *
 * Varför det ligger i kod och inte i databasen: samma skäl som nattågets
 * tidtabell i lib/nattaget.js. Det här beskriver en kommuns skolkalender,
 * inte en egenskap hos en skidort. Sälen slutar inte vara Sälen för att
 * Göteborg flyttar sitt sportlov.
 *
 *
 * ── UPPDATERAS VARJE ÅR ───────────────────────────────────────────────
 *
 * Hela filen beskriver ett läsår och går ut med det. Kommunerna beslutar
 * läsårstiderna själva och publicerar dem under våren före läsåret.
 *
 * Så här: gå till kommunens egen sida om läsårstider och lov, läs
 * sportlovsveckan där, och byt LASAR, VECKOR och HAMTAD.
 *
 *
 * ── VARFÖR VARJE RAD HAR EN EGEN KÄLLÄNK ──────────────────────────────
 *
 * Sammanställningarna går inte att lita på, uppmätt 9 september 2026:
 *
 *   · SkiStar placerar Luleå i vecka 10. Luleå kommun säger vecka 9.
 *   · Skolportens PDF finns i två versioner från mars 2026, och 26
 *     kommuner har olika sportlovsvecka i dem. Tabellen är radförskjuten
 *     vid textextraktion — kommunnamnet på en rad bär värdena från raden
 *     intill — och förskjutningen skiljer sig mellan versionerna. Samma
 *     fel som Kitzbühels prislista led av, men utan kontrollsumma att
 *     rätta med.
 *   · En söksammanfattning gav Helsingborg 'måndag 21 februari'. Den 21
 *     februari 2027 är en söndag. Kommunen säger 22 februari.
 *
 * Att visa fel vecka för någons kommun är värre än att inte visa något:
 * den som bokar resa efter uppgiften står utan barn i backen.
 */

/** Läsåret uppgifterna avser. */
export const LASAR = '2026/2027'

/** Dagen uppgifterna hämtades från kommunernas sidor. */
export const HAMTAD = '2026-09-09'

/** Måndag till söndag för respektive vecka, 2027. */
export const VECKOR = {
  7: { start: '2027-02-15', slut: '2027-02-21' },
  8: { start: '2027-02-22', slut: '2027-02-28' },
  9: { start: '2027-03-01', slut: '2027-03-07' },
  10: { start: '2027-03-08', slut: '2027-03-14' },
}

/**
 * En rad per kommun, hämtad från kommunens egen sida om läsårstider.
 * Listan är ofullständig — se docs/sportlovsveckor.md för vilka som
 * återstår och varför ingen sammanställning duger som genväg.
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
