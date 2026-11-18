-- 042 · Omgång 4: tre italienska orter läggs in dolda, och Zermatt
-- rättas.
--
-- Underlaget är faktafilerna i projektmappen orter/ (val-gardena.md,
-- alta-badia.md, cervinia.md) och granskningen granskning-omgang4.md, alla
-- 2026-11-18. Där granskningen och forskarnas filer skiljer sig gäller
-- granskningen. Varje tal i kärnfälten är kontrollerat mot skiresort.com
-- två gånger, av forskaren och av granskaren.
--
-- De tre orterna läggs in med published = false. De visas inte förrän de
-- har en bild med licens i resort_images och en provad söksträng i
-- BOOKING_SOK (lib/booking.js), enligt CLAUDE.md. Ingen av dem har det i
-- dag.
--
-- Gemensamt för alla tre:
--   · Restid och avstånd är OSRM, samma metod som lib/restider.js,
--     avrundat till hel km och hel minut. Innsbruck flygplats har samma
--     koordinat för båda Dolomitorterna och för Obergurgl i 040
--     (11.3418706, 47.2597258). Malpensa 8.72306, 45.63.
--   · Port: Innsbruck för Val Gardena och Alta Badia, samma som St. Anton
--     och Obergurgl. SAS flyger Arlanda–Innsbruck en gång i veckan från
--     januari 2027 (flightconnections.com, uppdaterad 2026-11-17). Glest,
--     men reguljärt. Verona och Venedig har inget direktflyg från Arlanda
--     i vinter. Malpensa för Cervinia: SAS från december och Norwegian
--     från mars, tre avgångar i veckan (flightconnections.com, uppdaterad
--     2026-11-18). Turin har inget direktflyg från Sverige.
--   · Familj, afterski och bykänsla avser BYN (docs/poangskala.md).
--     Övriga betyg avser området.
--   · Val Gardena och Alta Badia har var sin post hos skiresort.com och
--     får ski_area null, som Les Arcs och La Plagne. Sellaronda är en runda
--     och Dolomiti Superski ett prisavtal; båda hör hemma i texten och i
--     STORRE_KORT (lib/liftkortspriser.js).
--   · Cervinia har ingen egen post. skiresort.com har en post för
--     "Zermatt/Breuil-Cervinia/Valtournenche – Matterhorn", och Cervinia
--     får därför exakt Zermatts tal och ski_area 'Matterhorn Ski Paradise'
--     (004). Områdesbetygen (snö, nybörjare, mellannivå, avancerad,
--     offpist, snowpark, gott om plats) är Zermatts, så att efterkontroll 2
--     i migration 014 håller. Ankarna i docs/poangskala.md, som hade
--     Cervinia på nybörjare 9, mellannivå 10 och avancerad 3, är rättade i
--     samma ändring (granskningen, beslut A).
--   · Cervinia fanns inte i databasen. Ingen migration lägger in den, och
--     HANDOFF.md skriver att Alpkoll inte har någon ort där. Därför insert.
--   · transfer_note sätts, som i 041.
--   · Liftkortet är det kort man köper för en vecka (beslut av Fabian
--     2026-11-18). lift_pass_day_eur och lift_pass_week_eur är
--     heltalskolumner (022), så 464,50 står som 465. De exakta talen står i
--     lift_pass_prices längst ner.
--
-- Texterna följer docs/copy.md: du-form, inga handskrivna tal, och varje
-- nackdel säger vem den gäller, ett faktum och en annan ort som finns på
-- sajten. Källan till varje namn står i kommentaren vid orten.
--
-- Kör i Supabase SQL Editor. Allt körs i en transaktion.

begin;

-- ── Zermatt ───────────────────────────────────────────────────────────
--
-- Konstsnö: skiresort.com, snow-reliability för posten Zermatt/Breuil-
-- Cervinia/Valtournenche: "1275 Snow cannons · 80 % of the slopes have
-- snow-making capabilities". Sajten visade 50, som ingen migration satt.
-- Cervinia nedan får samma 80.
--
-- Säsong: Zermatt Bergbahnens tidtabell "Winter 2026/27 01.11.2026 –
-- 02.05.2027" (matterhornparadise.ch, fahrplan_winter 2026_27.pdf). Sajten
-- visade november–april. Glaciärorter får säsong efter ortens vintersäsong
-- med glaciären, som Sölden, Zell am See-Kaprun och Les Deux Alpes.
-- Samma tidtabell: "Cervinia: offen ab / open from 24.10.2026".
--
-- Övriga områdesbetyg står kvar (snö 10, nybörjare 6, mellannivå 9,
-- avancerad 10, offpist 10, snowpark 7, gott om plats 6). Föregående
-- värden: snowmaking_coverage_pct 50, season_end_month 4.

update resorts
set snowmaking_coverage_pct = 80,
    season_end_month = 5
where slug = 'zermatt';

-- ── Val Gardena ───────────────────────────────────────────────────────
--
-- skiresort.com: "Val Gardena (Gröden)", 1236–2518 m, "Total: 181 km",
-- 52/108/21 km → 28/59/13, 79 liftar, "131140 Passengers/hour", 98 %
-- konstsnö. Posten omfattar Seiser Alm (Alpe di Siusi), som har samma
-- dalkort: "79 lifts + 181 km ski runs" (valgardena.it).
-- Koordinaten är Santa Cristina, den mittersta byn.
-- Säsong: Dolomiti Superski för Val Gardena / Seiser Alm 4.12.2026–
-- 4.4.2027; skiresort "Current season: 2026-12-04 - 2027-04-04".
--
-- Betyg som skiljer sig från forskaren (granskningen):
--   Nybörjare 6 (forskaren 5): samma som Zermatt (23 % blå) och Cortina.
--     Ski Club GB ger Val Gardena 3/5 och Zermatt 2/5 för nybörjare.
--   Snowpark 6 (forskaren 7): skiresort 5/5 är enda källan för mer än
--     normal alport, och Iglu säger både "several parks" och "Snow Parks
--     1". Samma regel som Serre Chevalier i omgång 3.
--   Afterski 6 (forskaren 6, ankaret 5): Ski Club GB 2/5 och skiresort
--     4/5, samma belägg som gav La Plagne 6. Ankaret i poangskala.md flyttas
--     till Alta Badia.
--
-- Liftkort: dalkortet Val Gardena / Seiser Alm, högsäsong vuxen 83 €
-- (Dolomiti Superskis kalkylator, kalendern 20.12.26–9.1.27 och 31.1.27;
-- skiresort "Day ticket Main season Adults € 83,-"). Sexdagarspriset
-- räknas i kalkylatorn bakom Cloudflare och kunde inte läsas: null.
-- Dolomiti Superski 89 / 453 € står som STORRE_KORT.
-- Restid: Innsbruck → Santa Cristina, OSRM 117,2 km / 102,9 min.
--
-- Texternas källor:
--   Byarna Ortisei, Santa Cristina och Selva: skiresort huvudsida.
--     Sellaronda förbi Selva genom Alta Badia, Arabba och Val di Fassa:
--     skiresort slope-offering. Seiser Alm på samma kort: valgardena.it,
--     seiseralm.it.
--   Offpistförbudet och freerideområdena med guide: skiresort experts-
--     freeriders ("Leaving the slopes (freeriding) is prohibited, except
--     in the freeride areas at Plan de Gralba, Seceda, and Monte Pana").
--     Chamonix: offpist 10 på sajten och ankare i poangskala.md.
--   Kabinbanorna till röda nedfarter och övningsbackarna i dalen och på
--     Plan de Gralba: skiresort beginners. Sälen 46 % blå (013).
--   Kabinbanor från Selva åt båda hållen: Ski Club GB ("direct access via
--     two gondolas to either the clockwise or anticlockwise loop").
--     Seceda och Seiser Alm från Ortisei: skiresort, valgardena.it.
--     Saslong med mål i Santa Cristina: skiresort slope-offering.
--     Barnområde i varje by: skiresort families-children.
--   Brennerpasset: OSRM-rutten. Inget tåg in i dalen: skiresort arrival
--     ("No direct train connection").
-- Struket: nackdelen om trängsel (jämförelsen var bara sajtens betyg) och
-- "utan stora afterskiställen" (forskarens sammanfattning, ingen källa).

insert into resorts (
  slug, name, country, region, ski_area, latitude, longitude,
  season_start_month, season_end_month,
  altitude_base, altitude_top, total_pistes_km,
  blue_percent, red_percent, black_percent,
  total_lifts, lift_capacity_per_hour, snowmaking_coverage_pct,
  lift_pass_day_eur, lift_pass_week_eur, lift_pass_currency,
  nearest_airport, airport_distance_km, transfer_minutes, transfer_note,
  snow_guarantee_score, beginner_score, intermediate_score, expert_score,
  off_piste_score, snowpark_score, family_friendly_score,
  apres_ski_score, village_charm_score, crowd_score,
  notes, where_to_stay, accommodation_zone, transport_info,
  published
) values (
  'val-gardena', 'Val Gardena', 'Italy', 'Dolomites', null, 46.5591, 11.7155,
  12, 4,
  1236, 2518, 181,
  28, 59, 13,
  79, 131140, 98,
  83, null, 'EUR',
  'Innsbruck', 117, 103, 'med bil från Innsbruck',
  8, 6, 9, 6,
  4, 6, 8,
  6, 9, 4,
  'Val Gardena passar dig som åker rött obehindrat och vill åka långt på pist. Dalen har byarna Ortisei, Santa Cristina och Selva i Sydtyrolen, och Sellaronda, rundan runt Sellamassivet, går förbi Selva vidare genom Alta Badia, Arabba och Val di Fassa. Talen avser Val Gardena tillsammans med Seiser Alm, som har samma dalkort. Vill du åka offpist är Val Gardena fel val. Åkning utanför pist är förbjuden utom i tre freerideområden, och där bara med guide. Välj Chamonix. Vill du lära dig åka är Val Gardena också fel val. Kabinbanorna leder till röda nedfarter, så du stannar i övningsbackarna i dalen och på Plan de Gralba. I Sälen är nästan hälften av pisten blå.',
  'Bo i Selva om du vill ut på Sellaronda direkt, eftersom kabinbanorna därifrån går upp mot rundan åt båda hållen. Från Ortisei går linbanor till Seceda och Seiser Alm. Santa Cristina ligger mellan dem, vid målet för världscupbacken Saslong. Varje by har barnområde och skidskola för barn.',
  'Selva, Santa Cristina, Ortisei',
  'Flyg till Innsbruck eller München och kör över Brennerpasset. Det går inget tåg in i dalen.',
  false
)
on conflict (slug) do nothing;

-- ── Alta Badia ────────────────────────────────────────────────────────
--
-- skiresort.com: "Alta Badia", 1324–2778 m, "Total: 130 km", 74/47/9 km
-- → 57/36/7, 53 liftar, "98993 Passengers/hour", 91 % konstsnö. Toppen är
-- Lagazuoi vid Falzaregopasset, som både skiresort och orten räknar in.
-- Koordinaten är Corvara. Säsong: skiresort "Current season: 2026-12-04 -
-- 2027-04-04", ortens prislista 4.12.2026–4.4.2027.
--
-- Betyg som skiljer sig från forskaren (granskningen):
--   Offpist 4 (forskaren 3): samma förbud som i Val Gardena (ankare 4),
--     och källorna går isär: skiresort "It is not permitted to ski outside
--     the slopes" mot Iglu "Going off piste with a guide, the area is as
--     extreme as you want it to be". Ett ytterläge (3) kräver mer.
--   Nybörjare 9 blir ankare i poangskala.md i stället för Cervinia.
--   Afterski 5 blir ankare i stället för Val Gardena: Ski Club GB 2/5,
--     skiresort 3/5, Iglu 3/5, Powderhounds "quieter & more refined".
--
-- Liftkort: ortens prislista "ALTA BADIA SKIPASS 2026 / 2027", högsäsong
-- 20.12.26–9.1.27 och 31.1–20.3.27, ADULTS "1 € 83,00", "6 € 421,00".
-- Fasta nivåer, inte dynamiskt. Dolomiti Superski 89 / 453 € står som
-- STORRE_KORT.
-- Restid: Innsbruck → Corvara, OSRM 134,7 km / 125,3 min. Forskaren
-- använde en annan flygplatskoordinat (136,0 / 121,2); granskaren
-- använde samma som för Val Gardena.
--
-- Texternas källor:
--   Fem byar, Corvara, Sellaronda med fyra områden: skiresort huvudsida
--     och regionsidan Sellaronda.
--   Lätta nedfarter till nästan hela området, skidskola och övningsbacke
--     i varje by: skiresort beginners ("Almost all parts of the ski area
--     can be reached via easy slopes. There are ski schools and dedicated
--     practice slopes in every village").
--   Stjärnkockarnas rätter och Michelinkrogarna: skiresort gastronomy,
--     Ski Club GB ("no fewer than six Michelin Stars").
--   Två svåra nedfarter, Gran Risa och Vallon: skiresort experts-
--     freeriders. Cortina d'Ampezzo 13 % svart (013), Alta Badia 7 %.
--   Afterskin slutar med sista nedfarten: skiresort apres-ski ("you must
--     start the valley run by 5 p.m."), Powderhounds. St. Anton: Ski Club
--     GB "Après ski is a major attraction here", Après 5/5; ankare 10.
--   Corvara och Colfosco mest folk, Badia utanför rundan, La Villa mindre
--     och lugnare: Ski Club GB. La Villa i skugga: Powderhounds. Hotell
--     vid pisten i Corvara, Colfosco och La Villa: skiresort
--     accommodations.
--   Pustertal: OSRM-rutten (SS49 och SS244).
-- Struket: "San Cassiano är den lugna byn" (en källa), turtätheten för
-- flyget och meningen om Venedig i transport_info, och nackdelen om
-- offpist (betyget är 4 som Val Gardena, och två nackdelar räcker).

insert into resorts (
  slug, name, country, region, ski_area, latitude, longitude,
  season_start_month, season_end_month,
  altitude_base, altitude_top, total_pistes_km,
  blue_percent, red_percent, black_percent,
  total_lifts, lift_capacity_per_hour, snowmaking_coverage_pct,
  lift_pass_day_eur, lift_pass_week_eur, lift_pass_currency,
  nearest_airport, airport_distance_km, transfer_minutes, transfer_note,
  snow_guarantee_score, beginner_score, intermediate_score, expert_score,
  off_piste_score, snowpark_score, family_friendly_score,
  apres_ski_score, village_charm_score, crowd_score,
  notes, where_to_stay, accommodation_zone, transport_info,
  published
) values (
  'alta-badia', 'Alta Badia', 'Italy', 'Dolomites', null, 46.5500, 11.8667,
  12, 4,
  1324, 2778, 130,
  57, 36, 7,
  53, 98993, 91,
  83, 421, 'EUR',
  'Innsbruck', 135, 125, 'med bil från Innsbruck',
  7, 9, 8, 4,
  4, 6, 8,
  5, 8, 5,
  'Alta Badia passar dig som lär dig åka eller vill åka långt på blått och rött. Området är fem byar i Val Badia med Corvara som den största, och ett av fyra områden på Sellaronda, rundan runt Sellamassivet. Nästan hela området nås via lätta nedfarter, och varje by har skidskola och övningsbacke. Bergsserveringarna har rätter framtagna av områdets stjärnkockar, och dalen har flera restauranger med Michelinstjärna. Ortens kort gäller Alta Badia, och med Dolomiti Superski åker du hela Sellaronda. Vill du åka brant är Alta Badia fel val. Området har bara två svåra nedfarter, Gran Risa och Vallon. Cortina d''Ampezzo har nästan dubbelt så stor andel svart pist. Söker du fest efter liftstängning är Alta Badia också fel val. Afterskin slutar när sista nedfarten till byn går, och kvällarna i byarna är lugna. Välj St. Anton.',
  'Corvara och Colfosco ligger på Sellaronda och har flest liftar ut, men också mest folk. La Villa är mindre och lugnare, med Gran Risa ner i byn, men ligger i skugga stora delar av vintern. Badia ligger utanför rundan, och därifrån tar du några liftar för att komma in i området. I Corvara, Colfosco och La Villa ligger många hotell direkt vid pisten.',
  'Corvara, Colfosco, La Villa, San Cassiano, Badia',
  'Flyg till Innsbruck och kör över Brenner och genom Pustertal in i Val Badia.',
  false
)
on conflict (slug) do nothing;

-- ── Cervinia ──────────────────────────────────────────────────────────
--
-- skiresort.com: "Zermatt/Breuil-Cervinia/Valtournenche – Matterhorn",
-- 1562–3899 m, "Total: 322 km", 75/220/27 km → 23/69/8 (källans egna
-- procent), 51 liftar, "96074 Passengers/hour", 80 % konstsnö. Samma tal
-- som Zermatt (004, 013, 038 och rättelsen ovan).
-- Orten heter officiellt Breuil-Cervinia sedan januari 2025
-- (en.wikipedia). Sajten skriver Cervinia, som Zermatts ortstext (029).
-- region = 'Aosta Valley' (skiresort "Aosta Valley (Valle d'Aosta)"),
-- översatt till Aostadalen i lib/countries.js.
-- Säsong: Cervino S.p.A.:s prislista "DAL/DE/FROM 24 OTTOBRE … 2026
-- AL/AU/TO 2 MAGGIO … 2027", och Zermatts tidtabell "Cervinia: open from
-- 24.10.2026".
--
-- Betyg (granskningen, beslut A–C):
--   Områdesbetygen är Zermatts: snö 10, nybörjare 6, mellannivå 9,
--     avancerad 10, offpist 10, snowpark 7, gott om plats 6.
--   Familj 7 (forskaren 8): barnområdet ligger i byn vid Cretaz och byn
--     är bilfri, men Ski Club GB varnar för vädret på höjden ("when the
--     weather is bad the slopes can be inhospitable for younger ones"),
--     och en knapp fjärdedel av områdets pist är blå. Samma som Zermatt.
--   Afterski 5: Ski Club GB 2/5 ("relatively quiet on the après front"),
--     Iglu "relaxed".
--   Bykänsla 4 (ankaret sade 3): platsen var en klätterby med hotell före
--     liftarna (Ski Club GB, it.wikipedia), men den moderna orten byggdes
--     ut kring linbanan till Plan Maison från 1936 och på höjden under
--     1960-talet (it.wikipedia). Ankaret skrivs om.
--
-- Liftkort: Cervino S.p.A.:s prislista 26/27, granskaren läste PDF:en
-- med pdftotext. Det internationella kortet "BREUIL-CERVINIA -
-- VALTOURNENCHE e ZERMATT", ADULT, "1 GIORNO … € 88,00", "6 GIORNI …
-- € 464,50", fast pris 24.10.26–2.5.27. Det ger de 322 km, som Zermatts
-- pris. Det egna kortet för Cervinia och Valtournenche, 64 / 338 €, står
-- i noten i lib/liftkortspriser.js. Samma kort kostar 122 / 574 CHF i
-- Zermatts dynamiska kalkylator (036); båda är ortens egen prislista.
-- Restid: Malpensa → Cervinia, OSRM 181,1 km / 139,5 min. Genève, som är
-- Zermatts port, är längre (196 km / 185 min enligt forskaren).
--
-- Texternas källor:
--   Långa blå och röda nedfarter, säker snö: Ski Club GB ("Cervinia was
--     almost designed for intermediate skiers", "one of Europe's longest
--     seasons"). Valtournenche och Zermatt i Matterhorn Ski Paradise:
--     skiresort huvudsida. Röd nedfart från Klein Matterhorn till
--     Valtournenche: Ski Club GB, Iglu ("a superb 22km red").
--   Det branta på schweiziska sidan: skiresort experts ("most of the
--     slopes are of medium or easy difficulty"), Ski Club GB ("does not
--     have as much steep on piste terrain as neighbouring Zermatt").
--     Zermatt: avancerad 10.
--   Kvällen på hotellen: Ski Club GB. St. Anton: se Alta Badia ovan.
--   Linbanan 1936, höjden på 1960-talet: it.wikipedia Breuil-Cervinia.
--     Cortina d'Ampezzo: Ski Club GB ("The town itself has a great buzz
--     and is full of great restaurants and bars"), bykänsla 10.
--   Bilfria gator: Iglu ("entirely pedestrianised"). Skidskolan i
--     centrum: Ski Club GB. Barnområdet vid Cretaz: skiresort families.
--     Hotell ovanför och öster om centrum: Ski Club GB ("a collection of
--     ski-in-ski-out hotels are located just above and to the east of the
--     centre"). Gondolen från Valtournenche till Salette: skiresort
--     beginners och slope-offering.
--   Aostadalen, tåg till Châtillon och buss: Ski Club GB ("catch the train
--     to Chatillon and then get the bus up to the resort").
-- Struket: byns höjd i notes (tal som finns i datan), och "Bo i Zermatt"
-- som "fel val": avancerad är 10 för området, så nackdelen skrivs som råd
-- om var du bor.

insert into resorts (
  slug, name, country, region, ski_area, latitude, longitude,
  season_start_month, season_end_month,
  altitude_base, altitude_top, total_pistes_km,
  blue_percent, red_percent, black_percent,
  total_lifts, lift_capacity_per_hour, snowmaking_coverage_pct,
  lift_pass_day_eur, lift_pass_week_eur, lift_pass_currency,
  nearest_airport, airport_distance_km, transfer_minutes, transfer_note,
  snow_guarantee_score, beginner_score, intermediate_score, expert_score,
  off_piste_score, snowpark_score, family_friendly_score,
  apres_ski_score, village_charm_score, crowd_score,
  notes, where_to_stay, accommodation_zone, transport_info,
  published
) values (
  'cervinia', 'Cervinia', 'Italy', 'Aosta Valley', 'Matterhorn Ski Paradise', 45.9344, 7.6311,
  10, 5,
  1562, 3899, 322,
  23, 69, 8,
  51, 96074, 80,
  88, 465, 'EUR',
  'Milano Malpensa', 181, 140, 'med bil från Milano Malpensa',
  10, 6, 9, 10,
  10, 7, 7,
  5, 4, 6,
  'Cervinia passar dig som vill åka långa blå och röda nedfarter med säker snö. Byn ligger på italienska sidan av Matterhorn, och pisterna hänger ihop med Valtournenche och över gränsen med Zermatt i Matterhorn Ski Paradise. Från Klein Matterhorn går en röd nedfart hela vägen ner till Valtournenche. Vill du åka brant varje dag bor du hellre i Zermatt. Från Cervinia är det mesta av pisten blå eller röd, och de branta nedfarterna ligger på schweiziska sidan. Vill du ha afterski är Cervinia fel val. Kvällen sker mest på hotellen och i några barer i byn. Välj St. Anton. Vill du bo i en gammal alpby är Cervinia också fel val. Byn byggdes ut kring linbanan från 1936 och på höjden under 1960-talet. Välj Cortina d''Ampezzo, en stad full av restauranger och barer.',
  'Byns gator är bilfria, och skidskolan och barnområdet vid Cretaz-liften ligger i centrum. Vill du åka från dörren finns hotell en bit ovanför och öster om centrum. Valtournenche längre ner i dalen har egen gondol upp till Salette.',
  'Breuil-Cervinia, Valtournenche',
  'Flyg till Milano Malpensa och kör upp genom Aostadalen. Med tåg åker du till Châtillon, och därifrån går bussen upp till Cervinia.',
  false
)
on conflict (slug) do nothing;

-- ── Prishistorik ──────────────────────────────────────────────────────
--
-- Samma tabell och form som 030, 040 och 041. Val Gardenas sexdagarspris
-- är okänt och lämnas null, som Obergurgls veckopris på dagskortets rad i
-- 040. Dolomiti Superski står som STORRE_KORT i koden, som för Cortina,
-- och får ingen egen rad.

insert into public.lift_pass_prices
  (resort_slug, season, currency, day_price, week_price, product,
   day_source, week_source, source_url, captured_on, note)
values
('val-gardena', '2026/2027', 'EUR', 83.00, null, 'Val Gardena / Seiser Alm',
 'ortens egen sida', null,
 'https://www.dolomitisuperski.com/en/plan-and-book/skipassandprices?singleValley=400', '2026-11-18',
 'Högsäsong i kalkylatorns kalender (20.12.26–9.1.27, 31.1.27), säsong 75. Sexdagarspriset räknas bakom Cloudflare och är inte läst. 5 % lägre på nätet minst två dagar före.'),
('alta-badia', '2026/2027', 'EUR', 83.00, 421.00, 'Alta Badia',
 'ortens egen sida', 'ortens egen sida',
 'https://www.altabadia.org/en/ski/slopes-of-the-dolomites/ski-pass-rates', '2026-11-18',
 'Högsäsong 20.12.26–9.1.27 och 31.1–20.3.27, fasta nivåer. Säsong 75 / 378. 5 % lägre på nätet minst två dagar före.'),
('cervinia', '2026/2027', 'EUR', 88.00, 464.50, 'Internationellt kort Breuil-Cervinia–Valtournenche–Zermatt',
 'ortens egen sida', 'ortens egen sida',
 'https://drive.google.com/file/d/1s3x1N87T783HT2CXjbAprGgQtUGqtgej/view', '2026-11-18',
 'Cervino S.p.A.:s prislista, fast pris 24.10.26–2.5.27. Cervinia och Valtournenche ensamt 64 / 338.')
on conflict (resort_slug, season, product) do nothing;

commit;


-- ── Efterkontroll ─────────────────────────────────────────────────────
--
--   select slug, published, region, ski_area, total_pistes_km,
--          total_lifts, snowmaking_coverage_pct,
--          lift_pass_day_eur, lift_pass_week_eur,
--          nearest_airport, airport_distance_km, transfer_minutes,
--          season_start_month, season_end_month
--   from resorts
--   where slug in ('val-gardena', 'alta-badia', 'cervinia', 'zermatt')
--   order by slug;
--
--   Förväntat: de tre nya published = false. val-gardena 181 km,
--   83 / null, Innsbruck 117 / 103. alta-badia 130 km, 83 / 421,
--   Innsbruck 135 / 125. cervinia och zermatt 322 km, 51 liftar, 80 %
--   konstsnö, ski_area 'Matterhorn Ski Paradise'. cervinia 10–5, zermatt
--   11–5.
--
--   Samma område, samma områdesbetyg (efterkontroll 2 i 014, här utan
--   villkoret published eftersom Cervinia är dold):
--
--   select ski_area,
--          count(distinct snow_guarantee_score), count(distinct beginner_score),
--          count(distinct intermediate_score), count(distinct expert_score),
--          count(distinct off_piste_score), count(distinct snowpark_score),
--          count(distinct crowd_score)
--   from resorts where ski_area = 'Matterhorn Ski Paradise'
--   group by ski_area;
--
--   Förväntat: 1 i varje kolumn.
--
--   select resort_slug, product, day_price, week_price
--   from lift_pass_prices
--   where resort_slug in ('val-gardena', 'alta-badia', 'cervinia');
--   Förväntat: tre rader, 83/null, 83/421 och 88/464,50.
