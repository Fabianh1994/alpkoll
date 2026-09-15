
-- 029 — ortstexterna omskrivna efter docs/copy.md
--
-- Alla trettio publicerade orter på en gång: notes, where_to_stay och
-- transport_info. En omskriven ort bredvid en i den gamla mallen är samma
-- delrättning som migration 024 och 028 undvek.
--
-- Rösten är den som godkändes i provomgången 13 september 2026 (Åre, Chamonix
-- och Hemsedal står här som de godkändes, utom en handskriven tid i Åres
-- resetext). Reglerna står i docs/copy.md. Under varje ort nedan står källan
-- för varje nytt namn och påstående, och det som strukits.
--
-- Två kontroller 15 september. Den första belade det som var nytt. Den andra
-- gick igenom de 24 uppgifter som följt med ur de gamla texterna utan att
-- kontrolleras om; de är nu belagda eller strukna. Källor märkta tredje part
-- är inte ortens, operatörens eller ett uppslagsverks egna.
--
-- Handskrivna restider, flygtider och turtätheter är borta ur alla tre fälten.
-- Bilresan från svenska städer visas i stället ur lib/restider.js, på
-- ortsidans vanliga frågor och sedan samma PR även på jämförelsesidorna och
-- alpsidorna. Kör migrationen efter merge; körs den före saknar
-- jämförelsesidorna bilresa tills deployen är klar.
--
-- Tal som står i texterna (pist, fallhöjd, andel blå pist, toppens höjd) är
-- kontrollerade mot databasen 15 september. Rättas talen i en senare
-- migration måste texterna följa med.
--
-- De åtta dolda orterna (published = false) rörs inte.
--
-- Omdömen om fel val stöds av poängen i docs/poangskala.md; vilket poängpar
-- som bär varje omdöme står under orten.

begin;

-- ── alpe-d-huez ───────────────────────────────────────────────────────
--
-- Källor:
--   · Sarenne 16 km, Pic Blanc 3 330 m till 1 510 m, 1 820 höjdmeter, slutar
--     i ravinen nedanför Auris:
--     skipass.alpedhuez.com/hiver/en/discover-alpe-dhuez-ski-resort/legendary-slopes/
--   · Sammankopplat med Vaujany, Oz-en-Oisans, Villard-Reculas och Auris; 21
--     hårnålskurvor på 13,8 km från Le Bourg-d'Oisans:
--     en.wikipedia.org/wiki/Alpe_d'Huez
--   · 250 km och 52 % röd: databasen
--   · Linbanan Vaujany–Alpette: remontees-mecaniques.net och skiresort.com
--     (tredje part)
--   · DMC, Jeux och Signal från Rond-Point des Pistes:
--     accommodation.alpedhuez.com/alpe-huez-winter/fun-slopes/
-- Struket:
--   · L'Île au Soleil och att snön blir opålitlig i mars, som ingen källa
--     bar
--   · Tåget till Grenoble och Grenobles flygplats
--   · "restaurangerna nära", "byn är utdragen" och "promenad eller skidbuss"
--     längre ner, som ingen källa bar
--   · "gondol" från Vaujany: det är en linbana till Alpette

update resorts set
  notes = 'Alpe d''Huez har 250 kilometer pist, och från Pic Blanc på 3 330 meter går Sarenne, en svart nedfart på 16 kilometer. Den slutar 1 820 höjdmeter längre ner, i ravinen nedanför Auris. Drygt hälften av pisten är röd. Området hänger ihop med Vaujany, Oz-en-Oisans, Villard-Reculas och Auris.',
  where_to_stay = 'Från Rond-Point des Pistes går liftarna DMC och Signal, så där bor du närmast åkningen. Vaujany, Oz-en-Oisans och Auris är byar i samma område, och från Vaujany går en linbana upp till Alpette.',
  transport_info = 'Flyg till Lyon. Sista biten går uppför vägen från Le Bourg-d''Oisans, 13,8 kilometer med 21 hårnålskurvor.'
where slug = 'alpe-d-huez';

-- ── are ───────────────────────────────────────────────────────────────
--
-- Källor:
--   · Godkänd i provomgången 13 september, källor där:
--     sv.wikipedia.org/wiki/Åre_(skidområde), skistar.com (skidbuss, Duved &
--     Tegefjäll, Åre Björnen)
-- Struket:
--   · "och har en timme kvar med bil" ur provomgångens förslag: en
--     handskriven restid, som redan står i rutan för sista biten

update resorts set
  notes = 'Åre har mest fallhöjd av de nordiska orterna här, 939 meter, och 91 kilometer pist på Åreskutan. Nattåget från Stockholm stannar mitt i byn. Åkningen är uppdelad i två liftsystem, Åre by med Björnen och Duved med Tegefjäll, och skidbussen mellan dem är gratis med SkiPass. När det blåser hårt på kalfjället stänger toppliftarna.',
  where_to_stay = 'Bo i Åre by om du vill ha restaurangerna och afterskin nära, med Kabinbanan upp från torget. Med små barn passar Björnen bättre, med gröna och blå backar och boende ski in/ski out. Duved är lugnare på kvällen och har ett nybörjarområde med knapplift och rullband. I Tegefjäll går Vildmarksstigen, en skogsstig för barn.',
  transport_info = 'Nattåget från Stockholm stannar mitt i Åre by. Flyger du landar du på Åre Östersund.'
where slug = 'are';

-- ── chamonix ──────────────────────────────────────────────────────────
--
-- Källor:
--   · Godkänd i provomgången 13 september, källor där:
--     en.wikipedia.org/wiki/Chamonix, en.chamonix.com (Vallée Blanche,
--     Brévent–Flégère, gästkortet), en.wikipedia.org/wiki/Les_Houches,
--     seechamonix.com och chamonixskipasses.com

update resorts set
  notes = 'Chamonix är orten för dig som vill åka brant och offpist och bo i en stad med liv året om. Linbanan till Aiguille du Midi tar dig till 3 842 meter, där Vallée Blanche börjar: drygt 20 kilometer offpist på glaciär, som turistbyrån avråder från utan bergsvana. Är du nybörjare är Chamonix fel val. Bara en femtedel av pisten är blå, och dalens skidområden hänger inte ihop. Courchevel har blå pist på mer än hälften av ett sammanhängande område.',
  where_to_stay = 'Bo i centrum om du vill gå till Brévent, som går upp direkt från stan och ligger i söderläge. Argentière längre upp i dalen ligger vid Grands Montets. Les Houches sex kilometer bort har långa nedfarter genom skogen och världscupens störtlopp på Kandahar, men Chamonix Le Pass gäller inte där. Liftkortet räknas som busskort i dalen, och med gästkortet från ditt boende åker du gratis på Mont-Blanc Express.',
  transport_info = 'Flyg till Genève. Därifrån går bussar direkt till Chamonix. Med tåg byter du i Saint-Gervais till Mont-Blanc Express, som stannar i byarna längs dalen.'
where slug = 'chamonix';

-- ── cortina-d-ampezzo ─────────────────────────────────────────────────
--
-- Källor:
--   · Tre områden, Faloria-Cristallo, Tofana-Socrepes och Cinque
--     Torri-Lagazuoi, förbundna med buss; Calalzo 35 km söderut med buss;
--     Venedig och Treviso: en.wikipedia.org/wiki/Cortina_d'Ampezzo
--   · Dolomiti Superski, tolv orter, 1 246 km, ungefär hälften
--     sammankopplad: en.wikipedia.org/wiki/Dolomiti_Superski
--   · Funivia Faloria, Cortina–Mandres–Faloria:
--     skiresort.com/en/ski-resort/cortina-dampezzo/ski-lifts/l419/
--   · Tofanaområdets liftar börjar en bit utanför stan, Pocol och Socrepes i
--     skogen lägre ner, bra i dåligt väder:
--     snow-wise.com/our-guide-to/ski-resorts/cortina-d-ampezzo/ (tredje
--     part)
--   · Buss till Tofana: moonhoneytravel.com och moovitapp.com (tredje part)
-- Struket:
--   · "dramatiska klippformationer runt en elegant stad" och "Dolomiternas
--     mest kända ort"
--   · "billigare" om Pocol, som ingen källa bar
--   · "lugnare på kvällen" om Pocol och Socrepes
--   · "tar skidbuss till liftarna" från centrum: linbanan till Faloria går
--     från stan

update resorts set
  notes = 'Cortina d''Ampezzo har 120 kilometer pist i tre områden runt staden: Tofana, Faloria-Cristallo och Cinque Torri-Lagazuoi. Mellan dem går skidbuss. Liftkortet Dolomiti Superski gäller i tolv orter med sammanlagt 1 246 kilometer pist, men ungefär hälften hänger inte ihop med resten, så för att använda kortet fullt ut behöver du bil eller buss.',
  where_to_stay = 'Från Cortina går linbanan till Faloria. Till Tofana-området tar du buss, och där ligger Pocol och Socrepes, med skogsbackar som går att åka i dåligt väder.',
  transport_info = 'Flyg till Venedig eller Treviso. Närmaste tågstation är Calalzo-Pieve di Cadore-Cortina, 35 kilometer söderut, med buss vidare.'
where slug = 'cortina-d-ampezzo';

-- ── courchevel ────────────────────────────────────────────────────────
--
-- Källor:
--   · Byarna och höjderna, altiporten 525 m och 18,5 %, restauranger med
--     Michelinstjärnor, hoppbackarna i Le Praz 1992:
--     en.wikipedia.org/wiki/Courchevel
--   · 600 km och 56 % blå: databasen, gäller hela Les 3 Vallées
--   · Gondolen mellan Le Praz och Courchevels centrum:
--     poma.net/realisation/praz-courchevel-telecabine/
--   · Grangettes mellan Courchevel Village och 1850, i drift varje dag till
--     klockan 23: poma.net/realisation/telecabine-des-grangettes/
-- Struket:
--   · "Frankrikes mest påkostade skidort"
--   · "en av världens brantaste landningsbanor"
--   · "Moriond är lugnare"
--   · "egna liftar upp i samma område" för Village och Le Praz, ersatt med
--     gondolernas namn
--   · "har utelivet" om 1850: bara belagt av en tredjepartssida

update resorts set
  notes = 'Courchevel är fyra byar på olika höjd i Les 3 Vallées, där pisten är 600 kilometer och över hälften blå. Byarna heter efter höjden: Le Praz på 1 300 meter, Courchevel Village på 1 550, Moriond på 1 650 och Courchevel 1850 högst upp. Ovanför 1850 ligger en flygplats för småplan, med en landningsbana på 525 meter och 18,5 procents lutning.',
  where_to_stay = 'I Courchevel 1850 finns flera restauranger med stjärnor i Guide Michelin. Från Le Praz går en gondol upp till 1850, och från Courchevel Village går gondolen Grangettes dit till sent på kvällen. I Le Praz står hoppbackarna från OS 1992.',
  transport_info = 'Flyg till Genève, Lyon eller Chambéry. Med tåg åker du till Moûtiers och tar buss upp.'
where slug = 'courchevel';

-- ── geilo ─────────────────────────────────────────────────────────────
--
-- Källor:
--   · Geilo stasjon på Bergensbanen sedan 1907, Hol kommun i Buskerud:
--     no.wikipedia.org/wiki/Geilo
--   · Liftbottnarna och skidbussen mellan dalsidorna, gratis, stannar vid de
--     flesta boenden: skigeilo.no/en/getting-around/ski-bus och
--     visitnorway.dk/listings/skigeilo/26568/
--   · 53 % blå, fallhöjd 399 och 830 m: databasen. Omdömet stöds av poängen:
--     avancerad 6 mot Hemsedals 8
-- Struket:
--   · "lika mycket längdskidort som alpin" och "en av få fjällorter du når
--     helt utan bil"
--   · Handskrivna tider för tåg och bil

update resorts set
  notes = 'Geilo passar dig som åker med barn eller är nybörjare. Över hälften av pisten är blå, och backarna ligger på båda sidor om dalen med Bergensbanans station i byn. Vill du åka brant är Geilo fel val. Fallhöjden är 399 meter, och Hemsedal har 830.',
  where_to_stay = 'SkiGeilo har sex liftbottnar: Vestlia, Kikut, Havsdalen, Slaatta, Geiloheisen och Halstensgård. Skidbussen mellan Geiloheisen och Vestlia på andra sidan dalen är gratis för alla, och den stannar vid de flesta boenden.',
  transport_info = 'Bergensbanan stannar i Geilo, så från Oslo kan du ta tåget hela vägen. Flyger du landar du i Oslo.'
where slug = 'geilo';

-- ── grandvalira ───────────────────────────────────────────────────────
--
-- Källor:
--   · Sju ingångar med höjder, gondol från Canillo och Encamp, sammanslaget
--     2003 av Pas de la Casa-Grau Roig och Soldeu-El Tarter:
--     es.wikipedia.org/wiki/Grandvalira
--   · 215 km: databasen
--   · Andbus från Barcelona T1 och T2 och från Toulouse flygplats till
--     Estació Nacional d'Autobusos i Andorra la Vella:
--     andbus.net/en/bus-stops
--   · Pas de la Casa vid gränsen mot Frankrike:
--     es.wikipedia.org/wiki/Pas_de_la_Casa
-- Struket:
--   · "Andorra är dessutom tullfritt, vilket märks i butikerna"
--   · Pas de la Casa "känt för uteliv och shopping snarare än charm"

update resorts set
  notes = 'Grandvalira har 215 kilometer pist i Andorra, mellan Pas de la Casa vid franska gränsen och Encamp. Området byggdes ihop 2003 av två äldre skidorter, Pas de la Casa-Grau Roig och Soldeu-El Tarter. Från Encamp och Canillo tar du gondol upp till pisten.',
  where_to_stay = 'Soldeu och El Tarter ligger mitt i området. Pas de la Casa och Grau Roig ligger högst, kring 2 100 meter. Encamp och Canillo ligger lägre, på 1 300 och 1 500 meter, och därifrån tar du gondolen upp på morgonen.',
  transport_info = 'Flyg till Barcelona eller Toulouse. Andbus kör från båda flygplatserna till busstationen i Andorra la Vella.'
where slug = 'grandvalira';

-- ── hemavan ───────────────────────────────────────────────────────────
--
-- Källor:
--   · Kungsleden börjar i Hemavan, omkring 400 km till Abisko; Hemavan cirka
--     19 km nordväst om Tärnaby; Anja Pärsons träningsbacke:
--     sv.wikipedia.org/wiki/Hemavan
--   · Stenmark flyttade som femåring till Slalomvägen i Tärnaby:
--     sv.wikipedia.org/wiki/Ingemar_Stenmark
--   · Flyg från Arlanda: populair.com/destinationer/hemavan/; gångavstånd
--     till backarna: hemavantarnabyairport.se/en/
--   · Poängen: offpist 8, gott om plats 8
--   · Stugor och lägenheter, hotell, vandrarhem:
--     hemavan.nu/en/accommodation-summer-and-autumn/
--   · Tärnabys fem liftar, Ingemarbacken och Anjabacken som de mest
--     krävande: hemavan.nu/en/skiing-2/lift-opening-times/tarnabys-lifts/
--   · Linje 31 Hemavan–Umeå:
--     tabussen.nu/lanstrafiken/planera-resa/lanets-busstationer/storuman-resecentrum/
--     och hemavan.nu/en/getting-here/car-or-bus/
-- Struket:
--   · "åretruntdestination" och "utsikt över naturreservatet"
--   · Handskrivna biltider från Umeå och Stockholm
--   · "Det mesta i Hemavan ligger nära liftarna"
--   · Tärnaby som "den större byn, med mer service"
--   · "via Lycksele och Storuman": Länstrafikens sida anger bara
--     ändpunkterna

update resorts set
  notes = 'Hemavan passar dig som vill åka offpist och slippa köer i en liten ort. Pisten är 32 kilometer, och här börjar Kungsleden, som går 400 kilometer norrut till Abisko. Anja Pärson hade sina träningsbackar här, och Ingemar Stenmark växte upp i Tärnaby två mil bort.',
  where_to_stay = 'Boendet i Hemavan är stugor, lägenheter, hotell och vandrarhem. Tärnaby har ett eget skidområde med fem liftar, där Ingemarbacken och Anjabacken är de mest krävande nedfarterna.',
  transport_info = 'Det går flyg från Arlanda till Hemavan Tärnaby Airport, och från flygplatsen går du till backarna. Länstrafiken i Västerbotten kör linje 31 mellan Umeå och Hemavan.'
where slug = 'hemavan';

-- ── hemsedal ──────────────────────────────────────────────────────────
--
-- Källor:
--   · Godkänd i provomgången 13 september, källor där: skistar.com (Hemsedal
--     skiområde), snl.no/Hemsedal_Skisenter, friflyt.no (offpist i Hemsedal)

update resorts set
  notes = 'Hemsedal har mest fallhöjd av de norska orterna här, och ingen nordisk ort här når högre än toppen på 1 450 meter. Därifrån åker du sex kilometer i ett svep ner till liftbotten. Två tredjedelar av pisten är blå. Vill du utanför pisten går Roniheisen till Gummiskogen, som tidningen Friflyt kallar Norges mest kända offpiståkning.',
  where_to_stay = 'Vid SkiStar Lodge har du barnområdet med Valles skiland och Lodge Express utanför dörren. Restaurangerna och utelivet finns nere i Hemsedal sentrum, dit skibussen går gratis.',
  transport_info = 'Flyg till Oslo och kör sista biten, eller kör hela vägen från Sverige. Under säsongen går bussar från Oslo.'
where slug = 'hemsedal';

-- ── ischgl ────────────────────────────────────────────────────────────
--
-- Källor:
--   · Silvretta Arena 239 km över gränsen till Samnaun:
--     ischgl.com/en/winter/silvretta-arena
--   · Samnaun Schweiz enda tullfria zon:
--     samnaun.ch/en/duty-free-shopping/duty-free-shopping-experience-samnaun
--   · De tre gondolerna från byn, Paznauntal: en.wikipedia.org/wiki/Ischgl
--   · Landeck-Zams som station för Ischgl:
--     ischgl.com/en/plan-your-trip/ischgl-a-z/landeck-zams-bahnhof_infra_100001697
--   · 21 % blå och 58 % röd, Kitzbühel 54 % blå: databasen. Omdömet stöds av
--     poängen: nybörjare 5 mot Kitzbühels 6, afterski 10
--   · Skidbussen mellan Galtür, Kappl, See och Ischgl, och bussarna
--     Landeck-Zams–Galtür gratis med personligt gästkort:
--     ischgl.com/en/winter/ski-bus
--   · Gratis skidbuss med liftkortet gäller bara säsongskort:
--     ischgl.com/en/winter/operating-times-prices/skipass-prices-silvretta
-- Struket:
--   · "Österrikes mest ökända partyort"
--   · Klockslaget för afterskin, som ingen källa bar
--   · "tullfritt, vilket märks på priserna i butikerna"
--   · Mathon och Galtür "lugnare"
--   · "gratis med liftkort": enligt ischgl.com gäller det bara säsongskort,
--     medan gästkortet ger gratis buss

update resorts set
  notes = 'Ischgl passar dig som vill åka mycket rött och gå på afterski. Silvretta Arena har 239 kilometer pist och går över gränsen till Samnaun, den enda tullfria zonen i Schweiz. Är du nybörjare är Ischgl fel val. Bara en femtedel av pisten är blå, och Kitzbühel har blå pist på över hälften.',
  where_to_stay = 'Bo i Ischgl om du vill gå till liftarna. Tre gondoler går upp från byn: Silvrettabahn, Fimbabahn och Pardatschgratbahn. Från Galtür, Kappl och See går skidbussen till Ischgl, gratis med gästkortet från ditt boende.',
  transport_info = 'Flyg till Innsbruck. Med tåg åker du till Landeck-Zams och tar bussen därifrån till Ischgl.'
where slug = 'ischgl';

-- ── kitzbuehel ────────────────────────────────────────────────────────
--
-- Källor:
--   · Streif sedan 1937, stadskärnan i stort sett bilfri, Hahnenkammbahn,
--     Kirchberg delar skidområde, fjärrtåg från Innsbruck och Graz:
--     en.wikipedia.org/wiki/Kitzbühel
--   · 188 km, 54 % blå, topp 2 000 m: databasen. Söldens glaciärer: se
--     Sölden nedan. Rådet stöds av poängen: snösäkerhet 7 mot Söldens 9
-- Struket:
--   · "alpina världscupens mest fruktade nedfart"
--   · "konstsnö är regel snarare än undantag", som ingen källa bar
--   · Direkttåg från München och Wien, som inte gick att belägga

update resorts set
  notes = 'Kitzbühel passar dig som vill bo i en gammal stad och åka skidor från den. Stadskärnan är i stort sett bilfri, och KitzSki har 188 kilometer pist där över hälften är blå. På Hahnenkamm går Streif, där Hahnenkammloppet körts sedan 1937. Toppen ligger på 2 000 meter, så vill du åka i april ger en glaciärort som Sölden säkrare snö.',
  where_to_stay = 'Bor du i stadskärnan har du restaurangerna och butikerna runt dig och nära till Hahnenkammbahn. Kirchberg är grannorten med egen ingång till samma skidområde.',
  transport_info = 'Flyg till Innsbruck eller Salzburg. Kitzbühel Hauptbahnhof har fjärrtåg från Innsbruck och Graz.'
where slug = 'kitzbuehel';

-- ── les-arcs ──────────────────────────────────────────────────────────
--
-- Källor:
--   · Aiguille Rouge 3 226 m, 7 km med 2 026 höjdmeter till Villaroger;
--     byarnas år; Perriand; bergbanan på cirka 7 minuter; Vanoise Express
--     och Paradiski 425 km: en.wikipedia.org/wiki/Les_Arcs
--   · 200 km: databasen
-- Struket:
--   · "praktiskt snarare än pittoreskt"
--   · "ovanligt smidigt jämfört med de flesta alporter"
--   · "på sju minuter" om bergbanan, en handskriven restid

update resorts set
  notes = 'Les Arcs passar dig som vill åka långt i ett stycke. Från Aiguille Rouge på 3 226 meter går en sju kilometer lång nedfart med 2 026 höjdmeter ner till Villaroger. Området har 200 kilometer pist, och med Paradiski-kortet når du även La Plagne via linbanan Vanoise Express, sammanlagt 425 kilometer.',
  where_to_stay = 'Arc 1600 är den äldsta byn, från 1968, och den du når med bergbanan från tågstationen i Bourg-Saint-Maurice. Arc 1800 är störst. Arc 2000 ligger högst, och Arc 1950 byggdes 2003–2008 i traditionell alpstil. De tre äldre byarna ritades av arkitekten Charlotte Perriand.',
  transport_info = 'Flyg till Genève. Med tåg åker du till Bourg-Saint-Maurice, där bergbanan tar dig upp till Arc 1600.'
where slug = 'les-arcs';

-- ── levi ──────────────────────────────────────────────────────────────
--
-- Källor:
--   · Säsongen ofta oktober till mitten av maj, slalom i mitten av november,
--     170 km norr om polcirkeln, byn Sirkka, Kolari station:
--     en.wikipedia.org/wiki/Levi,_Finland
--   · Fallhöjd 335 och 939 m: databasen. Omdömet stöds av poängen: avancerad
--     6 mot Åres 8
--   · Sirkka som Levis centrum, hotell, lägenheter och stugor, backarna till
--     fots, med skidbuss eller bil:
--     levi.fi/en/news-and-stories/sirkka-the-vibrant-heart-of-levi-surrounded-by-pure-lapland-nature/
--   · Finnair dagligen Helsingfors–Kittilä, buss från Kolari som möter varje
--     tåg: levi.fi/en/info/general/arrival-at-levi/
-- Struket:
--   · "i november och december åker man i mörker under norrsken"
--   · "bokas långt i förväg"
--   · "Från Sverige går flyget via Helsingfors": Levis sida nämner inte
--     Stockholm, och SAS sida om Kittilä gick inte att läsa

update resorts set
  notes = 'Levi passar dig som vill åka tidigt på säsongen. Liftarna brukar öppna i oktober, och i mitten av november körs världscupen i slalom här. Orten ligger 170 kilometer norr om polcirkeln. Vill du åka brant är Levi fel val. Fallhöjden är 335 meter, och Åre har 939.',
  where_to_stay = 'Byn Sirkka vid foten av Levi är ortens centrum, med hotell, lägenheter och stugor. Backarna når du till fots, med skidbuss eller en kort bilresa.',
  transport_info = 'Flyg till Kittilä. Finnair flyger dit från Helsingfors varje dag. Närmaste tågstation är Kolari, och bussen därifrån möter varje tåg.'
where slug = 'levi';

-- ── livigno ───────────────────────────────────────────────────────────
--
-- Källor:
--   · Ingen italiensk moms, byn på 1 816 m, Carosello 3000 och Mottolino, OS
--     2026 i Livigno Snow Park, Foscagnopasset 2 291 m, tunneln Munt la
--     Schera: en.wikipedia.org/wiki/Livigno
--   · Poängen: snowpark 8
--   · Över tio kilometer långt, fyra gratis busslinjer till alla liftar,
--     Skilink mellan dalsidorna: skipasslivigno.com/en/free-bus/
--   · Foscagnopasset brukar vara öppet året runt, tullen uppe på passet:
--     en.wikipedia.org/wiki/Foscagno_Pass
--   · Vägen via Bormio: skiresort.info (tredje part)
-- Struket:
--   · "sprit, tobak och utrustning märkbart billigare"
--   · "Räkna med att resan tar längre tid än avståndet antyder"
--   · "Kring centrum har du butikerna och liftar åt båda hållen"
--   · Att passet stängs vid kraftigt snöfall. Wikipedia skriver att det
--     brukar vara öppet året runt

update resorts set
  notes = 'Livigno passar dig som åker i snowpark. Tävlingarna i snowboard och freestyle under OS 2026 hölls i Livigno Snow Park. Byn ligger på 1 816 meter, och liftarna går upp på båda sidor om dalen, till Carosello 3000 och Mottolino. I Livigno betalar du ingen italiensk moms.',
  where_to_stay = 'Livigno är över tio kilometer långt, så läget avgör hur mycket du åker buss. De fyra busslinjerna går till alla liftar och är gratis, och Skilink går mellan liftarna på dalens två sidor.',
  transport_info = 'Flyg till Bergamo eller Milano. Vägen från Bormio går över Foscagnopasset på 2 291 meter, med tull uppe på passet. Från Schweiz kommer du in genom tunneln vid Munt la Schera.'
where slug = 'livigno';

-- ── madonna-di-campiglio ──────────────────────────────────────────────
--
-- Källor:
--   · Brentadolomiterna, sammankopplat med Pinzolo, Folgarida och Marilleva,
--     Canalone Miramonti som skogsnedfart och 3-Tre, Stenmarks första
--     världscupseger 17 december 1974:
--     en.wikipedia.org/wiki/Madonna_di_Campiglio
--   · 155 km: databasen
--   · Centrum till stor del bilfritt, linbanan 5 Laghi nära centrum:
--     locautorent.com (tredje part)
--   · Trentino Trasporti B201 Trento–Tione med anslutning
--     Tione–Pinzolo–Madonna di Campiglio, tidtabellen 10 september 2025–26
--     juni 2026: campigliodolomiti.it (PDF, läst med pdftotext)
-- Struket:
--   · "Elegant ort", "Alpernas mest dramatiska", "hit åker italienarna
--     själva"
--   · "märkbart billigare"
--   · "liftar åt flera håll från byn"
--   · Folgarida och Marilleva med "färre restauranger och barer"

update resorts set
  notes = 'Madonna di Campiglio ligger i Brentadolomiterna och har 155 kilometer pist ihop med Pinzolo, Folgarida och Marilleva. I Canalone Miramonti, en av nedfarterna genom skogen, körs världscupens nattslalom 3-Tre. Ingemar Stenmark tog sin första världscupseger i Madonna di Campiglio 1974.',
  where_to_stay = 'Centrum i Madonna di Campiglio är till stor del bilfritt, och linbanan 5 Laghi går från byn. Folgarida och Marilleva ingår i samma skidområde.',
  transport_info = 'Flyg till Verona. Med tåg åker du till Trento, och därifrån går Trentino Trasportis buss via Tione till Madonna di Campiglio.'
where slug = 'madonna-di-campiglio';

-- ── mayrhofen ─────────────────────────────────────────────────────────
--
-- Källor:
--   · Harakiri 78 %, Österrikes brantaste pist:
--     mayrhofen.at/en/stories/mountopolis-harakiri
--   · Penkenbahn från byn, Ahornbahn, Ahorn mest lätta och medelsvåra
--     nedfarter, Hintertux året runt, Zillertalbahn Jenbach–Mayrhofen:
--     en.wikipedia.org/wiki/Mayrhofen
--   · Poängen: avancerad 8, afterski 9
--   · Gratis skidbussar till Ahornbahn, Penkenbahn, Horbergbahn och Möslbahn
--     i Mayrhofen-Hippach:
--     mayrhofen.at/en/stories/skibus-mayrhofner-bergbahnen
--   · Horbergbahn med dalstation i Stockach och bergstation Horberg:
--     skiresort.com/en/ski-resort/mayrhofen-penken-ahorn-rastkogel-eggalm-mountopolis/ski-lifts/l1364/
-- Struket:
--   · "snön nere i dalen är opålitlig" som eget påstående; kvar står bara
--     att åkningen sker uppe på bergen
--   · Penkenbahn som "den lift du använder mest"
--   · "Hippach är lugnare och har egen lift": liften heter Horbergbahn och
--     går från Stockach

update resorts set
  notes = 'Mayrhofen passar dig som vill åka brant och gå på afterski i byn. På Penken går Harakiri, som orten kallar Österrikes brantaste pist, med 78 procents lutning. Byn ligger på 630 meter, så åkningen sker uppe på Penken och Ahorn. Hintertuxer Gletscher längre in i Zillertal har åkning året runt.',
  where_to_stay = 'Penkenbahn går från byn upp till Penken, och Ahornbahn till Ahorn, där nedfarterna mest är blå och röda. Horbergbahn från Stockach går upp till Horberg i samma område. Gratis skidbussar går till dalstationerna i Mayrhofen och Hippach.',
  transport_info = 'Flyg till Innsbruck. Med tåg byter du i Jenbach till Zillertalbahn, som går ända in till Mayrhofen.'
where slug = 'mayrhofen';

-- ── meribel ───────────────────────────────────────────────────────────
--
-- Källor:
--   · Peter Lindsay, första liften 1938, byggreglerna om trä, sten och
--     skiffertak, Mottaret 1 750 m, Les Allues:
--     en.wikipedia.org/wiki/Méribel
--   · 600 km och 56 % blå: databasen, gäller hela Les 3 Vallées. Poängen:
--     mellannivå 10, nybörjare 8
--   · Afterskin i Méribel Centre, Mottarets boende vid pisten och lugnare
--     afterski: seemeribel.com/mottaret och seemeribel.com/where-to-stay
--     (tredje part)
--   · Gondolen Olympe, Brides-les-Bains–Les Allues–Le Raffort–Méribel:
--     fr.wikipedia.org/wiki/Télécabine_de_l'Olympe
-- Struket:
--   · "den smidigaste utgångspunkten"
--   · "alpby snarare än som ett betongprojekt"
--   · Méribel Centre på 1 450 meter; Wikipedia anger cirka 1 400
--   · "Les Allues ligger lägst": gondolen börjar längre ner, i
--     Brides-les-Bains

update resorts set
  notes = 'Méribel ligger mitt i Les 3 Vallées, med 600 kilometer pist åt båda hållen och över hälften av den blå, så orten fungerar för sällskap där alla inte åker lika bra. Skotten Peter Lindsay byggde den första liften här 1938, och efter kriget byggdes husen efter regler om väggar i trä och sten och tak av skiffer.',
  where_to_stay = 'Méribel Centre har det mesta av afterskin. I Mottaret, på 1 750 meter, ligger mycket av boendet vid pisten, och afterskin är lugnare. Från Brides-les-Bains går gondolen Olympe via Les Allues upp till Méribel.',
  transport_info = 'Flyg till Genève eller Lyon. Med tåg åker du till Moûtiers och tar buss upp.'
where slug = 'meribel';

-- ── myrkdalen ─────────────────────────────────────────────────────────
--
-- Källor:
--   · Hotell, stugor och lägenheter, barnområdet med två tallriksliftar,
--     rullband och fyra gröna nedfarter:
--     visitvoss.no/en/myrkdalen-mountain-resort
--   · Poängen: offpist 9, gott om plats 9
--   · Gratis skidbuss från Voss station, anpassad efter tågen:
--     visitvoss.no/en/myrkdalen-skibuss
-- Struket:
--   · "känd för att få mest snö i Norge" och "i särklass". Orten själv
--     skriver "mer snö än nästan någon annanstans i Europa", och sajten bär
--     ingen snödata att jämföra med
--   · "kör upp" från Voss

update resorts set
  notes = 'Myrkdalen passar dig som vill åka offpist och slippa köer. Orten ligger i Voss kommun och består av ett hotell, stugor och lägenheter vid liftfoten, så här finns lite annat än skidåkning.',
  where_to_stay = 'Bor du i Myrkdalen har du backen utanför dörren. Barnområdet har egna knapplifter, ett rullband och fyra gröna nedfarter. Vill du ha restauranger och stadsliv bor du i Voss och tar skidbussen.',
  transport_info = 'Flyg till Bergen. Bergensbanan går till Voss, och från stationen går en gratis skidbuss till Myrkdalen, anpassad efter tågen till och från Bergen och Oslo.'
where slug = 'myrkdalen';

-- ── riksgransen ───────────────────────────────────────────────────────
--
-- Källor:
--   · Liftarna från februari, sex liftar, station på Malmbanan, Hotel
--     Riksgränsen: sv.wikipedia.org/wiki/Riksgränsen
--   · Heliski från mitten av mars till mitten av maj:
--     riksgransen.se/en/experiences/skiing-trails/heliski/
--   · Nattåget Stockholm–Narvik utan byte december 2026–december 2028:
--     trafikverket.se, nyhet juni 2026. Att det stannar i Riksgränsen:
--     vagabond.se och en.wikipedia.org/wiki/Night_trains_of_Sweden
--   · Åre öppnar i november: databasen, season_start_month
--   · Stationen 700 m in i Sverige:
--     en.wikipedia.org/wiki/Riksgränsen_Station
--   · Björkliden med liftar och pister, station på Malmbanan, gratis
--     transferbuss med liftkort mellan Riksgränsen och Björkliden:
--     kirunalapland.se/resmal/bjorkliden/
-- Struket:
--   · "ett drygt dygn" med nattåget, obelagt sedan copygranskningen
--   · "men det är inte därför man åker hit" och "dragplåstret"
--   · Narvik via Oslo
--   · "i praktiken ett hotell vid järnvägsstationen, med backen utanför
--     dörren"
--   · Stationen "som ligger vid backen"

update resorts set
  notes = 'Riksgränsen passar dig som vill åka offpist och sent på våren. Liftarna öppnar i februari, och från mitten av mars till mitten av maj flyger helikoptrar upp skidåkare på topparna runt orten. Pisten är 21 kilometer med sex liftar. Vill du åka i december eller januari är Riksgränsen fel val, eftersom liftarna inte har öppnat. Åre öppnar i november.',
  where_to_stay = 'Riksgränsen ligger 700 meter från norska gränsen, med järnvägsstation och Hotel Riksgränsen. Björkliden, mellan Riksgränsen och Abisko längs Malmbanan, har ett eget skidområde, och med liftkort åker du gratis transferbuss mellan orterna.',
  transport_info = 'Nattåget mellan Stockholm och Narvik stannar vid Riksgränsens station. Flyger du landar du i Kiruna.'
where slug = 'riksgransen';

-- ── ruka ──────────────────────────────────────────────────────────────
--
-- Källor:
--   · Säsongen börjar oftast i oktober, över 500 km längdspår, Nordic
--     Opening i nordisk kombination varje år:
--     en.wikipedia.org/wiki/Ruka,_Finland
--   · Fallhöjd 201 och 939 m: databasen. Omdömet gäller längd, som poängen
--     inte mäter, och står inte emot avancerad 7
--   · Bilfri bykärna, lägenheter, hotellrum vid backarna och stugliknande
--     boende, Kuusamo med mer service:
--     ruka.fi/en/skiresort/accommodation/rukavillage
--   · Finnair Helsingfors–Kuusamo:
--     finnair.com/en/flights/city-to-city/hel/kao/flights-from-Helsinki-to-Kuusamo
-- Struket:
--   · "under mörkertiden ingår norrskenet i paketet"
--   · "räkna med två dagar från Stockholm", en handskriven restid
--   · Kuusamo "utan skidåkning"
--   · "Från Sverige byter du i Helsingfors": bara belagt av en
--     tredjepartssida

update resorts set
  notes = 'Ruka passar dig som vill åka tidigt på säsongen eller kombinera utförsåkning med längd. Liftarna öppnar oftast i oktober, och runt fjället finns över 500 kilometer längdspår. Varje säsong börjar världscupen i nordisk kombination här. Vill du ha långa nedfarter är Ruka fel val. Fallhöjden är 201 meter, och Åre har 939.',
  where_to_stay = 'Ruka har en bilfri bykärna vid backarna, med lägenheter, hotellrum och stugor. Kuusamo, där flygplatsen ligger, har mer service.',
  transport_info = 'Flyg till Kuusamo. Finnair flyger dit från Helsingfors.'
where slug = 'ruka';

-- ── saas-fee ──────────────────────────────────────────────────────────
--
-- Källor:
--   · Bilfritt sedan 1951, parkering utanför, eldrivna fordon, Metro Alpin
--     till Mittelallalin, 13 toppar över 4 000 m, postbuss från Brig och
--     Visp, Saas-Grund och Saas-Almagell: en.wikipedia.org/wiki/Saas-Fee
--   · 100 km, 20 % blå, topp 3 573 m: databasen. Poängen: snösäkerhet 9
--   · Parkeringshuset vid infarten, eldrivna taxibilar, fem gratis
--     elbusslinjer under högsäsong: de.wikivoyage.org/wiki/Saas-Fee
--   · Hohsaas i Saas-Grund och Furggstalden i Saas-Almagell:
--     saastalbergbahnen.ch
--   · Alpin Express från byns centrum med gångbro till parkeringshuset:
--     seilbahninventar.ch/objekt.php?objid=40464
--   · Metro Alpin från Felskinn: en.wikipedia.org/wiki/Metro_Alpin
-- Struket:
--   · "världens högsta bergbana under jord"
--   · "snön hör till Alpernas säkraste"
--   · Alpin Express "i södra änden", som ingen källa bar
--   · "Det mesta nås till fots"
--   · "mindre" om skidområdena i Saas-Grund och Saas-Almagell

update resorts set
  notes = 'Saas-Fee passar dig som vill ha säker snö och bo i en bilfri by. Skidområdet når 3 573 meter, och Metro Alpin, en bergbana i tunnel, går upp till Mittelallalin. Byn har varit bilfri sedan 1951 och är omgiven av 13 toppar över 4 000 meter. Pisten är 100 kilometer, och bara en femtedel av den är blå.',
  where_to_stay = 'Bilen ställer du i parkeringshuset vid infarten. I byn går du, åker eldriven taxi eller tar någon av elbussarna, som är gratis under högsäsong. Alpin Express går från byns centrum, med gångbro till parkeringshuset, upp mot Felskinn, där Metro Alpin börjar. Saas-Grund och Saas-Almagell i samma dal har egna skidområden, Hohsaas och Furggstalden.',
  transport_info = 'Flyg till Genève eller Zürich. Med tåg åker du till Visp eller Brig och tar postbussen upp.'
where slug = 'saas-fee';

-- ── salen ─────────────────────────────────────────────────────────────
--
-- Källor:
--   · De fyra områdena på ett SkiPass, Valleberget, Experium, Högfjället
--     minst med transportliftar till Lindvallen, Trollskogen, Tandådalens
--     krävande backar och Snow Park:
--     skistar.com/sv/vara-skidorter/salen/vinter-i-salen/skidomraden/
--   · Skidbussen gratis med SkiPass:
--     skistar.com/sv/vara-skidorter/salen/vinter-i-salen/servicetjanster/skidbuss/
--   · Att Lindvallen–Högfjället och Tandådalen–Hundfjället förbinds av
--     skidbuss och inte lift: handoffen, beslutet om Sälen som en ort
--   · Omdömet ordagrant ur docs/copy.md. Poängen: nybörjare 10, familj 10,
--     avancerad 5
--   · Fjällexpressen från Stockholm, Göteborg och Malmö under
--     vintersäsongen:
--     skistar.com/sv/vara-skidorter/salen/vinter-i-salen/resan-hit/res-med-buss/
--   · Bara vintertrafik:
--     scandinavianmountains.se/en/passengers/destination-schedule/
-- Struket:
--   · "Sveriges mest besökta skidområde"
--   · "mjuk snarare än dramatisk"
--   · Tandådalen med mest afterski, som SkiStar inte skriver
--   · Handskrivna biltider
--   · "tjugo minuter bort" om flygplatsen, en handskriven tid som redan står
--     i rutan för sista biten
--   · "De flesta kör till Sälen", som ingen källa bar
--   · "ett fåtal linjer": flygplatsen har nio destinationer i vinter

update resorts set
  notes = 'Sälen passar dig som åker med barn eller står på skidor för första gången. SkiStars fyra områden, Lindvallen, Högfjället, Tandådalen och Hundfjället, har gemensamt liftkort. De hänger ihop två och två, och mellan paren går skidbussen gratis med SkiPass. Vill du åka brant är Sälen fel val. Fallhöjden är 315 meter, minst av de svenska orterna här. Åre har 939.',
  where_to_stay = 'Med små barn passar Lindvallen, där barnområdet Valleberget har egna liftar och Experium har äventyrsbad. Högfjället är minst, med mest gröna och blå backar, och har liftar över till Lindvallen. I Hundfjället går barnnedfarten Trollskogen genom skogen. Tandådalen har de mer krävande backarna och Snow Park.',
  transport_info = 'Under vintersäsongen kör Fjällexpressen buss till Sälen från bland annat Stockholm, Göteborg och Malmö. Scandinavian Mountains Airport har bara trafik under vintersäsongen.'
where slug = 'salen';

-- ── solden ────────────────────────────────────────────────────────────
--
-- Källor:
--   · Gaislachkogl 3 058 m, Tiefenbachkogl 3 250 m, Schwarze Schneid 3 340 m
--     med lift, start vid Giggijochbahn:
--     soelden.com/en/activities/winter/skiing-snowboarding/highlights-in-the-ski-area/big3-viewing-platforms-rally
--   · Rettenbach- och Tiefenbachglaciären, världscupen i oktober, Hochsölden
--     2 090 m: en.wikipedia.org/wiki/Sölden
--   · Poängen: snösäkerhet 9, afterski 9
--   · Gaislachkoglbahn från Dorfstraße i Sölden: soelden.com
--     (Gaislachkoglbahn I + II)
--   · Hotellen i Hochsölden direkt vid pisten: hotelhochsoelden.at och
--     skihotel-edelweiss.at (hotellens egna sidor)
--   · Giggijochbahn, Giggijochstraße 18 i Sölden: soelden.com
--     (Giggijochbahn)
-- Struket:
--   · "mer funktionell än vacker; hit åker man för snön, inte för vykorten"
--   · "lika känd för sitt uteliv som för åkningen"
--   · "Sölden sträcker sig längs dalen"
--   · Hochsölden "mindre och lugnare"

update resorts set
  notes = 'Sölden passar dig som vill vara säker på snön och gå på afterski. Skidområdet har två glaciärer, Rettenbach och Tiefenbach, och tre toppar med lift över 3 000 meter: Gaislachkogl, Tiefenbachkogl och Schwarze Schneid. På Rettenbachglaciären körs världscupens första tävlingar varje oktober.',
  where_to_stay = 'Giggijochbahn och Gaislachkoglbahn går upp från byn, så bo nära någon av dem. I Hochsölden på 2 090 meter ligger hotellen direkt vid pisten.',
  transport_info = 'Flyg till Innsbruck.'
where slug = 'solden';

-- ── st-anton ──────────────────────────────────────────────────────────
--
-- Källor:
--   · Orterna i Ski Arlberg, Valluga 2 811 m och baksidan mot Zürs bara med
--     guide, Hannes Schneider och Arlbergtekniken, Galzigbahn,
--     Nassereinbahn, stationen på Arlbergbanan:
--     en.wikipedia.org/wiki/St._Anton_am_Arlberg
--   · 300 km: databasen (Wikipedia anger 340). Poängen: avancerad 10,
--     offpist 10, afterski 10
--   · Galzigbahn och Nassereinbahn:
--     en.wikipedia.org/wiki/St._Anton_am_Arlberg
--   · St. Christoph på 1 793 m med ett fyrtiotal invånare:
--     stantonamarlberg.com (St. Christoph)
--   · St. Christoph och Stuben i Ski Arlberg:
--     en.wikipedia.org/wiki/Ski_Arlberg
-- Struket:
--   · "Österrikes största sammanhängande skidområde"
--   · "har rykte om sig att vara brant"
--   · Mooserwirt vid tretiden, som ingen källa bar
--   · Lech och Zürs "dyrare och mer eleganta"
--   · "Byn är kompakt, och det mesta ligger nära Galzigbahn"
--   · St. Christoph och Stuben "mindre och lugnare"

update resorts set
  notes = 'St. Anton passar dig som vill åka brant och offpist och gå på afterski. Ski Arlberg binder ihop St. Anton med St. Christoph, Stuben, Zürs, Lech och Warth-Schröcken till 300 kilometer pist. Från Valluga på 2 811 meter går baksidan ner mot Zürs, och den får du bara åka med guide. Hannes Schneider, som utvecklade Arlbergtekniken, var skidlärare här.',
  where_to_stay = 'Galzigbahn går upp från St. Anton, och Nassereinbahn från Nasserein. St. Christoph, med ett fyrtiotal invånare på 1 793 meter, och Stuben ingår i samma skidområde.',
  transport_info = 'Flyg till Innsbruck eller Zürich. Arlbergbanan mellan Innsbruck och Bludenz stannar i St. Anton.'
where slug = 'st-anton';

-- ── tignes ────────────────────────────────────────────────────────────
--
-- Källor:
--   · Byn under vattnet 1952, byarna på 2 100 m, Les Brévières 1 550 m som
--     rest av den gamla byn, Grande Motte-åkning delar av sommaren och
--     hösten, Tignes–Val d'Isère 300 km: en.wikipedia.org/wiki/Tignes
--   · Zermatt bilfritt och glaciäråkning: se Zermatt nedan. Omdömet stöds av
--     poängen: bykänsla 5 mot Zermatts 10
--   · Buss S83 från Bourg-Saint-Maurice till alla Tignes byar, året runt:
--     altibus.com/en/arriving-by-train/bus-bourg-saint-maurice-tignes/
--   · Tignes–Val d'Isère ett skidområde: en.wikipedia.org/wiki/Tignes
-- Struket:
--   · "högt, funktionellt och utan charm"
--   · "Val d'Isère bredvid är vackrare, och dyrare"
--   · "sommaren" som helårsåkning; Wikipedia skriver att åkningen året runt
--     har upphört
--   · "med pisten nära" om byarna på 2 100 meter
--   · "ingår i samma liftkort": källan säger samma skidområde

update resorts set
  notes = 'Tignes passar dig som vill åka mycket och högt. Tillsammans med Val d''Isère har området 300 kilometer pist, och på Grande Motte-glaciären går det att åka under delar av sommaren och hösten. Vill du bo i en gammal alpby är Tignes fel val. Den gamla byn hamnade under vattnet när dammen byggdes 1952, och dagens Tignes är en skidort som byggdes upp efter det. Zermatt har också glaciäråkning, i en bilfri by.',
  where_to_stay = 'Val Claret, Le Lac och Le Lavachet ligger på 2 100 meter. Les Boisses och Les Brévières ligger lägre, och Les Brévières på 1 550 meter är det som finns kvar av den ursprungliga bebyggelsen. Val d''Isère på andra sidan hör till samma skidområde.',
  transport_info = 'Flyg till Genève. Med tåg åker du till Bourg-Saint-Maurice, och bussen därifrån stannar i Les Brévières, Tignes 1800, Le Lac och Val Claret.'
where slug = 'tignes';

-- ── trysil ────────────────────────────────────────────────────────────
--
-- Källor:
--   · Turistsenteret och Skihytta på södra sidan, Høyfjellssenteret i
--     Fageråsen på norra, barnområdena Eventyr, Gammelgård och vid
--     Valleheisen, SkiStar Bus:
--     skistar.com/sv/vara-skidorter/trysil/vinter-i-trysil/skidomradet/
--   · Høyfjellssenteret i Fageråsen: no.wikipedia.org/wiki/Trysilfjellet
--   · Fallhöjd 705 och 830 m: databasen. Omdömet stöds av poängen: avancerad
--     6 mot Hemsedals 8
--   · Bara vintertrafik:
--     scandinavianmountains.se/en/passengers/destination-schedule/
-- Struket:
--   · "Norges största skidort"
--   · "du alltid hittar en sida i lä"
--   · Turistsenteret "på västsidan" och Fageråsen som eget område; enligt
--     SkiStar ligger Turistsenteret på södra sidan och Høyfjellssenteret i
--     Fageråsen
--   · Handskrivna biltider
--   · "De flesta svenskar kör till Trysil", som ingen källa bar
--   · Sälens flygplats "ligger närmare men har begränsad säsongstrafik"

update resorts set
  notes = 'Trysil passar dig som åker med barn. Skidområdet ligger runt Trysilfjellet, med boende på både norra och södra sidan, och varje område har ett eget barnområde. Vill du åka brant är Trysil fel val. Fallhöjden är 705 meter, och Hemsedal har 830.',
  where_to_stay = 'Turistsenteret på södra sidan är det mest centrala området och har barnområdet Eventyr. Høyfjellssenteret ligger i Fageråsen på norra sidan, med barnområdet Gammelgård. Skihytta på södra sidan har ett tredje barnområde vid Valleheisen. SkiStar Bus går mellan områdena, men välj sida efter var du vill åka.',
  transport_info = 'Flyger du landar du i Oslo eller på Scandinavian Mountains Airport vid Sälen, som bara har trafik under vintersäsongen.'
where slug = 'trysil';

-- ── val-thorens ───────────────────────────────────────────────────────
--
-- Källor:
--   · Byn på 2 300 m, Cime de Caron 3 200 m, Les 3 Vallées 600 km:
--     en.wikipedia.org/wiki/Val_Thorens
--   · Parkeringsförbud på gatorna 15 november–15 maj, pisterna mellan husen:
--     prendsmaplace.fr/fr/blog/stationnement-a-val-thorens (tredje part;
--     valthorens.com svarade 403)
--   · Poängen: snösäkerhet 10, mellannivå 10, bykänsla 6
--   · Direkt till pisten från de flesta boenden: village-montana.com
--     (boendeoperatör, tredje part)
--   · Bussen från busstationen bredvid tågstationen i Moûtiers, året runt:
--     altibus.com/en/arriving-by-train/bus-moutiers-val-thorens-altibus/
-- Struket:
--   · "Europas högst belägna skidby"
--   · "världens största sammanhängande skidområde"
--   · "byggd för åkning snarare än för vykort"
--   · "Nästan allt boende ligger vid pisten", omformulerat efter källan
--   · Saint-Martin-de-Belleville med "mer bykänsla": ortens egen sida bär
--     inte jämförelsen
--   · "Vintertid går bussarna i anslutning till tågen": Altibus skriver det
--     inte

update resorts set
  notes = 'Val Thorens passar dig som vill vara säker på snön och åka mycket. Byn ligger på 2 300 meter, med pisterna mellan husen, och härifrån når du hela Les 3 Vallées med 600 kilometer pist. Högst upp kommer du med linbana till Cime de Caron på 3 200 meter.',
  where_to_stay = 'Orten är byggd så att du kan åka direkt från de flesta boenden. På gatorna får du inte parkera under säsongen, så bilen står på parkeringen.',
  transport_info = 'Flyg till Genève, Lyon eller Chambéry. Med tåg åker du till Moûtiers, där bussen till Val Thorens går från busstationen bredvid tågstationen.'
where slug = 'val-thorens';

-- ── verbier ───────────────────────────────────────────────────────────
--
-- Källor:
--   · 4 Vallées-orterna, Mont Fort 3 330 m, Médran, Freeride World
--     Tour-finalen på Bec des Rosses, byn på cirka 1 500 m, Saint-Bernard
--     Express från Martigny till Le Châble och linbana eller postbuss upp:
--     en.wikipedia.org/wiki/Verbier
--   · 412 km, 26 % blå, Méribel 56 %: databasen. Omdömet stöds av poängen:
--     nybörjare 5 mot Méribels 8
--   · Läget som balkong över Val de Bagnes, 1 500 m, gondolerna från Médran:
--     skiinfo.fr/valais/verbier/station-de-ski (tredje part)
-- Struket:
--   · "Schweiz största skidområde och ett av Europas mest kända för offpist"
--   · "Verbier är dyrt, och utelivet märks"
--   · "solterrass" och "det mesta går att gå till"
--   · Nendaz och La Tzoumaz "billigare"

update resorts set
  notes = 'Verbier passar dig som vill åka offpist. Finalen i Freeride World Tour avgörs varje år på Bec des Rosses, och skidområdet 4 Vallées binder ihop Verbier med Nendaz, Veysonnaz, Thyon och La Tzoumaz till 412 kilometer pist, upp till Mont Fort på 3 330 meter. Är du nybörjare är Verbier fel val. Bara en fjärdedel av pisten är blå, och Méribel har blå pist på över hälften.',
  where_to_stay = 'Verbier ligger som en balkong över Val de Bagnes, på 1 500 meter, och från Médran går gondolerna in i skidområdet. Nendaz och La Tzoumaz ingår i samma område.',
  transport_info = 'Flyg till Genève. Med tåg byter du i Martigny till Saint-Bernard Express, som går till Le Châble. Därifrån tar du linbanan eller postbussen upp till Verbier.'
where slug = 'verbier';

-- ── voss ──────────────────────────────────────────────────────────────
--
-- Källor:
--   · Voss gondol öppnad 2019, från Voss stasjon upp till Hanguren på cirka
--     820 m, del av Voss Resort: no.wikipedia.org/wiki/Voss_Gondol
--   · 45 km och botten på 284 m: databasen
--   · Vossevangen vid Vangsvatnet, stationen på Vossevangen:
--     no.wikipedia.org/wiki/Vossevangen
--   · Stugområdena i Voss Resort, Bavallstunet 100–500 m från liften:
--     vossresort.no/en/accommodation/cabin/
-- Struket:
--   · "Norges huvudstad för extremsport"
--   · "en av få orter där tåget tar dig hela vägen"
--   · "Bavallen" som namn på boendet: Voss Resort kallar områdena
--     Bavallstunet och Bavallslia
--   · "snön i de lägsta backarna är osäker", en slutsats ur höjden utan
--     källa

update resorts set
  notes = 'Voss passar dig som vill ta tåget ända fram till liften. Voss gondol går sedan 2019 från järnvägsstationen upp till Hanguren på 820 meter. Skidområdet har 45 kilometer pist, och de nedersta backarna ligger på 284 meter.',
  where_to_stay = 'Vossevangen ligger vid Vangsvatnet, med järnvägsstationen och gondolen. Vill du bo vid backen har Voss Resort stugområden nära liftarna, som Bavallstunet.',
  transport_info = 'Flyg till Bergen. Bergensbanan från Bergen och Oslo stannar i Voss, och gondolen går från stationen.'
where slug = 'voss';

-- ── zermatt ───────────────────────────────────────────────────────────
--
-- Källor:
--   · Bilfritt, eldrivna fordon, Gornergratbanan, Klein Matterhorn,
--     sommaråkning på Theodulglaciären, över gränsen via Plateau Rosa:
--     en.wikipedia.org/wiki/Zermatt
--   · Pendeltåget från Matterhorn Terminal Täsch in till byn:
--     matterhorngotthardbahn.ch/en/stories/parking-matterhorn-terminal-taesch
--   · 322 km, topp 3 899 m: databasen. Poängen: snösäkerhet 10, avancerad
--     10, offpist 10
--   · Bahnhofstrasse som huvudgata: en.wikipedia.org/wiki/Monte_Rosa_Hotel
--   · Matterhorn Express dalstation på Schluhmattstrasse:
--     matterhornparadise.ch/en/about/news/new-matterhorn-express-valley-station_news_3496913
--   · Gornergratbanans station mitt emot Zermatts järnvägsstation:
--     en.wikipedia.org/wiki/Zermatt_GGB_railway_station
-- Struket:
--   · "den säkraste snön i Alperna"
--   · "en by som hör till de vackraste i Schweiz"
--   · "Priset märks — liftkortet är bland Alpernas dyraste"
--   · "Matterhorn syns från förvånansvärt många fönster"
--   · Glacier Express
--   · "var tjugonde minut", en tidtabell i löptext
--   · "har hotellen, butikerna och restaurangerna" om Bahnhofstrasse
--   · "hotellens skjutsar"
--   · "den längsta promenaden i pjäxor", ersatt med var liftarna går
--   · "i byns ände" om Matterhorn Express: Zermatt Bergbahnens sidor anger
--     bara gatan

update resorts set
  notes = 'Zermatt passar dig som vill åka brant och offpist med säker snö. Matterhorn Ski Paradise har 322 kilometer pist och når 3 899 meter, och från Plateau Rosa åker du över gränsen till Cervinia i Italien. På glaciären bakom Klein Matterhorn går det att åka även under delar av sommaren.',
  where_to_stay = 'Privatbilar får inte köras i Zermatt, så i byn går du till fots, och bagaget tar eldrivna taxibilar. Bahnhofstrasse är huvudgatan. Gornergratbanan går från stationen och Matterhorn Express från Schluhmattstrasse, så bo nära den du ska åka mest.',
  transport_info = 'Flyg till Genève eller Zürich och ta tåget via Visp. Kör du ställer du bilen i Täsch och tar pendeltåget därifrån in till Zermatt.'
where slug = 'zermatt';

commit;

-- Efterkontroll 1: ska ge 30. Räknar publicerade orter vars ortstext börjar
-- som i den här migrationen.
--
-- select count(*) from resorts
-- where published and (
--   (slug = 'alpe-d-huez' and notes like 'Alpe d''Huez har 250 kilometer pist, och %') or
--   (slug = 'are' and notes like 'Åre har mest fallhöjd av de nordiska ort%') or
--   (slug = 'chamonix' and notes like 'Chamonix är orten för dig som vill åka b%') or
--   (slug = 'cortina-d-ampezzo' and notes like 'Cortina d''Ampezzo har 120 kilometer pist%') or
--   (slug = 'courchevel' and notes like 'Courchevel är fyra byar på olika höjd i %') or
--   (slug = 'geilo' and notes like 'Geilo passar dig som åker med barn eller%') or
--   (slug = 'grandvalira' and notes like 'Grandvalira har 215 kilometer pist i And%') or
--   (slug = 'hemavan' and notes like 'Hemavan passar dig som vill åka offpist %') or
--   (slug = 'hemsedal' and notes like 'Hemsedal har mest fallhöjd av de norska %') or
--   (slug = 'ischgl' and notes like 'Ischgl passar dig som vill åka mycket rö%') or
--   (slug = 'kitzbuehel' and notes like 'Kitzbühel passar dig som vill bo i en ga%') or
--   (slug = 'les-arcs' and notes like 'Les Arcs passar dig som vill åka långt i%') or
--   (slug = 'levi' and notes like 'Levi passar dig som vill åka tidigt på s%') or
--   (slug = 'livigno' and notes like 'Livigno passar dig som åker i snowpark. %') or
--   (slug = 'madonna-di-campiglio' and notes like 'Madonna di Campiglio ligger i Brentadolo%') or
--   (slug = 'mayrhofen' and notes like 'Mayrhofen passar dig som vill åka brant %') or
--   (slug = 'meribel' and notes like 'Méribel ligger mitt i Les 3 Vallées, med%') or
--   (slug = 'myrkdalen' and notes like 'Myrkdalen passar dig som vill åka offpis%') or
--   (slug = 'riksgransen' and notes like 'Riksgränsen passar dig som vill åka offp%') or
--   (slug = 'ruka' and notes like 'Ruka passar dig som vill åka tidigt på s%') or
--   (slug = 'saas-fee' and notes like 'Saas-Fee passar dig som vill ha säker sn%') or
--   (slug = 'salen' and notes like 'Sälen passar dig som åker med barn eller%') or
--   (slug = 'solden' and notes like 'Sölden passar dig som vill vara säker på%') or
--   (slug = 'st-anton' and notes like 'St. Anton passar dig som vill åka brant %') or
--   (slug = 'tignes' and notes like 'Tignes passar dig som vill åka mycket oc%') or
--   (slug = 'trysil' and notes like 'Trysil passar dig som åker med barn. Ski%') or
--   (slug = 'val-thorens' and notes like 'Val Thorens passar dig som vill vara säk%') or
--   (slug = 'verbier' and notes like 'Verbier passar dig som vill åka offpist.%') or
--   (slug = 'voss' and notes like 'Voss passar dig som vill ta tåget ända f%') or
--   (slug = 'zermatt' and notes like 'Zermatt passar dig som vill åka brant oc%')
-- );
--
-- Efterkontroll 2: ska ge noll rader. Mönstren ur docs/copy.md och handskrivna
-- tider. Inga ordgränser behövs, så uttrycket är detsamma i Postgres och JS.
--
-- select slug from resorts
-- where published
--   and concat_ws(' ', notes, where_to_stay, transport_info)
--       ~* '( — |, vilket|snarare än|vykort|timm|minut)';
