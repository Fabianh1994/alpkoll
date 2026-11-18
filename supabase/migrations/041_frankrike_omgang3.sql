-- 041 · Omgång 3: tre franska orter läggs in dolda.
--
-- Underlaget är faktafilerna i projektmappen orter/ (la-plagne.md,
-- les-deux-alpes.md, serre-chevalier.md) och granskningen
-- granskning-omgang3.md, alla 2026-11-18. Där granskningen och
-- forskarnas filer skiljer sig gäller granskningen. Varje tal i
-- kärnfälten är kontrollerat mot skiresort.com två gånger, av forskaren
-- och av granskaren.
--
-- De tre orterna läggs in med published = false. De visas inte förrän de
-- har en bild med licens i resort_images och en provad söksträng i
-- BOOKING_SOK (lib/booking.js), enligt CLAUDE.md. Ingen av dem har det i
-- dag.
--
-- Gemensamt för alla tre:
--   · Restid och avstånd är OSRM, samma metod som lib/restider.js,
--     avrundat till hel km och hel minut. Lyon flygplats har samma
--     koordinat för båda orterna (5.0811, 45.7256), Genève 6.1092, 46.2381.
--   · Port: Genève för La Plagne, samma som Les Arcs. Lyon för Les Deux
--     Alpes och Serre Chevalier, samma som Alpe d'Huez. Norwegian flyger
--     Arlanda–Lyon en gång i veckan från januari, SAS och Swiss
--     Arlanda–Genève (flightconnections.com, 2026-11-14 och 2026-11-18).
--     Grenoble och Turin har inget direktflyg från Sverige.
--   · Familj, afterski och bykänsla avser BYN (docs/poangskala.md).
--     Nybörjare avser området.
--   · ski_area är null för alla tre. Ingen av dem delar tal med en annan
--     ort på sajten, och ortsidan skriver annars "Pist, liftar och höjder
--     avser hela {ski_area} … inte bara {name}" (granskningen, rättelse 1).
--     La Plagne följer Les Arcs (migration 008): egna tal, Paradiski i
--     region och text.
--   · transfer_note sätts, som i 008 (039 och 040 sätter den i slutet).
--   · Liftkortet är det kort man köper för en vecka (beslut av Fabian
--     2026-11-18). För alla tre gäller det samma område som pisttalen.
--     De exakta talen och produkten står i lift_pass_prices längst ner.
--
-- Texterna följer docs/copy.md: du-form, inga handskrivna tal, och varje
-- nackdel säger vem den gäller, ett faktum och en annan ort som finns på
-- sajten. Källan till varje namn står i kommentaren vid orten.
--
-- Kör i Supabase SQL Editor. Allt körs i en transaktion.

begin;

-- ── La Plagne ─────────────────────────────────────────────────────────
--
-- skiresort.com: "La Plagne (Paradiski)", 1207–3167 m, "Total: 225 km",
-- 139/59/27 km → 62/26/12, 74 liftar (Vanoise Express räknas i både
-- La Plagne och Les Arcs), "139367 Passengers/hour", 34 % konstsnö.
-- Paradiski är ett kort och en linbana mellan två skiresort-poster, inte
-- en post med egna tal. region = 'Paradiski' som Les Arcs.
-- Avancerad 7 (forskaren 6): Ski Club GB 4/5, svåraste nedfarten "Les
-- étroits · Length 2 km · Elevation difference 550 m".
-- Afterski 6 (forskaren 5): Ski Club GB 2/5 som Les Arcs (6), skiresort
-- 4/5 med barer i Belle Plagne.
-- Mellannivå 9: Ski Club GB 5/5 ("a paradise for intermediates"), Les
-- Arcs 4/5.
--
-- Liftkort: La Plagne-kortet, Adulte 13–64, "1 jour/day 72,00 €", "6
-- jours/days 370,00 €", ett pris hela säsongen med cirka 15 % rabatt i
-- början och slutet. Paradiski 78 / 412 € står som STORRE_KORT i
-- lib/liftkortspriser.js, som för Les Arcs.
-- Restid: Genève → Plagne Centre, OSRM 157,8 km / 164,4 min.
-- Säsong: prislistan "du 12/12/2026 au 24/04/2027".
--
-- Texternas källor:
--   Lätta nedfarter och gratis övningslift: skiresort beginners ("you
--     can ski almost the entire resort on easy slopes"), Ski Club GB
--     ("each of the resort villages has at least one free beginner lift").
--   Face Nord från Bellecôteglaciären mot Peisey: skiresort
--     experts-freeriders.
--   Svart pist: black_percent, La Plagne 12 och Chamonix 40.
--   Byarna byggda från slutet av 1960-talet, höghus i Aime la Plagne,
--     Plagne Bellecôte och Plagne Centre: skiresort huvudsida och
--     accommodations. "Chamonix är en stad med liv året om": migration 008.
--   Byarnas två grupper och savojardisk stil: skiresort accommodations.
--     Plagne Centre flest restauranger och barer, Montchavin och Vanoise
--     Express: Ski Club GB. Belle Plagne "No high rises", Champagny,
--     gratisbussen Bellecôte–Centre–1800: Iglu Ski. Champagnys gondol:
--     skiresort lifts och prislistan.
--   Tåget till Aime-La Plagne och buss upp: Ski Club GB.

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
  'la-plagne', 'La Plagne', 'France', 'Paradiski', null, 45.5083, 6.6866,
  12, 4,
  1207, 3167, 225,
  62, 26, 12,
  74, 139367, 34,
  72, 370, 'EUR',
  'Genève', 158, 164, 'med bil från Genève',
  8, 8, 9, 7,
  8, 7, 8,
  6, 5, 5,
  'La Plagne passar dig som åker blått och rött och vill ha ett stort område att röra dig i. Nästan hela området går att åka på lätta nedfarter, och varje by har en gratis övningslift. Med Paradiski-kortet når du även Les Arcs via linbanan Vanoise Express. Från Bellecôteglaciären går guidade offpistlinjer ner mot Peisey. Vill du åka brant pist varje dag är La Plagne fel val. Svart pist är en liten del av området, och Chamonix har mer än tre gånger så stor andel svart. Vill du bo i en by som fanns före liftarna är de höga byarna också fel val. De byggdes som skidstation från slutet av 1960-talet, och tre av dem har höghus. Chamonix är en stad med liv året om.',
  'Byarna ligger i två grupper. Plagne Centre, Belle Plagne, Aime 2000, Plagne Bellecôte, Plagne Villages och Plagne Soleil ligger högt på platån med boende vid pisten. Plagne Centre har flest restauranger, butiker och barer, och Belle Plagne har inga höghus. Montchavin, Les Coches och Montalbert ligger lägre i skogen, är lugnare och byggda i savojardisk stil. Från Montchavin och Les Coches är det närmast till Vanoise Express. Champagny ligger på andra sidan berget, med egen gondol in i området. Gratisbuss går mellan Plagne Bellecôte, Plagne Centre och Plagne 1800.',
  'Belle Plagne, Plagne Centre',
  'Flyg till Genève. Med tåg åker du till Aime-La Plagne i dalen och tar buss upp till byarna.',
  false
)
on conflict (slug) do nothing;

-- ── Les Deux Alpes ────────────────────────────────────────────────────
--
-- skiresort.com: "Les 2 Alpes", 1280–3523 m, "Total: 220 km",
-- 143/39/38 km → 65/18/17, 40 liftar, "69515 Passengers/hour", 15 %
-- konstsnö, glaciär. La Grave har egen post och nås med pistmaskin, inte
-- lift; den ingår inte i talen.
-- Snösäkerhet 9, samma som Tignes (granskningen, beslut A): glaciär och
-- åkning över 3 000 m, men konstsnön är lägst av de franska orterna och
-- nedfarterna mot byn ligger i sol. Ankartexten i docs/poangskala.md
-- skärps i samma ändring.
-- Familj 7 (forskaren 8): övningsbackarna har flyttats till 2 100 och
-- 2 600 m (les2alpes.com), och byn är utdragen festort.
-- Säsong 11–5: orten säljer kort 28.11.26–2.5.27. Glaciärens säsong är
-- ortens, som Zell am See-Kaprun i 040.
--
-- Liftkort: les2alpes "Hiver - grand domaine P3", 19.12.26–9.4.27,
-- Adult 19–64: "€68.00" för en dag och "€333.00" för sex. Fasta
-- periodpriser, inte dynamiska.
-- Restid: Lyon → byn, OSRM 157,8 km / 131,6 min. Forskaren mätte från en
-- motorvägsavfart (154 / 128); granskaren använde samma koordinat som för
-- Serre Chevalier.
--
-- Texternas källor:
--   Jandri från byn mot glaciären, pist ner till Mont de Lans: skiresort
--     huvudsida och slope-offering. La Fée och pistmaskinen till La
--     Grave: Ski Club GB, skiresort size.
--   "one of the liveliest resorts in France": Ski Club GB; Alpine
--     Answers "one of the liveliest in the French Alpes".
--   Byn längs två gator, bebyggelse från 1960-talet: Ski Club GB,
--     inthesnow ("1960s-‍80s architecture"), Powderhounds.
--   Röd pist: red_percent, Les Deux Alpes 18 och Alpe d'Huez 52.
--     Gratisdagarna i Alpe d'Huez: skipass-2alpes.com ("2 days free at
--     Espace Alpe d'Huez").
--   Liftar från flera ställen i byn: Powderhounds. Övningsbackarna uppe
--     på berget och gratis rullband vid byn: les2alpes.com. Gondolen
--     Vénosc: skiresort lifts. Vénosc lugnare: Powderhounds.
--   Tåg till Grenoble och buss: inthesnow, Powderhounds.
-- Struket: nackdeln om väder (ingen annan ort på sajten att välja) och
-- meningen om Grenobles flyg (en uppgift om vår osäkerhet, inte om orten).

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
  'les-deux-alpes', 'Les Deux Alpes', 'France', 'Dauphiné Alps', null, 45.0100, 6.1238,
  11, 5,
  1280, 3523, 220,
  65, 18, 17,
  40, 69515, 15,
  68, 333, 'EUR',
  'Lyon', 158, 132, 'med bil från Lyon',
  9, 8, 7, 7,
  8, 9, 7,
  8, 4, 5,
  'Les Deux Alpes passar dig som vill vara säker på snön och åka långt nedför. Liftarna går från byn upp till glaciären, och därifrån kan du åka pist ända ner till dalen. Sektorn La Fée är känd för offpist, och över glaciären tar en pistmaskin dig till La Grave. Byn är en av Frankrikes livligaste för afterski. Vill du bo i en gammal alpby är Les Deux Alpes fel val. Byn är en lång rad av lägenhetshus och hotell längs två gator, byggda från 1960-talet och framåt. Chamonix är en stad med liv året om. Vill du åka röda pister hela veckan är Les Deux Alpes också fel val. Bara en liten del av pisten är röd. I Alpe d''Huez är drygt hälften av pisten röd, och med sexdagarskortet härifrån åker du två dagar där gratis.',
  'Byn är lång, och liftarna går från flera ställen längs den, så bo nära den lift du ska använda mest. Jandri går upp mot glaciären. Övningsbackarna ligger uppe på berget, så den som lär sig åka tar liften upp, men vid byn finns gratis rullband. Vill du bo lugnare ligger Vénosc nere i dalen, med gondol upp till byn.',
  'Les Deux Alpes, Vénosc',
  'Flyg till Lyon. Med tåg åker du till Grenoble och tar buss upp.',
  false
)
on conflict (slug) do nothing;

-- ── Serre Chevalier ───────────────────────────────────────────────────
--
-- skiresort.com: "Serre Chevalier – Briançon/Chantemerle/Villeneuve-la-
-- Salle/Le Monêtier-les-Bains", en post för hela dalen. 1200–2800 m,
-- "Total: 250 km", 138/80/32,5 km → 55/32/13, 59 liftar (varav "Serre Che
-- 2 (nur Sommer/only in summer)"; källans tal gäller), "81776
-- Passengers/hour", 30 % konstsnö.
-- region = 'Dauphiné Alps' (skiresort "also located in: Écrins ,
-- Dauphiné Alps"), samma nyckel som Alpe d'Huez och Les Deux Alpes.
-- Byn i betygen är Chantemerle och Villeneuve, där Ski Club GB och
-- Snowthere råder dig att bo. Koordinaten är Chantemerle.
--
-- Liftkort: liftbolagets egen prislista (serrechevalier-pass.com/fr/
-- grille-tarifaire, läst med Firecrawl), "Du 19/12/2026 au 26/03/2027",
-- Adulte 12–64: "1 jour 68,00€", "6 jours 345,00€". Två nivåer, inte
-- dynamiskt: "Le tarif applicable … est celui au 1er jour de validité".
-- Restid: Lyon → Chantemerle, OSRM 200,0 km / 170,4 min över Col du
-- Lautaret. Turin (122 km / 118 min) saknar direktflyg från Sverige.
-- Säsong: liftbolaget "du 05.12.2026 au 18.04.2027".
--
-- Texternas källor:
--   Byarnas gamla kärnor: Ski Club GB ("based on a simple old centre").
--   Liftbyarna och Guisanedalen: skiresort huvudsida, Snowthere.
--   Lärkskog och åkning i snöfall: skiresort ("bright larch forests"),
--     Ski Club GB ("the high treeline … great places to head to in a
--     snowstorm").
--   Världsarvet: Ski Club GB, Iglu Ski.
--   Svart pist: black_percent, Serre Chevalier 13 och Chamonix 40.
--     Allefroide kort: skiresort slope-offering.
--   Kvällarna och termalbadet: Ski Club GB ("small local bars and a quiet
--     beer or vin chaud"), skiresort après-ski ("Guests prefer the
--     thermal baths in Monêtier-les-Bains"). Val Thorens: afterski 9 på
--     sajten; ingen extern källa (granskningen, SVAGT).
--   Villeneuve och Chantemerle mitt i dalen: Ski Club GB, Snowthere. Le
--     Monêtier lugnast, Les Grands Bains, gratis skidbuss: Snowthere.
--     Övningsbacken i Briançon nås med Prorel: liftbolaget ("1 aller/
--     retour télécabine Prorel tronçon 1 … téléski Pitchounets").
--   Lautaret, La Grave och däck: Ski Club GB, Snowthere. Montgenèvre från
--     Turin: OSRM-rutten. Nattåget Paris Austerlitz–Briançon och Prorel
--     nära stationen: ulysse.com, Snowthere (säsongen 25/26; 26/27 inte
--     bekräftat, och inga tider skrivs).
-- Struket: "lägre priser än i de stora stationerna i Savoie" och
-- nackdeln om att inget direktflyg finns.

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
  'serre-chevalier', 'Serre Chevalier', 'France', 'Dauphiné Alps', null, 44.9325, 6.5926,
  12, 4,
  1200, 2800, 250,
  55, 32, 13,
  59, 81776, 30,
  68, 345, 'EUR',
  'Lyon', 200, 170, 'med bil från Lyon',
  7, 7, 8, 7,
  8, 6, 7,
  5, 7, 6,
  'Serre Chevalier passar dig som åker blått och rött och vill bo i en by med gammal kärna. Liftarna går från Briançon, Chantemerle, Villeneuve och Le Monêtier-les-Bains längs Guisanedalen, och samma kort gäller hela vägen. Delar av pisten går genom lärkskog, där du ser var du åker också när det snöar. Briançons befästa stadskärna är ett världsarv. Vill du åka brant pist varje dag är Serre Chevalier fel val. Svart pist är en liten del av området och den svåraste nedfarten är kort. Chamonix har tre gånger så stor andel svart. Vill du festa efter liftstängning är Serre Chevalier också fel val. Kvällarna tillbringas i små barer i varje by, och många går till termalbadet i Le Monêtier. Val Thorens passar bättre för afterski.',
  'Bo i Villeneuve eller Chantemerle om du vill nå alla delar av området. Byarna ligger mitt i dalen och har barnområde och övningsbacke vid liften. Le Monêtier är lugnast och har termalbadet Les Grands Bains. Briançon passar dig som vill bo i stad. Gondolen Prorel går nära järnvägsstationen, och övningsbacken nås med den. Gratis skidbuss går mellan byarna.',
  'Villeneuve, Chantemerle, Le Monêtier-les-Bains, Briançon',
  'Flyg till Lyon och kör över Col du Lautaret. Vägen via La Grave kan stängas vid snöfall, och vinterdäck eller snökedjor krävs. Från Turin går vägen över Col de Montgenèvre. Nattåget från Paris Austerlitz går till Briançon, och från stationen går du till gondolen Prorel.',
  false
)
on conflict (slug) do nothing;

-- ── Prishistorik ──────────────────────────────────────────────────────
--
-- Samma tabell och form som 030, 033 och 040. Ett kort per ort, eftersom
-- dags- och veckokortet är samma produkt. Paradiski för La Plagne står
-- som STORRE_KORT i koden, som för Les Arcs, och får ingen egen rad.

insert into public.lift_pass_prices
  (resort_slug, season, currency, day_price, week_price, product,
   day_source, week_source, source_url, captured_on, note)
values
('la-plagne', '2026/2027', 'EUR', 72.00, 370.00, 'La Plagne',
 'ortens egen sida', 'ortens egen sida',
 'https://assets.ctfassets.net/4a1jxa5u6hbl/58GkCfVNpD6RzsV9D7SNdG/050e0c6cd1824e25cc41a0347cec19f0/Tarifs_domaine_La_Plagne_Hiver_2026-2027.pdf', '2026-11-18',
 'Ett pris 12.12.26–24.4.27, cirka 15 % lägre vissa datum i början och slutet. Paradiski 78 / 412.'),
('les-deux-alpes', '2026/2027', 'EUR', 68.00, 333.00, 'Les 2 Alpes',
 'ortens egen sida', 'ortens egen sida',
 'https://www.skipass-2alpes.com/en/pricing', '2026-11-18',
 'Period P3 19.12.26–9.4.27, vuxen 19–64. P1 28.11–4.12: 54,50 / 266,50.'),
('serre-chevalier', '2026/2027', 'EUR', 68.00, 345.00, 'Pass Serre Chevalier',
 'ortens egen sida', 'ortens egen sida',
 'https://www.serrechevalier-pass.com/fr/grille-tarifaire', '2026-11-18',
 'Säsong 19.12.26–26.3.27, vuxen 12–64. Början och slutet av säsongen 56 / 283.')
on conflict (resort_slug, season, product) do nothing;

commit;


-- ── Efterkontroll ─────────────────────────────────────────────────────
--
--   select slug, published, region, ski_area, total_pistes_km,
--          total_lifts, lift_pass_day_eur, lift_pass_week_eur,
--          nearest_airport, airport_distance_km, transfer_minutes,
--          season_start_month, season_end_month
--   from resorts
--   where slug in ('la-plagne', 'les-deux-alpes', 'serre-chevalier')
--   order by slug;
--
--   Förväntat: alla tre published = false och ski_area null.
--   la-plagne 225 km, Genève 158 / 164. les-deux-alpes 220 km, Lyon
--   158 / 132, säsong 11–5. serre-chevalier 250 km, Lyon 200 / 170.
--
--   select resort_slug, product, day_price, week_price
--   from lift_pass_prices
--   where resort_slug in ('la-plagne', 'les-deux-alpes', 'serre-chevalier');
--   Förväntat: tre rader, 72/370, 68/333 och 68/345.
