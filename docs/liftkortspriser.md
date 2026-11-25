# Liftkortspriser från ortens egen sida

**Arbetsdokument, påbörjat 2026-08-12.** Tjugotvå av de trettio publicerade
orterna är hämtade och kontrollerade, med både dags- och sexdagarspris utom
för St. Anton. Av de åtta som återstår är sju blockerade av att orten inte
publicerat vinterpriser ännu — sajterna står i sommarläge i augusti — och en
är underkänd på område.

**Migrationen måste bevara de gamla priserna.** Fabian vill publicera en
årlig nyhetsartikel om hur mycket varje ort höjde liftkortspriset mot året
innan. En `UPDATE` som byter värdet utan att skriva ut det gamla raderar
underlaget för den artikeln. Antingen en pristabell med säsong per rad,
eller minst att varje prismigration skriver föregående värde i klartext så
att serien går att läsa ur `supabase/migrations/`. Jämförelsen ska göras i
ortens egen valuta — en kursrörelse är inte en prishöjning — och måste avse
samma produkt båda åren, annars visar de underkända orterna nedan en
femtioprocentig "höjning" som bara är ett annat område.

**Avgjort 2026-08-30: pristabellen, inte kommentarerna.**
`022_lift_pass_price_history.sql` skapar `lift_pass_prices` med ort, säsong,
valuta, produkt och källa per pris, och lägger in de tjugotre hämtade priserna
ur tabellen nedan. Fyra av dem bär säsongen 25/26 i klartext — geilo,
riksgransen, st-anton, madonna-di-campiglio — vilket är hela poängen: i dagens
kolumner ser de ut som 26/27 och skulle nästa år visa två års prisutveckling som
ett års höjning. De sju orter som aldrig fått ett pris hämtat får ingen rad
förrän de hämtas. Kolumnerna på `resorts` är orörda och sajten läser dem
oförändrat; att koppla om läsningen är ett eget steg.

Bakgrunden: `lift_pass_week_eur` har aldrig rörts av någon migration.
Migration 013 rättade dagspriserna kraftigt uppåt men lämnade veckopriserna,
så kvoten vecka/dag kollapsade — spannet är 2,19–7,00 och tolv av trettio
ligger under fyra dagar. skiresort.com publicerar bara dagspris, så
veckopriset måste hämtas från ortens egen sida. Beslut av Fabian 2026-08-12.

Definition: vuxen, sexdagarskort, ordinarie pris (ej onlinerabatt).
Referensveckor 2027: v2 (9–16 jan), v9 (27 feb–6 mar, sportlov), v13 (27 mar–3 apr).
Huvudtal = v9. Dynamiska priser fångade 2026-08-12 för startdag 2027-03-01.
Sedan omgång 5 läses dynamiska priser för start lördag 2027-02-27, regeln
från Zermatt (036). SkiStar är läst för båda datumen i omgång 10; se
nedan.

## KLARA — kontrollerade mot ortens egen sida

| slug | valuta | dag | 6 dagar | kvot | säsong | anteckning |
|---|---|---|---|---|---|---|
| solden | EUR | 84,50 | **469,00** | 5,55 | 26/27 | v2/v9/v13 lika. Topp 478,50 gäller 19.12–6.1 och 30.1–26.2 |
| ischgl | EUR | 83 | **385** | 4,64 | 26/27 | VIP-kortet för Ischgl/Samnaun, gäster i Ischgl och Mathon. Ett pris hela säsongen. Silvretta-kortet 451 är större kort (omgång 8) |
| tignes | EUR | 78 | **468** | 6,00 | 26/27 | Tignes–Val d'Isère, samma område som våra 300 km |
| alpe-d-huez | EUR | 68 | **336,50** | 4,95 | 26/27 | 19.12.26–9.4.27 |
| courchevel | EUR | 84,20 | **421** | 5,00 | 26/27 | Les 3 Vallées. Fast pris från 19.12.26; lördagar 67,30 för en dag |
| meribel | EUR | 84,20 | **421** | 5,00 | 26/27 | Les 3 Vallées. Fast pris från 19.12.26; lördagar 67,30 för en dag |
| val-thorens | EUR | 84,20 | **421** | 5,00 | 26/27 | Les 3 Vallées. Fast pris från 19.12.26; lördagar 67,30 för en dag |
| verbier | CHF | 94 | **409** | 4,35 | 26/27 | 4 Vallées, samma som våra 412 km. Verbier–Tzoumaz ensamt: 86/374 |
| geilo | NOK | 690 | **3 174** | 4,60 | 26/27 | nätpris, dynamiskt, start 27.2.2027; produkten heter "6–8 dagar" |
| are | SEK | 759 | **3 744** | 4,93 | 26/27 | SkiStar, lika för start 27.2 och 1.3 (omläst 2026-11-18) |
| salen | SEK | 650 | **3 126** | 4,81 | 26/27 | inkluderar två skiddagar i Trysil. Lika för 27.2 och 1.3 |
| trysil | NOK | 775 | **3 806** | 4,91 | 26/27 | hämtat på SkiStars norska sida, i NOK — se not nedan. Lika för 27.2 och 1.3 |
| hemsedal | NOK | 775 | **3 769** | 4,86 | 26/27 | hämtat på SkiStars norska sida, i NOK. Dagskortet 775 lördag 27.2, 745 måndag 1.3; sexdagarskortet lika (049) |
| myrkdalen | NOK | 660 | **2 620** | 3,97 | gällande 26/27 | bekräftad mot ortens egen prislista 2026-08-25. Kapat pris: 6, 7 och 8 sammanhängande dagar kostar alla 2 620. Valfria dagar kostar 3 050 |
| voss | NOK | 675 | **2 750** | 4,07 | 26/27 | "6-8 dagerskort", sammanhängande, kväll och gondol ingår. Nätpris ur bokningskalendern, 2 750 för varje startdag 8.2–7.3.2027 och dagskortet 675 varje dag (049). 2026-08-25 visade kalendern 2 990 och 675 / 720 |
| riksgransen | SEK | 546 | **2 673** | 4,90 | 26/27 | 5 dagar 2 304 + extra dag 369; ingen egen sexdagarsrad finns. Ett pris hela säsongen (049). **Kortet gäller Björkliden OCH Riksgränsen** — se not nedan |
| zermatt | CHF | 122 | **574** | 4,70 | 26/27 | Internationellt kort Zermatt–Cervinia = våra 322 km. Dynamiskt, start 27.2.2027 (036, bekräftat i omgång 9). Zermatt ensamt: 104/510 |
| st-anton | EUR | — | **450** | — | **25/26** | 26/27 ej publicerat. Lågsäsong 380 |
| kitzbuehel | EUR | 83 | **423** | 5,10 | 26/27 | KitzSki. Premium 20.12.26–13.3.27. Spar 351, Vorteil 387 |
| les-arcs | EUR | 71 | **368** | 5,18 | 26/27 | Classic Pass = Les Arcs/Peisey-Vallandry, 200 km, våra tal. 19.12.26–16.4.27 |
| saas-fee | CHF | 84 | **413** | 4,92 | 26/27 | Saas-Fee-kortet (Saas-Fee + Saas-Almagell). Destination-kortet gäller hela Saastal och är inte detta |
| livigno | EUR | 74,50 | **374,50** | 5,03 | 26/27 | ALTA STAGIONE 30.1–29.3.27, bandet v9 ligger i. Ur tariffe_26-27.pdf. Lagras som 75/375 — heltalskolumn |
| madonna-di-campiglio | EUR | 87 | **435** | 5,00 | 26/27 | SkiArea Campiglio Dolomiti di Brenta, samma område som våra tal. Högsäsong 20.12.26–14.3.27 (030). Söndagsregel: +10 € om kortet innehåller en söndag, kvar 26/27 (omgång 9) |

## SkiStar säljer samma kort i två valutor

Trysil och Hemsedal ligger i Norge men säljs också på SkiStars svenska
sida, i kronor: 3 739 respektive 3 702 SEK. De talen stod här tidigare.
De är utbytta mot de norska, 3 806 och 3 769 NOK, hämtade på
skistar.com/no.

Skälet är regeln i `lib/valuta.js`: beloppet lagras i den valuta orten tar
betalt i, och räknas om vid visning. Lagrar vi SEK för en norsk ort ser
det ut som ett exakt svenskt pris — sidan skriver då ut talet utan "ca"
och utan omräkning, fast det bygger på SkiStars egen växling den dagen.
Skillnaden är liten idag (NOK och SEK står nästan lika mot euron) men den
är godtycklig, och den skulle vandra i tysthet.

Åre och Sälen är svenska och lagras i SEK. Det är också därför de blir de
enda orterna som visar ett exakt kronbelopp utan "ca" — det finns ingen
omräkning att ta höjd för.

## UNDERKÄNDA — priset avser ett annat område än våra tal

**Saalbach.** dag 82 / 6 dagar 440 (topp 19.12.26–12.3.27), men kortet gäller
Skicircus PLUS Schmitten i Zell am See PLUS Kitzsteinhorn och Maiskogel i
Kaprun — Ski ALPIN CARD, 408 km, inte Skicircus 270 km. *Inte längre
underkänd:* ortens prislista 26/27 har inget kort för bara Skicircus, och
beslutet "Priset följer veckokortet" gäller. Se 2026-11-18, omgång 2, nedan.

**Bad Gastein.** 6 dagar 432,50 gäller hela Ski amadé, 760 km. Inget
Gastein-bara-alternativ finns. Dagsbiljetten 81,50 (26/27, kassa) gäller
inte bara Gasteins 82,7 km utan också Dorfgastein-Großarl och Sportgastein.
Här stod tidigare "78,50 avser Gasteins 82,7 km", som var fel i både pris
och område. *Inte längre underkänd,* se 2026-11-18, omgång 2, nedan.

**Mayrhofen.** 399 € är Zillertal Superskipass för hela dalen.

**Sälen** har samma drag: veckokortet inkluderar två skiddagar i Trysil.
Det är alltså inte en österrikisk egenhet utan ett allmänt mönster.

**Riksgränsen — samma mönster, men det finns inget alternativ.** Skidpasset
gäller "Björkliden Fjällby och Riksgränsen", medan våra 21 km och 6 liftar
avser Riksgränsen ensamt. Orten säljer inget
kort som bara gäller den egna sidan — det finns ingen rätt produkt att
välja i stället. Talet står i tabellen med den här reservationen. Frågan är
inte vilket pris som ska hämtas utan om pisttalet borde avse båda
anläggningarna. Kontrollen 2026-09-21: källan har en egen post för
Riksgränsen med exakt våra 21 km och 6 liftar, så talet är rätt enligt
enkällsregeln och det är bara kortet som täcker mer. Till skillnad från
Sälen är det alltså ingen hopslagning — se rättelsen längre ner.

**Grandvalira.** Flerdagarskortet (2 dagar och uppåt) gäller Grandvalira
PLUS Ordino Arcalís PLUS Pal Arinsal — 308 km mot våra 215. Dagsbiljetten
avser Grandvalira ensamt. [Rättat i omgång 10: dagskortet heter Andorra
Pass och gäller också alla tre, enligt GV-pass FAQ.] Priset är dessutom dynamiskt och står bara i
bokningsassistenten, inte som tabell. Andorra visar alltså samma mönster som
Österrike: flerdagarskortet är ett regionkort.

## KASTADE på rimlighetskontroll
Ett sexdagarskort ligger på 4,5–5,5 gånger dagspriset. Utanför 3,5–6 är talet
felavläst.
- Chamonix: 6 dagar 1 400,80 € mot dagspris 47–59,20 = 24 gånger. Våren stod
  dessutom dyrare än toppsäsong. Kastat.
- Zermatt: 1 750–2 070 CHF mot dagspris kring 100 = 14 gånger. Kastat.

## Zermatt löser också Cervinia
Prissidan har två kolumner: ZERMATT och INTERNATIONAL (ZERMATT-CERVINIA).
Det internationella kortet är det som ger våra 322 km. Cervinia säljer
dessutom ett eget italienskt kort som inte står här — det måste hämtas
från italienska sidan om Cervinia ska in som egen ort.

Obs att sidan har två tabeller. Den första är sommar-/glaciäråkning
(6 dagar CHF 386). Den andra är vinter och är den rätta.

## VINTERPRISER INTE PUBLICERADE ÄNNU — kontrollerat 2026-08-12

Sex orter går inte att hämta i augusti, av samma skäl: sajten står i
sommarläge eller släpper inte vinterpriserna förrän säsongen närmar sig.
Det är inte ett fel i deras sidor och går inte att kringgå med en annan
källa — det är för tidigt. Datumet står utsatt där orten uppger ett.

- **ruka** — "lift tickets will be available when the winter season begins
  on October 2nd". Enda orten som anger ett datum. Ta om efter 2 oktober.
- **voss** — publicerar ingen tabell alls, bara en priskalender i
  bokningsmotorn, och 26/27 ligger inte i försäljning än.
- **st-anton** — Ski Arlbergs prissida visar bara `prices-tickets-summer`.
  Bekräftar det som redan stod här: 26/27 är inte publicerat. 25/26-priset
  (450) står kvar i tabellen ovan så länge.
- **mayrhofen** — prisadressen vidarebefordrar till sommarinnehåll. Frågan
  om vilket kort som motsvarar Mountopolis 142 km är alltså obesvarad.
- **chamonix** — bara sommarprodukter uppe (Mont Blanc MultiPass).
  Dessutom kvarstår vilket kort som motsvarar våra 170 km: Le Pass eller
  Mont Blanc Unlimited, som också ger Courmayeur och en dag i Verbier.
- **cortina-d-ampezzo** — publicerar för OS-vintern enbart säsongskortet
  Pre Olimpico (550 €) plus tillägg. Ingen dags- eller flerdagstabell finns
  på sidan; de säljs bara i kassan. Att OS ligger i orten gör dessutom
  säsongen atypisk, så ett tal härifrån vore dåligt jämförelsematerial även
  om det gick att hitta. Valleykortet är rätt produkt när det kommer: sidan
  skriver själv "over 120 kilometres of slopes", vilket är exakt våra 120.

## KVAR — Hemavan och Levi, blockerade av samma skäl som de sex ovan

- **hemavan** — quickbook.hemavan.nu säljer hittills bara säsongspass för
  26/27 ("Övriga liftkort för vintern släpps under juni", men bara
  säsongskortet ligger uppe). Databasens 35 € / 245 € står kvar så länge,
  och det är den enda raden där veckokortet kostar mer än sex dagsbiljetter.
- **levi** — både prissidan och webbshoppen (levi.skiperformance.com) står
  i sommarläge. Prislistan på sidan avser sightseeing och Bike Park, inte
  skidåkning; att läsa "1 day 37,00 €" därifrån vore att hämta ett
  sommarpris till en vinterjämförelse.

## KVAR — orter som ännu inte finns i databasen
Inga. Val Gardena och Cervinia lades in i migration 042, Laax, St. Moritz och
Engelberg i 043.

## METOD som fungerar
- Alporter med publicerad prislista: WebFetch mot ortens prissida.
- Dynamiska (SkiStar, Zermatt, nordiska skiperformance-butiker): webbläsaren
  mot bokningen med datum i adressen, klicka fram passkategorin, läs tabellen.
  SkiStar: /sv/boka-online/skipass/<ort>/?date=2027-03-01 och klicka SkiPass.
- **Prislistor i PDF:** WebFetch kan inte läsa dem — innehållet är komprimerat
  och kommer tillbaka som binärskräp — men filen sparas lokalt, och
  `pdftotext -layout` (ligger i Git for Windows,
  `C:\Program Files\Git\mingw64\bin\`) ger en läsbar tabell. Så löstes både
  KitzSki och Madonna di Campiglio.
- **Prislistor som bilder:** Cortina lägger sina tabeller som JPG. Hämta hem
  bilden och läs den som bild; skärmdump via webbläsaren fungerar inte när
  förhandsgranskningsrutan är dold.

**Läs aldrig av en söksammanfattning.** Sökningen påstod att Saas-Fee kostar
336 CHF för sex dagar; ortens egen sida säger 413. Den påstod också att
Les Arcs sexdagars är 368 — vilket råkade stämma, men det gick inte att veta
utan att öppna sidan. Samma slag som de två priser rimlighetskontrollen
kastade. Sammanfattningar blandar ihop säsonger, kategorier och områden.

**Kolumner i en PDF kan hamna snett.** KitzSki-tabellen extraherades med
dagsraderna förskjutna två steg, så att "3 dagar" stod bredvid 83 €.
Uppställningen avslöjades av att den näst översta raden var exakt dubbla den
översta: fyra dagar kan inte kosta dubbelt så mycket som tre, men två dagar
kan mycket väl kosta dubbelt så mycket som en. Den rätta uppställningen ger
dessutom 83 € för en dag, vilket är exakt vad databasen redan har från
skiresort.com. Två oberoende kontroller på samma tal.

## VALUTA — beslutat 2026-08-12, ersätter tidigare plan

Här stod att CHF, NOK och SEK skulle räknas om till euro med kursen skriven
i migrationen. **Det gäller inte längre.** Beloppet lagras i ortens egen
valuta och räknas om vid visning mot ECB:s dagskurs, se `lib/valuta.js`. En
kurs inskriven i databasen är sann den dagen och åldras sedan tyst — samma
fälla som `lift_pass_week_eur` gick i.

Kolumnen `lift_pass_currency` skapas i migration 016. Regeln som gör den
ofarlig står i den filen och gäller varje rad här: **valutan och beloppet
ändras i samma UPDATE, aldrig var för sig.**

## KONTROLL 2026-08-25 — två veckor senare

Alla fjorton orter utan verifierat 26/27-pris öppnades på nytt. Två löstes,
en bekräftades, två visade sig ha ett annat problem än årstiden, och fyra
gav ett datum för när priset kommer.

**Löst: Livigno och Voss.** Se tabellen ovan. Båda ligger nu i migration 021.

**Bekräftad: Myrkdalen.** Prislistan som ligger länkad från
myrkdalen.no/en/ski-resort/lift-pass i dag ger 660 / 2 620 — exakt det vi
lagrat. Kvoten 3,97 är inte ett fel: sammanhängande 6, 7 och 8 dagar kostar
alla 2 620. Gissningen från 12 augusti är nu belagd med källa.

### Ny distinktion som definitionen saknade

Myrkdalen och Voss säljer båda **sammanhängande** och **valfria** dagar som
skilda produkter. Myrkdalen: sex sammanhängande 2 620, sex valfria 3 050 —
sexton procents skillnad. Vi har råkat lagra den sammanhängande varianten
överallt, vilket är rätt, men definitionen sa inte vilken. Den ska nu läsas:
vuxen, sex **sammanhängande** dagar, huvudsäsong, referensvecka v9 2027.

En prisjämförelsesida måste säga vilken variant den jämför, annars ställer
den två olika produkter mot varandra.

### Blockerade av årstid — nu med datum

- **geilo** — **omkontrollerad 2026-09-08, fortfarande blockerad.**
  Augustinoteringen sade "I salg fra september!", och september kom utan
  att flerdagarskorten släpptes. Prislistan ligger inte på skigeilo.no utan
  i butiken, `geilo.skiperformance.com/no/support/prices`, och där står två
  tabeller under varandra: **Sesongkort 26/27** (vuxen 8 730, earlybird) och
  **Skipass 25/26** med 1 dag 693 och 6–8 dagar 2 871 — exakt de tal vi
  redan bär. Säsongskortet har alltså bytt år medan flerdagarskorten inte
  har det. Ta om vid oktoberrundan.

  Vägen dit, för nästa gång: skigeilo.no/skipass har ingen prislista alls,
  bara länkar vidare. Följ "Kjøp her" till butiken, och därifrån
  "Skipasspriser". Butikens startsida visar bara säsongskort och gåvokort,
  vilket är lätt att läsa som att inget pris finns — men `support/prices`
  listar även produkter som inte är i försäljning just nu.
- **ruka** — oförändrat: "lift tickets will be available when the winter
  season begins on October 2nd". Enda orten som anger exakt datum.
- **st-anton** — Ski Arlberg har byggt om sajten sedan augusti. Vinterns
  prislänk heter nu bokstavligen `prices-tickets-winter-coming-soon`.
  Säsongen uppges 2.12.26–18.4.27. 25/26-priset 450 står kvar.
- **madonna-di-campiglio** — ski.it/it/skipass/listini skriver överst
  "Questa pagina riporta le informazioni dell'inverno 2025/26".
- **cortina-d-ampezzo** — Dolomiti Superskis e-butik säljer enbart
  "Dolomiti Supersummer". Ingen vinterprodukt i försäljning.
- **mayrhofen** — mayrhofner-bergbahnen.com står kvar i sommarläge,
  titeln lyder "Experience Summer".
- **hemavan** — quickbook.hemavan.nu står på säsongen 26/27 men säljer bara
  säsongspass, och sidans egen text säger fortfarande "Övriga liftkort för
  vintern släpps under juni". Missade sin egen utlovade tid.

Sju orter publicerar alltså inom ungefär sex veckor. **En insamling i
början av oktober plockar upp nästan allihop på en gång** och är effektivare
än att jaga dem en och en.

### Inte blockerade av tid utan av område

Två orter löses inte av att vänta, eftersom frågan är vilket kort som
motsvarar orten.

**Chamonix — nytt fynd.** Biljettsidan för CHAMONIX Le Pass anger sina egna
tal: 110 km pist, 2 linbanor, 6 gondoler, 14 stolliftar, 21 släpliftar.
Vår databas har 170 km och 49 liftar. Sidan skriver dessutom rakt ut: "Nos
domaines et sites ne sont pas reliés, exceptés Brévent - Flégère."
Dagspriset står som ett spann, 47,00–59,20 €, mot vårt lagrade 60.

Det löser också gåtan som fick Chamonix kastat på rimlighetskontroll:
1 400,80 € var **årskortet**, inte veckokortet. Kvoten 24 var alltså ett
läsfel, inte ett prisfel.

Frågan som återstår är inte vilket pris som ska hämtas utan vilket kort
orten ska representeras av — Le Pass på 110 km eller Mont Blanc Unlimited,
som också ger Courmayeur och en dag i Verbier. Ingen av dem är 170 km.

**Grandvalira.** Beslut 2026-08-25: talet ändras INTE till 308 km.
skiresort.com listar Grandvalira 215 km och Ordino Arcalís 30 km som skilda
poster, och Pal Arinsal som en tredje. Enkällsregeln väger tyngre än att
kortet råkar täcka alla tre, och "sammankopplat område" betyder
liftförbundet — 93 av de 308 kilometrarna kräver buss. Regeln blir: när
källan slår ihop gör vi det, när den delar gör vi det.

**Rättelse 2026-09-21.** Här stod att källan behandlar Sälen som en post,
och att det var skillnaden mot Grandvalira. Det stämmer inte. Källan har
tre poster i Sälen — Lindvallen/Högfjället 42 km och 58 liftar,
Tandådalen/Hundfjället 45 km och 48 liftar, Näsfjället 10 km — och våra
87 km och 106 liftar är summan av de två första. Näsfjället ingår inte,
eftersom anläggningen inte är SkiStars och ligger utanför liftkortet.

Kontrollen delar därmed de fyra orterna i två sorter, inte tre fall av
samma sak:

- **Sälen och Chamonix är hopslagningar.** Våra tal är summan av flera
  källposter, och delarna hänger inte ihop med lift. Det bärs sedan
  2026-09-21 av `lib/delomraden.js`, som listar delarna på ortsidan och
  räknar fallhöjden inom ett och samma område i stället för över alla.
- **Grandvalira och Riksgränsen är enkelposter.** Källan har en post för
  var och en med exakt våra tal, 215 km och 75 liftar respektive 21 km och
  6 liftar. Deras fråga gäller bara vad liftkortet täcker, och den
  besvaras i prisnoten. Ingen `sub_areas`-kolumn behövs för dem — och
  eftersom de två andra löstes i kod behövs kolumnen inte alls.

### Hittar fortfarande ingenting

- **riksgransen** — ingen prislänk går att hitta i markupen på
  riksgransen.se, och ingen prislista har lokaliserats. 25/26-raden står
  kvar med sin reservation om att kortet gäller Björkliden också.
- **levi** — oförändrat, ingen prislista funnen.

### METOD — lärdom som kostade tid

**Leta efter filen, inte efter navigationen.** Livigno bedömdes som
blockerad efter att både livigno.eu och skipasslivigno.com öppnats och
befunnits stå i sommarläge. Prislistan för 26/27 fanns hela tiden, på
`livigno.eu/hubfs/tariffe_26-27.pdf` — HubSpots filarea, olänkad från
sommarsidorna. Myrkdalens prislista låg likadant på en Sanity-CDN.

En sajt i sommarläge betyder att sajten är i sommarläge. Det betyder inte
att filen saknas. Sök på domänen efter pdf innan orten skrivs som blockerad.

**`pdftotext -layout` räcker inte för prislistor med flera bandkolumner.**
Livignos tabell kom ut med dagsiffrorna i en kolumn och priserna i en annan,
förskjutna ett steg, vilket gav sex dagar för 127 € i stället för 331.
`-table` löser det. Ett tal som ser en faktor för lågt ut är förskjutning,
inte rabatt.

## 2026-11-18 — Levi hämtad, Cortina och Hemavan kvar

- **levi** — levi.fi/en/ski/levi-ski-resort-services/skipasses har nu en
  tabell rubricerad "Ski pass prices on winter season 2026-2027". Kassa
  60 / 269 €, ett pris hela säsongen. Se migration 032.
- **cortina-d-ampezzo** — Dolomiti Superski publicerar bara helkortet i
  pressmeddelandet (453 € för sex dagar i högsäsong). Ortskortet för Cortina
  syns bara i deras datumkonfigurator, som inte går att läsa utan webbläsare.
  En tidning anger 421 € för 15–20 februari 2027; det är inte vår källa.
- **hemavan** — fortfarande bara i bokningen. Freeride.se anger 2 685 kr
  för sex dagar i högsäsong; inte vår källa.
- **geilo** och **riksgransen** — oförändrat 25/26.

## 2026-11-18 — Priset följer veckokortet

Beslut av Fabian: priset följer det kort man faktiskt köper för en vecka,
även när kortet gäller mer än ortens egen pist. Varje ort har två tal: pist
man når med lift (som förut) och vad kortet gäller (`LIFTKORT` i
lib/liftkortspriser.js, bara där de skiljer sig). Pris per kilometer räknas
på kortets kilometer.

- **mayrhofen** — Zillertal Superskipass 399 €, 546 km. Se migration 033.
- **riksgransen** — kortet gäller även Björkliden; km okänt, därför inte per km.
- **chamonix**, **grandvalira**, **cortina-d-ampezzo** — kvar. Priserna är
  dynamiska eller ligger i bokningsflöden och läses via webbläsare.

## 2026-11-18 — De sista fyra, lästa i bokningarna

Alla orter har nu pris. Tre av dem sätter priset efter datum, så talet
gäller en vuxen med start i referensveckan. Se migration 034.

- **chamonix** — Compagnie du Mont-Blanc, prislista hög säsong 26/27.
  Chamonix Le Pass 76,50 / 373 €. Kortet gäller Brévent–Flégère, Grands
  Montets och Balme, 114 km enligt delområdena; Les Houches ingår inte.
- **grandvalira** — assistant.grandvalira.com, 28.2–5.3.2027: 396 € i kassan,
  370,20 € på nätet. Flerdagarskortet gäller även Pal Arinsal och Ordino
  Arcalís, 308 km. Dagspriset lästes inte. [Läst i omgång 10: 72 € i
  kassan, 69 € på nätet, start 27.2.2027.]
- **cortina-d-ampezzo** — Dolomiti Superskis konfigurator, ortskortet
  Cortina d'Ampezzo, 1–6.3.2027: 421 € (400 € på nätet). Dag 84 €. Kortet
  gäller samma område som våra pisttal.
- **hemavan** — quickbook.hemavan.nu, Liftkort 6–8 dagar, start 27.2.2027:
  2 955 kr i kassan (2 807 kr med förbokning). Dag 665 kr. Kortet gäller
  även Tärnaby, 20 km enligt skiresort.com, alltså 52 km.

**Dynamiska priser ska läsas för ett datum, inte för "säsongen".** Hemavans
sexdagarskort kostar 2 690 kr med start före 19 februari och 2 955 kr
därefter. Ange datumet i noten. [Omgång 10: hemavan.nu sätter
högperiodens början till 14 februari, inte 19. Start 27.2 ligger i
högperioden med båda gränserna, så priset står.]

## 2026-11-18 — Större kort och sorterbar tabell

Önskemål av Fabian: liftkortspriser visar ortens kort och, där det finns,
det större kortet på en rad under (`STORRE_KORT` i lib/liftkortspriser.js).
Ortens kort styr ordning och index. Varje rad har dagskort, sex dagar, per
dag, km och kronor per km, och tabellen går att sortera.

- **cortina-d-ampezzo** — Dolomiti Superski 453 €, 1 200 km.
- **chamonix** — Mont-Blanc Unlimited 104 / 499 €, 170 + 41 km (Courmayeur).
- **les-arcs** — Paradiski, Essential Pass 78 / 412 € i högsäsong,
  lesarcs-peiseyvallandry.com. 200 + 225 km.
- **saas-fee** — Destination-kortet för hela Saastal, 428 CHF (fast pris),
  saas-fee.ch. 101 + 26 + 15 + 1 km.
- **madonna-di-campiglio** — Skirama Dolomiti Adamello Brenta finns, men
  priset hittades inte på ortens sida. Kvar.
- **solden** — sexdagarskortet gäller redan hela Ötztal (från tre dagar);
  inget separat större kort.

## 2026-11-18 — Granskning av priser och km

Fyra granskare (priser, design, kod, besökare). Rättat i migration 035 och
lib/liftkortspriser.js:

- **saas-fee** — ortens sida visar nu 86 / 419 CHF för 26/27 (vi bar 84 / 413).
  Kortet gäller Saas-Fee och Saas-Almagell: LIFTKORT 116 km (101 + 15).
- **hemavan** — skiresort.com listar nu Hemavan 30 km och Tärnaby 20 km. Ortens
  km blir 30, kortet 50.
- **Dolomiti Superski** — dagskort 89 € enligt pressmeddelandet. Visas utan
  kronor per km, eftersom de tolv områdena inte hänger ihop.
- **grandvalira** — 308 km står nu med skiresort.com som källa.

Kvar att kontrollera:
- ~~**3 Vallées** — dagspriset 82 € har skiresort.com som källa; alti-mag anger 84,20.~~ Löst i omgång 7: 84,20 på les3vallees.com, se nedan.
- **Mont-Blanc Unlimited** — vad kortet omfattar och Courmayeurs 41 km är inte
  bekräftade från CMB:s egen sida, som inte gick att läsa.
- Större kort att överväga: Kitzbühel (Ski Alpin Card), ~~Ischgl (Silvretta Ski
  Pass)~~ (löst i omgång 8, se nedan), Madonna (Skirama).

## Zermatt för vecka 9 (2026-11-18)
Priskalkylatorn på matterhornparadise.ch, vuxen, start 27 februari 2027:
International (Zermatt–Cervinia) 122 CHF för en dag och 574 CHF för sex dagar;
Zermatt ensamt 104 / 510. Vi bar 104 / 432, som blandade Zermatts dagspris med
det lägsta dynamiska sexdagarspriset. Migration 036. Priset är dynamiskt och
bör läsas igen före pressutskicket.

## 2026-11-18 — Omgång 2: fem österrikiska orter

Hämtade från ortens egen prislista och kontrollerade i granskningen av
omgång 2 samma dag. Se migration 040. Orterna ligger dolda
(`published = false`) tills bild och Booking-söksträng finns.

- **lech-zuers** — samma Ski Arlberg-kort som St. Anton, 85 / 468 € i peak
  season 19.12.26–2.4.27. skiarlberg.at kallar priserna preliminära.
- **saalbach** och **zell-am-see-kaprun** — Ski ALPIN CARD 82 / 440 € i
  huvudsäsong 19.12.26–12.3.27 (saalbach.com, zellamsee-kaprun.com). Något
  kort för bara den egna orten finns inte. LIFTKORT 408 km enligt
  saalbach.com och skiresort.com, som Mayrhofens 546.
- **bad-gastein** — 81,50 / 432,50 € i kassan, huvudsäsong
  19.12.26–26.3.27 (skigastein.com). På nätet dynamiskt och lägre.
  Sexdagarskortet är Ski amadé, 760 km i fem regioner utan lift mellan dem,
  så orten räknas inte per kilometer (LIFTKORT km null, som Riksgränsen).
  Dagskortet gäller Schlossalm–Angertal–Stubnerkogel, Dorfgastein-Großarl
  och Sportgastein.
- **obergurgl** — dag från 69,50 €, sex dagar 469 € i högsäsongen som
  omfattar v9 (27.2–18.4.2027, gurgl.com). Sexdagarskortet är Ötztal
  Superskipass, "valid in all Ötztal ski areas for 3 days or more".
- **solden** — samma Ötztal Superskipass. Får LIFTKORT med km null i samma
  ändring och räknas därför inte längre per kilometer.

Databasens kolumner är heltal (se 022), så 69,50, 81,50 och 432,50 lagras
avrundade i `resorts`. De exakta talen står i `lift_pass_prices`.


## 2026-11-18 — Omgång 3: tre franska orter

Hämtade från ortens egen prislista och kontrollerade i granskningen av
omgång 3 samma dag. Se migration 041. Orterna ligger dolda
(`published = false`) tills bild och Booking-söksträng finns. Alla tre
korten gäller samma område som pisttalen, så ingen står i `LIFTKORT`.

- **la-plagne** — La Plagne-kortet 72 / 370 €, vuxen 13–64, ett pris
  12.12.26–24.4.27 (PDF-prislistan på skipass-laplagne.com). Cirka 15 %
  lägre vissa datum i början och slutet. Paradiski 78 / 412 €, samma som
  för Les Arcs, står som `STORRE_KORT` med 225 + 200 km.
- **les-deux-alpes** — 68 / 333 €, vuxen 19–64, period P3 19.12.26–9.4.27
  (skipass-2alpes.com, tabelldata i sidan). Fasta periodpriser. Sex dagar
  ger två dagar i Alpe d'Huez och en dag i fyra Grande Galaxie-orter.
- **serre-chevalier** — 68 / 345 €, vuxen 12–64, säsong 19.12.26–26.3.27
  (serrechevalier-pass.com/fr/grille-tarifaire). Forskaren kunde bara läsa
  priset hos tredje part; granskaren läste liftbolagets sida med Firecrawl,
  som renderar JavaScript. Början och slutet av säsongen 56 / 283 €.


## 2026-11-18 — Omgång 4: tre italienska orter

Hämtade från ortens egen prislista och kontrollerade i granskningen av
omgång 4 samma dag. Se migration 042. Orterna ligger dolda
(`published = false`) tills bild och Booking-söksträng finns.

- **alta-badia** — Alta Badias eget kort 83 / 421 €, vuxen, högsäsong
  20.12.26–9.1.27 och 31.1–20.3.27 (ortens prislista "ALTA BADIA SKIPASS
  2026 / 2027", länkad från altabadia.org). Fasta nivåer; säsong 75 / 378.
  Att sexdagarspriset är detsamma som Cortinas (421) är en tillfällighet.
  Dolomiti Superski 89 / 453 € står som `STORRE_KORT`, som för Cortina.
- **cervinia** — det internationella kortet Breuil-Cervinia–Valtournenche–
  Zermatt, 88 / 464,50 €, fast pris 24.10.26–2.5.27 (Cervino S.p.A.:s PDF,
  läst med pdftotext av både forskaren och granskaren). Det är samma kort som
  Zermatts 122 / 574 CHF, men köpt i Cervinias kassa till fast pris i euro.
  Sajten visar alltså två priser för samma område, och båda är ortens egen
  prislista. Cervinias eget kort, 64 / 338 €, gäller bara italienska sidan
  och står i noten. Det löser frågan i avsnittet "Zermatt löser också
  Cervinia" ovan. `resorts` lagrar 465 (heltalskolumn).
- **val-gardena** — dalkortet Val Gardena / Seiser Alm, samma 181 km som
  pisttalen. Dagspriset 83 € i högsäsong är läst i Dolomiti Superskis
  kalkylator och hos skiresort. **Sexdagarspriset är OKÄNT:** kalkylatorn
  räknar flerdagarspriset med ett anrop bakom Cloudflare (curl 403,
  Firecrawl omdirigerades), och valgardena.it har ingen prislista.
  `lift_pass_week_eur` är null och orten står i `UTAN_PRIS` med typen
  `kalla`. Ski Club GB:s 25/26-pris (80 / 404 €) är inte ortens egen lista
  och används inte. Läs kalkylatorn i en vanlig webbläsare, start 27
  februari 2027 som Cortina, innan orten publiceras. Dolomiti Superski står
  som `STORRE_KORT`.


## 2026-11-18 — Omgång 5: tre schweiziska orter

Hämtade från ortens egen bokning och kontrollerade i granskningen av
omgång 5 samma dag. Se migration 043. Orterna ligger dolda
(`published = false`) tills bild och Booking-söksträng finns.

Alla tre priserna är dynamiska. **Regeln för dynamiska priser är den från
Zermatt (036): läs för start lördag 27 februari 2027, referensveckans första
dag, sex dagar 27.2–4.3.** Forskarna läste 1 mars för Laax och St. Moritz;
de talen står i noten i `lift_pass_prices` men används inte.

- **laax** — LAAX-kortet, samma område som pisttalen, 90,00 / 440,00 CHF,
  vuxen 18–63 (shop.laax.com, Pricenow-butiken, läst av granskaren i
  webbläsare). Start 1 mars: 86,50 / 442,00. Kvot 4,89.
- **st-moritz** — Upper Engadin, 86,00 / 454,50 CHF, vuxen 18+
  (booking.engadin.ch, "Snow-Deal", läst av både forskaren och granskaren).
  `resorts` lagrar 455. Start 1 mars: 91,50 / 452,00. Flerdagskort finns
  bara för hela Oberengadin, som också gäller Zuoz, fem små backar och
  bussar och tåg i dalen. `LIFTKORT` med km null, eftersom Maloja och
  Muottas Muragl saknar egen post hos skiresort. Torsdagarna i februari och
  mars kostar 55 CHF för en dag, mot 76–106 CHF övriga dagar; skälet är inte
  utrett och påverkar inte sexdagarspriset, som är ett eget tal.
- **engelberg** — kortet för Titlis och Brunni (shop.titlis.ch, "Ski
  tickets for the whole destination (TITLIS/Brunni/Fürenalp)"), 67 / 302
  CHF på nätet, vuxen, läst av granskaren i webbläsare. Forskaren kunde
  inte bläddra till mars och lämnade priset OKÄNT. titlis.ch kallar alla
  listade priser "online prices"; i kassan tillkommer 5 CHF per köp, inte
  per dag. Kvot 4,51. `LIFTKORT` 79 km (Titlis 70 + Brunni 8,5 enligt
  skiresort.com); butikens egna "82 kilometers of slopes" räknar in
  skidrutter. Fürenalp är en utflyktsbana utan pist.

Alla tre bör läsas igen före pressutskick, som Zermatt.


## 2026-11-18 — Omgång 6: tre nordiska orter

Hämtade från ortens egen prislista eller bokning och kontrollerade i
granskningen av omgång 6 samma dag. Se migration 044. Orterna ligger dolda
(`published = false`) tills bild och Booking-söksträng finns. Ingen av dem
är SkiStars, så SkiStar-kalenderns 1 mars gäller inte; regeln från Zermatt
(036) gör det: dynamiska priser läses för start lördag 27 februari 2027.

- **idre-fjall** — Idre Fjäll Skipass, vuxen 16–64, start 27.2.2027:
  671 / 2 827 SEK, och samma pris för sex, sju och åtta dagar. Forskaren
  läste ortens bokning renderad; granskaren fick bara sidans skal med curl,
  och pistat.se visar samma tal. Listpris: på nätet dras 5 %, och 10 % vid
  köp mer än 40 dagar före. Priset ändras med veckan. Kvot 4,21.
  **Rättat 2026-11-25 (migration 054):** 671 / 2 827 var förköpspriset.
  Bokningen visar "671 SEK 745 SEK" och "2 827 SEK 3 142 SEK", där 745 och
  3 142 är de överstrukna ordinarie priserna och 671 = 0,9 × 745. pistat.se
  "utan rabatt" 745 / 3 142. Sajten visar nu 745 / 3 142 SEK, som Kläppen
  och Hemavan med ordinarie pris. Kvot 4,22.
  Idrepasset (Idre Fjäll, Fjätervålen, Idre Himmelfjäll, Grövelfjäll) är ett
  tilläggskort mellan fyra ägare; priset är inte läst, och det står inte i
  `STORRE_KORT`.
- **branas** — branas.se, "Prislista 26/27", vuxen 18–64: 595 / 2 710 SEK,
  läst av både forskaren och granskaren. Ett pris hela säsongen, så
  startdagen spelar ingen roll. Premiärhelgen 11–13 december kostar halva,
  och kampanjpriset 2 440 för 6–8 dagar gällde till 31 oktober 2026 och
  används inte. Kvot 4,55.
- **hafjell** — **OKÄNT.** Alpinco sätter priset per startdag i en
  Citybreak-kalender bakom Cloudflare (curl 403, webbläsaren fastnar på
  säkerhetskontrollen). Läst bara för 27–30 november 2026: 599 NOK.
  skiresorts och Snowtheres 699 NOK har okänt datum och används inte.
  `resorts` lagrar null, null, 'NOK', orten står i `UTAN_PRIS` med typen
  `kalla`, som Val Gardena, och får ingen rad i `lift_pass_prices`. Läs
  alpinco.com/no/hafjell/kjop-dagskort-1-8-dager i en vanlig webbläsare,
  vuxen, start 27.2.2027, 1 och 6 dagar, innan orten publiceras.


## 2026-11-18 — Omgång 7: sju befintliga franska orter

Lästa av forskarna och kontrollerade i granskningen av omgång 7 samma dag.
Se migration 046. Befintliga rader i `lift_pass_prices` uppdateras; inga
nya rader och inga ändringar i `lib/liftkortspriser.js`.

- **courchevel, meribel, val-thorens** — les3vallees.com, "1-Day Adult Solo
  Pass €84.20" och "6-Day Adult Solo Pass €421.00", vuxen 18–74, fast pris
  från 19 december 2026. Dagspriset var 82 ur skiresort.com via 013 och
  blir 84,20 med ortens egen sida som källa (`resorts` lagrar 84, heltal).
  Lördagar säljs dagskortet för 67,30; det är inget ordinarie pris och
  används inte. Sexdagarspriset är oförändrat. Kvot 5,00.
- **alpe-d-huez** — skipass.alpedhuez.com, "Du 19 décembre 2026 au 9 avril
  2027", Adulte 13–64: 68,00 / 336,50. Oförändrat; raden får källadress.
- **tignes** — valdisere.com, kortet Tignes–Val d'Isère, Hiver 12.12.26–
  23.4.27, vuxen 19–64: 78 / 468. Oförändrat; raden får källadress och
  lågsäsongens 67 / 402 i noten.
- **les-arcs** — lesarcs-peiseyvallandry.com, Classic Pass 71 / 368,
  Paradiski 78 / 412. Oförändrat; raden får källadress.
- **chamonix** — Compagnie du Mont-Blanc, Chamonix Le Pass 76,50 / 373,
  Mont-Blanc Unlimited 104 / 499. Oförändrat. Le Pass gäller inte Les
  Houches; ortsidans fråga om fallhöjd sade "områden som liftkortet ger"
  om alla fyra delarna, och de orden är strukna i `lib/vanligaFragor.js`.


## 2026-11-18 — Omgång 8: fem befintliga österrikiska orter

Lästa av forskarna och kontrollerade i granskningen av omgång 8 samma dag.
Se migration 047.

- **ischgl** — veckopriset byts från 451 till 385 €. ischgl.com säljer två
  sexdagarskort med samma dagspris, 83 €. VIP Skipass Ischgl/Samnaun,
  "Valid at 46 facilities in Ischgl/Samnaun", "Only available upon
  presentation of a valid Ischgl/Mathon guest card!", 385 €. Silvretta
  Skipass, "Available for guests without a Ischgl/Mathon guest card!",
  "valid at 75 facilities in Ischgl/Samnaun + Galtür + Kappl + See", 451 €.
  Regeln ovan (veckokortet du faktiskt köper) ger VIP-kortet: den som bor i
  Ischgl eller Mathon, där sajten råder dig att bo, kan inte köpa
  Silvretta-kortet, och VIP-kortet gäller exakt Silvretta Arena, området
  våra 239 km avser. 451 var aldrig fel tal, men fel kort: raden från 022
  hette "Silvretta Arena Ischgl–Samnaun" och bar Silvretta-kortets pris.
  Den byter produktnamn till Silvretta Ski Pass, och VIP-kortet får en egen
  rad, så att nästa års jämförelse avser samma produkt. Silvretta-kortet
  står i `STORRE_KORT` med 370 km (239 + 43 + 45 + 42,5 enligt
  skiresort.com) och utan kronor per km, eftersom Galtür, Kappl och See
  nås med buss. Kvot 385 / 83 = 4,64.
- **mayrhofen** — noten på dagskortsraden sade "köpt på nätet från 08.00".
  Prislistan (2026-27_Prices Winter_EN.pdf, läst med pdftotext) skriver "1
  DAY FROM 08.00 A.M. € 82,00" utan villkor om nätet. Noten rättad.
- **st-anton** (85 / 468, skiarlberg.at, fortfarande "Provisional"),
  **solden** (84,50 / 469, Ötztal Superskipass), **kitzbuehel** (83 / 423,
  KitzSki Premium) — oförändrade.

## 2026-11-18 — Omgång 9: sex befintliga orter i Schweiz och Italien

Lästa av forskarna och kontrollerade i granskningen av omgång 9 samma dag.
Se migration 048. Inga priser ändras.

- **madonna-di-campiglio** — campigliodolomiti.it, "SKIAREA - HIGH SEASON …
  1 day € 87", "HIGH SEASON from 20.12.2026 to 14.03.2027 … 6 € 435"
  (läst av granskaren). Söndagsregeln finns kvar: "For 3, 4, 5, and 6-day
  skipasses including a Sunday, the following surcharge will be added …
  Skiarea Campiglio Dolomiti di Brenta & Skirama: € 10.00 ADULT". 030 kunde
  inte se den. Listpriset 435 står kvar enligt regeln i 019 (ordinarie pris
  för produkten); en vecka med start lördag 27 februari innehåller söndagen
  och kostar 445. Tillägget står i noten i `lib/liftkortspriser.js` och i
  `lift_pass_prices`. Sidan skriver också "The list prices shown represent
  the maximum purchase value", och webbutiken har dynamiskt pris.
  Skirama som större kort är fortfarande inte läst; inthesnows "around
  €67 (roughly €335 for six days)" är ett tredjepartspris och tas inte in.
- **verbier** — verbier4vallees.ch "Prices winter 26-27": 4 Vallées 94 /
  409 CHF, "From december 12th, 2026 to april 18, 2027", Verbier–Tzoumaz
  86 / 374, "-10% discount if you buy at least 10 days before your arrival
  date" (läst av granskaren). Oförändrat; raden får källadress och noten
  i koden säger fast pris och nätrabatt.
- **zermatt** (122 / 574 CHF, dynamiskt, start 27.2.2027), **saas-fee** (86 /
  419 CHF, saas-fee.ch), **livigno** (74,50 / 374,50, ALTA STAGIONE) —
  bekräftade av forskarna, oförändrade. Tabellen KLARA ovan bar fortfarande
  Zermatts gamla 104 / 432 och Madonnas 25/26-pris; raderna är rättade.
- **cortina-d-ampezzo** (84 / 421) — inte omläst. Dolomiti Superskis
  kalkylator räknar flerdagarspriset bakom Cloudflare. skiresort.com anger
  dagskort 80 €, men det är inte ortens lista. Läs om i en vanlig webbläsare
  före pressutskick.

## 2026-11-18 — Omgång 10: elva befintliga orter i Norden och Andorra

Lästa av forskarna och av granskaren och kontrollerade i granskningen av
omgång 10 samma dag. SkiStar, Voss och Grandvalira lästes i webbläsare
(browser-use, egen flik, inget köpt, cookies avvisade), eftersom bokningarna
bara visar priset efter att sidan körts. Se migration 049.

**Startdagen för SkiStar är avgjord.** Tabellen KLARA sade att SkiStar
fångades för 1 mars 2027, och omgång 5 gjorde lördag 27 februari till
regeln. SkiStar är nu läst för båda datumen. Priserna är lika utom
Hemsedals dagskort, som kostar 775 NOK en lördag och 745 en måndag. Regeln
från Zermatt gäller också SkiStar: Hemsedals dagspris blir 775. Det lagrade
priset är SkiStars förköpspris, som i 019. "Online samma dag" kostar ungefär
tio procent mer och används inte.

Akta adressen: produkt-id:t i SkiStars `length`-parameter hör till en ort.
Samma id under en annan orts adress visar Åres pris under fel ortnamn.
Klicka fram SkiPass från ortens egen sida.

- **are** 759 / 3 744 SEK, **salen** 650 / 3 126 SEK, **trysil** 775 /
  3 806 NOK — oförändrade, lika för 27.2 och 1.3.
- **hemsedal** — 745 → **775** / 3 769 NOK. Kvot 4,86.
- **voss** — 2 990 → **2 750** NOK, dag 675. Samma bokningskalender som
  021, som bara visar nätpris; orten skriver "Alltid lågast pris på skikort
  … når du kjøper på nett" och har inget kassapris att välja i stället.
  Kalendern visar 2 750 för varje startdag 8.2–7.3.2027 och 675 för varje
  dag samma period. 720 för helg syns inte längre. Om Voss sänkt priset
  eller om nätpriset ändras med köptid går inte att se. Kvot 4,07.
- **grandvalira** — dag null → **72 €** i kassan (69 på nätet), sex dagar
  396 € i kassan (370,20 på nätet), start 27.2.2027. Kassapriset lagras,
  som 034 gjorde för sexdagarskortet. Nätpriset gäller ett begränsat antal
  kort ("Quedan 69 forfait a este precio"). Dagskortet heter Andorra Pass
  och gäller, som flerdagarskortet, Grandvalira, Pal Arinsal och Ordino
  Arcalís; noten ovan om att dagsbiljetten avser Grandvalira ensamt är fel
  och rättad. Kvot 5,50.
- **riksgransen** — 520 / 2 547 (25/26) → **546 / 2 673 SEK (26/27)**.
  riksgransen.se: 1 dag 546, 5 dagar 2 304, extra dag 369. Ett pris hela
  säsongen. Ny rad i `lift_pass_prices`; 25/26-raden står kvar. Kortet
  gäller fortfarande Björkliden och Riksgränsen. Kvot 4,90.
- **ruka** — 58 / 265 → **59 / 269 €**, ruka.fi samma sida som 030, kassapris.
  Raden för 26/27 uppdateras, eftersom säsong och produkt är desamma.
- **levi** (60 / 269 €) — bekräftat av forskaren, oförändrat.
- **geilo** — butikens tabell heter fortfarande "Skipass 25/26" men visar
  nu 745 för en dag mot 693 i september; flerdagarskortet är 2 871 båda
  gångerna. Vilket datum 745 avser står inte. Talet står kvar som 693 tills
  ägaren beslutar eller 26/27 släpps.
- **hemavan** (665 / 2 955), **hafjell**, **val-gardena** — **OKÄNT** i
  omgång 10. Hemavans och Hafjells bokningar och Dolomiti Superskis
  kalkylator visar Cloudflares säkerhetskontroll eller spärr, och den
  försöker vi inte ta oss förbi. Hemavans pris står kvar. hemavan.nu listar
  högperioden "19 dec – 4 jan & 14 feb – 3 maj" men ännu inga belopp.
  pistat.se och skiresort visar 605 / 2 685, troligen förra årets tal, som
  inte tas in.

## Omkontrollen 2026-11-25, Norge och Finland (migration 055)

- **geilo** — 26/27 finns nu. Butikens prisfunktion
  (`geilo.skiperformance.com`, samma anrop som köpkalendern gör) ger för
  start 27.2.2027 vuxen 690 NOK för en dag och 3 173,50 för 6–8 dagar.
  Orten publicerar inget kassapris eller överstruket pris, så nätpriset
  lagras som för Voss. De närmaste startdagarna (28.11–1.12.2026) kostade
  745 / 3 427, vilket tyder på ett grundpris och ett förköpspris. Det är
  obekräftat; läs om i februari. Kvot 4,60.
- **trysil** och **salen** — noten säger nu att två av veckokortets dagar
  kan användas i den andra orten (skistar.com), inte att två dagar ingår
  utöver.

