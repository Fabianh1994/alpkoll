
-- (Raden ovan är avsiktligt tom: tappas första tecknet vid kopiering
--  spelar det då ingen roll.)
-- 010 · Sverige — siffror, resväg och svensk text
--
-- Omgång 5: Åre, Sälen, Riksgränsen och Hemavan.
--
-- transfer_minutes fortsätter mäta restiden FRÅN FLYGPLATSEN, även här.
-- Frestelsen var att sätta Åre till 420 minuter, alltså nattåget från
-- Stockholm — men då mäter fältet olika saker för olika orter och blir
-- lika ojämförbart som det var innan. Zermatts 210 minuter räknar inte
-- in flyget dit, så 420 för Åre hade fått orten att se avlägsen ut mot
-- en alport som i praktiken tar längre tid dörr till dörr.
--
-- Att bilen och nattåget är den verkliga vägen till svenska fjällen
-- bärs i stället av transport_info, som är prosa och tål nyansen.
--
-- KVARSTÅR: planerarens getAccessScore räknar fortfarande på avstånd
-- till flygplats, vilket gynnar svenska orter med närbelägen flygplats
-- oavsett hur få avgångar den har. Ett fält för total restid från
-- Stockholm skulle lösa både poängsättningen och rutan, men det är ett
-- eget arbete.
--
-- Två flygplatser byts:
--   Sälen stod som Mora, där reguljärtrafiken lades ned 2018.
--   Riksgränsen stod som Narvik, som nås från Oslo. Från Sverige åker
--   man via Kiruna.
--
-- Sälens pist och liftar lämnas orörda. skiresort.com delar upp området
-- precis som Chamonix och Davos: Lindvallen/Högfjället listas för sig
-- med 42 km. Databasens 107 km motsvarar SkiStars fyra områden på ett
-- liftkort. Frågan löses när Sälen delas upp i flera orter, vilket är
-- beslutat men inte gjort. Topphöjden går däremot att belägga: 887 m
-- mot databasens 620.
--
-- Hemavans siffror lämnas orörda — jag hittade ingen sida hos källan.

begin;

-- ── Åre ────────────────────────────────────────────────────────────
update public.resorts set
  total_pistes_km = 91, total_lifts = 37, altitude_top = 1319,
  season_start_month = 11, season_end_month = 5,
  transfer_minutes = 60, transfer_note = 'med bil från Östersund',
  notes = 'Sveriges största skidort och den enda som mäter sig med Alperna i stämning. 91 kilometer pist på Åreskutans sidor, med allt från breda nybörjarbackar i Björnen till brant åkning i Störtloppet. Här avgjordes alpina VM 2019. Till skillnad från de flesta alporter kommer du hit med tåg som stannar mitt i byn.',
  where_to_stay = 'Åre by är navet, med kabinbanan från torget och merparten av restauranger och barer. Duved åtta kilometer västerut är lugnare och mer familjeinriktat. Björnen ligger ski in/ski out och passar barnfamiljer. Tegefjäll är litet och stillsamt. Gratis skidbuss går mellan områdena.',
  transport_info = 'Nattåget från Stockholm stannar mitt i Åre by och tar ungefär sju timmar — du sover dig fram och står i backen på förmiddagen. Med bil tar det åtta timmar från Stockholm. Vill du flyga går direktflyg till Åre Östersund, en timme med bil från byn.'
where slug = 'are';

-- ── Sälen ──────────────────────────────────────────────────────────
update public.resorts set
  altitude_top = 887,
  nearest_airport = 'Scandinavian Mountains', airport_distance_km = 20,
  transfer_minutes = 25, transfer_note = 'med bil från flygplatsen',
  notes = 'Sveriges mest besökta skidområde, och för många svenskar den första backen de stod i. SkiStars fyra områden — Lindvallen, Högfjället, Tandådalen och Hundfjället — delar liftkort och riktar sig framför allt till barnfamiljer, med breda backar och korta avstånd. Fjället når knappt 900 meter, så terrängen är mjuk snarare än dramatisk.',
  where_to_stay = 'Lindvallen ligger närmast infarten och har mest utbud, med Experium som samlingspunkt för bad och annat än skidåkning. Högfjället ligger högre och är lugnare. Tandådalen i västra änden har mest afterski, medan Hundfjället är tydligast inriktat på små barn. Boendet är till största delen stugor snarare än hotell.',
  transport_info = 'De flesta kör: fyra och en halv timme från Stockholm, ungefär fem från Göteborg. Bussar går från Stockholm och Mora under säsongen. Scandinavian Mountains Airport ligger tjugo minuter bort men har bara säsongstrafik på ett fåtal linjer — för de flesta är Sälen en biltur, inte en flygresa.'
where slug = 'salen';

-- ── Riksgränsen ────────────────────────────────────────────────────
update public.resorts set
  total_pistes_km = 21, total_lifts = 6, altitude_base = 520,
  season_end_month = 5,
  nearest_airport = 'Kiruna', airport_distance_km = 130,
  transfer_minutes = 90, transfer_note = 'med bil från Kiruna',
  notes = 'Sveriges nordligaste skidort, på norska gränsen och långt ovanför trädgränsen. Bara 21 kilometer pist och sex liftar — men det är inte därför man åker hit. Säsongen börjar i februari och håller till slutet av maj, och i maj åker man under midnattssol. Offpisten och helikopterskidåkningen är dragplåstret.',
  where_to_stay = 'Riksgränsen är ingen by utan i praktiken ett hotell vid en järnvägsstation, med backen utanför dörren. Utbudet är begränsat och bokas tidigt. Björkliden några mil söderut är närmaste alternativ, med eget skidområde och samma karga fjällandskap.',
  transport_info = 'Nattåget från Stockholm går ända till Riksgränsens station, som ligger vid backen — resan tar ett drygt dygn men kräver inga byten. Snabbare är att flyga till Kiruna och köra den sista dryga timmen. Narvik ligger närmare men nås från Sverige via Oslo.'
where slug = 'riksgransen';

-- ── Hemavan ────────────────────────────────────────────────────────
update public.resorts set
  nearest_airport = 'Hemavan Tärnaby', airport_distance_km = 5,
  transfer_minutes = 15, transfer_note = 'med bil från flygplatsen',
  notes = 'Ligger vid foten av Vindelfjällen i södra Lappland, med utsikt över naturreservatet. Området är litet men har ovanligt bra offpist för svenska förhållanden, och Kungsledens norra ände börjar här. Fjällvandring på sommaren och åkning på vintern gör orten till en åretruntdestination.',
  where_to_stay = 'Hemavan är litet och det mesta ligger nära liftarna. Tärnaby en kvart bort är den större byn med mer service och en egen backe — det var där Ingemar Stenmark lärde sig åka. Boendet är främst stugor och lägenheter.',
  transport_info = 'Hemavan Tärnaby flygplats ligger vid orten med flyg från Arlanda, vilket är ovanligt för en svensk skidort. Med bil tar det fyra timmar från Umeå och drygt tio från Stockholm. Bussar går från Umeå och Storuman.'
where slug = 'hemavan';

commit;

-- ── Kontroll ────────────────────────────────────────────────────────
--   select slug, total_pistes_km, total_lifts, altitude_top,
--          nearest_airport, transfer_minutes, transfer_note
--   from public.resorts where country = 'Sweden' order by slug;
--
-- Antal publicerade orter med engelsk text kvar (ska bli 8):
--   select count(*) from public.resorts
--   where published and notes ~* '\y(the|and|with|from|for)\y';
