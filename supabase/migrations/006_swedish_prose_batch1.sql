
-- (Raden ovan är avsiktligt tom: tappas första tecknet vid kopiering
--  spelar det då ingen roll.)
-- 006 · Svensk brödtext, omgång 1
--
-- Fem orter: Zermatt, Verbier, Val Thorens, Courchevel, Méribel.
--
-- Texterna är omskrivna, inte översatta. Den engelska förlagan var
-- skriven för en internationell läsare och innehöll siffror som inte
-- stämde med databasen. Varje tal nedan är samma som visas i rutorna
-- efter migration 004 — ingen läsare ska hitta två olika siffror på
-- samma sida.
--
-- Nackdelar skrivs ut. Zermatt är dyrt, Val Thorens är ingen vykortsby.
-- En jämförelsesajt som bara berömmer hjälper ingen att välja, och
-- trovärdigheten är det Alpkoll har att sälja.
--
-- Det som är sant om byn men inte om området bärs av texten, eftersom
-- sifferrutan visar hela det sammankopplade området: att Val Thorens
-- ligger på 2 300 meter står här, inte i rutan som visar 1 100 m.

begin;

-- ── Zermatt ────────────────────────────────────────────────────────
update public.resorts set
  notes = 'Bilfri by under Matterhorn, med åkning som sträcker sig över gränsen till italienska Cervinia. Området når 3 899 meter och har glaciäråkning även på sommaren, vilket ger den säkraste snön i Alperna. 322 kilometer pist i Matterhorn Ski Paradise, och en by som hör till de vackraste i Schweiz. Priset märks — liftkortet är bland Alpernas dyraste.',
  where_to_stay = 'Zermatt är bilfritt på riktigt — privatbilar får inte köras i byn, och du kommer in med tåg. På plats går du till fots. Byns egna eldrivna taxibilar och hotellskjutsar finns för bagaget och för längre sträckor. Bahnhofstrasse är pulsådern med hotell, butiker och restauranger. Bor du nära Gornergratbanan eller gondolen mot Matterhorn Glacier Paradise slipper du den längsta promenaden i pjäxor. Utbudet går från vandrarhem till femstjärnigt, och Matterhorn syns från förvånansvärt många fönster.',
  transport_info = 'Flyg till Genève eller Zürich — tåget därifrån tar ungefär 3,5 timmar via Visp, med byte till Matterhorn Gotthard Bahn mot Täsch. Täsch är sista anhalten med bil; därifrån går pendeltåg in till Zermatt var tjugonde minut. Byn släpper inte in privatbilar. Glacier Express passerar också Zermatt om du vill göra resan till en del av upplevelsen.'
where slug = 'zermatt';

-- ── Verbier ────────────────────────────────────────────────────────
update public.resorts set
  notes = 'Schweiz största skidområde och ett av Europas mest kända för offpist. 4 Vallées binder ihop Verbier med Nendaz, Veysonnaz, Thyon och La Tzoumaz — 412 kilometer pist och en terräng som lockar dem som helst åker utanför den. Mont Fort på 3 330 meter håller snön långt in på våren. Verbier är dyrt, och utelivet märks.',
  where_to_stay = 'Verbier ligger på en solig terrass med utsikt över dalen, och det mesta går att gå till. Närmast backen bor du kring Médran, där huvudgondolen går. Byn har allt från chalet-lyx till enklare lägenheter, men billigt är det sällan. Nendaz och La Tzoumaz på andra sidan området är märkbart billigare och ingår i samma liftkort.',
  transport_info = 'Flyg till Genève, ungefär 2 timmar med bil. Med tåg åker du till Le Châble via byte i Martigny, cirka 2,5 timmar, och tar sedan gondolen upp till Verbier på tio minuter.'
where slug = 'verbier';

-- ── Val Thorens ────────────────────────────────────────────────────
update public.resorts set
  notes = 'Europas högst belägna skidby, 2 300 meter över havet, med snö från november till maj. Härifrån når du hela Les 3 Vallées — 600 kilometer pist och världens största sammanhängande skidområde. Byn är byggd för åkning snarare än för vykort: allt ligger i backen, men den alpina charmen får du leta efter i grannbyarna.',
  where_to_stay = 'Val Thorens är bilfritt och kompakt, och nästan allt boende ligger ski in/ski out — ovanligt även med alpina mått. Kring Place de Caron finns restauranger och butiker. Vill du ha mer bykänsla bor du i Les Menuires eller Saint-Martin-de-Belleville längre ner i dalen, båda med samma liftkort.',
  transport_info = 'Flyg till Genève, cirka 3 timmar med bil. Lyon och Chambéry kan vara närmare beroende på avgång. Med tåg åker du till Moûtiers och tar buss den sista dryga timmen uppför serpentinvägen; vintertid går bussarna i anslutning till tågen.'
where slug = 'val-thorens';

-- ── Courchevel ─────────────────────────────────────────────────────
update public.resorts set
  notes = 'Frankrikes mest påkostade skidort, med Michelinrestauranger och en landningsbana mitt i backen. Courchevel är fyra byar på olika höjd, där 1850 är den dyraste och mest kända. Härifrån når du hela Les 3 Vallées och dess 600 kilometer pist. Åkningen är bred och välpreparerad, gjord för långa och snabba nedfarter.',
  where_to_stay = 'Siffrorna i bynamnen är ungefärliga höjder. Courchevel 1850 är centrum för lyx och uteliv, Moriond (1650) är lugnare och mer familjevänligt, och 1550 och Le Praz är de prisvärda alternativen med tillgång till samma liftar. Le Praz ligger lägst och har mest kvar av den ursprungliga byn.',
  transport_info = 'Flyg till Genève, ungefär 2,5 timmar med bil, alternativt Lyon eller Chambéry. Med tåg åker du till Moûtiers och sedan buss cirka 45 minuter uppför. Courchevel har även en egen flygplats med en av världens brantaste landningsbanor, men den används i praktiken av privatflyg.'
where slug = 'courchevel';

-- ── Méribel ────────────────────────────────────────────────────────
update public.resorts set
  notes = 'Ligger mitt i Les 3 Vallées, vilket gör den till den smidigaste utgångspunkten om du vill åka hela området — 600 kilometer pist åt båda hållen. Méribel byggdes under byggregler som krävde trä och sten, och ser därför ut som en alpby snarare än som ett betongprojekt från sjuttiotalet. Varierad åkning som fungerar för sällskap på olika nivåer.',
  where_to_stay = 'Méribel Centre ligger på 1 450 meter och rymmer det mesta av restauranger och uteliv. Mottaret ligger högre, på 1 750 meter, med snösäkrare åkning direkt utanför dörren men mindre liv på kvällen. Les Allues nere i dalen är billigast, med gondol upp till backen.',
  transport_info = 'Flyg till Genève, ungefär 2,5 timmar med bil, eller Lyon. Med tåg åker du till Moûtiers och tar buss cirka 30 minuter — Méribel ligger närmast av orterna i Les 3 Vallées räknat från Moûtiers.'
where slug = 'meribel';

commit;

-- ── Kontroll ────────────────────────────────────────────────────────
-- Ska ge 5 rader, alla utan engelska ledord:
--   select slug, left(notes, 60) from public.resorts
--   where slug in ('zermatt','verbier','val-thorens','courchevel','meribel');
--
-- Hur många publicerade orter som fortfarande har engelsk text:
--   select count(*) from public.resorts
--   where published and notes ~* '\y(the|and|with|from|for|resort)\y';
