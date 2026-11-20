-- 047 · Omgång 8: fem befintliga österrikiska orter granskade och rättade.
--
-- Underlaget är faktafilerna i projektmappen orter/ (st-anton.md,
-- ischgl.md, solden.md, kitzbuehel.md, mayrhofen.md) och granskningen
-- granskning-omgang8.md, alla 2026-11-18. Där granskningen och forskarnas
-- filer skiljer sig gäller granskningen. Varje tal i kärnfälten nedan är
-- läst på skiresort.com två gånger, av forskaren och av granskaren (curl,
-- råtext).
--
-- Alla orter är befintliga och publicerade. Här görs bara UPDATE och en
-- INSERT i lift_pass_prices. Varje sats säger nuvarande värde, nytt värde
-- och belägg.
--
-- Gemensamt:
--   · Restid och avstånd är OSRM från terminalen, avrundat till hel km och
--     hel minut. Innsbruck: 11.3508606, 47.2576023 (Nominatim
--     "aeroway=terminal", Fürstenweg 180, fäster 27 m bort). Salzburg:
--     Terminal 1, 12.9979009, 47.7914089 (fäster 39 m bort). Punkterna i
--     040 och 042 var flygplatsernas mittpunkter: Innsbruck 11.3418706,
--     47.2597258 fäster 289 m bort på Umfahrungsstraße West, Salzburg
--     13.0018306, 47.7934551 fäster 246 m bort på Innsbrucker
--     Bundesstraße. Lech-Zürs mättes från en tredje punkt. Därför mäts
--     här ALLA orter med Innsbruck eller Salzburg som port om, också de
--     sju från omgång 2 och 4 (samma regel som Genève i 046).
--   · Ski Arlberg: St. Anton och Lech-Zürs bär redan identiska områdestal
--     och områdesbetyg (040). Inget av dem ändras. Kontrollen längst ner
--     avbryter transaktionen om något skiljer.
--   · ski_area sätts till null för de åtta orter som inte delar område med
--     någon annan ort på sajten: Ischgl, Kitzbühel, Mayrhofen, Saalbach,
--     Obergurgl, Bad Gastein, Verbier och Madonna di Campiglio. Regeln är
--     den som 041–044 tillämpade (Les Deux Alpes, Serre Chevalier, Les
--     Arcs, La Plagne, Val Gardena, Alta Badia, Laax, Engelberg, St.
--     Moritz): ski_area finns för att flera orter ska kunna visa samma tal
--     utan att det ser ut som ett fel (CLAUDE.md, 004). Ortsidan skriver
--     "området du kommer åt med liftkortet" vid namnet, och det är fel för
--     Mayrhofen, Saalbach, Obergurgl och Bad Gastein, där veckokortet
--     gäller mer (LIFTKORT i lib/liftkortspriser.js). Vad området omfattar
--     står i varje orts text. Se granskningen, beslut C.
--
-- Texterna följer docs/copy.md: du-form, inga handskrivna avstånd, höjder
-- eller pisttal, och varje nackdel säger vem den gäller, ett faktum och en
-- annan ort på sajten. Källan till varje nytt namn står vid orten.
-- Kontrollen / — |, vilket|snarare än|(?<!\p{L})vykort/gu ger noll
-- träffar i de nya texterna.
--
-- Kör i Supabase SQL Editor efter 046. Allt körs i en transaktion.

begin;

-- ── St. Anton ─────────────────────────────────────────────────────────
--
-- Områdestalen stämmer (skiresort "Ski Arlberg", läst 2026-11-18):
-- "1304 m - 2811 m", "Total: 301 km", "Total: 85", "145948
-- Passengers/hour", ingen procentsats för konstsnö ("1107 Snow cannons").
-- Liftkortet 85 / 468 (030) stämmer med skiarlberg.at.
--
-- Restid 100 / 90 → 96 / 72. OSRM 95,7 km, 72,1 min från terminalen. 90
-- skrevs för hand i 007 och var aldrig mätt.
--
-- Betygen står kvar. Nybörjare 5 och gott om plats 6 är områdesbetyg och
-- delas med Lech-Zürs; Ski Club GB (Beginner 2/5, "Some pistes can get
-- dangerously crowded") mot skiresort (nybörjare 5/5, 43 % blått) avgör
-- inte en ändring för båda orterna. Se granskningen.
--
-- Texter:
--   notes: "på 2 811 meter" är ett datatal (altitude_top) i löptext och
--     stryks. Nackdel läggs till: Ski Club GB St Anton "This is not an
--     ideal resort for beginners. That being said, the lower village
--     slopes by Nasserein are gentle", "the slopes can get very crowded. A
--     group with beginners would be better placed to base themselves at
--     Lech or Zürs". Samma liftkort: skiarlberg.at. Rådet gäller var du
--     bor, inte nybörjarbetyget, som är områdets (som Méribel i 046).
--   where_to_stay: "ett fyrtiotal invånare på 1 793 meter" stryks.
--     Nasserein för barnfamiljer: Ski Club GB "base yourself away from the
--     noise of the town centre and closer to the nursery slopes up by
--     Nasserein"; skiresort families "Children's World Nasserein".
--     St. Christoph vid passet: 029 (stantonamarlberg.com).
--   accommodation_zone: Nasserein läggs till. Booking söker på
--     BOOKING_SOK, inte på fältet.
update resorts
set airport_distance_km = 96,
    transfer_minutes = 72,
    notes = 'St. Anton passar dig som vill åka brant och offpist och gå på afterski. Ski Arlberg binder ihop St. Anton med St. Christoph, Stuben, Zürs, Lech och Warth-Schröcken till ett skidområde. Från Valluga går baksidan ner mot Zürs, och den får du bara åka med guide. Hannes Schneider, som utvecklade Arlbergtekniken, var skidlärare här. Lär du dig åka är St. Anton fel by att bo i. Övningsbackarna ligger i Nasserein, och backarna ovanför byn är branta och fulla av folk. Ski Club of Great Britain råder grupper med nybörjare att bo i Lech eller Zürs, på samma liftkort.',
    where_to_stay = 'Galzigbahn går upp från St. Anton, och Nassereinbahn från Nasserein. Med små barn bor du i Nasserein, nära övningsbackarna och barnområdet och en bit från afterskin i centrum. St. Christoph högt uppe vid passet och Stuben ingår i samma skidområde.',
    accommodation_zone = 'St. Anton, Nasserein'
where slug = 'st-anton';

-- ── Lech-Zürs ─────────────────────────────────────────────────────────
--
-- Bara restiden. 112 / 90 → 115 / 96. OSRM 115,4 km, 96,0 min från
-- terminalen. 040 mätte från 11.3440, 47.2602, som fäster 264 m bort på
-- Kranebitter Allee väster om flygplatsen och gav en genväg.
update resorts
set airport_distance_km = 115,
    transfer_minutes = 96
where slug = 'lech-zuers';

-- ── Ischgl ────────────────────────────────────────────────────────────
--
-- skiresort "Ischgl/Samnaun – Silvretta Arena":
--   lift_capacity_per_hour 88 000 → 98 898: lifts-cable-cars "98898
--     Passengers/hour". Ingen migration satte 88 000.
--   snowmaking_coverage_pct 70 → 95: snow-reliability "1200 Snow cannons",
--     "95 % of the slopes have snow-making capabilities". Ingen migration
--     satte 70.
-- Höjder 1 360–2 872, 239 km, 21/58/21 och 45 liftar stämmer.
--
-- Veckokortet 451 → 385. ischgl.com säljer två sexdagarskort:
--   VIP Skipass "Valid at 46 facilities in Ischgl/Samnaun", "Only
--     available upon presentation of a valid Ischgl/Mathon guest card!",
--     "6 days 385.-".
--   Silvretta Skipass "Available for guests without a Ischgl/Mathon guest
--     card!", "valid at 75 facilities in Ischgl/Samnaun + Galtür + Kappl +
--     See", "6 days 451.-".
-- Regeln är veckokortet du faktiskt köper (docs/liftkortspriser.md). Den
-- som bor där sajten råder, i Ischgl eller Mathon (accommodation_zone),
-- kan bara köpa VIP-kortet, och det gäller exakt Silvretta Arena, området
-- våra tal avser. 451 är kortet för den som bor i grannbyarna; det står
-- som större kort i lib/liftkortspriser.js. Ski Club GB bekräftar båda:
-- "You can only buy the former however if you stay in Ischgl or Mathon".
-- Dagskortet 83 är samma för båda och oförändrat.
--
-- Restid 100 / 90 → 100 / 83. OSRM 99,8 km, 83,2 min.
--
-- Snowpark 7 → 8. skiresort snow-park 5/5: "It is one of the largest
--   funparks in the Alps and stretches across two sections", "At the end
--   of the snowpark, there is a BagJump cushion", vid Velill-liften.
--   inthesnow: "the Ischgl Snowpark is one of Austria's best". Saalbach
--   har 8 med Nitro Snowpark Leogang. Ankaret för 8 får Ischgl.
-- Övriga betyg står kvar, ankarna snö 9, afterski 10 och gott om plats 4
-- med dem (Ski Club GB Snow 5/5, "it is clear why the resort is always
-- busy").
--
-- Texter:
--   notes: "har 239 kilometer pist och" stryks (datatal i löptext, som St.
--     Antons 300 i 040). Resten från 029.
--   where_to_stay: vilket kort gästkortet ger. ischgl.com VIP och
--     Silvretta, ovan; skidbussen gratis med gästkort: 029
--     (ischgl.com/en/winter/ski-bus).
--   ski_area 'Silvretta Arena' → null (beslut C). notes nämner Silvretta
--     Arena och Samnaun.
update resorts
set lift_capacity_per_hour = 98898,
    snowmaking_coverage_pct = 95,
    lift_pass_week_eur = 385,
    airport_distance_km = 100,
    transfer_minutes = 83,
    snowpark_score = 8,
    ski_area = null,
    notes = 'Ischgl passar dig som vill åka mycket rött och gå på afterski. Silvretta Arena går över gränsen till Samnaun, den enda tullfria zonen i Schweiz. Är du nybörjare är Ischgl fel val. Bara en femtedel av pisten är blå, och Kitzbühel har blå pist på över hälften.',
    where_to_stay = 'Bo i Ischgl om du vill gå till liftarna. Tre gondoler går upp från byn: Silvrettabahn, Fimbabahn och Pardatschgratbahn. Bor du i Ischgl eller Mathon köper du VIP-kortet, som gäller Ischgl och Samnaun. Bor du i Galtür, Kappl eller See köper du Silvretta-kortet, som kostar mer och också gäller liftarna där. Skidbussen därifrån till Ischgl är gratis med gästkortet från ditt boende.'
where slug = 'ischgl';

-- ── Sölden ────────────────────────────────────────────────────────────
--
-- skiresort "Sölden":
--   total_pistes_km 146 → 144: "Total: 144 km". 146 kom från 007.
--   blue/red/black 52/28/20 → 53/28/19: "Easy 76.4 km (53 %)",
--     "Intermediate 40.1 km (28 %)", "Difficult 27.6 km (19 %)". 013.
--   lift_capacity_per_hour 48 000 → 71 025: "71025 Passengers/hour".
--     Ingen migration bakom 48 000.
--   snowmaking_coverage_pct 70 → 91: "507 Snow cannons", "91 % of the
--     slopes have snow-making capabilities". Ingen migration bakom 70.
-- Samma fyra avvikelser stod i granskning-omgang2.md och är nu omlästa.
-- Höjder 1 350–3 340, 31 liftar och säsong 10–5 stämmer.
--
-- Restid 95 / 75 → 85 / 76. OSRM 85,2 km, 76,1 min. 95 km hade ingen
-- mätning bakom sig (007).
--
-- Mellannivå 7 → 8. Ski Club GB Intermediate 5/5 (stjärnan har
--   alt-texten "Intermediate" i sidans kod, alltså inte härledd ur
--   ordningen), "The rest of the ski area is ideal for confident
--   intermediates upwards and you can get some huge vertical"; skiresort
--   slope-offering 5/5, "Glacier-Sölden ... Length 15 km · Elevation
--   difference 1970 m"; inthesnow "Wide, long blues and reds dominate".
--   8 är normal stor alport; Ischgl och Kitzbühel har 8.
-- Snowpark 6 → 7. skiresort snow-park 4/5, "Area 47 Snowpark Sölden and
--   the Funslope as well as Funcross Giggijoch"; Ski Club GB "Sölden is
--   also home to some excellent park facilities"; inthesnow "one of
--   Austria's best". Under Ischgl och Mayrhofen (8), som har större parker.
-- Nybörjare 6 står kvar: 53 % blått och skiresort 4/5 mot Ski Club GB 3/5
--   och "Resort runs from Giggijoch are steep and can become icy and
--   bumpy". Avancerad 8 står kvar (SVAGT, Ski Club 3/5 mot skiresort 5/5
--   och 19 % svart).
--
-- Texter:
--   notes: två nackdelar läggs till. Ski Club GB "should head straight up
--     to the mellow and sunny slopes at Giggijoch", "Resort runs from
--     Giggijoch are steep and can become icy and bumpy". Saalbach:
--     skiresort Skicircus "In Hinterglemm and Saalbach, there are large
--     practice areas located directly in the valley" (040), nybörjare 9
--     mot 6. Snowthere "The village is a linear strip along a main road",
--     "Skip If ... Travelling with under-5s"; skiresort apres-ski "In the
--     village of Sölden, the festivities continue late into the night".
--     Obergurgl: skiresort Gurgl beginners (Krumpwasser, Wiesen,
--     Mahdstuhl vid byn) och Ski Club GB Obergurgl "Little going on later
--     at night" (040); familj 8 mot 6, afterski 6 mot 9. "3 000 meter" är
--     en tröskel, inget datafält, och står kvar.
--   where_to_stay: "på 2 090 meter" stryks (skiresort anger 2 070 för
--     Hochsölden; inget datafält). Ski Club GB "some accommodation can be a
--     little walk from the two principal access lifts".
update resorts
set total_pistes_km = 144,
    blue_percent = 53,
    red_percent = 28,
    black_percent = 19,
    lift_capacity_per_hour = 71025,
    snowmaking_coverage_pct = 91,
    airport_distance_km = 85,
    transfer_minutes = 76,
    intermediate_score = 8,
    snowpark_score = 7,
    notes = 'Sölden passar dig som vill vara säker på snön och gå på afterski. Skidområdet har två glaciärer, Rettenbach och Tiefenbach, och tre toppar med lift över 3 000 meter: Gaislachkogl, Tiefenbachkogl och Schwarze Schneid. På Rettenbachglaciären körs världscupens första tävlingar varje oktober. Har du aldrig stått på skidor är Sölden fel val. Det bästa övningsområdet ligger uppe vid Giggijoch, och nedfarterna därifrån mot byn är branta och kan bli isiga. Saalbach har stora övningsområden nere i byarna. Har du små barn och vill ha lugna kvällar är Sölden också fel val. Byn ligger utdragen längs vägen genom dalen, och afterskin håller på till sent. Obergurgl längre upp i samma dal har övningsliftarna vid byn och lite som händer på kvällen.',
    where_to_stay = 'Giggijochbahn och Gaislachkoglbahn går upp från byn, så bo nära någon av dem. Byn är lång, och från boendet längst bort tar du skidbussen. I Hochsölden högt uppe på berget ligger hotellen direkt vid pisten.'
where slug = 'solden';

-- ── Kitzbühel ─────────────────────────────────────────────────────────
--
-- skiresort "KitzSki – Kitzbühel/Kirchberg":
--   lift_capacity_per_hour 71 000 → 110 323: "110323 Passengers/hour".
--     Ingen migration bakom 71 000.
--   snowmaking_coverage_pct 80 → 90: "1260 Snow cannons", "90 % of the
--     slopes have snow-making capabilities". Ingen migration bakom 80.
-- Höjder 800–2 000, 188 km, 54/35/11 och 58 liftar stämmer.
--
-- Port Innsbruck → Salzburg. Båda går att boka från Arlanda i vinter
-- (flightconnections ARN–SZG: Norwegian och SAS; ARN–INN: SAS en gång i
-- veckan från januari; 040 för Norwegians och SAS dagar). Regeln i
-- CLAUDE.md kräver en bokbar port, inte den närmaste; när båda är
-- bokbara väljs den med kortast uppmätt restid och flest avgångar.
-- Salzburg ger 79 min mot Innsbrucks 89, och Saalbach och Zell am
-- See-Kaprun i samma del av Alperna har Salzburg. inthesnow "Nearest
-- airport: Salzburg".
-- Restid 100 / 75 → 74 / 79. OSRM från Salzburg Terminal 1: 73,8 km,
-- 78,7 min. (Från Innsbruck-terminalen: 97,9 km, 89,4 min.) 75 skrevs för
-- hand i 007.
--
-- Nybörjare 6 → 7. skiresort beginners 5/5 "Beginners can use 10
--   practice facilities in the valley free of charge"; Snowthere "More
--   than half of its 188km is rated easy"; inthesnow "dedicated nursery
--   areas at Pass Thurn and gentle blues around Kirchberg". 54 % blått;
--   Tignes (55 %) och Les Arcs (52 %) har 7. Mot: Ski Club GB Beginner
--   2/5, "the local nursery slopes in Kitzbühel are slightly limited".
--   SVAGT, ett steg.
-- Avancerad 7 → 6. Ski Club GB Advanced 2/5, "Not the best for advanced
--   skiers unless there is fresh snow", "The advanced options are somewhat
--   limited"; 11 % svart. Zell am See-Kaprun har 6 på samma Ski
--   Club-formulering (040).
-- Afterski 9 och gott om plats 4 står kvar som ankare (Ski Club GB Après
--   3/5 och "Still some queues during peak times"). Se granskningen.
--
-- Texter:
--   notes: "188 kilometer" och "2 000 meter" är datatal i löptext och
--     stryks. Konstsnön, som CLAUDE.md nämner som Kitzbühels nackdel, får
--     belägg: Ski Club GB "Snow quality lower down can suffer", "One of
--     the world's best snowmaking systems"; inthesnow "Despite its
--     relatively low altitude, Kitzbühel is consistently snow-sure thanks
--     to excellent snowmaking"; skiresort 90 %. Söldens glaciärer: 029.
--     Brant: Ski Club GB, ovan; St. Anton avancerad 10. "Toppen ligger
--     lågt för att vara i Alperna" som i Saalbachs text (040).
--   where_to_stay: Ski Club GB "the resort does spread widely so be
--     prepared to walk to the lifts or to jump on a bus".
--   transport_info: porten först.
--   ski_area 'KitzSki' → null (beslut C). notes nämner KitzSki och
--     where_to_stay Kirchberg.
update resorts
set lift_capacity_per_hour = 110323,
    snowmaking_coverage_pct = 90,
    nearest_airport = 'Salzburg',
    airport_distance_km = 74,
    transfer_minutes = 79,
    transfer_note = 'med bil från Salzburg',
    beginner_score = 7,
    expert_score = 6,
    ski_area = null,
    notes = 'Kitzbühel passar dig som vill bo i en gammal stad och åka skidor från den. Stadskärnan är i stort sett bilfri, och över hälften av pisten i KitzSki är blå. På Hahnenkamm går Streif, där Hahnenkammloppet körts sedan 1937. Vill du åka i slutet av säsongen är Kitzbühel fel val. Toppen ligger lågt för att vara i Alperna, och backarna hålls öppna med konstsnö. Sölden har två glaciärer. Vill du åka brant varje dag är Kitzbühel också fel val. Den branta åkningen är begränsad och räcker inte långt utan nysnö, och St. Anton har mycket mer brant åkning.',
    where_to_stay = 'Bor du i stadskärnan har du restaurangerna och butikerna runt dig och nära till Hahnenkammbahn. Staden är stor, så bor du utanför kärnan tar du skidbussen till liften. Kirchberg är grannorten med egen ingång till samma skidområde.',
    transport_info = 'Flyg till Salzburg eller Innsbruck. Kitzbühel Hauptbahnhof har fjärrtåg från Innsbruck och Graz.'
where slug = 'kitzbuehel';

-- ── Mayrhofen ─────────────────────────────────────────────────────────
--
-- skiresort "Mayrhofen – Penken/Ahorn/Rastkogel/Eggalm (Mountopolis)":
--   lift_capacity_per_hour 44 000 → 96 281: "96281 Passengers/hour".
--     Ingen migration bakom 44 000.
--   snowmaking_coverage_pct 75 → 95: "360 Snow cannons", "95 % of the
--     slopes have snow-making capabilities". Ingen migration bakom 75.
-- Höjder 630–2 500, 142 km, 31/46/23 och 61 liftar stämmer.
--
-- Restid 80 / 60 → 74 / 68. OSRM 74,3 km, 68,0 min. 60 skrevs för hand i
-- 007. Salzburg ger 172 km / 125 min och är ingen bättre port.
--
-- Avancerad 8 → 7. Ski Club GB Advanced 2/5, "Elsewhere the blacks are
--   much less intimidating", "Few challenges for experts, relying on
--   powder for off piste"; Iglu "If the focus is very much on advanced
--   skiing though, there are better options". Mot: skiresort 5/5 och 23 %
--   svart. 7 är normal alport.
-- Snowpark 7 → 8. skiresort snow-park 5/5, "PenkenPark has 5 different
--   areas: Pro Area, Advanced Area, Medium Area, MediumJib Area, and
--   KidsPark"; Iglu "the Vans Penken Park which is considered to be one
--   of the best snowparks in the Alps"; inthesnow "one of Austria's
--   best-known snowparks". Ankaret för 8 får Mayrhofen.
-- Bykänsla 8 → 7. Ski Club GB "Even as the village has grown, the
--   buildings have stayed traditional in design and for its size it is
--   quite attractive", "in mid-winter the town is often in the shade";
--   inthesnow "a lively alpine town rather than a small village",
--   "mix of traditional chalets and modern hotels". Ischgl (inthesnow "a
--   blend of traditional Tyrolean charm and modern development") och
--   Saalbach har 7. SVAGT, ett steg.
--
-- Texter:
--   notes: första meningen "vill åka brant" stöddes bara av avancerad 8
--     och skrivs om. "630 meter" är ett datatal (altitude_base) och
--     stryks. skiresort "From Penken, you take the 3-S cable car down to
--     the valley". Två nackdelar: Ski Club GB, ovan, och St. Anton
--     avancerad 10; Snowthere "there is no ski-in/ski-out anywhere in the
--     resort", och Hochgurgl "med hotellen nära pisten" ur Obergurgls text
--     (040, Ski Club GB Obergurgl). Harakiri 78 % och Hintertux: 029.
--   where_to_stay: Ski Club GB "Try and stay as close to the Penkenbahn as
--     possible for the easiest access to the slopes"; skiresort "There is
--     only a valley run from the Ahorn down to Mayrhofen".
--   ski_area 'Mountopolis' → null (beslut C). Mountopolis är Mayrhofner
--     Bergbahnens namn på upplevelseutbudet ("a first-class adventure
--     world under the name Mountopolis", skiresort), och veckokortet
--     gäller hela Zillertal, så ortsidans "området du kommer åt med
--     liftkortet" var fel.
update resorts
set lift_capacity_per_hour = 96281,
    snowmaking_coverage_pct = 95,
    airport_distance_km = 74,
    transfer_minutes = 68,
    expert_score = 7,
    snowpark_score = 8,
    village_charm_score = 7,
    ski_area = null,
    notes = 'Mayrhofen passar dig som åker rött och vill gå på afterski i byn. På Penken går Harakiri, som orten kallar Österrikes brantaste pist, med 78 procents lutning. Byn ligger lågt, så åkningen sker uppe på Penken och Ahorn, och från Penken åker du gondolen ner på eftermiddagen. Hintertuxer Gletscher längre in i Zillertal har åkning året runt. Vill du åka brant hela veckan är Mayrhofen fel val. Utöver Harakiri är de svarta pisterna mindre krävande, och St. Anton har mycket mer brant åkning. Vill du bo vid pisten är Mayrhofen också fel val. Inget boende i orten ligger vid backen, medan hotellen i Hochgurgl ovanför Obergurgl ligger nära pisten.',
    where_to_stay = 'Bo nära Penkenbahn, som går från byn upp till Penken. Ahornbahn går till Ahorn, där nedfarterna mest är blå och röda och där du kan åka skidorna ner till byn. Horbergbahn från Stockach går upp till Horberg i samma område. Gratis skidbussar går till dalstationerna i Mayrhofen och Hippach.'
where slug = 'mayrhofen';

-- ── Övriga orter med Innsbruck eller Salzburg som port ────────────────
--
-- Restiden mätt om från terminalerna, OSRM. Nu → nytt (km, min).
--   Obergurgl    98 / 88  → 97 / 85   (97,2 km, 85,5 min)
--   Val Gardena 117 / 103 → 117 / 101 (116,7 km, 100,9 min)
--   Alta Badia  135 / 125 → 134 / 123 (134,2 km, 123,2 min)
--   Saalbach     88 / 88  → 86 / 87   (86,4 km, 86,8 min)
--   Zell am See-Kaprun 78 / 77 → 77 / 75 (76,5 km, 75,3 min)
--   Bad Gastein  97 / 80  → 96 / 79   (95,8 km, 78,5 min)
-- Ingen text nämner talen.
update resorts set airport_distance_km = 97, transfer_minutes = 85
where slug = 'obergurgl';
update resorts set airport_distance_km = 117, transfer_minutes = 101
where slug = 'val-gardena';
update resorts set airport_distance_km = 134, transfer_minutes = 123
where slug = 'alta-badia';
update resorts set airport_distance_km = 86, transfer_minutes = 87
where slug = 'saalbach';
update resorts set airport_distance_km = 77, transfer_minutes = 75
where slug = 'zell-am-see-kaprun';
update resorts set airport_distance_km = 96, transfer_minutes = 79
where slug = 'bad-gastein';

-- ── ski_area för orter utan grannort på sajten ────────────────────────
--
-- Beslut C. Ischgl, Kitzbühel och Mayrhofen ovan. Här de fem andra som
-- bar ett områdesnamn utan att dela det med någon ort på sajten. Varje
-- orts text säger redan vad området omfattar:
--   Saalbach     'Skicircus Saalbach Hinterglemm Leogang Fieberbrunn'
--                (notes: "en av byarna i Skicircus")
--   Obergurgl    'Obergurgl-Hochgurgl' (notes: Hochgurgl, Top-Express)
--   Bad Gastein  'Schlossalm–Angertal–Stubnerkogel' (notes: områdets namn
--                och Bad Hofgastein)
--   Verbier      '4 Vallées' (notes: "skidområdet 4 Vallées binder ihop
--                Verbier med Nendaz, Veysonnaz, Thyon och La Tzoumaz")
--   Madonna di Campiglio 'Skiarea Campiglio Dolomiti di Brenta'
-- Saalbach, Obergurgl och Bad Gastein har veckokort som gäller mer än
-- området (Ski ALPIN CARD, Ötztal Superskipass, Ski amadé), så ortsidans
-- "området du kommer åt med liftkortet" var fel för dem.
update resorts
set ski_area = null
where slug in ('saalbach', 'obergurgl', 'bad-gastein', 'verbier',
               'madonna-di-campiglio');

-- ── Prishistorik ──────────────────────────────────────────────────────
--
-- Ischgl: raden från 022 bär 83 / 451 under produkten "Silvretta Arena
-- Ischgl–Samnaun". Talen är Silvretta-kortets, som gäller fyra områden,
-- och produkten byter namn till det kortet så att nästa års jämförelse
-- avser samma produkt. VIP-kortet, som veckopriset i resorts nu följer,
-- får en egen rad.
update public.lift_pass_prices
set product = 'Silvretta Ski Pass',
    source_url = 'https://www.ischgl.com/en/winter/operating-times-prices/skipass-prices-silvretta',
    captured_on = '2026-11-18',
    note = 'Säljs bara till gäster utan gästkort från Ischgl eller Mathon. Gäller 75 liftar i Ischgl/Samnaun, Galtür, Kappl och See. Ett pris hela säsongen 26.11.2026–2.5.2027.'
where resort_slug = 'ischgl'
  and season = '2026/2027'
  and product = 'Silvretta Arena Ischgl–Samnaun';

insert into public.lift_pass_prices
  (resort_slug, season, currency, day_price, week_price, product,
   day_source, week_source, source_url, captured_on, note)
values
('ischgl', '2026/2027', 'EUR', 83.00, 385.00, 'VIP Skipass Ischgl/Samnaun',
 'ortens egen sida', 'ortens egen sida',
 'https://www.ischgl.com/en/winter/operating-times-prices/skipass-prices-vip', '2026-11-18',
 'Säljs bara med gästkort från Ischgl eller Mathon. Gäller 46 liftar i Ischgl/Samnaun, samma område som våra tal. Ett pris hela säsongen utom VIP-erbjudanden 26.11–18.12.2026 och 3.4–2.5.2027. Priserna kalkylerade per juli 2026 och kan justeras.')
on conflict (resort_slug, season, product) do nothing;

-- Mayrhofen: prislistan (2026-27_Prices Winter_EN.pdf) skriver "1 DAY
-- FROM 08.00 A.M. € 82,00" utan villkor om köp på nätet.
update public.lift_pass_prices
set note = 'Dagskort för Mayrhofen ensamt, från 08.00.'
where resort_slug = 'mayrhofen'
  and season = '2026/2027'
  and product = 'Mayrhofen';

-- ── Kontroll före commit ──────────────────────────────────────────────
--
-- St. Anton och Lech-Zürs delar Ski Arlberg och ska bära samma
-- områdestal och områdesbetyg. Skiljer något avbryts transaktionen och
-- ingenting ändras. Samma kontroll som 046 för Les 3 Vallées och
-- Tignes/Val d'Isère.
do $$
declare
  fel text;
  antal int;
begin
  select count(*) into antal from resorts where ski_area = 'Ski Arlberg';
  if antal <> 2 then
    raise exception 'Ski Arlberg ska ha två orter, har %', antal;
  end if;

  select string_agg(ski_area, ', ') into fel
  from (
    select ski_area
    from resorts
    where ski_area = 'Ski Arlberg'
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
-- 1. Betygen, en rad per ort:
--
--   select slug, snow_guarantee_score as sno, beginner_score as nyb,
--          intermediate_score as mell, expert_score as avan,
--          off_piste_score as off, snowpark_score as park,
--          crowd_score as plats, family_friendly_score as fam,
--          apres_ski_score as after, village_charm_score as by
--   from resorts
--   where slug in ('st-anton', 'lech-zuers', 'ischgl', 'solden',
--                  'kitzbuehel', 'mayrhofen')
--   order by slug;
--
--   Förväntat:
--   ischgl      9 5 8 7 7 8 4 | 6 10 7
--   kitzbuehel  7 7 8 6 6 6 4 | 6 9 10
--   lech-zuers  8 5 8 10 10 6 6 | 8 6 9
--   mayrhofen   7 5 7 7 7 8 5 | 7 9 7
--   solden      9 6 8 8 7 7 5 | 6 9 6
--   st-anton    8 5 8 10 10 6 6 | 6 10 9
--
-- 2. Tal och restider:
--
--   select slug, ski_area, total_pistes_km, blue_percent, black_percent,
--          lift_capacity_per_hour, snowmaking_coverage_pct,
--          lift_pass_week_eur, nearest_airport, airport_distance_km,
--          transfer_minutes, transfer_note
--   from resorts
--   where country = 'Austria'
--      or slug in ('val-gardena', 'alta-badia', 'verbier',
--                  'madonna-di-campiglio')
--   order by slug;
--
--   Förväntat: ischgl 98 898, 95, 385, 100/83. solden 144 km, 53/19,
--   71 025, 91, 85/76. kitzbuehel 110 323, 90, Salzburg 74/79 'med bil
--   från Salzburg'. mayrhofen 96 281, 95, 74/68. st-anton 96/72,
--   lech-zuers 115/96. obergurgl 97/85, saalbach 86/87,
--   zell-am-see-kaprun 77/75, bad-gastein 96/79, val-gardena 117/101,
--   alta-badia 134/123. ski_area 'Ski Arlberg' för st-anton och
--   lech-zuers, null för alla andra i urvalet.
--
-- 3. Inget områdesnamn står ensamt:
--
--   select ski_area, count(*) from resorts
--   where ski_area is not null group by ski_area order by 1;
--
--   Förväntat: Les 3 Vallées 3, Matterhorn Ski Paradise 2, Ski Arlberg 2,
--   Tignes/Val d'Isère 2.
--
-- 4. Prisraderna:
--
--   select resort_slug, product, day_price, week_price, note
--   from lift_pass_prices
--   where resort_slug in ('ischgl', 'mayrhofen') and season = '2026/2027'
--   order by resort_slug, product;
--
--   Förväntat: ischgl 'Silvretta Ski Pass' 83 / 451 och 'VIP Skipass
--   Ischgl/Samnaun' 83 / 385. mayrhofen-raden 'Mayrhofen' utan "på
--   nätet".
