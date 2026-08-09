
-- (Raden ovan är avsiktligt tom: tappas första tecknet vid kopiering
--  spelar det då ingen roll.)
-- 012 · Saknade apostrofer i två ortnamn
--
-- "Alpe d Huez" och "Cortina d Ampezzo" saknar apostrof. Namnet går in i
-- sidtiteln, rubriken, kortet på startsidan och den strukturerade datan
-- — alltså även i det Google visar i sökresultatet.
--
-- Sluggen rörs INTE. Den sitter i URL:en och i sitemapen, och en ändring
-- skulle göra de indexerade adresserna till 404.

begin;

update public.resorts set name = 'Alpe d''Huez'      where slug = 'alpe-d-huez';
update public.resorts set name = 'Cortina d''Ampezzo' where slug = 'cortina-d-ampezzo';

commit;

-- ── Kontroll ────────────────────────────────────────────────────────
-- Ska ge noll rader:
--   select slug, name from public.resorts where name ~ ' (d|l) ';
--
-- Sluggarna ska vara oförändrade:
--   select slug, name from public.resorts
--   where slug in ('alpe-d-huez','cortina-d-ampezzo');
