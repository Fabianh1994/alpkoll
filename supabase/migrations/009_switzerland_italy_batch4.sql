
-- (Raden ovan är avsiktligt tom: tappas första tecknet vid kopiering
--  spelar det då ingen roll.)
-- 009 · Schweiz och Italien — siffror, restid och svensk text
--
-- Omgång 4: Saas-Fee, Crans-Montana, Davos, Livigno, Cortina och
-- Madonna di Campiglio. Siffror från skiresort.com som tidigare.
--
-- Största rättningen: Saas-Fee stod som 145 km där området har 100.
--
-- Davos lämnas orörd på pist och liftar, av samma skäl som Chamonix i
-- migration 008: källan listar dalens sex berg var för sig eftersom de
-- inte hänger ihop med lift. Texten säger det i stället rakt ut.
--
-- Cortina får ingen ski_area trots att den ingår i Dolomiti Superski.
-- Det kortet gäller över tusen kilometer i tolv områden, men de är inte
-- sammanbundna med lift — det är ett prisavtal, inte ett skidområde.
-- Att skriva "1 200 km i Dolomiti Superski" i rutan vore vilseledande,
-- så det hör hemma i texten. Samma resonemang som för Paradiski.

begin;

-- ── Saas-Fee ───────────────────────────────────────────────────────
update public.resorts set
  total_pistes_km = 100, total_lifts = 23, altitude_top = 3573,
  transfer_minutes = 180, transfer_note = 'med bil från Genève',
  notes = 'Bilfri by omgiven av toppar över 4 000 meter, med en glaciär som ger åkning även på sommaren. Området är litet — 100 kilometer pist — men ligger så högt att snön hör till Alpernas säkraste. Metro Alpin, världens högsta bergbana under jord, tar dig till 3 500 meter.',
  where_to_stay = 'Saas-Fee är bilfritt: du ställer bilen i parkeringshuset vid infarten och går eller tar eldriven taxi. Byn är kompakt, så det mesta ligger inom några minuters promenad. Närmast åkningen bor du i södra änden vid Alpin Express. Saas-Grund och Saas-Almagell nere i dalen är billigare och har egna, mindre skidområden.',
  transport_info = 'Flyg till Genève, cirka 3 timmar med bil. Med tåg åker du till Visp och tar postbuss upp genom Saastal, en dryg timme. Bilen kommer inte in i byn.'
where slug = 'saas-fee';

-- ── Crans-Montana ──────────────────────────────────────────────────
update public.resorts set
  total_lifts = 24, altitude_base = 1510, altitude_top = 2927,
  transfer_minutes = 150, transfer_note = 'med bil från Genève',
  notes = 'Ligger på en solterrass högt över Rhônedalen med utsikt mot både Matterhorn och Mont Blanc. 140 kilometer pist och ovanligt mycket sol — orten är lika mycket kurort som skidort, och golfbanorna tar över på sommaren. Åkningen är bred och lättsam; den som söker brant hittar mer på annat håll.',
  where_to_stay = 'Crans och Montana är två byar som vuxit ihop längs samma terrass. Crans är den elegantare med butiker och restauranger, Montana den enklare och billigare. Båda har liftar upp i samma område. Aminona i utkanten är lugnast och minst utbyggd.',
  transport_info = 'Flyg till Genève, cirka 2,5 timmar med bil. Med tåg åker du till Sierre nere i dalen och tar bergbanan upp — tolv minuter för 900 höjdmeter.'
where slug = 'crans-montana';

-- ── Davos ──────────────────────────────────────────────────────────
update public.resorts set
  transfer_minutes = 135, transfer_note = 'med bil från Zürich',
  notes = 'Europas högst belägna stad, känd lika mycket för sitt världsekonomiska forum som för skidåkningen. Åkningen är utspridd på sex skilda berg — Parsenn, Jakobshorn, Rinerhorn, Pischa, Madrisa och Schatzalp — som delar liftkort men inte hänger ihop med lift. Du tar tåg eller buss mellan dem, vilket är värt att veta när de 320 kilometrarna jämförs med sammanhängande områden.',
  where_to_stay = 'Davos är en stad snarare än en skidby, utsträckt längs dalen i två delar. Davos Platz ligger närmast Jakobshorn och har det mesta av restauranger och butiker. Davos Dorf ligger närmare Parsennbahn. Klosters i andra änden är mindre, mysigare och dyrare, med egen infart till Parsenn.',
  transport_info = 'Flyg till Zürich, drygt 2 timmar med bil. Tåget är minst lika smidigt: Rhätische Bahn går från Landquart upp till Davos, och hela resan från flygplatsen tar knappt tre timmar med ett byte.'
where slug = 'davos';

-- ── Livigno ────────────────────────────────────────────────────────
update public.resorts set
  total_lifts = 32, altitude_top = 2798,
  transfer_minutes = 210, transfer_note = 'med bil från Bergamo',
  notes = 'Tullfri zon högt uppe vid schweiziska gränsen, vilket gör sprit, tobak och utrustning märkbart billigare än i övriga Italien. 115 kilometer pist på båda sidor om dalen — Mottolino och Carosello — och en höjd som håller snön långt in på våren. Läget är avsides: vägen dit är lång oavsett varifrån du kommer.',
  where_to_stay = 'Livigno sträcker sig flera kilometer längs dalen, och läget avgör hur mycket skidbuss det blir. Kring centrum har du butikerna och utelivet med lift åt båda hållen. På Mottolino-sidan bor du närmast snowparken, på Carosello-sidan närmast den soligare åkningen. Gratis skidbuss går längs hela dalen.',
  transport_info = 'Flyg till Bergamo eller Milano, cirka 3,5 timmar med bil. Vägen går över Foscagnopasset, som kan stängas vid kraftigt snöfall — då blir det omväg via Schweiz och tunneln vid Munt la Schera. Räkna med att resan tar längre tid än avståndet antyder.'
where slug = 'livigno';

-- ── Cortina ────────────────────────────────────────────────────────
update public.resorts set
  total_pistes_km = 120, total_lifts = 25,
  altitude_base = 1217, altitude_top = 2828,
  season_start_month = 11, season_end_month = 5,
  transfer_minutes = 120, transfer_note = 'med bil från Venedig',
  notes = 'Dolomiternas mest kända ort, med dramatiska klippformationer runt en elegant stad. 120 kilometer egen pist, men liftkortet Dolomiti Superski öppnar över tusen kilometer i tolv områden runt om i Dolomiterna. De hänger inte ihop med lift utan kräver bil eller buss. Cortina är dyrt och lika mycket promenadstad som skidort.',
  where_to_stay = 'Cortina är en stad med gågata, butiker och kaféer, där skidåkningen finns runt omkring snarare än utanför dörren. Bor du centralt blir det skidbuss till liftarna. Närmast åkningen ligger Pocol och Socrepes, som är lugnare och billigare. Staden lever på kvällen även utan afterski i alpin mening.',
  transport_info = 'Flyg till Venedig, cirka 2 timmar med bil. Bussar går direkt från flygplatsen under säsongen. Närmaste tågstation är Calalzo, en dryg halvtimme bort med buss.'
where slug = 'cortina-d-ampezzo';

-- ── Madonna di Campiglio ───────────────────────────────────────────
update public.resorts set
  ski_area = 'Skiarea Campiglio Dolomiti di Brenta',
  total_pistes_km = 155, total_lifts = 58,
  transfer_minutes = 150, transfer_note = 'med bil från Verona',
  notes = 'Elegant ort i Brentadolomiterna, sammankopplad med Pinzolo, Folgàrida och Marilleva till 155 kilometer pist. Backarna är breda och välpreparerade, och orten är mer italiensk än internationell — hit åker italienarna själva. Bergen runt omkring hör till Alpernas mest dramatiska.',
  where_to_stay = 'Madonna di Campiglio är kompakt och bilfritt i centrum, med liftar åt flera håll direkt från byn. Hotell och restauranger ligger samlade kring torget. Folgàrida och Marilleva är märkbart billigare och ingår i samma område, men saknar Campiglios liv på kvällen.',
  transport_info = 'Flyg till Verona, cirka 2,5 timmar med bil. Med tåg åker du till Trento och tar buss den sista dryga timmen uppför dalen.'
where slug = 'madonna-di-campiglio';

commit;

-- ── Kontroll ────────────────────────────────────────────────────────
--   select slug, ski_area, total_pistes_km, total_lifts,
--          altitude_base, altitude_top, transfer_minutes
--   from public.resorts
--   where country in ('Switzerland','Italy') order by slug;
--
-- Antal publicerade orter med engelsk text kvar (ska bli 12 när både
-- 008 och 009 är körda):
--   select count(*) from public.resorts
--   where published and notes ~* '\y(the|and|with|from|for)\y';
