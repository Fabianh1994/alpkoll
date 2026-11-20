-- 049 · Omgång 10: elva befintliga orter i Norden och Andorra granskade
-- och rättade.
--
-- Underlaget är faktafilerna i projektmappen orter/ (are.md, salen.md,
-- trysil.md, hemavan.md, riksgransen.md, hemsedal.md, geilo.md, voss.md,
-- levi.md, ruka.md, grandvalira.md) och granskningen
-- granskning-omgang10.md, alla 2026-11-18. Där granskningen och forskarnas
-- filer skiljer sig gäller granskningen. Varje tal i kärnfälten nedan är
-- läst på skiresort.com två gånger, av forskaren och av granskaren (curl,
-- råtext).
--
-- Alla orter är befintliga och publicerade. Här görs bara UPDATE, och i
-- lift_pass_prices en INSERT. Varje sats säger nuvarande värde, nytt värde
-- och belägg.
--
-- Gemensamt:
--   · Restid och avstånd är OSRM från terminalen till ortens nuvarande
--     koordinat, avrundat till hel km och hel minut. Punkterna (granskaren
--     har kontrollerat att varje punkt ligger vid terminalen och var den
--     fäster):
--       Åre Östersund 14.5000, 63.1982 (Nominatim, parkeringen vid
--         terminalen på Rödövägen; fäster 7 m bort). Flygplatsens
--         mittpunkt 14.5037, 63.1942 fäster 349 m bort.
--       Scandinavian Mountains 12.8372, 61.1571 (som 044; fäster 20 m).
--       Oslo 11.0968, 60.1935 (som 044; fäster 2 m, Lufthavnvegen).
--       Hemavan Tärnaby 15.0833, 65.8145 (Älvstigen vid flygplatsens norra
--         ände; fäster 0 m). Flygplatsens mittpunkt 15.0836, 65.8057
--         fäster 267 m bort.
--       Kiruna 20.3349, 67.8255 (Nominatim "Terminal 1", aeroway=terminal;
--         fäster 30 m bort på Flygfältsvägen).
--       Bergen 5.2320580, 60.2883470 (Flyplassvegen 555, terminalens
--         adress; fäster 40 m). Flygplatsens mittpunkt 5.2198, 60.2965
--         fäster 262 m bort och ger 7 minuter mer.
--       Kittilä 24.8586, 67.6956 och Kuusamo 29.2269, 65.9960 (Nominatim,
--         aeroway=terminal; fäster 44 och 32 m).
--       Barcelona T1 2.0733, 41.2888 (fäster 6 m).
--   · Ortskoordinaterna ändras inte. Sälen (kyrkbyn), Hemavan (norr om
--     byn), Levi (öster om Sirkka) och Ruka (uppe på fjället) har
--     koordinater som inte ligger där boendet är. Bytena är ägarbeslut 2,
--     med båda måtten i granskningen. Här rättas restiden bara där den
--     lagrade är uppenbart fel mot nuvarande koordinat: Sälen och Hemavan.
--     Levi skiljer en minut och står kvar. Ruka står kvar: OSRM fäster
--     nuvarande punkt på en oskyltad väg i backen och kör de sista 1,3 km
--     på tolv minuter, så måttet är en artefakt och inte en restid.
--   · Portarna står kvar: Oslo för Trysil, Barcelona för Grandvalira.
--     Scandinavian Mountains för Trysil är ägarbeslut 3.
--   · Åre: talen avser fortfarande Åre by och Björnen, skiresorts post
--     "Åre" (91 km, 37 liftar). Duved/Tegefjäll är en egen post (20 km, 12
--     liftar) på samma SkiPass. Att slå ihop dem i lib/delomraden.js, som
--     Sälen och Vemdalen, är ägarbeslut 4. Texten säger vad talen avser.
--   · Betyg följer ankarna i docs/poangskala.md och är kalibrerade över
--     alla elva orter och de redan granskade nordiska (Vemdalen, Idre
--     Fjäll, Branäs, Hafjell) samtidigt. Se granskningen, tabell 1. Fyra
--     regler bär de flesta ändringarna:
--       Nybörjare följer blue_percent och skiresorts nybörjarsida: "Almost
--         the entire ski area can be accessed via easy slopes" med 45–55 %
--         blått ger 7 (Levi, Kitzbühel, Tignes), mer än 60 % ger 8–9.
--       Snowpark: skiresort 5/5 ger 7 (Hemsedal, Trysil, Hafjell, omgång
--         6), två oberoende källor om en park i europeisk klass ger 8.
--       Afterski: 6 när skiresort ger 3/5 eller fler källor beskriver
--         lugna kvällar (Sälen, Trysil, regeln från omgång 7).
--       Bykänsla 6 för nordiska orter byggda kring liftarna (omgång 6).
--   · Liftkortspriser: Riksgränsen och Ruka är lästa av granskaren med
--     curl. SkiStar-orterna, Voss och Grandvalira är lästa i webbläsare
--     2026-11-18 (projektmappen orter/liftkort-webblasare.md), vuxen, start
--     lördag 27.2.2027 enligt regeln från Zermatt (036), och för SkiStar
--     även måndag 1.3, datumet 019 använde. Samma slags pris som tidigare
--     migration för samma ort: SkiStars förköpspris (inte "Online samma
--     dag"), Voss pris i bokningskalendern (021), Grandvaliras kassapris
--     (034). Hemavans pris gick inte att läsa (Cloudflare) och står kvar.
--
-- Texterna följer docs/copy.md: du-form, inga handskrivna avstånd, höjder
-- eller pisttal, och varje nackdel säger vem den gäller, ett faktum och en
-- annan ort på sajten. Källan till varje nytt namn står vid orten.
-- Kontrollen / — |, vilket|snarare än|(?<!\p{L})vykort/gu ger noll
-- träffar i de nya texterna.
--
-- Kör i Supabase SQL Editor efter 046, 047 och 048. Allt körs i en
-- transaktion.

begin;

-- ── Förutsättning ─────────────────────────────────────────────────────
--
-- 048 satte Zermatts transfer_note till 'med tåg från Genève' och Saas-Fees
-- konstsnö till 45. Står de gamla värdena kvar är 048 inte körd, och då
-- avbryts 049 innan något ändras.
do $$
begin
  if not exists (select 1 from resorts
                 where slug = 'zermatt'
                   and transfer_note = 'med tåg från Genève')
     or not exists (select 1 from resorts
                    where slug = 'saas-fee'
                      and snowmaking_coverage_pct = 45) then
    raise exception 'Kör 048 före 049 (Zermatts transfer_note eller Saas-Fees konstsnö har inte 048:s värde)';
  end if;
end $$;

-- ── Åre ───────────────────────────────────────────────────────────────
--
-- skiresort "Åre" (sluggen aare): "380 m - 1319 m (Difference 939 m)",
-- "Total: 91 km", 45/38/8 km (49/42/9 %), "Total: 37".
--   lift_capacity_per_hour 35 000 → 49 073: ski-lifts "Total capacity
--     49073 Passengers/hour". Ingen migration satte 35 000.
--   snowmaking_coverage_pct 40 → 60: snow-reliability "60 % of the slopes
--     have snow-making capabilities". Ingen migration satte 40.
-- Duved/Tegefjäll (egen post): "420 m - 794 m", "Total: 20 km", "Total:
-- 12", "16563 Passengers/hour", konstsnö saknas. Ingår inte (ägarbeslut 4).
-- Säsong 11–5 stämmer ("General season: mid November - early May").
-- Liftkortet 759 / 3 744 SEK (019) står kvar, omläst 2026-11-18 för både
-- 27.2 och 1.3: lika.
--
-- Restid 100 / 60 → 87 / 84. OSRM 87,2 km, 84,1 min. 60 skrevs för hand i
-- 010 ("en timme med bil").
--
-- Nybörjare 6 → 7. skiresort beginners (5/5): "Almost the entire winter
--   sports area can be explored by beginners on easy and very easy
--   slopes", "You can even ski from the summit down to all base stations
--   in Åre on easy slopes" (läst av granskaren). SkiStar om Björnen
--   "barnens och nybörjarnas paradis". 49 % blått; Levi har 7 vid 45 %.
-- Övriga betyg står kvar.
--
-- Texter:
--   notes: "939 meter" och "91 kilometer" är datatal i löptext och stryks
--     (samma fel som 031 rättade för Sälen). "Mest fallhöjd av de nordiska
--     orterna här" stryks också: en jämförelse med sajtens urval blir fel
--     när urvalet ändras, som Hemsedals i 029 (se nedan), och vanliga
--     frågor räknar fram den ur datan. Första meningen: avancerad 8 och
--     offpist 8, högst bland de svenska orterna utom Riksgränsens offpist;
--     skiresort experts-freeriders "the challenging World Cup slopes below
--     the 1,420 m high Åreskutan". Lätta nedfarter: ovan. "Talen här avser
--     Åre by och Björnen": skiresort, två poster; SkiStar "Ditt SkiPass i
--     Åre gäller för skidåkning på Åreskutan, centrala Åre, Åre Björnen,
--     Duved och Tegefjäll". Nackdel: Snowthere "Åre By is the nightlife
--     base … Sleeping there and expecting a quiet baby nap is not";
--     skiresort families "The Åre Björnen area is specially designed for
--     children"; Sälen familj 10 (ankare), Snowthere Sälen "the entire
--     resort feels purpose-built for young kids" (läst av granskaren).
update resorts
set lift_capacity_per_hour = 49073,
    snowmaking_coverage_pct = 60,
    airport_distance_km = 87,
    transfer_minutes = 84,
    beginner_score = 7,
    notes = 'Åre passar dig som vill åka brant och offpist i Sverige. Under Åreskutan ligger världscupbackarna, och från toppen går också lätta nedfarter ner till alla dalstationer. Nattåget från Stockholm stannar mitt i byn. SkiPass gäller i två liftsystem, Åre by med Björnen och Duved med Tegefjäll, och skidbussen mellan dem är gratis. Talen här avser Åre by och Björnen. När det blåser hårt på kalfjället stänger toppliftarna. Åker du med små barn är Åre by fel ställe att bo. Där är nattlivet, och barnområdena ligger i Björnen. I Sälen är hela orten byggd för barnfamiljer.'
where slug = 'are';

-- ── Sälen ─────────────────────────────────────────────────────────────
--
-- skiresort, två poster: Lindvallen/Högfjället "579 m - 887 m", "Total: 42
-- km", "Total: 58", "59205 Passengers/hour", 75 %; Tandådalen/Hundfjället
-- "572 m - 872 m", "Total: 45 km", "Total: 48", "52254 Passengers/hour",
-- 80 %. Summorna 87 km, 106 liftar, 111 459 och 78 % stämmer med datan och
-- lib/delomraden.js (039). Inget tal ändras. Liftkortet 650 / 3 126 SEK
-- (019) står kvar, omläst 2026-11-18 för både 27.2 och 1.3: lika.
--
-- Restid 20 / 25 → 31 / 33. OSRM 30,6 km, 33,3 min till nuvarande
-- koordinat, som är kyrkbyn Sälen (Nominatim "Vikhansvägen, Fallet")
-- öster om skidområdet. 25 är flygplatsens egen tid till Lindvallen
-- ("Lindvallen 25 min", scandinavianmountains.se) och 20 km mättes aldrig.
-- Till Lindvallen: 26,5 km / 30,0 min (ägarbeslut 2).
--
-- Bykänsla 7 → 6. SkiStar "SkiStar Sälen består av fyra unika
--   skidområden"; Snowthere "Don't book it if … your family craves Alpine
--   village atmosphere" (läst av granskaren). Fyra anläggningar kring
--   liftarnas dalstationer, samma beskrivning som Vemdalen, Idre Fjäll,
--   Branäs och Hafjell (6). Ägarbeslut 2 i omgång 6 lämnade frågan öppen
--   eftersom Sälen inte ingick; nu ingår orten. Högfjällshotellet från
--   1937 är ett hotell, ingen by.
-- Övriga betyg står kvar. Nybörjare 10, familj 10 och snösäkerhet 6 är
-- ankare.
--
-- Texter:
--   notes: "Fallhöjden är den minsta av de svenska orterna här" är fel
--     sedan Idre Fjäll publicerades (302 m mot 308). Ortsidans egen fråga
--     säger "Fem av de sju orterna i Sverige på Alpkoll har större
--     fallhöjd". 939 / 308 = 3,0.
--   transport_info: tåget till Mora läggs till (Snälltåget, TAGLINJER i
--     lib/restider.js: "Mora 14.05, buss vidare till Lindvallen,
--     Högfjället, Tandådalen och Hundfjället").
--   accommodation_zone: Hundfjället läggs till, som where_to_stay nämner.
--     Booking söker på BOOKING_SOK, inte på fältet.
update resorts
set airport_distance_km = 31,
    transfer_minutes = 33,
    village_charm_score = 6,
    notes = 'Sälen passar dig som åker med barn eller står på skidor för första gången. SkiStars fyra områden, Lindvallen, Högfjället, Tandådalen och Hundfjället, har gemensamt liftkort. De hänger ihop två och två, och mellan paren går skidbussen gratis med SkiPass. Vill du åka brant är Sälen fel val. Fallhöjden är liten, och Åre har ungefär tre gånger så mycket.',
    transport_info = 'Under vintersäsongen kör Fjällexpressen buss till Sälen från bland annat Stockholm, Göteborg och Malmö. Med Snälltåget åker du till Mora och tar bussen sista biten. Scandinavian Mountains Airport har bara trafik under vintersäsongen.',
    accommodation_zone = 'Lindvallen, Högfjället, Tandådalen, Hundfjället'
where slug = 'salen';

-- ── Trysil ────────────────────────────────────────────────────────────
--
-- skiresort "Trysil": "395 m - 1100 m (Difference 705 m)", "Total: 78 km",
-- 40/18/20 km (51/23/26 %), "Total: 41".
--   lift_capacity_per_hour 40 000 → 54 444: "Total capacity 54444
--     Passengers/hour". Ingen migration satte 40 000.
--   snowmaking_coverage_pct 50 → 77: "510 Snow cannons", "77 % of the
--     slopes have snow-making capabilities". Ingen migration satte 50.
-- Säsong 11–4 stämmer ("Current season: 2026-11-28 - 2027-04-18").
-- Liftkortet 775 / 3 806 NOK (019) står kvar, omläst 2026-11-18 för både
-- 27.2 och 1.3: lika.
--
-- Restid 200 / 150 → 174 / 145, porten Oslo står kvar. OSRM 174,3 km,
-- 145,4 min. 150 skrevs för hand i 011. (Scandinavian Mountains: 44,6 km /
-- 44,4 min, ägarbeslut 3.)
--
-- Nybörjare 7 → 8. skiresort beginners (5/5) "Almost the entire ski area
--   can be accessed via very easy and easy slopes", gratis rullband (läst
--   av granskaren); Snowthere "Trysil is Scandinavia's strongest first-ski
--   resort" (läst). Vemdalen har 9 vid samma blå andel (51 %); 26 % svart
--   håller Trysil under.
-- Mellannivå 8 → 7. Röd pist är 23 %, minst bland de stora nordiska
--   orterna; Snowthere "Skip it if your family already skis reds
--   confidently". 8 är ankaret för normal stor alport, och Trysil stod
--   högst i Norden. Åre (91 km, 42 % rött) och Hemsedal har 7.
-- Bykänsla 7 står kvar, SVAGT: ingen källa här beskriver när
--   anläggningarna byggdes eller byn Innbygda i dalen. Ägarbeslut 6.
-- Övriga betyg står kvar.
--
-- Texter:
--   notes: "Fallhöjden är 705 meter, och Hemsedal har 830" är handskrivna
--     tal, samma fel som 031 rättade för Sälen. Hemsedal och Åre har
--     avancerad 8 mot Trysils 6.
--   transport_info: SkiStar (resan hit) "Nyhet: Snälltåget till Trysil med
--     transfer i Oslo … fortsätta med inkluderad busstransfer till
--     Trysil", "resa med buss till Trysil med Fjällexpressen från Malmö via
--     bland annat Göteborg" (forskaren).
update resorts
set lift_capacity_per_hour = 54444,
    snowmaking_coverage_pct = 77,
    airport_distance_km = 174,
    transfer_minutes = 145,
    beginner_score = 8,
    intermediate_score = 7,
    notes = 'Trysil passar dig som åker med barn. Skidområdet ligger runt Trysilfjellet, med boende på både norra och södra sidan, och varje område har ett eget barnområde. Vill du åka brant är Trysil fel val. Fallhöjden är mindre än i Hemsedal och Åre.',
    transport_info = 'Flyger du landar du i Oslo eller på Scandinavian Mountains Airport vid Sälen, som bara har trafik under vintersäsongen. Snälltåget går via Oslo med busstransfer till Trysil, och under vintersäsongen kör Fjällexpressen buss från Malmö via Göteborg.'
where slug = 'trysil';

-- ── Hemavan ───────────────────────────────────────────────────────────
--
-- skiresort "Hemavan": "470 m - 1135 m", "Total: 30 km", 19/9/2 km
-- (63/30/7 %), "Total: 10", "11180 Passengers/hour".
--   snowmaking_coverage_pct 10 → 30: "154 Snow cannons", "30 % of the
--     slopes have snow-making capabilities". Ingen migration satte 10.
--   season_end_month 4 → 5: "General season: early November - early May",
--     "Current season: 2026-11-27 - 2027-05-02"; hemavan.nu prisperiod "14
--     feb – 3 maj"; pistat.se "Säsong 27 nov–2 maj" (forskaren). Samma
--     slutdag som Åre och Hemsedal, som har 5.
-- Tärnaby är en egen post (20 km) och ingår inte. Liftkortet 665 / 2 955
-- (034) står kvar; dagspriset är inte omläst.
--
-- Restid 5 / 15 → 4 / 6. OSRM 4,3 km, 6,3 min till nuvarande koordinat,
-- som ligger drygt 2 km norr om byn och fäster 355 m från väg. 15 var
-- aldrig mätt. Till byns koordinat: 0,2 km / 0,4 min (ägarbeslut 2).
--
-- Nybörjare 6 → 8. 63 % lätt pist; skiresort beginners 5/5. 6 stod i
--   strid med blue_percent (poangskala.md): Voss och Geilo har 7 vid 55
--   och 53 %, Hemsedal och Idre Fjäll 9 vid 67 och 70 %.
-- Snowpark 5 → 7. skiresort snow-park 5/5 (läst av granskaren);
--   pistat.se "1,3 km lång park i Hotellbacken" och "Två snowparker och
--   två skicrossbanor" (forskaren). 5 betyder park mest på pappret, vilket
--   ingen källa säger. skiresort 5/5 ger 7 (Hemsedal, Trysil, Hafjell).
-- Familj 6 → 7. skiresort families 5/5, "children's areas located at the
--   valley stations and throughout the ski area" (läst av granskaren);
--   hemavan.nu tre barnområden, ett vid Centrumliften. 8, som forskaren
--   föreslog, vilar på ortens egen sida som andra källa (ägarbeslut 7).
-- Övriga betyg står kvar. Gott om plats 8 är ankare.
--
-- Texter:
--   notes: "Pisten är 30 kilometer" (rättad en gång med replace() i 038),
--     "400 kilometer" och "två mil" är handskrivna tal och stryks.
--     Barnområdena: hemavan.nu/skidakning/lennys-varld/barnomraden/.
--     Kungsleden, Anja Pärson och Stenmark: 029. Samma liftkort i Tärnaby:
--     hemavan.nu/skidakning/liftkort/. Nackdel: Trysil 78 km i ett område
--     (skiresort), 78 / 30 = 2,6.
--   where_to_stay: "fem liftar" stryks. Centrumliften: hemavan.nu
--     ("precis vid Centrumliften … Centrums barnområde").
update resorts
set snowmaking_coverage_pct = 30,
    season_end_month = 5,
    airport_distance_km = 4,
    transfer_minutes = 6,
    beginner_score = 8,
    snowpark_score = 7,
    family_friendly_score = 7,
    notes = 'Hemavan passar dig som vill åka offpist och slippa köer, och dig som åker med små barn. Byn har tre barnområden, och här börjar Kungsleden, som går norrut till Abisko. Anja Pärson hade sina träningsbackar här, och Ingemar Stenmark växte upp i Tärnaby, där samma liftkort gäller. Åker du en hel vecka och vill byta nedfart ofta är Hemavan litet. Trysil har mer än dubbelt så mycket pist i ett sammanhängande område.',
    where_to_stay = 'Boendet i Hemavan är stugor, lägenheter, hotell och vandrarhem. Med barn bor du nära Centrumliften, där Centrums barnområde ligger med skiduthyrning och liftkortsförsäljning. Tärnaby har ett eget skidområde i samma liftkort, där Ingemarbacken och Anjabacken är de mest krävande nedfarterna.'
where slug = 'hemavan';

-- ── Riksgränsen ───────────────────────────────────────────────────────
--
-- skiresort "Riksgränsen": "520 m - 909 m (Difference 389 m)", "Total: 21
-- km", 10/10/1 km (47/47/6 %), "Total: 6", "No artificial snow-making".
--   lift_capacity_per_hour 8 000 → 6 090: ski-lifts "Total capacity 6090
--     Passengers/hour". Ingen migration satte 8 000.
-- Säsong 2–5 står kvar, enligt orten: riksgransen.se "Vintersäsongen 2027,
-- 18 feb – 23 maj"; axess-butiken "Riksgränsen 19 feb - 23 maj" (läst av
-- granskaren). skiresort säger "Current season: 2027-02-19 - 2027-06-20",
-- men ortens egen uppgift om sin säsong väger tyngst.
--
-- Liftkortet 520 / 2 547 (25/26) → 546 / 2 673 SEK (26/27).
--   riksgransen.se, Liftkort & Arctic Skipass: "1 dag Vuxen 546 SEK", "5
--   dagar Vuxen 2304 SEK", "Extra dagar Vuxen 369 SEK" (läst av
--   granskaren). 2 304 + 369 = 2 673, samma uppställning som 25/26 (2 195
--   + 352). Ingen egen sexdagarsrad; valfria sex dagar kostar 2 674.
--   Sidan anger inget år, men butiken laplandresorts.axess.shop har
--   rubriken "Riksgränsen & Björkliden fjällby 2027" och "Försäljning av
--   liftkort börjar 4 november 2026" (läst av granskaren). Ett pris hela
--   säsongen, så startdagen spelar ingen roll. Föregående säsong 520 /
--   2 547 SEK står kvar i lift_pass_prices.
--
-- Restid 130 / 90 → 139 / 120. OSRM 139,3 km, 120,1 min. riksgransen.se
-- "Transfern mellan Kiruna och Riksgränsen tar runt 120 minuter".
--
-- Nybörjare 4 → 6. 4 är Chamonix-ankaret ("osammanhängande områden, brant,
--   dåliga övningsbackar"), som ingen källa beskriver här. skiresort
--   beginners 4/5, 47 % lätt; pistat.se "skidskola, skiduthyrning och ett
--   barnområde". Åre hade 6 vid 49 %.
-- Avancerad 8 → 6. Svår pist är en kilometer, en svart nedfart, och
--   fallhöjden 389 m. Avancerad avser pistad svår åkning och skiljs från
--   offpist med flit (poangskala.md); offpisten bärs av ankaret offpist 9.
--   Levi har 6 med 8 % svart och 335 m. skiresort experts-freeriders 4/5
--   blandar pist och offpist. Nivån 6 mot 5 är SVAG (Sälen 5).
-- Snowpark 5 → 3. skiresort snow-park "There is no snow park or halfpipe
--   in Riksgränsen" (läst av granskaren); pistat.se "Nej, Riksgränsen har
--   ingen snowpark", kontrollerat inför 26/27 (forskaren). Ingen källa
--   säger emot, till skillnad från Cortina (4, inthesnow nämner en park)
--   och Engelberg (4, en bana med vågor). Nytt ankare för 3 i
--   poangskala.md.
-- Övriga betyg står kvar. Offpist 9 och gott om plats 8 är ankare.
-- Bykänsla 7 är SVAG (ägarbeslut 6).
--
-- Texter:
--   notes: "Pisten är 21 kilometer med sex liftar" är datatal och stryks.
--     "från mitten av mars till mitten av maj" → "från mars till maj":
--     riksgransen.se "Boka din Heliski i mars-maj". Nackdel: snowpark,
--     Hemavan har två (pistat.se "Två snowparker"; skiresort Hemavan
--     "Snowpark Hemavan", "Lenny's Mini Snowpark").
--   where_to_stay: "700 meter" stryks. "Hotel" → "Hotell", som orten
--     skriver. Samma liftkort: riksgransen.se "Säsongspasset gäller i både
--     Björkliden fjällby och i Riksgränsen".
--   transport_info: SJ kör nattågen till övre Norrland från december 2026
--     (Trafikverket, "dagliga tur- och returresor Stockholm–Narvik").
--     riksgransen.se "Från tågstationen i Riksgränsen är det endast några
--     hundra meter till Hotell Riksgränsen", "bussar, tåg och taxi", "Vid
--     Kiruna flygplats kan du hyra bil" (forskaren). Ingen rad i
--     TAGLINJER: klockslagen är inte lästa.
update resorts
set lift_capacity_per_hour = 6090,
    lift_pass_day_eur = 546,
    lift_pass_week_eur = 2673,
    lift_pass_currency = 'SEK',
    airport_distance_km = 139,
    transfer_minutes = 120,
    beginner_score = 6,
    expert_score = 6,
    snowpark_score = 3,
    notes = 'Riksgränsen passar dig som vill åka offpist och sent på våren. Liftarna öppnar i februari, och från mars till maj flyger helikoptrar upp skidåkare på topparna runt orten. Vill du åka i december eller januari är Riksgränsen fel val, eftersom liftarna inte har öppnat. Åre öppnar i november. Åker du snowpark är Riksgränsen också fel val. Orten har ingen snowpark, och Hemavan har två.',
    where_to_stay = 'Riksgränsen ligger vid norska gränsen, med järnvägsstation och Hotell Riksgränsen. Björkliden, mellan Riksgränsen och Abisko längs Malmbanan, har ett eget skidområde i samma liftkort, och med liftkortet åker du gratis transferbuss mellan orterna.',
    transport_info = 'SJ:s nattåg mellan Stockholm och Narvik stannar vid Riksgränsens station, och hotellet ligger en kort promenad därifrån. Flyger du landar du i Kiruna och tar buss, tåg eller hyrbil sista biten.'
where slug = 'riksgransen';

-- ── Hemsedal ──────────────────────────────────────────────────────────
--
-- skiresort "Hemsedal": "620 m - 1450 m (Difference 830 m)", "Total: 44.1
-- km", 29,2/10,8/4,1 km (67/24/9 %), "Total: 22".
--   lift_capacity_per_hour 28 000 → 27 790: "Total capacity 27790
--     Passengers/hour". Ingen migration satte 28 000.
--   snowmaking_coverage_pct 40 → 60: "325 Snow cannons", "60 % of the
--     slopes have snow-making capabilities". Ingen migration satte 40.
-- Säsong 11–5 stämmer.
--   lift_pass_day_eur 745 → 775: SkiStars norska sida, SkiPass 1 dag,
--     vuxen, lördag 27.2.2027 "Voksne (18-64 År) | 775 NOK" (webbläsare,
--     2026-11-18). 745 i 019 gällde måndag 1.3 och står i den läsningen
--     kvar för måndagen. Hemsedals dagskort är det enda SkiStar-pris som
--     skiljer mellan datumen. Sexdagarskortet 3 769 är lika båda dagarna.
--
-- Restid 190 / 180 → 209 / 211. OSRM 209,1 km, 211,1 min. 180 skrevs för
-- hand i 011. Snowthere "3.5-hour transfer from Oslo" (forskaren).
--
-- Familj 7 → 8. skiresort families 5/5, "one of the largest children's
--   areas in Norway" (läst av granskaren), barnområdet framför SkiStar
--   Lodge; Snow Magazine "The children's area at Hemsedal Skicenter is
--   the largest in Norway"; World Travel Guide gratis kort för barn upp
--   till sex år med hjälm; Snowthere "Norway's most complete family ski
--   resort" (forskaren). Trysil, Geilo och Hafjell har 8.
-- Övriga betyg står kvar. Avancerad 8 med 9 % svart står, eftersom tre
-- källor kallar backarna mot liftbotten branta; snösäkerhet 8 är högst i
-- Norden och står (granskningen, tabell 1).
--
-- Texter:
--   notes: "Hemsedal har mest fallhöjd av de norska orterna här" är fel
--     sedan Hafjell publicerades (864 m mot 830). Ortsidans egen fråga
--     säger "En av de fem orterna i Norge på Alpkoll har större
--     fallhöjd". "1 450 meter" är altitude_top och stryks, och "ingen
--     nordisk ort här når högre" stryks av samma skäl som fallhöjden.
--     "sex kilometer" är längsta nedfarten (skiresort "Longest run
--     Totten-Hemsedal … Length 6 km"), inget datafält, och står kvar.
--     Första meningen säger vem orten passar: nybörjare 9 och avancerad 8.
--     Nackdel: Snow Magazine "Train station Gol"; Geilo: 029, skiresort
--     "Thanks to the train station in Geilo".
update resorts
set lift_capacity_per_hour = 27790,
    snowmaking_coverage_pct = 60,
    airport_distance_km = 209,
    transfer_minutes = 211,
    lift_pass_day_eur = 775,
    family_friendly_score = 8,
    notes = 'Hemsedal passar dig som vill ha lätta backar och brant åkning i samma område. Från toppen på Totten åker du sex kilometer i ett svep ner till liftbotten. Två tredjedelar av pisten är blå. Vill du utanför pisten går Roniheisen till Gummiskogen, som tidningen Friflyt kallar Norges mest kända offpiståkning. Vill du resa utan bil är Hemsedal fel val. Tåget stannar inte här, och från Oslo tar du buss. I Geilo stannar Bergensbanan mitt i byn.'
where slug = 'hemsedal';

-- ── Geilo ─────────────────────────────────────────────────────────────
--
-- skiresort "Geilo": "779 m - 1178 m (Difference 399 m)", "Total: 34.2
-- km", 18/12/4,2 km (53/35/12 %), "Total: 20".
--   lift_capacity_per_hour 16 000 → 25 482: "Total capacity 25482
--     Passengers/hour". Ingen migration satte 16 000.
--   snowmaking_coverage_pct 40 → 80: "100 Snow cannons", "80 % of the
--     slopes have snow-making capabilities". Ingen migration satte 40.
-- Säsong 11–4 stämmer. Liftkortet 693 / 2 871 NOK (25/26) står kvar; se
-- granskningen om dagspriset 745 under samma rubrik.
--
-- Restid 240 / 180 → 228 / 228. OSRM 227,5 km, 228,0 min. 180 skrevs för
-- hand i 011.
--
-- Mellannivå 7 → 6. skiresort slope-offering 3/5, "The two parts of the
--   ski area are connected by a ski bus" (läst av granskaren), längsta
--   nedfarten 2,9 km; Snow Magazine "rather than high-octane,
--   mileage-hungry skiing" (forskaren). Ankaret 6, små orter med
--   begränsad variation. Idre Fjäll (41 km) och Vemdalen har 6.
-- Snowpark 6 → 7. skiresort snow-park 5/5, "3 snow parks that offer a
--   challenge for every skill level and feature over 200 different
--   elements" (läst av granskaren). Samma som Hemsedal, Trysil, Hafjell.
-- Afterski 7 → 6. skiresort apres-ski 3/5 (läst); Snow Magazine
--   "Apres-ski is lively at weekends but quieter during the week",
--   Snowthere "everyone's in wool socks by 7pm" (forskaren). Trysil och
--   Sälen har 6.
-- Övriga betyg står kvar.
--
-- Texter:
--   notes: "Fallhöjden är 399 meter, och Hemsedal har 830" är handskrivna
--     tal. 399 / 830 = 0,48. Ny nackdel: delarna utan lift emellan,
--     skiresort Hemsedal "From the valley station Skisenter, you can
--     access the slopes on the mountains Totten 2 (1,450 m), Tinden (1,345
--     m), and Roni (1,225 m)" (forskaren).
update resorts
set lift_capacity_per_hour = 25482,
    snowmaking_coverage_pct = 80,
    airport_distance_km = 228,
    transfer_minutes = 228,
    intermediate_score = 6,
    snowpark_score = 7,
    apres_ski_score = 6,
    notes = 'Geilo passar dig som åker med barn eller är nybörjare. Över hälften av pisten är blå, och backarna ligger på båda sidor om dalen med Bergensbanans station i byn. Vill du åka brant är Geilo fel val. Fallhöjden är ungefär hälften av Hemsedals. Vill du åka långt utan att ta bussen är Geilo också fel val. Mellan dalens två sidor går ingen lift, och i Hemsedal når du alla tre fjällen med lift från samma liftbotten.'
where slug = 'geilo';

-- ── Voss ──────────────────────────────────────────────────────────────
--
-- skiresort "Voss Resort": "(56 m -) 284 m - 964 m (Difference 680 m)",
-- "Total: 45 km", 25/8/12 km (55/19/26 %), "Total: 10".
--   lift_capacity_per_hour 14 000 → 13 444: "Total capacity 13444
--     Passengers/hour". Ingen migration satte 14 000.
--   snowmaking_coverage_pct 30 → 50: "88 Snow cannons", "50 % of the
--     slopes have snow-making capabilities". Ingen migration satte 30.
-- Säsong 12–4 stämmer.
--   lift_pass_week_eur 2 990 → 2 750: booking.vossresort.no, samma
--     bokningskalender som 021, "6-8 dagerskort", vuxen, start lördag
--     27.2.2027: "Sat, Feb 27 | Vaksen | 2 750 NOK" (webbläsare,
--     2026-11-18). Kalendern visar 2 750 för varje startdag 8.2–7.3.2027.
--     Voss säljer billigast på nätet och visar inget kassapris, så
--     kalenderpriset är det enda som finns, som i 021.
--   Dagspriset 675 står och gäller nu också lördag: kalendern visar 675
--     varje dag 8.2–7.3.2027, och helgpriset 720 i 021 syns inte längre.
--   Kvot 2 750 / 675 = 4,07.
--
-- Restid 100 / 75 → 101 / 109. OSRM 100,6 km, 108,8 min. 75 skrevs för
-- hand i 011.
--
-- Afterski 7 → 6. skiresort apres-ski 3/5, "Especially on weekends, you
--   can end your ski day in a great way" (läst av granskaren); Snow
--   Magazine "The 'apres' scene is limited", Snowthere "Evenings in Voss
--   are quiet and cozy" (forskaren). Regeln från omgång 7.
-- Övriga betyg står kvar. Familj 6 står: byn ligger vid sjön och pisterna
-- uppe på fjället (Snowthere "You won't find true ski-in/ski-out here").
--
-- Texter:
--   notes: "på 820 meter", "45 kilometer pist" och "284 meter" är
--     handskrivna tal och stryks. Bavallen: skiresort slope-offering "The
--     valley runs end in Bavallen. There is no valley run all the way to
--     Voss" (läst av granskaren). Nackdel: familj 6 mot Geilos 8; Geilo
--     skiresort "Valley runs lead to all base stations" (forskaren).
update resorts
set lift_capacity_per_hour = 13444,
    snowmaking_coverage_pct = 50,
    airport_distance_km = 101,
    transfer_minutes = 109,
    lift_pass_week_eur = 2750,
    apres_ski_score = 6,
    notes = 'Voss passar dig som vill ta tåget ända fram till liften. Voss gondol går sedan 2019 från järnvägsstationen upp till Hanguren, och därifrån når du skidområdet. Nedfarterna slutar i Bavallen, så tillbaka till Vossevangen tar du gondolen. Vill du åka skidorna hem till dörren är Voss fel val om du bor i stan. I Geilo slutar nedfarterna vid liftbottnarna nere i byn.'
where slug = 'voss';

-- ── Levi ──────────────────────────────────────────────────────────────
--
-- skiresort "Levi": "196 m - 531 m (Difference 335 m)", "Total: 38.5 km",
-- 17,5/18,1/2,9 km (45/47/8 %).
--   total_lifts 26 → 28: "Total: 28", "New in 2026/2027 SE Sunny Express
--     6pers. High speed chairlift" (forskaren).
--   lift_capacity_per_hour 22 000 → 40 441: "Total capacity 40441
--     Passengers/hour". Ingen migration satte 22 000.
--   snowmaking_coverage_pct 60 → 70: "380 Snow cannons", "70 % of the
--     slopes have snow-making capabilities". Ingen migration satte 60.
-- Säsong 10–5 stämmer ("Current season: 2026-10-02 - 2027-05-02").
-- Liftkortet 60 / 269 € (032) stämmer med levi.fi (forskaren).
--
-- Restid 15 / 20 står kvar. OSRM till nuvarande koordinat 17,5 km / 21,0
-- min, som fäster 451 m bort öster om Sirkka. En minuts skillnad är inte
-- uppenbart fel. Till Sirkka: 14,2 km / 15,2 min (ägarbeslut 2).
--
-- Snowpark 6 → 7. skiresort snow-park 5/5, "Levi South Park is located in
--   the upper area of the six-seater chairlift Levi South", superpipe på
--   Front Slopes (läst av granskaren). Ruka och Åre har 7.
-- Övriga betyg står kvar. Bykänsla 8 och mellannivå 7 är SVAGA
-- (ägarbeslut 6 och 8).
--
-- Texter:
--   notes: "170 kilometer norr om polcirkeln", "335 meter" och "939" är
--     handskrivna tal och stryks. 335 / 939 = 0,36. Barnen: skiresort
--     beginners 5/5 "Levi is a paradise for beginners", families 5/5.
--     Världscupen: skiresort experts-freeriders "The demanding World Cup
--     downhill run G.2 hosts the FIS World Cup every November" (forskaren).
--   where_to_stay: levi.fi "NEW! From the 2026–2027 season onwards, Ski
--     Bus transportation is included with all ski passes" (forskaren).
--   transport_info: inget direktflyg från Sverige vintern 26/27 (levi.fi
--     "Direct Flights to Kittilä winter season 2026-2027" utan svensk
--     stad; Time Out), "Finnair flies daily from Helsinki to Kittilä"
--     (forskaren). 029 strök bytet för att det saknade belägg.
update resorts
set total_lifts = 28,
    lift_capacity_per_hour = 40441,
    snowmaking_coverage_pct = 70,
    snowpark_score = 7,
    notes = 'Levi passar dig som vill åka tidigt på säsongen eller har barn som lär sig åka. Liftarna brukar öppna i oktober, och i november körs världscupen i slalom här. Vill du åka brant är Levi fel val. Fallhöjden är ungefär en tredjedel av Åres.',
    where_to_stay = 'Byn Sirkka vid foten av Levi är ortens centrum, med hotell, lägenheter och stugor. Backarna når du till fots eller med skidbussen, som från vintern 2026/27 ingår i liftkortet.',
    transport_info = 'Från Sverige flyger du till Kittilä med byte i Helsingfors. Finnair flyger sträckan varje dag. Närmaste tågstation är Kolari, och bussen därifrån möter varje tåg.'
where slug = 'levi';

-- ── Ruka ──────────────────────────────────────────────────────────────
--
-- skiresort "Ruka": "291 m - 492 m (Difference 201 m)", "Total: 19.1 km",
-- 9,1/7/3 km (47/36/17 %), "Total: 22", 80 % konstsnö.
--   lift_capacity_per_hour 16 000 → 30 720: "Total capacity 30720
--     Passengers/hour". Ingen migration satte 16 000.
-- Säsong 10–5 stämmer.
--
-- Liftkortet 58 / 265 → 59 / 269 €. ruka.fi/en/skipasses, "Lift tickets",
-- "Adult", "Prices valid for tickets purchased at on-site sales points
-- from October 2, 2026, to May 2, 2027. We reserve the right to make
-- changes.", "1 day 59 €", "6 days 269 €" (läst av granskaren). 030 läste
-- 58 / 265 från samma sida 2026-11-16. Ett pris hela säsongen.
--
-- Restid 25 / 30 står kvar. OSRM till nuvarande koordinat 30,2 km / 44,7
-- min, men punkten ligger uppe på fjället, och OSRM kör de sista 1,3 km på
-- oskyltade vägar i backen på tolv minuter. Till byn (Rukan kylä): 28,5 km
-- / 32,0 min (ägarbeslut 2).
--
-- Nybörjare 6 → 7. skiresort beginners 5/5, "Almost the entire ski area
--   can be accessed via easy and very easy slopes" (läst av granskaren),
--   samma ordalydelse och blå andel (47 %) som Levi, som har 7.
-- Mellannivå 7 → 6. 19 km, minst på sajten; skiresort size 2/5; inthesnow
--   "a longest run of around 1.3km"; Snowthere "Skip If" för tonåringar
--   som behöver variation (forskaren). Ankaret 6. Riksgränsen (21 km) har
--   6.
-- Avancerad 7 → 5. skiresort experts-freeriders 2/5, "There are only a
--   few challenging runs in the Ruka ski area" (läst av granskaren);
--   inthesnow "Not for: advanced Alpine skiers wanting big vertical or
--   long runs"; Snowthere "Expert skiers will find the terrain too gentle"
--   (forskaren). Fallhöjden 201 m. Sälen och Idre Fjäll har 5.
-- Afterski 7 → 6. skiresort apres-ski 4/5 "Several venues are available
--   in Ruka Village"; inthesnow "Evenings tend to be relaxed rather than
--   rowdy" (läst av granskaren); Snowthere "look at Levi for a livelier
--   village" (forskaren). Levi har 7.
-- Bykänsla 7 → 6. en.wikipedia "In winter 1954, the first slope … was
--   opened"; byn växte kring backarna (forskaren). Regeln från omgång 6.
-- Offpist 6 står kvar. Att ingen källa nämner offpist skiljer inte Ruka
-- från Levi (6), och Snowtheres "Finland is the wrong country" gäller båda.
-- Gott om plats 8 är ankare.
--
-- Texter:
--   notes: "över 500 kilometer", "201 meter" och "939" är handskrivna tal
--     och stryks. 939 / 201 = 4,7. Nackdel två: kvällslivet, Levi
--     (skiresort Levi apres-ski "Almost every day there is live music").
--   transport_info: ruka.fi "In addition to year-round Finnair flights from
--     Helsinki to Kuusamo", "you can easily fly for a long weekend from
--     Riga to Kuusamo during winter"; ortens lista över direktflyg har
--     ingen svensk stad (forskaren).
update resorts
set lift_capacity_per_hour = 30720,
    lift_pass_day_eur = 59,
    lift_pass_week_eur = 269,
    lift_pass_currency = 'EUR',
    beginner_score = 7,
    intermediate_score = 6,
    expert_score = 5,
    apres_ski_score = 6,
    village_charm_score = 6,
    notes = 'Ruka passar dig som vill åka tidigt på säsongen eller kombinera utförsåkning med längd. Liftarna öppnar oftast i oktober, och runt fjället finns längdspår. Varje säsong börjar världscupen i nordisk kombination här. Vill du ha långa nedfarter är Ruka fel val. Åre har mer än fyra gånger så stor fallhöjd. Vill du ha kvällsliv efter skidorna är Ruka också fel val. Kvällarna i byn är lugna, och Levi har fler barer med livemusik.',
    transport_info = 'Från Sverige flyger du till Kuusamo med byte i Helsingfors. Finnair flyger sträckan året runt, och på vintern går också flyg från Riga.'
where slug = 'ruka';

-- ── Grandvalira ───────────────────────────────────────────────────────
--
-- skiresort "Grandvalira – Pas de la Casa/Grau Roig/Soldeu/El
-- Tarter/Canillo/Encamp": "(1300 m -) 1710 m - 2640 m (Difference 930
-- m)", "Total: 215 km", 100/82/33 km (47/38/15 %), "Total: 75".
--   lift_capacity_per_hour 100 000 → 115 684: "Total capacity 115684
--     Passengers/hour". Ingen migration satte 100 000.
--   snowmaking_coverage_pct 60 → 65: "1032 Snow cannons", "65 % of the
--     slopes have snow-making capabilities". Ingen migration satte 60.
-- Säsong 12–4 stämmer ("Current season: 2026-12-04 - 2027-04-04").
--   lift_pass_day_eur null → 72: assistant.grandvalira.com, Forfait
--     Adulto 18–64, 1 dag lördag 27.2.2027: "69,00 € | 72,00€ en taquillas
--     IGI incluido" (webbläsare, 2026-11-18). Kassapriset lagras, som 034
--     valde för sexdagarskortet. Sexdagarskortet 396 € står kvar och är
--     omläst för 27.2–4.3: "370,20 € | 396,00€ en taquillas". Kvot 5,50.
--     Nätpriset gäller ett begränsat antal kort ("Quedan 69 forfait a
--     este precio"). Dagskortet heter Andorra Pass och gäller också Pal
--     Arinsal och Ordino Arcalís, som flerdagarskortet (GV-pass FAQ "The
--     Grandvalira day ski pass, Andorra Pass, gives you access to
--     Grandvalira, Ordino Arcalís and Pal Arinsal resorts", forskaren).
--
-- Restid 200 / 180 → 197 / 167, porten Barcelona står kvar. OSRM 196,8
-- km, 166,9 min. (Toulouse: 169,8 km / 144,7 min, inget direktflyg från
-- Sverige.)
--
-- Nybörjare 6 → 7. skiresort beginners 5/5, "beginner areas can be found
--   in all 6 sectors" (läst av granskaren), "The sectors Encamp, Canillo,
--   El Tarter, and Soldeu are connected by easy slopes" (forskaren);
--   inthesnow "one of Europe's better beginner/intermediate playgrounds".
--   47 % blått. Mot: Pas de la Casa nås bara via röd pist.
-- Snowpark 7 → 8. skiresort snow-park 5/5, "a total of 3 snowparks and a
--   Freestyle Academy"; inthesnow "El Tarter's snowpark has one of the
--   longest lines of modules in Europe" (läst av granskaren). Två
--   oberoende källor, samma slags beskrivning som Penken Park (8).
-- Övriga betyg står kvar. Familj, afterski och bykänsla avser Soldeu och
-- El Tarter, där familjeboendet ligger.
--
-- Texter:
--   notes: "215 kilometer" är ett datatal och stryks. Första meningen:
--     inthesnow "Most of Grandvalira's terrain sits in the blue-red sweet
--     spot". 2003: Snowthere "formed when Pas de la Casa/Grau Roig merged
--     with Soldeu/El Tarter back in 2003" (forskaren). Nackdel: inthesnow
--     "less suited to committed experts seeking extensive steep or
--     technical off-piste terrain"; St. Anton avancerad 10 och offpist 10.
--   where_to_stay: höjderna 2 100, 1 300 och 1 500 m kom från es.wikipedia
--     och stryks. Barnomsorg: skiresort families "Kindergartens … in
--     Canillo, El Tarter, Soldeu, and Grau Roig"; Snowthere "base yourself
--     in Soldeu, El Tarter or Canillo"; en.wikipedia Pas de la Casa "The
--     nightlife is particularly youth-oriented" (forskaren).
--   accommodation_zone: Canillo läggs till, i ordningen från
--     where_to_stay. Booking söker på BOOKING_SOK.
--   transport_info: Toulouse har inget direktflyg från Sverige
--     (flightconnections NYO–TLS och TLS–VST, forskaren). Barcelona:
--     Norwegian, Ryanair, SAS och Vueling från Arlanda (forskaren).
update resorts
set lift_capacity_per_hour = 115684,
    snowmaking_coverage_pct = 65,
    airport_distance_km = 197,
    transfer_minutes = 167,
    lift_pass_day_eur = 72,
    beginner_score = 7,
    snowpark_score = 8,
    notes = 'Grandvalira passar dig som vill åka långt på blå och röd pist. Området sträcker sig från Pas de la Casa vid franska gränsen till Encamp och byggdes ihop 2003 av två äldre skidorter, Pas de la Casa-Grau Roig och Soldeu-El Tarter. Från Encamp och Canillo tar du gondol upp till pisten. Vill du åka brant eller utanför pist är Grandvalira fel val. St. Anton har både och från liftarna.',
    where_to_stay = 'Med barn bor du i Soldeu, El Tarter eller Canillo, där barnomsorgen finns och lätta nedfarter binder ihop byarna. Pas de la Casa och Grau Roig ligger högst i området, och i Pas de la Casa riktar sig kvällslivet till en yngre publik. Bor du i Encamp eller Canillo längre ner i dalen tar du gondolen upp på morgonen.',
    accommodation_zone = 'Soldeu, El Tarter, Canillo, Pas de la Casa',
    transport_info = 'Flyg till Barcelona, som har direktflyg från Arlanda. Andbus kör från flygplatsen till busstationen i Andorra la Vella. Toulouse ligger närmare Andorra men har inga direktflyg från Sverige.'
where slug = 'grandvalira';

-- ── Prishistorik ──────────────────────────────────────────────────────
--
-- Riksgränsen: ny rad för 26/27. 25/26-raden från 022 (520 / 2 547) står
-- kvar, så att nästa års jämförelse avser samma produkt.
insert into public.lift_pass_prices
  (resort_slug, season, currency, day_price, week_price, product,
   day_source, week_source, source_url, captured_on, note)
values
('riksgransen', '2026/2027', 'SEK', 546.00, 2673.00, 'Björkliden + Riksgränsen',
 'ortens egen sida', 'ortens egen sida',
 'https://riksgransen.se/utbud-upplevelser/skidakning-spar/liftkort-arctic-skipass/', '2026-11-18',
 '5 dagar 2 304 + extradag 369; orten har ingen egen sexdagarsrad. Valfria sex dagar kostar 2 674. Ett pris hela säsongen. Kortet gäller Björkliden och Riksgränsen, medan våra 21 km avser Riksgränsen ensamt. Säsongen 2027 enligt ortens butik.')
on conflict (resort_slug, season, product) do nothing;

-- Ruka: raden från 030 (58 / 265, hämtad 2026-11-16) uppdateras. Det är
-- samma säsong och produkt; sidan visar i dag 59 / 269 och förbehåller sig
-- ändringar. Ingen ny rad, eftersom säsongen är densamma.
update public.lift_pass_prices
set day_price = 59.00,
    week_price = 269.00,
    captured_on = '2026-11-18',
    note = 'Kassapris, samma hela säsongen. Fem procent billigare på nätet från 1 december. 2026-11-16 visade sidan 58 / 265.'
where resort_slug = 'ruka'
  and season = '2026/2027'
  and product = 'Ruka';

-- Hemsedal, Voss och Grandvalira: raderna för 26/27 från 022 och 034
-- uppdateras. Samma säsong och produkt, så ingen ny rad.
update public.lift_pass_prices
set day_price = 775.00,
    captured_on = '2026-11-18',
    note = 'Hämtat på SkiStars norska sida, start lördag 27.2.2027. Måndag 1.3 kostar dagskortet 745 (läst 2026-08-12 och 2026-11-18); sexdagarskortet är lika båda dagarna. Samma kort kostar 3 702 SEK på den svenska sidan.'
where resort_slug = 'hemsedal'
  and season = '2026/2027'
  and product = 'SkiStar Hemsedal';

update public.lift_pass_prices
set week_price = 2750.00,
    captured_on = '2026-11-18',
    note = 'Sammanhängande dagar, kvällsåkning och gondol ingår. Nätpris i bokningskalendern, 2 750 för varje startdag 8.2–7.3.2027 och dagskortet 675 varje dag samma period. 2026-08-25 visade kalendern 2 990 och 675 vardag / 720 helg.'
where resort_slug = 'voss'
  and season = '2026/2027'
  and product = '6-8 dagerskort';

update public.lift_pass_prices
set day_price = 72.00,
    day_source = 'ortens egen sida',
    captured_on = '2026-11-18',
    note = 'Pris i kassan, start 27.2.2027; på nätet 69,00 / 370,20 € för ett begränsat antal kort. Sexdagarskortet kostar lika från 27.2 och 28.2. Dynamiskt pris. Både dags- och flerdagarskortet gäller även Pal Arinsal och Ordino Arcalís.'
where resort_slug = 'grandvalira'
  and season = '2026/2027'
  and product = 'Grandvalira';

-- ── Kontroll före commit ──────────────────────────────────────────────
--
-- Priset i resorts ska stämma med raden för 26/27 i lift_pass_prices för
-- de fem orter vars pris ändras här. Skiljer något avbryts transaktionen och ingenting
-- ändras.
do $$
declare
  fel text;
begin
  select string_agg(r.slug, ', ') into fel
  from resorts r
  left join public.lift_pass_prices p
    on p.resort_slug = r.slug and p.season = '2026/2027'
  where r.slug in ('riksgransen', 'ruka', 'hemsedal', 'voss', 'grandvalira')
    and (p.resort_slug is null
         or p.day_price <> r.lift_pass_day_eur
         or p.week_price <> r.lift_pass_week_eur
         or p.currency <> r.lift_pass_currency);

  if fel is not null then
    raise exception 'Priset i resorts och lift_pass_prices 2026/2027 skiljer för: %', fel;
  end if;
end $$;

commit;


-- ── Efterkontroll ─────────────────────────────────────────────────────
--
-- 1. Betygen, en rad per ort:
--
--   select slug, snow_guarantee_score as sno, beginner_score as nyb,
--          intermediate_score as mell, expert_score as avan,
--          off_piste_score as off, snowpark_score as park,
--          crowd_score as plats, family_friendly_score as fam,
--          apres_ski_score as after, village_charm_score as by
--   from resorts
--   where slug in ('are', 'salen', 'trysil', 'hemavan', 'riksgransen',
--                  'hemsedal', 'geilo', 'voss', 'levi', 'ruka',
--                  'grandvalira')
--   order by slug;
--
--   Förväntat:
--   are          7  7 7 8 8 7 6 | 7  8 8
--   geilo        7  7 6 6 5 7 7 | 8  6 8
--   grandvalira  7  7 8 7 6 8 6 | 7  7 6
--   hemavan      8  8 7 7 8 7 8 | 7  5 6
--   hemsedal     8  9 7 8 8 7 7 | 8  7 7
--   levi         8  7 7 6 6 7 7 | 8  7 8
--   riksgransen  8  6 6 6 9 3 8 | 5  6 7
--   ruka         8  7 6 5 6 7 8 | 7  6 6
--   salen        6 10 7 5 5 7 7 | 10 6 6
--   trysil       7  8 7 6 6 7 6 | 8  6 7
--   voss         7  7 7 7 7 6 7 | 6  6 8
--
-- 2. Tal, säsong och restider:
--
--   select slug, total_lifts, lift_capacity_per_hour,
--          snowmaking_coverage_pct, season_start_month, season_end_month,
--          nearest_airport, airport_distance_km, transfer_minutes
--   from resorts
--   where slug in ('are', 'salen', 'trysil', 'hemavan', 'riksgransen',
--                  'hemsedal', 'geilo', 'voss', 'levi', 'ruka',
--                  'grandvalira')
--   order by slug;
--
--   Förväntat: are 37, 49 073, 60, Östersund 87/84. geilo 25 482, 80, Oslo
--   228/228. grandvalira 115 684, 65, Barcelona 197/167. hemavan 30, 11–5,
--   4/6. hemsedal 27 790, 60, Oslo 209/211. levi 28, 40 441, 70, 15/20.
--   riksgransen 6 090, 0, 2–5, Kiruna 139/120. ruka 30 720, 25/30. salen
--   31/33. trysil 54 444, 77, Oslo 174/145. voss 13 444, 50, Bergen
--   101/109.
--
-- 3. Prisraderna:
--
--   select resort_slug, season, day_price, week_price, product
--   from lift_pass_prices
--   where resort_slug in ('riksgransen', 'ruka', 'hemsedal', 'voss',
--                         'grandvalira')
--   order by resort_slug, season;
--
--   Förväntat: grandvalira 2026/2027 72 / 396, hemsedal 2026/2027 775 /
--   3 769, riksgransen 2025/2026 520 / 2 547 och 2026/2027 546 / 2 673,
--   ruka 2026/2027 59 / 269, voss 2026/2027 675 / 2 750.
