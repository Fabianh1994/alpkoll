-- 055 · Omkontroll av Norge och Finland, november 2026
--
-- Underlag: projektmappen orter/omkontroll-2026-11/ (geilo, hafjell, voss,
-- levi, ruka, trysil, hemsedal och granskning-omgang2.md). Varje datapunkt
-- lästes om 2026-11-25, och en oberoende granskare läste källorna igen.
-- Det som inte ändras här stämde. Kodändringar (Snälltåget till Trysil och
-- Hemsedal på /tag-till-fjallen, prisnoter, bilresor) ligger i samma PR.
--
-- Körordning: oberoende av 054 och av merge.

begin;

-- ── Geilo: 26/27-priset finns nu ─────────────────────────────────────
-- Butikens prisfunktion, start 27.2.2027, vuxen: 1 dag 690 NOK, 6–8 dagar
-- 3 173,50 NOK. Orten publicerar inget kassapris, så nätpriset lagras som
-- för Voss. Förut 693 / 2 871 från 25/26.
update resorts
set lift_pass_day_eur = 690, lift_pass_week_eur = 3174
where slug = 'geilo' and lift_pass_day_eur = 693 and lift_pass_week_eur = 2871;

insert into lift_pass_prices
  (resort_slug, season, currency, day_price, week_price, product,
   day_source, week_source, source_url, captured_on, note)
select 'geilo', '2026/2027', 'NOK', 690.00, 3173.50, 'Skipass, 6–8 dagar',
       'ortens egen sida', 'ortens egen sida',
       'https://geilo.skiperformance.com/no/shopp#/no/buy?skugroup_id=4163', '2026-11-25',
       'Nätpris för start 27 februari 2027; priset ändras med datum. Sex, sju och åtta dagar kostar samma. De närmaste startdagarna kostade 745 / 3 427 (2026-11-25).'
where not exists (select 1 from lift_pass_prices where resort_slug = 'geilo' and season = '2026/2027');

-- ── Hemsedal: öppnar i december, och tåget finns ─────────────────────
-- SkiStar: "starter allerede 4. desember med et begrenset antall heiser".
-- Samma regel som Åre i 054: första publika liftöppningen.
-- Snälltåget går till Oslo lördagar och söndagar 19.12–21.3 med buss till
-- SkiStar Lodge, och till påsk nattåg till Gol (snalltaget.se/tag-till-
-- hemsedal). "Vill du resa utan bil är Hemsedal fel val" stämmer därför
-- inte längre; omdömet gäller nu den som vill åka tåg hela vägen.
update resorts
set season_start_month = 12,
    notes = replace(notes,
      'Vill du resa utan bil är Hemsedal fel val. Tåget stannar inte här, och från Oslo tar du buss.',
      'Vill du åka tåg hela vägen är Hemsedal fel val. Tåget stannar inte här, och från Oslo eller Gol tar du buss.'),
    transport_info = replace(transport_info,
      'Flyg till Oslo och kör sista biten, eller kör hela vägen från Sverige. Under säsongen går bussar från Oslo.',
      'Flyg till Oslo och kör sista biten, eller kör hela vägen från Sverige. Snälltåget går till Oslo på lördagar och söndagar under vintern, och bussen därifrån tar dig till SkiStar Lodge. Till påsk går nattåg från Malmö till Gol, med buss sista biten. Under säsongen går också bussar från Oslo.')
where slug = 'hemsedal'
  and notes like '%Vill du resa utan bil är Hemsedal fel val. Tåget stannar inte här, och från Oslo tar du buss.%'
  and transport_info like '%Flyg till Oslo och kör sista biten, eller kör hela vägen från Sverige. Under säsongen går bussar från Oslo.%';

-- ── Levi och Ruka: punkten i byn, och uppmätt restid ─────────────────
-- Ägarbeslut 2 (öppet sedan 049). Punkterna låg utanför byarna, och
-- restiderna var inte uppmätta. OSRM 2026-11-25 från terminalen:
--   Levi: Kittilä 24.8586,67.6956 → Sirkka 24.8056,67.8076 (Nominatim
--     "Sirkka, Kittilä"): 14,2 km / 15 min. levi.fi: "15 kilometers away
--     from Levi center".
--   Ruka: Kuusamo 29.2269,65.9960 → Rukan kylä 29.1397,66.1673: 29 km /
--     32 min. Till den gamla punkten uppe på fjället gav OSRM 45 min.
update resorts
set latitude = 67.8076, longitude = 24.8056, airport_distance_km = 14, transfer_minutes = 15
where slug = 'levi' and latitude = 67.8017 and longitude = 24.8472;

update resorts
set latitude = 66.1673, longitude = 29.1397, airport_distance_km = 29, transfer_minutes = 32
where slug = 'ruka' and latitude = 66.1667 and longitude = 29.15;

-- ── Kontroll ────────────────────────────────────────────────────────
do $$
declare
  fel text;
begin
  select string_agg(slug, ', ') into fel
  from resorts
  where (slug = 'geilo' and (lift_pass_day_eur is distinct from 690 or lift_pass_week_eur is distinct from 3174))
     or (slug = 'hemsedal' and (season_start_month is distinct from 12
          or notes not like '%Vill du åka tåg hela vägen är Hemsedal fel val.%'
          or transport_info not like '%Snälltåget går till Oslo på lördagar och söndagar%'))
     or (slug = 'levi' and (latitude is distinct from 67.8076 or transfer_minutes is distinct from 15))
     or (slug = 'ruka' and (latitude is distinct from 66.1673 or transfer_minutes is distinct from 32));
  if fel is not null then
    raise exception 'Ändringen gick inte igenom för: %', fel;
  end if;

  if not exists (select 1 from lift_pass_prices where resort_slug = 'geilo' and season = '2026/2027') then
    raise exception 'lift_pass_prices saknar geilo 2026/2027';
  end if;
end $$;

commit;
