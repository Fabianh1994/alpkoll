-- 037 — Myrkdalen döljs
--
-- Myrkdalens enda bild hotlänkades från skiresort.info utan licens, och
-- sedan PR #93 visas sådana bilder inte. Wikimedia Commons har ingen bild
-- på backarna; den enda vinterbilden (dimma över dalen) godkändes inte.
-- Fabian valde 2026-11-18 att dölja orten i stället för att visa den utan
-- foto.
--
-- Orter döljs, raderas aldrig: raden, poängen, priset och söksträngen i
-- lib/booking.js ligger kvar. Startsida, ortsida, jämförelsepar,
-- liftkortspriser och sitemap läser bara publicerade orter (lib/resorts.js),
-- så orten försvinner överallt på en gång. /resort/myrkdalen ger 404.
--
-- Tillbaka: samma rad med published = true, när en bild med licens finns.

update public.resorts set published = false where slug = 'myrkdalen';

-- Kontroll:
--   SELECT count(*) FROM resorts WHERE published;   -- Förväntat: 29
