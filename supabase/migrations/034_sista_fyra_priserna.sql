-- 034 — Chamonix, Grandvalira, Cortina och Hemavan, hämtade 2026-11-18
--
-- De fyra sista orterna utan pris. Tre av dem sätter priset efter datum
-- och visar det bara i sin bokning; priserna lästes där för en vuxen med
-- start i referensveckan v9 2027. Inget köptes.
--
-- Kör den här INNAN koden som ger orterna pris går live.
--
-- ── Chamonix ──────────────────────────────────────────────────────────
-- Källa: Compagnie du Mont-Blanc, "SKI RATES WINTER 2026-2027", hög
-- säsong 19.12.2026–9.4.2027. Chamonix Le Pass, "All Chamonix ski areas",
-- utan Les Houches: 1 dag 76,50 €, 6 dagar 373,00 €.
-- (Mont-Blanc Unlimited, som även tar Les Houches: 104 / 499 €.)
--
-- ── Grandvalira ───────────────────────────────────────────────────────
-- Källa: assistant.grandvalira.com, vuxen 28.2–5.3.2027: 396,00 € i kassan
-- (370,20 € på nätet). Flerdagarskortet gäller även Pal Arinsal och Ordino
-- Arcalís. Dagspriset lästes inte och lämnas tomt.
--
-- ── Cortina d'Ampezzo ─────────────────────────────────────────────────
-- Källa: dolomitisuperski.com, ortskortet Cortina d'Ampezzo, vuxen
-- 1–6.3.2027: 421 € (400 € på nätet). Dagskort i högsäsong 84 €.
--
-- ── Hemavan ───────────────────────────────────────────────────────────
-- Källa: quickbook.hemavan.nu, "Köp liftkort för säsongen 26/27".
-- LIFTKORT – 6–8 DAGAR (åtta dagar för sexdagarspris, Hemavan och Tärnaby),
-- vuxen, start 27.2.2027: 2 955 kr i kassan (2 807 kr med förbokning).
-- LIFTKORT – 1 DAG samma vecka: 665 kr.

begin;

UPDATE resorts SET lift_pass_day_eur = 76.50, lift_pass_week_eur = 373, lift_pass_currency = 'EUR'
WHERE slug = 'chamonix';

UPDATE resorts SET lift_pass_day_eur = null, lift_pass_week_eur = 396, lift_pass_currency = 'EUR'
WHERE slug = 'grandvalira';

UPDATE resorts SET lift_pass_day_eur = 84, lift_pass_week_eur = 421, lift_pass_currency = 'EUR'
WHERE slug = 'cortina-d-ampezzo';

UPDATE resorts SET lift_pass_day_eur = 665, lift_pass_week_eur = 2955, lift_pass_currency = 'SEK'
WHERE slug = 'hemavan';

insert into public.lift_pass_prices
  (resort_slug, season, currency, day_price, week_price, product,
   day_source, week_source, source_url, captured_on, note)
values
('chamonix', '2026/2027', 'EUR', 76.50, 373.00, 'Chamonix Le Pass',
 'ortens egen sida', 'ortens egen sida',
 'https://www.compagniedumontblanc.fr/Marketing/tarifs/hiver/Tarifs_A_MBU-CLP_haute_saison_UK.pdf', '2026-11-18',
 'Hög säsong 19.12.2026–9.4.2027. Gäller dalens områden utom Les Houches.'),
('grandvalira', '2026/2027', 'EUR', null, 396.00, 'Grandvalira',
 null, 'ortens egen sida',
 'https://assistant.grandvalira.com', '2026-11-18',
 'Pris i kassan för 28.2–5.3.2027, 370,20 € på nätet. Dynamiskt pris. Gäller även Pal Arinsal och Ordino Arcalís.'),
('cortina-d-ampezzo', '2026/2027', 'EUR', 84.00, 421.00, 'Cortina d''Ampezzo',
 'ortens egen sida', 'ortens egen sida',
 'https://www.dolomitisuperski.com', '2026-11-18',
 'Ortskortet för 1–6.3.2027, 400 € på nätet. Dynamiskt pris.'),
('hemavan', '2026/2027', 'SEK', 665.00, 2955.00, 'Liftkort 6–8 dagar',
 'ortens egen sida', 'ortens egen sida',
 'https://quickbook.hemavan.nu', '2026-11-18',
 'Start 27.2.2027, pris i kassan; 2 807 kr med förbokning. Åtta dagar för sexdagarspris, Hemavan och Tärnaby.')
on conflict (resort_slug, season, product) do nothing;

commit;


-- ── Efterkontroll ─────────────────────────────────────────────────────
--
--   SELECT slug, lift_pass_day_eur, lift_pass_week_eur, lift_pass_currency
--   FROM resorts
--   WHERE slug IN ('chamonix', 'grandvalira', 'cortina-d-ampezzo', 'hemavan');
--
--   Förväntat: chamonix 76.5/373 EUR, grandvalira –/396 EUR,
--   cortina-d-ampezzo 84/421 EUR, hemavan 665/2955 SEK.
