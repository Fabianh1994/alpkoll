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
  solden: { sasong: '26/27' },
  ischgl: { sasong: '26/27' },
  kitzbuehel: { sasong: '26/27' },
  tignes: { sasong: '26/27' },
  'alpe-d-huez': { sasong: '26/27' },
  'les-arcs': { sasong: '26/27', not: 'Classic Pass — Les Arcs och Peisey-Vallandry, det område våra tal avser.' },
  courchevel: { sasong: '26/27', not: 'Les 3 Vallées.' },
  meribel: { sasong: '26/27', not: 'Les 3 Vallées.' },
  'val-thorens': { sasong: '26/27', not: 'Les 3 Vallées.' },
  livigno: { sasong: '26/27' },
  zermatt: { sasong: '26/27', not: 'Internationella kortet Zermatt–Cervinia, som ger de 322 kilometrarna.' },
  verbier: { sasong: '26/27', not: '4 Vallées.' },
  'saas-fee': { sasong: '26/27', not: 'Saas-Fee-kortet, inte destinationskortet för hela Saastal.' },
  are: { sasong: '26/27' },
  salen: { sasong: '26/27', not: 'Veckokortet inkluderar två skiddagar i Trysil.' },
  trysil: { sasong: '26/27' },
  hemsedal: { sasong: '26/27' },
  voss: { sasong: '26/27', not: 'Kvällsåkning och gondol ingår.' },
  // Hämtade 2026-11-16, se migration 030.
  'st-anton': { sasong: '26/27', not: 'Ski Arlberg kallar priset preliminärt och kan justera det.' },
  'madonna-di-campiglio': { sasong: '26/27' },
  ruka: { sasong: '26/27', not: 'Pris i kassan. På nätet är kortet fem procent billigare från 1 december.' },

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
  levi: { skal: 'Orten visar priset först när man väljer datum i webbutiken, och har ingen prislista vi kan hänvisa till.', typ: 'kalla' },
  hemavan: { skal: 'Orten visar priset först i bokningen, och har ingen prislista vi kan hänvisa till.', typ: 'kalla' },
  mayrhofen: {
    skal: 'Sexdagarskortet är Zillertaler Superskipass för hela dalen, medan våra pisttal avser Mayrhofen ensamt. Att jämföra ett regionkort med ortskort vore missvisande.',
    typ: 'omrade',
  },
  'cortina-d-ampezzo': { skal: 'Vi har inte kunnat läsa vinterns prislista hos Dolomiti Superski.', typ: 'kalla' },
  chamonix: {
    skal: 'Vilket kort som motsvarar orten är inte avgjort. Chamonix Le Pass ger 110 km, medan våra pisttal avser dalens 170 km, och områdena hänger inte ihop.',
    typ: 'omrade',
  },
  grandvalira: {
    skal: 'Flerdagarskortet gäller tre skilda områden på sammanlagt 308 km, medan våra pisttal avser Grandvalira ensamt på 215 km. Att jämföra ett regionkort med ortskort vore missvisande.',
    typ: 'omrade',
  },
}

/** Har orten ett pris vi visar? */
export const harPris = (resort) =>
  Boolean(VERIFIERADE[resort.slug]) && Number.isFinite(resort.lift_pass_week_eur)
