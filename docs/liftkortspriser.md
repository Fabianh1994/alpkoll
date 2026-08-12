# Liftkortspriser från ortens egen sida

**Arbetsdokument, påbörjat 2026-08-12.** Sexton orter är hämtade och
kontrollerade, sjutton återstår. Ingenting härifrån har gått in i databasen
än — det blir en egen migration när fler orter är klara.

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
| kitzbuehel | EUR | 83 | ? | — | 26/27 | Premium 20.12–13.3. Sexdagars ligger i PDF |

## UNDERKÄNDA — priset avser ett annat område än våra tal

**Saalbach.** dag 82 / 6 dagar 440 (topp 19.12.26–12.3.27), men kortet gäller
Skicircus PLUS Schmitten i Zell am See PLUS Kitzsteinhorn och Maiskogel i
Kaprun — Ski ALPIN CARD, 408 km, inte Skicircus 270 km.

**Bad Gastein.** 6 dagar 432,50 gäller hela Ski amadé, 760 km. Inget
Gastein-bara-alternativ finns. Dagsbiljetten 78,50 avser Gasteins 82,7 km.

**Mayrhofen.** 399 € är Zillertal Superskipass för hela dalen.

**Sälen** har samma drag: veckokortet inkluderar två skiddagar i Trysil.
Det är alltså inte en österrikisk egenhet utan ett allmänt mönster.

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

## KVAR
chamonix (om), les-arcs, livigno, cortina-d-ampezzo,
madonna-di-campiglio, grandvalira, saas-fee, val-gardena (ny),
mayrhofen (eget område), kitzbuehel (sexdagars ur PDF),
st-anton (26/27), voss, myrkdalen, levi, ruka, riksgransen, hemavan,
saalbach (ny), bad-gastein (ny)

## METOD som fungerar
- Alporter med publicerad prislista: WebFetch mot ortens prissida.
- Dynamiska (SkiStar, Zermatt, nordiska skiperformance-butiker): webbläsaren
  mot bokningen med datum i adressen, klicka fram passkategorin, läs tabellen.
  SkiStar: /sv/boka-online/skipass/<ort>/?date=2027-03-01 och klicka SkiPass.

## VALUTA — kvar att göra
CHF, NOK och SEK måste räknas om till euro. Kurs och datum ska stå i
migrationen. Kursen ska hämtas, inte gissas.
