# Handoff — Alpkoll

Skriven 8 september 2026, uppdaterad den 9:e, 11:e, 13:e och 15:e, för att kunna öppna en ny session utan
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

**Målgruppen, omprövad 13 september:** svensken som ska bestämma var vinterns skidvecka blir,
i Sverige, i Norden eller i Alperna, och som inte har bestämt sig än. Oftast en familj eller ett
kompisgäng. Valet avgörs av priset i kronor, restiden hemifrån, lovveckan och om orten passar
sällskapet. Den förra formuleringen satte Alperna först och Norden som jämförelse, men trafiken
säger annat: sökningarna gäller Sälen, Hemsedal och Trysil, och sidan som rankar bäst är
"Sälen eller Alperna?". Fabians eget svar var "svensken som ska välja resa i Sverige, Norden
eller mellan olika alpbyar".

Den andra gruppen har redan valt Alperna och jämför byar, och den får jämförelsesidorna.
**Pistkartor och bokning ska byggas senare**, enligt Fabian 13 september. Konventionerna för
data och språk står i `CLAUDE.md`.

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

Riktningen: **inte fler poäng på tiogradig skala.** Fler svenska orter ska in, men de är inte
högsta prioritet (Fabian 13 september, efter att målgruppen omprövats). Det som byggs ska vara
sådant en svensk faktiskt söker på och som varken skiresort.com eller en språkmodell kan svara
på.

**15 september: 108 exponeringar om dagen och 7 klick på en vecka.** Siffrorna står under
"Uppmätt 15 september" nedan. Kort sagt har ortsidorna 79 % av exponeringarna på snittposition
22 och gav 2 klick, medan jämförelsesidorna ligger på 9,8 och gav 3. `/salen-eller-alperna`
fick noll exponeringar den veckan; positionen 1,7 ovan vilade på en handfull.

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

`main` är i fas med `origin/main`. Mergat 8–13 september:

| PR | Vad |
|---|---|
| #49 | Skrivregler i `docs/copy.md` |
| #48 | Sakfelen från copygranskningen (migration 028) |
| #47 | SJ:s nattåg till Åre (migration 027) |
| #46 | Handoff 11 september |
| #45 | Delningsbilden på svenska med alpkoll.se, ritad ur kod |
| #44 | Bildtexterna omskrivna (migration 026) |
| #43 | Galleriets bilder laddar snabbare: cache i 31 dagar, färre bredder |
| #42 | Bildgalleri och kreditering på ortsidan, `/bildkallor` (migration 025) |
| #41 | Vanliga frågor på ortsidan |
| #40 | Handoff 9 september |
| #38, #39 | Kontrasten når WCAG AA |
| #37 | Egen 404 på svenska |
| #36 | Restiden hemifrån, mätt för trettio orter |
| #35 | Sidfoten bär innehållssidorna |
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

## Vad som gjordes 11 september

**Ortsidan har vanliga frågor.** Fyra per ort: pris, fallhöjd, resan dit och höjd över
havet. Frågorna är valda ur Search Console, inte påhittade. Hämtat direkt i Search Console
11 september, tre månader bakåt: till `/resort/salen` gick 104 exponeringar på prisfrågor,
49 på fallhöjd och 32 på Stockholmsfrågor, i snitt på position 18 till 28 och utan ett
klick. Samma ämnen bär Hemsedal, Åre, Trysil och St. Anton. Sajten totalt: 1 540
exponeringar, 7 klick, snittposition 23,3.

**Svaret på Stockholmsfrågan fanns redan, på fel sida.** De uppmätta bilrestiderna i
`lib/restider.js` användes bara på `/sportlov`. Sälens ortsida, dit Google skickade
"sälen stockholm", visade flygplatsen.

Svaren härleds ur datan i `lib/vanligaFragor.js`, och ingen text skrivs per ort. Rangordningen
sker inom landet när det har minst tre orter, annars inom Norden respektive resten. Frågorna
ligger även som `FAQPage` i strukturerad data med exakt den text som syns — kontrollerat för
sex orter. Om Google visar dem som utdrag är inte kontrollerat. Sökt men medvetet utelämnat:
snödjup, namngivna backar och liftar ("väggen sälen", "la gondola åre") och säsongsstart.

Två följdändringar. Snälltågets svenska linjer i `lib/restider.js` har fått `ort` och `slut`,
och `linjeFor` slutar returnera linjen efter sista trafikdagen. Uträkningen per skiddag
flyttade till `perSkiddag` i `lib/pris.js`, så att `/liftkortspriser` och ortsidan inte kan
räkna olika — kolumnen visar samma tal som före flytten. FAQ:n rörde ingen migration.

**Ortsidan har ett bildgalleri (migration 025, körd och verifierad).** Fabian valde
hjältebild och galleri för alla orter bland 610 fria kandidater från Wikimedia Commons och
Unsplash, i artefakten "Alpkoll bildurval". 150 bilder ligger i `resort_images`, en rad per
bild med källa, licens, fotograf och alt-text, varav 39 kräver kreditering. `image_url`
följer radens position 0, så startsidan, jämförelserna och ortsidan visar samma
hjältebild. Uppmätt med anon-nyckeln: 150 rader, `image_url` stämmer för alla 29 orter som
har rader, och ingen rad som kräver kreditering saknar fotograf eller licenslänk.

Galleriet står efter beskrivningen: en stor bild och upp till fyra små på desktop, en
svepbar rad under 700 px, och förstoring med fotograf, licens och källa. Hjältebilden
krediteras uppe till höger. `/bildkallor` listar alla bilder och är länkad från sidfoten —
det täcker startsidans kort, där ingen bildtext får plats. Sidan står som noindex.

Trysil och Riksgränsen har inget galleri men behåller sin bild, nu med licens och
fotograf. Myrkdalen har ingen rad; se nedan.

**Tre saker som kostade tid och är värda att veta:**

*Wikimedias API lägger `?utm_source=...` på bildadresserna.* Inbyggt i en tumnagelsökväg
ger det 400. Ta bort frågesträngen först.

*Tumnaglar finns bara i standardbredder.* 1920 och 3840 fungerar, 2560 ger 400, och 3840
stryps med 429 när Wikimedia måste skapa den. Adresserna i tabellen är 1920. Går enstaka
Commons-bilder bort i drift är nästa steg egen lagring, inte en annan bredd.

*Unsplash sökgränssnitt svarar 401 på skript* men fungerar när anropet görs från
unsplash.com i webbläsaren. Fotografens platsangivelse är deras egen och kontrollerades
bara mot avståndet till orten — en bild märkt Abisko föll bort på den kontrollen.

**Bilderna laddade långsamt direkt efter lanseringen.** Uppmätt på alpkoll.se: 0,35–1,3 s
per bild när Vercel räknade om den, 0,2–0,5 s när den redan fanns — och nästan varje
hämtning räknades om, med `age=0`. Tre orsaker: Next sparar en optimerad bild i fyra
timmar som standard, retinaskärmar begärde hjälte och förstoring i 3840 px (200–900 kB),
och förstoringen stod svart tills den stora bilden kom. Rättat med `minimumCacheTTL` på
31 dagar, `deviceSizes` utan 2048 och 3840, sizes som motsvarar den bredd bilderna
faktiskt visas i, och en förstoring som visar rutans redan hämtade bild direkt (#43).

Efter deployen värmdes cachen: alla bilder hämtades i de bredder webbläsare väljer — 828,
1200, 1920 och 2560 för hjältebilden, 640, 750, 1080, 1200 och 1920 för galleriet. 721
hämtningar utan fel, i snitt 653 ms styck, vilket är vad den första besökaren annars hade
väntat. Mätt igen efteråt på Tignes, Hemsedal och Zermatt: `HIT` på alla 48 hämtningar,
median 19 ms, långsammast 58 ms. Några poster bär fortfarande `max-age=14400` eftersom de
cachades före deployen; de räknas om en gång och får sedan 31 dagar.

**Bildtexterna omskrivna (#44, migration 026, körd och verifierad).** Texterna från 025
visas som bildtext i förstoringen och på `/bildkallor`, och Fabian sa rakt ut att ingen
människa skriver så. Han hade rätt: nästan alla följde mallen ort, ljus eller väder, "med X
och Y bakom", och staplade samma ord — snöklädda toppar, snötyngd, orörd, vinterskrud. De
nya är korta och bär platsnamnet där källan har ett: "Val Thorens från Boismint en
januarimorgon", "Solterrassen på Idalp", "Toppstationen för E8-an på Hundfjället".
Platsnamnen kom ur Commons filnamn och beskrivningar och ur Unsplash-fotografens egen
platsangivelse. Snittlängd 56 → 31 tecken. Gamla texter står som kommentar i 026.

Värt att känna igen nästa gång en text skrivs i mängd: samma meningsbyggnad rad efter rad,
stämningsadjektiv i stället för namn, och en bildtext som beskriver ljuset när den kunde
säga var bilden är tagen.

**Delningsbilden var engelsk (#45).** När Fabian skickade alpkoll.se till vänner stod
förhandsvisningen på engelska med alpkoll.com. Taggarna — `og:title`, `og:url`,
`og:locale` — var svenska sedan länge; det var bilden `og-image.png` som hade "Compare ski
resorts. Plan your trip." och alpkoll.com inritat. Checklistan 9 september godkände den
eftersom den kontrollerade att bilden fanns och var 1200×630, inte vad den föreställde.

Nu ritas bilden ur kod i `app/og-image.png/route.js` med Bebas Neue och Barlow, på samma
adress, och byggs statiskt vid deploy. Kontrollerat live: 42 390 byte, den nya bilden.
Chattappar sparar förhandsvisningar länge — en länk som redan delats kan visa den gamla ett
tag. Messenger uppdateras via Facebooks Sharing Debugger; för iMessage och WhatsApp räknas
`alpkoll.se/?` som en ny länk.

## Vad som gjordes 13 september

**SJ:s nattåg till Åre står på sajten.** Trafikverket meddelade 9 september att SJ:s nattåg
Stockholm–Duved är upphandlat 13 december 2026 till 13 juni 2027, med ett tåg i varje riktning
per dygn. Linjen ligger i `TAGLINJER` i `lib/restider.js`, bredvid Snälltågets, och visas på
Åres ortsida under "Ta sig dit" och i frågan om resan, på `/are-eller-alperna`, på
jämförelsesidorna och på `/sportlov`. Den faller bort efter 13 juni 2027, och beskedet om biljettsläppet efter 31 oktober.

**Åre hade två nattåg som beskrevs som ett.** `transport_info` sade att nattåget tar sju timmar
och syftade på SJ. Svaret om resan lade Snälltågets tider direkt efter: fyra dagar i veckan,
8 timmar och 40 minuter. Migration 027 tar bort meningen, och resten av texten står kvar ord för
ord. Sju timmar var fel för nattåget: SJ:s bokning visar 22.40–07.59, alltså 9 tim 19 min.
Dagtåget tar 6 tim 50 min, och det är troligen därifrån talet kom.

**027 och 028 är körda och verifierade.** Fabian körde dem på kvällen 13 september, efter att
koden redan var mergad. Alla nio ändringar stämmer mot databasen. Direkt efteråt visade
livesidorna fortfarande de gamla texterna, eftersom de är förrenderade och räknas om inom en
timme.

Sälens ortsida fick samtidigt en tågruta, eftersom rutan visas för varje ort som har en linje.
Uppgifterna är desamma som svaret om resan redan hade. `/sportlov` läste förut `TAGLINJER[0]`
och hämtar nu linjerna per id.

**SJ:s tider är höstens.** Tidtabellen från 13 december var inte publicerad. Ortsidan visar
22.40–07.59 med en not om att tiderna gäller i höst, och klockslagen försvinner efter 12
december (`tiderGallerTill`). `/sportlov` visar dem inte alls, eftersom den handlar om
februari. Byt till vinterns tider när biljetterna släpps i slutet av oktober, och ta bort
`tiderGallerTill`, `tidNot` och `utanTider`.

**All copy på sajten är inventerad.** Artefakten "Alpkoll copygranskning" samlar 16 fel i sak,
AI-mönstren med antal, mallmeningarna, alla 30 ortstexter och en jämförelse med hur Vagabond
skriver. Två beslut fattades samma dag. Ortstexterna skrivs i du-form utan synlig avsändare,
"vi" används bara om sajtens egna beslut och "jag" bara på Om oss. En text får säga rakt ut att
en ort är fel val, när vem, varför och en annan ort att välja står med. Reglerna står i
`docs/copy.md` (#49). Granskningen ligger i artefakten
https://claude.ai/code/artifact/c4ecda97-2dc7-4498-9ec9-b115bd53ac43.

**Felen i sak är rättade (migration 028 och kod).** Handskrivna biltider i `transport_info` för
Hemsedal, Sälen, Trysil, Hemavan och Åre stämde inte med den uppmätta restiden på samma sida.
Hemsedal sade sju timmar från Stockholm, uppmätt är 10,3. Karlstad och Umeå mättes samma dag med
OSRM, efter att servern gett exakt samma tal som `lib/restider.js` för två lagrade sträckor.
Grandvaliras obelagda prisjämförelse mot Zermatt är borttagen, och 210 km blev 215. Geilo och
Hemsedal ligger i Buskerud, inte Viken.

Höjdmeningen under stapeln på ortsidan är borttagen. Den räknades fram ur toppens höjd och gav
Kitzbühel "god snösäkerhet" mot ortstexten, Riksgränsen "kom i januari" fast orten öppnar i
februari, och glaciäråkning till Courchevel och Méribel. Jämförelsesidornas källmening sade att
priserna kom från skiresort.com. Sportlovsingressen sade att liftkortet kostar lika mycket
oavsett vecka. Om oss hade jämförelsen som "nästa steg" och rubriken "Data, inte tyckande", och
affiliatesidan kallade poängen data. Allt är rättat.

**Kvar ur granskningen.** Riksgränsens "ett drygt dygn" med nattåget är obelagt. alpkoll.com har
MX-poster hos ImprovMX, och Fabian bekräftade samma kväll att han läser adressen. Regionnamnen på engelska och resten av AI-mönstren tas i copyomskrivningen.
`docs/poangskala.md` använder fortfarande "nattåg sju timmar" och "Sälen fyra och en halv
timme" som ankare för skalan om resan från Sverige.

**Provomgången: rösten i ortstexterna är godkänd.** Åre, Chamonix och Hemsedal skrevs om efter
`docs/copy.md`, med dagens text bredvid och källa för varje nytt påstående, i artefakten
https://claude.ai/code/artifact/ad226e6c-9699-40f9-9667-7d7fe3ea0862. Fabian gillade rösten i
ortstexterna. Utkasten till startsidan och Om oss underkändes eftersom de fortfarande lät som AI.
Texterna finns bara i artefakten, inte i repot.

**Nästa steg för ortstexterna:** skriv om alla 30 (`notes`, `where_to_stay`, `transport_info`) i
samma röst och lägg dem i en migration, med källan för varje nytt namn i kommentaren.
Handskrivna restider ska bort ur `transport_info`, och då måste jämförelsesidorna visa bilresan
ur `lib/restider.js`, eftersom den i dag bara står i texten där. Två uppgifter ur utkasten gick
inte att belägga och är strukna: Skarsnuten Fjellandsby på 1 000 meter och "fyra kilometer" till
Hemsedal sentrum.

**Om oss har fått Fabians egna uppgifter.** Sidan ska bli kort och i jag-form. Han har åkt
skidor i Sverige och Alperna i över 25 år, och han har åkt i Sälen, Romme, Åre, Dolomiterna,
Bad Gastein, Zell am See och Mayrhofen. Om varför han byggde sajten sa han: "Har letat så många
timmar med olika flikar om alla skidområden." Sajten ska hjälpa, med hans ord, "svensken som
ska välja resa i Sverige, Norden eller mellan olika alpbyar". Målgruppen överst är
omskriven efter det. På sidan står bara förnamnet Fabian, inget mer, och han läser
hello@alpkoll.com. Skriv inget om honom utöver det han sagt. Metoden flyttas till sidorna där
talen står.

Utkastet som byggts av hans svar, inte godkänt än:

> **Om Alpkoll**
>
> Jag heter Fabian och har åkt skidor i över 25 år, i Sverige och i Alperna. Här hemma har det
> blivit Sälen, Romme och Åre, och i Alperna Dolomiterna, Bad Gastein, Zell am See och Mayrhofen.
>
> Inför resorna har jag letat i många timmar, med flik efter flik om olika skidområden. Alpkoll
> samlar orterna på ett ställe, med pist och fallhöjd ur samma källa, liftkortet i kronor och
> restiden från svenska städer.
>
> Sajten är för dig som ska bestämma var vinterns skidvecka blir, i Sverige, i Norden eller i
> Alperna.
>
> Hittar du en siffra som inte stämmer, skriv till mig på hello@alpkoll.com.

**Startsidan byggs om, och det finns en skiss.** Fabian pekade på Aftonbladet för upplägget och
Filmstaden för att välja stad först. Två styrningar: sidan ska inte vara en landningssida med
budskap, och inte heller nyheter, eftersom han inte kommer att skriva nytt ofta. Den ska vara
innehåll som räknas fram. Första försöket med nyhetspuffar och en vinterkalender underkändes
av det skälet.

Skissen ligger på grenen **`startsida-skiss`, committad lokalt (8b110ce) men inte pushad**, på
`/skiss-startsida`, som är noindex och inte länkad:

- **Du åker från:** fem städer (den största i vart och ett av de fem största länen), "Fler
  städer" med den största staden i varje övrigt län från norr till söder, och sök bland alla
  100. 21 knappar från början var för många enligt Fabian.
- **Innehållet:** topp 5 närmast från staden som stora kort, fyra moduler (Närmast i Alperna,
  Mest fallhöjd inom tio timmar, Billigast per skiddag, Med tåg), fyra guider (Nattåget,
  Sportlov, Åre eller Alperna, Liftkortspriser) och alla orter sorterade på restid.
- **Kontrollerat:** stadsbyte med knapp och sök, ingen horisontell scroll vid 571, 430 och
  375 px, ESLint utan fel.

**Restiden från 100 städer ligger i `lib/avresestader.js`.** Städerna är SCB:s 100 största
tätorter 2023, med SCB:s namn, så en heter "Sundsvall och Timrå". Koordinaten kommer från
Wikidata, matchad på folkmängden eftersom SCB:s nya tätortskoder inte finns där. Stockholm,
Göteborg och Malmö behåller koordinaten i `lib/restider.js`. 3 000 sträckor är mätta med OSRM,
och de 90 som redan fanns stämde alla på kilometern och minuten. Skripten ligger i `scripts/`
och tar underlagsfilerna som argument. Filen är 90 kB och skickas hel till webbläsaren i
skissen. I den riktiga versionen bör varje stad få en egen adress, till exempel `/fran/umea`,
som också kan synas på "skidorter nära Umeå".

**Öppen fråga: vad som ska stå överst.** Fabian påpekade att "närmast" nästan alltid blir Sälen.
Uppmätt på alla 100 städer är Sälen etta från 64 och Trysil från 26, och det finns bara 15
olika topp 5-listor. "Närmast i Alperna" blir St. Anton från alla 100 och "mest pist per
restimme" Méribel från 93, så de modulerna säger inget heller. Orsaken är att sajten bara har
elva nordiska orter. Förslaget som väntar på svar: topp 5 efter vad du vill ha, på uppmätta tal
(Störst, Brantast, Billigast, Högst upp, Utan flyg), med restiden från staden på varje kort och
"Kortast resa" som ett av valen. Poäng används inte, eftersom poängskalan själv säger att
mittfältet inte går att jämföra.

## Uppmätt 15 september

**Search Console-exporten för 7–13 september**: Coverage, sökresultat och AI-ytor, alla på
"senaste 7 dagarna". Inget i koden eller databasen ändrades.

| | 11–21 aug | 31 aug–6 sep | 8–13 sep |
|---|---|---|---|
| Exponeringar per dag | 20 | 75 | 108 |
| Klick | 1 | 6 | 7 |

Veckan gav 1 002 exponeringar och 7 klick. **7 september är en engångstopp:** 354 exponeringar
på position 30,5, en tredjedel av veckan på en dag. Exporten delar inte upp frågorna per dag, så
orsaken syns inte. Utan den dagen blir det 648 exponeringar, CTR 1,08 % och snittposition 14,1.
Alla sju klicken kom 9–13 september, lika många som sajten fått totalt fram till 6 september.
Sverige stod för 883 exponeringar och alla klick. Mobilen gav 6 klick på position 11,2, desktop
1 klick på 26,9.

**Ortsidorna har volymen, jämförelsesidorna får klicken.**

| Sidtyp | Exponeringar | Klick | CTR | Position |
|---|---|---|---|---|
| Ortsidor (26) | 797 | 2 | 0,25 % | 22,0 |
| Jämförelsesidor (15) | 122 | 3 | 2,5 % | 9,8 |
| Nattåget, Åre eller Alperna | 56 | 2 | 3,6 % | 12,9 |

Åre och Sälen, de två största sidorna, gav noll klick på position 24,9 och 23,6. Av
jämförelsesidornas 122 exponeringar gällde 114 två nordiska orter, och alla tre klicken.

**Frågorna.** Exporten redovisar bara 445 av 1 002 exponeringar och inget av klicken, så
uppdelningen gäller under hälften av trafiken.

| Ämne | Exponeringar | Position |
|---|---|---|
| Fallhöjd | 45 | 11,8 |
| Pris och liftkort | 76 | 23,5 |
| Resa och avstånd | 58 | 29,7 |
| Höjd över havet | 26 | 33,8 |
| "vs" och "eller" | 15 | 8,9 |

Fallhöjden ligger precis under sidan 1: `fallhöjd åre` 10,5 och `fallhöjd sälen` 10,8, mot 18,7
den 8 september räknat över en längre period. Riksgränsen syns på 31 frågor på snittposition 51
och St. Anton på 22 frågor på 42. Namngivna backar, liftar och boenden — `la gondola åre`,
`väggen sälen`, `meteorologen riksgränsen` — gav 29 exponeringar på position 40. Prisfrågor med
"liftkort" eller "skipass" ligger på 26,9 och de utan på 16,1: `sälen priser` står på 12,6 och
`liftkort sälen pris` på 59. Vilken sida Google visar för vilken fråga syns inte i exporten.
Ingen fråga innehöll "nära", "närmast", "skidorter" eller "sportlov".

**AI-ytorna gav 70 exponeringar på veckan**, mot 52 totalt fram till 6 september: ortsidor 45,
jämförelsesidor 21 och guider 4. Jämförelsesidorna har alltså 30 % av AI-exponeringarna mot 12 %
av sökningen. Störst är `/jamfor/salen-vs-trysil` med 8, Ruka med 7 och Zermatt med 6.

**20 av sitemapens 65 adresser fick ingen exponering**, bland dem `/salen-eller-alperna`,
`/liftkortspriser`, `/sportlov`, Hemavan, Myrkdalen, Tignes, Voss och nio jämförelsesidor.
`/salen-eller-alperna` är kontrollerad live: 200, rätt canonical, ingen noindex och med i
sitemapen. Det är inget tekniskt fel.

**Coverage-exporten är oförändrad** och slutar 4 september: 52 indexerade, 34 noindex, 8
upptäckta, 4 genomsökta och 1 omdirigering.

**Vanliga frågor (11 september) och SJ:s nattåg (13 september) hann inte mätas.** Position 14,9
den 8–10 september mot 13,2 den 11–13 bygger på tre dagar mot tre och säger inget om orsaken.
Nästa export görs kring 26 september med Datum → Jämför, 28 augusti–10 september mot 11–24
september. Då står båda perioderna på samma rad per fråga och sida.

**Ordningen står kvar.** Genomgången föreslog att flytta upp fler svenska orter, med
jämförelsesidornas nordiska andel som skäl. Fabian valde 15 september att behålla ordningen från
13 september. Fler svenska orter tas senare, och frågan är avgjord.

**Okontrollerat sidofynd.** Riksgränsens meta-beskrivning säger "Liftkort 520 kr/dag, 2 547 kr
för sex dagar" utan säsong, och enligt avsnittet om pristabellen under Praktiskt är Riksgränsens
rad från 2025/2026. Vilken säsong beskrivningen läser är inte kontrollerat.

## Vad som gjordes 15 september: ortstexterna

**Alla 30 ortstexter är omskrivna, i migration 029 på grenen `ortstexter` (84a7e6f).
Grenen är committad lokalt men inte pushad, och 029 är inte körd.** Fälten `notes`,
`where_to_stay` och `transport_info` skrevs om för alla publicerade orter på en gång, i rösten
från provomgången. Under varje ort i migrationen står källan för varje nytt namn, det som
följt med ur den gamla texten utan omkontroll, och det som strukits. Före och efter står sida vid
sida i artefakten https://claude.ai/artifact/ULrAHRGyScAY3gKk4LRZ7Y.

**Uppmätt:** 66 mönster ur `docs/copy.md` i dagens texter, noll i de nya, räknat med `\p{L}`
och flaggan `u` efter att uttrycket prövats mot fyra kända exempel. Noll handskrivna tider.
Tre fanns i första utkastet (Sälens flygplats, Les Arcs bergbana, Zermatts pendeltåg) och
ströks. Talen i texterna, alltså pist, fallhöjd, toppens höjd och andel blå, stämmer mot
databasen för alla 30. Tio orter säger fel val, och varje omdöme har ett poängpar som stöder
det.

**24 uppgifter följde med ur dagens text utan att kontrolleras om.** De står ort för ort i
migrationen och artefakten, till exempel Rond-Point des Pistes och bussarna från Umeå till
Hemavan. Fabian har inte tagit ställning till dem.

**Kod i samma commit.** `bilMening` i `lib/restider.js` skriver bilresan på jämförelsesidorna
och alpsidorna. Nordiska orter får Stockholm, Göteborg och Malmö, alporterna bara Malmö, samma
val som ortsidans vanliga frågor. Etiketten "Med tåg och flyg" på ortsidan heter "Resan dit".
Verifierat i dev-servern: meningen syns på `/jamfor/salen-vs-trysil`, `/jamfor/are-vs-val-thorens`
och båda alpsidorna med rätt tal, och serverloggen har inga fel. ESLint ger inga fel.

**Merga före körning, tvärtom mot rådet under Praktiskt.** Körs 029 först står jämförelsesidorna
utan bilresa tills deployen är klar, eftersom de handskrivna tiderna redan är borta ur texten.
Efterkontrollerna står längst ner i migrationen: den första ska ge 30, den andra noll rader.

**Tre fynd på vägen.** SJ:s nattåg norr om Boden drogs in i april 2026, och Trafikverket har
upphandlat Stockholm–Narvik utan byte från december 2026 till december 2028. Riksgränsens
"ett drygt dygn" är struket. Trysils text hade Turistsenteret på västsidan och Fageråsen som
eget område; enligt SkiStar ligger Turistsenteret på södra sidan och Høyfjellssenteret i
Fageråsen. Tignes har inte längre glaciäråkning året runt, och Val Thorens liftar på
Péclet-glaciären togs bort 2002.

## Vad som väntar

### Checklistan: sexton av tjugo var redan i ordning

Genomgången 9 september av privacy, terms, CTA, FAQ, robots, sitemap, 404, alt-texter,
analytics, meta, social share, favicon, canonical, cookie consent, mobil, tillgänglighet,
formulär, brutna länkar och prestanda.

**Klart och kontrollerat:** robots pekar rätt, sitemapens 65 adresser svarar alla 200,
9 av 9 bilder har alt (sedan 11 september har även galleriets 150 bilder det), alla sidor
har titel, beskrivning och canonical, og- och twitter-taggar finns med bild i 1200×630,
favicon i fem format, analytics kör. **Delningsbilden var dock engelsk** — kontrollen såg
att den fanns, inte vad den visade. Rättad 11 september, se ovan.
**Noll brutna länkar** av 86 interna och 9 externa.

**Cookie consent behövs inte.** Sajten sätter noll cookies och noll localStorage — mätt i
webbläsaren, inte antaget. Vercel Analytics är cookielöst. Skulle något ändras är det den
mätningen som ska göras om först.

**En punkt kvar, liten:**

*Sportlovssidan har bara h1 och inga h2.* Blocken är div-rubriker med etikett. Övriga sidor
har rätt struktur.

FAQ-punkten är avklarad 11 september, se ovan.

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
30 augusti och beskriver säsongen 18 december 2026–14 mars 2027. Det som återstår av
höstarbetet är priserna, och SJ:s tider till Åre när biljetterna släpps i slutet av oktober.

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

Mätt 15 september: noll exponeringar igen. Prisfrågor med "liftkort" eller "skipass" ligger på
position 26,9, de utan på 16,1. **Kontrollera först i Search Console vilken sida som visas** för
`liftkort sälen pris` (`&query=*liftkort` och `&breakdown=page`), innan något ändras på ortsidan
eller här. En sida om prisökningen passar principen, eftersom en språkmodell inte kan räkna ut
den, men den kräver två uppmätta säsonger av samma kort. Efter oktober har troligen bara de fyra
orterna med 25/26-rader det; om fler har ett äldre pris att hämta är inte kontrollerat.

**4. Sportlovssidan är byggd — det som återstår är priserna.** `/sportlov` svarar på
veckan och nattåget. Prisdelen väntar på oktoberinsamlingen, och den ska då riktas mot
SkiStar-orternas veckopriser: Åre, Sälen, Hemsedal och Trysil sätter priset efter
startdatum, och basen bär bara veckan som börjar 1 mars. Fler alporter tillför ingenting
här, eftersom deras pris inte ändras med veckan.

**5. Tre orter där frågan är vilket kort som motsvarar orten.** Chamonix Le Pass ger 110 km
mot vårt tal på 170. Grandvaliras flerdagarskort ger 308 mot vårt 215. Sälen är samma sak.
Det är vad en `sub_areas`-kolumn finns för — kräver kod, inte data.

**6. Startsidan byggs om.** Skissen och den öppna frågan om toppen står under 13 september.
Filter och sortering ingår där. Mätt 15 september: startsidan hade 20 exponeringar på position
20,6, och ingen fråga innehöll "nära", "närmast" eller "skidorter". Resefrågorna gäller en ort,
som `sälen stockholm`, och besvaras på ortsidan. Datan ger alltså inget stöd än för en egen adress
per stad; bygg startsidan för besökarna och räkna inte med söktrafik från den.

**7. Fler svenska orter** — Vemdalen, Idre Fjäll, Branäs, Romme, Kungsberget. De ska in, men är
inte högsta prioritet (13 september). De ger också topplistorna på startsidan mer variation.
Kräver research, inte kod. **Fabian 15 september: tas senare**, trots att 114 av
jämförelsesidornas 122 exponeringar gällde nordiska par. Avgjort — ta inte upp det igen.

**8. Vandring**, med datamodellen delad i plats och aktivitet först.

### Väntar på ditt beslut

**Toppen på startsidan, och utkastet till Om oss.** Båda står under 13 september.

**Bilderna — lösta 11 september, utom Myrkdalen.** Hotlänkningen, den saknade
krediteringen och Verbiers GFDL-bild är borta; se ovan. Myrkdalens hjältebild är
fortfarande hotlänkad från skiresort.info och saknar belagd licens. Det finns inga
vinterbilder av orten på vare sig Commons eller Unsplash, så nästa steg är ortens egen
pressbank eller Fjord Norway — med villkoren lästa innan något används.

**Mobilmenyn** är en flikrad med tre ikoner — Skidorter, Jämför, Om oss. Där saknas både
Nattåget och Liftkortspriser. En fjärde flik är ett designval, inte en rättning.

**Kräver dig, inte kod:** redaktionella poäng för nya orter, affiliate-ID när trafiken
bär. Obekräftat i integritetspolicyn: att Supabase-projektet ligger i eu-north-1. Brevlådan
`hello@alpkoll.com` är bekräftad: Fabian läser den (13 september).

## Praktiskt

**Live-sidorna släpar en timme efter en migration.** Allt har `revalidate = 3600`.
En rättad siffra i Supabase syns inte direkt — sidorna förrenderades vid deployen.
**Mät `Age`-headern innan du felsöker något som ser orättat ut.** En merge tvingar fram en
omdeploy och därmed omrendering, så kör hellre SQL:en först och mergar sedan.

**Deploy går inte att köra härifrån i auto-läge.** `npx vercel --prod` blockeras av
auto-lägets klassificerare, vilket är en annan mekanism än behörighetslistan.

**Migrationer:** 29 filer i `supabase/migrations/`, alla körda och verifierade till och med
**028**. **029 (ortstexterna) är skriven men inte körd**, och ligger bara på grenen `ortstexter`. Fabian kör dem själv i Supabase SQL Editor; sessionen har bara anon-nyckeln — men
den räcker för att läsa hela `resorts`, `lift_pass_prices` och `resort_images`, vilket är
hur granskningarna görs.

**Bildcachen värms efter varje ändring av bilder eller bildinställningar.** Vercel räknar om
en bild första gången en viss bredd begärs, och det tar 0,5–1,3 s. Hämta
`/_next/image?url=<kodad adress>&w=<bredd>&q=75` för varje bild i de bredder som står i
avsnittet om 11 september, efter deployen — gjort före deployen sparas resultatet med de
gamla inställningarna. Bredderna måste finnas i `deviceSizes` i `next.config.mjs`.

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

**Frågeexporten visar under hälften av trafiken.** 15 september redovisade `Frågor.csv` 445 av
1 002 exponeringar och inget av de sju klicken; resten är frågor Google inte redovisar. En
uppdelning på ämnen gäller bara den delen, och exporten kopplar inte frågor till sidor. Coverage-
exporten släpar: hämtad 15 september slutade den 4 september.

**Sitemapen skriver startsidan utan snedstreck**, `https://alpkoll.se`, medan Search Console
skriver `https://alpkoll.se/`. En skriptad jämförelse mellan dem räknar startsidan som osedd.

**Search Console går att läsa direkt via Claude i Chrome**, utan export. Filtren står i
adressen: `&query=*pris` betyder "frågan innehåller pris" (chipet visar "+pris"),
`&page=*%2Fresort%2Fsalen` detsamma för sidan, och `&breakdown=query` eller `page` byter
tabell. Sätt "Rader per sida" till 500 och läs raderna med JavaScript i bitar om 65 —
ett långt svar kapas. Tillägget kan vara installerat utan att vara anslutet; ett nytt
försök räckte 11 september.

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

**Skärmdumpar i Chrome på retinaskärm kan fånga bara ett hörn av sidan.** 11 september, med
`devicePixelRatio` 2, gav `screenshot` övre vänstra delen uppförstorad. `zoom` med hela
fönstret som region gav rätt bild. Skärmdumpar tog också ibland för lång tid och avbröts;
DOM:en går att läsa ändå.

**En dold Chrome-flik laddar inga lata bilder.** `document.visibilityState` var `hidden`,
och galleriets `loading="lazy"`-bilder hämtades aldrig trots scroll. Laddningstider går då
inte att mäta i webbläsaren; mät adresserna direkt med `fetch` och de bredder en webbläsare
skulle välja.

**Kör inte `next build` medan `next dev` är igång** — de delar `.next`, och dev-servern
började servera gammal utdata efteråt. Bygget hade rätt, dev-servern fel. Läs byggets egen
HTML i `.next/server/app/` när de två säger emot varandra.

**PowerShell tar bort dubbla citattecken i `node -e`.** Ett skript i en here-string kom fram till
Node utan dem och gav syntaxfel. Skriv skriptet till en fil och kör filen.

**OSRM:s table-API räcker för tusentals sträckor.**
`router.project-osrm.org/table/v1/driving/<koordinater>?sources=…&destinations=…&annotations=duration,distance`,
med tio källor och trettio mål per anrop. Det gav samma tal som route-API:t för alla 90 lagrade
sträckor.

**SCB:s tätortskoder bytte format 2023.** PxWeb-tabellen
`api.scb.se/OV0104/v1/doris/sv/ssd/MI/MI0810/MI0810A/LandarealTatortN` (folkmängd är
`000003F7`) använder koder som `0180TC101`, medan Wikidata bär de gamla (`T0336`). Matcha på
folkmängd, inte kod. Wikidata har dessutom tätorter med befolkningstal från 1965–2010, så
rangordna aldrig på Wikidata.

**SkiStars adresser har bytt mönster.** `skistar.com/sv/skidorter/are/` ger 404. Nuvarande
mönster är `/sv/vara-skidorter/are/vinter-i-are/skidomraden/<område>/`. Chamonix turistbyrås
sidor ligger under `en.chamonix.com/activities/winter/skiing-in-chamonix-mont-blanc-valley/`, och
några har flyttat till `/things-to-see-and-do/`.

**Sammanfattande webbhämtningar kan återge fel.** En hämtning av Vagabonds Schweizguide påstod
att ingen ort avråddes, och ett stickprov visade att Disentis gjorde det. Kontrollera enskilda
påståenden innan de citeras.

**Testa brytpunkter i en iframe.** Lägg sidan i en iframe med `width:430px` och `375px` i samma
flik och mät `scrollWidth` där. Så hittades horisontell scroll i skissen 13 september.

**Wikimedia svarar 429 när dev-servern laddar om många bilder i rad.** Det är bildoptimeringen
som hämtar originalen igen, inte ett fel i koden. En ny laddning efter en stund gav noll fel.
