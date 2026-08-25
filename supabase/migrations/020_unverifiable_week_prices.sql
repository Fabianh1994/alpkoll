
-- 020 — veckopriser vi inte kan belägga tas bort

-- Fyra publicerade orter visar ett sexdagarspris som inte kan stämma.
-- Kvoten vecka/dag, uppmätt mot databasen 2026-08-25:
--
--   grandvalira        2,52   (69 / 174 EUR)
--   cortina-d-ampezzo  2,80   (80 / 224 EUR)
--   mayrhofen          2,90   (82 / 238 EUR)
--   hemavan            7,00   (35 / 245 EUR)
--
-- Ett sexdagarskort ligger på 4,5–5,5 gånger dagspriset. Det finns inget
-- veckokort någonstans som kostar 2,5 dagsbiljetter, och inget som kostar
-- sju. Talen är de ursprungliga: lift_pass_week_eur har aldrig rörts av
-- någon migration, medan 013 rättade dagspriserna kraftigt uppåt. Kvoten
-- kollapsade då, och 019 rättade tjugotvå av de trettio orterna. Det här
-- är de fyra som blev kvar.
--
-- Att de står kvar är inte längre en detalj. Sedan PR #13 och #14 arbetar
-- sajten aktivt för att Google ska hämta ortsidorna oftare. Lyckas det blir
-- följden att fler människor ser just de här fyra talen.


-- ── Varför de nollas i stället för att rättas ─────────────────────────
--
-- Kontrollerat 2026-08-25, två veckor efter att 019 skrevs. Ingen av de
-- fyra går att hämta ännu, och skälen är inte desamma:
--
--   hemavan     quickbook.hemavan.nu står på säsongen 26/27 men säljer bara
--               säsongspass. Sidans egen text säger fortfarande "Övriga
--               liftkort för vintern släpps under juni". Oförändrat.
--
--   mayrhofen   mayrhofner-bergbahnen.com står i sommarläge, titeln lyder
--               "Experience Summer". Oförändrat sedan 12 augusti.
--
--   cortina     Dolomiti Superskis e-butik säljer enbart "Dolomiti
--               Supersummer". Ingen vinterprodukt för 26/27 är i
--               försäljning.
--
--   grandvalira är inte blockerad av tid utan av område, och det ändras
--               inte av att vänta. Flerdagarskortet gäller Grandvalira plus
--               Ordino Arcalís plus Pal Arinsal — 308 km mot våra 215.
--               Dagsbiljetten avser Grandvalira ensamt. Att hämta hem
--               regionkortets pris och lägga det bredvid ett pisttal för
--               ortens egen sektor vore precis det fel Saalbach och Bad
--               Gastein redan underkänts på.
--
-- Delrättning är sämre än ingen rättning, och ett tal vi vet är fel är
-- sämre än inget tal. Migration 018 gjorde samma val med Verbiers
-- pistkarta: fältet nollades hellre än att peka på en sommarkarta.
--
-- Koden är byggd för det här. pris() i lib/pris.js returnerar null för ett
-- belopp som saknas, ordna() i lib/jamfor.js hoppar över meningen, och
-- varje renderingsställe har '—' som fallback. Kontrollerat före
-- migrationen, inte antaget: ortsidan rad 294, 573 och 684, tabellcellen
-- via Falt på parsidan, och beskrivningen i generateMetadata.


-- ── De gamla värdena bevaras här med flit ─────────────────────────────
--
-- Samma skäl som i 019: Alpkoll ska publicera en årlig artikel om hur
-- mycket varje ort höjde priset mot året innan, och en UPDATE som skriver
-- över utan att lämna spår raderar underlaget. Talen nedan är dessutom det
-- enda som finns kvar av dem när kolumnen väl är tom.

-- var 174 EUR
UPDATE resorts SET lift_pass_week_eur = NULL WHERE slug = 'grandvalira';

-- var 224 EUR
UPDATE resorts SET lift_pass_week_eur = NULL WHERE slug = 'cortina-d-ampezzo';

-- var 238 EUR
UPDATE resorts SET lift_pass_week_eur = NULL WHERE slug = 'mayrhofen';

-- var 245 EUR. OBS att dagspriset 35 står som EUR trots att Hemavan tar
-- betalt i kronor — orten ligger i 019:s ohämtade hög, så valutan är inte
-- fastställd. Den raden rättas när priset går att hämta, inte här.
UPDATE resorts SET lift_pass_week_eur = NULL WHERE slug = 'hemavan';


-- ── Efterkontroll ─────────────────────────────────────────────────────
--
-- 1. Exakt fyra publicerade orter ska sakna veckopris, och det ska vara
--    de fyra ovan:
--
--      SELECT slug FROM resorts
--      WHERE published AND lift_pass_week_eur IS NULL ORDER BY slug;
--
--      Förväntat: cortina-d-ampezzo, grandvalira, hemavan, mayrhofen.
--
-- 2. Ingen kvarvarande kvot får ligga under 3,9. Myrkdalens 3,97 är den
--    lägsta som ska finnas kvar, och den är dokumenterad i 019 — orten
--    kapar priset så att 6, 7 och 8 dagar alla kostar 2 620.
--
--      SELECT slug, round(lift_pass_week_eur / lift_pass_day_eur, 2) AS kvot
--      FROM resorts
--      WHERE published AND lift_pass_week_eur IS NOT NULL
--      ORDER BY kvot LIMIT 5;
--
--      Förväntat lägst: myrkdalen 3,97, geilo 4,14, zermatt 4,15,
--      verbier 4,35, chamonix 4,75.
--
-- 3. Dagspriserna är orörda — 019 rättade dem och den här migrationen
--    rör bara veckokolumnen:
--
--      SELECT count(*) FROM resorts WHERE published AND lift_pass_day_eur IS NULL;
--
--      Förväntat: 0.
