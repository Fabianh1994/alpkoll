
-- 016 — valutan för liftkortspriset
--
-- Koden läser redan resorts.lift_pass_currency på sju ställen, med
-- `|| 'EUR'` som fallback, men kolumnen har aldrig funnits. Den här
-- migrationen skapar den. Ingenting i vad sidorna visar ändras av att
-- köra den: alla rader sätts till 'EUR', vilket är exakt vad fallbacken
-- redan gör.
--
-- Varför kolumnen behövs: liftkortspriserna hämtas om från ortens egen
-- sida, och de nordiska orterna och de schweiziska tar inte betalt i
-- euro. Zermatt kostar 432 CHF och Åre 3 744 kr. Att räkna om dem till
-- euro innan de lagras vore att skriva in en växelkurs i databasen — ett
-- tal som var sant den dagen och sedan tyst åldras, precis den fälla
-- lift_pass_week_eur redan gått i. Beloppet lagras därför i den valuta
-- orten fakturerar i, och lib/valuta.js räknar om mot ECB vid visning.


ALTER TABLE resorts
  ADD COLUMN IF NOT EXISTS lift_pass_currency text;


-- Bara de fyra valutor lib/valuta.js kan räkna om. En femte valuta ska
-- stoppas här och inte upptäckas som ett saknat pris på en ortsida:
-- kronor(...) returnerar null för en kurs den inte har, och sidan visar
-- då ett streck utan att någon får veta varför.
ALTER TABLE resorts
  DROP CONSTRAINT IF EXISTS resorts_lift_pass_currency_check;

ALTER TABLE resorts
  ADD CONSTRAINT resorts_lift_pass_currency_check
  CHECK (lift_pass_currency IS NULL OR lift_pass_currency IN ('EUR', 'SEK', 'NOK', 'CHF'));


-- Alla befintliga belopp ÄR euro. Att skriva ut det i stället för att
-- låta kolumnen stå tom är poängen med hela övningen: fältet ska säga
-- vilken valuta talet bredvid är i, inte lämnas åt en fallback i koden.
UPDATE resorts SET lift_pass_currency = 'EUR' WHERE lift_pass_currency IS NULL;


COMMENT ON COLUMN resorts.lift_pass_currency IS
  'Valutan för lift_pass_day_eur och lift_pass_week_eur. Gäller INTE '
  'est_weekly_cost_eur, som alltid är euro. Ändras alltid i samma UPDATE '
  'som beloppet.';


-- ── Regeln som gör kolumnen ofarlig ───────────────────────────────────
--
-- Valutan och beloppet ändras i SAMMA UPDATE, aldrig var för sig:
--
--   UPDATE resorts SET lift_pass_day_eur = 104,
--                      lift_pass_week_eur = 432,
--                      lift_pass_currency = 'CHF'
--   WHERE slug = 'zermatt';
--
-- Sätts valutan först står 104 euro kvar och renderas som 104 CHF —
-- ett pris som är tolv procent fel och ser fullt rimligt ut. Sätts
-- beloppet först renderas 432 CHF som 432 euro, tjugo procent fel åt
-- andra hållet. Båda felen är osynliga för den som inte känner orten.
--
-- Samma skäl som migration 013 samlade alla orter i en fil: ett halvvägs
-- rättat fält är sämre än ett orättat, eftersom ingen kan se vilket
-- tillstånd en enskild rad är i.


-- ── Vad kolumnen INTE gäller ──────────────────────────────────────────
--
-- est_weekly_cost_eur är euro för alla orter och styrs inte härifrån.
-- Fältet är en uppskattning av vad en svensk vecka kostar — resa, boende
-- och liftkort tillsammans — researchad i euro och dokumenterad så i
-- lib/pris.js. Koden läser den med en egen konstant, VALUTA_VECKOKOSTNAD.
--
-- Kopplingen fanns i koden fram till att den här migrationen skrevs, och
-- hade slagit till första gången en ort fick 'SEK': Åres 1 600 € hade
-- renderats som "1 600 kr" på ortsidan, i väljaren, i jämförelsetabellen
-- och i sidans meta-description — en elftedel av beloppet, utan att en
-- enda rad om veckokostnaden hade ändrats.


-- ── Känt kvar: kolumnnamnen ljuger så fort valutan inte är euro ───────
--
-- lift_pass_day_eur och lift_pass_week_eur heter _eur och kommer att
-- innehålla CHF, NOK och SEK. Rätt namn är lift_pass_day och
-- lift_pass_week. Bytet är inte gjort här eftersom det måste ske i rätt
-- ordning: koden måste läsa båda namnen, deployas, och först därefter
-- får kolumnen döpas om. Görs det tvärtom står sajten utan priser i
-- glappet mellan att SQL:en körs och att deployen är ute.
--
-- Beslut för Fabian. Kolumnen fungerar med de gamla namnen; det som inte
-- fungerar är att läsa dem och tro på suffixet.


-- ── Efterkontroll ─────────────────────────────────────────────────────
--
--   SELECT lift_pass_currency, count(*) FROM resorts GROUP BY 1;
--
--   Förväntat: EUR 38, inga NULL.
--
--   SELECT slug, lift_pass_currency, lift_pass_day_eur, lift_pass_week_eur
--   FROM resorts WHERE published AND lift_pass_currency <> 'EUR';
--
--   Förväntat nu: noll rader. Efter prisomhämtningen ska varje rad här
--   ha ett belopp som är hämtat i just den valutan — det är kontrollen
--   som fångar en valuta satt utan att beloppet följde med.
