-- 001 · Månader som siffror i stället för engelska textsträngar
--
-- Bakgrund
--   season_start, season_end och best_months lagrar engelska månadsnamn
--   ("November", "January,  February,  March"). Det gör att sidan visar
--   engelska värden under svenska etiketter, och att varje språkbyte
--   kräver att datan skrivs om.
--
--   app/plan/page.js slår dessutom upp namnen i en tabell:
--       const start = seasonStartMap[resort.season_start] || 12
--   Ett översatt värde matchar inte, och `|| 12` tar över TYST. Alla
--   orter skulle få säsong december–april utan felmeddelande.
--
-- Lösning
--   Lagra månader språkneutralt som heltal 1–12. Namnen renderas i
--   koden. Datan behöver då aldrig översättas igen.
--
-- Körs i två steg med flit: den här migrationen LÄGGER TILL kolumner och
-- fyller dem. De gamla textkolumnerna lämnas orörda tills koden är
-- utrullad och verifierad — se 003_drop_month_text_columns.sql.
-- Sajten fungerar oförändrat mellan de två stegen.

begin;

alter table public.resorts
  add column if not exists season_start_month smallint,
  add column if not exists season_end_month   smallint,
  add column if not exists best_months_nums   smallint[];

-- Engelskt månadsnamn -> nummer. Tål inledande och avslutande blanksteg.
create or replace function pg_temp.month_to_num(name text)
returns smallint language sql immutable as $$
  select case lower(btrim(name))
    when 'january' then 1  when 'february' then 2  when 'march'     then 3
    when 'april'   then 4  when 'may'      then 5  when 'june'      then 6
    when 'july'    then 7  when 'august'   then 8  when 'september' then 9
    when 'october' then 10 when 'november' then 11 when 'december'  then 12
  end::smallint
$$;

update public.resorts
set season_start_month = pg_temp.month_to_num(season_start),
    season_end_month   = pg_temp.month_to_num(season_end);

-- best_months är en kommaseparerad lista. Vissa rader har dubbla
-- mellanslag ("January,  February") — btrim i funktionen ovan hanterar det.
update public.resorts
set best_months_nums = (
  select array_agg(pg_temp.month_to_num(del) order by ord)
  from unnest(string_to_array(best_months, ',')) with ordinality as t(del, ord)
  where pg_temp.month_to_num(del) is not null
)
where best_months is not null;

commit;

-- ── Kontroll ────────────────────────────────────────────────────────
-- Kör detta efteråt. Båda ska ge noll rader.

-- Rader där översättningen misslyckades:
--   select slug, season_start, season_end, best_months
--   from public.resorts
--   where (season_start is not null and season_start_month is null)
--      or (season_end   is not null and season_end_month   is null)
--      or (best_months  is not null and best_months_nums   is null);

-- Månadsnummer utanför 1–12:
--   select slug from public.resorts
--   where season_start_month not between 1 and 12
--      or season_end_month   not between 1 and 12;
