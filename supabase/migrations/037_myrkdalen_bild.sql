-- 037 — Myrkdalen får en bild med licens och fotograf
--
-- Myrkdalens image_url pekade på skiresort.info, utan licens. Sedan PR #93
-- visas bilder från andra värdar inte alls (utanOlicensieradBild i
-- lib/images.js), så orten stod utan foto.
--
-- Wikimedia Commons har en vinterbild från dalen, sökt 2026-11-18:
--   File:Myrkdalen, Voss in fog (3457104092).jpg
--   AnneCN från Bergen, Flickr, 12 april 2009, CC BY 2.0.
-- CC BY kräver att fotografen namnges — krediteringen på ortsidan och
-- /bildkallor gör det, därav attribution_required = true.
--
-- Bilden visar fjällsidan i snö och dimma, inte backarna. En pressbild
-- från orten byter den när en sådan finns.

begin;

insert into public.resort_images
  (resort_slug, position, url, width, height, source, source_page,
   license, license_url, photographer, attribution_required, alt)
values
('myrkdalen', 0,
 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Myrkdalen%2C_Voss_in_fog_%283457104092%29.jpg/1920px-Myrkdalen%2C_Voss_in_fog_%283457104092%29.jpg',
 1920, 1243, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Myrkdalen,_Voss_in_fog_(3457104092).jpg',
 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0', 'AnneCN', true,
 'Snöklädd fjällsida i Myrkdalen med dimma över granskogen');

update public.resorts
set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Myrkdalen%2C_Voss_in_fog_%283457104092%29.jpg/1920px-Myrkdalen%2C_Voss_in_fog_%283457104092%29.jpg'
where slug = 'myrkdalen';

commit;

-- Kontroll — varje publicerad ort har nu en hjältebild:
--
--   SELECT r.slug FROM resorts r
--   LEFT JOIN resort_images i ON i.resort_slug = r.slug AND i.position = 0
--   WHERE r.published AND i.id IS NULL;
--
--   Förväntat: inga rader.
