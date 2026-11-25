-- 058 · Omkontroll av Schweiz, Italien och Andorra, november 2026
--
-- Underlag: projektmappen orter/omkontroll-2026-11/ (en fil per ort och
-- granskning-omgang5.md). Cervinia, Verbier, Engelberg, Val Gardena,
-- Alta Badia, Cortina d'Ampezzo och Madonna di Campiglio stämde.
-- Zermatts restid är ett eget beslut och ligger i 059.
--
-- Körordning: oberoende av 054–057 och av merge. Kan köras två gånger.

begin;

-- ── Glaciärorterna öppnade i oktober 2026 ────────────────────────────
-- Zermatt Bergbahnen 09.10.2026: "resume public skiing operations from
-- Wednesday, October 14, 2026". Saas-Fee: glaciärliftarna vid Allalin
-- öppna lördag 10 oktober (SDA, citerar liftbolaget). St. Moritz:
-- Diavolezza öppnade glaciärpisten för allmänheten 24.10.2026, och
-- Corvatsch öppnar 21.11, så området har bara några dagars uppehåll.
-- Regeln från omgång 1 (första publika liftöppningen, glaciärorter som
-- öppnar i oktober får 10) ersätter beslut D i 043.
update resorts
set season_start_month = 10
where slug in ('zermatt', 'saas-fee', 'st-moritz') and season_start_month = 11;

-- ── Laax: fem parker ────────────────────────────────────────────────
-- laax.com och flimslaax.com: fem parker vid Crap Sogn Gion. Ski Club GB
-- likaså. Bara skiresorts test från 2021 säger fyra.
update resorts
set notes = replace(notes,
      'Vid Crap Sogn Gion ligger fyra parker och en superpipe,',
      'Vid Crap Sogn Gion ligger fem parker och en superpipe,')
where slug = 'laax'
  and notes like '%Vid Crap Sogn Gion ligger fyra parker och en superpipe,%';

-- ── Livigno: två OS-arenor, och restiden genom dalarna ──────────────
-- OS 2026: snowboard och freestyle hölls i Livigno Snow Park och Livigno
-- Aerials & Moguls Park. Restid: 048 lade mellanpunkterna mitt i Tirano
-- och Bormio, så rutten gick genom stadskärnorna. Med punkter på
-- genomfartsvägarna (Aprica på SS39, Isolaccia på SS301) ger OSRM
-- 202 km / 220 min över samma pass. Forcola är vinterstängd från 27.11.
update resorts
set notes = replace(notes,
      'Tävlingarna i snowboard och freestyle under OS 2026 hölls i Livigno Snow Park.',
      'Tävlingarna i snowboard och freestyle under OS 2026 hölls i Livigno Snow Park och Livigno Aerials & Moguls Park.')
where slug = 'livigno'
  and notes like '%Tävlingarna i snowboard och freestyle under OS 2026 hölls i Livigno Snow Park.%';

update resorts
set airport_distance_km = 202, transfer_minutes = 220
where slug = 'livigno' and airport_distance_km = 205 and transfer_minutes = 227;

-- ── Grandvalira: avancerad 7 → 6 ────────────────────────────────────
-- Ski Club GB (/resort/soldeu-grandvalira/): Advanced 1/5, "limited
-- options for advanced level skiers", "many of the blacks … would perhaps
-- be rated red elsewhere". inthesnow säger detsamma. Samma ord gav
-- Kitzbühel och Zell am See-Kaprun 6.
update resorts
set expert_score = 6
where slug = 'grandvalira' and expert_score = 7;

-- ── Kontroll ────────────────────────────────────────────────────────
do $$
declare
  fel text;
begin
  select string_agg(slug, ', ') into fel
  from resorts
  where (slug in ('zermatt', 'saas-fee', 'st-moritz') and season_start_month is distinct from 10)
     or (slug = 'laax' and notes not like '%Vid Crap Sogn Gion ligger fem parker och en superpipe,%')
     or (slug = 'livigno' and (notes not like '%Livigno Snow Park och Livigno Aerials & Moguls Park.%'
          or airport_distance_km is distinct from 202 or transfer_minutes is distinct from 220))
     or (slug = 'grandvalira' and expert_score is distinct from 6);
  if fel is not null then
    raise exception 'Ändringen gick inte igenom för: %', fel;
  end if;
end $$;

commit;
