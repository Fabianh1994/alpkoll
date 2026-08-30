# Handoff — Alpkoll

Skriven 30 augusti 2026 för att kunna öppna en ny session utan att läsa om historiken.
Läs den här filen först, sedan `CLAUDE.md`. Allt annat går att härleda ur repot.

---

## Vad projektet är

Svensk jämförelsesajt för skidorter, live på **alpkoll.se**. Next.js 16 på Vercel,
data i Supabase. Trettio publicerade orter: tjugo i Alperna, elva i Norden, Grandvalira
som undantag. Sex utomeuropeiska är dolda med `published = false`.

Målgruppen är låst: **svensken som ska åka till Alperna, plus jämförelse av orterna i
Norden.** Konventionerna för data och språk står i `CLAUDE.md`.

## Läget: parkerat sedan 19 augusti

Sajten har **ingen trafik** och är mycket svår att få intäkter på.
`NEXT_PUBLIC_BOOKING_AID` är aldrig ifylld, så den har aldrig kunnat tjäna en krona.

Diagnosen är att modellen brister, inte marknaden: jämförelsesajt på ny domän, med data
hämtad ur skiresort.com som Google redan rankar, mot SkiStar och Alpresor, finansierad av
affiliate, i en kategori AI-sök äter.

**Om den någon gång tas upp igen är det enda försvarbara spåret det svenska:** uppmätt
restid, nattåget, bil mot flyg från Sverige. Massproducerade mallsidor motverkar målet —
en språkmodell citerar inte det den kan räkna ut själv.

## Git

`main` är i fas med `origin/main`. Senast mergat 30 augusti:

| PR | Vad |
|---|---|
| #22 | Nattågspåståendet rättat — tåget stannar inte i de fyra orter sidan namngav |
| #21 | Pristabell med säsong per rad, och en fallhöjd i stället för två |
| #19 | Sälen mot Alperna, plus två rättade fel på Åre-sidan |
| #18 | `/are-eller-alperna` — sidan som svarar på frågan svensken faktiskt ställer |
| #17 | `/liftkortspriser` — prislistan över sex skiddagar |

Sitemapen ligger på 64 adresser. `OrtEllerAlperna.js` är samma komponent för båda
alpsidorna; ett tillägg är en routfil plus en slug i `HAR_ALPSIDA`. Meningarna härleds
ur datan — ingen text skrivs per ort.

## Vad som väntar

**1. Prisinsamling i oktober.** Sju orter var årstidsblockerade i augusti. Geilo släpper i
september, Ruka den 2 oktober, St. Anton har en sida som heter
`prices-tickets-winter-coming-soon`. Då går prislistan från 23 till nästan 30 rader, mitt i
bokningssäsongen. Skäl, datum och metod per ort står i `docs/liftkortspriser.md`.
**Riksgränsen och Levi har vi fortfarande inte hittat någon prislista för.**

Gör nattågstidtabellen i samma svep — se punkt 2.

**2. Nattågets tidtabell, varje höst.** Hela `/nattaget-till-alperna` beskriver
säsongen 2026/27 och går ut med den 14 mars 2027. Snälltåget publicerar nästa
vinters tider under hösten, ungefär när skidorterna släpper sina liftkortspriser.

Allt som åldras ligger i `lib/nattaget.js`, och checklistan för vad som ska bytas
står överst i filen. Ingen SQL, ingen migration — en fil, en PR.

Sidan skyddar sig själv under tiden: efter `SASONG_SLUT` slutar den visa
tidtabellen och säger att nästa säsong inte är publicerad. Ortsidornas
nattågsruta försvinner samtidigt. Det är med flit — en utgången tidtabell som ser
aktuell ut är värre än ingen sida alls, vilket är samma fel `lift_pass_week_eur`
led av i två år.

**3. Tre orter där frågan är vilket kort som motsvarar orten.** Chamonix Le Pass ger 110 km
mot vårt tal på 170. Grandvaliras flerdagarskort ger 308 mot vårt 215. Sälen är samma sak.
Det är vad en `sub_areas`-kolumn finns för — kräver kod, inte data.

**4. Startsidans filter och sortering** på samma fält som jämförelsesidorna använder.

**5. Fler nordiska orter** — Vemdalen, Idre Fjäll, Branäs, Romme, Kungsberget. Kräver din
research, inte kod.

**6. Vandring**, med datamodellen delad i plats och aktivitet först.

**Kräver dig, inte kod:** fyra hotlänkade ortbilder ska bytas (Voss, Geilo, Myrkdalen,
Grandvalira), redaktionella poäng för nya orter, affiliate-ID. Obekräftat i
integritetspolicyn: att Supabase-projektet ligger i eu-north-1, och att brevlådan
`hello@alpkoll.com` finns.

## Praktiskt

**Live-sidorna släpar en timme efter en migration.** Allt har `revalidate = 3600`.
En rättad siffra i Supabase syns inte direkt — sidorna förrenderades vid deployen.
**Mät `Age`-headern innan du felsöker något som ser orättat ut.** En omdeploy tvingar fram det.

**Deploy går inte att köra härifrån i auto-läge.** `npx vercel --prod` blockeras av
auto-lägets klassificerare, vilket är en annan mekanism än behörighetslistan.

**Migrationer:** 22 filer i `supabase/migrations/`, alla körda och verifierade till och med
022. Fabian kör dem själv i Supabase SQL Editor; sessionen har bara anon-nyckeln — men den
räcker för att läsa hela `resorts` och `lift_pass_prices`, vilket är hur granskningarna görs.

**Priserna har en egen tabell sedan 022.** `lift_pass_prices` bär ort, säsong, valuta,
produkt och källa per pris, med 23 rader. Fyra av dem är säsongen 2025/2026 och inte
2026/2027 — geilo, riksgransen, st-anton, madonna-di-campiglio — därför att orten inte
publicerat nästa säsong när priset hämtades. Prisökningsartikeln måste hoppa över dem
eller märka ut dem. Kolumnerna på `resorts` är kvar och är fortfarande det sidorna läser.

**Efterkontrollen som fångar ohämtade rader:** leta efter orter där hela pisttrippeln är
delbar med fem — det var signaturen på det gissade underlaget. Den flaggar Chamonix och
Hemavan (medvetet orörda) plus två falsklarm, Saas-Fee och Tignes, där källans verkliga tal
råkar vara jämna femmor.

**`lift_pass_day_eur` och `lift_pass_week_eur` är heltalskolumner.** Två decimalvärden i
migration 019 avrundades tyst vid körning. Räkna inte med decimaler i de fälten.

**Åre och Sälen prissätts i kronor och visas exakta**, utan avrundning och utan "ca".
Övriga orter är omräknade från sin egen valuta och avrundas till närmaste femtio.

**`est_weekly_cost_eur` är euro för alla orter**, till skillnad från liftkortet som bär
`lift_pass_currency`. Konstanten `VALUTA_VECKOKOSTNAD` i `lib/pris.js` håller isär dem.
Blandas de renderas 1 600 € som "1 600 kr" på fyra ytor samtidigt.

**Indexering följer internlänkvolym, inte sitemap-närvaro.** Uppmätt 25 augusti: 62 % av de
parsidor som är länkade från `/jamfor` var genomsökta, mot 21 % av de olänkade. Ska fler
sidor in i indexet: ge dem internlänkar, lägg dem inte bara i sitemapen.

**Läs Coverage-exporten före drilldownen i Search Console.** Drilldownen visar bara den
värsta hinken; att läsa den som hela sajten ger slutsatsen att Google aldrig hämtat något,
vilket är fel.
