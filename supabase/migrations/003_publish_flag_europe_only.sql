
-- (Raden ovan är avsiktligt tom: tappas första tecknet vid kopiering
--  spelar det då ingen roll.)
-- 003 · Publiceringsflagga — Alpkoll visar Alperna och Norden
--
-- Sajten riktar sig till en svensk publik och heter Alpkoll. Sex orter
-- utanför Europa döljs, men raderna behålls: höjder, poäng, texter och
-- bild-URL:er finns kvar och kan tas tillbaka med en rad SQL.
--
-- Efter den här migrationen visar sajten 32 orter:
--   Alperna 20 · Norden 11 · Andorra 1
--
-- Koden filtrerar på published i lib/resorts.js, vilket automatiskt
-- utesluter dem från startsidan, planeraren, sitemapen och den statiska
-- genereringen. Deras URL:er börjar svara 404.

begin;

alter table public.resorts
  add column if not exists published boolean not null default true;

comment on column public.resorts.published is
  'Visas orten på sajten? false = dold men bevarad. Alpkoll visar Alperna och Norden.';

update public.resorts
set published = false
where slug in (
  'aspen',         -- USA
  'park-city',     -- USA
  'jackson-hole',  -- USA
  'whistler',      -- Kanada
  'niseko',        -- Japan
  'queenstown'     -- Nya Zeeland
);

commit;

-- ── Kontroll ────────────────────────────────────────────────────────
-- Ska ge 32 publicerade och 6 dolda:
--   select published, count(*) from public.resorts group by published;
--
-- Ska ge exakt de sex ovan:
--   select slug, name, country from public.resorts
--   where not published order by country, slug;
--
-- Ska ge noll rader — inget i Europa får ha hamnat fel:
--   select slug, country from public.resorts
--   where not published
--     and country in ('Sweden','Norway','Finland','Austria','France',
--                     'Italy','Switzerland','Andorra','Bulgaria');

-- ── Ångra ───────────────────────────────────────────────────────────
--   update public.resorts set published = true;
