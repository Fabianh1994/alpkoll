-- 048 · Omgång 9: sex befintliga orter i Schweiz och Italien granskade och
-- rättade.
--
-- Underlaget är faktafilerna i projektmappen orter/ (zermatt.md,
-- saas-fee.md, verbier.md, cortina-d-ampezzo.md, livigno.md,
-- madonna-di-campiglio.md) och granskningen granskning-omgang9.md, alla
-- 2026-11-18. Där granskningen och forskarnas filer skiljer sig gäller
-- granskningen. Varje tal i kärnfälten nedan är läst på skiresort.com två
-- gånger, av forskaren och av granskaren (curl, råtext).
--
-- Alla orter är befintliga och publicerade. Här görs bara UPDATE. Varje
-- sats säger nuvarande värde, nytt värde och belägg.
--
-- Gemensamt:
--   · Restid och avstånd är OSRM från terminalen, avrundat till hel km och
--     hel minut. Genève 6.1090, 46.2300 (som 046, fäster 2 m bort).
--     Venedig 12.3399025, 45.5068583 (terminalbyggnaden, Nominatim;
--     fäster 94 m bort på Viale Luigi Broglio framför terminalen). Verona
--     10.9060130, 45.4021665 (Nominatim "Terminal Partenze", fäster 39 m
--     bort). Bergamo 9.6950225, 45.6667459 (Nominatim "Arrivi Schengen",
--     fäster 11 m bort). Forskarna mätte Bergamo från flygplatsens
--     mittpunkt 9.6987542, 45.6708936, som fäster 507 m bort norr om
--     terminalen och gav omkring tio minuter för lång rutt; deras tal för
--     Livigno (210 / 238) och Madonna från Bergamo (184 / 172) tas inte
--     in. Se granskningen, tabell 3.
--   · Portarna står kvar: Venedig för Cortina och Verona för Madonna di
--     Campiglio. CLAUDE.md: "direktflyg krävs inte". Forskarnas byten
--     (Innsbruck respektive Bergamo) är ägarbeslut, med båda alternativens
--     tal i granskningen.
--   · Zermatt: transfer_minutes följer 005, som satte restiden med tåg
--     eftersom bilen inte når byn ("Resan den beskrev går inte att
--     genomföra"). Talet är nu uppmätt i SBB:s tidtabell för januari
--     2027. Bil till Täsch är ägarbeslut.
--   · Matterhorn Ski Paradise: Zermatt och Cervinia bär redan identiska
--     områdestal och områdesbetyg (042). Inget av dem ändras. Kontrollen
--     längst ner avbryter transaktionen om något skiljer. Pris och säsong
--     ingår inte i kontrollen: Cervinia säljer det internationella kortet
--     i euro till fast pris och öppnar i oktober, Zermatt i franc med
--     dynamiskt pris och i november (042).
--   · ski_area: 047 satte null för Verbier och Madonna di Campiglio. 048
--     rör inte fältet, men kontrollen först avbryter om 047 inte är körd.
--   · Betyg följer ankarna i docs/poangskala.md. Afterski för byar med Ski
--     Club GB 2/5: 6 när en annan oberoende källa beskriver ett kvällsliv
--     (omgång 7). Snowpark 4 när skiresort skriver att parken saknas och en
--     annan källa nämner en (Engelberg, omgång 5).
--
-- Texterna följer docs/copy.md: du-form, inga handskrivna avstånd, höjder
-- eller pisttal, och varje nackdel säger vem den gäller, ett faktum och en
-- annan ort på sajten. Källan till varje nytt namn står vid orten.
-- Kontrollen / — |, vilket|snarare än|(?<!\p{L})vykort/gu ger noll
-- träffar i de nya texterna och i transfer_note.
--
-- Kör i Supabase SQL Editor efter 046 och 047. Allt körs i en transaktion.

begin;

-- ── Förutsättning ─────────────────────────────────────────────────────
--
-- 047 satte ski_area = null för Verbier och Madonna di Campiglio. Står
-- namnen kvar är 047 inte körd, och då avbryts 048 innan något ändras.
do $$
begin
  if exists (select 1 from resorts
             where slug in ('verbier', 'madonna-di-campiglio')
               and ski_area is not null) then
    raise exception 'Kör 047 före 048 (ski_area för Verbier eller Madonna di Campiglio är inte null)';
  end if;
end $$;

-- ── Zermatt ───────────────────────────────────────────────────────────
--
-- skiresort "Zermatt/Breuil-Cervinia/Valtournenche – Matterhorn": "1562 m
-- - 3899 m (Difference 2337 m)", "Total: 322 km", 75/220/27 km
-- (23/69/8 %), "Total: 51", "96074 Passengers/hour", "80 % of the slopes
-- have snow-making capabilities". Allt stämmer; inget områdestal ändras.
-- Liftkortet 122 / 574 CHF (036) och säsongen 11–5 (042) står kvar.
--
-- Restid 230 / 210 → 235 / 232.
--   transfer_minutes: SBB (transport.opendata.ch), Genève-Aéroport →
--     Zermatt lördag 16 januari 2027: "08:55 → 12:47, 00d03:52:00, 1
--     byte (IR90, R42)", varje timme. 210 skrevs för hand i 005. Forskaren
--     läste 4:05 i tidtabellen för 28 november, före tidtabellsskiftet i
--     december. Ski Club GB: "just under four hours from Geneva".
--   airport_distance_km: OSRM till byns koordinat 234,9 km (som alla
--     orter). Bilen stannar i Täsch: 229,2 km, 167,2 min, och pendeltåget
--     Täsch–Zermatt tar 12 minuter (SBB).
--   transfer_note 'med tåg — byn är bilfri' → 'med tåg från Genève'.
--     Tankstrecket är en slutkläm (docs/copy.md), och "från Genève" följer
--     formen i 041–047. Att byn är bilfri står i where_to_stay.
--
-- Betygen står kvar. Snö 10 är ankaret. Afterski 8 mot Ski Club GB 3/5
-- (alt-texten "Aprés"), skiresort 4/5 och Iglu om Bahnhofstrasse: SVAGT,
-- Kitzbühel har 9 med samma Ski Club-betyg.
--
-- Texter:
--   notes: "322 kilometer pist och når 3 899 meter" är datatal i löptext
--     och stryks. Två nackdelar, som CLAUDE.md nämner ("Zermatt är dyrt"):
--     skiresort beginners "There is no easy valley run to Zermatt, so
--     beginners will need to take the lifts back down to the valley";
--     Alta Badia nybörjare 9, "nästan hela området nås via lätta
--     nedfarter" (poangskala.md, 042). Nybörjare är 6, normal alport, så
--     meningen är ett råd och inte "fel val". Pris: 122 / 574 CHF (036)
--     mot Cervinias 88 / 464,50 € för samma internationella kort, fast
--     pris 24.10.26–2.5.27 (042); Ski Club GB Value 2/5.
--   transport_info: SBB Zürich Flughafen → Zermatt "09:46 → 13:14,
--     00d03:28:00" mot 3:52 från Genève; Ski Club GB "around three and a
--     half from both Zürich and Basel".
update resorts
set airport_distance_km = 235,
    transfer_minutes = 232,
    transfer_note = 'med tåg från Genève',
    notes = 'Zermatt passar dig som vill åka brant och offpist med säker snö. I Matterhorn Ski Paradise åker du från Plateau Rosa över gränsen till Cervinia i Italien. På glaciären bakom Klein Matterhorn går det att åka även under delar av sommaren. Lär du dig åka tar du liften ner till byn på eftermiddagen, eftersom ingen lätt nedfart går hela vägen till Zermatt. I Alta Badia nås nästan hela området via lätta nedfarter. Vill du hålla nere kostnaden är Zermatt fel val. Liftkortet för hela området kostar mer här än i Cervinia, som säljer samma kort till fast pris hela säsongen.',
    transport_info = 'Flyg till Genève eller Zürich och ta tåget via Visp. Från Zürich är tågresan kortare. Kör du ställer du bilen i Täsch och tar pendeltåget därifrån in till Zermatt.'
where slug = 'zermatt';

-- ── Saas-Fee ──────────────────────────────────────────────────────────
--
-- skiresort "Saas-Fee":
--   snowmaking_coverage_pct 30 → 45: snow-reliability "95 Snow cannons",
--     "45 % of the slopes have snow-making capabilities". Ingen migration
--     satte 30.
-- Höjder 1 800–3 573, 101 km, 21/59/20, 23 liftar och 25 984 stämmer.
-- Liftkortet 86 / 419 CHF (035) stämmer med saas-fee.ch (forskaren).
--
-- Restid 250 / 180 → 226 / 165. OSRM 225,5 km, 164,8 min till byns
-- koordinat, som fäster 74 m bort vid parkeringshuset vid infarten. 180
-- var en handuppskattning i 009 ("cirka 3 timmar med bil").
--
-- Afterski 7 → 6 (byn). Ski Club GB Après 2/5 (alt-text): "there is a
--   decent après scene, especially on the terraces along the main
--   street". skiresort apres-ski 4/5: "On the party mile of Saas-Fee in
--   Gletscherstraße … During the week, things are a bit quieter." Iglu:
--   "Zur Muhle and Black Bull near the ski school area provide music and
--   drinks to a lively après crowd". Regeln från omgång 7: Ski Club 2/5
--   och en annan källa om kvällslivet ger 6, som La Plagne och Courchevel.
-- Övriga betyg står kvar. Snö 9 är ankaret.
--
-- Texter:
--   notes: "når 3 573 meter" och "Pisten är 101 kilometer" är datatal i
--     löptext och stryks (101 rättades redan en gång med replace() i
--     038). Två nackdelar:
--     Offpist: Ski Club GB "the rocky and glacial terrain limits the off
--       piste options", "Need to wait until later in the season for the
--       best off piste". Verbier: skiresort 4 Vallées experts-freeriders
--       "the final of the Free Ride World Tour … has been held in Verbier
--       every year", offpist 10 mot 7.
--     Skugga: Ski Club GB "It can be shady and cold in the village, but
--       spring is fantastic", "The only major issue is a lack of sun in
--       midwinter". Verbier: Ski Club GB Verbier "Verbier itself sprawls
--       out over a sunny plateau"; en.wikipedia "a south oriented
--       terrace".
--     Metro Alpin, Mittelallalin, bilfritt sedan 1951 och de 13 topparna
--     över 4 000 meter: 029. "4 000 meter" är en tröskel, inget datafält.
update resorts
set snowmaking_coverage_pct = 45,
    airport_distance_km = 226,
    transfer_minutes = 165,
    apres_ski_score = 6,
    notes = 'Saas-Fee passar dig som vill ha säker snö och bo i en bilfri by. Metro Alpin, en bergbana i tunnel, går upp till Mittelallalin. Byn har varit bilfri sedan 1951 och är omgiven av 13 toppar över 4 000 meter. Bara en femtedel av pisten är blå. Vill du åka offpist är Saas-Fee fel val. Klippor och glaciär begränsar åkningen utanför pist, och den bästa snön kommer sent på säsongen. Verbier har finalen i Freeride World Tour. Åker du mitt i vintern ligger byn mycket i skugga och är kall, och Saas-Fee är som bäst på våren. Verbier ligger på en solig terrass.'
where slug = 'saas-fee';

-- ── Verbier ───────────────────────────────────────────────────────────
--
-- skiresort "4 Vallées – Verbier/La Tzoumaz/Nendaz/Veysonnaz/Thyon":
--   snowmaking_coverage_pct 35 → 95: snow-reliability "2400 Snow cannons",
--     "95 % of the slopes have snow-making capabilities". Ingen migration
--     satte 35.
--   season_start_month 12 → 11: "Current season: 2026-11-07 -
--     2027-04-25"; verbier4vallees.ch "Ski season: from early November
--     until the end of April" (forskaren). Områdets säsong, som Les 3
--     Vallées i 046. Kortet Verbier–Tzoumaz gäller från 5 december och 4
--     Vallées-kortet från 12 december; i november är öppningen begränsad.
-- Höjder 1 350–3 330, 412 km, 26/49/25, 65 liftar och 94 509 stämmer.
-- Liftkortet 94 / 409 CHF: verbier4vallees.ch "1 day 4 Vallées CHF 94.00",
-- "6 days 4 Vallées CHF 409.00", "From december 12th, 2026 to april 18,
-- 2027" (läst av granskaren).
--
-- Restid 160 / 120 → 161 / 118. OSRM 160,7 km, 117,8 min. 120 skrevs för
-- hand i 005. transfer_note 'med bil' → 'med bil från Genève', som 046.
--
-- Betygen står kvar. Snö 9, avancerad 10 och offpist 10 är ankare.
-- Bykänsla 9 och familj 6 är SVAGA (granskningen), men ingen källa bär en
-- ändring.
--
-- Texter:
--   notes: "till 412 kilometer pist, upp till Mont Fort på 3 330 meter"
--     är datatal i löptext och stryks (noterat i granskningen av omgång
--     8). Den lilla glaciären: skiresort snow-reliability "There is even a
--     small glacier at Mont-Fort". Resten från 029; Méribel har 56 % blå
--     pist (Les 3 Vallées).
--   where_to_stay: "på 1 500 meter" stryks (byns höjd, inget datafält,
--     samma som "1 793 meter" för St. Anton i 047). Ski Club GB "Some
--     long, hilly walks from accommodation to lifts in places", "Most of
--     the resort spreads out from the Place Centrale and the base of the
--     Medran gondolas"; en.wikipedia "free buses run throughout the resort
--     regularly during the day".
update resorts
set snowmaking_coverage_pct = 95,
    season_start_month = 11,
    airport_distance_km = 161,
    transfer_minutes = 118,
    transfer_note = 'med bil från Genève',
    notes = 'Verbier passar dig som vill åka offpist. Finalen i Freeride World Tour avgörs varje år på Bec des Rosses, och skidområdet 4 Vallées binder ihop Verbier med Nendaz, Veysonnaz, Thyon och La Tzoumaz, upp till den lilla glaciären på Mont Fort. Är du nybörjare är Verbier fel val. Bara en fjärdedel av pisten är blå, och Méribel har blå pist på över hälften.',
    where_to_stay = 'Verbier ligger som en balkong över Val de Bagnes, och från Médran går gondolerna in i skidområdet. Byn breder ut sig över terrassen, så bor du en bit från Médran blir det backiga promenader till liftarna. Gratisbussar går genom byn under dagen. Nendaz och La Tzoumaz ingår i samma område.'
where slug = 'verbier';

-- ── Cortina d'Ampezzo ─────────────────────────────────────────────────
--
-- skiresort "Cortina d'Ampezzo":
--   lift_capacity_per_hour 42 000 → 41 442: lifts-cable-cars "41442
--     Passengers/hour". Ingen migration satte 42 000.
--   snowmaking_coverage_pct 90 → 95: snow-reliability "343 Snow cannons",
--     "95 % of the slopes have snow-making capabilities". Ingen migration
--     satte 90.
-- Höjder 1 217–2 828, 120 km, 38/49/13, 25 liftar och säsong 11–5
-- stämmer. Liftkortet 84 / 421 (034) är inte omläst (Dolomiti Superskis
-- kalkylator bakom Cloudflare).
--
-- Restid 160 / 120 → 147 / 110, porten Venedig står kvar. OSRM 147,1 km,
-- 109,7 min från terminalen. (Innsbruck: 163,2 km, 147,9 min.)
--
-- Betyg (granskningen, tabell 1):
--   Nybörjare 6 → 7. Ski Club GB Beginner 4/5, "a fantastic, sunny
--     beginners area – perfect for first timers. From here, progression
--     onto the long, gentle blues above Socrepes is excellent"; skiresort
--     beginners 4/5 "Starting in Socrepes is highly recommended for
--     beginners"; inthesnow. 38 % blått. Mot: Snowthere "Skip If" för barn
--     under sju.
--   Offpist 7 → 6. Ski Club GB "Not a great deal of off piste terrain due
--     to the jagged Dolomite mountains". Mot: skiresort "Skiing off the
--     slopes is also fascinating and popular". SVAGT, ett steg till normal.
--   Snowpark 5 → 4. skiresort snow-park "There is no snowpark or halfpipe
--     in the ski area of Cortina d'Ampezzo" (läst av granskaren);
--     inthesnow nämner en park på Faloria. Samma läge som Engelberg,
--     ankaret för 4.
--   Familj 7 → 6 (byn). skiresort families 3/5 "In the ski area itself,
--     however, there are hardly any facilities for families and
--     children"; Ski Club GB "Main lifts are a fair walk or bus ride from
--     most accommodation"; Snowthere Family Score 5.4.
--   Afterski 8 → 7 (byn). skiresort apres-ski 3/5 "You won't find umbrella
--     bars or loud après-ski parties"; inthesnow "cocktails, wine bars,
--     and long dinners taking precedence over rowdy nightlife"; Iglu. Mot:
--     Ski Club GB Après 4/5. Tignes har 7 med Ski Club 4/5.
--   Snö 7, mellannivå 8, avancerad 7, gott om plats 6 och bykänsla 10
--     (ankare) står kvar.
--
-- Texter:
--   notes: "120 kilometer" och "1 246 kilometer" är handskrivna tal och
--     stryks; Dolomiti Superski står redan i prisnoten (lib/
--     liftkortspriser.js). "Mellan dem går skidbuss" stämmer inte längre
--     för Tofana och Cinque Torri: skiresort slope-offering "5
--     Torri/Lagazuói has been directly linked by a 10-seater gondola lift
--     since 2021", "Ski buses connect both sides of Cortina d'Ampezzo".
--     Första meningen: Ski Club GB "The town itself has a great buzz and
--     is full of great restaurants and bars", "Intermediates will love the
--     long blues and reds on the Tofana side". Val Gardena: Ski Club GB
--     Selva "direct access via two gondolas to either the clockwise or
--     anticlockwise loop" (val-gardena.md), mellannivå 9. Priser: Ski Club
--     GB "While prices are generally higher than in much of Italy";
--     Livigno momsfritt: 029 och Ski Club GB Livigno "low tax-free
--     prices".
--   where_to_stay: "Till Tofana-området tar du buss" är fel. skiresort
--     lifts-cable-cars "Cortina-Colfiere-Col Drusciè (YOC 2019)", "A
--     modern 10-seater gondola lift serves as an access lift heading
--     towards Tofana", "Funivia Faloria (Cortina-Mandres-Faloria)";
--     Socrepes: skiresort beginners; bussen: Ski Club GB "there is a good
--     bus service linking the lifts". Skogsbackarna: 029.
--   transport_info: Treviso stryks (flightconnections NYO–TSF "no direct
--     flights", forskaren), och "35 kilometer söderut" är ett handskrivet
--     avstånd. Venedig: flightconnections ARN–VCE "First ARN-VCE flights
--     start in May", CPH–VCE Norwegian, Ryanair och SAS (forskaren).
--     Innsbruck och vägen: OSRM-stegen (A13/A22, SS49, SS51) och 042.
update resorts
set lift_capacity_per_hour = 41442,
    snowmaking_coverage_pct = 95,
    airport_distance_km = 147,
    transfer_minutes = 110,
    beginner_score = 7,
    off_piste_score = 6,
    snowpark_score = 4,
    family_friendly_score = 6,
    apres_ski_score = 7,
    notes = 'Cortina d''Ampezzo passar dig som vill bo i en stad med restauranger och barer och åka långa blå och röda nedfarter. Skidområdena ligger på båda sidor om staden. Tofana och Cinque Torri-Lagazuoi hänger ihop med kabinbana, men till Faloria och Cristallo på andra sidan tar du skidbussen. Vill du åka hela dagarna utan att byta område är Cortina fel val. I Val Gardena går kabinbanorna från Selva direkt ut på Sellaronda. Vill du bo billigt är Cortina också fel val. Priserna i staden ligger över det mesta i Italien, och i Livigno betalar du ingen italiensk moms.',
    where_to_stay = 'Från Cortina går kabinbanan till Col Drusciè i Tofana-området och linbanan till Faloria. Pocol och Socrepes ligger i Tofana-området, med skogsbackar som går att åka i dåligt väder och nybörjarbackarna vid Socrepes. Bor du utanför centrum tar du skidbussen till liftarna.',
    transport_info = 'Flyg till Venedig eller Innsbruck. Till Venedig går inget direktflyg från Sverige i vinter, så där byter du på vägen, till exempel i Köpenhamn. Från Innsbruck kör du över Brenner och genom Pustertal. Närmaste tågstation är Calalzo-Pieve di Cadore-Cortina, med buss vidare.'
where slug = 'cortina-d-ampezzo';

-- ── Livigno ───────────────────────────────────────────────────────────
--
-- skiresort "Livigno":
--   lift_capacity_per_hour 42 000 → 61 465: "61465 Passengers/hour".
--     Ingen migration satte 42 000.
--   snowmaking_coverage_pct 70 → 100: "100 % of the slopes have
--     snow-making capabilities". Ingen migration satte 70.
--   season 12–4 → 11–5: "Current season: 2026-11-28 - 2027-05-02".
--     Ortens prislista tariffe_26-27.pdf har perioderna "28.11.26 -
--     18.12.26" till "10.04.27 - 02.05.27" (forskaren).
-- Höjder 1 816–2 798, 115 km, 28/55/17 och 32 liftar stämmer. Liftkortet
-- 74,50 / 374,50 (022, ALTA STAGIONE) står kvar.
--
-- Restid 220 / 210 → 205 / 227. OSRM från Bergamo-terminalen med
-- vintervägen via Aprica, Tirano, Bormio och Foscagno, tvingad med
-- mellanpunkter (10.1687, 46.2155; 10.3714, 46.4669): 205,4 km, 227,5 min.
-- Den raka frågan går över Forcola di Livigno, som är vinterstängd
-- (forskaren; ingen källa ordagrant), och ger 177,1 km / 199,9 min.
-- Forskarens 210 / 238 kom från en punkt 507 m från terminalen.
--
-- Offpist 6 → 7. Ski Club GB "The altitude and northeast aspect of the
--   Mottolino slopes makes these prime for off piste"; skiresort
--   experts-freeriders 5/5 "numerous unsecured powder slopes. Heliskiing
--   is also available"; inthesnow. Ski Club varnar för sikten utan träd.
-- Gott om plats 6 → 7. Ski Club GB "If you're looking for snowsure skiing
--   on quiet slopes"; Iglu "The lift system is efficient enough to negate
--   queues"; 61 465 personer i timmen på 115 km. Ingen källa beskriver
--   trängsel. SVAGT: två källor.
-- Snowpark 8 är ankare och står kvar. Övriga betyg står kvar.
--
-- Texter:
--   notes: "Byn ligger på 1 816 meter" är ett datatal (altitude_base) och
--     stryks. Sidorna utan lift: skiresort slope-offering "The two areas,
--     Mottolino and Carosello 3000/Sitas, are not directly connected. You
--     can take the ski bus". Brant: Ski Club GB "Few tough challenges on
--     piste"; St. Anton avancerad 10 mot 6. Vägen: OSRM-stegen (SS39 över
--     Aprica, SS301 över Foscagno); Chamonix har kortast restid av
--     alporterna med Genève som port (046). OS 2026 och momsen: 029.
--   where_to_stay: Ski Club GB "The resort of Livigno is centred between
--     the bases of the Mottolino and Costaccia access lifts. It is here
--     where you'll find the most conveniently located accommodation, the
--     best choice of restaurants and the liveliest bars". "tio kilometer"
--     är en uppgift om byn (029, skipasslivigno.com) och står kvar.
--   transport_info: "Milano" → "Milano Malpensa", som Cervinias port
--     (042). "2 291 meter" är passets höjd, inget datafält.
update resorts
set lift_capacity_per_hour = 61465,
    snowmaking_coverage_pct = 100,
    season_start_month = 11,
    season_end_month = 5,
    airport_distance_km = 205,
    transfer_minutes = 227,
    off_piste_score = 7,
    crowd_score = 7,
    notes = 'Livigno passar dig som åker i snowpark. Tävlingarna i snowboard och freestyle under OS 2026 hölls i Livigno Snow Park. Liftarna går upp på båda sidor om dalen, till Carosello 3000 och Mottolino, men sidorna hänger inte ihop med lift, så mellan dem tar du skidbussen. I Livigno betalar du ingen italiensk moms. Vill du åka brant är Livigno fel val. De svåra pisterna är få, och St. Anton har mycket mer brant åkning. Vill du komma fram fort från flygplatsen är Livigno också fel val. Vägen från Bergamo går över två pass, och Chamonix ligger mycket närmare sin flygplats.',
    where_to_stay = 'Livigno är över tio kilometer långt, så läget avgör hur mycket du åker buss. Närmast både liftar, restauranger och barer bor du i centrum mellan Mottolino och Costaccia. De fyra busslinjerna går till alla liftar och är gratis, och Skilink går mellan liftarna på dalens två sidor.',
    transport_info = 'Flyg till Bergamo eller Milano Malpensa. Vägen från Bormio går över Foscagnopasset på 2 291 meter, med tull uppe på passet. Från Schweiz kommer du in genom tunneln vid Munt la Schera.'
where slug = 'livigno';

-- ── Madonna di Campiglio ──────────────────────────────────────────────
--
-- skiresort "Madonna di Campiglio/Pinzolo/Folgàrida/Marilleva":
--   altitude_base 1 522 → 852 och altitude_top 2 580 → 2 504: "852 m -
--     2504 m (Difference 1652 m)", size "1652 m (Base 852 m - Mountain
--     2504 m)". Ingen migration satte 1 522 eller 2 580 (2 580 är Iglus
--     "Highest Lift"). Huvudsidan visar också "(770 m -)", som är
--     dalstationen i Pinzolo utan nedfart ("with the exception of the
--     routes to Pinzolo, Daolasa, and Marilléva 900"). 852 nås med pist:
--     slope-offering "DoloMitica (Pinzolo) · Length 5.8 km · Elevation
--     difference 1248 m", "DoloMitica downhill run to Tulot", och liften
--     "Tulot-Malga Cioca" börjar där. Se granskningen, ägarbeslut 3.
--   lift_capacity_per_hour 38 000 → 110 311: "110311 Passengers/hour".
--     Ingen migration satte 38 000.
--   season_start_month 12 → 11: "Current season: 2026-11-21 -
--     2027-04-11". campigliodolomiti.it har en lågsäsong "from season
--     start to 19.12.2026".
-- 155 km, 32/47/21, 58 liftar och 95 % konstsnö stämmer. Liftkortet
-- 87 / 435 (030) stämmer med campigliodolomiti.it, "SKIAREA - HIGH
-- SEASON … 1 day € 87", "HIGH SEASON from 20.12.2026 to 14.03.2027 … 6
-- € 435" (läst av granskaren).
--
-- Restid 160 / 150 → 153 / 140, porten Verona står kvar. OSRM 152,8 km,
-- 139,9 min från terminalen. (Bergamo: 179,2 km, 160,9 min.)
--
-- Snö 8 → 7. Ski Club GB Snow 3/5, "Despite the relatively low altitude, a
--   vast snowmaking system ensures reliable conditions throughout the
--   winter, just keep an eye out for slushier patches come spring".
--   Toppen 2 504 m, 95 % konstsnö: samma som Mayrhofen (2 500 m, 95 %,
--   Ski Club 3/5), som har 7. Mot: skiresort 5/5. SVAGT.
-- Nybörjare 6 → 7. Ski Club GB Beginner 4/5, "there are few resorts with
--   such a good selection of long blue runs"; skiresort beginners 4/5;
--   Iglu, inthesnow. 32 % blått.
-- Övriga betyg står kvar.
--
-- Texter:
--   notes: "155 kilometer pist" är ett datatal och stryks. Första
--     meningen: Ski Club GB (ovan) och "The mostly tree-lined slopes of
--     the ski area are an intermediate's paradise". Förbindelsen:
--     skiresort huvudsida "The ski area stretches from Val Rendena with
--     Pinzolo through … Madonna di Campiglio to Folgàrida and Marilleva".
--     Offpist: Ski Club GB "Off piste is generally limited, both by local
--     rules and relatively sparse natural snowfall"; Chamonix offpist 10
--     mot 6. Våren: Ski Club GB ovan; Sölden två glaciärer (047), snö 9
--     mot 7. 3-Tre och Stenmark: 029.
--   where_to_stay: Ski Club GB "The town does spread out quite a bit
--     however, so some accommodation is a decent walk from the lifts".
--     Forskarens "eller skidbuss" stryks: bara skidskolans minibuss är
--     belagd (Iglu).
--   transport_info: Verona har inget direktflyg från Sverige
--     (flightconnections ARN–VRN och CPH–VRN, forskaren). Bergamo:
--     Ryanair från Arlanda (flightconnections ARN–BGY, forskaren), som
--     för Livigno.
update resorts
set altitude_base = 852,
    altitude_top = 2504,
    lift_capacity_per_hour = 110311,
    season_start_month = 11,
    airport_distance_km = 153,
    transfer_minutes = 140,
    snow_guarantee_score = 7,
    beginner_score = 7,
    notes = 'Madonna di Campiglio passar dig som lär dig åka eller vill åka långa blå och röda nedfarter genom skog. Byn ligger i Brentadolomiterna, och skidområdet hänger ihop med lift med Pinzolo, Folgarida och Marilleva. I Canalone Miramonti, en av nedfarterna genom skogen, körs världscupens nattslalom 3-Tre. Ingemar Stenmark tog sin första världscupseger i Madonna di Campiglio 1974. Vill du åka offpist är Madonna di Campiglio fel val. Lokala regler och måttligt snöfall begränsar åkningen utanför pist, och Chamonix har mycket mer. Åker du sent på säsongen ger Sölden säkrare snö. Pisterna här ligger lägre och kan bli blöta på våren, och Sölden har två glaciärer.',
    where_to_stay = 'Centrum i Madonna di Campiglio är till stor del bilfritt, och linbanan 5 Laghi går från byn. Byn är utspridd, så bor du utanför centrum kan det bli en bra bit att gå till liftarna. Folgarida och Marilleva ingår i samma skidområde.',
    transport_info = 'Flyg till Verona, med byte, eller direkt till Bergamo, som ligger längre bort. Med tåg åker du till Trento, och därifrån går Trentino Trasportis buss via Tione till Madonna di Campiglio.'
where slug = 'madonna-di-campiglio';

-- ── Prishistorik ──────────────────────────────────────────────────────
--
-- Madonna di Campiglio: campigliodolomiti.it "SUNDAY RULE: For 3, 4, 5,
-- and 6-day skipasses including a Sunday, the following surcharge will be
-- added to the skipass purchase price: Skiarea Campiglio Dolomiti di
-- Brenta & Skirama: € 10.00 ADULT". 030 kunde inte se om tillägget fanns
-- kvar. Listpriset 435 står kvar, som regeln i 019; tillägget står i
-- noten. Sidan säger också "The list prices shown represent the maximum
-- purchase value", och på nätet är priset dynamiskt.
update public.lift_pass_prices
set captured_on = '2026-11-18',
    note = 'Högsäsong 20.12.26–14.3.27. Lågsäsong 75 / 376. Dagskort 89 under jul, nyår och 7–20 februari. Sex dagar som innehåller en söndag kostar 10 € mer. Listpriset är högsta pris; på nätet är priset dynamiskt.'
where resort_slug = 'madonna-di-campiglio'
  and season = '2026/2027'
  and product = 'SkiArea Campiglio Dolomiti di Brenta';

-- Verbier: raden från 022 saknar källadress. verbier4vallees.ch "Prices
-- winter 26-27", "-10% discount if you buy at least 10 days before your
-- arrival date", "6 days Verbier - Tzoumaz CHF 374.00".
update public.lift_pass_prices
set source_url = 'https://verbier4vallees.ch/en/useful-information/prices-winter',
    captured_on = '2026-11-18',
    note = '412 km, samma som våra tal. Fast pris 12.12.26–18.4.27, tio procent lägre på nätet minst tio dagar före. Verbier–Tzoumaz ensamt kostar 86 / 374.'
where resort_slug = 'verbier'
  and season = '2026/2027'
  and product = '4 Vallées';

-- ── Kontroll före commit ──────────────────────────────────────────────
--
-- Zermatt och Cervinia delar Matterhorn Ski Paradise och ska bära samma
-- områdestal och områdesbetyg. Skiljer något avbryts transaktionen och
-- ingenting ändras. Samma kontroll som 046 och 047, utan pris och säsong
-- (se Gemensamt ovan).
do $$
declare
  fel text;
  antal int;
begin
  select count(*) into antal from resorts
  where ski_area = 'Matterhorn Ski Paradise';
  if antal <> 2 then
    raise exception 'Matterhorn Ski Paradise ska ha två orter, har %', antal;
  end if;

  select string_agg(ski_area, ', ') into fel
  from (
    select ski_area
    from resorts
    where ski_area = 'Matterhorn Ski Paradise'
    group by ski_area
    having count(distinct (snow_guarantee_score, beginner_score,
                           intermediate_score, expert_score, off_piste_score,
                           snowpark_score, crowd_score)) > 1
        or count(distinct (altitude_base, altitude_top, total_pistes_km,
                           blue_percent, red_percent, black_percent,
                           total_lifts, lift_capacity_per_hour,
                           snowmaking_coverage_pct)) > 1
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
--   where slug in ('zermatt', 'cervinia', 'saas-fee', 'verbier',
--                  'cortina-d-ampezzo', 'livigno', 'madonna-di-campiglio')
--   order by slug;
--
--   Förväntat:
--   cervinia              10 6 9 10 10 7 6 | 7 5 4
--   cortina-d-ampezzo      7 7 8  7  6 4 6 | 6 7 10
--   livigno                8 7 8  6  7 8 7 | 8 7 7
--   madonna-di-campiglio   7 7 8  7  6 6 5 | 7 8 9
--   saas-fee               9 6 8  7  7 7 7 | 8 6 9
--   verbier                9 5 8 10 10 7 5 | 6 9 9
--   zermatt               10 6 9 10 10 7 6 | 7 8 10
--
-- 2. Tal, säsong och restider:
--
--   select slug, ski_area, altitude_base, altitude_top,
--          lift_capacity_per_hour, snowmaking_coverage_pct,
--          season_start_month, season_end_month, nearest_airport,
--          airport_distance_km, transfer_minutes, transfer_note
--   from resorts
--   where slug in ('zermatt', 'saas-fee', 'verbier', 'cortina-d-ampezzo',
--                  'livigno', 'madonna-di-campiglio')
--   order by slug;
--
--   Förväntat: cortina-d-ampezzo 41 442, 95, Venedig 147/110.
--   livigno 61 465, 100, 11–5, Bergamo 205/227. madonna-di-campiglio
--   852–2 504, 110 311, 11–4, Verona 153/140, ski_area null. saas-fee
--   45, Genève 226/165. verbier 95, 11–4, 161/118 'med bil från Genève',
--   ski_area null. zermatt 235/232 'med tåg från Genève', ski_area
--   'Matterhorn Ski Paradise'.
--
-- 3. Inget områdesnamn står ensamt (oförändrat efter 047):
--
--   select ski_area, count(*) from resorts
--   where ski_area is not null group by ski_area order by 1;
--
--   Förväntat: Les 3 Vallées 3, Matterhorn Ski Paradise 2, Ski Arlberg 2,
--   Tignes/Val d'Isère 2.
--
-- 4. Prisraderna:
--
--   select resort_slug, product, day_price, week_price, source_url, note
--   from lift_pass_prices
--   where resort_slug in ('madonna-di-campiglio', 'verbier')
--     and season = '2026/2027';
--
--   Förväntat: madonna 87 / 435 med söndagstillägget i noten, verbier
--   94 / 409 med källadress.
