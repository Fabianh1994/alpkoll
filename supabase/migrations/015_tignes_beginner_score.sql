
-- 015 — Tignes nybörjarpoäng, missad i 014
--
-- Migration 014 rättade de orter vars nybörjarpoäng stred mot en blå
-- andel över hälften och listade Hemsedal (67 %), Voss (55 %) och Sölden
-- (52 %). Tignes har 55 % blå pist och stod kvar på 5. Den föll bort när
-- 014 skrevs; efterkontrollen i samma fil fångade den direkt när den
-- kördes 2026-08-12.
--
-- Värdet är 7, samma som Voss fick vid identisk blå andel. Att ge samma
-- terräng olika poäng beroende på vilken migration som råkade ta orten
-- vore precis den godtycklighet skalan finns för att bli av med.
--
-- Att Tignes är känt för brant åkning motsäger inte saken: orten har
-- 20 % svart pist OCH 55 % blå, och behåller sin nia för offpist och åtta
-- för avancerad nivå. Ett stort område kan vara bra för flera nivåer
-- samtidigt — det är därför skalorna är skilda åt.

UPDATE resorts SET beginner_score = 7 WHERE slug = 'tignes';


-- ── Efterkontroll ─────────────────────────────────────────────────────
--
-- Samma som i 014, som nu ska gå igenom utan träffar:
--
--   SELECT slug, blue_percent, beginner_score FROM resorts
--   WHERE published AND blue_percent >= 50 AND beginner_score < 6;
--
--   Förväntat: noll rader.


-- ── Vad den bredare genomgången 2026-08-12 INTE fann ──────────────────
--
-- Hela materialet gicks igenom mot tre motsägelser. Utöver Tignes fanns
-- ingenting att rätta, och det är värt att skriva ner varför de träffar
-- som såg ut som fel inte är det:
--
--   Zermatt har 8 % svart pist men 10 för avancerad nivå. Poängen vilar
--   på offpist och på den italienska sidan, inte på andelen svart pist,
--   och skalan skiljer medvetet pistad svår åkning från offpist.
--
--   Myrkdalen, Ruka, Riksgränsen, Levi och Hemavan har låga toppar men
--   hög snösäkerhet. Det är inte en motsägelse utan latitud: kylan gör
--   snön pålitlig på en höjd som hade varit hopplös i Alperna. Kontrollen
--   som flaggade dem är alpcentrerad, inte de här orterna.
--
--   Chamonix toppar på 3 842 m men har 7 för snösäkerhet. Åkningen ligger
--   till stor del lågt i dalen och höghöjdsdelen är begränsad. Rimligt.
