-- 046 · Omgång 7: sju befintliga franska orter granskade och rättade.
--
-- Underlaget är faktafilerna i projektmappen orter/ (courchevel.md,
-- meribel.md, val-thorens.md, tignes.md, les-arcs.md, alpe-d-huez.md,
-- chamonix.md) och granskningen granskning-omgang7.md, alla 2026-11-18.
-- Där granskningen och forskarnas filer skiljer sig gäller granskningen.
-- Varje tal i kärnfälten nedan är läst på skiresort.com två gånger, av
-- forskaren och av granskaren (curl, råtext).
--
-- Alla orter är befintliga och publicerade. Här görs bara UPDATE. Varje
-- sats säger nuvarande värde, nytt värde och belägg.
--
-- Gemensamt:
--   · Restid och avstånd är OSRM från en gemensam punkt per flygplats,
--     avrundat till hel km och hel minut. Genève: terminalen 6.1090,
--     46.2300 (fäster 2 m bort). Punkten i 041 (6.1092, 46.2381) fäster
--     394 m bort på Chemin de la Bagasse norr om banan och gav omkring
--     16 minuter för lång rutt. Därför mäts här ALLA franska orter med
--     Genève som port om, också La Plagne och Val d'Isère.
--     Lyon: samma punkt som 041 (5.0811, 45.7256, fäster 59 m bort).
--     Terminal 1 (5.0790, 45.7198) ger högst en minut kortare; Les Deux
--     Alpes och Serre Chevalier står därför kvar, och Alpe d'Huez mäts
--     med samma punkt.
--   · Les 3 Vallées och Tignes/Val d'Isère: områdestal och områdesbetyg
--     (snö, nybörjare, mellannivå, avancerad, offpist, snowpark, gott om
--     plats) är identiska inom området, som regeln i docs/poangskala.md
--     och efterkontrollen i 014 kräver. Familj, afterski och bykänsla
--     avser byn. Kontrollen längst ner avbryter transaktionen om något
--     skiljer.
--   · Säsong i Les 3 Vallées är områdets, enligt regeln 005 satte
--     ("trots gemensamt liftsystem och liftkort", skiresort "mid November
--     - early May"). 11–5 står kvar för alla tre; forskarnas 12–4 för
--     Courchevel och Méribel tas inte in.
--   · Snösäkerhet följer ankaret i docs/poangskala.md: "glaciär eller
--     åkning över 3 000 m räcker hit [9], inte till tian", som omgång 5
--     tillämpade på Laax och Engelberg. La Plagne, Les Arcs, Alpe d'Huez
--     och Les 3 Vallées (3 167–3 330 m, glaciär) blir 9. Tian är Zermatt.
--     Se granskningen, beslut A och B.
--
-- Texterna följer docs/copy.md: du-form, inga handskrivna avstånd eller
-- restider, och varje nackdel säger vem den gäller, ett faktum och en
-- annan ort på sajten. Källan till varje nytt namn står vid orten.
-- Kontrollen / — |, vilket|snarare än|(?<!\p{L})vykort/gu ger noll
-- träffar i de nya texterna.
--
-- Kör i Supabase SQL Editor. Allt körs i en transaktion.

begin;

-- ── Les 3 Vallées: områdestal (Courchevel, Méribel, Val Thorens) ──────
--
-- skiresort.com "Les 3 Vallées – Val Thorens/Les Menuires/Méribel/
-- Courchevel":
--   lifts-cable-cars: "Total capacity 290342 Passengers/hour". Nu:
--     Courchevel null, Méribel 102 000 (ingen migration bakom), Val
--     Thorens null.
--   snow-reliability: "60 % of the slopes have snow-making capabilities".
--     Nu: 50 / 45 / 35, ingen migration bakom något av dem.
-- Höjder 1 100–3 230, 600 km, 56/34/10 och 159 liftar stämmer redan.
--
-- Dagskort: les3vallees.com "1-Day Adult Solo Pass €84.20", fast pris
-- från 19.12.2026. Nu 82 (skiresort via 013, "ungefärligt"). Kolumnen är
-- heltal; 84,20 står i lift_pass_prices nedan. Sexdagarskortet 421 €
-- ("6-Day Adult Solo Pass €421.00") är oförändrat.
--
-- Områdesbetyg, nu Courchevel / Méribel / Val Thorens:
--   snö       8 / 8 / 10 → 9. Glaciärer i Val Thorens-sektorn, topp 3 230
--             m, 85 % av pisten över 1 800 m, 60 % konstsnö (skiresort).
--             Ankaret för 10 beskrev Val Thorens BY; som områdesbetyg går
--             Les 3 Vallées inte att skilja från Tignes (3 456 m, 9) eller
--             Sölden (3 340 m, 91 % konstsnö, 9).
--   offpist   8 / 8 / 9 → 9. skiresort experts-freeriders "The off-piste
--             possibilities are virtually endless".
--   snowpark  8 / 7 / 9 → 9. skiresort snow-park 5/5: parker i Val
--             Thorens, Les Menuires och Méribel, Family Park i Courchevel.
--   plats     6 / 5 / 7 → 5. Ski Club GB på alla tre ortsidorna: "Some
--             slopes can get crowded", "Some very crowded pistes and busy
--             intersections", "Some pistes can get crowded during holidays
--             and at weekends". La Plagne fick 5 på samma ordalydelse.
--   Nybörjare 8, mellannivå 10 och avancerad 8 är redan lika (014).

update resorts
set lift_capacity_per_hour = 290342,
    snowmaking_coverage_pct = 60,
    lift_pass_day_eur = 84,
    snow_guarantee_score = 9,
    off_piste_score = 9,
    snowpark_score = 9,
    crowd_score = 5
where slug in ('courchevel', 'meribel', 'val-thorens');

-- Restid från Genève-terminalen, OSRM. Nu handsatta i 005 med
-- transfer_note 'med bil'.
--   Courchevel  190 / 150 → 143 / 138 (142,6 km, 138,1 min)
--   Méribel     180 / 150 → 136 / 133 (136,3 km, 132,8 min, ny koordinat)
--   Val Thorens 180 / 180 → 155 / 150 (155,4 km, 150,0 min)
update resorts set airport_distance_km = 143, transfer_minutes = 138,
  transfer_note = 'med bil från Genève' where slug = 'courchevel';
update resorts set airport_distance_km = 136, transfer_minutes = 133,
  transfer_note = 'med bil från Genève' where slug = 'meribel';
update resorts set airport_distance_km = 155, transfer_minutes = 150,
  transfer_note = 'med bil från Genève' where slug = 'val-thorens';

-- ── Courchevel ────────────────────────────────────────────────────────
--
-- Afterski 8 → 6 (byn). Ski Club GB "Après rating" 2/5: "Compared to the
-- other resorts in the Three Valleys, Courchevel is the least lively of
-- the resorts". Iglu Ski säger emot (Les Caves, La Mangeoire till sent).
-- Samma mått som La Plagne och Les Arcs: Ski Club 2/5 och en annan källa
-- som namnger ett sent kvällsliv ger 6 (granskningen, beslut D).
-- Bykänsla 9 → 7 (byn). en.wikipedia.org/wiki/Courchevel: "Courchevel
-- 1850 was significant as it was the first resort in France to be
-- constructed from scratch". Ankarets nior fanns före liftarna. Le Praz
-- med bondgårdar och stenchaletar (Iglu) och Saint-Bon håller den över
-- 6. Beslut E.
--
-- Texter:
--   Skog vid snöfall: Ski Club GB "a good array of tree-lined slopes ...
--     a great place to be during a snowstorm".
--   Byarna, altiporten 525 m och 18,5 %: Wikipedia (som 029).
--   Lugnast av byarna: Ski Club GB, ovan. La Folie Douce och Bar 360 i
--     Val Thorens: Ski Club GB Val Thorens "in Bar 360 and the Folie
--     Douce, the resort has two of the Alps' best on slope bars".
--     Afterski Val Thorens 9 mot Courchevel 6.
--   transport_info: Chambéry stryks. Inget reguljärt flyg från Sverige
--     är belagt (flightconnections, 041).
update resorts
set apres_ski_score = 6,
    village_charm_score = 7,
    notes = 'Courchevel passar dig som åker blått och rött och vill ha skog att åka i när det snöar. Orten är fyra byar på olika höjd i Les 3 Vallées: Le Praz, Courchevel Village, Moriond och Courchevel 1850 högst upp, och nedanför byarna går pisterna genom skog. Ovanför 1850 ligger en flygplats för småplan, med en landningsbana på 525 meter och 18,5 procents lutning. Vill du ha livlig afterski när liftarna stänger är Courchevel fel val. Kvällarna är lugnare här än i områdets andra byar, och i Val Thorens ligger La Folie Douce och Bar 360 i backen.',
    transport_info = 'Flyg till Genève eller Lyon. Med tåg åker du till Moûtiers och tar buss upp.'
where slug = 'courchevel';

-- ── Méribel ───────────────────────────────────────────────────────────
--
-- Koordinat 45.3964, 6.5595 → 45.3967, 6.5667. Nominatim: "Office de
-- Tourisme de Méribel, Place Maurice Front" 6.5667411, 45.3966915. Den
-- gamla punkten låg omkring 560 m väster om centrum och fäste 264 m bort
-- i OSRM; den nya fäster 36 m bort. BIL-raden i lib/restider.js räknas om
-- i samma ändring (skillnad en km och en minut).
--
-- notes: en nackdel läggs till. Ski Club GB Méribel: "Some of the lower
-- slopes can suffer in the sunshine", "Mottaret being higher and more
-- snowsure". Mottaret 1 750 m och Val Thorens 2 300 m: Wikipedia. Rådet
-- gäller var du bor, inte poängen, som är områdets.
update resorts
set latitude = 45.3967,
    longitude = 6.5667
where slug = 'meribel';

update resorts
set notes = replace(
  notes,
  'och tak av skiffer.',
  'och tak av skiffer. De lägre backarna i dalen ligger i sol och får sämre snö först. Är snön viktigast bor du i Mottaret eller i Val Thorens, som ligger högst av byarna i området.'
)
where slug = 'meribel'
  and notes like '%och tak av skiffer.'
  and notes not like '%får sämre snö först%';

-- ── Val Thorens ───────────────────────────────────────────────────────
--
-- Snösäkerhet 10 → 9 (ovan). Gott om plats 7 → 5 (ovan).
-- notes: nackdel läggs till. Ski Club GB VT: "All above the tree-line so
-- can be bleak in bad weather". Ski Club GB Courchevel: "Wooded slopes
-- below the resort are excellent in bad weather". Samma liftkort:
-- les3vallees.com.
-- transport_info: Chambéry stryks, som för Courchevel.
update resorts
set notes = replace(
  notes,
  'till Cime de Caron på 3 200 meter.',
  'till Cime de Caron på 3 200 meter. Byn och backarna runt den ligger ovanför trädgränsen, så i snöfall och dimma ser du lite. Åker du hellre i skog när sikten är dålig bor du i Courchevel, där nedfarterna nedanför byarna går genom skog på samma liftkort.'
)
where slug = 'val-thorens'
  and notes like '%till Cime de Caron på 3 200 meter.'
  and notes not like '%ovanför trädgränsen%';

update resorts
set transport_info = 'Flyg till Genève eller Lyon. Med tåg åker du till Moûtiers, där bussen till Val Thorens går från busstationen bredvid tågstationen.'
where slug = 'val-thorens';

-- ── Tignes ────────────────────────────────────────────────────────────
--
-- region 'Espace Killy' → 'Savoie'. skiresort: "The winter sports area
-- was formerly known as Espace Killy", "Savoie, Albertville". Val d'Isère
-- har 'Savoie' (039).
-- Restid 165 / 180 → 176 / 175. OSRM 176,1 km, 175,1 min från terminalen.
-- Afterski 6 → 7 (byn). Ski Club GB Après 4/5 "Tignes is one of the
-- Alps' liveliest resorts"; Iglu "one of the most enviable après scenes
-- in the Alps". Val d'Isère (Ski Club 5/5) har 8.
--
-- Texter:
--   Andra nackdelen: Ski Club GB Tignes "Bleak, treeless setting with
--     lifts prone to closure in bad weather". Les Arcs: Ski Club GB "Some
--     excellent woodland runs – ideal for bad weather days".
--   where_to_stay: Ski Club GB "Le Lac is ideal as it's right next to the
--     best nursery slopes, but the lower villages are quieter", "Les
--     Boisses and Les Brévières make a great base ... a quieter, wooded
--     setting"; Snowthere "For families with children under ten, Tignes
--     le Lac is the answer 90% of the time".
-- Områdesbetygen är redan lika med Val d'Isère; kontrollen nedan.
update resorts
set region = 'Savoie',
    airport_distance_km = 176,
    transfer_minutes = 175,
    apres_ski_score = 7,
    where_to_stay = 'Val Claret, Le Lac och Le Lavachet ligger på 2 100 meter. Med barn i skidskola bor du i Le Lac, där det största nybörjarområdet ligger mitt i byn. Les Boisses och Les Brévières ligger lägre och lugnare i skogen, och Les Brévières på 1 550 meter är det som finns kvar av den ursprungliga bebyggelsen. Val d''Isère på andra sidan hör till samma skidområde.'
where slug = 'tignes';

update resorts
set notes = replace(
  notes,
  'Zermatt har också glaciäråkning, i en bilfri by.',
  'Zermatt har också glaciäråkning, i en bilfri by. Vill du kunna åka i skog när sikten är dålig är Tignes också fel val. Pisterna kring de höga byarna ligger ovanför trädgränsen, och liftarna kan stängas i dåligt väder. Les Arcs har nedfarter genom skog.'
)
where slug = 'tignes'
  and notes like '%i en bilfri by.'
  and notes not like '%Les Arcs har nedfarter%';

-- ── Val d'Isère ───────────────────────────────────────────────────────
--
-- Bara restiden, mätt om med Genève-terminalen: 183 / 196 → 178 / 180
-- (177,5 km, 180,1 min). 039 mätte från punkten norr om banan.
update resorts
set airport_distance_km = 178,
    transfer_minutes = 180
where slug = 'val-d-isere';

-- ── Les Arcs ──────────────────────────────────────────────────────────
--
-- skiresort "Les Arcs/Peisey-Vallandry (Paradiski)":
--   lift_capacity_per_hour 95 000 → 95 700: "Total capacity 95700
--     Passengers/hour". 95 000 har ingen migration bakom sig.
--   snowmaking_coverage_pct 35 → null: snow-reliability anger ingen
--     procentsats, bara "The lower areas are fully equipped with snow
--     cannons". Samma hantering som St. Anton (040) och Branäs (044).
-- Restid 170 / 165 → 171 / 175. OSRM 171,4 km, 174,7 min. Koordinaten
--   ligger i de bilfria byarna och fäster 357 m bort; den står kvar, som
--   i lib/restider.js.
-- Snösäkerhet 8 → 9: Aiguille Rouge 3 226 m, skiresort "Glacier ski
--   resort", "Most of the slopes ... are located above 2,000 m". Ankaret.
-- Nybörjare 6 → 7: 52 % blå, Ski Club GB Beginner 4/5 "Each of the main
--   Les Arcs villages have a good beginner area and a number of free
--   lifts", skiresort "The conveyor belts in Arc 2000 are available for
--   beginners to use free of charge". Tignes 7 vid 55 %.
-- Avancerad 8 → 7: Ski Club GB Advanced 3/5 (La Plagne 4/5 har 7), 13 %
--   svart, svåraste nedfarten "Length 2 km · Elevation difference 550 m"
--   som La Plagnes.
-- Snowpark 7 → 6: skiresort snow-park 4/5, en FunPark ovanför Arc 1600,
--   två boardercrossbanor, "No halfpipe". Serre Chevalier har 6 med samma
--   utbud.
-- Afterski 6 står kvar (beslut D).
--
-- Texter:
--   Nackdelen: Ski Club GB "Fairly quiet nightlife", "Après in the other
--     villages is much more laid back"; Iglu "Arcs 1800 is where you'll
--     find the liveliest party scenes". Val d'Isère: skiresort après-ski
--     "Additional bars and restaurants in Tignes and Val d'Isère welcome
--     winter sports enthusiasts late into the night". Afterski 8 mot 6.
--   where_to_stay: Ski Club GB "1800 is the liveliest of the villages",
--     "The new Mille 8 development at 1800 ... our top choice", "2000 has
--     great access to the bowl", "Peisey and Vallandry offer slightly more
--     traditional accommodation and more chalets, all in a quieter, wooded
--     setting"; Snowthere "Arc 1950 is the least-friction base: car-free".
--     Årtal och Perriand: Wikipedia (som 029).
--   accommodation_zone: Arc 1800 läggs till. Booking söker på BOOKING_SOK,
--     inte på fältet.
update resorts
set lift_capacity_per_hour = 95700,
    snowmaking_coverage_pct = null,
    airport_distance_km = 171,
    transfer_minutes = 175,
    snow_guarantee_score = 9,
    beginner_score = 7,
    expert_score = 7,
    snowpark_score = 6,
    where_to_stay = 'Arc 1600 är den äldsta byn, från 1968, och den du når med bergbanan från tågstationen i Bourg-Saint-Maurice. Arc 1800 är störst och har mest kvällsliv, och med barn i skidskola bor du där, vid barnområdet Mille 8. Arc 2000 ligger högst, närmast den brantaste åkningen. Arc 1950 byggdes 2003–2008 i traditionell alpstil och är bilfri. Peisey och Vallandry är lugnare byar i skogen med fler chaletar. De tre äldre byarna ritades av arkitekten Charlotte Perriand.',
    accommodation_zone = 'Arc 1800, Arc 1950, Arc 2000'
where slug = 'les-arcs';

update resorts
set notes = replace(
  notes,
  'sammanlagt 425 kilometer.',
  'sammanlagt 425 kilometer. Vill du gå ut varje kväll är Les Arcs fel val. Kvällslivet samlas i Arc 1800, och i de andra byarna är det lugnt. I Val d''Isère håller barerna öppet in på natten.'
)
where slug = 'les-arcs'
  and notes like '%sammanlagt 425 kilometer.'
  and notes not like '%Kvällslivet samlas%';

-- ── La Plagne ─────────────────────────────────────────────────────────
--
-- Restid 158 / 164 → 153 / 148. OSRM 152,6 km, 148,1 min från terminalen.
-- Snösäkerhet 8 → 9: Bellecôteglaciären, topp 3 167 m (041). Ankaret,
--   som Les Arcs ovan.
-- Följdändring av Chamonix pistfördelning: svart 23 mot La Plagnes 12 är
--   1,9 gånger, inte "mer än tre gånger".
update resorts
set airport_distance_km = 153,
    transfer_minutes = 148,
    snow_guarantee_score = 9
where slug = 'la-plagne';

update resorts
set notes = replace(
  notes,
  'och Chamonix har mer än tre gånger så stor andel svart.',
  'och Chamonix har nästan dubbelt så stor andel svart.'
)
where slug = 'la-plagne'
  and notes like '%mer än tre gånger så stor andel svart%';

-- ── Serre Chevalier ───────────────────────────────────────────────────
--
-- Följdändring: svart 23 mot 13 är 1,8 gånger. Restiden från Lyon står
-- kvar (samma punkt, OSRM 200,0 km / 170,4 min).
update resorts
set notes = replace(
  notes,
  'Chamonix har tre gånger så stor andel svart.',
  'Chamonix har närmare dubbelt så stor andel svart.'
)
where slug = 'serre-chevalier'
  and notes like '%Chamonix har tre gånger så stor andel svart.%';

-- ── Alpe d'Huez ───────────────────────────────────────────────────────
--
-- skiresort "Alpe d'Huez":
--   lift_capacity_per_hour 100 000 → 110 052: "Total capacity 110052
--     Passengers/hour".
--   snowmaking_coverage_pct 50 → 35: "35 % of the slopes have snow-making
--     capabilities" (963 snökanoner).
-- Restid 160 / 135 → 154 / 127. OSRM från Lyon (041:s punkt), 153,7 km,
--   127,0 min.
-- Snösäkerhet 8 → 9: Pic Blanc 3 330 m med Sarenneglaciären, skiresort
--   "Glacier ski resort". Ankaret. Ski Club GB 3/5 och solsidan står som
--   motvikt i granskningen.
-- Nybörjare 6 → 7 (forskaren 8). Ski Club GB Beginner 5/5, skiresort 5/5,
--   Powderhounds "some of the best learn-to-ski slopes & facilities in the
--   world". Men blue_percent är 28, och poängen får inte stå i strid med
--   fältet: Tignes och Les Arcs har 7 vid 55 och 52 %. Beslut F.
-- Familj 7 → 8 (byn). skiresort families 5/5 med barnområden vid Signal
--   och Les Bergers; "Almost all accommodation have direct access to the
--   slopes"; Iglu "the chance for under 5s to ski for free".
-- Bykänsla 7 → 6 (byn). Wikipedia "the first platter lift for skiers was
--   opened in 1936"; Powderhounds "the sprawling, but ordered, modern
--   behemoth"; Ski Club GB "large apartment blocks" vid Les Bergers.
--
-- Texter:
--   notes: "250 kilometer pist" stryks (datafält i löptext). Två
--     nackdelar läggs till. Övningsområden och gröna nedfarter: Ski Club
--     GB, Iglu ("the Les Bergers area has 2 magic carpets, a drag lift and
--     4 gentle green runs"). Sarenne 16 km: skipass.alpedhuez.com (029).
--     Stänger i blåst: Ski Club GB "Steeper runs are high up and close in
--     bad, windy weather". Chamonix: Ski Club GB "All of the four main
--     resort areas have some epic steep terrain"; avancerad 10 mot 7.
--     1936: Wikipedia. Chamonix stad: 008/041; bykänsla 9 mot 6.
--   transport_info: "13,8 kilometer" är ett handskrivet avstånd och
--     stryks. Wikipedia "The 21 numbered hairpin bends of the climb".
update resorts
set lift_capacity_per_hour = 110052,
    snowmaking_coverage_pct = 35,
    airport_distance_km = 154,
    transfer_minutes = 127,
    snow_guarantee_score = 9,
    beginner_score = 7,
    family_friendly_score = 8,
    village_charm_score = 6,
    notes = 'Alpe d''Huez passar dig som ska lära dig åka eller vill åka långt på pist. Ovanför byn ligger övningsområden med rullband och gröna nedfarter tillbaka till husen, och från Pic Blanc går Sarenne, en svart nedfart på 16 kilometer som slutar i ravinen nedanför Auris. Drygt hälften av pisten är röd, och området hänger ihop med Vaujany, Oz-en-Oisans, Villard-Reculas och Auris. Vill du åka brant varje dag är Alpe d''Huez fel val. Den branta åkningen ligger högt och stänger när det blåser, och Chamonix har brant terräng i alla fyra områdena. Vill du bo i en by som fanns före liftarna är Alpe d''Huez också fel val. Byn växte upp kring skidliften från 1936 och består mest av hotell och lägenhetshus. Chamonix är en stad med liv året om.',
    transport_info = 'Flyg till Lyon. Sista biten går uppför vägen från Le Bourg-d''Oisans, med 21 numrerade hårnålskurvor.'
where slug = 'alpe-d-huez';

-- ── Chamonix ──────────────────────────────────────────────────────────
--
-- Summan av skiresorts fyra pistade poster (lib/delomraden.js):
-- Brévent–Flégère, Les Houches/Saint-Gervais, Grands Montets, Balme.
--   total_pistes_km 170 → 169: 56 + 55 + 29 + 29.
--   total_lifts 49 → 53: 17 + 15 + 8 + 13. 49 gick inte att härleda.
--   blue/red/black 20/40/40 → 33/44/23: Easy 11+25+6+13 = 55 km,
--     Intermediate 25+25+9+16 = 75 km, Difficult 20+5+14+0 = 39 km av 169.
--     Ingen migration satte 20/40/40, och ingen källa ger 40 % svart.
--     Ski Club GB (OnTheSnow) "33% Beginner, 44% Intermediate, 23%
--     Advanced".
--   lift_capacity_per_hour 55 000 → 82 556: 29 022 + 19 859 + 17 795 +
--     15 880 "Passengers/hour". Aiguille du Midi, utan pist, ingår inte.
--   snowmaking_coverage_pct 25 → null: ingen källa. Brévent–Flégère har
--     60 %, de andra posterna saknar tal. Som Les Arcs ovan.
-- Höjderna 1 035–3 842 (Aiguille du Midi) står kvar, se lib/delomraden.js.
-- Restid 90 / 75 → 87 / 71. OSRM 86,6 km, 71,2 min från terminalen.
-- Familj 6 → 5 (byn). Ski Club GB "the drive required to get to the ski
--   areas makes the centre of Chamonix itself a less than ideal base for
--   families. Either Argentière or Les Houches make for a better, more
--   family-friendly base"; Powderhounds "Limited ski-in ski-out
--   accommodation", Child Friendly 2.5.
-- Afterski 7 → 8 (byn). Ski Club GB Après 4/5 "Numerous bars line the
--   streets of central Chamonix, particularly on the Avenue Michel Croz
--   and the Rue du Dr Paccard ... Nightlife often continues into the small
--   hours"; Powderhounds Nightlife 4.
-- Nybörjare 4 står kvar som ankare trots 33 % blått: områdena hänger inte
--   ihop med lift, Ski Club GB Beginner 1/5.
--
-- Texter:
--   notes: "en femtedel" följer blue_percent 33 och blir "en tredjedel";
--     "hänger inte ihop" preciseras till "med lift" (Brévent och Flégère
--     når varandra).
--   where_to_stay: "sex kilometer bort" är ett handskrivet avstånd och
--     stryks. Familjemeningen: Ski Club GB, ovan.
update resorts
set total_pistes_km = 169,
    total_lifts = 53,
    blue_percent = 33,
    red_percent = 44,
    black_percent = 23,
    lift_capacity_per_hour = 82556,
    snowmaking_coverage_pct = null,
    airport_distance_km = 87,
    transfer_minutes = 71,
    family_friendly_score = 5,
    apres_ski_score = 8,
    where_to_stay = 'Bo i centrum om du vill gå till Brévent, som går upp direkt från stan och ligger i söderläge. Argentière längre upp i dalen ligger vid Grands Montets. Les Houches längre ner i dalen har långa nedfarter genom skogen och världscupens störtlopp på Kandahar, men Chamonix Le Pass gäller inte där. Med barn är Argentière eller Les Houches en bättre bas än centrum. Liftkortet räknas som busskort i dalen, och med gästkortet från ditt boende åker du gratis på Mont-Blanc Express.'
where slug = 'chamonix';

update resorts
set notes = replace(
  notes,
  'Bara en femtedel av pisten är blå, och dalens skidområden hänger inte ihop.',
  'Bara en tredjedel av pisten är blå, och dalens skidområden hänger inte ihop med lift.'
)
where slug = 'chamonix'
  and notes like '%Bara en femtedel av pisten är blå%';

-- ── Prishistorik ──────────────────────────────────────────────────────
--
-- Befintliga rader (022) uppdateras; inga nya rader.
--
-- Les 3 Vallées: dagspriset 82,00 från skiresort → 84,20 från ortens egen
-- sida. Löser frågan i docs/liftkortspriser.md ("alti-mag anger 84,20").
update public.lift_pass_prices
set day_price = 84.20,
    day_source = 'ortens egen sida',
    source_url = 'https://www.les3vallees.com/en/guide/all-skipasses/day-passes',
    captured_on = '2026-11-18'
where resort_slug in ('courchevel', 'meribel', 'val-thorens')
  and season = '2026/2027'
  and product = 'Les 3 Vallées';

update public.lift_pass_prices
set note = 'Samma kort och pris som Méribel och Val Thorens, precis som pist- och lifttalen är samma. Fast pris från 19.12.2026, vuxen 18–74. Sexdagarskortet 421 € på week-passes. Lördagar kostar ett dagskort 67,30 €.'
where resort_slug = 'courchevel'
  and season = '2026/2027'
  and product = 'Les 3 Vallées';

-- Alpe d'Huez, Tignes, Les Arcs: priserna bekräftade och oförändrade.
-- Raderna saknade källadress.
update public.lift_pass_prices
set source_url = 'https://skipass.alpedhuez.com/hiver/forfait/forfait-ski/',
    captured_on = '2026-11-18'
where resort_slug = 'alpe-d-huez' and season = '2026/2027'
  and product = 'Alpe d''Huez Grand Domaine';

update public.lift_pass_prices
set source_url = 'https://www.valdisere.com/preparer-mon-sejour/acheter-mon-forfait/',
    captured_on = '2026-11-18',
    note = 'Samma område som våra 300 km. Vinterpris 12.12.26–23.4.27, vuxen 19–64. Lågsäsong 67 / 402.'
where resort_slug = 'tignes' and season = '2026/2027'
  and product = 'Tignes–Val d''Isère';

update public.lift_pass_prices
set source_url = 'https://www.lesarcs-peiseyvallandry.com/en/forfaits_offre',
    captured_on = '2026-11-18'
where resort_slug = 'les-arcs' and season = '2026/2027'
  and product = 'Classic Pass Les Arcs/Peisey-Vallandry';

-- ── Kontroll före commit ──────────────────────────────────────────────
--
-- Orter med samma ski_area ska bära samma områdestal och områdesbetyg.
-- Skiljer något avbryts transaktionen och ingenting ändras.
do $$
declare
  fel text;
begin
  select string_agg(ski_area, ', ') into fel
  from (
    select ski_area
    from resorts
    where ski_area in ('Les 3 Vallées', 'Tignes/Val d''Isère')
    group by ski_area
    having count(distinct (snow_guarantee_score, beginner_score,
                           intermediate_score, expert_score, off_piste_score,
                           snowpark_score, crowd_score)) > 1
        or count(distinct (altitude_base, altitude_top, total_pistes_km,
                           blue_percent, red_percent, black_percent,
                           total_lifts, lift_capacity_per_hour,
                           snowmaking_coverage_pct, lift_pass_day_eur,
                           lift_pass_week_eur, season_start_month,
                           season_end_month)) > 1
  ) skiljer;

  if fel is not null then
    raise exception 'Områdestal eller områdesbetyg skiljer inom: %', fel;
  end if;
end $$;

commit;


-- ── Efterkontroll ─────────────────────────────────────────────────────
--
-- 1. Områdesbetygen, en rad per ort:
--
--   select ski_area, slug, snow_guarantee_score as sno,
--          beginner_score as nyb, intermediate_score as mell,
--          expert_score as avan, off_piste_score as off,
--          snowpark_score as park, crowd_score as plats,
--          family_friendly_score as fam, apres_ski_score as after,
--          village_charm_score as by
--   from resorts
--   where ski_area in ('Les 3 Vallées', 'Tignes/Val d''Isère')
--   order by ski_area, slug;
--
--   Förväntat:
--   Les 3 Vallées       courchevel   9 8 10 8 9 9 5 | 9 6 7
--   Les 3 Vallées       meribel      9 8 10 8 9 9 5 | 7 8 8
--   Les 3 Vallées       val-thorens  9 8 10 8 9 9 5 | 7 9 6
--   Tignes/Val d'Isère  tignes       9 7  8 9 9 8 5 | 6 7 5
--   Tignes/Val d'Isère  val-d-isere  9 7  8 9 9 8 5 | 6 8 7
--
-- 2. Samma sak som kontrollen ovan, som räkning:
--
--   select ski_area,
--          count(distinct (snow_guarantee_score, beginner_score,
--                          intermediate_score, expert_score,
--                          off_piste_score, snowpark_score,
--                          crowd_score)) as betyg,
--          count(distinct (total_pistes_km, total_lifts,
--                          lift_capacity_per_hour,
--                          snowmaking_coverage_pct)) as tal
--   from resorts
--   where ski_area is not null
--   group by ski_area having count(*) > 1;
--
--   Förväntat: 1 och 1 för båda områdena.
--
-- 3. Tal och restider:
--
--   select slug, total_pistes_km, total_lifts, blue_percent,
--          black_percent, lift_capacity_per_hour, snowmaking_coverage_pct,
--          lift_pass_day_eur, airport_distance_km, transfer_minutes,
--          transfer_note
--   from resorts
--   where slug in ('courchevel', 'meribel', 'val-thorens', 'tignes',
--                  'val-d-isere', 'les-arcs', 'la-plagne', 'alpe-d-huez',
--                  'chamonix')
--   order by slug;
--
--   Förväntat: chamonix 169 km, 53 liftar, 33/23, 82 556, null, 87/71.
--   les-arcs 95 700, null, 171/175. alpe-d-huez 110 052, 35, 154/127.
--   De tre i Les 3 Vallées 290 342, 60, 84 och 'med bil från Genève'.
--   tignes 176/175, val-d-isere 178/180, la-plagne 153/148.
--
-- 4. Texterna:
--
--   select slug, notes from resorts
--   where slug in ('meribel', 'val-thorens', 'tignes', 'les-arcs',
--                  'la-plagne', 'serre-chevalier', 'chamonix');
--
--   Förväntat: varje text har den nya meningen, och ingen innehåller
--   "tre gånger så stor andel svart" eller "en femtedel".
--
-- 5. Prisraderna:
--
--   select resort_slug, product, day_price, week_price, day_source,
--          source_url is not null as kalla
--   from lift_pass_prices
--   where resort_slug in ('courchevel', 'meribel', 'val-thorens',
--                         'alpe-d-huez', 'tignes', 'les-arcs');
--
--   Förväntat: Les 3 Vallées 84.20 / 421.00 'ortens egen sida', alla
--   sex med källa.
