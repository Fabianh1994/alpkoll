-- 032 — Levi, hämtat 2026-11-18
--
-- Definition som i 019: vuxen, sex sammanhängande dagar, huvudsäsong,
-- referensvecka v9 2027 (27 feb–6 mar) där priset varierar.
--
-- Kör den här INNAN koden som märker Levi som 26/27 går live. Annars
-- visar sajten talet som stod i resorts förut, som aldrig hämtats ur
-- ortens prislista (se 022), under årets etikett.
--
-- ── Levi ──────────────────────────────────────────────────────────────
-- Källa: levi.fi/en/ski/levi-ski-resort-services/skipasses, rubricerad
-- "Ski pass prices on winter season 2026-2027". Ett pris hela säsongen.
--   Kassa: 1 dag 60,00   6 dagar 269,00
-- Två procent billigare på nätet, och fem procent från 1 december 2026
-- vid köp minst 14 dagar i förväg. Kassapriset lagras, som för Ruka och
-- övriga orter.

begin;

UPDATE resorts
SET lift_pass_day_eur = 60,
    lift_pass_week_eur = 269,
    lift_pass_currency = 'EUR'
WHERE slug = 'levi';

insert into public.lift_pass_prices
  (resort_slug, season, currency, day_price, week_price, product,
   day_source, week_source, source_url, captured_on, note)
values
('levi', '2026/2027', 'EUR', 60.00, 269.00, 'Levi',
 'ortens egen sida', 'ortens egen sida',
 'https://www.levi.fi/en/ski/levi-ski-resort-services/skipasses/', '2026-11-18',
 'Kassapris, samma hela säsongen. Två procent billigare på nätet, fem procent vid köp minst 14 dagar i förväg från 1 december.')
on conflict (resort_slug, season, product) do nothing;

commit;


-- ── Efterkontroll ─────────────────────────────────────────────────────
--
--   SELECT slug, lift_pass_day_eur, lift_pass_week_eur, lift_pass_currency
--   FROM resorts WHERE slug = 'levi';
--
--   Förväntat: levi 60 / 269 / EUR.
