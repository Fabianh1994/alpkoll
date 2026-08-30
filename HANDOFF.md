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

## Läget: upptagen igen 30 augusti, på det svenska spåret

Sajten har **ingen trafik** och är mycket svår att få intäkter på.
`NEXT_PUBLIC_BOOKING_AID` är aldrig ifylld, så den har aldrig kunnat tjäna en krona.

Diagnosen från 19 augusti står kvar: modellen brister, inte marknaden. Jämförelsesajt på
ny domän, med data hämtad ur skiresort.com som Google redan rankar, mot SkiStar och
Alpresor, finansierad av affiliate, i en kategori AI-sök äter.

**Slutsatsen den 19 augusti var att det enda försvarbara spåret är det svenska:** uppmätt
restid, nattåget, bil mot flyg från Sverige. Den 30 augusti togs arbetet upp igen, och det
är det spåret som gäller. Massproducerade mallsidor motverkar målet — en språkmodell
citerar inte det den kan räkna ut själv.

Riktningen i praktiken: **inte fler orter, inte fler poäng på tiogradig skala.** Det som
byggs ska vara sådant en svensk faktiskt söker på och som varken skiresort.com eller en
språkmodell kan svara på. Nattågssidan är den första sidan byggd helt på den principen.

## Vad som gjordes 30 augusti

Tre PR:ar, alla mergade och verifierade live.

**Pristabell med säsong per rad (#21).** `lift_pass_prices` finns i Supabase med 23 rader.
Skälet: en `UPDATE` nästa höst hade raderat underlaget för prisökningsartikeln. Fyra av
raderna är säsongen 2025/2026 och inte 2026/2027 — det gick inte att se i de gamla
kolumnerna och hade nästa år visat två års prisutveckling som ett års höjning.

**En fallhöjd i stället för två (#21).** Åre visade 894 m på `/are-eller-alperna` och
939 m på ortsidan, samtidigt. Uppmätt går `vertical_drop_m` isär med `altitude_top −
altitude_base` för **nitton av trettio orter**, åt båda hållen. Fallhöjden räknas nu fram
överallt och ingen kodrad läser kolumnen.

**Nattåget rättat och fått en egen sida (#22, #23).** Alpsidorna påstod att fyra orter nås
"direkt, utan flygplats och utan transfer". Tåget stannar inte i någon av dem, och orten
det faktiskt stannar i — Kitzbühel — saknades i listan. Meningen var bakvänd och låg live.
Datan ligger nu i `lib/nattaget.js` och `/nattaget-till-alperna` är sajtens första sida
byggd på en svensk sökfråga.

## Git

`main` är i fas med `origin/main`. Senast mergat 30 augusti:

| PR | Vad |
|---|---|
| #23 | `/nattaget-till-alperna` — egen sida, femte menypost, inlänk från fem ortsidor |
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

**3. Sportlovssidan — nästa sida att bygga.** Idén: vilken skidort är billigast just ditt
läns sportlovsvecka? Svenskt sportlov ligger v.7, v.8, v.9 eller v.10 beroende på län, och
frågan har inget svar någonstans på internet. Den kräver svensk skolkalender krossad mot
ortens prislista — två datamängder ingen utom en svensk sajt sätter ihop, och som en
språkmodell inte kan räkna ut själv.

Halva underlaget finns redan: v9 är referensvecka i prisdatan, Snälltågets enda
Stockholmsavgång går 26 februari 2027 som är Stockholms sportlov, och den ligger i
`lib/nattaget.js`. Det som saknas är länens sportlovsveckor och pris för fler veckor än v9
— det senare hämtas ändå i oktober.

**4. "Bättre innehåll på hela sidan"** — Fabians ord 30 augusti, ännu inte omsatt. Oklart om
det betyder mer text, vassare text eller fler sidor som svarar på riktiga sökfrågor. Fråga
vad som känns tunt vid klick runt, mät mot det, gissa inte.

**5. Tre orter där frågan är vilket kort som motsvarar orten.** Chamonix Le Pass ger 110 km
mot vårt tal på 170. Grandvaliras flerdagarskort ger 308 mot vårt 215. Sälen är samma sak.
Det är vad en `sub_areas`-kolumn finns för — kräver kod, inte data.

**6. Startsidans filter och sortering** på samma fält som jämförelsesidorna använder.

**7. Fler nordiska orter** — Vemdalen, Idre Fjäll, Branäs, Romme, Kungsberget. Kräver din
research, inte kod.

**8. Vandring**, med datamodellen delad i plats och aktivitet först.

**Kräver dig, inte kod:** fyra hotlänkade ortbilder ska bytas (Voss, Geilo, Myrkdalen,
Grandvalira), redaktionella poäng för nya orter, affiliate-ID. Obekräftat i
integritetspolicyn: att Supabase-projektet ligger i eu-north-1, och att brevlådan
`hello@alpkoll.com` finns.

**Två fynd från 30 augusti som väntar på ditt beslut:**

*Mobilmenyn* är en flikrad med tre ikoner — Skidorter, Jämför, Om oss. Där saknas både
Nattåget och Liftkortspriser, som den här filen kallar sajtens starkaste enskilda sida. En
fjärde flik är ett designval, inte en rättning.

*Bildkrediteringen saknas helt.* `lib/images.js` klassar `upload.wikimedia.org` som
licensierat och låter next/image servera en **kopia** från alpkoll.se. Merparten av Commons
ligger under CC BY-SA, som kräver upphovsman, licens och länk vid vidaredistribution. Det
finns inget `image_credit`-fält och inget kreditblock på någon sida. Gäller alla orter med
Wikimediabild, inte en enskild.

## Praktiskt

**Live-sidorna släpar en timme efter en migration.** Allt har `revalidate = 3600`.
En rättad siffra i Supabase syns inte direkt — sidorna förrenderades vid deployen.
**Mät `Age`-headern innan du felsöker något som ser orättat ut.** En omdeploy tvingar fram det.

**Deploy går inte att köra härifrån i auto-läge.** `npx vercel --prod` blockeras av
auto-lägets klassificerare, vilket är en annan mekanism än behörighetslistan.

**skiresort.info heter skiresort.com sedan sommaren 2026.** Gamla djuplänkar leder till
startsidan i stället för att ge 404, så en hämtning ser ut att lyckas medan den ger fel
sida. Nya mönstret är `skiresort.com/en/ski-resort/<slug>/`, och slugen är translittererad:
Åre heter **`aare`**, Sälen ligger som två poster (`lindvallen-hoegfjaellet-saelen` och
`tandaadalen-hundfjaellet-saelen`). Hitta rätt slug via landslistan,
`/en/ski-resorts/sweden/`, gissa den inte. Underlagssidorna per ort är `/night-skiing/`,
`/innovations/` och `/ski-lifts/`.

**`document.body.innerText` ljuger i webbläsarpanelen.** Den gav tomt för ett element som
låg i DOM:en, var synligt och 153 pixlar högt — två avläsningar i rad sa att en ändring
saknades på sajten fast den fanns. Kontrollera med `fetch` av adressen eller
`element.textContent` innan du tror på ett negativt utfall. En avläsning som säger "det
finns inte" är den som ska misstänkas först.

**Kör inte `next build` medan `next dev` är igång** — de delar `.next`, och dev-servern
började servera gammal utdata efteråt. Bygget hade rätt, dev-servern fel. Läs byggets egen
HTML i `.next/server/app/` när de två säger emot varandra.

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
