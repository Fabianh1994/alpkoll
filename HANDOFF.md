# Handoff — Alpkoll

Skriven 8 september 2026, uppdaterad den 9:e, för att kunna öppna en ny session utan
att läsa om historiken.
Läs den här filen först, sedan `CLAUDE.md`. Allt annat går att härleda ur repot.

---

## Vad projektet är

Svensk jämförelsesajt för skidorter, live på **alpkoll.se**. Next.js 16 på Vercel,
data i Supabase. Trettio publicerade orter av trettioåtta rader: arton i Alperna, elva i
Norden, Grandvalira som undantag. (Räknat 8 september; tidigare handoffar sade tjugo
alporter, vilket aldrig stämde.)

**Åtta är dolda med `published = false`, inte sex som tidigare handoffar sagt.** Sex är
utomeuropeiska och doldes i migration 003 — Aspen, Park City, Jackson Hole, Whistler,
Niseko, Queenstown. **Två är alporter:** Davos och Crans-Montana, dolda i migration 013 med
motiveringen att Schweiz är dyrt och att Zermatt, Verbier och Saas-Fee räcker som schweiziskt
urval. Båda har komplett data — Davos har 320 km pist, näst mest av alla orter i basen — så
den som funderar på att publicera dem behöver inte hämta något, bara ändra flaggan. Det är
ett redaktionellt beslut, inte en lucka.

Målgruppen är låst: **svensken som ska åka till Alperna, plus jämförelse av orterna i
Norden.** Konventionerna för data och språk står i `CLAUDE.md`.

## Läget: trafiken har vänt

**Premissen "ingen trafik" gäller inte längre.** Uppmätt i Search Console 8 september,
med data till och med den 6:e:

| | 11–21 aug | 31 aug–6 sep |
|---|---|---|
| Exponeringar per dag | 20 | 75 |
| Klick | 1 | 6 |

Totalt sedan sajten började synas 11 augusti: **1 071 exponeringar, 7 klick, CTR 0,65 %,
snittposition 19.** Kurvan stiger hela vägen och toppar sista mätdagen på 117 exponeringar.
852 av exponeringarna kommer från Sverige, och alla sju klicken.

**Indexeringen är i praktiken löst.** 34 indexerade sidor blev 52 mellan den 21 och 29
augusti, och "upptäckt – inte indexerad" föll från 85 till 8. Av de 47 som står som icke
indexerade är 34 medvetna noindex — de okuraterade paren. Internlänksarbetet fungerade.

**AI-ytorna växer snabbast av allt:** 52 exponeringar totalt, från 0–1 om dagen i mitten av
augusti till 10 den 6 september. Störst är St. Anton, Hemsedal och Trysil. Search Console
ger ingen klickdata för AI-ytor, så vi vet bara att sidorna visas.

**Flaskhalsen är nu position, inte synlighet.** De stora frågorna ligger på sidan 2:
`sälen priser` 52 exponeringar på position 19, `fallhöjd sälen` 41 på 18,7,
`liftkort hemsedal pris` 29 på 19,3. Där sajten når topp-10 konverterar den bra —
`/salen-eller-alperna` ligger på 1,7 med 33 % CTR, `/jamfor/are-vs-val-thorens` på 5
med 17 %. Modellen fungerar; positionen saknas.

Riktningen är oförändrad: **inte fler orter, inte fler poäng på tiogradig skala.** Det som
byggs ska vara sådant en svensk faktiskt söker på och som varken skiresort.com eller en
språkmodell kan svara på.

**Affiliate-ID:t är medvetet uppskjutet.** Fabians beslut 8 september: trafik först, intäkt
sedan. `NEXT_PUBLIC_BOOKING_AID` är tom, länkarna byggs utan `aid`, och klick ger noll
provision. Det är känt och accepterat — fråga inte om det igen. Att fylla i den tar två
minuter den dagen det finns något att tjäna.

## Vad som gjordes 8 september

Fyra PR:ar och två migrationer, alla mergade, körda och verifierade live.

**Ortsidan svarar på de frågor som ställs (#27).** Prisfrågor gav 151 exponeringar och
fallhöjdsfrågor 59, båda med noll klick. Fallhöjden stod elva gånger på Sälens sida och
inte en gång i titeln eller beskrivningen; dagskortet inte alls. Titeln heter nu
"<ort> — fallhöjd, pist och liftkortspris", rubriken över priserna "Liftkort och priser i
<ort>", och liftkortet ligger i strukturerad data som `Offer`.

**Veckokostnaden borttagen ur hela sajten (#28, migration 024).** `est_weekly_cost_eur`
bar "vad en vecka kostar per person, resa och boende inräknat" för alla trettio orter, och
talet var gissat: samtliga värden delbara med 50, trettio orter på sexton tal, ingen
koppling till liftkortspriset, och fyra orter med en veckokostnad utan känt liftkortspris
alls. Kolumnen sattes aldrig i någon migration. Talet syntes på sex ytor, bland annat i
meta-beskrivningen för 83 jämförelsesidor, och avgjorde dessutom vilken ort som vann en
jämförelse. Hela underlaget står i migration 024.

**Priser på samma villkor överallt (#29).** `harPris` användes bara i `/liftkortspriser`.
Ortsidan och jämförelsesidorna läste priskolumnerna rakt ur databasen och skrev ut tal för
de sju orter prislistan utelämnar — Ruka stod som "släpps 2 oktober" på en sida och
"Veckokort ca 3 150 kr" på en annan. Samma PR bytte texten under priserna: den sade förut
varför vi inte visar resa och boende, och säger nu vilken säsong priset avser, vad kortet
omfattar och ortens egen not.

**Nattågsmotsägelsen rättad (migration 023).** Den låg okörd sedan 31 augusti. Ischgl-sidan
sade i samma kort både att Snälltåget når orten och att man kliver av i Innsbruck och tar
buss. Fyra orter berörda.

**Geilo omkontrollerad (#30).** Ingen ny uppgift — se punkt 1 nedan.

## Git

`main` är i fas med `origin/main`. Mergat 8 september:

| PR | Vad |
|---|---|
| #34 | Sportlovssidan, och copyn där sajten talar om sig själv |
| #33 | Rörelsen respekterar systeminställningen; transition: all borta |
| #30 | Geilo omkontrollerad i september — priset finns inte än |
| #29 | Priser på samma villkor överallt, och ny text under dem |
| #28 | Veckokostnaden borttagen ur sex ytor |
| #27 | Titel, beskrivning, rubrik och strukturerad data efter vad som söks |
| #26, #25 | Nattåget ur datan; nattågstiderna per ort |

Sitemapen ligger på 64 adresser. `OrtEllerAlperna.js` är samma komponent för båda
alpsidorna; ett tillägg är en routfil plus en slug i `HAR_ALPSIDA`. Meningarna härleds
ur datan — ingen text skrivs per ort.

## Vad som gjordes 9 september

**Rörelsen respekterar systeminställningen (#33).** Sajten hade noll regler för
`prefers-reduced-motion` och 88 element med övergångar. Regeln ligger nu i
`app/globals.css` med `!important` — det krävs, eftersom sajten formges med inline
style-objekt och en vanlig CSS-regel förlorar mot inline style oavsett specificitet.
Uppmätt i webbläsaren: en övergång på 0,35 s blir 0,00001 s och en fördröjning på
0,5 s blir 0 s när regeln slår till.

Rörelse som räknas fram i JavaScript ser CSS inte, och den fångas i stället av
`lib/rorelse.js`. Hjältebildens parallax står still, och hjältetexten visas direkt i
stället för att vänta 200 ms på en inglidning som ändå inte syns. Den magnetiska
knappen slutar dras mot muspekaren. Verifierat genom att tillfälligt byta mediefrågan
mot en som alltid är sann: med den på stod parallaxen still vid scroll till 400 px,
med den av flyttade sig hjältebilden −39,75 px vid 500 px scroll.

**`transition-property: all` borttagen (#33).** Fjorton element bevakade varje
egenskap; nu är det noll, mätt i webbläsaren och i den byggda HTML:en. Varje ställe
listar de egenskaper som faktiskt byter värde. Landsknapparna är exemplet på varför
det spelar roll: `all` lät även `font-weight` glida mellan 400 och 600.

**Ortskortens hover går på transform och opacity (#33).** Kortet bytte förut
`box-shadow` och `border-color` i en övergång, och ingen av dem går på grafikkortet.
Lyftet ligger nu på länken, och skuggan och den varma kanten sitter på ett eget lager
som tonas in med `opacity`. Utseendet är oförändrat — samma 3 px lyft, samma
`rgba(212,165,116,0.2)`, samma skugga. På hela startsidan gick `box-shadow` i
övergång från 31 element till 1 och `border-color` från 30 till 1. Priset är 30 nya
element i DOM:en, ett per kort.

**Detta rörde ingen data och ingen migration.** Inget behöver köras i Supabase.

**Sportlovssidan byggd — men inte den som stod i planen (#34).** Punkt 4 utgick från att
sidan skulle svara på vilken ort som är billigast just din sportlovsvecka. Prisdatan säger
att frågan inte har något intressant svar för Alperna: Ischgl tar ett pris hela säsongen,
och Alpe d'Huez, Les Arcs, Livigno och Kitzbühel har prisband som täcker hela sportlovs-
perioden i ett stycke. Sölden är enda undantaget, 478,50 € till och med 26 februari mot
469 € efter. Där veckan avgör priset är det SkiStar-orterna, och deras veckopriser finns
inte i basen förrän i oktober.

`/sportlov` frågar därför besökaren vilken vecka hen har, och svarar med det som faktiskt
skiljer veckorna åt: vilken fredag Snälltåget går, och om säsongens enda Stockholmsavgång
träffar just den veckan. Datumen räknas fram ur veckans måndag, och uträkningen går att
kontrollera — för vecka 9 ger den 26 februari ut och 6 mars hem, exakt den avgång
Snälltåget publicerat. Alla fyra veckor ligger i markup:en; väljaren visar en.

**Kommunregistret byggs medvetet inte klart.** Trettiofem kommuner är lästa på kommunens
egen sida och ligger i `lib/sportlov.js` som orientering. De 255 som återstår hämtas inte,
därför att sidan inte behöver dem — besökaren väljer själv. Metoden och skälen står i
`docs/sportlovsveckor.md`. **Ingen sammanställning duger som genväg:** SkiStar placerar
Luleå i vecka 10 där kommunen säger vecka 9, och Skolportens PDF finns i två marsversioner
där 26 kommuner har olika vecka, därför att tabellen är radförskjuten vid textextraktion.

**Copyn omskriven där sajten talar om sig själv (#34).** Startsidan lovade "vi matchar
berget med skidåkaren" och räknade upp snösäkerhet, terräng, bykänsla, budget och restid —
en beskrivning av reseplaneraren, som är avstängd. Hjälten frågar nu var du ska åka i
vinter och säger att orterna är mätta på samma sätt; missionen skriver ut nackdelarna i
stället för att lova en matchning. Ingressen nämner inga enskilda fält, så den överlever
att sajten byggs ut.

Tre drag städades bort och är värda att känna igen nästa gång: parallella meningar av samma
längd, tankstreck som bär en slutkläm, och formuleringar som förklarar arbetssättet i
stället för att svara. Två utkast underkändes på vägen — det första för att det var torrt,
det andra för att det lät maskinskrivet.

**Restiden hemifrån är mätt (#36).** transfer_minutes är sista biten från flygplatsen
och svarade inte på frågan folk söker på — sälen stockholm gav 20 exponeringar i augusti,
resefrågorna 45 tillsammans. lib/restider.js bär nittio sträckor, trettio orter från
Stockholm, Göteborg och Malmö, alla räknade med OSRM mot OpenStreetMaps vägnät så att de
går att jämföra och räkna om. Talen i transport_info var inte mätta: Sälen stod som fyra
och en halv timme från Stockholm, verkligheten är 5,9 på 397 kilometer.

Det oväntade svaret ligger nu på sportlovssidan: **från Malmö är Kitzbühel närmare än
Åre** (14,2 tim mot 15,5), medan samma jämförelse från Stockholm är 5,9 mot 21,1. Ju
längre söderut man bor, desto mindre kostar Alperna i restid.

Snälltågets två svenska vinterlinjer ligger i samma fil: Åre med nattåg ons, tors, lör och
sön (Stockholm 22.55, Åre 07.35), och Sälen via Mora på lördagar. **Sälenlinjen går via
Göteborg fyra lördagar**, varav 13 februari och 6 mars bär en sportlovsvecka — och Göteborg
har vecka 7. Sidan skriver ut det genom att jämföra skidveckans lördagar mot Snälltågets
datumlista. Tiderna är preliminära tills operatören fastställer tidtabellen i höst.

**Sidfoten bär innehållssidorna (#35).** Jämför, Liftkortspriser, Nattåget och Sportlov låg
bara i menyraden, som döljs under 600 px. Uppmätt vid 390 px syntes ingen av dem någonstans
på sajten — mobilmenyn har tre flikar och sidfoten listade bara Skidorter, Om oss och de
juridiska. Det gällde alltså den trafik sajten faktiskt har: 593 mobilexponeringar mot 472
på desktop.

**Egen 404 på svenska (#37).** Varje adress utom ortsidornas fick Next inbyggda sida på
engelska, utan meny och utan sidfot. Ortsidans 404 hade dessutom en knapp till
reseplaneraren, som är avstängd och noindex — det enda stället på sajten som länkade förbi
PLANERAREN_SYNLIG.

**Kontrasten når WCAG AA (#38, #39).** Sekundärtexten var vit med låg opacitet och nådde
inte kravet: 74 av 147 textelement på startsidan låg under, och sidfoten var värst med
länkar på 0,25 och årtalsraden på 0,15. Golvet är nu 0,46, som håller även mot kortens
ljusare bakgrund. Stegen under lyftes men behöll sin ordning, så hierarkin finns kvar men
är mindre brant. Bara textfärg ändrades — kanter och bakgrunder på 0,02 till 0,08 bär inget
innehåll och står kvar. Uppmätt över tolv sidor: 1 274 element, noll under kravet.

## Vad som väntar

### Checklistan: sexton av tjugo var redan i ordning

Genomgången 9 september av privacy, terms, CTA, FAQ, robots, sitemap, 404, alt-texter,
analytics, meta, social share, favicon, canonical, cookie consent, mobil, tillgänglighet,
formulär, brutna länkar och prestanda.

**Klart och kontrollerat:** robots pekar rätt, sitemapens 65 adresser svarar alla 200,
9 av 9 bilder har alt, alla sidor har titel, beskrivning och canonical, og- och
twitter-taggar finns med bild i 1200×630, favicon i fem format, analytics kör.
**Noll brutna länkar** av 86 interna och 9 externa.

**Cookie consent behövs inte.** Sajten sätter noll cookies och noll localStorage — mätt i
webbläsaren, inte antaget. Vercel Analytics är cookielöst. Skulle något ändras är det den
mätningen som ska göras om först.

**Två punkter kvar, båda små:**

*Sportlovssidan har bara h1 och inga h2.* Blocken är div-rubriker med etikett. Övriga sidor
har rätt struktur.

*Ingen FAQ.* Prisfrågor står för de flesta sökningarna utan att ha strukturerade svar.
Om den byggs: den ska svara på det som faktiskt söks, inte på påhittade frågor.

**Falsklarm värda att känna igen:** snalltaget.se ger 403 på HEAD utan user-agent men 200
på GET — länken är hel. Och sidor med HTML-entiteter (&#xD6;sterrike) hittas inte av en
grep på "österrike".

### Kvar ur genomgången 8 september

Fynden kom ur en genomgång mot tasteskills regeluppsättning — en öppen `SKILL.md` på
github.com/Leonxlnx/taste-skill som vi **inte** installerade och inte tänker installera;
vi plockade bara ut fynden. De två som gällde rörelse är avklarade 9 september.

**Tre fynd ur samma genomgång tas medvetet inte:**

*Hero-rubriken är tre rader* mot regelns max två — 100 px Bebas Neue på desktop, 52 px vid
430 px bredd, tre rader i båda fallen. Regeln kallar det ett typsnittsstorleksfel. Vi kallar
det ett designval.

*Hero-undertexten är 23 ord* mot max 20. För litet att bry sig om.

*Mörkt läge saknas.* Enda `prefers-color-scheme`-regeln på sajten är oanvänd boilerplate
från `create-next-app` (`--background: #0a0a0a`) som designen inte läser. Kräm
`rgb(240,236,228)` mot off-black `rgb(20,18,16)` är ett medvetet enkelt läge. Beslutet finns
men står ingenstans — repot har ingen `DESIGN.md`, så det får plats i `CLAUDE.md` eller i en
egen fil den dagen det finns fler designbeslut att samla.

**Resten av regeluppsättningen klarade sajten redan**, vilket är värt att veta innan någon
öppnar filen igen: inga påhittade namn, siffror eller varumärken, inga div-byggda
skärmdumpar, ingen ren svart på någon synlig yta, inga sektionsnummer eller
versionsetiketter, noll mittprickar på startsidan, nav på en rad och 52 px, trettio kort för
trettio orter utan tom cell, ingen horisontell overflow vid 430 px, ingen `h-screen`, inga
`w-[calc(`. Pristabellens rader har `border-bottom: 1px` med `border-top: 0`, alltså bara
linje under.

Två saker gick inte att avgöra utifrån och är alltså oprövade: kontrollen av `package.json`
före import, och städning i `useEffect`.

---

**1. Prisinsamling i oktober — ta alla sju i ett svep.** Ruka anger 2 oktober och är den
enda orten med ett datum; resten står i sommarläge eller "coming soon" utan besked. Att gå
tillbaka en ort i taget kostar mer än det ger.

Geilo kontrollerades 8 september och var fortfarande blockerad: butiken visar
"Sesongkort 26/27" men flerdagarskorten står kvar under rubriken "Skipass 25/26", med
samma tal vi redan bär. **Prislistan ligger inte på skigeilo.no** utan på
`geilo.skiperformance.com/no/support/prices` — vägen dit står i `docs/liftkortspriser.md`,
liksom skäl och metod per ort. **Riksgränsen och Levi har vi fortfarande inte hittat någon
prislista för.**

**2. Nattågets tidtabell — klar för i år, nästa gång hösten 2027.** Tidtabellen hämtades
30 augusti och beskriver säsongen 18 december 2026–14 mars 2027. Hela höstpunkten är alltså
avklarad; det som återstår av höstarbetet är priserna.

Allt som åldras ligger i `lib/nattaget.js`, med checklistan överst i filen. Sidan skyddar
sig själv: efter `SASONG_SLUT` slutar den visa tidtabellen och säger att nästa säsong inte
är publicerad. Ortsidornas nattågsruta försvinner samtidigt. Det är med flit — en utgången
tidtabell som ser aktuell ut är värre än ingen sida alls.

**3. Prislistesidan svarar på fel fråga.** `/liftkortspriser` har **noll exponeringar på
sex månader**, medan prisfrågor står för 151. Sidan har ingen noindex och ligger i
sitemapen, så det är inget tekniskt fel. Orsaken syns i frågorna: folk söker
`liftkort hemsedal pris` och `vad kostar liftkort i sälen` — ortspecifikt. En generell
tabell förlorar mot ortens egen prissida. Jämför nattågssidan, fem dagar yngre, som har 40
exponeringar på position 10,8 därför att den svarar på en fråga någon skriver.

Ortsidan tog över de ortspecifika frågorna i #29. Vad prislistesidan ska vara i stället är
obesvarat. **Massproducerade `/liftkortspriser/<ort>` är fel väg** — det är precis de
mallsidor som motverkar målet.

**4. Sportlovssidan är byggd — det som återstår är priserna.** `/sportlov` svarar på
veckan och nattåget. Prisdelen väntar på oktoberinsamlingen, och den ska då riktas mot
SkiStar-orternas veckopriser: Åre, Sälen, Hemsedal och Trysil sätter priset efter
startdatum, och basen bär bara veckan som börjar 1 mars. Fler alporter tillför ingenting
här, eftersom deras pris inte ändras med veckan.

**5. Tre orter där frågan är vilket kort som motsvarar orten.** Chamonix Le Pass ger 110 km
mot vårt tal på 170. Grandvaliras flerdagarskort ger 308 mot vårt 215. Sälen är samma sak.
Det är vad en `sub_areas`-kolumn finns för — kräver kod, inte data.

**6. Startsidans filter och sortering** på samma fält som jämförelsesidorna använder.

**7. Fler nordiska orter** — Vemdalen, Idre Fjäll, Branäs, Romme, Kungsberget. Kräver din
research, inte kod.

**8. Vandring**, med datamodellen delad i plats och aktivitet först.

### Väntar på ditt beslut

**Bilderna.** Två skilda problem, båda mätta 8 september.

*Fyra bilder ligger på andra företags servrar* — Voss hos content.igluski.com, Geilo hos
snowfinders.co.uk, Myrkdalen hos skiresort.info, Grandvalira hos squarespace-cdn.com. Alla
fyra svarar och visas i dag. Problemet är att vi saknar rätt att använda dem och att de
företagen betalar bandbredden. `lib/images.js` vägrar optimera dem, så Alpkoll serverar
aldrig en kopia — det är en dämpning, inte en lösning.

*Krediteringen saknas.* 26 av 30 orter använder Wikimedia. Licensfördelningen: 14 CC BY-SA,
5 CC BY, 1 GFDL — alltså **20 som kräver att fotografen namnges** — mot 4 Public domain,
1 CC0 och 1 "Copyrighted free use" som inte gör det.

Att i stället byta till kreditfria bilder låter billigare än det är: Commons-sökningar för
de fyra hotlänkade gav bara en användbar Public domain-bild (Geilo, från
Nasjonalbiblioteket), och **Myrkdalen finns inte på Commons alls**. Rekommendationen är att
bygga krediteringen — ett fält plus ett block, en gång — och därmed få tillgång till hela
Commons i stället för en bråkdel. **Verbiers bild ligger på GFDL och bör bytas oavsett**,
eftersom licensen kräver att hela licenstexten följer med.

**Mobilmenyn** är en flikrad med tre ikoner — Skidorter, Jämför, Om oss. Där saknas både
Nattåget och Liftkortspriser. En fjärde flik är ett designval, inte en rättning.

**Kräver dig, inte kod:** redaktionella poäng för nya orter, affiliate-ID när trafiken
bär. Obekräftat i integritetspolicyn: att Supabase-projektet ligger i eu-north-1, och att
brevlådan `hello@alpkoll.com` finns.

## Praktiskt

**Live-sidorna släpar en timme efter en migration.** Allt har `revalidate = 3600`.
En rättad siffra i Supabase syns inte direkt — sidorna förrenderades vid deployen.
**Mät `Age`-headern innan du felsöker något som ser orättat ut.** En merge tvingar fram en
omdeploy och därmed omrendering, så kör hellre SQL:en först och mergar sedan.

**Deploy går inte att köra härifrån i auto-läge.** `npx vercel --prod` blockeras av
auto-lägets klassificerare, vilket är en annan mekanism än behörighetslistan.

**Migrationer:** 24 filer i `supabase/migrations/`, alla körda och verifierade till och med
**024**. Fabian kör dem själv i Supabase SQL Editor; sessionen har bara anon-nyckeln — men
den räcker för att läsa hela `resorts` och `lift_pass_prices`, vilket är hur granskningarna
görs.

**En migration i repot är inte en körd migration.** 023 låg okörd i åtta dagar medan koden
som förutsatte den var live, och Ischgl-sidan sade emot sig själv under tiden. Git bevarar
inte tidsstämplar, så filens datum i Utforskaren säger när den hämtades till disken, inte
när den skrevs — kontrollera mot databasen i stället.

**Priserna har en egen tabell sedan 022.** `lift_pass_prices` bär ort, säsong, valuta,
produkt och källa per pris, med 23 rader. Fyra av dem är säsongen 2025/2026 —
geilo, riksgransen, st-anton, madonna-di-campiglio — därför att orten inte publicerat nästa
säsong. Prisökningsartikeln måste hoppa över dem eller märka ut dem. Kolumnerna på
`resorts` är kvar och är fortfarande det sidorna läser.

**Ett pris visas bara där `harPris` säger ja.** Spärren gäller sedan 8 september både
ortsidan, jämförelsesidorna, väljaren, taggarna och den strukturerade datan. Lägger du en
ny prisyta: använd den, annars uppstår samma delrättning igen. På jämförelsesidorna måste
även `varde` spärras, inte bara `visa` — det fältet avgör vilken ort som markeras som
billigast.

**Säsongen ska stå intill priset.** Fyra orter bär 25/26-tal, och utan årtalet läses de som
årets. `DEFINITION` är delad i `OMFATTNING` och `REFERENSVECKA` eftersom referensveckan
ligger i februari 2027 och bara gäller 26/27-priser.

**Efterkontrollen som fångar ohämtade rader:** leta efter orter där hela pisttrippeln är
delbar med fem — signaturen på det gissade underlaget. Den flaggar Chamonix och Hemavan
(medvetet orörda) plus två falsklarm, Saas-Fee och Tignes. Samma teknik avslöjade
`est_weekly_cost_eur`: trettio av trettio värden delbara med femtio.

**`lift_pass_day_eur` och `lift_pass_week_eur` är heltalskolumner.** Två decimalvärden i
migration 019 avrundades tyst vid körning. Räkna inte med decimaler i de fälten.

**Åre och Sälen prissätts i kronor och visas exakta**, utan avrundning och utan "ca".
Övriga orter är omräknade från sin egen valuta och avrundas till närmaste femtio.

**Indexering följer internlänkvolym, inte sitemap-närvaro.** Uppmätt 25 augusti: 62 % av de
parsidor som är länkade från `/jamfor` var genomsökta, mot 21 % av de olänkade. Effekten
syns i utfallet: 52 indexerade sidor två veckor senare.

**Beskrivningen väger inte på position.** Den avgör bara om någon som redan ser sidan
klickar. Titel och innehåll väger på position. Blanda inte ihop dem när något ska "ranka
bättre".

**Läs Coverage-exporten före drilldownen i Search Console.** Drilldownen visar bara den
värsta hinken; att läsa den som hela sajten ger slutsatsen att Google aldrig hämtat något,
vilket är fel.

**skiresort.info heter skiresort.com sedan sommaren 2026.** Gamla djuplänkar leder till
startsidan i stället för att ge 404, så en hämtning ser ut att lyckas medan den ger fel
sida. Nya mönstret är `skiresort.com/en/ski-resort/<slug>/`, och slugen är translittererad:
Åre heter **`aare`**, Sälen ligger som två poster (`lindvallen-hoegfjaellet-saelen` och
`tandaadalen-hundfjaellet-saelen`). Hitta rätt slug via landslistan,
`/en/ski-resorts/sweden/`, gissa den inte. Underlagssidorna per ort är `/night-skiing/`,
`/innovations/` och `/ski-lifts/`.

**En dold webbläsarpanel ljuger om allt.** Ligger panelen dold rapporterar sidan
`innerWidth` och `innerHeight` som 0, `document.hidden` som true, mediefrågor som
`(min-width: 1px)` som falska, och `setTimeout` stryps så att tillstånd som sätts
efter en fördröjning aldrig hinner fram. Skärmdumpen kommer tillbaka helvit fast
sidan har innehåll. Mät `innerWidth` först — är den 0 är varje annan avläsning i
samma vända värdelös.

**`window.scrollTo` avfyrar inga scroll-event i panelen.** Positionen ändras, så
`window.scrollY` ser rätt ut, men lyssnarna vaknar inte och allt som hänger på dem
står still. Uppmätt 9 september: noll event efter två `scrollTo`. Använd
webbläsarverktygets egen `scroll` i stället — den ger riktiga händelser, och med den
flyttade sig hjältebildens parallax som den skulle.

**Dev-servern kompilerar inte alltid om CSS som ändrats utanför editorn.** En regel
skriven till `globals.css` med ett skalkommando saknades i den serverade CSS-filen
tills filen rördes en gång till. Slutsatsen "regeln finns inte" var falsk — den låg
på disk hela tiden. Kontrollera mot filen innan du felsöker koden.

**`document.body.innerText` ljuger i webbläsarpanelen.** Den gav tomt för ett element som
låg i DOM:en, var synligt och 153 pixlar högt. Kontrollera med `fetch` av adressen eller
`element.textContent` innan du tror på ett negativt utfall. En avläsning som säger "det
finns inte" är den som ska misstänkas först — samma sak gäller skalkommandon: en
kontrollslinga rapporterade 8 september att sju ortsidor fortfarande visade priser, och
felet låg i testet, inte på sidorna.

**Kör inte `next build` medan `next dev` är igång** — de delar `.next`, och dev-servern
började servera gammal utdata efteråt. Bygget hade rätt, dev-servern fel. Läs byggets egen
HTML i `.next/server/app/` när de två säger emot varandra.
