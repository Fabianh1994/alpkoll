
-- 017 — utgående länkar som inte går dit de säger
--
-- Kontroll 2026-08-12: samtliga trettio publicerade orters resort_url
-- hämtades och följdes. En ort är trasig, två har flyttat.
--
-- Länkarna renderas på ortsidan som vägen vidare till orten själv. En död
-- länk är värre än ingen länk, eftersom besökaren hinner lämna sajten
-- innan hon upptäcker att den inte leder någonstans.


-- ── Hemavan: båda länkarna är döda ────────────────────────────────────
--
-- hemavan.se svarar 200, vilket är varför felet överlevt så länge, men
-- vidarebefordrar till en samtyckessida hos Google — domänen är parkerad
-- och söker på ordet "hemavan". Den som klickar hamnar i en Google-ruta,
-- inte hos orten.
--
-- Riktig domän är hemavan.nu. Kontrollerat 2026-08-12: startsidan svarar
-- 200 med titeln "Sommar i riktiga fjäll - Hemavan Tärnaby", och
-- /pistkartor/ svarar 200 med titeln "Pistkarta - Hemavan".

UPDATE resorts
SET resort_url = 'https://hemavan.nu',
    piste_map_url = 'https://hemavan.nu/pistkartor/'
WHERE slug = 'hemavan';


-- ── Geilo och Zermatt: har bytt domän ─────────────────────────────────
--
-- Båda fungerar än, via permanent vidarebefordran, så det här är ingen
-- brådska — men den lagrade adressen ska vara den orten själv använder,
-- inte den hon lämnade. En vidarebefordran är ett löfte någon annan kan
-- dra tillbaka.
--
--   geilo.no  -> geilo.com
--   zermatt.ch -> zermatt.swiss

UPDATE resorts SET resort_url = 'https://www.geilo.com'     WHERE slug = 'geilo';
UPDATE resorts SET resort_url = 'https://www.zermatt.swiss' WHERE slug = 'zermatt';


-- ── Vad kontrollen INTE fann ──────────────────────────────────────────
--
-- Fyra orter gav fel som ser ut som döda länkar men inte är det, och de
-- står här så att nästa kontroll slipper göra om arbetet:
--
--   les-arcs och val-thorens svarar 403 på ett skript utan webbläsar-
--   huvuden. Sidorna fungerar i en riktig webbläsare.
--
--   madonna-di-campiglio och myrkdalen gav timeout respektive 429.
--   Övergående.
--
--   cortina-d-ampezzo gav SSL-fel från två olika klienter, men
--   dolomiti.org vidarebefordrar själv till cortina.dolomiti.org, så
--   värden serverar. Lämnad orörd tills någon kan visa att den är död.


-- ── Efterkontroll ─────────────────────────────────────────────────────
--
--   SELECT slug, resort_url, piste_map_url FROM resorts
--   WHERE slug IN ('hemavan', 'geilo', 'zermatt');
--
--   Förväntat: hemavan.nu, hemavan.nu/pistkartor/, geilo.com,
--   zermatt.swiss.
