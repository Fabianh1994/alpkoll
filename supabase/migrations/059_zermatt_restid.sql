-- 059 · Zermatt: restiden mätt som för alla andra orter
--
-- Kör bara om Fabian väljer bil och pendeltåg (omkontrollen 2026-11-25,
-- granskning-omgang5.md fråga 4). Förut mätte fältet SBB-tåget (232 min),
-- medan alla andra orter har OSRM-bil. OSRM Genève-terminalen → Täsch
-- station: 230 km, 168,2 min. Pendeltåget Täsch–Zermatt: 12 min enligt
-- SBB. 168 + 12 = 180. Avståndet 235 km till byn står kvar.
-- transport_info säger redan att du ställer bilen i Täsch.

begin;

update resorts
set transfer_minutes = 180, transfer_note = 'med bil och pendeltåg från Genève'
where slug = 'zermatt' and transfer_minutes = 232;

do $$
begin
  if not exists (select 1 from resorts where slug = 'zermatt' and transfer_minutes = 180
                 and transfer_note = 'med bil och pendeltåg från Genève') then
    raise exception 'Zermatts restid ändrades inte';
  end if;
end $$;

commit;
