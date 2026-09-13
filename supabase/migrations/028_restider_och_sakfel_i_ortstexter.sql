
-- 028 — rätta restider och sakfel i ortstexterna
--
-- Copygranskningen 13 september 2026 hittade handskrivna biltider i
-- transport_info som säger emot den uppmätta restiden på samma sida. Hemsedal
-- sade sju timmar från Stockholm i rutan "Med tåg och flyg" och 10,3 timmar i
-- svaret om resan längre ner.
--
-- Rättningen omfattar alla handskrivna biltider från svenska städer på en gång,
-- så att ingen ort står kvar med ett gammalt tal bredvid en rättad granne.
--
--   ort       sträcka      stod                  uppmätt
--   Hemsedal  Stockholm    ungefär sju timmar    10,3 tim (727 km)
--   Hemsedal  Göteborg     fem                   6,9 tim (491 km)
--   Sälen     Stockholm    fyra och en halv      5,9 tim (397 km)
--   Sälen     Göteborg     ungefär fem           6,9 tim (464 km)
--   Trysil    Stockholm    knappt sex            7,0 tim (467 km)
--   Trysil    Karlstad     tre                   4,2 tim (266 km)
--   Hemavan   Stockholm    drygt tio             12,3 tim (900 km)
--   Hemavan   Umeå         fyra                  5,6 tim (381 km)
--   Åre       Stockholm    åtta timmar           8,7 tim (654 km)
--
-- Stockholm och Göteborg kommer ur lib/restider.js. Karlstad och Umeå mättes
-- 13 september med samma metod: OSRM mot OpenStreetMaps vägnät, från stadens
-- centrum till ortens koordinat i databasen. Servern kontrollerades först mot
-- två lagrade sträckor och gav samma tal på kilometern och minuten.
-- Tiderna är körtid utan raster, som överallt på sajten.
--
-- Ruka ("räkna med två dagar från Stockholm", 17,6 tim körtid) lämnas orörd.
--
-- replace() används i stället för att skriva om hela fälten. Då spelar det
-- ingen roll om 027 körts före eller efter, och övrig text står kvar ord för ord.
--
-- Grandvalira: "dagskortet kostar ungefär en tredjedel av Zermatts" är ett
-- prispåstående på en ort där sajten medvetet inte visar något pris, och det
-- går inte att belägga. Zermatts dagskort är 104 CHF, cirka 1 250 kr. Även
-- "priser som ligger märkbart under Alpernas" tas bort av samma skäl. Texten
-- sade 210 km pist medan sifferrutan och prislistan säger 215.
--
-- Geilo och Hemsedal: fylket Viken delades upp 1 januari 2024, och båda
-- kommunerna ligger nu i Buskerud (Store norske leksikon, snl.no/Buskerud).

update resorts
set transport_info = replace(transport_info,
  'ungefär sju timmar från Stockholm och fem från Göteborg',
  'drygt tio timmar från Stockholm och knappt sju från Göteborg')
where slug = 'hemsedal';

update resorts
set transport_info = replace(transport_info,
  'fyra och en halv timme från Stockholm, ungefär fem från Göteborg',
  'knappt sex timmar från Stockholm, knappt sju från Göteborg')
where slug = 'salen';

update resorts
set transport_info = replace(transport_info,
  'knappt sex timmar från Stockholm, tre från Karlstad',
  'sju timmar från Stockholm, drygt fyra från Karlstad')
where slug = 'trysil';

update resorts
set transport_info = replace(transport_info,
  'fyra timmar från Umeå och drygt tio från Stockholm',
  'fem och en halv timme från Umeå och drygt tolv från Stockholm')
where slug = 'hemavan';

update resorts
set transport_info = replace(transport_info,
  'Med bil tar det åtta timmar från Stockholm',
  'Med bil tar det knappt nio timmar från Stockholm')
where slug = 'are';

update resorts
set notes = replace(notes,
  '210 kilometer pist fördelat på flera byar, och priser som ligger märkbart under Alpernas — dagskortet kostar ungefär en tredjedel av Zermatts.',
  '215 kilometer pist fördelat på flera byar.')
where slug = 'grandvalira';

update resorts
set region = 'Buskerud'
where slug in ('geilo', 'hemsedal')
  and region = 'Viken';

-- Efterkontroll: ska ge sju rader, och ingen av dem ska innehålla de gamla
-- talen eller Viken.
--
-- select slug, region, transport_info, notes
-- from resorts
-- where slug in ('hemsedal', 'salen', 'trysil', 'hemavan', 'are', 'grandvalira', 'geilo');
