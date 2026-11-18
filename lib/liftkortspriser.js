/**
 * Vad vi kan stå för om varje orts liftkortspris.
 *
 * Sidan /liftkortspriser visar bara belopp som är hämtade från ortens egen
 * sida och kontrollerade mot en produkt vi kan namnge. Databasen innehåller
 * fler tal än så: tre orter bär värden som aldrig hämtats, från tiden innan
 * migration 019, och dem visar vi inte. Ett tal vi inte kan belägga är
 * sämre än inget tal — samma hållning som migration 020, som nollade fyra
 * omöjliga veckopriser hellre än att låta dem stå.
 *
 * Listan är redaktionell och underhålls för hand, som spegling av
 * docs/liftkortspriser.md. Den ligger i kod och inte i databasen därför att
 * den beskriver vad VI vet om priset, inte vad orten tar betalt. Går de
 * isär ska dokumentet vinna; det är där skälen står utskrivna.
 *
 * BEROENDE: listan förutsätter att migration 020 och 021 är körda.
 * Före 021 bär Livigno och Voss sina gamla värden i databasen medan tabellen
 * nedan märker dem 26/27 — sidan skulle då sätta årets etikett på förra årets
 * pris, och Voss dessutom räknas om från fel valuta. Kör SQL:en före deploy.
 *
 * Uppdaterad 2026-08-25, med Geilo omkontrollerad 2026-09-08 utan ny
 * uppgift. Nästa genomgång: början av oktober, när de sju
 * årstidsblockerade orterna har publicerat. Ruka anger 2 oktober och är
 * den enda med ett datum; ta hela rundan då.
 */

/**
 * Vad ett pris omfattar, i två delar.
 *
 * Delningen finns därför att andra halvan bara gäller 26/27-priser.
 * Referensveckan ligger i februari 2027, medan fyra orter bär 25/26-priser
 * i väntan på att nästa säsong publiceras. På ortsidan, där säsongen skrivs
 * ut intill definitionen, blev "Säsongen 2025/2026" följt av "Referensvecka
 * är v9 2027" en motsägelse.
 *
 * Prislistesidan visar båda delarna tillsammans som DEFINITION — där står
 * säsongen som etikett per rad i stället, och tabellen bär båda sorterna.
 */
export const OMFATTNING =
  'Vuxen, sex sammanhängande dagar, ordinarie pris i huvudsäsong.'

export const REFERENSVECKA =
  'Referensvecka är v9 2027 (27 februari–6 mars) där priset varierar över säsongen.'

/** Sex sammanhängande dagar, vuxen, huvudsäsong, referensvecka v9 2027. */
export const DEFINITION = `${OMFATTNING} ${REFERENSVECKA}`

/**
 * Orter med ett pris vi kan stå för, och vilken säsong det avser.
 *
 * `sasong` är det som skiljer raderna åt i tabellen. En ort som ännu inte
 * publicerat 26/27 bär sitt 25/26-pris, och det ska synas — annars läser
 * besökaren ett gammalt tal som om det vore årets.
 */
export const VERIFIERADE = {
  // ── Säsongen 26/27, hämtade från ortens egen sida ──
  solden: { sasong: '26/27', not: 'Sexdagarskortet är Ötztal Superskipass, som från tre dagar gäller alla skidområden i Ötztal.' },
  ischgl: { sasong: '26/27' },
  kitzbuehel: { sasong: '26/27' },
  tignes: { sasong: '26/27' },
  'alpe-d-huez': { sasong: '26/27' },
  'les-arcs': { sasong: '26/27', not: 'Classic Pass — Les Arcs och Peisey-Vallandry, det område våra tal avser.' },
  courchevel: { sasong: '26/27', not: 'Les 3 Vallées.' },
  meribel: { sasong: '26/27', not: 'Les 3 Vallées.' },
  'val-thorens': { sasong: '26/27', not: 'Les 3 Vallées.' },
  livigno: { sasong: '26/27' },
  zermatt: { sasong: '26/27', not: 'Internationella kortet Zermatt–Cervinia, som ger de 322 kilometrarna. Priset är dynamiskt; talet gäller start 27 februari 2027 och lästes i november. Zermatt ensamt kostar 104 / 510 CHF.' },
  verbier: { sasong: '26/27', not: '4 Vallées.' },
  'saas-fee': { sasong: '26/27', not: 'Saas-Fee-kortet, som gäller Saas-Fee och Saas-Almagell. Hela Saastal står som större kort.' },
  are: { sasong: '26/27' },
  salen: { sasong: '26/27', not: 'Veckokortet inkluderar två skiddagar i Trysil.' },
  trysil: { sasong: '26/27' },
  hemsedal: { sasong: '26/27' },
  voss: { sasong: '26/27', not: 'Kvällsåkning och gondol ingår.' },
  // Hämtade 2026-11-16, se migration 030.
  'st-anton': { sasong: '26/27', not: 'Ski Arlberg kallar priset preliminärt och kan justera det.' },
  'madonna-di-campiglio': { sasong: '26/27' },
  ruka: { sasong: '26/27', not: 'Pris i kassan. På nätet är kortet fem procent billigare från 1 december.' },
  // Hämtat 2026-11-18, se migration 033. Det enda veckokortet gäller hela
  // dalen, se LIFTKORT nedan.
  mayrhofen: { sasong: '26/27', not: 'Det enda veckokortet är Zillertal Superskipass, som gäller hela Zillertal på 546 km med buss mellan områdena.' },
  // Hämtat 2026-11-18, se migration 032.
  levi: { sasong: '26/27', not: 'Pris i kassan. På nätet två procent billigare, och fem procent vid köp minst 14 dagar i förväg.' },
  // Hämtade 2026-11-18 via ortens bokning eller prislista, se migration 034.
  // Grandvalira, Cortina och Hemavan sätter priset efter datum; talet gäller
  // en vecka med start 27 februari–1 mars 2027, se noten för varje ort.
  chamonix: { sasong: '26/27', not: 'Chamonix Le Pass, som gäller dalens skidområden utom Les Houches. Mont-Blanc Unlimited, med Les Houches, Courmayeur och Verbier, kostar mer.' },
  grandvalira: { sasong: '26/27', not: 'Pris i kassan för 28 februari–5 mars; priset ändras med datum och är lägre på nätet. Flerdagarskortet gäller även Pal Arinsal och Ordino Arcalís.' },
  'cortina-d-ampezzo': { sasong: '26/27', not: 'Cortinas eget kort. Priset ändras med datum; talet gäller start 1 mars och är lägre på nätet. Dolomiti Superski, som gäller tolv områden i Dolomiterna utan liftförbindelse mellan dem, kostar 453 € för sex dagar i högsäsong.' },
  hemavan: { sasong: '26/27', not: 'Kortet gäller sex till åtta dagar för samma pris, i Hemavan och Tärnaby. Pris i kassan för start 27 februari; lägre tidigare i februari och på nätet.' },
  // Hämtade 2026-11-18, se migration 040 och granskningen av omgång 2.
  // Orterna ligger dolda (published = false); listan slås bara upp för
  // orter som lib/resorts.js redan släppt igenom, så posterna syns först
  // när orten publiceras.
  'lech-zuers': { sasong: '26/27', not: 'Samma Ski Arlberg-kort som St. Anton. Ski Arlberg kallar priset preliminärt och kan justera det.' },
  saalbach: { sasong: '26/27', not: 'Det enda kortet är Ski ALPIN CARD, som också gäller Schmittenhöhe i Zell am See och Kitzsteinhorn i Kaprun, 408 km utan lift mellan de tre.' },
  'zell-am-see-kaprun': { sasong: '26/27', not: 'Det enda kortet är Ski ALPIN CARD, som också gäller Skicircus Saalbach Hinterglemm Leogang Fieberbrunn, 408 km utan lift mellan de tre.' },
  obergurgl: { sasong: '26/27', not: 'Sexdagarskortet är Ötztal Superskipass, som från tre dagar gäller alla skidområden i Ötztal, Sölden inräknat. Dagspriset är ortens lägsta kassapris i perioden.' },
  'bad-gastein': { sasong: '26/27', not: 'Pris i kassan; på nätet ändras priset med datum och är lägre. Sexdagarskortet är Ski amadé, 760 km utan lift mellan regionerna. Dagskortet gäller också Dorfgastein-Großarl och Sportgastein.' },
  // Hämtade 2026-11-18, se migration 041 och granskningen av omgång 3.
  // Dolda som omgång 2 ovan. Alla tre korten gäller samma område som
  // pisttalen, så ingen av dem står i LIFTKORT.
  'la-plagne': { sasong: '26/27', not: 'La Plagne-kortet, det område våra tal avser.' },
  'les-deux-alpes': { sasong: '26/27', not: "Sexdagarskortet ger också två dagar i Alpe d'Huez och en dag vardera i Serre Chevalier, Montgenèvre, Puy Saint-Vincent och Sestriere." },
  'serre-chevalier': { sasong: '26/27', not: "Sexdagarskortet ger också en dag vardera i Alpe d'Huez, Les Deux Alpes, Puy Saint-Vincent, Montgenèvre och Sestriere." },

  // ── Prislista utan årtal, men den som gäller nu ──
  myrkdalen: {
    sasong: 'Gällande',
    not: 'Orten sätter samma pris för sex, sju och åtta dagar. Den som stannar en vecka betalar för knappt fyra dagar.',
  },

  // ── Säsongen 25/26 — orten har inte publicerat 26/27 ──
  // Kontrollerad 2026-09-08 i ortens egen prislista. Säsongskortet står
  // som "Sesongkort 26/27", men tabellen under det har rubriken "Skipass
  // 25/26" och samma tal som vi redan bär — 693 för en dag, 2 871 för
  // 6–8 dagar. Noten sade förut "släpps i september", vilket var ett
  // löfte som gick ut den dagen september kom utan att något hände.
  geilo: { sasong: '25/26', not: 'Orten har publicerat säsongskortet för 26/27, men dags- och flerdagarskorten står kvar på 25/26.' },
  riksgransen: {
    sasong: '25/26',
    not: 'Kortet gäller Björkliden och Riksgränsen tillsammans, medan våra pisttal avser Riksgränsen ensamt. Orten säljer inget kort för bara den egna sidan.',
  },
}

/**
 * Orter utan pris på sidan, och varför.
 *
 * Skälen är två sorters. De flesta är årstid: orten har helt enkelt inte
 * släppt vinterns priser i augusti. Två är något annat — där vet vi priset
 * men inte vilket kort som motsvarar orten, och det löses inte av att vänta.
 */
export const UTAN_PRIS = {
  // Skälen skrevs om 2026-11-16. De gamla talade om sommarläge och om
  // ett släpp 2 oktober, och stod kvar långt in i november. Ett skäl ska
  // inte bära ett datum som går ut av sig självt.
  // Tom sedan 2026-11-18: de fyra sista orterna fick pris i migration 034.
  // Strukturen står kvar för nästa ort som saknar en prislista.
}

/** Har orten ett pris vi visar? */
export const harPris = (resort) =>
  Boolean(VERIFIERADE[resort.slug]) && Number.isFinite(resort.lift_pass_week_eur)

/**
 * Vad veckokortet gäller, där det inte är samma område som pisttalen.
 *
 * Beslut av Fabian 2026-11-18: priset följer det kort man faktiskt köper
 * för en vecka, och varje ort visar två tal — pisten man når med lift, som
 * förut, och vad kortet gäller. För de flesta orter är det samma område,
 * och de står inte här. Pris per kilometer räknas på kortets kilometer,
 * eftersom det är dem priset betalar för.
 *
 * `km: null` betyder att kortet gäller mer än pisttalen men att vi inte
 * har ett belagt tal för hur mycket. Orten räknas då inte per kilometer.
 */
export const LIFTKORT = {
  mayrhofen: { namn: 'Zillertal Superskipass', km: 546, kalla: 'mayrhofen.at, 2026-11-18' },
  riksgransen: { namn: 'Björkliden + Riksgränsen', km: null },
  chamonix: { namn: 'Chamonix Le Pass', km: 114, kalla: 'Brévent–Flégère, Grands Montets och Balme ur lib/delomraden.js' },
  grandvalira: { namn: 'Grandvalira med Pal Arinsal och Ordino Arcalís', km: 308, kalla: 'skiresort.com, 215 + 63 + 30 km, 2026-11-18' },
  hemavan: { namn: 'Hemavan + Tärnaby', km: 50, kalla: 'skiresort.com, 30 + 20 km, 2026-11-18' },
  'saas-fee': { namn: 'Saas-Fee + Saas-Almagell', km: 116, kalla: 'skiresort.com, 101 + 15 km, 2026-11-18' },
  // Omgång 2, se migration 040. ALPIN CARD:s 408 km är kortets eget tal
  // (saalbach.com, skiresort size), som Mayrhofens 546 från mayrhofen.at;
  // summan av skiresorts poster vore 409,5. Ski amadé och Ötztal saknar
  // ett belagt tal för det som går att åka, och räknas inte per km.
  saalbach: { namn: 'Ski ALPIN CARD', km: 408, kalla: 'saalbach.com och skiresort.com, 2026-11-18' },
  'zell-am-see-kaprun': { namn: 'Ski ALPIN CARD', km: 408, kalla: 'saalbach.com och skiresort.com, 2026-11-18' },
  'bad-gastein': { namn: 'Ski amadé', km: null },
  obergurgl: { namn: 'Ötztal Superskipass', km: null },
  solden: { namn: 'Ötztal Superskipass', km: null },
}

/** Kilometer pist som veckokortet ger, eller null om det inte är känt. */
export function kortKm(resort) {
  const kort = LIFTKORT[resort.slug]
  if (kort) return kort.km
  const km = Number(resort.total_pistes_km)
  return Number.isFinite(km) && km > 0 ? km : null
}

/**
 * Större kort, där orten ingår i ett kort som gäller fler områden än det
 * vi räknar på.
 *
 * Önskemål av Fabian 2026-11-18: liftkortspriser ska visa ortens eget kort
 * och, där det finns, det stora kortet på en egen rad under. Ortens kort
 * styr sortering och index, så att alla orter jämförs på samma sätt.
 *
 * Priserna ligger här och inte i databasen därför att de inte är ortens
 * pris, utan ett tillval. Samma definition som ortkortet: vuxen, sex dagar,
 * huvudsäsong, referensvecka v9 2027. Km är skiresort.com där inget annat
 * står.
 */
export const STORRE_KORT = {
  'cortina-d-ampezzo': {
    namn: 'Dolomiti Superski', valuta: 'EUR', dag: 89, vecka: 453, km: 1200,
    // Tolv skilda områden. Kronor per km vore missvisande, eftersom man
    // inte når kilometrarna från en och samma by.
    perKm: false,
    galler: 'Tolv områden i Dolomiterna, utan lift mellan alla.',
    kalla: 'dolomitisuperski.com, högsäsong 26/27; 1 200 km enligt Dolomiti Superski',
  },
  chamonix: {
    namn: 'Mont-Blanc Unlimited', valuta: 'EUR', dag: 104, vecka: 499, km: 211,
    galler: 'Hela Chamonixdalen med Les Houches, Courmayeur i Italien och en dag i Verbier.',
    kalla: 'compagniedumontblanc.fr, hög säsong 26/27; 170 + 41 km (Courmayeur)',
  },
  'les-arcs': {
    namn: 'Paradiski (Essential Pass)', valuta: 'EUR', dag: 78, vecka: 412, km: 425,
    galler: 'Les Arcs, Peisey-Vallandry och La Plagne via Vanoise Express.',
    kalla: 'lesarcs-peiseyvallandry.com, högsäsong 26/27, 2026-11-18; 200 + 225 km',
  },
  // Omgång 3, se migration 041. Samma kort och pris som för Les Arcs;
  // La Plagnes prislista kallar det bara "Paradiski".
  'la-plagne': {
    namn: 'Paradiski', valuta: 'EUR', dag: 78, vecka: 412, km: 425,
    galler: 'La Plagne, Les Arcs och Peisey-Vallandry via Vanoise Express.',
    kalla: 'skipass-laplagne.com, prislista 26/27, 2026-11-18; 225 + 200 km',
  },
  'saas-fee': {
    namn: 'Saastal (Destination)', valuta: 'CHF', dag: null, vecka: 428, km: 143,
    galler: 'Saas-Fee, Saas-Grund, Saas-Almagell och Saas-Balen.',
    kalla: 'saas-fee.ch, 2026-11-18; 101 + 26 + 15 + 1 km',
  },
}
