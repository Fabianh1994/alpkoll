
-- 018 — pistkartor som inte finns kvar
--
-- Migration 017 följde varje orts resort_url men rörde aldrig
-- piste_map_url. Kontroll 2026-08-12 av alla trettio publicerade orters
-- kartlänkar: tre är döda.
--
-- Kartan renderas som ett eget kort på ortsidan och är den länk en
-- besökare klickar när hon vill se området innan hon bokar. En 404 där
-- kostar mer än på en vanlig länk.
--
-- Om felkontrollen: sju adresser gav fel mot ett skript. Fyra av dem —
-- Cortina (403), Madonna di Campiglio (SSL), Myrkdalen (429) och Tignes
-- (timeout) — svarar normalt i en riktig webbläsare. Skript blockeras,
-- sidor lever. Bara de tre nedan är faktiskt borta, kontrollerade både
-- med webbläsarhuvuden och i webbläsaren.


-- ── Ruka: sidan har flyttat inom samma sajt ───────────────────────────
--
-- /en/ski-resort/slopes-and-lifts ger 404. Rätt adress är
-- /en/skiresort/slopes, kontrollerad 200 med titeln
-- "Ruka slope map & opening hours".

UPDATE resorts
SET piste_map_url = 'https://www.ruka.fi/en/skiresort/slopes'
WHERE slug = 'ruka';


-- ── Riksgränsen: sidan har flyttat inom samma sajt ────────────────────
--
-- /en/skiing/slopes-and-lifts/ ger "Page not found". Sajten har ingen
-- engelsk version av sidan längre; den svenska heter
-- /skidakning-spar/pister-langdspar/ och svarar 200 med titeln
-- "Pister & Längdspår". Att länken blir svensk är ingen förlust på en
-- svensk sajt.

UPDATE resorts
SET piste_map_url = 'https://riksgransen.se/skidakning-spar/pister-langdspar/'
WHERE slug = 'riksgransen';


-- ── Verbier: ingen vinterkarta finns publicerad just nu ───────────────
--
-- Den lagrade adressen hos verbier.ch ger 404, och skidområdets egen
-- sajt verbier4vallees.ch står i sommarläge: enda kartsidan som finns är
-- interactive-map-summer, och interactive-map-winter ger 404.
--
-- Att peka på sommarkartan från en skidortssida vore fel svar på rätt
-- fråga. Fältet nollas i stället, och app/resort/[slug]/page.js faller
-- då tillbaka på resort_url — det är precis vad fallbacken finns för.
-- Ta upp den igen när vintersidan är uppe.

UPDATE resorts
SET piste_map_url = NULL
WHERE slug = 'verbier';


-- ── Efterkontroll ─────────────────────────────────────────────────────
--
--   SELECT slug, piste_map_url FROM resorts
--   WHERE slug IN ('ruka', 'riksgransen', 'verbier');
--
--   Förväntat: ruka.fi/en/skiresort/slopes,
--   riksgransen.se/skidakning-spar/pister-langdspar/, och NULL.
