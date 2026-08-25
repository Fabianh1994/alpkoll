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
 * Uppdaterad 2026-08-25. Nästa genomgång: början av oktober, när de sju
 * årstidsblockerade orterna har publicerat.
 */

/** Sex sammanhängande dagar, vuxen, huvudsäsong, referensvecka v9 2027. */
export const DEFINITION =
  'Vuxen, sex sammanhängande dagar, ordinarie pris i huvudsäsong. ' +
  'Referensvecka är v9 2027 (27 februari–6 mars) där priset varierar över säsongen.'

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

  // ── Prislista utan årtal, men den som gäller nu ──
  myrkdalen: {
    sasong: 'Gällande',
    not: 'Orten sätter samma pris för sex, sju och åtta dagar. Den som stannar en vecka betalar för knappt fyra dagar.',
  },

  // ── Säsongen 25/26 — orten har inte publicerat 26/27 ──
  'st-anton': { sasong: '25/26', not: 'Priset för 26/27 är inte publicerat än.' },
  'madonna-di-campiglio': { sasong: '25/26', not: 'Priset för 26/27 är inte publicerat än.' },
  geilo: { sasong: '25/26', not: 'Dags- och flerdagarskort för 26/27 släpps i september.' },
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
  ruka: { skal: 'Dags- och flerdagarskort släpps 2 oktober.', typ: 'arstid' },
  levi: { skal: 'Prissidan står i sommarläge.', typ: 'arstid' },
  hemavan: { skal: 'Bara säsongspass är i försäljning.', typ: 'arstid' },
  mayrhofen: { skal: 'Liftbolagets sajt står i sommarläge.', typ: 'arstid' },
  'cortina-d-ampezzo': { skal: 'Ingen vinterprodukt är i försäljning — butiken säljer bara sommarpass.', typ: 'arstid' },
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
