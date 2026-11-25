-- 054 · Omkontroll av de svenska orterna, november 2026
--
-- Underlag: projektmappen orter/omkontroll-2026-11/ (en fil per ort och
-- granskning-omgang1.md). Varje datapunkt för riksgransen, hemavan,
-- klappen, idre-fjall, branas, vemdalen, funasfjallen, are och salen
-- lästes om 2026-11-25 mot skiresort.com (siffror), ortens egen sida
-- (säsong, liftkort) och OSRM (restider). En oberoende granskare läste
-- källorna igen innan något skrevs hit.
--
-- Det som inte ändras här stämde. Ändringar i koden (Snälltåget till Åre,
-- SJ till Sälen, bilresor, Funäsfjällens delområden, barnfamiljer) ligger
-- i samma PR.
--
-- Textändringar är replace() på en exakt fras och kräver att frasen
-- finns. Kontrollen i slutet stoppar allt om något inte gick igenom.
--
-- Körordning: kan köras före eller efter merge. Ingenting i koden
-- förutsätter de nya talen.

begin;

-- ── Idre Fjäll: ordinarie pris i stället för förköpspris ──────────────
-- Bokningen för start 27.2.2027 visar "671 SEK 745 SEK" (dag) och
-- "2 827 SEK 3 142 SEK" (6–8 dagar). 745 och 3 142 är de överstrukna
-- ordinarie priserna; 671 och 2 827 är dem minus tio procent vid köp mer
-- än 40 dagar före (0,9 × 745 = 670,5). pistat.se "utan rabatt" 745 /
-- 3 142. Kläppen och Hemavan lagras redan med ordinarie pris, och
-- docs/liftkortspriser.md definierar priset som ordinarie, inte
-- onlinerabatt. Prisnoten i lib/liftkortspriser.js stämmer redan med 745.
update resorts
set lift_pass_day_eur = 745, lift_pass_week_eur = 3142
where slug = 'idre-fjall' and lift_pass_day_eur = 671 and lift_pass_week_eur = 2827;

update lift_pass_prices
set day_price = 745.00,
    week_price = 3142.00,
    captured_on = '2026-11-25',
    note = 'Ordinarie pris för start 27 februari 2027. På nätet dras fem procent, tio vid köp mer än 40 dagar före (då 671 / 2 827). Sex, sju och åtta dagar kostar samma.'
where resort_slug = 'idre-fjall' and season = '2026/2027' and day_price = 671.00;

-- ── Funäsfjällen: en lift till, och tidigare premiär ─────────────────
-- skiresort Tänndalen 2026-11-25: 18 liftar, "22420 Passengers/hour"
-- (förut 17 och 21 220). Nya 2026: Parkliften och Stormlift 3.
-- Regionsidan: "39 ski lifts". Kapacitet 22 420 + 12 860 + 7 273 +
-- 2 900 + 1 000 + 1 000 = 47 453.
-- Säsong: tanndalen.com "Premiär 24:e oktober", funasdalen.se Fjällpass
-- Vintersäsong "Gäller 23 oktober till 2 maj", skiresort "General season:
-- late October - early May". Säsongsstart = områdets första publika
-- liftöppning, samma regel som Sälen, Vemdalen och Les 3 Vallées.
update resorts
set total_lifts = 39, lift_capacity_per_hour = 47453, season_start_month = 10
where slug = 'funasfjallen' and total_lifts = 38;

-- Skidbussen: den enda publicerade tidtabellen gäller 26/12 2026–10/1
-- 2027, mellan Ramundberget, Bruksvallarna, Funäsdalen, Tänndalen och
-- Fjällnäs. Tännäskröket, Kappruet och Tänndalsvallen har ingen
-- hållplats. funasdalen.se: "Skidbussen mellan anläggningarna ingår under
-- utvalda perioder".
update resorts
set notes = replace(notes,
      'De hänger inte ihop med lift, och skidbussen mellan dem ingår i liftkortet.',
      'De hänger inte ihop med lift. Under vissa perioder går skidbussen mellan Ramundberget, Funäsdalen och Tänndalen, gratis med liftkortet.'),
    transport_info = replace(transport_info,
      'Skidbussen mellan anläggningarna är gratis med Fjällpass Lift.',
      'Under vissa perioder går skidbussen mellan Ramundberget, Funäsdalen och Tänndalen, gratis med Fjällpass Lift.')
where slug = 'funasfjallen'
  and notes like '%De hänger inte ihop med lift, och skidbussen mellan dem ingår i liftkortet.%'
  and transport_info like '%Skidbussen mellan anläggningarna är gratis med Fjällpass Lift.%';

-- ── Åre: öppnar i december 2026 ──────────────────────────────────────
-- SkiStar: "Åre by 11 december*", "*Smygpremiär helgen 4–6 december".
-- skiresort "Current season: 2026-12-04". Ingen lift öppnar i november
-- 2026. Samma regel som ovan: första publika liftöppningen.
update resorts
set season_start_month = 12
where slug = 'are' and season_start_month = 11;

-- Riksgränsens text jämför med Åres öppning, som nu är fel. Hemavan
-- öppnar 27 november (skiresort "Current season: 2026-11-27").
update resorts
set notes = replace(notes, 'Åre öppnar i november.', 'Hemavan öppnar i november.')
where slug = 'riksgransen' and notes like '%Åre öppnar i november.%';

-- ── Sälen: SJ:s nya söndagståg ───────────────────────────────────────
-- SJ och SkiStar, pressmeddelande: söndagar 17 januari–4 april 2027,
-- "Stockholm–Mora, kl. 09.44–13.31", chartrad buss vidare till Sälen.
update resorts
set transport_info = replace(transport_info,
      'Med Snälltåget åker du till Mora och tar bussen sista biten.',
      'Med tåg åker du till Mora, med Snälltåget på lördagar eller SJ på söndagar, och tar bussen sista biten.')
where slug = 'salen'
  and transport_info like '%Med Snälltåget åker du till Mora och tar bussen sista biten.%';

-- ── Kontroll ────────────────────────────────────────────────────────
do $$
declare
  fel text;
begin
  select string_agg(slug, ', ') into fel
  from resorts
  where (slug = 'idre-fjall' and (lift_pass_day_eur <> 745 or lift_pass_week_eur <> 3142))
     or (slug = 'funasfjallen' and (total_lifts <> 39 or lift_capacity_per_hour <> 47453 or season_start_month <> 10
          or notes like '%skidbussen mellan dem ingår i liftkortet%'
          or transport_info like '%Skidbussen mellan anläggningarna är gratis%'))
     or (slug = 'are' and season_start_month <> 12)
     or (slug = 'riksgransen' and notes like '%Åre öppnar i november.%')
     or (slug = 'salen' and transport_info like '%Med Snälltåget åker du till Mora och tar bussen%');
  if fel is not null then
    raise exception 'Ändringen gick inte igenom för: %', fel;
  end if;

  if not exists (select 1 from lift_pass_prices
                 where resort_slug = 'idre-fjall' and season = '2026/2027' and day_price = 745.00) then
    raise exception 'lift_pass_prices för idre-fjall 2026/2027 uppdaterades inte';
  end if;
end $$;

commit;
