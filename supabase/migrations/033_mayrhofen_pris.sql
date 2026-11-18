-- 033 — Mayrhofen, hämtat 2026-11-18
--
-- Beslut av Fabian 2026-11-18: priset följer det veckokort man faktiskt
-- köper, även när kortet gäller mer än ortens egen pist. Kortet och dess
-- kilometer står i LIFTKORT i lib/liftkortspriser.js.
--
-- Kör den här INNAN koden som ger Mayrhofen pris går live. Annars visar
-- sajten talet som stod i resorts förut, som aldrig hämtats (se 022).
--
-- ── Mayrhofen ─────────────────────────────────────────────────────────
-- Källa: mayrhofen.at/en/mountopolis/winter/ski-pass-prices-opening-hours,
-- "Skipass Zillertal 2026/27". Ett pris hela säsongen, 4.12.2026–11.4.2027.
--   Zillertal Superskipass 6 dagar 399,00 (546 km, 180 liftar, fyra områden)
--   Mayrhofen 1 dag 82,00 (ortens eget dagskort)
-- Från två dagar säljs bara Superskipass. Dagskortet är Mayrhofens eget,
-- veckokortet hela dalens — därför två produkter i tabellen nedan.

begin;

UPDATE resorts
SET lift_pass_day_eur = 82,
    lift_pass_week_eur = 399,
    lift_pass_currency = 'EUR'
WHERE slug = 'mayrhofen';

insert into public.lift_pass_prices
  (resort_slug, season, currency, day_price, week_price, product,
   day_source, week_source, source_url, captured_on, note)
values
('mayrhofen', '2026/2027', 'EUR', null, 399.00, 'Zillertal Superskipass',
 null, 'ortens egen sida',
 'https://www.mayrhofen.at/en/mountopolis/winter/ski-pass-prices-opening-hours', '2026-11-18',
 'Gäller hela Zillertal, 546 km. Säljs från två dagar; ett pris hela säsongen.'),
('mayrhofen', '2026/2027', 'EUR', 82.00, null, 'Mayrhofen',
 'ortens egen sida', null,
 'https://www.mayrhofen.at/en/mountopolis/winter/ski-pass-prices-opening-hours', '2026-11-18',
 'Dagskort för Mayrhofen ensamt, köpt på nätet från 08.00.')
on conflict (resort_slug, season, product) do nothing;

commit;


-- ── Efterkontroll ─────────────────────────────────────────────────────
--
--   SELECT slug, lift_pass_day_eur, lift_pass_week_eur FROM resorts
--   WHERE slug = 'mayrhofen';
--
--   Förväntat: mayrhofen 82 / 399.
