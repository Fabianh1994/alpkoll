
-- (Raden ovan är avsiktligt tom: tappas första tecknet vid kopiering
--  spelar det då ingen roll.)
-- 004 · Verifierade siffror, omgång 1
--
-- Källa: skiresort.com, samma källa för samtliga orter så att talen går
-- att jämföra. Ortens egen marknadsföring anger ofta högre siffror —
-- Verbier uppger 90 liftar där skiresort.com räknar 68 — men blandade
-- källor gör orterna ojämförbara, och hela poängen med Alpkoll är att
-- kunna ställa dem bredvid varandra. Även poängen i planeraren vilar på
-- de här talen.
--
-- Pist, liftar och höjder avser hela det sammankopplade området. Nya
-- kolumnen ski_area namnger området så att läsaren förstår varför tre
-- orter i Les 3 Vallées visar identiska tal. Det som är specifikt för
-- byn — att Val Thorens ligger högst i Europa — hör hemma i texten,
-- inte i sifferrutan.

begin;

alter table public.resorts
  add column if not exists ski_area text;

comment on column public.resorts.ski_area is
  'Sammankopplat skidområde som pist, liftar och höjder avser. Null = orten står för sig själv.';

-- ── Les 3 Vallées ──────────────────────────────────────────────────
-- 600 km, 159 liftar, 1100–3230 m
-- Databasen hade rätt pistlängd men ortens egna liftar: 33, 58 och 67.
update public.resorts set
  ski_area = 'Les 3 Vallées',
  total_pistes_km = 600,
  total_lifts     = 159,
  altitude_base   = 1100,
  altitude_top    = 3230
where slug in ('val-thorens', 'courchevel', 'meribel');

-- ── 4 Vallées ──────────────────────────────────────────────────────
-- 412 km, 68 liftar, 1350–3330 m
-- Databasen hade 330 km och 38 liftar — den siffra som visades på
-- sidan var alltså fel med drygt 80 km.
update public.resorts set
  ski_area = '4 Vallées',
  total_pistes_km = 412,
  total_lifts     = 68,
  altitude_base   = 1350,
  altitude_top    = 3330
where slug = 'verbier';

-- ── Matterhorn Ski Paradise ────────────────────────────────────────
-- 322 km, 51 liftar, 1562–3899 m
-- Databasen hade 360 km och topp 3883 m. 3883 är stationen Matterhorn
-- Glacier Paradise; 3899 är områdets högsta punkt.
update public.resorts set
  ski_area = 'Matterhorn Ski Paradise',
  total_pistes_km = 322,
  total_lifts     = 51,
  altitude_base   = 1562,
  altitude_top    = 3899
where slug = 'zermatt';

commit;

-- ── Kontroll ────────────────────────────────────────────────────────
--   select slug, ski_area, total_pistes_km, total_lifts,
--          altitude_base, altitude_top
--   from public.resorts
--   where ski_area is not null order by ski_area, slug;

-- ── Ännu inte rättade i den här omgången ────────────────────────────
-- Åre  — skiresort.com anger andra tal än databasens 89 km / 42 liftar.
--        Behöver hämtas från ortens sida, inte från söksammanfattning.
-- Sälen — skiresort.com listar "Sälen" som region: 155 km och 155
--        liftar, inklusive Kläppen och Stöten. Databasens 107 km
--        motsvarar SkiStars fyra områden. Två olika avgränsningar, och
--        valet måste göras innan siffran ändras.
--        Säkerställt oavsett: höjden 620 m är fel — Högfjället når 924 m.
