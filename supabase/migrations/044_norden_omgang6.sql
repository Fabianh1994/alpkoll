-- 044 · Omgång 6: tre nordiska orter läggs in dolda.
--
-- Underlaget är faktafilerna i projektmappen orter/ (idre-fjall.md,
-- branas.md, hafjell.md) och granskningen granskning-omgang6.md, alla
-- 2026-11-18. Där granskningen och forskarnas filer skiljer sig gäller
-- granskningen. Varje tal i kärnfälten är kontrollerat mot skiresort.com
-- två gånger, av forskaren och av granskaren.
--
-- De tre orterna läggs in med published = false. De visas inte förrän de
-- har en bild med licens i resort_images och en provad söksträng i
-- BOOKING_SOK (lib/booking.js), enligt CLAUDE.md. Ingen av dem har det i
-- dag.
--
-- Ingen av sluggarna idre-fjall, branas eller hafjell förekommer i någon
-- tidigare migration, i lib/ eller i app/. Därför insert.
--
-- Gemensamt för alla tre:
--   · Restid och avstånd är OSRM, samma metod som lib/restider.js,
--     avrundat till hel km och hel minut. Bilresan från svenska städer står
--     i BIL i lib/restider.js, mätt samma dag från STADER-koordinaterna.
--   · Familj, afterski och bykänsla avser BYN (docs/poangskala.md).
--     Övriga betyg avser området.
--   · ski_area är null för alla tre. Varje ort är en post hos skiresort och
--     delar inte område med någon ort på sajten. Ingen står i
--     lib/delomraden.js.
--   · transfer_note sätts, som i 041–043, och i Sälens och Trysils form.
--   · Alla tre är byggda som anläggningar kring liftarna (Idre Fjäll 1967,
--     Branäs och Hafjell 1988). Bykänsla 6 för alla tre, samma som
--     Vemdalen (039), som har samma slags bebyggelse. Se granskningen,
--     beslut B.
--   · region står oöversatt: Dalarna, Värmland och Innlandet är redan
--     svenska eller norska namn, som Trysils Innlandet.
--
-- Texterna följer docs/copy.md: du-form, inga handskrivna tal, och varje
-- nackdel säger vem den gäller, ett faktum och en annan ort som är
-- publicerad på sajten. Källan till varje namn står i kommentaren vid
-- orten. Ordet för pengarna-tillbaka-villkoret som Idre Fjäll, Branäs och
-- Hafjell säljer används inte; poängen heter Snösäkerhet (CLAUDE.md).
--
-- Kör i Supabase SQL Editor. Allt körs i en transaktion.

begin;

-- ── Idre Fjäll ────────────────────────────────────────────────────────
--
-- skiresort.com: "Idre Fjäll", 588–890 m, "Total: 41 km", 29/8/4 km →
-- 70/19/11 ("Easy" omfattar gröna och blå enligt nybörjarsidan), 23
-- liftar, "30305 Passengers/hour", 90 % konstsnö. Grannarna Idre
-- Himmelfjäll, Grövelfjäll och Fjätervålen är egna poster utan
-- liftförbindelse. Idrepasset gäller alla fyra men är ett tilläggskort
-- mellan fyra ägare, inte ett skidområde, och står i texten.
-- Koordinaten är OSM-noden "Idre fjäll" (Nominatim). region = 'Dalarna'.
-- Säsong 12–4: skiresort "Current season: 2026-12-05 - 2027-04-12",
-- skipasset "giltigt 20261219-20270404".
--
-- Port: Scandinavian Mountains, samma stavning som Sälen (010). Arlanda–
-- SCR torsdagar och söndagar 20.12.2026–21.3.2027, och fredagar
-- 26.2–5.3.2027 (scandinavianmountains.se/passagerare/tidtabell, läst av
-- granskaren 2026-11-18). Restid SCR (12.8372, 61.1571, fäster 20 m) →
-- Idre Fjäll, OSRM 119,5 km / 117,0 min. transfer_note som Sälen.
--
-- Betyg som skiljer sig från forskaren (granskningen):
--   Bykänsla 6 (forskaren 5): beslut B.
--   Afterski 6 (forskaren 5): skiresort 3/5 som Vemdalsskalet, och
--     "Charlies offers après-ski with live music almost daily during the
--     high season from 3 to 6 pm". Vemdalen har 6. Snowthere "no
--     nightlife to speak of" gäller kvällen, inte eftermiddagen.
-- Betyg som granskningen prövade och lät stå:
--   Snösäkerhet 6: toppen 890 m, i praktiken Sälens 887. 90 % konstsnö och
--     skiresort 5/5 räcker inte till 7 när poängen inte får stå i strid med
--     altitude_top.
--   Nybörjare 9: skiresort 5/5 "can be explored almost entirely on easy and
--     wide slopes ... Only the east side is an exception", 70 % lätt pist.
--     idrefjall.se "många barnområden med flack lutning, lätta liftar och
--     rullband". Under Branäs 10 därför att östsidan är brantare.
--   Familj 9: idrefjall.se "ski-in, ski-out på alla våra boenden", barn
--     0–7 år gratis i bokningen; skiresort 5/5 "consistently geared towards
--     families"; Snowthere "Kids Ski Free – Under 7". Motivering vid 9:
--     "Alla boenden ligger vid backen, de minsta barnen åker gratis, och
--     barnområdet med rullband ligger intill centrum."
--   Snowpark 6: en park med fyra linjer nedanför Askebyn (idrefjall.se),
--     skiresort 4/5. Hemsedal och Trysil har 5/5 och står på 7.
--
-- Liftkort: Idre Fjälls egen bokning, Idre Fjäll Skipass, vuxen 16–64,
-- start lördag 27.2.2027, som regeln i docs/liftkortspriser.md: 1 dag
-- "671 SEK", 6–8 dagar "2 827 SEK" (forskaren, renderad bokning).
-- Granskaren fick bara sidans skal med curl; pistat.se "1 dag 671 kr",
-- "6–8 dagar 2 827 kr" bekräftar. Listpris; på nätet dras 5 %, 10 % mer
-- än 40 dagar före. Priset ändras med veckan.
--
-- Texternas källor:
--   70 % lätt: skiresort. Boendena vid backen: idrefjall.se skidåkning.
--     Barnen gratis: bokningen "0 - 7 år 0 SEK".
--   Åre ungefär tre gånger fallhöjden: 939 m (029) mot 302 m.
--   Charlies, Värdshuset, nattklubben några kvällar: skiresort après-ski,
--     idrefjall.se afterski. Åre med restaurangerna och afterskin i byn:
--     Åres where_to_stay (029), afterski 8.
--   SCR vid Sälen, Idre saknas på flygplatsens transfersida
--     ("Hundfjället / Tandådalen 10 min ... Trysil 40 min"): SCR transfer.
--   Barnområdet med rullband intill centrum, barnområdet vid Skicenter Syd
--     och Sydgondolen: skiresort families-children och ski-lifts.
--     Snowparken nedanför Askebyn: idrefjall.se snowpark. Fjälltåget
--     gratis: idrefjall.se skidåkning.
--   Fjällexpressen, Masexpressen, tåg till Mora och anslutningsbuss:
--     idrefjall.se hitta-hit. Bara vintertrafik på SCR: tidtabellen.

insert into resorts (
  slug, name, country, region, ski_area, latitude, longitude,
  season_start_month, season_end_month,
  altitude_base, altitude_top, total_pistes_km,
  blue_percent, red_percent, black_percent,
  total_lifts, lift_capacity_per_hour, snowmaking_coverage_pct,
  lift_pass_day_eur, lift_pass_week_eur, lift_pass_currency,
  nearest_airport, airport_distance_km, transfer_minutes, transfer_note,
  snow_guarantee_score, beginner_score, intermediate_score, expert_score,
  off_piste_score, snowpark_score, family_friendly_score,
  apres_ski_score, village_charm_score, crowd_score,
  notes, where_to_stay, accommodation_zone, transport_info,
  published
) values (
  'idre-fjall', 'Idre Fjäll', 'Sweden', 'Dalarna', null, 61.8896, 12.8331,
  12, 4,
  588, 890, 41,
  70, 19, 11,
  23, 30305, 90,
  671, 2827, 'SEK',
  'Scandinavian Mountains', 120, 117, 'med bil från flygplatsen',
  6, 9, 6, 5,
  5, 6, 9,
  6, 6, 7,
  'Idre Fjäll passar dig som åker med barn eller är nybörjare. Det mesta av pisten är lätt, alla boenden ligger vid backen, och de minsta barnen åker gratis. Idrepasset gäller också grannbackarna Fjätervålen, Idre Himmelfjäll och Grövelfjäll, som inte hänger ihop med lift. Vill du åka brant är Idre Fjäll fel val. Fallhöjden är liten, och Åre har ungefär tre gånger så mycket. Vill du gå ut på kvällen är Idre Fjäll också fel val. Afterskin är på eftermiddagen, och nattklubben har öppet några kvällar per säsong. Åre har restaurangerna och afterskin i byn. Vill du flyga och ha kort väg till backen är Idre Fjäll fel val. Scandinavian Mountains Airport ligger vid Sälen, och därifrån är det en lång biltur norrut. Till Sälens backar är det en kort bit.',
  'Med små barn bor du nära centrum, där barnområdet med rullband ligger, eller vid Skicenter Syd, som har ett eget barnområde och Sydgondolen. Snowparken ligger nedanför Askebyn. Fjälltåget mellan backarna och stugbyarna är gratis.',
  'Idre Fjäll',
  'Under vintersäsongen går Fjällexpressen och Masexpressen till Idre Fjäll. Med tåg åker du till Mora och tar anslutningsbussen sista biten. Flyger du landar du på Scandinavian Mountains Airport vid Sälen, som bara har trafik under vintersäsongen, och resten av vägen går med bil.',
  false
)
on conflict (slug) do nothing;

-- ── Branäs ────────────────────────────────────────────────────────────
--
-- skiresort.com: "Branäs", 152–567 m, "Total: 23 km", 18,8/3,9/0,3 km →
-- 82/17/1 ("Easy" omfattar gröna och blå; ortens pistlista ger 86/9/6 i
-- antal backar, inom 15 procentenheter), 30 liftar, "33246
-- Passengers/hour". Konstsnö: posten har ingen uppgift och inget test
-- (snow-reliability-sidan saknas), därför null. Snowtheres 95 % är inte
-- skiresort. Branäsdalen, Branäsberget och Mattesdalen är ett liftsystem,
-- och "Valley run available". Kungsberget (samma ägare) är en annan ort.
-- Koordinaten är OSM-noden "Branäs" vid Myrvägen i Branäsdalen
-- (Nominatim). region = 'Värmland'.
-- Säsong 12–4: branas.se "Premiärhelg 11-13 december",
-- "Säsongsavslutning 4 april".
--
-- Port: Scandinavian Mountains, inte Torsby som forskaren föreslog.
-- Granskningen, beslut D:
--   · SCR har Arlanda–SCR vintern 26/27 (tidtabellen ovan). Forskaren
--     avfärdade SCR på SkiStars flygsida, som bara listar utländska orter.
--   · Torsby trafikeras av Jonair, inte FlexFlight, "två gånger varje
--     helgfri måndag till fredag" med uppehåll 24.12.2026–10.1.2027
--     (torsbyflygplats.se/tidtabell, läst av granskaren 2026-11-18).
--     Ingen helgtrafik på en ort där veckorna byts på lördagar.
--   · Regeln är samma port som närliggande orter om möjligt. Sälen och
--     Idre Fjäll har SCR. Oslo (Trysils port) blir dubbelt så lång.
-- Restid SCR → Branäs, OSRM 88,1 km / 85,4 min. Torsby 71,0 / 71,2 och
-- Oslo (11.0968, 60.1935) 203,7 / 196,6 står i granskningen.
--
-- Betyg som skiljer sig från forskaren (granskningen):
--   Nybörjare 10 (forskaren 9): beslut A. 82 % lätt pist, högst på
--     sajten, och svart pist bara i två backar, Gerremobranten och
--     Mattesgapet (branas.se pistlista). Snowthere "Perfect If – Your
--     youngest has never clipped into skis before", "The terrain is
--     gentle"; branas.se "2st barnområden, Björnbuseland. Nintendo Land.
--     Skidskola för alla åldrar". Skalan: "Är en ort bäst i materialet på
--     något får den tio." Motivering vid 10: "Nästan all pist är grön
--     eller blå, och svart pist finns bara i Gerremobranten och
--     Mattesgapet. Barnen har två Björnbuseland och Nintendo Land."
--   Bykänsla 6 (forskaren 5): beslut B.
-- Betyg som granskningen prövade och lät stå:
--   Snösäkerhet 5: toppen 567 m ligger under Sälens bas 572 m, som är
--     ankaret för 6. Konstsnö okänd. pistat (SMHI Kindsjön) "minst 30 cm
--     3 av 11 vintrar" vecka 52. Branäs blir ankare för 5.
--   Mellannivå 5: tre röda backar (Stora Amundsbacken, Storbacken,
--     Vargbacken), Snowthere "Branas will feel limiting after day two".
--   Avancerad 4: 1 % svart, Snowthere "No challenging runs". Samma tal som
--     Alta Badia-ankaret, inget ytterläge.
--   Offpist 4: Snowthere "minimal off-piste", ingen annan källa beskriver
--     terrängen. SVAGT.
--   Afterski 5: branas.se "Våra vanliga dagar för afterski är fredag och
--     lördag", tisdagar på Loftet; Snowthere "If you want a vibrant
--     apres-ski or town scene, Branas does not have it."
--   Familj 9: branas.se "trettonfaldiga vinnare av Stora
--     Barnsemesterpriset", "Barn mellan 0-6 år åker alltid gratis";
--     skiresort "most with direct access to slopes and lifts"; Snowthere
--     "purpose-built for kids". Motivering vid 9: "Branäs har vunnit Stora
--     Barnsemesterpriset gång på gång, de minsta barnen åker gratis, och de
--     flesta boenden ligger vid backen."
--   Gott om plats 6: inga uppmätta köer. SVAGT.
--
-- Liftkort: branas.se/skidakning-i-branas/liftkort, "Prislista 26/27",
-- vuxen 18–64: 1 dag 595, 6–8 dagar 2 710 (läst av forskaren och av
-- granskaren med curl). Ett pris hela säsongen; premiärhelgen halva
-- priset, och kampanjpriset gällde till 31 oktober 2026.
--
-- Texternas källor:
--   82 % lätt: skiresort. De minsta barnen gratis, Stora
--     Barnsemesterpriset: branas.se. Boendena vid backen: skiresort.
--   Gerremobranten och Mattesgapet: branas.se pistlista. Åre mer än
--     dubbelt så stor fallhöjd: 939 m mot 415 m.
--   Trysil mer än tre gånger så mycket pist: 78 km (011) mot 23.
--     Snowthere "You need more than 23 km to fill a week".
--   Toppen under botten i Sälen: 567 m mot 572 m (013).
--   Branäsdalen med största barnområdet, restauranger, skiduthyrning och
--     livsmedelsbutik; Bävertorget och Byhusen nära barnområdet; Soltorget
--     och Branäs Berg; Mattesdalens stolsliftar till toppen:
--     branas.se/boende/boendeomraden. Parken i Mattesdalen: pistat.
--   SCR vid Sälen och bara vintertrafik: tidtabellen. Linjeflyget till
--     Torsby på vardagar: torsbyflygplats.se.

insert into resorts (
  slug, name, country, region, ski_area, latitude, longitude,
  season_start_month, season_end_month,
  altitude_base, altitude_top, total_pistes_km,
  blue_percent, red_percent, black_percent,
  total_lifts, lift_capacity_per_hour, snowmaking_coverage_pct,
  lift_pass_day_eur, lift_pass_week_eur, lift_pass_currency,
  nearest_airport, airport_distance_km, transfer_minutes, transfer_note,
  snow_guarantee_score, beginner_score, intermediate_score, expert_score,
  off_piste_score, snowpark_score, family_friendly_score,
  apres_ski_score, village_charm_score, crowd_score,
  notes, where_to_stay, accommodation_zone, transport_info,
  published
) values (
  'branas', 'Branäs', 'Sweden', 'Värmland', null, 60.6592, 12.9647,
  12, 4,
  152, 567, 23,
  82, 17, 1,
  30, 33246, null,
  595, 2710, 'SEK',
  'Scandinavian Mountains', 88, 85, 'med bil från flygplatsen',
  5, 10, 5, 4,
  4, 6, 9,
  5, 6, 6,
  'Branäs passar dig som åker med små barn eller står på skidor för första gången. Nästan all pist är grön eller blå, de minsta barnen åker gratis, och de flesta stugor och lägenheter ligger vid backen. Anläggningen i norra Värmland har vunnit Stora Barnsemesterpriset gång på gång. Vill du åka brant är Branäs fel val. Svart pist finns bara i Gerremobranten och Mattesgapet, och Åre har mer än dubbelt så stor fallhöjd. Vill du ha ny pist varje dag en hel vecka är Branäs också fel val. Trysil har mer än tre gånger så mycket pist. Vill du ha säker snö tidigt i säsongen är Branäs fel val. Toppen ligger lägre än botten i Sälen.',
  'Med små barn passar Branäsdalen, där anläggningens största barnområde ligger och restauranger, skiduthyrning och livsmedelsbutik finns vid liftarna. Bävertorget och Byhusen ligger nära barnområdet. På Branäsberget bor du vid Soltorget och barnområdet, med egen skiduthyrning och restauranger. Från Mattesdalen går stolsliftarna till toppen, och där ligger snowparken.',
  'Branäsdalen, Branäsberget, Mattesdalen',
  'Flyger du landar du på Scandinavian Mountains Airport vid Sälen, som bara har trafik under vintersäsongen, och sista biten går med bil. Linjeflyget från Arlanda till Torsby går helgfria vardagar.',
  false
)
on conflict (slug) do nothing;

-- ── Hafjell ───────────────────────────────────────────────────────────
--
-- skiresort.com: "Hafjell", 195–1059 m, "Total: 50 km", 38/8/4 km →
-- 76/16/8 ("Easy" omfattar gröna och blå enligt nybörjarsidan; ortens 29
-- nedfarter ger 66/31/3 i antal, de långa nedfarterna är lätta), 18
-- liftar, "25935 Passengers/hour", 90 % konstsnö. Kvitfjell och Oppdal
-- (samma ägare, gemensamt säsongskort) är egna områden utan lift.
-- Koordinaten är Hafjell Alpinsenter vid liftbotten (Nominatim).
-- region = 'Innlandet', som Trysil; skiresort skriver det gamla fylket
-- Oppland. Säsong 11–4: skiresort "Current season: 2026-11-27 -
-- 2027-04-11".
--
-- Port: Oslo, samma stavning och transfer_note som Trysil (011). Restid
-- Oslo lufthavn (11.0968, 60.1935, Lufthavnvegen, fäster 2 m) → Hafjell,
-- OSRM 159,2 km / 126,9 min. Forskarens punkt (11.0996, 60.1943) fäster
-- 128 m bort och gav 159,4 / 127,7. Koordinaten bör användas för Oslo
-- framöver; Trysil, Hemsedal och Geilo har handsatta tider från 011.
--
-- Betyg som skiljer sig från forskaren (granskningen):
--   Snowpark 7 (forskaren 8): skiresort 5/5 och tre parker, men samma
--     5/5 har Hemsedal och Trysil, som står på 7. Utöver skiresort bär
--     bara WeSki ("among the best in Northern Europe"), som i samma text
--     har fel antal parker och en superpipe som inte finns, och Alpincos
--     egen marknadsföring.
-- Betyg som granskningen prövade och lät stå:
--   Snösäkerhet 7: topp 1 059 m, 90 % konstsnö, skiresort 5/5 "the valley
--     runs are open from the first to the last day of the season", Snow
--     Magazine "extremely reliable for snow". Mot: basen 195 m, Snowthere
--     "lower runs occasionally patchy in warm spells".
--   Nybörjare 9: skiresort 5/5 "The entire ski area can be accessed via
--     easy slopes", "The conveyor belts are free to use"; Ski Solutions
--     "an ideal ski destination for families and beginner skiers"; WeSki
--     "dedicated nursery areas". Under Branäs 10: 8 % svart. Motivering
--     vid 9: "Hela området nås via lätta nedfarter, och rullbanden i barn-
--     och nybörjarområdena är gratis."
--   Bykänsla 6: beslut B.
--   Afterski 5: skiresort 3/5, Snowthere "Evening entertainment at the
--     base is limited", WeSki "Don't expect a huge all-night party scene",
--     Snow Magazine "Hafjell itself is quieter".
--
-- Liftkort: dynamiskt per startdag i Alpincos bokningskalender, som
-- ligger bakom Cloudflare. Läst bara för november 2026 (599 NOK).
-- Referensveckan är OKÄND, därför null, null, 'NOK' och orten i
-- UTAN_PRIS (lib/liftkortspriser.js), som Val Gardena i 042. Ingen rad i
-- lift_pass_prices. skiresorts och Snowtheres 699 NOK har okänt datum.
--
-- Texternas källor:
--   Hela området via lätta nedfarter, gratis rullband, tre familjeområden:
--     skiresort beginners och families-children, alpinco.com about.
--   Byggd 1988 inför Lillehammers OS-ansökan: alpinco.com about ("built in
--     the summer/autumn of 1988 to emphasize the seriousness of
--     Lillehammer's application"). En svart nedfart: alpinco "1 svart".
--     Namnet på nedfarten skrivs inte; skiresort kallar den "Olympic
--     downhill run", men störtloppet 1994 är inte belagt där.
--   Voss ungefär en fjärdedel svart: 26 % (013).
--   Lodgen och Woody's Bar vid liftbotten, Gaiastova med nattklubb på
--     lördagar och bilväg dit: skiresort apres-ski. Hemsedal sentrum med
--     uteliv och gratis skibuss: Hemsedals where_to_stay (029), afterski 7.
--   Lillehammer och Øyer en bit bort, bil eller buss: skiresort
--     ("Øyer (5 km) · Lillehammer (16 km)"), Snowthere ("not walkable from
--     town, so you need a car or bus"). Geilo med Bergensbanans station i
--     byn: Geilos notes (029).
--   Gondolen och Hafjellheis från liftbotten: skiresort lifts. Knerten och
--     skidskolans samlingsplats, Favn, Gaiastova med gratis knapplift:
--     alpinco about. Största barnområdet vid toppstationen: skiresort
--     families-children.
--   E6 från Oslo, tåget från Oslo lufthavn till Lillehammer och bussen till
--     Hafjell Alpinsenter: alpinco about.

insert into resorts (
  slug, name, country, region, ski_area, latitude, longitude,
  season_start_month, season_end_month,
  altitude_base, altitude_top, total_pistes_km,
  blue_percent, red_percent, black_percent,
  total_lifts, lift_capacity_per_hour, snowmaking_coverage_pct,
  lift_pass_day_eur, lift_pass_week_eur, lift_pass_currency,
  nearest_airport, airport_distance_km, transfer_minutes, transfer_note,
  snow_guarantee_score, beginner_score, intermediate_score, expert_score,
  off_piste_score, snowpark_score, family_friendly_score,
  apres_ski_score, village_charm_score, crowd_score,
  notes, where_to_stay, accommodation_zone, transport_info,
  published
) values (
  'hafjell', 'Hafjell', 'Norway', 'Innlandet', null, 61.2350, 10.4483,
  11, 4,
  195, 1059, 50,
  76, 16, 8,
  18, 25935, 90,
  null, null, 'NOK',
  'Oslo', 159, 127, 'med bil från Oslo',
  7, 9, 7, 5,
  5, 7, 8,
  5, 6, 7,
  'Hafjell passar dig som åker med barn eller är nybörjare. Hela området nås via lätta nedfarter, och de tre familjeområdena har gratis rullband. Anläggningen byggdes när Lillehammer sökte vinter-OS. Vill du åka brant är Hafjell fel val. Området har en enda svart nedfart, och i Voss är ungefär en fjärdedel av pisten svart. Vill du ha kvällsliv är Hafjell också fel val. Vid liftbotten finns ett par barer, och nattklubben på Gaiastova har öppet på lördagar och nås med bil. I Hemsedal ligger restaurangerna och utelivet i sentrum, dit skibussen går gratis. Vill du klara dig utan bil hela veckan är Hafjell fel val. Lillehammer och Øyer ligger en bit bort, och för allt utanför backen tar du bil eller buss. I Geilo stannar Bergensbanan i byn.',
  'Vid liftbotten går gondolen och Hafjellheis, och där ligger barnområdet Knerten och skidskolans samlingsplats. Vid gondolens toppstation finns lägenheterna i Favn och det största barnområdet. Gaiastova högst upp når du med bil, med eget familjeområde och gratis knapplift. Bor du i Lillehammer tar du bil eller buss till backen.',
  'Hafjell, Øyer, Lillehammer',
  'Från Oslo kör du E6 hela vägen. Flyger du landar du i Oslo. Tåget från Oslo lufthavn stannar i Lillehammer, och därifrån går buss till Hafjell Alpinsenter.',
  false
)
on conflict (slug) do nothing;

-- ── Prishistorik ──────────────────────────────────────────────────────
--
-- Samma tabell och form som 030 och 040–043. Hafjell får ingen rad:
-- båda priserna är okända, och tabellen kräver minst ett.

insert into public.lift_pass_prices
  (resort_slug, season, currency, day_price, week_price, product,
   day_source, week_source, source_url, captured_on, note)
values
('idre-fjall', '2026/2027', 'SEK', 671.00, 2827.00, 'Idre Fjäll Skipass',
 'ortens egen sida', 'ortens egen sida',
 'https://www.idrefjall.se/boka/search/1001/?startDate=2027-02-27&endDate=2027-03-04', '2026-11-18',
 'Start 27.2.2027 (6–8 dagar 27.2–4.3, samma pris för sex, sju och åtta dagar). Listpris; på nätet 5 % lägre, 10 % vid köp mer än 40 dagar före. Priset ändras med veckan.'),
('branas', '2026/2027', 'SEK', 595.00, 2710.00, 'Branäs liftkort',
 'ortens egen sida', 'ortens egen sida',
 'https://www.branas.se/skidakning-i-branas/liftkort/', '2026-11-18',
 'Prislista 26/27, ett pris hela säsongen. 6–8 dagar samma pris. Premiärhelgen 11–13.12 halva priset; kampanjpriset 2 440 gällde till 31.10.2026.')
on conflict (resort_slug, season, product) do nothing;

commit;


-- ── Efterkontroll ─────────────────────────────────────────────────────
--
--   select slug, published, region, ski_area, total_pistes_km,
--          total_lifts, snowmaking_coverage_pct,
--          lift_pass_day_eur, lift_pass_week_eur, lift_pass_currency,
--          nearest_airport, airport_distance_km, transfer_minutes,
--          transfer_note, season_start_month, season_end_month
--   from resorts
--   where slug in ('idre-fjall', 'branas', 'hafjell')
--   order by slug;
--
--   Förväntat: tre rader, published = false, ski_area null.
--   branas 23 km, 30 liftar, konstsnö null, 595 / 2710 SEK,
--     Scandinavian Mountains 88 / 85, 12–4.
--   hafjell 50 km, 18 liftar, 90 %, null / null NOK, Oslo 159 / 127, 11–4.
--   idre-fjall 41 km, 23 liftar, 90 %, 671 / 2827 SEK,
--     Scandinavian Mountains 120 / 117, 12–4.
--
--   select resort_slug, product, day_price, week_price
--   from lift_pass_prices
--   where resort_slug in ('idre-fjall', 'branas', 'hafjell');
--   Förväntat: två rader, 671/2827 och 595/2710.
--
--   Mönsterkontrollen i docs/copy.md och ordet för villkoret:
--   select slug from resorts
--   where slug in ('idre-fjall', 'branas', 'hafjell')
--     and (concat_ws(' ', notes, where_to_stay, transport_info)
--          ~ '( — |, vilket|snarare än|vykort)'
--          or concat_ws(' ', notes, where_to_stay, transport_info) ~* 'garanti');
--   Förväntat: noll rader.
