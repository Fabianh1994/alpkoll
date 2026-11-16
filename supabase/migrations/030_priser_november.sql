-- 030 — St. Anton, Madonna di Campiglio och Ruka, hämtade 2026-11-16
--
-- Tre orter har publicerat vinterns priser sedan augusti. Definition som
-- i 019: vuxen, sex sammanhängande dagar, huvudsäsong, referensvecka v9
-- 2027 (27 feb–6 mar) där priset varierar över säsongen.
--
-- Kör den här INNAN koden som märker orterna som 26/27 går live. Annars
-- visar sajten förra årets tal under årets etikett, och för Ruka ett tal
-- som aldrig hämtats ur ortens prislista.
--
--
-- ── St. Anton ─────────────────────────────────────────────────────────
-- Källa: skiarlberg.at/en/Ski-Arlberg/Ski-tickets/Skipass-prices.
-- "Peak season" 19.12.2026–2.4.2027, där v9 ligger:
--   1 dag 85,00   6 dagar 468,00
-- Lågsäsong ("Wedel & sun ski weeks") 80,50 / 395,00.
-- var 450 EUR för sex dagar (25/26), alltså +4,0 %.
-- OBS: sidan säger "Subject to change; Provisional Status as of August
-- 2026". Noten på sajten säger samma sak. Ta om i december.
--
-- ── Madonna di Campiglio ──────────────────────────────────────────────
-- Källa: campigliodolomiti.it/en/skiarea/inverno/skipass/skipass-skiarea,
-- rubricerad "Ski pass Skiarea winter 2026/27". Högsäsong
-- 20.12.2026–14.3.2027 för sexdagarskortet, där v9 ligger:
--   1 dag 87   6 dagar 435
-- var 85 / 424 EUR (25/26), alltså +2,6 % på sex dagar.
-- Dagskortet har ett tredje band på 89 för jul, nyår och 7–20 februari;
-- v9 ligger utanför det. Om söndagstillägget från 25/26 finns kvar gick
-- inte att se på sidan.
--
-- ── Ruka ──────────────────────────────────────────────────────────────
-- Källa: ruka.fi/en/skipasses. "Prices valid for tickets purchased at
-- on-site sales points from October 2, 2026, to May 2, 2027."
--   1 dag 58   6 dagar 265
-- Ett pris hela säsongen. Flerdagarskort måste användas dagar i följd.
-- På nätet fem procent billigare från 1 december; kassapriset lagras,
-- som för övriga orter. Talen som stod i resorts förut var aldrig hämtade
-- ur ortens prislista, se 022.

begin;

UPDATE resorts
SET lift_pass_day_eur = 85,
    lift_pass_week_eur = 468,
    lift_pass_currency = 'EUR'
WHERE slug = 'st-anton';

UPDATE resorts
SET lift_pass_day_eur = 87,
    lift_pass_week_eur = 435,
    lift_pass_currency = 'EUR'
WHERE slug = 'madonna-di-campiglio';

UPDATE resorts
SET lift_pass_day_eur = 58,
    lift_pass_week_eur = 265,
    lift_pass_currency = 'EUR'
WHERE slug = 'ruka';

insert into public.lift_pass_prices
  (resort_slug, season, currency, day_price, week_price, product,
   day_source, week_source, source_url, captured_on, note)
values
('st-anton', '2026/2027', 'EUR', 85.00, 468.00, 'Ski Arlberg',
 'ortens egen sida', 'ortens egen sida',
 'https://www.skiarlberg.at/en/Ski-Arlberg/Ski-tickets/Skipass-prices', '2026-11-16',
 'Peak season 19.12.26–2.4.27. Lågsäsong 80,50 / 395. Orten kallar priserna preliminära, läget augusti 2026.'),

('madonna-di-campiglio', '2026/2027', 'EUR', 87.00, 435.00, 'SkiArea Campiglio Dolomiti di Brenta',
 'ortens egen sida', 'ortens egen sida',
 'https://www.campigliodolomiti.it/en/skiarea/inverno/skipass/skipass-skiarea', '2026-11-16',
 'Högsäsong 20.12.26–14.3.27. Lågsäsong 75 / 376. Dagskort 89 under jul, nyår och 7–20 februari.'),

('ruka', '2026/2027', 'EUR', 58.00, 265.00, 'Ruka',
 'ortens egen sida', 'ortens egen sida',
 'https://ruka.fi/en/skipasses', '2026-11-16',
 'Kassapris, samma hela säsongen. Fem procent billigare på nätet från 1 december.')
on conflict (resort_slug, season, product) do nothing;

commit;


-- ── Efterkontroll ─────────────────────────────────────────────────────
--
--   SELECT slug, lift_pass_day_eur, lift_pass_week_eur FROM resorts
--   WHERE slug IN ('st-anton', 'madonna-di-campiglio', 'ruka') ORDER BY slug;
--
--   Förväntat: madonna-di-campiglio 87 / 435, ruka 58 / 265, st-anton 85 / 468.
