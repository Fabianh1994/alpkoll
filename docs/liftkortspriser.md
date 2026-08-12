# Liftkortspriser från ortens egen sida

**Arbetsdokument, påbörjat 2026-08-12.** Tjugo av de trettio publicerade
orterna är hämtade och kontrollerade. Av de tio som återstår är sex
blockerade av att orten inte publicerat vinterpriser ännu, en är underkänd
på område, och fyra nordiska ligger i bokningsmotorer som inte kontrollerats
än. Ingenting härifrån har gått in i databasen — det blir en egen migration.

**Migrationen måste bevara de gamla priserna.** Fabian vill publicera en
årlig nyhetsartikel om hur mycket varje ort höjde liftkortspriset mot året
innan. En `UPDATE` som byter värdet utan att skriva ut det gamla raderar
underlaget för den artikeln. Antingen en pristabell med säsong per rad,
eller minst att varje prismigration skriver föregående värde i klartext så
att serien går att läsa ur `supabase/migrations/`. Jämförelsen ska göras i
ortens egen valuta — en kursrörelse är inte en prishöjning — och måste avse
samma produkt båda åren, annars visar de underkända orterna nedan en
femtioprocentig "höjning" som bara är ett annat område.

Bakgrunden: `lift_pass_week_eur` har aldrig rörts av någon migration.
Migration 013 rättade dagspriserna kraftigt uppåt men lämnade veckopriserna,
så kvoten vecka/dag kollapsade — spannet är 2,19–7,00 och tolv av trettio
ligger under fyra dagar. skiresort.com publicerar bara dagspris, så
veckopriset måste hämtas från ortens egen sida. Beslut av Fabian 2026-08-12.

Definition: vuxen, sexdagarskort, ordinarie pris (ej onlinerabatt).
Referensveckor 2027: v2 (9–16 jan), v9 (27 feb–6 mar, sportlov), v13 (27 mar–3 apr).
Huvudtal = v9. Dynamiska priser fångade 2026-08-12 för startdag 2027-03-01.

## KLARA — kontrollerade mot ortens egen sida

| slug | valuta | dag | 6 dagar | kvot | säsong | anteckning |
|---|---|---|---|---|---|---|
| solden | EUR | 84,50 | **469,00** | 5,55 | 26/27 | v2/v9/v13 lika. Topp 478,50 gäller 19.12–6.1 och 30.1–26.2 |
| ischgl | EUR | 83 | **451** | 5,43 | 26/27 | ett pris hela säsongen |
| tignes | EUR | 78 | **468** | 6,00 | 26/27 | Tignes–Val d'Isère, samma område som våra 300 km |
| alpe-d-huez | EUR | 68 | **336,50** | 4,95 | 26/27 | 19.12.26–9.4.27 |
| courchevel | EUR | ~82 | **421** | 5,13 | 26/27 | Les 3 Vallées |
| meribel | EUR | ~82 | **421** | 5,13 | 26/27 | Les 3 Vallées |
| val-thorens | EUR | ~82 | **421** | 5,13 | 26/27 | Les 3 Vallées |
| verbier | CHF | 94 | **409** | 4,35 | 26/27 | 4 Vallées, samma som våra 412 km. Verbier–Tzoumaz ensamt: 86/374 |
| geilo | NOK | 693 | **2 871** | 4,14 | 25/26 | produkten heter "6–8 dagar" |
| are | SEK | — | **3 744** | — | 26/27 | SkiStar, fångat 2026-08-12 för 1 mars 2027 |
| salen | SEK | — | **3 126** | — | 26/27 | inkluderar två skiddagar i Trysil |
| trysil | SEK | — | **3 739** | — | 26/27 | |
| hemsedal | SEK | — | **3 702** | — | 26/27 | |
| zermatt | CHF | 104 | **432** | 4,15 | 26/27 | Internationellt kort Zermatt–Cervinia = våra 322 km. Zermatt ensamt: 89/384 |
| st-anton | EUR | — | **450** | — | **25/26** | 26/27 ej publicerat. Lågsäsong 380 |
| kitzbuehel | EUR | 83 | **423** | 5,10 | 26/27 | KitzSki. Premium 20.12.26–13.3.27. Spar 351, Vorteil 387 |
| les-arcs | EUR | 71 | **368** | 5,18 | 26/27 | Classic Pass = Les Arcs/Peisey-Vallandry, 200 km, våra tal. 19.12.26–16.4.27 |
| saas-fee | CHF | 84 | **413** | 4,92 | 26/27 | Saas-Fee-kortet (Saas-Fee + Saas-Almagell). Destination-kortet gäller hela Saastal och är inte detta |
| livigno | EUR | 72 | **362** | 5,03 | **25/26** | högsäsong 31.1–27.3. Dagspriset matchar databasens 72 exakt |
| madonna-di-campiglio | EUR | 85 | **424** | 4,99 | **25/26** | SkiArea Campiglio Dolomiti di Brenta, samma namn som vårt `ski_area`. Söndagsregel: +10 € om kortet innehåller en söndag |

## UNDERKÄNDA — priset avser ett annat område än våra tal

**Saalbach.** dag 82 / 6 dagar 440 (topp 19.12.26–12.3.27), men kortet gäller
Skicircus PLUS Schmitten i Zell am See PLUS Kitzsteinhorn och Maiskogel i
Kaprun — Ski ALPIN CARD, 408 km, inte Skicircus 270 km.

**Bad Gastein.** 6 dagar 432,50 gäller hela Ski amadé, 760 km. Inget
Gastein-bara-alternativ finns. Dagsbiljetten 78,50 avser Gasteins 82,7 km.

**Mayrhofen.** 399 € är Zillertal Superskipass för hela dalen.

**Sälen** har samma drag: veckokortet inkluderar två skiddagar i Trysil.
Det är alltså inte en österrikisk egenhet utan ett allmänt mönster.

**Grandvalira.** Flerdagarskortet (2 dagar och uppåt) gäller Grandvalira
PLUS Ordino Arcalís PLUS Pal Arinsal — 308 km mot våra 215. Dagsbiljetten
avser Grandvalira ensamt. Priset är dessutom dynamiskt och står bara i
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

## KVAR att hämta — nordiska bokningsmotorer
levi, myrkdalen, hemavan, riksgransen

Alla fyra prissätter dynamiskt och kräver webbläsaren mot bokningen med
datum, som Åre och Sälen. Hemavans bokning ligger på quickbook.hemavan.nu.

## KVAR — orter som ännu inte finns i databasen
val-gardena, saalbach, bad-gastein, cervinia

Saalbach och Bad Gastein är redan underkända ovan på område. För dem måste
frågan om vilket kort som motsvarar pisttalen lösas innan orten läggs in.

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
