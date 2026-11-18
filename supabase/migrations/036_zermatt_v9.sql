-- 036 — Zermatts pris för vecka 9 (start lördag 27 februari 2027)
--
-- matterhornparadise.ch/en/information/tickets-prices/price-calculator,
-- läst 2026-11-18: Skiing, 1- & multi-day passes, Adult.
--   1 dag 27/2:          Zermatt CHF 104, International (Zermatt–Cervinia) CHF 122
--   6 dagar 27/2–4/3:    Zermatt CHF 510, International CHF 574
-- Vi bar 104 / 432, som var dagspriset för Zermatt ensamt och det lägsta
-- dynamiska sexdagarspriset ("from CHF 432"). Kortet som ger våra 322 km är
-- det internationella. Priset är dynamiskt och kan ändras före säsongen.

begin;

UPDATE resorts SET lift_pass_day_eur = 122, lift_pass_week_eur = 574
WHERE slug = 'zermatt';

UPDATE public.lift_pass_prices
SET day_price = 122.00, week_price = 574.00, captured_on = '2026-11-18',
    source_url = 'https://www.matterhornparadise.ch/en/information/tickets-prices/price-calculator',
    note = 'Internationellt kort Zermatt–Cervinia, start 27 februari 2027 i priskalkylatorn. Dynamiskt pris. Zermatt ensamt: 104 / 510.'
WHERE resort_slug = 'zermatt' AND season = '2026/2027';

commit;
