
-- 014 — poäng som motsäger fält vi redan verifierat
--
-- Jämförelsesidorna visar "Vem orten passar" byggt på beginner_score,
-- intermediate_score, expert_score och family_friendly_score. Granskningen
-- 2026-08-10 visade att mittfältet på de skalorna satt på autopilot, och
-- docs/poangskala.md säger att de befintliga orterna ännu inte är omsatta
-- enligt skalan.
--
-- Den här migrationen gör inte den omsättningen. Att sätta 120 nya
-- redaktionella omdömen utan källa vore samma arbetssätt som gav oss
-- mittfältet vi städar bort. Här rättas bara det som går att belägga:
--
--   A. poäng som strider mot ankarna i docs/poangskala.md
--   B. poäng som strider mot blue_percent, rättad mot källan i 013
--   C. poäng som skiljer sig mellan orter i samma sammankopplade område,
--      trots att skalan säger att de avser området
--
-- Allt annat lämnas. Ett halvrättat mittfält är sämre än ett orättat: en
-- omsorgsfullt satt sjua bredvid en slentriansjua får läsaren att tro att
-- hon jämför två bedömningar.


-- ── A. Ankare som dokumentet redan pekat ut ───────────────────────────
--
-- docs/poangskala.md listar dessa under "Att göra" som kända rättelser.
-- Sälen är sajtens tydligaste nybörjarort och ankaret för både skalorna,
-- men stod på 8 respektive 9 och delade därmed plats med Courchevel.

UPDATE resorts SET beginner_score = 10, family_friendly_score = 10
WHERE slug = 'salen';


-- ── B. Poäng som motsäger blue_percent ────────────────────────────────
--
-- Skalans regel: nybörjarpoängen ska inte motsäga blue_percent. Sedan
-- migration 013 rättade pistfördelningen står tre orter i strid med sin
-- egen terräng.
--
-- Hemsedal har 67 % blå pist, den högsta andelen av alla 30 publicerade
-- orter, och stod ändå på 5 — under snittet.

UPDATE resorts SET beginner_score = 9 WHERE slug = 'hemsedal';

-- Voss: 55 % blå, stod på 5.

UPDATE resorts SET beginner_score = 7 WHERE slug = 'voss';

-- Sölden: 52 % blå, stod på 5 — lägre än Ischgl, som har 21 % blå.

UPDATE resorts SET beginner_score = 6 WHERE slug = 'solden';


-- ── C. Samma område, samma poäng ──────────────────────────────────────
--
-- Skalan säger att poängen avser hela det sammankopplade området, utom
-- bykänsla och afterski som handlar om byn. Courchevel, Méribel och Val
-- Thorens delar Les 3 Vallées och visar identiska 600 km pist, men bar
-- tre olika omdömen om samma backar:
--
--   nybörjare    8 / 6 / 7
--   mellannivå  10 / 9 / 10
--   avancerad    7 / 8 / 8
--
-- På en jämförelsesida blir det ett påstående om att Méribel har sämre
-- nybörjaråkning än Courchevel, fast det är samma pister. Värdena nedan
-- är de som redan står i dokumentet som ankare, och 56 % blå pist bär
-- åttan för nybörjare.
--
-- family_friendly_score lämnas orörd med flit. Skalan beskriver den med
-- ord som handlar om byn — om man kan bo nära backen, om orten är byggd
-- för barn — men undantaget i dokumentet räknar bara upp bykänsla och
-- afterski. Vilken läsning som gäller är ett beslut, inte något den här
-- migrationen ska avgöra i förbifarten.

UPDATE resorts SET beginner_score = 8, intermediate_score = 10, expert_score = 8
WHERE slug IN ('courchevel', 'meribel', 'val-thorens');


-- ── Efterkontroll ─────────────────────────────────────────────────────
--
-- 1. Ingen ort med minst hälften blå pist under 6 för nybörjare:
--
--    SELECT slug, blue_percent, beginner_score FROM resorts
--    WHERE published AND blue_percent >= 50 AND beginner_score < 6;
--
--    Förväntat: noll rader.
--
-- 2. Orter i samma område bär samma områdespoäng:
--
--    SELECT ski_area, count(DISTINCT beginner_score),
--           count(DISTINCT intermediate_score), count(DISTINCT expert_score)
--    FROM resorts WHERE published AND ski_area IS NOT NULL
--    GROUP BY ski_area HAVING count(*) > 1;
--
--    Förväntat: Les 3 Vallées med 1, 1, 1.
--
-- 3. Sälen ensam tia på båda skalorna:
--
--    SELECT slug FROM resorts
--    WHERE published AND (beginner_score = 10 OR family_friendly_score = 10);
--
--    Förväntat: enbart salen.
