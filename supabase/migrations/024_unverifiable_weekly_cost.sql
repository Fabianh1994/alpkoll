
-- 024 — est_weekly_cost_eur nollas: talet var aldrig hämtat någonstans ifrån
--
-- Kolumnen bar "vad en vecka kostar per person, resa och boende inräknat"
-- för samtliga trettio publicerade orter, och talet visades på sex ytor:
-- ortsidan, korten under Liknande orter, väljaren på /jamfor, raden
-- "Vecka totalt" på varje parsida, alpsidornas "Veckan totalt", och i
-- meta-beskrivningen för 83 jämförelsesidor — alltså i Googles
-- sökresultat.
--
-- Fem belägg för att talet var gissat, mätt 2026-09-08:
--
--   1. Alla trettio värdena är delbara med 50, tjugo av dem med 100. En
--      summa av flyg, boende, liftkort och mat landar inte på jämna
--      femtiotal trettio gånger av trettio.
--
--   2. Trettio orter delar på sexton värden. Fyra orter står på exakt
--      1 550, fyra på 1 600, tre på 1 400, tre på 1 700.
--
--   3. Talet följer inte liftkortspriset, den enda kostnadsdel vi känner.
--      Åre (liftkort ~330 €) och Ischgl (451 €) har båda 1 600.
--      Riksgränsen (~225 €) har 1 700 — mer än Ischgl, vars kort kostar
--      dubbelt.
--
--   4. Fyra orter bär en veckokostnad utan att ha något känt
--      liftkortspris alls: grandvalira 900, hemavan 1 300, mayrhofen
--      1 300, cortina-d-ampezzo 1 550. Talet kan alltså inte vara räknat
--      ur en prisuppgift.
--
--   5. Kolumnen sätts aldrig i någon migration. Den kom med den
--      ursprungliga databasen och har aldrig genomgått den källkontroll
--      som 004, 013, 019, 020 och 021 gav de andra sifferfälten.
--      Migration 019 instruerade uttryckligen att lämna den orörd.
--
-- Samma hållning som migration 020, som nollade fyra veckopriser hellre
-- än att låta dem stå: ett tal vi inte kan belägga är sämre än inget tal.
--
-- Kolumnen droppas inte. Att nolla den bevarar möjligheten att fylla den
-- med hämtade tal om orten någon gång publicerar en paketpris-lista, och
-- följer samma linje som "orter döljs, raderas aldrig". Koden läser inte
-- fältet sedan 2026-09-08 oavsett vad som står här.

BEGIN;

UPDATE resorts
SET est_weekly_cost_eur = NULL
WHERE est_weekly_cost_eur IS NOT NULL;

COMMENT ON COLUMN resorts.est_weekly_cost_eur IS
  'ANVÄNDS INTE. Nollad i migration 024 (2026-09-08) — de tidigare talen '
  'var aldrig hämtade ur någon källa. Fyll bara med belopp som går att '
  'belägga mot en publicerad prislista, och läs skälen i migration 024 '
  'innan fältet tas i bruk igen.';

COMMIT;

-- Efterkontroll. Ska ge noll rader:
--
--   SELECT slug, est_weekly_cost_eur
--   FROM resorts
--   WHERE est_weekly_cost_eur IS NOT NULL;
--
-- Signaturen som avslöjade fältet, för den som vill se den innan körning
-- (kör före UPDATE ovan) — ska ge 30 av 30 före, noll efter:
--
--   SELECT count(*) FROM resorts
--   WHERE published AND est_weekly_cost_eur % 50 = 0;
