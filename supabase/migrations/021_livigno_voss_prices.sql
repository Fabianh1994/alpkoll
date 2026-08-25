
-- 021 — Livigno och Voss, hämtade 2026-08-25

-- Två av de åtta orter som saknade verifierat 26/27-pris går att hämta nu.
-- Definition som i 019: vuxen, sexdagarskort, huvudsäsong, referensvecka
-- v9 2027 (27 feb–6 mar) där priset varierar över säsongen.


-- ── Livigno ───────────────────────────────────────────────────────────
--
-- Källa: www.livigno.eu/hubfs/tariffe_26-27.pdf, rubricerad "TARIFFE
-- SKIPASS LIVIGNO 2026/2027". Filen ligger i HubSpots filarea och länkas
-- inte från sajtens sommarsidor — både livigno.eu och skipasslivigno.com
-- stod i sommarläge när de öppnades samma dag. Att navigera sajten hade
-- alltså gett svaret "inte publicerat", vilket var fel.
--
-- Tabellen har tre band. Referensvecka v9 ligger i ALTA STAGIONE
-- (30.01.27–29.03.27), som är det som gäller:
--
--            PROMOZIONALE   STAGIONE   ALTA STAGIONE
--   1 dag        51,50        66,00        74,50
--   6 dagar     258,50       331,00       374,50
--
-- var 72 / 362 EUR (25/26 högsäsong). Kvoten är 5,03 båda åren — samma
-- produkt, +3,5 % på ett år.
--
-- OBS: kolumnerna är heltal, så 74,50 lagras som 75 och 374,50 som 375.
-- Det är samma avrundning som tog Sölden från 84,50 till 85 i 019.
UPDATE resorts
SET lift_pass_day_eur = 75,
    lift_pass_week_eur = 375,
    lift_pass_currency = 'EUR'
WHERE slug = 'livigno';


-- ── Voss ──────────────────────────────────────────────────────────────
--
-- Källa: booking.vossresort.no, produkten "6-8 dagerskort" — sex till åtta
-- sammanhängande dagar, kvällsåkning och gondol inkluderat. Priset står
-- bara i bokningskalendern, inte som tabell, så det är läst för februari
-- 2027 med samma metod som Åre, Sälen, Trysil och Hemsedal i 019.
--
-- Sexdagarskortet ligger platt på 2 990 i hela bandet 15–28 februari.
-- Dagspriset växlar med veckodag i samma period: 675 vardag, 720 helg.
-- Referensvecka v9 börjar 27 februari. 675 är vardagspriset och det som
-- lagras; 720 är helgtoppen.
--
-- var 63 / 330 EUR. Två fel på en gång: beloppet var aldrig hämtat, och
-- valutan var euro trots att Voss är norsk. 330 EUR är ungefär 3 860 NOK
-- mot verkliga 2 990 — talet var nära trettio procent för högt. Samma
-- beslut som Trysil, Hemsedal, Geilo och Myrkdalen: en norsk ort tar
-- betalt i norska kronor.
--
-- Kvoten blir 4,43, under bandet 4,5–5,5. Det är inget fel utan samma
-- mönster som Geilo 4,14, Zermatt 4,15 och Verbier 4,35 — se den rättade
-- efterkontrollen i 019.
UPDATE resorts
SET lift_pass_day_eur = 675,
    lift_pass_week_eur = 2990,
    lift_pass_currency = 'NOK'
WHERE slug = 'voss';


-- ── Efterkontroll ─────────────────────────────────────────────────────
--
-- 1. De två raderna ska stå som ovan:
--
--      SELECT slug, lift_pass_currency, lift_pass_day_eur, lift_pass_week_eur,
--             round(lift_pass_week_eur / lift_pass_day_eur, 2) AS kvot
--      FROM resorts WHERE slug IN ('livigno', 'voss');
--
--      Förväntat: livigno EUR 75 / 375 (5,00), voss NOK 675 / 2990 (4,43).
--
-- 2. Voss ska ha lämnat euro-gruppen. Icke-euro-raderna blir elva:
--
--      SELECT slug, lift_pass_currency FROM resorts
--      WHERE published AND lift_pass_currency <> 'EUR' ORDER BY slug;
--
--      Förväntat: are, geilo, hemsedal, myrkdalen, riksgransen, saas-fee,
--      salen, trysil, verbier, voss, zermatt.
--
-- 3. Antalet publicerade orter utan verifierat pris ska ha minskat med
--    två. Kvar utan hämtat 26/27-pris: st-anton, madonna-di-campiglio,
--    geilo, riksgransen, ruka, levi, chamonix (plus de fyra som 020
--    nollar). Se docs/liftkortspriser.md för skäl och datum per ort.
