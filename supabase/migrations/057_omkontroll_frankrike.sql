-- 057 · Omkontroll av de franska orterna, november 2026
--
-- Underlag: projektmappen orter/omkontroll-2026-11/ (en fil per ort och
-- granskning-omgang4.md). Courchevel, Méribel, Val Thorens, Tignes,
-- Les Arcs, Alpe d'Huez, Les Deux Alpes och Serre Chevaliers synliga
-- värden stämde. Kodändringar (Val d'Isère i VERIFIERADE, Mont-Blanc
-- Unlimited) ligger i samma PR.
--
-- Tignes och Val d'Isère, pistfördelningen 55/25/20 står kvar. Talen är
-- pistantalet på ortens karta (cirka 86 lätta, 41 röda och 32 svarta av
-- 159), inte km. skiresorts km ger 10/63/27, där Easy bara är grönt;
-- svart är 27 % i km.
--
-- Körordning: oberoende av 054–056 och av merge. Kan köras två gånger.

begin;

-- ── Chamonix: öppnar i november, stänger i maj ───────────────────────
-- montblancnaturalresort.com/en/annual-openings: Flégère 11/28/2026
-- ("Partial openings … depending on snow conditions"), Grands Montets
-- stänger 5/2/2027 med samma Le Pass. skiresort Brévent–Flégère "Current
-- season: 2026-11-28", Grands Montets "… - 2027-05-02". Samma regler som
-- gav Sälen 11 och Åre 5.
update resorts
set season_start_month = 11, season_end_month = 5
where slug = 'chamonix' and season_start_month = 12 and season_end_month = 4;

-- ── La Plagne: första byn öppnade 1961 ──────────────────────────────
-- la-plagne.com, histoire locale: "Plagne Centre, la première des
-- stations de La Plagne ouvre le vendredi 22 décembre 1961".
update resorts
set notes = replace(notes,
      'De byggdes som skidstation från slutet av 1960-talet, och tre av dem har höghus.',
      'De byggdes som skidstation från 1961, och tre av dem har höghus.')
where slug = 'la-plagne'
  and notes like '%De byggdes som skidstation från slutet av 1960-talet, och tre av dem har höghus.%';

-- ── Val d'Isère: priset finns, nu med källrad ───────────────────────
-- valdisere.com/preparer-mon-sejour/acheter-mon-forfait/: "Saison
-- 2026-2027", "Hiver 12 décembre 2026 au 23 avril 2027", "Adultes (19-64
-- ans)", "1 jour 78€", "6 = 7 jours 468€". resorts har talen sedan 039.
insert into lift_pass_prices
  (resort_slug, season, currency, day_price, week_price, product,
   day_source, week_source, source_url, captured_on, note)
select 'val-d-isere', '2026/2027', 'EUR', 78.00, 468.00, 'Tignes–Val d''Isère',
       'ortens egen sida', 'ortens egen sida',
       'https://www.valdisere.com/preparer-mon-sejour/acheter-mon-forfait/', '2026-11-25',
       'Samma område som våra 300 km. Vinterpris 12.12.26–23.4.27, vuxen 19–64. Lågsäsong 67 / 402.'
where not exists (select 1 from lift_pass_prices where resort_slug = 'val-d-isere' and season = '2026/2027');

-- ── Serre Chevalier: noten hade barnpriset ──────────────────────────
-- serrechevalier-pass.com/fr/grille-tarifaire, kolumnen Adulte 12-64:
-- 5–18.12.2026 och 27.3–4.4.2027 "1 jour 54,50€", "6 jours 276,00€".
-- 56 / 283 är Enfant i högsäsong. Noten visas inte på sajten.
update lift_pass_prices
set note = 'Säsong 19.12.26–26.3.27, vuxen 12–64. Början och slutet av säsongen, 5–18.12.26 och 27.3–4.4.27: 54,50 / 276.',
    captured_on = '2026-11-25'
where resort_slug = 'serre-chevalier' and season = '2026/2027' and note like '%56 / 283%';

-- ── Kontroll ────────────────────────────────────────────────────────
do $$
declare
  fel text;
begin
  select string_agg(slug, ', ') into fel
  from resorts
  where (slug = 'chamonix' and (season_start_month is distinct from 11 or season_end_month is distinct from 5))
     or (slug = 'la-plagne' and notes not like '%De byggdes som skidstation från 1961, och tre av dem har höghus.%')
     or (slug = 'val-d-isere' and (lift_pass_day_eur is distinct from 78 or lift_pass_week_eur is distinct from 468));
  if fel is not null then
    raise exception 'Ändringen gick inte igenom för: %', fel;
  end if;

  if not exists (select 1 from lift_pass_prices where resort_slug = 'val-d-isere' and season = '2026/2027'
                 and currency = 'EUR' and day_price = 78.00 and week_price = 468.00) then
    raise exception 'lift_pass_prices saknar val-d-isere 2026/2027';
  end if;

  if exists (select 1 from lift_pass_prices where resort_slug = 'serre-chevalier' and season = '2026/2027'
             and note like '%56 / 283%') then
    raise exception 'Noten för serre-chevalier 2026/2027 rättades inte';
  end if;
end $$;

commit;
