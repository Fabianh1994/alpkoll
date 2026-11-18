-- 035 — rättningar efter granskning 2026-11-18
--
-- ── Saas-Fee ──────────────────────────────────────────────────────────
-- saas-fee.ch/en/winter-in-the-saas-valley/ski-pass-prices/saas-fee,
-- "Tariffs Winter 2026/27", Saas-Fee Pass (Saas-Fee & Saas-Almagell):
-- 1 dag CHF 86, 6 dagar CHF 419. Vi bar 84 / 413 sedan augusti.
-- skiresort.com anger nu 101 km för Saas-Fee (förut 100).
--
-- ── Hemavan ───────────────────────────────────────────────────────────
-- skiresort.com listar nu Hemavan med 30 km (Tärnaby 20 km). Våra 32 km
-- saknade källa; migration 013 noterar att orten inte fanns där då.

begin;

UPDATE resorts SET lift_pass_day_eur = 86, lift_pass_week_eur = 419, total_pistes_km = 101
WHERE slug = 'saas-fee';

UPDATE public.lift_pass_prices
SET day_price = 86.00, week_price = 419.00, captured_on = '2026-11-18',
    source_url = 'https://www.saas-fee.ch/en/winter-in-the-saas-valley/ski-pass-prices/saas-fee',
    note = 'Saas-Fee + Saas-Almagell. Tariffs Winter 2026/27, kontrollerat 2026-11-18.'
WHERE resort_slug = 'saas-fee' AND season = '2026/2027' AND product = 'Saas-Fee-kortet';

UPDATE resorts SET total_pistes_km = 30
WHERE slug = 'hemavan';

commit;

-- ── Efterkontroll ─────────────────────────────────────────────────────
--   SELECT slug, lift_pass_day_eur, lift_pass_week_eur, total_pistes_km
--   FROM resorts WHERE slug IN ('saas-fee', 'hemavan');
--   Förväntat: saas-fee 86 / 419 / 101, hemavan 30 km.
