-- 050 · Kläppen och Funäsfjällen läggs in dolda.
--
-- Båda saknades när ChatGPT och topplistorna svarade på frågan om bästa
-- skidort för barnfamiljer (2026-11-20): Kläppen vann Freerides omröstning
-- om Sveriges bästa skidort för barnfamiljer 2026, och Funäsfjällen har
-- vunnit Freerides läsaromröstning om Sveriges bästa skidort fem år i rad.
--
-- Underlaget är faktafilerna orter/klappen.md och orter/funasfjallen.md i
-- projektmappen, båda 2026-11-20, skrivna efter orter/MALL.md. Varje tal i
-- kärnfälten är från skiresort.com (CLAUDE.md), och betygen är jämförda
-- med Sälen, Idre Fjäll, Branäs och Vemdalen på sajten samma dag.
--
-- Orterna läggs in med published = false. De visas inte förrän de har en
-- bild med licens i resort_images och ett beslut i BOOKING_SOK
-- (lib/booking.js), enligt CLAUDE.md.
--
-- Ingen av sluggarna klappen eller funasfjallen förekommer i någon tidigare
-- migration. Därför insert.
--
-- Gemensamt:
--   · Restid och avstånd är OSRM, samma metod som lib/restider.js. Bilresan
--     från svenska städer står i BIL i lib/restider.js.
--   · Familj, afterski och bykänsla avser BYN (docs/poangskala.md).
--     Övriga betyg avser området.
--   · Ordet för pengarna-tillbaka-villkoret som orterna säljer används inte;
--     poängen heter Snösäkerhet (CLAUDE.md).
--
-- Kör i Supabase SQL Editor. Allt körs i en transaktion.

begin;

-- ── Kläppen ───────────────────────────────────────────────────────────
--
-- skiresort.com: "Kläppen" (/klaeppen/), 340–655 m, 26 km, lätt 79 %,
-- medel 13 %, svår 8 %, 22 liftar, 23389 personer/timme. Andel konstsnö
-- anges inte i procent ("All main slopes can be covered with artificial
-- snow"), därför null. Egen post hos skiresort och eget liftkort; SkiStars
-- SkiPass gäller inte. ski_area = null.
-- Koordinaten är dalstationen vid Kläppentorget. region = 'Dalarna'.
-- Säsong 12–4: Kläppen "11 december 2026 - 04 april 2027".
--
-- Port: Scandinavian Mountains, OSRM 45 km / 46 min.
--
-- Betyg (jämförda med sajten 2026-11-20):
--   Snösäkerhet 5: toppen 655 m, mellan Branäs 5 (567 m) och Sälen 6
--     (887 m). skiresort 5/5 och alla huvudnedfarter kan snöas.
--   Nybörjare 9: 79 % lätt pist och gröna nedfarter från toppen. Som Idre
--     Fjäll och Vemdalen; Branäs och Sälen har 10.
--   Familj 10, ett ytterläge: Freerides omröstning 2026, barn till och med
--     sju år åker gratis, barnområdet vid Tranantorget (gondolens
--     mittstation), skiresort 5/5. Samma som Sälen.
--   Snowpark 8: tre parker, Kläppen Snowpark är nationalarena för Freeski
--     och Snowboard Team Sweden. skiresort 5/5. Över Sälens 7.
--   Afterski 5: Halster vid Tranantorget på eftermiddagen. skiresort 3/5.
--   Bykänsla 6: anläggning byggd kring liftarna 1982, som Idre Fjäll och
--     Branäs.
--   Offpist 4: två skidvägar på en halv kilometer, under trädgränsen.
--
-- Liftkort: Kläppens bokning, produkten "Skipass", vuxen 16–64 år, start
-- lördag 27 februari 2027 (referensveckan), ordinarie pris 690 / 3 290
-- SEK. Sex, sju och åtta dagar kostar samma. pistat.se anger 2 716 för sex
-- dagar; bokningen gäller.

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
  'klappen', 'Kläppen', 'Sweden', 'Dalarna', null, 61.0322, 13.3399,
  12, 4,
  340, 655, 26,
  79, 13, 8,
  22, 23389, null,
  690, 3290, 'SEK',
  'Scandinavian Mountains', 45, 46, 'med bil från flygplatsen',
  5, 9, 5, 5,
  4, 8, 10,
  5, 6, 7,
  'Kläppen passar dig som åker med små barn eller vill åka park. Det mesta av pisten är lätt, gröna nedfarter går från toppen, och barn till och med sju år åker gratis. Kläppen Snowpark är nationalarena för freeski och snowboard. Kläppen har eget liftkort, och SkiStars SkiPass gäller inte här. Vill du åka brant är Kläppen fel val. Fallhöjden är liten, och Åre har ungefär tre gånger så mycket. Vill du ha ny pist varje dag en hel vecka är Kläppen också fel val. SkiStars fyra områden i Sälen har mer än tre gånger så mycket pist, men kräver ett annat liftkort. Vill du gå ut på kvällen passar Åre bättre. Afterskin i Kläppen är på Halster Bar & Bistro på eftermiddagen.',
  'Med små barn passar Tranantorget, där Hotell Kurbits ligger vid gondolen och barnområdet, skidskolan och restaurangerna finns runt torget. Tranangårdarna ligger vid torget, och från Gusjöbyns stugby går du till pisten, gondolen, skidhyran och matbutiken. Mitt i Pisten ligger nära backarna och längdspåret Myrspåret. Reser ni många passar de stora husen i Örebäcken och Kläppbacken.',
  'Tranantorget, Kläppentorget',
  'Från söder är Kläppen den första anläggningen du når i Sälenfjällen. Under vintersäsongen stannar Fjällexpressen i Kläppen, både på linjen från Stockholm via Mora och på linjen från Malmö och Göteborg. Med tåg åker du till Mora eller Borlänge och tar bussen sista biten. Snälltågets buss från Mora stannar inte i Kläppen. Flyger du är Scandinavian Mountains Airport porten, och sista biten går med bil eller förbokad transfer.',
  false
)
on conflict (slug) do nothing;

-- ── Funäsfjällen ──────────────────────────────────────────────────────
--
-- Fjällpass Lift gäller sex anläggningar, och skiresort.com har sex poster:
-- Tänndalen (38 km, 17 liftar, 743–1 038 m), Ramundberget (25, 10,
-- 700–1 000), Funäsdalsberget (10, 5, 663–977), Tännäskröket (8,1, 4,
-- 562–889), Kappruet (4, 1, 700–840) och Tänndalsvallen (2, 1, 750–864).
-- Summan, 87 km och 38 liftar, är samma som skiresorts regionsida. Som
-- Vemdalen (039) avser talen det liftkortet ger, med gratis skidbuss
-- emellan, och delarna står i lib/delomraden.js. ski_area = null.
-- Skillnad mot Vemdalen: anläggningarna har olika ägare.
-- Pist 33,8 / 36,6 / 16,7 km = 39 / 42 / 19 %. Kapacitet 46 253 pers/h.
-- Konstsnö 53 %: km-viktat över de tre poster som anger procent
-- (Tänndalen 51, Ramundberget 40, Funäsdalsberget 90).
-- Koordinaten är byn Funäsdalen (OSM). region = 'Härjedalen' som Vemdalen.
-- Säsong 11–5: Tänndalen "2026-11-07 - 2027-05-03".
--
-- Port: Östersund, samma som Vemdalen och Åre. OSRM 209 km / 208 min till
-- Funäsdalen. Röros är närmare men nås från Sverige bara med byte i Oslo.
--
-- Betyg (jämförda med sajten 2026-11-20):
--   Snösäkerhet 7: toppen 1 038 m, som Trysil och Hafjell.
--   Nybörjare 7: 39 % lätt pist hos skiresort, lägst av de svenska
--     orterna, men Tänndalen och Ramundberget går att åka helt i lätta
--     nedfarter. Som Trysil.
--   Offpist 7: Osthang i Ramundberget, skogsåkning i Tännäskröket och
--     Hamra Syd. Under Åre och Hemavan 8.
--   Familj 8: som Vemdalen. Bykänsla 7: Funäsdalen är en by med butiker
--     och restauranger, som Sälen och Trysil.
--   Afterski 5: Lodgen i Tänndalen, lite i övrigt.
--
-- Liftkort: Fjällpass Lift, vuxen från 18 år, 655 / 3 130 SEK, samma hela
-- säsongen (funasfjallen.se, ramundberget.se, funasdalen.se, Visit
-- Fjällen och pistat anger samma tal).
--
-- Freeride har utsett Funäsfjällen till Sveriges bästa skidort 2019, 2023,
-- 2024, 2025 och 2026: fem gånger, fyra år i rad.

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
  'funasfjallen', 'Funäsfjällen', 'Sweden', 'Härjedalen', null, 62.5462, 12.5418,
  11, 5,
  562, 1038, 87,
  39, 42, 19,
  38, 46253, 53,
  655, 3130, 'SEK',
  'Östersund', 209, 208, 'med bil från Östersund',
  7, 7, 7, 5,
  7, 7, 8,
  5, 7, 7,
  'Funäsfjällen är sex skidanläggningar i västra Härjedalen med samma liftkort, Fjällpass Lift: Tänndalen, Ramundberget, Funäsdalsberget, Tännäskröket, Kappruet och Tänndalsvallen. De hänger inte ihop med lift, och skidbussen mellan dem ingår i liftkortet. Orten passar dig som vill variera åkningen under en vecka, med skogsåkning och offpist som nås med lift. Freerides läsare och jury har röstat fram Funäsfjällen till Sveriges bästa skidort fyra år i rad, senast 2026. Vill du åka brant är Funäsfjällen fel val. Fallhöjden är liten i alla sex anläggningarna, och Åre har nästan tre gånger så mycket. Vill du flyga och vara i backen samma förmiddag är Funäsfjällen också fel val. Från Östersund är det en lång biltur, och Åre ligger närmare samma flygplats. Vill du gå ut på kvällen passar Åre bättre. Afterskin i Funäsfjällen samlas på ett ställe i Tänndalen.',
  'Funäsdalen är byn, med butiker och restauranger och Funäsgondolen upp på Funäsdalsberget. Med små barn passar Tänndalen, där barnområdena i Hamra och Tännporten ligger nära boendet och afterskin samlas på Lodgen, eller Ramundberget, där allt boende ligger vid eller nära liften och barnområdet heter Lillramis. Söker du skogsåkning och tomma backar passar Tännäskröket.',
  'Funäsdalen, Tänndalen, Ramundberget och Tännäs',
  'De flesta kör. Snälltågets nattåg går fredagar till Röjan, med transfer till Funäsdalen och Ramundberget; hemresan bokas samtidigt. Expressbussen Härjedalingen går från Stockholm, Uppsala och Gävle till Funäsdalen. Flyger du är Östersund porten, och sista biten går med bil. Skidbussen mellan anläggningarna är gratis med Fjällpass Lift.',
  false
)
on conflict (slug) do nothing;

insert into public.lift_pass_prices
  (resort_slug, season, currency, day_price, week_price, product,
   day_source, week_source, source_url, captured_on, note)
values
('klappen', '2026/2027', 'SEK', 690.00, 3290.00, 'Skipass',
 'ortens egen sida', 'ortens egen sida',
 'https://www.klappen.se/boka/skipass?s=2027-02-27', '2026-11-20',
 'Start 27.2.2027, ordinarie pris, vuxen 16–64 år. 6–8 dagar samma pris. 10 % lägre fram till 30 dagar före, 5 % fram till 10 dagar före. Barn 0–7 år gratis. Start 16.1.2027: 625 / 2 965.'),
('funasfjallen', '2026/2027', 'SEK', 655.00, 3130.00, 'Fjällpass Lift',
 'ortens egen sida', 'ortens egen sida',
 'https://funasfjallen.se/fjallpass-lift/', '2026-11-20',
 'Prislista vinter 2026/27, ett pris hela säsongen, vuxen från 18 år. 6–8 dagar samma pris. 15 % lägre för 6–14 dagar köpta minst 30 dagar före. Gäller alla sex anläggningarna. Barn under 7 år med hjälm gratis.')
on conflict (resort_slug, season, product) do nothing;

commit;
