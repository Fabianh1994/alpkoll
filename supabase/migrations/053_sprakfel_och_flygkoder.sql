-- 053 · Språkfel i ortstexterna och flygplatskoder
--
-- Underlag: granskningen av alla 50 ortsidor 2026-11-20 (projektmappen
-- alpkoll/granskning-ortsidor/). Texterna mäts mot docs/copy.md och
-- avsnittet Språk i CLAUDE.md.
--
-- Bara UPDATE. Varje textändring är en replace() på en exakt fras, och
-- satsen kräver att frasen finns, så att en text som redan ändrats inte
-- skrivs över. Kontrollen i slutet stoppar hela migrationen om någon fras
-- finns kvar eller någon publicerad ort saknar flygplatskod.
--
-- Flygplatskoden (nearest_airport_code) används av reseplaneraren i
-- länken till Skyscanner. Ortsidan visar bara namnet. Utan kod skickade
-- planeraren namnet ("Genève", "Scandinavian Mountains"), som Skyscanner
-- inte känner igen. Koden ska alltid gälla samma flygplats som
-- nearest_airport; ingen port byts här.
--
-- Körordning: oberoende av PR:en med koden. Kan köras före eller efter.

begin;

-- ── Textfel ─────────────────────────────────────────────────────────

-- hafjell, notes: CLAUDE.md, Språk: skidsvenska. "sentrum" och "skibussen" är norska.
update resorts
set notes = replace(notes, 'I Hemsedal ligger restaurangerna och utelivet i sentrum, dit skibussen går gratis.', 'I Hemsedal ligger restaurangerna och utelivet i centrum, dit skidbussen går gratis.')
where slug = 'hafjell'
  and notes like '%I Hemsedal ligger restaurangerna och utelivet i sentrum, dit skibussen går gratis.%';

-- hemsedal, where_to_stay: Som Hafjell.
update resorts
set where_to_stay = replace(where_to_stay, 'Restaurangerna och utelivet finns nere i Hemsedal sentrum, dit skibussen går gratis.', 'Restaurangerna och utelivet finns nere i Hemsedals centrum, dit skidbussen går gratis.')
where slug = 'hemsedal'
  and where_to_stay like '%Restaurangerna och utelivet finns nere i Hemsedal sentrum, dit skibussen går gratis.%';

-- klappen, where_to_stay: docs/copy.md: ortstexter skrivs i du-form.
update resorts
set where_to_stay = replace(where_to_stay, 'Reser ni många passar de stora husen i Örebäcken och Kläppbacken.', 'Reser du med ett stort sällskap passar de stora husen i Örebäcken och Kläppbacken.')
where slug = 'klappen'
  and where_to_stay like '%Reser ni många passar de stora husen i Örebäcken och Kläppbacken.%';

-- are, where_to_stay: CLAUDE.md, Språk: svenska där ordet finns. Övriga orter skriver "vid backen".
update resorts
set where_to_stay = replace(where_to_stay, 'med gröna och blå backar och boende ski in/ski out.', 'med gröna och blå backar och boende vid backen.')
where slug = 'are'
  and where_to_stay like '%med gröna och blå backar och boende ski in/ski out.%';

-- val-d-isere, where_to_stay: Samma mening som Saalbach, som skriver "kontrollera".
update resorts
set where_to_stay = replace(where_to_stay, 'så kolla avståndet till närmaste lift innan du bokar.', 'så kontrollera avståndet till närmaste lift innan du bokar.')
where slug = 'val-d-isere'
  and where_to_stay like '%så kolla avståndet till närmaste lift innan du bokar.%';

-- cervinia, notes: Språkfel: en kväll "sker" inte.
update resorts
set notes = replace(notes, 'Kvällen sker mest på hotellen och i några barer i byn.', 'På kvällen håller det mesta till på hotellen och i några barer i byn.')
where slug = 'cervinia'
  and notes like '%Kvällen sker mest på hotellen och i några barer i byn.%';

-- cervinia, notes: Otydligt. Faktum oförändrat (orter/cervinia.md: "si dovesse costruire verso l'alto, cosa che avvenne nel corso degli anni '60").
update resorts
set notes = replace(notes, 'Byn byggdes ut kring linbanan från 1936 och på höjden under 1960-talet.', 'Byn växte upp kring linbanan från 1936 och fick sina höghus på 1960-talet.')
where slug = 'cervinia'
  and notes like '%Byn byggdes ut kring linbanan från 1936 och på höjden under 1960-talet.%';

-- engelberg, notes: Otydligt: "delas av" kan läsas som att två berg delar på pisten. Källan (Powderhounds) säger "disjointed pistes & lifts".
update resorts
set notes = replace(notes, 'Pisterna delas av Titlis och Jochstock,', 'Pisten är uppdelad mellan Titlis och Jochstock,')
where slug = 'engelberg'
  and notes like '%Pisterna delas av Titlis och Jochstock,%';

-- meribel, notes: Dubbelt "efter".
update resorts
set notes = replace(notes, 'efter kriget byggdes husen efter regler om', 'efter kriget byggdes husen enligt regler om')
where slug = 'meribel'
  and notes like '%efter kriget byggdes husen efter regler om%';

-- solden, notes: Språkfel.
update resorts
set notes = replace(notes, 'har övningsliftarna vid byn och lite som händer på kvällen.', 'har övningsliftarna vid byn och lugna kvällar.')
where slug = 'solden'
  and notes like '%har övningsliftarna vid byn och lite som händer på kvällen.%';

-- are, notes: Språkfel: preposition saknas.
update resorts
set notes = replace(notes, 'är Åre by fel ställe att bo.', 'är Åre by fel ställe att bo på.')
where slug = 'are'
  and notes like '%är Åre by fel ställe att bo.%';

-- verbier, where_to_stay: docs/copy.md: inga epitet eller bilder. "Terrass" är ordet ortstexten själv använder.
update resorts
set where_to_stay = replace(where_to_stay, 'Verbier ligger som en balkong över Val de Bagnes,', 'Verbier ligger på en terrass över Val de Bagnes,')
where slug = 'verbier'
  and where_to_stay like '%Verbier ligger som en balkong över Val de Bagnes,%';

-- les-deux-alpes, notes: docs/copy.md: superlativ kräver källa. Ski Club GB: "this is it is one of the liveliest resorts in France" (orter/les-deux-alpes.md).
update resorts
set notes = replace(notes, 'Byn är en av Frankrikes livligaste för afterski.', 'Ski Club of Great Britain kallar byn en av Frankrikes livligaste för afterski.')
where slug = 'les-deux-alpes'
  and notes like '%Byn är en av Frankrikes livligaste för afterski.%';

-- ── Flygplatskoder som pekar på fel flygplats ───────────────────────

-- alpe-d-huez: nearest_airport är Lyon, men koden GNB är en annan flygplats.
update resorts set nearest_airport_code = 'LYS'
where slug = 'alpe-d-huez' and nearest_airport_code = 'GNB';

-- meribel: nearest_airport är Genève, men koden GNB är en annan flygplats.
update resorts set nearest_airport_code = 'GVA'
where slug = 'meribel' and nearest_airport_code = 'GNB';

-- kitzbuehel: nearest_airport är Salzburg, men koden INN är en annan flygplats.
update resorts set nearest_airport_code = 'SZG'
where slug = 'kitzbuehel' and nearest_airport_code = 'INN';

-- ── Flygplatskoder som saknas ───────────────────────────────────────
-- Koden för den flygplats som redan står i nearest_airport.

update resorts r
set nearest_airport_code = v.kod
from (values
  ('alta-badia', 'INN'),
  ('bad-gastein', 'SZG'),
  ('branas', 'SCR'),
  ('cervinia', 'MXP'),
  ('engelberg', 'ZRH'),
  ('funasfjallen', 'OSD'),
  ('hafjell', 'OSL'),
  ('idre-fjall', 'SCR'),
  ('klappen', 'SCR'),
  ('la-plagne', 'GVA'),
  ('laax', 'ZRH'),
  ('lech-zuers', 'INN'),
  ('les-deux-alpes', 'LYS'),
  ('obergurgl', 'INN'),
  ('saalbach', 'SZG'),
  ('serre-chevalier', 'LYS'),
  ('st-moritz', 'ZRH'),
  ('val-d-isere', 'GVA'),
  ('val-gardena', 'INN'),
  ('vemdalen', 'OSD'),
  ('zell-am-see-kaprun', 'SZG')
) as v(slug, kod)
where r.slug = v.slug
  and r.nearest_airport_code is null;

-- ── Kontroll ────────────────────────────────────────────────────────
do $$
declare
  kvar text;
  utan_kod text;
begin
  select string_agg(slug, ', ') into kvar
  from resorts
  where (notes like '%I Hemsedal ligger restaurangerna och utelivet i sentrum, dit skibussen går gratis.%') or (where_to_stay like '%Restaurangerna och utelivet finns nere i Hemsedal sentrum, dit skibussen går gratis.%') or (where_to_stay like '%Reser ni många passar de stora husen i Örebäcken och Kläppbacken.%') or (where_to_stay like '%med gröna och blå backar och boende ski in/ski out.%') or (where_to_stay like '%så kolla avståndet till närmaste lift innan du bokar.%') or (notes like '%Kvällen sker mest på hotellen och i några barer i byn.%') or (notes like '%Byn byggdes ut kring linbanan från 1936 och på höjden under 1960-talet.%') or (notes like '%Pisterna delas av Titlis och Jochstock,%') or (notes like '%efter kriget byggdes husen efter regler om%') or (notes like '%har övningsliftarna vid byn och lite som händer på kvällen.%') or (notes like '%är Åre by fel ställe att bo.%') or (where_to_stay like '%Verbier ligger som en balkong över Val de Bagnes,%') or (notes like '%Byn är en av Frankrikes livligaste för afterski.%');
  if kvar is not null then
    raise exception 'Gamla fraser finns kvar hos: %', kvar;
  end if;

  select string_agg(slug, ', ') into utan_kod
  from resorts
  where published and (nearest_airport_code is null or nearest_airport_code !~ '^[A-Z]{3}$');
  if utan_kod is not null then
    raise exception 'Publicerade orter utan giltig flygplatskod: %', utan_kod;
  end if;
end $$;

commit;
