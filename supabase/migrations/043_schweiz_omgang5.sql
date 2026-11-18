-- 043 · Omgång 5: tre schweiziska orter läggs in dolda.
--
-- Underlaget är faktafilerna i projektmappen orter/ (laax.md,
-- st-moritz.md, engelberg.md) och granskningen granskning-omgang5.md, alla
-- 2026-11-18. Där granskningen och forskarnas filer skiljer sig gäller
-- granskningen. Varje tal i kärnfälten är kontrollerat mot skiresort.com
-- två gånger, av forskaren och av granskaren.
--
-- De tre orterna läggs in med published = false. De visas inte förrän de
-- har en bild med licens i resort_images och en provad söksträng i
-- BOOKING_SOK (lib/booking.js), enligt CLAUDE.md. Ingen av dem har det i
-- dag.
--
-- Ingen av sluggarna laax, st-moritz eller engelberg förekommer i någon
-- tidigare migration, i lib/ eller i app/. Därför insert. Davos (009)
-- rörs inte.
--
-- Gemensamt för alla tre:
--   · Port: Zürich, stavat som i 002. SAS och Swiss flyger Arlanda–Zürich
--     direkt, 21 avgångar i veckan i november 2026 (flightconnections.com,
--     uppdaterad 2026-11-17).
--   · Restid och avstånd är OSRM, samma metod som lib/restider.js,
--     avrundat till hel km och hel minut, från samma flygplatskoordinat
--     för alla tre: terminalens avfart "Vorfahrt Abflug" (8.5621, 47.4504),
--     som OSRM fäster på 13 meter. Forskarna använde två andra punkter.
--     Nominatims punkt för flygplatsområdet (8.5534, 47.4634) fäster på en
--     väg norr om banorna och gav 20 minuter för mycket; se granskningen.
--   · Familj, afterski och bykänsla avser BYN (docs/poangskala.md).
--     Övriga betyg avser området.
--   · ski_area är null för alla tre. Ingen annan ort på sajten delar
--     område med dem. St. Moritz tal är en summa av tre poster och står i
--     lib/delomraden.js.
--   · transfer_note sätts, som i 041 och 042.
--   · Liftkortet är det kort man köper för en vecka (beslut av Fabian
--     2026-11-18). Alla tre priserna är dynamiska och lästa för start
--     lördag 27 februari 2027, referensveckans första dag, som Zermatt i
--     036. Kolumnerna är heltal (022), så 454,50 står som 455. De exakta
--     talen står i lift_pass_prices längst ner.
--
-- Texterna följer docs/copy.md: du-form, inga handskrivna tal, och varje
-- nackdel säger vem den gäller, ett faktum och en annan ort som är
-- publicerad på sajten. Källan till varje namn står i kommentaren vid
-- orten.
--
-- Kör i Supabase SQL Editor. Allt körs i en transaktion.

begin;

-- ── Laax ──────────────────────────────────────────────────────────────
--
-- skiresort.com: "Laax/Flims/Falera", 1100–3018 m, "Total: 176 km",
-- 85/76/15 km → 48/43/9, 29 liftar, "49696 Passengers/hour", 37 %
-- konstsnö. Ortens eget pistantal per färg är detsamma: "85km blue
-- slopes", "76km red slopes", "15km black slopes" (laax.com/en/slopes).
-- Koordinaten är Laax Dorf (Nominatim). Säsong: skiresort "Current
-- season: 2026-11-28 - 2027-04-11". Glaciären öppnar i allmänhet i slutet
-- av oktober, men inte enligt källan i år.
-- region = 'Graubünden', som skiresort; står oöversatt i lib/countries.js.
--
-- Betyg som skiljer sig från forskaren (granskningen):
--   Mellannivå 8 (forskaren 9): Ski Club GB 5/5 och inthesnow belägger
--     bra åkning för den som åker blått och rött, men samma Ski Club-betyg
--     har Tignes, som står på 8 med mer pist. Nian bärs i skalan av Val
--     Gardena, som når hela Sellaronda med lift.
-- Betyg som granskningen prövade och lät stå:
--   Snowpark 10: fyra parker och en superpipe vid Crap Sogn Gion och
--     inomhushallen Freestyle Academy vid dalstationen (skiresort snow-
--     park 5/5), Ski Club GB "European capital of freestyle, with five
--     terrain parks", inthesnow "four snowparks". Bäst i materialet, och
--     Val Thorens står kvar på 9. Laax blir ankare för tian.
--   Snösäkerhet 9: Vorabglaciären och toppen 3 018 m uppfyller ankaret.
--     Ski Club GB 3/5 och "Resort runs can suffer from bad snow" drar ner,
--     och det står i texten som nackdel om dalnedfarterna.
--
-- Liftkort: liftbolagets butik shop.laax.com, vuxen 18–63, läst av
-- granskaren i webbläsare. Start 27.2.2027: "1 day" CHF 90.00; sex dagar
-- 27.2–4.3.2027 "Selected duration: 6 days", "CHF 440.00 Incl. Tax".
-- Forskaren läste start 1 mars: 86,50 / 442,00. laax.com/en/tickets:
-- "Prices for day and multi-day tickets ... are dynamic".
-- Restid: Zürich → Laax Dorf, OSRM 152,7 km / 114,3 min.
--
-- Texternas källor:
--   Fyra parker, superpipe, Freestyle Academy: skiresort snow-park, Ski
--     Club GB, inthesnow. Flims Laax Falera med tre dalstationer:
--     skiresort huvudsida. Vorabglaciären och Der Weisse Schuss ("Longest
--     run Vorab Glacier-Flims (Der Weisse Schuss) · Length 14 km"):
--     skiresort slope-offering.
--   St. Anton 17 % svart (alpkoll.se), avancerad 10 (ankare). Laax 9 %.
--   Husen vid dalstationen nya, Laax Dorf med de gamla husen: sno.co.uk
--     ("Laax Dorf has an olde worlde feel", "The base station is much more
--     modern"), inthesnow ("modern, design-led feel"). Skidbussen från
--     Laax Dorf: skiresort accommodations. Zermatt: bykänsla 10 (ankare).
--   Dalnedfarterna genom skogen: skiresort ("Flims is accessible via easy
--     and intermediate forest runs"), Ski Club GB ("Resort runs can suffer
--     from bad snow"). Val Thorens: ankaret för snösäkerhet 10.
--   rocksresort, Signina och Riders Palace vid dalstationen, Falera för
--     familjer: skiresort accommodations och families-children. Flims den
--     större byn: Ski Club GB.
--   Chur och Postauto: flimslaax.com. Liftbolagets transfer från Zürich
--     flygplats: laax.com/en/transportation.

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
  'laax', 'Laax', 'Switzerland', 'Graubünden', null, 46.8064, 9.2581,
  11, 4,
  1100, 3018, 176,
  48, 43, 9,
  29, 49696, 37,
  90, 440, 'CHF',
  'Zürich', 153, 114, 'med bil från Zürich',
  9, 7, 8, 7,
  7, 10, 7,
  7, 6, 5,
  'Laax passar dig som åker snowpark. Vid Crap Sogn Gion ligger fyra parker och en superpipe, och vid dalstationen i Laax finns inomhushallen Freestyle Academy. Skidområdet heter Flims Laax Falera, och de tre byarna har var sin dalstation. Åker du inte park har du långa blå och röda nedfarter från Vorabglaciären, och Der Weisse Schuss går hela vägen ner till Flims. Söker du brant pist har St. Anton nästan dubbelt så stor andel svart. Vill du bo i en gammal by och åka skidor från dörren är Laax fel val. Husen vid dalstationen är nybyggda, och från den gamla byn Laax Dorf tar du skidbussen upp. Välj Zermatt. Vill du ha säker snö ända ner till byn är Laax också fel val. Dalnedfarterna går genom skogen, och Ski Club of Great Britain skriver att de kan ha dålig snö. I Val Thorens ligger byn ovanför trädgränsen, och pisterna går mellan husen.',
  'Vid dalstationen Laax Murschetg bor du vid backen. Där ligger rocksresort, Signina och Riders Palace. Laax Dorf, med sjön och de gamla husen, ligger nedanför, och därifrån tar du skidbussen på morgonen. Med barn är Falera lugnare, och där finns ett eget barnområde. Flims har egen dalstation och är den större byn.',
  'Laax Murschetg, Laax Dorf, Flims, Falera',
  'Flyg till Zürich. Med tåg åker du till Chur och tar Postauto därifrån upp till Laax. Liftbolaget kör också en egen transfer från flygplatsen, som du bokar i förväg.',
  false
)
on conflict (slug) do nothing;

-- ── St. Moritz ────────────────────────────────────────────────────────
--
-- skiresort.com har ingen post för St. Moritz som helhet. Talen är summan
-- av tre poster, som inte hänger ihop med lift (lib/delomraden.js):
--   St. Moritz – Corviglia: 1772–3057 m, 155 km, 42/79/34 km, 23 liftar,
--     33 245 pers/h, 80 % konstsnö.
--   Corvatsch/Furtschellas: 1797–3303 m, 120 km, 13/89,3/17,7 km,
--     14 liftar, 18 310 pers/h, 30 %.
--   Diavolezza/Lagalb: 2093–3006 m, 35 km, 0/27/8 km, 5 liftar,
--     4 410 pers/h, 55 %.
-- Summa 310 km, 42 liftar, 55 965 pers/h; 55/195,3/59,7 km → 18/63/19 %.
-- Konstsnö km-viktad: (0,80·155 + 0,30·120 + 0,55·35) / 310 = 58 %.
-- Höjderna 1 772–3 303 m är Corviglias bas och Corvatschs topp.
-- Ski Club GB: "The three ski areas in the St Moritz valley ... offer up
-- over 300km of groomed slopes served by 42 lifts"; Powderhounds "312km
-- (combined)". Zuoz (15 km, fem liftar) ingår i liftkortet men inte i
-- talen; se lib/delomraden.js och granskningen.
-- Koordinaten är St. Moritz (Nominatim). region = 'Graubünden'.
-- Säsong 11–5: Corvatsch öppnar 21.11.2026 och Diavolezza stänger
-- 2.5.2027 (skiresort). Diavolezza öppnar 24.10, men "From mid-October to
-- mid-November, skiing usually operates only at the Diavolezzafirn
-- four-seater chairlift ... Then, the ski area closes for a month." En
-- stolslift följd av en månads stängning ger inte oktober; se granskningen,
-- beslut D.
--
-- Betyg: forskarens rad står oförändrad (snö 9, nybörjare 5, mellannivå 8,
-- avancerad 7, offpist 8, snowpark 6, familj 6, afterski 7, bykänsla 7,
-- gott om plats 7). Avstämningen mot Laax och Engelberg står i
-- granskningen, tabell 1.
--   Mellannivå 8, inte 9: Ski Club GB 5/5, men åkningen är delad på tre
--     berg och Corviglia ensamt har 155 km. Samma skäl som Laax.
--   Snowpark 6: skiresort ger Corvatsch 5/5 och Crowland på Corviglia
--     beröm, men Iglu räknar en park. Samma regel som Val Gardena i 042.
--   Bykänsla 7: OS 1928 och 1948 och de stora hotellen mot Ski Club GB
--     ("some of the big apartment blocks are a bit of an eyesore") och
--     Powderhounds ("lost much of its traditional charm"). Samma mönster
--     och samma betyg som Engelberg.
--   Gott om plats 7: Powderhounds "It is very quiet compared to other
--     ski areas", Iglu "queues are not considered troublesome". Åtta vore
--     högre än alla alporter på sajten.
--
-- Liftkort: ortens bokning booking.engadin.ch, kortet "Upper Engadin*",
-- vuxen 18+, läst av forskaren och av granskaren i webbläsare. Start
-- 27.2.2027: "1 day Upper Engadin* on 27.02.2027 Adult 1 CHF 86.00" och
-- "6 days Upper Engadin* from 27.02.2027 to 04.03.2027 Adult 1 CHF
-- 454.50". Forskaren läste också start 1 mars: 91,50 / 452,00.
-- "Multi-day tickets are only available for the entire region of Upper
-- Engadin", som också gäller Zuoz och fem små backar; LIFTKORT med km null
-- i lib/liftkortspriser.js.
-- Restid: Zürich → St. Moritz, OSRM 213,9 km / 174,9 min. Tåget är den
-- verkliga vägen och står i transport_info.
--
-- Texternas källor:
--   Tre berg, Corvatsch ovanför Silvaplana och Sils, Diavolezza/Lagalb vid
--     Berninabanan nära Pontresina: skiresort (Cv "From the valley in
--     Surlej (Silvaplana) and Sils", D "located directly on the Bernina
--     railway line, not far from Pontresina"). Glaciären på Corvatsch: Cv
--     "the slopes up here lead over a glacier".
--   Hahnensee till St. Moritz Bad och bussen tillbaka: skiresort Cv
--     ("The black Hahnensee run leads to St. Moritz Bad without a lift
--     connection back").
--   Dyrt: Ski Club GB ("Prices are expensive on and off the slopes",
--     Value 2/5). Livigno: 374,50 € för sex dagar (021), lägre än 454,50
--     CHF. Jämförelsen räknas inte ut i texten.
--   Les 3 Vallées från Val Thorens med lift: alpkoll.se/resort/val-thorens.
--   18 % blå, Diavolezza/Lagalb utan lätt pist ("you won't find any easy
--     slopes here"): skiresort. Sälen 46 % blå (013).
--   Celerina med gondol och barnbyn, Signal från Bad, bergbanan från
--     Dorf, Silvaplana och Surlej vid Corvatsch, Pontresina mot
--     Diavolezza: skiresort lifts-cable-cars och families, Powderhounds.
--   Tåget till St. Moritz station, passen, bussar och tåg i liftkortet:
--     Powderhounds, booking.engadin.ch.

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
  'st-moritz', 'St. Moritz', 'Switzerland', 'Graubünden', null, 46.4979, 9.8392,
  11, 5,
  1772, 3303, 310,
  18, 63, 19,
  42, 55965, 58,
  86, 455, 'CHF',
  'Zürich', 214, 175, 'med bil från Zürich',
  9, 5, 8, 7,
  8, 6, 6,
  7, 7, 7,
  'St. Moritz passar dig som åker rött, vill ha höjd och söker offpist. Orten har tre skilda skidberg i Oberengadin med buss och tåg emellan: Corviglia ovanför orten, Corvatsch med glaciär ovanför Silvaplana och Sils, och Diavolezza/Lagalb vid Berninabanan nära Pontresina. Från Corvatsch går den svarta nedfarten Hahnensee ner till St. Moritz Bad, men tillbaka tar du bussen. Vill du hålla nere kostnaden är St. Moritz fel val. Ski Club of Great Britain skriver att det är dyrt både i backen och utanför. Livigno har lägre sexdagarspris. Vill du åka hela veckan i ett sammanhängande område är St. Moritz också fel val. De tre bergen når inte varandra med lift. Från Val Thorens når du hela Les 3 Vallées med lift. Ska du lära dig åka är St. Moritz fel val. Mindre än en femtedel av pisten är blå, och Diavolezza/Lagalb har ingen lätt pist alls. I Sälen är nästan hälften av pisten blå.',
  'Bo i Celerina eller St. Moritz Bad om Corviglia är skälet. Celerina har gondol upp och barnbyn vid dalstationen, och från Bad går linbanan Signal. Från St. Moritz Dorf tar du bergbanan i två etapper. Silvaplana och Surlej ligger vid Corvatsch, Pontresina på vägen mot Diavolezza. Bussar och tåg i dalen ingår i liftkortet.',
  'St. Moritz, Celerina, Silvaplana, Pontresina',
  'Flyg till Zürich eller Milano Malpensa och ta tåget, som går ända fram till St. Moritz station. Bilvägarna från Zürich och Milano går över bergspass som kan vara besvärliga i dåligt väder. På plats behövs ingen bil, eftersom bussar och tåg i dalen ingår i liftkortet för hela Oberengadin.',
  false
)
on conflict (slug) do nothing;

-- ── Engelberg ─────────────────────────────────────────────────────────
--
-- skiresort.com: "Titlis – Engelberg", 1003–3020 m, "Total: 70 km",
-- 18/42,5/9,5 km → 25/60/15, 18 liftar, "23411 Passengers/hour", 40 %
-- konstsnö. Bara Titlis-posten: Brunni – Engelberg (8,5 km, 1013–2075 m)
-- ligger på andra sidan dalen utan lift- eller pistförbindelse och är en
-- egen post. Talen slås inte ihop, och orten står inte i
-- lib/delomraden.js. Brunni nämns i texten.
-- Koordinaten är Engelberg (Nominatim). region = 'Central Switzerland'
-- (skiresort), översatt till Centralschweiz i lib/countries.js.
-- Säsong 10–5: skiresort "Current season: 2026-10-29 - 2027-05-02",
-- Titlis "Planned ski season on TITLIS: 10.10.2026 - 02.05.2027".
-- Glaciärort, som Sölden och Les Deux Alpes.
--
-- Betyg som skiljer sig från forskaren (granskningen):
--   Snowpark 4 (forskaren 3): skiresort "There is no snowpark or
--     halfpipe in the Titlis ski area", men Iglu skriver "Snow Parks 1".
--     Ett ytterläge (3) kräver mer än en källa när en annan säger emot,
--     samma regel som offpist för Alta Badia i 042. Engelberg blir ankare
--     för 4.
-- Betyg som granskningen prövade och lät stå:
--   Snösäkerhet 9: Titlisglaciären på 3 020 m uppfyller ankaret, Ski
--     Club GB 4/5 ("Fantastic snow record"), Powderhounds "Deep, reliable
--     & quality snowpack". Mot: byn på cirka 1 000 m och 40 % konstsnö.
--   Mellannivå 6: Ski Club GB 2/5 ("intermediates will find the extent
--     of the pistes limited"), Powderhounds ("may find the piste terrain
--     limiting after a couple of days").
--   Offpist 10: Ski Club GB ("The lift-served off piste potential is
--     vast, especially with the world renowned Laub freeride route"),
--     Powderhounds ("World class freeride & powder skiing"), skiresort
--     experts 5/5. Engelberg blir ankare för tian.
--
-- Liftkort: Titlis webbshop shop.titlis.ch, "Ski tickets for the whole
-- destination (TITLIS/Brunni/Fürenalp)", vuxen, läst av granskaren i
-- webbläsare. Start 27.2.2027: 1 dag 67 CHF; sex dagar "Sat, Feb 27 –
-- Thu, Mar 4, 2027 CHF 302.00". Forskaren kunde inte läsa mars.
-- titlis.ch: priserna är "online prices. A transaction fee of CHF 5 per
-- transaction applies to purchases made at the ticket counter." Kortet
-- gäller Titlis och Brunni, LIFTKORT 70 + 8,5 km.
-- Restid: Zürich → Engelberg, OSRM 99,8 km / 85,4 min.
--
-- Texternas källor:
--   Laub från Laubersgrat mot Gerschnialp: skiresort experts ("From
--     Laubersgrat, the well-known "Laub" route leads to Gerschnialp").
--     Nedfarten från Titlis till byn: skiresort ("Longest run
--     Titlis-Engelberg · Length 12 km").
--   Brunni på andra sidan dalen: skiresort families. Samma dagskort:
--     shop.titlis.ch ("With this day ski pass you can ski in the TITLIS
--     and Brunni area").
--   Titlis och Jochstock: Powderhounds ("Topography of Titlis & Jochstock
--     means disjointed pistes & lifts"). Val Thorens i Les 3 Vallées:
--     mellannivå 10, 600 km (013).
--   Hotellbarerna: Ski Club GB ("This is not a real après resort ... In
--     town, a lot of the action is based in hotel bars"). St. Anton:
--     afterski 10 (ankare), Ski Club GB Après 5/5.
--   Övningsbackarna en liftresa upp: skiresort beginners ("The other
--     slopes at Titlis, Stand, and Jochpass are off-limits for
--     beginners"), Powderhounds. Sälen 46 % blå (013).
--   Liten stad, boende en buss bort, lägenhetshus vid gondolen: Ski Club
--     GB. Gratisbussen: engelberg.ch. Klostermatte vid Brunnis
--     dalstation: engelberg.ch winter/families.
--   Luzern, Zentralbahn, A2 och Stans-Süd: engelberg.ch location-arrival.

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
  'engelberg', 'Engelberg', 'Switzerland', 'Central Switzerland', null, 46.8223, 8.4044,
  10, 5,
  1003, 3020, 70,
  25, 60, 15,
  18, 23411, 40,
  67, 302, 'CHF',
  'Zürich', 100, 85, 'med bil från Zürich',
  9, 5, 6, 8,
  10, 4, 7,
  6, 7, 6,
  'Engelberg passar dig som vill åka offpist. Från Laubersgrat går Laub ner mot Gerschnialp, och från Titlis går en pistad nedfart hela vägen ner till byn. Talen avser Titlis. Brunni på andra sidan dalen är ett eget litet område utan liftförbindelse, men samma dagskort gäller där. Vill du åka blått och rött en hel vecka är Engelberg fel val. Pisterna delas av Titlis och Jochstock, och den som inte åker offpist har åkt det mesta efter ett par dagar. Val Thorens ligger i Les 3 Vallées med flera gånger så mycket pist. Vill du ha afterski är Engelberg också fel val. På kvällen håller det mesta till i hotellbarerna. Välj St. Anton. Ska du lära dig åka är Engelberg fel val. Övningsbackarna ligger en liftresa upp, och resten av Titlis är för svårt för nybörjare. I Sälen är nästan hälften av pisten blå.',
  'Engelberg är en liten stad i dalbotten, och mycket av boendet ligger en bussresa från Titlis Xpress. Gratisbussen går till dalstationerna. Vill du gå till gondolen bor du i de nya lägenhetshusen intill den. Med små barn kan du bo nära Klostermatte vid Brunnis dalstation, där nybörjarområdet ligger.',
  'Engelberg',
  'Flyg till Zürich och ta tåget till Luzern, där du byter till Zentralbahn upp till Engelberg. Kör du tar du motorvägen A2 och avfarten Stans-Süd. I byn går gratisbussen till dalstationerna.',
  false
)
on conflict (slug) do nothing;

-- ── Prishistorik ──────────────────────────────────────────────────────
--
-- Samma tabell och form som 030 och 040–042.

insert into public.lift_pass_prices
  (resort_slug, season, currency, day_price, week_price, product,
   day_source, week_source, source_url, captured_on, note)
values
('laax', '2026/2027', 'CHF', 90.00, 440.00, 'LAAX',
 'ortens egen sida', 'ortens egen sida',
 'https://shop.laax.com/en/products/ski-online', '2026-11-18',
 'Dynamiskt pris, start 27.2.2027 (sex dagar 27.2–4.3). Start 1.3.2027: 86,50 / 442,00.'),
('st-moritz', '2026/2027', 'CHF', 86.00, 454.50, 'Upper Engadin',
 'ortens egen sida', 'ortens egen sida',
 'https://booking.engadin.ch/en/ski-tickets/day-and-multi-day-ski-tickets', '2026-11-18',
 'Dynamiskt pris (Snow-Deal), start 27.2.2027 (sex dagar 27.2–4.3). Start 1.3.2027: 91,50 / 452,00. Gäller hela Oberengadin med bussar och tåg.'),
('engelberg', '2026/2027', 'CHF', 67.00, 302.00, 'Engelberg-Titlis (TITLIS/Brunni/Fürenalp)',
 'ortens egen sida', 'ortens egen sida',
 'https://shop.titlis.ch/products/skitickets', '2026-11-18',
 'Dynamiskt pris på nätet, start 27.2.2027 (sex dagar 27.2–4.3). I kassan tillkommer 5 CHF per köp.')
on conflict (resort_slug, season, product) do nothing;

commit;


-- ── Efterkontroll ─────────────────────────────────────────────────────
--
--   select slug, published, region, ski_area, total_pistes_km,
--          total_lifts, snowmaking_coverage_pct,
--          lift_pass_day_eur, lift_pass_week_eur, lift_pass_currency,
--          nearest_airport, airport_distance_km, transfer_minutes,
--          season_start_month, season_end_month
--   from resorts
--   where slug in ('laax', 'st-moritz', 'engelberg')
--   order by slug;
--
--   Förväntat: tre rader, published = false, ski_area null.
--   engelberg 70 km, 67 / 302 CHF, Zürich 100 / 85, 10–5.
--   laax 176 km, 90 / 440 CHF, Zürich 153 / 114, 11–4.
--   st-moritz 310 km, 42 liftar, 86 / 455 CHF, Zürich 214 / 175, 11–5.
--
--   select resort_slug, product, day_price, week_price
--   from lift_pass_prices
--   where resort_slug in ('laax', 'st-moritz', 'engelberg');
--   Förväntat: tre rader, 90/440, 86/454,50 och 67/302.
