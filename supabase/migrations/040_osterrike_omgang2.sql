-- 040 · Omgång 2: fem österrikiska orter läggs in dolda, och St. Anton
-- rättas.
--
-- Underlaget är faktafilerna i projektmappen orter/ (lech-zuers.md,
-- saalbach.md, zell-am-see-kaprun.md, obergurgl.md, bad-gastein.md) och
-- granskningen granskning-omgang2.md, alla 2026-11-18. Där granskningen
-- och forskarnas filer skiljer sig gäller granskningen. Varje tal i
-- kärnfälten är kontrollerat mot skiresort.com två gånger, av forskaren
-- och av granskaren.
--
-- De fem orterna läggs in med published = false. De visas inte förrän de
-- har en bild med licens i resort_images och en provad söksträng i
-- BOOKING_SOK (lib/booking.js), enligt CLAUDE.md. Ingen av dem har det i
-- dag.
--
-- Gemensamt för alla fem:
--   · Restid och avstånd är OSRM, samma metod som lib/restider.js, körd av
--     forskaren och om av granskaren. Avståndet är avrundat till hel km.
--   · Familjebetyget avser BYN (granskningens beslut A, se
--     docs/poangskala.md). Nybörjarbetyget avser fortsatt området.
--   · Liftkortet är det kort man faktiskt köper för en vecka (beslut av
--     Fabian 2026-11-18, docs/liftkortspriser.md). lift_pass_day_eur och
--     lift_pass_week_eur är heltalskolumner (se 022), så 69,50, 81,50 och
--     432,50 står avrundade i resorts. De exakta talen och produkten står
--     i lift_pass_prices längst ner.
--   · Port: Salzburg för Saalbach, Zell am See-Kaprun och Bad Gastein.
--     Norwegian flyger Arlanda–Salzburg onsdag och lördag 26.12.26–27.3.27,
--     SAS lördagar 20.2–13.3.27 och Köpenhamn–Salzburg upp till fyra
--     gånger i veckan (park-sleep-fly.de, news.at, aerotelegraph). Innsbruck
--     för Lech-Zürs och Obergurgl, samma port som St. Anton och Sölden.
--   · Region: Arlberg och Ötztal som St. Anton och Sölden står på sajten
--     (kontrollerat på alpkoll.se 2026-11-18). De tre i förbundslandet
--     Salzburg står som "Salzburgerland", stavat lika för alla tre.
--
-- Texterna följer docs/copy.md: du-form, inga handskrivna tal, och varje
-- nackdel säger vem den gäller, ett faktum och en annan ort som finns på
-- sajten. Källan till varje namn står i kommentaren vid orten.
--
-- Kör i Supabase SQL Editor. Allt körs i en transaktion.

begin;

-- ── Pist-km i hela kilometer ─────────────────────────────────────────
--
-- Källan anger 139,5 km för Zell am See-Kaprun och 82,7 km för Bad Gastein.
-- Alla andra orter lagras i hela kilometer och sajten skriver talet rakt
-- av, så de avrundas här till 140 och 83. Delarna i lib/delomraden.js är
-- avrundade på samma sätt (77 + 63 = 140).

-- ── St. Anton ─────────────────────────────────────────────────────────
--
-- skiresort.com anger 301 km på alla fyra sidor granskaren läste
-- (huvudsida, slope-offering, beginners, experts-freeriders) och
-- "145948 Passengers/hour". Konstsnön har ingen procentsats hos källan,
-- bara "1107 Snow cannons"; 70 % på sajten har ingen migration bakom sig.
-- Lech-Zürs nedan får exakt samma tal (granskningen, beslut F).
update resorts
set total_pistes_km = 301,
    lift_capacity_per_hour = 145948,
    snowmaking_coverage_pct = null
where slug = 'st-anton';

-- St. Antons text från 029 skriver "300 kilometer pist" för hand och
-- skulle annars säga emot rutan intill. Talet stryks i stället för att
-- bytas, enligt copy.md. Satsen gör ingenting om texten redan är ändrad.
update resorts
set notes = replace(
  notes,
  'Warth-Schröcken till 300 kilometer pist.',
  'Warth-Schröcken till ett skidområde.'
)
where slug = 'st-anton'
  and notes like '%till 300 kilometer pist.%';

-- ── Lech-Zürs ─────────────────────────────────────────────────────────
--
-- skiresort.com har ingen egen post för Lech eller Zürs. Orten ingår i
-- "St. Anton/St. Christoph/Stuben/Lech/Zürs/Warth/Schröcken – Ski
-- Arlberg", så pist, höjder, fördelning, liftar och kapacitet är St.
-- Antons tal efter rättelsen ovan, och områdesbetygen är St. Antons.
-- Familj 8 (byn): Oberlech "traffic-free zone since 1997" (Wikipedia),
-- Kinderclub Lech och Bockiland i Zürs (skiresort), Snowthere 8,3.
-- Afterski 6 (byn): "Lech, Zürs, Warth, and Schröcken are not party
-- hotspots" (skiresort), "Lech is mellow after dark" (Snowthere).
--
-- Liftkort: Ski Arlberg, peak season 19.12.26–2.4.27, skiarlberg.at.
-- Samma kort och pris som St. Anton (030). "Provisional Status as of
-- August 2026."
-- Restid: Innsbruck flygplats → Lech, OSRM 111,9 km / 90 min.
-- Säsong: skiresort "2026-12-02 - 2027-04-18".
--
-- Texternas källor:
--   Flexenbahn mellan Zürs och Stuben, Rüfikopfbahn och kön där
--     ("A bottleneck can occur at the Rüfikopfbahnen in Lech"): skiresort
--     lifts. Weißer Ring: skiresort slope-offering, Wikipedia.
--   Dyrt: Ski Club GB Lech "Expensive, especially by Austrian standards".
--     St. Anton "for most budgets": Ski Club GB St Anton. OBS: granskningen
--     har inte kontrollerat det citatet (SVAGT).
--   Afterski och fest i St. Anton: skiresort apres-ski "for a real
--     après-ski party … you'll need to head to St. Anton".
--   Oberlech bilfritt: Wikipedia. Zürs högre och lugnare: skiresort
--     apres-ski "the higher-altitude village of Zürs".
--   Ingen järnväg, Flexenpasset: Powderhounds, Wikipedia. Arlbergbanan i
--     St. Anton: migration 029.

insert into resorts (
  slug, name, country, region, ski_area, latitude, longitude,
  season_start_month, season_end_month,
  altitude_base, altitude_top, total_pistes_km,
  blue_percent, red_percent, black_percent,
  total_lifts, lift_capacity_per_hour, snowmaking_coverage_pct,
  lift_pass_day_eur, lift_pass_week_eur, lift_pass_currency,
  nearest_airport, airport_distance_km, transfer_minutes,
  snow_guarantee_score, beginner_score, intermediate_score, expert_score,
  off_piste_score, snowpark_score, family_friendly_score,
  apres_ski_score, village_charm_score, crowd_score,
  notes, where_to_stay, accommodation_zone, transport_info,
  published
) values (
  'lech-zuers', 'Lech-Zürs', 'Austria', 'Arlberg', 'Ski Arlberg', 47.2084, 10.1417,
  12, 4,
  1304, 2811, 301,
  43, 40, 17,
  85, 145948, null,
  85, 468, 'EUR',
  'Innsbruck', 112, 90,
  8, 5, 8, 10,
  10, 6, 8,
  6, 9, 6,
  'Lech-Zürs passar dig som vill bo i en gammal by och åka i Ski Arlberg, samma skidområde och liftkort som St. Anton. Lech, Oberlech och Zürs ligger på Vorarlbergsidan, och Flexenbahn går mellan Zürs och Stuben. Runt Lech och Zürs går Weißer Ring, en rundtur med lift och pist som också är namnet på ett skidlopp. Vill du bo billigt är Lech fel val. Ski Club of Great Britain kallar orten dyr även med österrikiska mått, och St. Anton på samma liftkort har boende i fler prisklasser. Vill du festa efter liftstängning är Lech också fel val. Afterskin hålls på hotellbarerna och är lugn, och festen finns i St. Anton.',
  'Bo i Oberlech ovanför Lech om du vill ha hotellet vid pisten. Där är det bilfritt. Har du barn i skidskola passar Lech, med övningsbackarna i dalen och Kinderclub Lech. Rüfikopfbahn går upp från Lech, och där kan det bli kö när det är mycket folk. Zürs ligger högre och har lugnare kvällar.',
  'Lech, Oberlech, Zürs',
  'Flyg till Innsbruck eller Zürich. Lech har ingen järnvägsstation, och vägen dit går över Flexenpasset från Stuben. Vill du åka tåg hela vägen är St. Anton bättre, med station på Arlbergbanan.',
  false
)
on conflict (slug) do nothing;

-- ── Saalbach ──────────────────────────────────────────────────────────
--
-- skiresort.com: "Saalbach Hinterglemm Leogang Fieberbrunn (Skicircus)",
-- ett område sammankopplat med lift (TirolS sedan 2015/16). 270 km,
-- 140/112/18 km → 52/41/7, 69 liftar, "145079 Passengers/hour", "90 % of
-- the slopes have snow-making capabilities". Ski ALPIN CARD är ett
-- biljettsamarbete, inte lift, och hör hemma i texten.
-- Familj 8 (byn): Snowthere "Family Score 7" och "steer clear of the
-- Saalbach base area between 3pm and 6pm", Ski Club GB "Two towns are
-- spread out". Ankaret i poangskala.md flyttas från 9 till 8.
--
-- Liftkort: Ski ALPIN CARD, huvudsäsong 19.12.26–12.3.27, saalbach.com
-- ("1 day € 82,00", "6 days € 440,00"). Inget kort för bara Skicircus
-- finns. LIFTKORT 408 km i lib/liftkortspriser.js.
-- Restid: Salzburg flygplats → Saalbach, OSRM 87,6 km / 88 min.
-- Säsong: saalbach.com "27.11.2026 - 04.04.2027".
--
-- Texternas källor:
--   TirolS: skiresort lifts. Blått och rött: skiresort slope-offering,
--     Ski Club GB, Iglu Ski. Afterski: Snowthere, Iglu Ski.
--   Brant: Powderhounds "only real terrain deficiency - advanced piste
--     terrain", skiresort "Difficult 18 km". St. Anton avancerad 10.
--   Vår: Ski Club GB "Lower slopes can suffer in warm spells and in the
--     spring", Iglu Ski "its altitude peaks at a modest 2,100m". Sölden
--     glaciär: migration 029.
--   Gågatan: Powderhounds "pedestrian zone". Hinterglemm nybörjare: Ski
--     Club GB "Hinterglemm is home to the area's best beginner zone".
--     Kvällsåkning: skiresort "A9 Unterschwarzachbahn". Leogang:
--     Snowthere, skiresort families (Leo's Kinderland). Utdragna byar:
--     Ski Club GB.
--   Nattåg: snalltaget.se/anslutande-transfer-osterrike, "Transfern
--     stannar vid Schattberg X-press".

insert into resorts (
  slug, name, country, region, ski_area, latitude, longitude,
  season_start_month, season_end_month,
  altitude_base, altitude_top, total_pistes_km,
  blue_percent, red_percent, black_percent,
  total_lifts, lift_capacity_per_hour, snowmaking_coverage_pct,
  lift_pass_day_eur, lift_pass_week_eur, lift_pass_currency,
  nearest_airport, airport_distance_km, transfer_minutes,
  snow_guarantee_score, beginner_score, intermediate_score, expert_score,
  off_piste_score, snowpark_score, family_friendly_score,
  apres_ski_score, village_charm_score, crowd_score,
  notes, where_to_stay, accommodation_zone, transport_info,
  published
) values (
  'saalbach', 'Saalbach', 'Austria', 'Salzburgerland', 'Skicircus Saalbach Hinterglemm Leogang Fieberbrunn', 47.3915, 12.6364,
  11, 4,
  830, 2096, 270,
  52, 41, 7,
  69, 145079, 90,
  82, 440, 'EUR',
  'Salzburg', 88, 88,
  7, 9, 9, 5,
  8, 8, 8,
  9, 7, 5,
  'Saalbach är en av byarna i Skicircus, där liften TirolS knyter ihop Glemmtal och Leogang med Fieberbrunn i Tyrolen. Området passar dig som åker blått och rött och vill åka nya backar hela veckan. Afterskin börjar i barerna vid pisten på eftermiddagen och fortsätter i byn till sent. Vill du åka brant pist är Saalbach fel val. Svart pist är en liten del av området, och St. Anton har fler branta nedfarter. Åker du på våren kan de nedre backarna bli slaskiga, eftersom toppen är låg för att vara i Alperna. Sölden har glaciär att åka på.',
  'Bo i Saalbach om du vill ha afterskin och gågatan nära. Hinterglemm har områdets bästa nybörjarbackar nere i dalen och kvällsåkning vid Unterschwarzachbahn. Leogang är lugnare på kvällarna och har barnområdet Leo''s Kinderland vid dalstationen för Asitzbahn. Byarna är utdragna, så kontrollera avståndet till närmaste lift innan du bokar.',
  'Saalbach, Hinterglemm, Leogang',
  'Flyg till Salzburg och fortsätt med bil eller transferbuss in i Glemmtal. Snälltågets nattåg från Malmö stannar i Zell am See, och därifrån går transferbussen till Schattberg X-press i Saalbach. Liftkortet gäller även Schmittenhöhe i Zell am See och Kitzsteinhorn i Kaprun, som inte hänger ihop med Skicircus med lift.',
  false
)
on conflict (slug) do nothing;

-- ── Zell am See-Kaprun ────────────────────────────────────────────────
--
-- Två poster hos skiresort.com som delar liftkort men inte liftar:
-- Schmittenhöhe – Zell am See 77 km, 27 liftar, 760–2 000 m, 54 778
-- pers/h; Kitzsteinhorn/Maiskogel – Kaprun 62,5 km, 24 liftar,
-- 768–3 029 m, 44 045 pers/h. Talen är summan, som Vemdalen (039), och
-- delarna står i lib/delomraden.js. Kitzsteinhorn har ingen dalnedfart
-- ("There is no valley run at the Kitzsteinhorn"), så Kaprun-delen är
-- flaggad där och fallhöjden blir Schmittenhöhes 1 240 m, inte 2 261.
-- Fördelning: 60,5/50/29 km av 139,5 → 43/36/21. Konstsnö: Schmitten
-- 100 %, Kaprun ingen procentsats, alltså okänt för orten. ski_area
-- lämnas tomt; Ski ALPIN CARD är ett prisavtal.
-- Lechnerberg (1,5 km) är en egen post utanför liftkortet och ingår inte.
-- Därför är nybörjarbetyget 6, inte forskarens 7 (granskningen).
-- Säsong 10–5: glaciärens säsong är ortens (granskningen, beslut I).
--
-- Liftkort: Ski ALPIN CARD, samma kort och pris som Saalbach,
-- zellamsee-kaprun.com ("Purchased from 8 am € 82", "6 days € 440").
-- Restid: Salzburg flygplats → Zell am See, OSRM 77,7 km / 77 min.
--
-- Texternas källor:
--   Glaciär oktober–maj: skiresort Kaprun "2026-10-10 - 2027-05-17".
--   Maiskogel ihop med Kitzsteinhorn: skiresort (3K K-onnection).
--   Familjer: Ski Club GB "one of the top family-friendly destinations".
--   Brant: Ski Club GB "Few challenges for advanced/expert skiers".
--   Inte med lift: skiresort Schmitten slope-offering, Powderhounds.
--     Ischgl–Samnaun: migration 007.
--   Schüttdorf, areitXpress, barnområde: skiresort lifts och
--     families-children. Snön längre ner i början och slutet av
--     säsongen: Powderhounds "Low elevation base areas vulnerable to
--     vagaries of climate warming at the margins of the season".
--   Skidbussen gratis: Powderhounds "Regular buses, free for anyone with a
--     ski pass". Järnvägen: Powderhounds. Nattåget: lib/nattaget.js.

insert into resorts (
  slug, name, country, region, ski_area, latitude, longitude,
  season_start_month, season_end_month,
  altitude_base, altitude_top, total_pistes_km,
  blue_percent, red_percent, black_percent,
  total_lifts, lift_capacity_per_hour, snowmaking_coverage_pct,
  lift_pass_day_eur, lift_pass_week_eur, lift_pass_currency,
  nearest_airport, airport_distance_km, transfer_minutes,
  snow_guarantee_score, beginner_score, intermediate_score, expert_score,
  off_piste_score, snowpark_score, family_friendly_score,
  apres_ski_score, village_charm_score, crowd_score,
  notes, where_to_stay, accommodation_zone, transport_info,
  published
) values (
  'zell-am-see-kaprun', 'Zell am See-Kaprun', 'Austria', 'Salzburgerland', null, 47.3240, 12.7963,
  10, 5,
  760, 3029, 140,
  43, 36, 21,
  51, 98823, null,
  82, 440, 'EUR',
  'Salzburg', 78, 77,
  8, 6, 7, 6,
  7, 8, 8,
  7, 8, 5,
  'Zell am See-Kaprun är två skidberg med en buss emellan. Det ena är Schmittenhöhe ovanför staden Zell am See och sjön. Det andra är Kitzsteinhorn, en glaciär ovanför Kaprun som är öppen från oktober till maj och hopkopplad med Maiskogel. Orten passar familjer och dig som åker blått och rött och vill bo i en riktig stad. Vill du åka brant är Zell am See-Kaprun fel val. Det svåra är några enstaka nedfarter, och St. Anton har mycket mer brant åkning. Vill du åka hela veckan i ett och samma område är orten också fel val. Schmittenhöhe och Kitzsteinhorn når inte varandra med lift, medan Ischgl hänger ihop med Samnaun.',
  'Bo i Zell am See om du vill ha staden och sjön nära, och nå Schmittenhöhe med gondol från centrum. Schüttdorf i södra delen av staden har egen gondol, areitXpress, och barnområde vid dalstationen. Bo i Kaprun om glaciären är skälet att åka, till exempel i början eller slutet av säsongen när snön längre ner är osäker. Från Kaprun går Maiskogelbahn, och därifrån når du Kitzsteinhorn med lift. Skidbussen mellan Zell och Kaprun är gratis med liftkortet.',
  'Zell am See, Schüttdorf, Kaprun',
  'Flyg till Salzburg. Zell am See ligger på järnvägen mellan Salzburg och Innsbruck, och Snälltågets nattåg stannar här. Till Kaprun går buss från Zell am See.',
  false
)
on conflict (slug) do nothing;

-- ── Obergurgl ─────────────────────────────────────────────────────────
--
-- skiresort.com: "Gurgl – Obergurgl-Hochgurgl", eget område utan
-- liftförbindelse med Sölden. 1 793–3 030 m, 112 km, 60,2/33,2/18,8 km →
-- 53/29/18, 25 liftar, "45661 Passengers/hour", 90 % konstsnö.
-- Nybörjare 8 mot Söldens 6 vid samma blå andel: övningsliftarna
-- Krumpwasser, Wiesen och Mahdstuhl vid byn och "Almost the entire ski
-- area can be explored on easy slopes" (skiresort). Söldens 6 prövas i en
-- egen omgång (granskningen, beslut H).
--
-- Liftkort: dag "from € 69,50" i högsäsongen som omfattar v9
-- (27.02–18.04.2027), sex dagar "Ötztal € 469,00", gurgl.com. Sexdagars-
-- kortet är Ötztal Superskipass, "valid in all Ötztal ski areas for 3
-- days or more", samma kort och pris som Söldens. Dagspriset lagras 70.
-- Restid: Innsbruck flygplats → Obergurgl, OSRM 97,7 km / 87,5 min.
-- Säsong: skiresort "2026-11-19 - 2027-04-18".
--
-- Texternas källor:
--   Snö: skiresort snow-reliability "Almost the entire Obergurgl-Hochgurgl
--     ski area can be covered with artificial snow".
--   Top-Express: Ski Club GB. Hochgurgl längs Timmelsjochvägen: Ski Club
--     GB "lies 200m higher up the Timmelsjoch road".
--   Kortet i Sölden från tre dagar: gurgl.com (kontrollerat av granskaren).
--   Brant: skiresort "No. 27 Wurmkogl … Length 1 km", Ski Club GB "Not a
--     great area for experts unless there is fresh snow". St. Anton
--     avancerad 10.
--   Kvällen: Ski Club GB "Little going on later at night". Ischgl efter
--     midnatt: migration 007.
--   Övningsliftar och barnområden vid byn: skiresort beginners och
--     families-children. Rullband i Hochgurgl: "In Hochgurgl, there is a
--     conveyor belt right next to the hotels". Boendet tar slut:
--     Powderhounds "Accommodation in the resort villages books out
--     quickly".
--   Ötztal Bahnhof: inthesnow. Snälltågets buss: lib/nattaget.js.
--   Den strukna nackdelen om väder ovan trädgränsen hade ingen ort på
--   sajten att hänvisa till (granskningen, punkt 5).

insert into resorts (
  slug, name, country, region, ski_area, latitude, longitude,
  season_start_month, season_end_month,
  altitude_base, altitude_top, total_pistes_km,
  blue_percent, red_percent, black_percent,
  total_lifts, lift_capacity_per_hour, snowmaking_coverage_pct,
  lift_pass_day_eur, lift_pass_week_eur, lift_pass_currency,
  nearest_airport, airport_distance_km, transfer_minutes,
  snow_guarantee_score, beginner_score, intermediate_score, expert_score,
  off_piste_score, snowpark_score, family_friendly_score,
  apres_ski_score, village_charm_score, crowd_score,
  notes, where_to_stay, accommodation_zone, transport_info,
  published
) values (
  'obergurgl', 'Obergurgl', 'Austria', 'Ötztal', 'Obergurgl-Hochgurgl', 46.8712, 11.0282,
  11, 4,
  1793, 3030, 112,
  53, 29, 18,
  25, 45661, 90,
  70, 469, 'EUR',
  'Innsbruck', 98, 88,
  9, 8, 7, 5,
  6, 5, 8,
  6, 7, 7,
  'Obergurgl passar dig som vill vara säker på snön och åker blått och rött i lugn takt. Liftarna börjar högt, och nästan hela området kan snöas. Hochgurgl, högre upp längs Timmelsjochvägen, nås med gondolen Top-Express. Sölden ligger längre ner i samma dal utan liftförbindelse, men köper du kort för tre dagar eller fler gäller det där också. Vill du åka brant är Obergurgl fel val. Den svåraste nedfarten är kort, och utan nysnö räcker området inte långt för vana åkare. St. Anton har mycket mer brant åkning. Vill du festa sent är Obergurgl också fel val. Det händer lite på kvällen, medan afterskin i Ischgl håller på långt efter midnatt.',
  'Bo i Obergurgl om någon i sällskapet ska gå i skidskola, eftersom övningsliftarna och barnområdena ligger vid byn. Hochgurgl är mindre och ligger högre, med hotellen nära pisten och ett rullband för barnen intill hotellen. Boendet i båda byarna tar slut tidigt, så boka i god tid.',
  'Obergurgl, Hochgurgl',
  'Flyg till Innsbruck. Vägen går upp genom Ötztal förbi Sölden, och åker du kollektivt byter du till buss vid Ötztal Bahnhof. Snälltågets transferbuss går också hit.',
  false
)
on conflict (slug) do nothing;

-- ── Bad Gastein ───────────────────────────────────────────────────────
--
-- skiresort.com: "Bad Gastein/Bad Hofgastein – Schlossalm/Angertal/
-- Stubnerkogel". 860–2 300 m, 82,7 km, 30,8/49,3/2,6 km → 37/60/3, 17
-- liftar, "34336 Passengers/hour", 81 % konstsnö. Sportgastein och
-- Dorfgastein-Großarl nås med buss och ingår inte. Graukogel: "The ski
-- resort has shut down".
-- Familj 6 (byn), forskarens 7 sänkt av granskningen: "området talar för
-- 8, byn för 6"; byn ligger i en brant ravin och Angertal "lacks its own
-- accommodation" (weathertoski).
--
-- Liftkort: kassapris huvudsäsong 19.12.26–26.3.27, skigastein.com.
-- Dag 81,50, gäller Schlossalm-Angertal-Stubnerkogel, Dorfgastein-Großarl
-- och Sportgastein. Sex dagar 432,50, Ski amadé, 760 km. På nätet
-- dynamiskt och lägre. Lagras 82 / 433.
-- Restid: Salzburg flygplats → Bad Gastein, OSRM 96,9 km / 80 min.
-- Säsong: skiresort "late November - mid April".
--
-- Texternas källor:
--   Långa röda: skiresort "\"The North\" … Length 10 km", weathertoski
--     "most of the runs here are of red gradient".
--   Stubnerkogelbahn från byn: skiresort size. Skidbuss: skiresort
--     slope-offering. Dagskortet i Sportgastein och Dorfgastein:
--     skigastein.com.
--   Belle époque, ravinen: Snow Magazine, weathertoski, City AM.
--     Gasteinfallet genom centrum: gastein.com.
--   Brant: skiresort "Difficult 2.6 km", Ski Club GB "advanced and expert
--     skiers, who may find their options limited". St. Anton avancerad 10.
--   Nybörjare: skiresort "XXL Gasti Schneepark", Ski Club GB "Lacks
--     genuinely easy long runs for painless progression". Sälen
--     nybörjare 10.
--   Övre Bad Gastein och stationen: Snow Magazine, weathertoski.
--     Afterskibarerna vid Schlossalmbahn: skiresort apres-ski.
--   Tauernbahn och direkttåg: weathertoski, Wikipedia. Nattåget och Hotel
--     Krone: snalltaget.se/anslutande-transfer-osterrike.
--   Forskarens tredje nackdel (flera områden och ingen alpby) är struken:
--   "fem områden" räknades medan Graukogel fanns, och "ingen alpby" säger
--   emot bykänsla 9.

insert into resorts (
  slug, name, country, region, ski_area, latitude, longitude,
  season_start_month, season_end_month,
  altitude_base, altitude_top, total_pistes_km,
  blue_percent, red_percent, black_percent,
  total_lifts, lift_capacity_per_hour, snowmaking_coverage_pct,
  lift_pass_day_eur, lift_pass_week_eur, lift_pass_currency,
  nearest_airport, airport_distance_km, transfer_minutes,
  snow_guarantee_score, beginner_score, intermediate_score, expert_score,
  off_piste_score, snowpark_score, family_friendly_score,
  apres_ski_score, village_charm_score, crowd_score,
  notes, where_to_stay, accommodation_zone, transport_info,
  published
) values (
  'bad-gastein', 'Bad Gastein', 'Austria', 'Salzburgerland', 'Schlossalm–Angertal–Stubnerkogel', 47.1145, 13.1352,
  11, 4,
  860, 2300, 83,
  37, 60, 3,
  17, 34336, 81,
  82, 433, 'EUR',
  'Salzburg', 97, 80,
  7, 6, 7, 5,
  7, 6, 6,
  6, 9, 6,
  'Bad Gastein passar dig som vill åka långa röda nedfarter och bo i en kurort från förra sekelskiftet. Från byn går Stubnerkogelbahn upp i området Schlossalm–Angertal–Stubnerkogel, som hänger ihop med Bad Hofgastein. Sportgastein och Dorfgastein ligger på samma kort och nås med skidbuss. Hotellen i belle époque-stil står längs ravinen där Gasteinfallet faller genom centrum. Vill du åka brant pist är Bad Gastein fel val. Svart pist finns nästan inte, och St. Anton har mycket mer brant åkning. Vill du lära dig åka och snabbt komma vidare är Bad Gastein också fel val. Övningsområdet i Angertal är stort, men långa lätta nedfarter saknas. I Sälen bor du vid övningsbacken.',
  'Bo nära Stubnerkogelbahn i övre Bad Gastein om du vill gå till liften. Där ligger också järnvägsstationen. Den gamla stadskärnan med hotellen och vattenfallet ligger nedanför i branten. Bad Hofgastein har Schlossalmbahn och de flesta afterskibarerna. Angertal, där övningsområdet ligger, har inget eget boende.',
  'Bad Gastein, Bad Hofgastein',
  'Flyg till Salzburg. Bad Gastein har egen station på Tauernbahn med direkttåg från Salzburg Hauptbahnhof. Snälltågets nattåg stannar i St. Johann im Pongau, och transferbussen därifrån stannar utanför Hotel Krone i Bad Gastein.',
  false
)
on conflict (slug) do nothing;

-- ── Prishistorik ──────────────────────────────────────────────────────
--
-- Samma tabell och form som 030 och 033. Två produkter där dags- och
-- veckokortet är olika kort, som Mayrhofen.

insert into public.lift_pass_prices
  (resort_slug, season, currency, day_price, week_price, product,
   day_source, week_source, source_url, captured_on, note)
values
('lech-zuers', '2026/2027', 'EUR', 85.00, 468.00, 'Ski Arlberg',
 'ortens egen sida', 'ortens egen sida',
 'https://www.skiarlberg.at/en/Ski-Arlberg/Ski-tickets/Skipass-prices', '2026-11-18',
 'Peak season 19.12.26–2.4.27. Lågsäsong 80,50 / 395. Orten kallar priserna preliminära, läget augusti 2026.'),
('saalbach', '2026/2027', 'EUR', 82.00, 440.00, 'Ski ALPIN CARD',
 'ortens egen sida', 'ortens egen sida',
 'https://www.saalbach.com/en/winter/skitickets/peak-season', '2026-11-18',
 'Huvudsäsong 19.12.26–12.3.27. Gäller Skicircus, Schmittenhöhe och Kitzsteinhorn/Maiskogel, 408 km. Inget kort för bara Skicircus.'),
('zell-am-see-kaprun', '2026/2027', 'EUR', 82.00, 440.00, 'Ski ALPIN CARD',
 'ortens egen sida', 'ortens egen sida',
 'https://www.zellamsee-kaprun.com/en/sport/winter/skiing/ski-passes', '2026-11-18',
 'Huvudsäsong 19.12.26–12.3.27. Dagskortet köpt från 08.00; från 11.30 kostar det 70. Samma kort som Saalbach, 408 km.'),
('obergurgl', '2026/2027', 'EUR', 69.50, null, 'Gurgl',
 'ortens egen sida', null,
 'https://www.gurgl.com/winter/ski-area/skipass-prices.html', '2026-11-18',
 'Lägsta kassapris ("from") i högsäsongen 27.2–18.4.2027. Orten skriver "current spot prices"; tidigt köp på nätet är billigare.'),
('obergurgl', '2026/2027', 'EUR', null, 469.00, 'Ötztal Superskipass',
 null, 'ortens egen sida',
 'https://www.gurgl.com/winter/ski-area/skipass-prices.html', '2026-11-18',
 'Högsäsong 27.2–18.4.2027. Gäller alla skidområden i Ötztal från tre dagar, Sölden inräknat.'),
('bad-gastein', '2026/2027', 'EUR', 81.50, null, 'Gastein',
 'ortens egen sida', null,
 'https://www.skigastein.com/en/tickets-lifts/winter-tickets/day-tickets/', '2026-11-18',
 'Kassapris huvudsäsong 19.12.26–26.3.27; på nätet 69,50–81,50 efter datum. Gäller Schlossalm-Angertal-Stubnerkogel, Dorfgastein-Großarl och Sportgastein.'),
('bad-gastein', '2026/2027', 'EUR', null, 432.50, 'Ski amadé',
 null, 'ortens egen sida',
 'https://www.skigastein.com/en/tickets-lifts/winter-tickets/multi-day-tickets/', '2026-11-18',
 'Kassapris huvudsäsong 19.12.26–26.3.27; på nätet 367,50–432,50 efter datum. Gäller hela Ski amadé, 760 km.')
on conflict (resort_slug, season, product) do nothing;

commit;


-- ── Efterkontroll ─────────────────────────────────────────────────────
--
--   select slug, published, total_pistes_km, total_lifts,
--          lift_capacity_per_hour, snowmaking_coverage_pct,
--          lift_pass_day_eur, lift_pass_week_eur, nearest_airport
--   from resorts
--   where slug in ('st-anton', 'lech-zuers', 'saalbach',
--                  'zell-am-see-kaprun', 'obergurgl', 'bad-gastein')
--   order by slug;
--
--   Förväntat: st-anton och lech-zuers 301 km, 85 liftar, 145 948, null.
--   De fem nya published = false. zell-am-see-kaprun 140 och
--   bad-gastein 83.
--
--   select notes from resorts where slug = 'st-anton';
--   Förväntat: "… Warth-Schröcken till ett skidområde."
