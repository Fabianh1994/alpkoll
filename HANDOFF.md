# Handoff — Alpkoll

Skriven 8 september 2026, uppdaterad den 9:e, 11:e, 13:e, 15:e, 16:e, 17:e, 21:a, 22:a, 23:e och 24:e, för att kunna öppna en ny session utan
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

`main` är i fas med `origin/main`. Mergat 8–22 september:

| PR | Vad |
|---|---|
| #66 | Bookings riktiga logga i "Var du bor"-kortet, Booking Blue på alla tre knapparna |
| #65 | Booking-länkarna går via CJ, knappnamn som `sid`, priser i kronor |
| #64 | Handoff 21 september |
| #63 | Avsändaren i sidfoten, och kontaktadressen till `lib/kontakt.js` |
| #62 | Annonsmärkning vid länken, `/sa-jamfor-vi`, CJ i integritetspolicyn |
| #61 | Delområdena: Sälen och Chamonix är summor, två fallhöjder rättade |
| #57 | Restiden på sportlovssidan blir staplar; tabellen fick inte plats på en telefon |
| #56 | Sportlovssidans avsnitt blir riktiga rubriker (h2 och h3) |
| #55 | Om oss omskriven utan personliga uppgifter |
| #54 | Handoff: 029 körd och verifierad |
| #53 | Alla 30 ortstexter omskrivna (migration 029), bilresan på jämförelsesidorna |
| #50, #51, #52 | Handoffar 13 och 15 september |
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

**Ändrat 15 september: Fabian vill inte ha sidan så personlig.** Utkastet nedan byggdes och
underkändes samma kväll. `/about` i #55 har i stället tre stycken utan namn, skidår, orter och
jag-form: vad sajten samlar, vem den är för, och adressen för fel. Metodkorten, "På gång" och
meta-beskrivningen om "en skidåkare i Stockholm" är också borta. Utkastet står kvar som underlag:

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

Skissen ligger på grenen **`startsida-skiss` (8b110ce), pushad till GitHub 15 september men utan PR**, på
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

**Alla 30 ortstexter är omskrivna och live.** Migration 029 mergades i #53, kördes av Fabian
kvällen 15 september och är verifierad, se nedan. Fälten `notes`,
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

**De 24 uppgifter som följde med ur de gamla texterna är kontrollerade**, på Fabians begäran
samma dag. Det som gick att belägga står kvar med källa, resten är struket. Sex var fel eller
saknade stöd: Alpin Express i Saas-Fee går inte från "södra änden", Mayrhofens lift är
Horbergbahn från Schwendau och inte "Hippachs egen lift", Foscagnopasset brukar vara öppet året
runt, Méribels gondol Olympe börjar i Brides-les-Bains, Scandinavian Mountains Airport har nio
destinationer och inte "ett fåtal linjer", och Altibus skriver inte att bussarna till Val Thorens
möter tågen. Nio källor är tredjepartssidor och märkta så i migrationen. Kontrollskriptet
avbryter bygget om ett mönster, en handskriven tid eller en okontrollerad uppgift finns kvar,
och gav noll.

**Ingen uppgift vilar på ett sökresultat.** Tolv källor hade bara setts som sammanfattning i
WebSearch och öppnades i en tredje genomgång, tidtabellen från Trentino Trasporti med
`pdftotext`. Två var fel: skidbussen i Paznaun är gratis med gästkortet, och gratis med liftkort
bara för säsongskort; Horbergbahns dalstation ligger i Stockach. Tre detaljer ströks. Claude i
Chrome var inte anslutet, och `m.ischgl.com` vägrade anslutning både från WebFetch och
webbläsarpanelen.

**Kod i samma commit.** `bilMening` i `lib/restider.js` skriver bilresan på jämförelsesidorna
och alpsidorna. Nordiska orter får Stockholm, Göteborg och Malmö, alporterna bara Malmö, samma
val som ortsidans vanliga frågor. Etiketten "Med tåg och flyg" på ortsidan heter "Resan dit".
Verifierat i dev-servern: meningen syns på `/jamfor/salen-vs-trysil`, `/jamfor/are-vs-val-thorens`
och båda alpsidorna med rätt tal, och serverloggen har inga fel. ESLint ger inga fel.

**Körd och verifierad 15 september.** #53 mergades 19.37 UTC och 029 kördes efter merge.
Uppmätt med anon-nyckeln: alla 30 orter stämmer tecken för tecken mot migrationen i alla tre
fälten, efterkontroll 1 gav 30 och efterkontroll 2 noll rader. Livesidorna visade ändå de gamla
texterna, eftersom produktionsbygget förrenderats innan SQL:en kördes. En omdeploy i Vercel,
utan byggcache, löste det direkt: ortsidorna för Sälen, Ischgl och Zermatt, startsidan,
`/jamfor/salen-vs-trysil` och `/salen-eller-alperna` visar de nya texterna och ingen av de
gamla. Övriga ortsidor är inte öppnade live. Om byggcachen hade spelat roll är inte prövat.

**Ordningen när en textmigration förutsätter ny kod:** merga, kör SQL:en, gör om deployen.
Körs SQL:en först saknar sidorna det koden ska visa i stället, här bilresan på
jämförelsesidorna. Det är tvärtom mot rådet under Praktiskt, som gäller migrationer utan
kodberoende. Sajten har ingen `revalidatePath` eller `revalidateTag`, så omdeployen är enda
sättet att slippa vänta en timme.

**Tre fynd på vägen.** SJ:s nattåg norr om Boden drogs in i april 2026, och Trafikverket har
upphandlat Stockholm–Narvik utan byte från december 2026 till december 2028. Riksgränsens
"ett drygt dygn" är struket. Trysils text hade Turistsenteret på västsidan och Fageråsen som
eget område; enligt SkiStar ligger Turistsenteret på södra sidan och Høyfjellssenteret i
Fageråsen. Tignes har inte längre glaciäråkning året runt, och Val Thorens liftar på
Péclet-glaciären togs bort 2002.

## Vad som gjordes 16 september: sportlovssidan

Två PR:ar, båda mergade av Fabian samma kväll och verifierade live efter deployen. Ingen
migration — ren kod, så omdeployen räckte.

**Sidans avsnitt är riktiga rubriker (#56).** `/sportlov` hade en enda rubriktagg,
`<h1>Sportlov 2027</h1>`, och noll h2–h6 — kontrollerat mot live med `curl` innan något
ändrades, inte övertaget ur den här filen. Avsnitten syntes som avsnitt men var `div`-ar.
Veckans datumspann är nu `h2` och de fyra kortetiketterna `h3`.

**Varför datumet och inte blocken blev h2:** väljaren skriver ut alla fyra veckorna i
markupen och döljer tre med `display: none`, medvetet, så att innehållet finns i första
HTML-svaret. En h2 per block hade gett fyra likadana rubriker i dokumentet. Datumen skiljer
sig åt. De dolda veckorna faller ur tillgänglighetsträdet, så den som läser med skärmläsare
möter h1, en h2 och fyra h3 för den vecka som visas. Två etiketter står kvar som `div`:
"Sportlov vecka N" säger samma sak som h2:an strax under, och etiketten i Stockholmsrutan
hör till ett avsnitt som redan har sin h3.

**Uppmätt att ingenting flyttade sig:** före och efter i samma dev-server, med `git stash`
emellan. Korten låg på samma pixel i båda körningarna (`454:142 | 608:357 | 976:314 |
1303:534 | 1849:112`) och sidan var 2336 px hög. Beräknad stil identisk: h2 Bebas Neue
38 px vikt 400, h3 Barlow 10 px vikt 500 versaler. Vikt och marginal står uttryckligen i
inline-stilen i stället för att lita på att Tailwinds preflight nollar dem.

**Restidstabellen blev staplar (#57).** Tabellen var tre städer gånger fyra orter med
`minWidth: 420`. Vid 375 px fanns inte plats, så den fjärde orten låg utanför skärmen bakom
systemets ljusa rullningslist, mitt i ett mörkt kort. Varje stad har nu en egen lista: ort
till vänster, stapel i mitten, tiden i klartext till höger, kortaste resan i guld som förut.

**Skalan är gemensam för alla tre städerna.** Med en skala per stad hade Sälen från
Stockholm och Sälen från Malmö fått lika långa staplar trots fyra timmars skillnad, och
stapeln sagt emot talet bredvid sig.

**Uppmätt, före och efter i samma dev-server**, räknat som antal element vars innehåll är
bredare än sin ruta:

| Bredd | före | efter |
|---|---|---|
| 375 px | 1 — tabellens ruta, 420 px innehåll i 278 px | 0 |
| 430 px | 1 — 420 px i 330 px | 0 |
| 1440 px | 0 | 0 |

De 142 pixlar som låg utanför vid 375 px var Kitzbühel — alltså precis den ort som är
poängen med raden från Malmö, där Alperna är närmare än Åre. Antalet `<table>` i `main`
gick från 4 till 0, fyra därför att alla fyra veckorna skrivs ut. Proportionerna stämmer
mot talen: Sälen från Stockholm ritas 161 px av 578, och 5,9 av 21,1 timmar är 28 %.

**Vad det kostade:** kortet växte från 534 till 944 px i den bredd som mättes. Tolv rader
tar mer plats än tre. Bytet är sidled mot neråt.

**Live verifierad efter merge:** `X-Vercel-Cache: PRERENDER` på första hämtningen, alltså
en färsk sida och inte en ur cachen. Noll `<table>` och fyra h2 på `alpkoll.se/sportlov`.

**Två fynd som inte är rättade, båda noterade i #57:**

*Texten under restiden säger fel.* "Bor du i Malmö är Kitzbühel närmare än Åre. Det är en
och en halv timme kortare med bil." Talen ger 15,5 mot 14,2 timmar, alltså 1 timme och
17 minuter. "Knappt fem timmar" till Trysil stämmer exakt.

*Samma sorts tabell finns på tre andra sidor.* `/liftkortspriser`,
`/nattaget-till-alperna` och jämförelsesidorna har alla `overflowX: auto` utan att
rullningslisten är formgiven. Om de har samma problem är **inte mätt** — mätningen är en
rad JavaScript i en iframe med rätt bredd, se #57.
## Vad som gjordes 17 september: ortkorten på startsidan

En PR (#59), mergad av Fabian och verifierad live efter deployen, som tog femton sekunder.
Ingen migration. Utgångspunkten var en skärmbild av ortlistan och frågan "ser du problemet".

**Ortlistan stod inte i svensk bokstavsordning.** `getResorts()` sorterade med
`.order('name')`, alltså databasens kollation: å och ä föll in bland a, ö bland o. **Åre låg
tvåa av trettio**, och Sälen och Sölden före St. Anton. Landsfiltret i samma vy sorterade
redan med `localeCompare(..., 'sv')` och visade Österrike sist — det var motsägelsen i samma
skärmbild som avslöjade felet.

Sorteringen ligger nu i `lib/resorts.js`, på samma ställe som `published`-filtret. Mätt på de
tre ytor som tar listan rakt av: startsidan och `/jamfor` hade Åre på plats 2 av 30,
`/bildkallor` på 2 av 29. Alla tre har nu Åre sist. `/liftkortspriser`,
`/nattaget-till-alperna` och `OrtEllerAlperna` sorterade redan om själva och var opåverkade.
`naraOrter` väljer via en total ordning med `a.slug.localeCompare(b.slug)` som skiljetecken,
så internlänkgrafen ändras inte — bara visningsordningen.

**Dokumentets bakgrund var vit.** `--background: #ffffff` satt kvar från Next.js-mallen och
byttes mot `#0a0a0a` först i mörkt systemläge — två olika svarta beroende på läsarens
inställning, på en sajt som inte har något ljust läge. Nu `#121110` och `#f0ece4` utan
mediefråga.

**Hover-ramen ritades 62 pixlar under kortet.** Markeringen sitter på `<a>`, som rutnätet
sträcker till radens höjd, medan kortrutan bara omslöt sitt innehåll. På Alpe d'Huez var
`<a>` 486 px och kortrutan 424. Kortrutan sträcks nu med `height: 100%` och flex-kolumn;
överhänget är mätt till 0 på samtliga 30 kort. Sidoeffekten är att korten i en rad slutar i
samma linje i stället för där texten tar slut.

### Den ljusa raden vid bildens underkant — och tre försök som inte hjälpte

Symptomet: en ljus hårfin rad tvärs över hela kortets bredd, precis där fotot slutar, **bara
vid hover**. Den gick inte att fånga med PrtScn.

Det i sig var beskedet. **Ett fel som syns på skärmen men inte i en skärmdump uppstår när
grafikkortet sätter samman lagren, inte i det sidan målar.** Mätningen bekräftade det: av
alla element i kortet, `::before` och `::after` inräknade, ändrade exakt tre värden sig vid
hover — `<a>`-ns transform, markeringens opacity och bildens `scale(1.06)`. Ingen bakgrund,
ingen kant, ingen skugga. Alltså målade inget element raden.

Orsaken är att ett skalat element som klipps av en `overflow: hidden` får ett eget
grafiklager, och klippkanten kantutjämnas vid sammansättningen.

**Tre försök som inte hjälpte, och som inte är värda att göra om:**

1. *Mörk dokumentbakgrund.* Byggde på att den vita `body` lyste igenom springan. Raden var
   lika vit efteråt. Ändringen står kvar, men på egen grund — se ovan.
2. *Gradienten en pixel under klippkanten.* Återställd.
3. *`will-change: transform` på en egen klippruta runt bilden.* Återställd.

**Ett fjärde försök tog bort raden men bröt något annat.** Att skala hela kortet
(`scale(1.01)`) i stället för bilden fungerade — men lade en `scale` ovanför landsetiketten i
trädet, och dess `backdrop-filter` slutade måla. Flaggorna försvann. `translateY(-3px)` hade
alltid legat där utan att störa etiketten; det är skalningen ovanför ett `backdrop-filter`
som inte går.

**Det som löste det:** bildens hover-zoom är borttagen helt. Hovringen lyfter kortet tre
pixlar och tonar in den varma ramen och skuggan. Fotot zoomar inte längre — ett designbyte
Fabian godkände.

**Samma mönster finns kvar på ortsidorna.** `app/resort/[slug]/Bildgalleri.js:110` har
`.ortgalleri-ruta:hover img { transform: scale(1.04); }` inuti en ruta med `overflow:
hidden`. Om raden syns där också är **inte mätt** — det kräver ögon på skärmen.

### Flaggorna var bokstäver på Windows

Etiketten bar flaggemojin. 🇳🇴 är inte ett flaggtecken utan ett par regionsbokstäver, som
typsnittet förväntas slå ihop, och Segoe UI Emoji har inga flaggsymboler alls. Chrome på
Windows visade därför "NO Norge" och "FR Frankrike" — och etiketten såg olika ut beroende på
vad besökaren satt vid. På Mac och iPhone blev samma tecken en flagga.

`app/Flagga.js` ritar dem som SVG i stället: inga bildfiler, inga nätverksanrop, ingen
licensfråga. Mätt i serverns HTML: 27 flaggor i 16×11 plus 3 kvadratiska Schweiz = 30, noll
emoji kvar.

Schweiz ritas kvadratisk, eftersom flaggan är det, och blir därmed smalare i etiketten.
Andorras och Spaniens riksvapen är utelämnade — vid nio bildpunkters höjd blir de en oläslig
klump. **Kanada, USA och Nya Zeeland saknar ritad flagga**; deras orter är dolda sedan
migration 003, så det syns inte i dag, men publiceras Whistler eller Aspen visar etiketten
bara landets namn.

**Live verifierad efter merge:** ny stilmall `0324b3f60f876ee8.css`. Åre sist av 30, S-blocket
Saas-Fee → St. Anton → Sälen → Sölden, `--background:#121110` utan mörkt-läge-block, 27+3
flaggor och noll emoji. `scale(1.06)` finns kvar på precis ett ställe i sidan, och det är
hjältebilden.


## Vad som gjordes 21 september: delområden och vägen till intäkter

Tre PR:ar, alla mergade och verifierade live. Ingen migration — databasen är orörd
hela dagen.

### Delområdena var inte tre orter utan två (#61)

Punkt 5 sade att Chamonix, Grandvalira och Sälen väntade på en `sub_areas`-kolumn.
Kontrollen mot skiresort.com delar dem i två sorter, och ingen behöver en kolumn.

**Sälen och Chamonix är hopslagningar.** Våra 87 km i Sälen är två källposter,
Lindvallen/Högfjället 42 km och 58 liftar plus Tandådalen/Hundfjället 45 km och 48
liftar. Summan stämmer på kilometern och på liften. Våra 170 km i Chamonix är fyra
områden med buss emellan: Brévent–Flégère 56, Les Houches 55, Grands Montets 29,
Balme/Le Tour 29 = 169.

**Grandvalira och Riksgränsen är enkelposter** med exakt våra tal, 215 km och 75
liftar respektive 21 km och 6 liftar. Deras fråga gäller bara vad liftkortet täcker,
och den står redan i prisnoten. Beslutet från 25 augusti att inte ändra Grandvalira
till 308 km står kvar.

**Två fallhöjder som ingen backe har är rättade.** Sajten räknar fallhöjd som högsta
topp minus lägsta bas, vilket för en hopslagning korsar två fjäll. Sälen visade 315 m,
alltså Lindvallens topp minus Tandådalens bas, mot 308 som är den största riktiga.
Chamonix visade 2 807 m, som är Aiguille du Midi — en linbana med noll kilometer pist.
Störst pistad fallhöjd i dalen är Grands Montets 1 513 m. Följden på jämförelsesidorna
är att Chamonix går från störst till minst fallhöjd av de sju franska orterna, vilket
är rätt enligt definitionen: 2 130 m i Les 3 Vallées går att åka utan buss, 2 807 i
Chamonix gör det inte.

`fallhojd()` i `lib/delomraden.js` ersätter de nio ställen i fem filer som räknade topp
minus bas. Samma spärr som `harPris`: används den inte överallt säger ortsidan ett tal
och jämförelsesidan ett annat om samma ort. **Lägger du en ny yta som visar fallhöjd,
använd den.**

Listan ligger i kod och inte i databasen av samma skäl som `lib/liftkortspriser.js`:
den beskriver hur vårt tal är hopsatt, inte en egenskap hos orten.

**Rutan blev staplar efter att första utkastet underkändes.** Namnet till vänster och
talen till höger bröt olika beroende på namnlängd — två av fyra rader la talen i
vänsterkant. Nu är varje del en stapel som visar sin andel av ortens tal, vilket också
bär poängen: största delen av Chamonix är en tredjedel av de 170 kilometrarna. Texten
bröt tre regler i `docs/copy.md` (tankstreck som slutkläm, tal utan tusentalsmellanrum,
"lagda ihop" i stället för namn) och skrevs om. Höjdtalen på ortsidan grupperar nu
tusental på tolv ytor.

**Rättat i `docs/liftkortspriser.md`:** där stod att källan behandlar Sälen som en post.
Den har tre — Lindvallen/Högfjället, Tandådalen/Hundfjället och Näsfjället, som inte
ingår eftersom anläggningen inte är SkiStars.

### Sajten uppfyller nu tre krav den inte uppfyllde (#62, #63)

**Annonsmärkning i direkt anslutning till länken.** Marknadsföringslagen och
branschrekommendationen från IAB Sverige kräver att det framgår vid länken att den är
kommersiell. `rel="sponsored"` är en signal till Google som aldrig syns för läsaren, och
`/affiliate-disclosure` är inte i anslutning till någonting. Ordet Annons står nu vid
alla tre Booking-länkarna på ortsidan.

**Märkningen hänger på `hasAffiliateId`, inte på att länken går till Booking.** Samma
rekommendation säger att länkar utan kommersiellt samarbete inte ska märkas, eftersom de
inte är marknadsföring. Utan ID byggs en vanlig söklänk utan provision, och att kalla den
Annons vore osant. Allt tänds i samma deploy som spårningen — inget att komma ihåg.

**Rankningskriterierna går att nå.** Omnibusreglerna sedan 1 september 2022 kräver att
den som låter konsumenter söka digitalt redovisar vad som avgör ordningen, i ett eget
avsnitt direkt tillgängligt från resultaten. Underlaget låg i `docs/poangskala.md`, alltså
i repot. Nu finns **`/sa-jamfor-vi`**, länkad från `/jamfor`, från varje jämförelsesida och
från sidfoten. Den säger att listorna står i bokstavsordning och inte är en rangordning,
att tabellens markering är mekanisk, var siffrorna kommer ifrån, och att ingen ort kan
betala för placering. Den skriver också ut att poängen är jämförbara i topp och botten
men att mittfältet inte är genomgånget — poängskalan säger det om sig själv.

**Avsändaren står i sidfoten.** "Alpkoll drivs av Fabian Henningsson" plus mejladressen,
på varje sida. Lagen om elektronisk handel kräver namn och kontaktuppgift, och
marknadsföringslagen att avsändaren bakom marknadsföring går att identifiera. Uppgiften
försvann i #55, men det som togs bort då var en personlig text — Om oss är fortfarande
opersonlig. Adressen publiceras inte utan lämnas på begäran; skälet står i
`lib/kontakt.js`, dit kontaktadressen flyttade från två ställen.

**Integritetspolicyn** beskriver klicket när spårningen är på: att länken går via CJ,
drivet av Epsilon International UK Ltd, att IP-adress, webbläsaruppgifter, tidpunkt och
hänvisande sida skickas dit, att CJ själva är personuppgiftsansvariga, att behandlingen
sker i USA under standardavtalsklausuler och att uppgifterna sparas i upp till sex år.
Kakavsnittet säger att partnerlänkarna är vanliga länkar och att ingenting från partnern
laddas medan besökaren är kvar. **Det är skälet till att sajten slipper kakruta även med
affiliate inkopplat** — och det gäller bara så länge inget spårskript läggs på sidorna.

### CJ-kontot är uppsatt och väntar på Booking

**Booking.com går via CJ för nordiska partner**, inte via Partner Hub. Programmet heter
"Nordics Affiliate Programme powered by CJ". Det spräcker förutsättningen i
`lib/booking.js`, som bygger `?aid=`-länkar: **CJ spårar med egna länkar och koden måste
skrivas om** när länkarna finns. Be om en färdig länk och läs formatet innan något ändras.

Kontot är klart: namn, adress, SEK som kontovaluta, bankuppgifter och W-8BEN. Ansökan
till Booking-programmet ligger hos dem.

**Villkoren, lästa 21 september:**

- **4 % på hotellbokningar.** En skidvecka för 15 000 kr ger omkring 600 kr.
- **Referensperioden är ETT dygn**, inte trettio dagar. Bokar någon två dagar efter
  klicket ger det noll. Det gör placeringen viktigare än volymen: länken gör mest nytta
  där läsaren redan valt ort, alltså i "Var du bor"-kortet. **Motsägs av Welcome Pack**
  (22 september), som säger att programmet är "session based": provision bara om bokningen
  görs i samma webbläsarsession som klicket. Ofrågat hos `cj_booking@cj.com`.
- **EPC 9,05 EUR på tre månader**, alltså drygt en krona per klick vidare till Booking.
  Med nuvarande trafik blir det tiokronor i månaden. Inte ett skäl att låta bli — ett
  skäl att inte köpa trafik för att nå dit.
- **Provision betalas bara för materialiserade bokningar**, alltså när gästen bott där.
  En bokning i oktober för sportlovet betalas ut efter mars.
- **Hyrbil ger 6 %, flygplatstaxi 4 %, attraktioner 4 %.** Hyrbil betalar alltså mer än
  hotell. Restiden från flygplats till ort är redan uppmätt för alla trettio orterna, så
  det är den mest uppenbara utbyggnaden efter hotellänkarna.
- **Transparenskravet uppfylls** av knappetiketten, som sedan 22 september går till CJ
  som `sid` och kommer fram hos Booking i deras `label` (se 22 september).
- **Vilandeavgift på 10 dollar i månaden** efter sex sammanhängande månader utan
  bokning, dragen ur saldot tills det når noll. Ett tomt konto kan inte gå minus.

### Kontrollerat och avfärdat samma dag

- **Skidhyra funkar inte i Norden.** Skiset täcker Andorra, Frankrike, Italien, Schweiz,
  Spanien och Österrike — inga nordiska länder. I Sälen, Åre, Hemsedal och Trysil är
  uthyrningen SkiStars egen.
- **SkiStar har inget affiliateprogram.** Deras partnerskap är sponsring för 1,5–3
  miljoner kronor om året per ort.
- **Varken SJ eller Snälltåget har publikt program.** Omio betalar per omdirigering,
  `affiliates@omio.com`, svar inom 14 arbetsdagar. Det är vägen för nattågssidan.
- **Stripe behövs inte.** Sajten säljer ingenting.
- **Supabase ligger i eu-north-1**, verifierat mot AWS egen IP-lista. Det var den enda
  obekräftade uppgiften i integritetspolicyn, och den stämmer.
- **`hello@alpkoll.com` tar emot men skickar troligen inte.** MX pekar på ImprovMX
  (vidarebefordran), SPF finns, DMARC saknas. Utgående kräver deras betalplan eller
  "skicka som" via deras SMTP. **`alpkoll.se` har inga MX-poster alls** — post dit studsar.

### Meta-annonser: fråga Booking först

Bookings villkor förbjuder annonsering på tredjepartsplattformar "connected to our
affiliate product" och betald trafik som skickas direkt vidare. Att köpa Facebook-annonser
till redaktionellt innehåll är sannolikt tillåtet, men gränsen är otydlig nog att det är
värt ett mejl innan pengar läggs. Påföljden vid fel är att bokningar underkänns i efterhand.

Kostnaden i övrigt: CPC 3–15 kr och CPM 40–150 kr enligt byråernas prisguider, lägsta
vettiga dagsbudget 100–150 kr. Ett test på tre veckor landar kring 2 000–3 000 kr.
**En Metapixel kostar dessutom sajtens cookiefrihet** — med pixel krävs kakruta, omskriven
policy och ställningstagande om överföring till Meta.

**Tillägg 22 september.** Welcome Pack förbjuder publicisttypen "media buyer", alltså den
som köper klick och skickar dem mer eller mindre direkt till Booking. Annonser som för
läsare till Alpkolls innehåll är troligen tillåtna; annonser som leder rakt till en
Booking-länk, bär Bookings namn eller köper sökord med det är det troligen inte. **Som
intäktskälla går annonser inte ihop:** ett klick kostar 3–15 kr och ett klick vidare till
Booking ger i snitt drygt en krona, så varje annonskrona ger högst 7–35 öre tillbaka även
om alla klickar vidare. Pixeln ändrar inte den ekvationen. Rådet till Fabian: ett litet
tidsbegränsat test i oktober–december för att lära sig vad som fångar folk, utan pixel,
mätt med märkta länkar — inte för provisionen.

## Vad som gjordes 22 september: Booking-länkarna går via CJ

**Booking-programmet är godkänt**, relationen står som Active i CJ. Utgivar-ID:t är
101887836 och kontot 8078412.

**`lib/booking.js` bygger CJ:s klicklänk** för "Evergreen Link for Booking.com Nordics"
(link-ID 15734870): `https://www.jdoqocy.com/click-101887836-15734870?sid=<knapp>&url=<URL-kodad
booking.com-sökning>`. Formatet är avläst i CJ:s GET CODE efter att Destination Url ändrats,
och `sid` finns i widgetkoden i länkexporten. Bookings eget `aid` följer inte med — CJ
sätter sitt. Knappetiketten (`resort-stay-are` osv.) som förut gick till Bookings `label`
går nu till `sid`.

**Brytaren heter `SPARNING`** och står överst i filen. Satt till `false` byggs samma vanliga
söklänk som förut, och annonsmärkningen och CJ-styckena på `/privacy` och
`/affiliate-disclosure` släcks, eftersom allt hänger på `hasAffiliateId`.
`NEXT_PUBLIC_BOOKING_AID` används inte längre och kan tas bort i Vercel.

**Uppmätt i dev-servern:** St. Anton, Åre, Sälen och Madonna di Campiglio har tre
CJ-länkar var med rätt `sid`, noll länkar direkt till booking.com, noll `aid`, tre
Annons och `rel="noopener noreferrer sponsored"`. CJ-styckena syns på båda juridiska sidorna.

**Klicktestet** gjordes med Åres länk från "Var du bor", exakt som koden bygger den. Den
landade på Bookings sökning "Åre, Duved", 105 boenden, med
`label=affnetcj-15734870_pub-8078412_site-101887836_pname-Fabian Henningsson_clkid-resort-stay-are`
och `aid=1522412`. **Booking ser alltså kontot, webbplatsen och knappen.** Att en bokning
faktiskt ger provision går inte att visa utan en riktig bokning.

Ett första test samma dag med en handklistrad adress registrerades som ett klick i
Program Overview. Den adressen bar Bookings `aid=304142` och säger inget om länken
koden bygger.

**Priserna hos Booking visas i kronor** (`selected_currency: 'SEK'`, förut `'EUR'`), som
på resten av sajten. Prövat med webbläsaren först ställd på euro: efter klicket via CJ stod
hotellen i kronor och spårningen var densamma. Valutan överlever alltså omvägen, fast den inte
står kvar i Bookings slutadress vid varje besök.

### Bookings riktiga logga i "Var du bor"-kortet

Kortet visade "booking.com" satt i Bebas Neue, som bara har versaler, alltså en hemgjord
kopia av loggan. Bookings Brand Standards 2.1 (december 2020) säger uttryckligen "Don't try
to replicate with other font families". Nu står deras vita logga där, som oförändrad fil.

**Källan:** mappen "Booking.com Logo" i Booking.com Asset & Resource Hub
(`lion.app.box.com/s/0677aqd8nkav2zorz1jwdkj3m7sy97oy`). Dit länkar CJ-programmets
Welcome Pack som programmets "Content Hub". Samma fil, byte för byte, ligger i Bookings kit
för affiliatenätverk på partnerships.booking.com, tillsammans med Brand Standards.
`public/partner/booking-com-vit.png` är den vita PNG:n med den genomskinliga kanten
bortskuren; själva loggan är orörd.

**Reglerna som styr måtten:** vit logga på Booking Blue är ett av två godkända
huvudalternativ, minst 120 px bred på skärm, fritt utrymme runt om lika brett som
ett "o" (9,6 % av loggans bredd, 13 px vid 132 px), och loggan till höger om texten är
tillåten som avslutning i smala liggande banners. Booking Blue är `#003B95` — alla tre
knapparna på ortsidan hade den äldre `#003580` och bär nu `BOOKING_BLA` ur `lib/booking.js`.
`#003580` i `Flagga.js` är Finlands flagga och ska stå kvar.

**Uppmätt i dev-servern** på Madonna di Campiglio, längsta ortnamnet: loggan 132×22 px i
1440, 430 och 375 px bredd, fritt utrymme minst 20 px överallt, ingen horisontell scroll.
Vid 375 px blir texten bredvid 125 px bred och bryts på flera rader.

Welcome Pack säger ingenting om loggan, och inga uttryckliga användningsvillkor har hittats
— tillståndet är att programmet delar ut filen till sina publicister.

**Live verifierat efter båda mergarna:** alla 30 ortsidor har tre CJ-länkar med rätt `sid`,
tre Annons, noll direktlänkar till booking.com, loggan, `#003B95` och ingen `#003580`.
Fabian bekräftade själv att länkarna fungerar i en webbläsare utan annonsblockerare.

### Welcome Pack och annonsblockerare

**Welcome Pack** (24 sidor, "Booking.com Affiliate Program — CJ Affiliate", läst 22 september)
bekräftar djuplänkningen: CJ:s automatiska djuplänksverktyg fungerar inte för Booking, bara
Evergreen-länken går att djuplänka, adressen läggs på med `?url=` och egen spårning med
`sid=…&url=…` — exakt det `lib/booking.js` gör. `sid` beskrivs som ett fritt valt värde för
publicistens egen uppföljning. Programmet förbjuder webbläsartillägg, "media buyer", konton
som bara finns i sociala medier, sökmotor/widget, cashback och kupong. Bookings sökwidget
laddar ett skript från Booking och skulle kosta cookiefriheten — använd den inte.
Kontakt: `cj_booking@cj.com`. Content Hub: `lion.app.box.com/s/0677aqd8nkav2zorz1jwdkj3m7sy97oy`.

**Annonsblockerare stoppar CJ:s länkar.** uBlock Origin (EasyList och Peter Lowe's lista)
blockerar `||jdoqocy.com^`, och alla CJ:s klickdomäner står i samma listor. Besökaren får en
varningssida; "Fortsätt" går direkt till Booking utan spårning. Det är inget kodfel och det
finns ingen CJ-domän som slipper. Fabians vanliga Firefox har uBlock — testa spårningen på
mobilen eller i en annan webbläsare.

## Vad som gjordes 22–23 september: underlag för svenskägda boenden

Fabians idé: skriv om svenskägda hotell och B&B i Alperna och föreslå dem direktprovision
via länk eller rabattkod. Underlaget, med källa per boende, ligger i artefakten
https://claude.ai/artifact/MVNihjqVagrGUmZTsaVwZw. Inget är byggt i kod.

- **Åtta fristående boenden där en namngiven källa säger att ägaren är svensk:** Valluga
  (St. Anton), Hoheneck och Ski Lodge (Engelberg), The Lodge (Bad Gastein), Monterosa
  (Alagna), Seehof (Zell am See), Skiers Lodge (La Grave), Maison du Bez (Serre Chevalier).
- **Skandinaviskt drivna men inte uttryckligen svenska:** Millefiori (Valtournenche) och
  La Chaumière (Chamonix). **Svenska arrangörer med egna hotell:** STS Alpresor (elva, i
  Bad Gastein och Cervinia) och Langley (nio). Lion Alpin och Nortlander är danskägda.
- **Fyndet:** bara Valluga ligger på en ort med ortsida. De svenska ägarna sitter i
  Engelberg, Bad Gastein, Cervinia och Alagna, där Alpkoll inte har några orter.
- **Efterfrågan** enligt Googles sökförslag: "svenskt/svenskägt hotell alperna" och ortnamnen
  St. Anton, Chamonix, Cervinia, Alagna, Bad Gastein. Ingen volym är mätt.
- **Råd som gavs:** innehållet först, hotellen sedan med siffror i hand. Ta med alla
  svenskägda och märk de med avtal som annons, eftersom `/sa-jamfor-vi` lovar att ingen
  kan betala för placering. Att fakturera hotell direkt kräver troligen firma med F-skatt.

**Innehållsidéer i samma anda**, i rekommenderad ordning, med sökförslag som belägg: bil
till Alperna med kostnad från din stad (sträckorna finns i `lib/avresestader.js` på
`startsida-skiss`), direktflyg från Sverige plus transfer (hyrbil 6 %, taxi 4 %),
sportlovskrocken med tyska, nederländska och brittiska lov, sidan om svenskägda boenden,
svensk skidskola. Säsongsjobb har flest sökningar men fel målgrupp. "Vad kostar en öl" avråds:
priset går inte att belägga per ort.

## Vad som gjordes 23–24 september: knappar där besluten fattas

**18 av 30 ortsidor skickade Booking-klicken fel, live sedan 22 september.** Knapparna
sökte på `accommodation_zone`, som är skriven för läsaren. Provat i Bookings sökning
24 september: åtta orter gav Bookings startsida med `errorc_searchstring_not_found`
(Sälen, Chamonix, Hemsedal, Cortina, Myrkdalen, Les Arcs, Zermatt, Tignes) och nio fel
plats — Riksgränsen landade på Kiruna centralstation, Ischgl på grannbyn Mathon, Trysil,
Levi och Voss på ett enda boende. Nu söker knapparna på `BOOKING_SOK` i `lib/booking.js`,
en provad sträng per ort med antalet träffar i kommentaren. **Hemavan får ingen knapp**:
Booking har inga boenden där i någon stavning som provades. **Delområden faller**:
"Lindvallen" gav ett boende och "Tandådalen" inget, mot 44 för "Sälen".

**`app/Partnerlank.js` är den enda vägen ut till en partner.** Den bygger adressen, sätter
`rel`, ny flik, märkningen och spårningsnamnet `<sidtyp>-<placering>-<ort>` som CJ:s
`sid`. Ortsidans gamla namn (`resort-mobile-`, `resort-stay-`, `resort-sidebar-`) är
oförändrade. Ett nytt program läggs till i `PARTNERS` i samma fil.

**Knappar på fem nya sidtyper:**

| Sida | Vad | sid |
|---|---|---|
| Jämförelsesidan | "Boende i X och Y" efter resan, en knapp per ort | `jamfor-boende-<ort>` |
| Sälen/Åre eller Alperna | Boende i den svenska orten, plus länk till nattåget | `eller-alperna-boende-<ort>` |
| Sportlov | Åre, Sälen, Hemsedal och Trysil med veckans datum, lördag till lördag (`skidveckan`) | `sportlov-v<nr>-<ort>` |
| Nattåget | Boende i de fem orterna tåget når, under korten | `nattag-boende-<ort>` |
| Startsidan | Tre länkar före ortlistan, ingen provision | — |

**Klicktestat hela vägen:** `sportlov-v9-salen` via CJ landade på "Sälen: 44 boenden
hittade", 27 februari–6 mars, priser i kronor, och Bookings `label` bar
`clkid-sportlov-v9-salen`. **Vercel Analytics används inte för klicken** — egna händelser
finns inte på Hobby och Pro tar två egenskaper per händelse. CJ ser redan varje klick.

**Sökordsplaneraren i Google Ads** (Fabians konto, 23 september, utan annons igång, alltså
avrundade volymer): boende per ort är störst (Sälen och Åre 1 000–10 000 per variant,
"trysil boende" 1 000–10 000), liksom "skidort barn" och "sportlov 2027".
Jämförelsesökningar som "sälen eller åre" ligger på 10–100 eller under. Prognosen för en
annonskampanj gav 12,54 kr per klick — mer än tio gånger vad Booking betalar per klick.
Annonser lönar sig alltså inte.

**Partnerprogram att ansöka till**, enligt sökning 24 september: Sunweb via TradeTracker
("Sunwebresor.se – Vintersemester"), Skiset via Awin (5 %), Alps2Alps via Adtraction,
SnowTrex direkt, Kiwi.com via Travelpayouts (3 %), Omio via Impact eller Travelpayouts.
Skilink, Slopestar, Nortlander, Lion Alpin, Alpy och CheckYeti: inget program hittat.

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

**Checklistan är slut.** Den sista punkten — sportlovssidan hade bara h1 och inga h2 — är
avklarad 16 september i #56, se nedan. FAQ-punkten är avklarad 11 september, se ovan.

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

**5. Delområdena — avklarat 21 september, utan migration.** Punkten sade att tre orter
väntade på en `sub_areas`-kolumn. Kontrollen mot källan delade dem i två sorter i stället.

Sälen och Chamonix är **hopslagningar**: våra tal är summan av flera poster på
skiresort.com, och delarna hänger inte ihop med lift. Sälen är Lindvallen/Högfjället
42 km och Tandådalen/Hundfjället 45 km; Chamonix är fyra områden med buss emellan.
Grandvalira och Riksgränsen är **enkelposter** med exakt våra tal — deras fråga gäller
bara vad liftkortet täcker, och den står redan i prisnoten. Kolumnen behövdes alltså
inte alls; allt ligger i `lib/delomraden.js`.

**Två fallhöjder var fel och är rättade.** Sajten räknar fallhöjd som högsta topp minus
lägsta bas, vilket för en hopslagning korsar två fjäll. Sälen visade 315 m — Lindvallens
topp minus Tandådalens bas — mot 308 m som är den största riktiga. Chamonix visade
2 807 m, alltså Aiguille du Midi, en linbana med noll pist; störst pistad fallhöjd i dalen
är Grands Montets 1 513 m. Följden på jämförelsesidorna är att Chamonix går från störst
till minst fallhöjd av de sju franska orterna. Talen i databasen är orörda.

**Booking-länkarna via CJ — live sedan 22 september** (#65, #66), söksträngarna rättade
24 september, se de avsnitten. Kvar:
se riktiga klick med knappnamn i CJ:s rapporter, fråga `cj_booking@cj.com` om
referensperioden är en session eller ett dygn, och ta bort `NEXT_PUBLIC_BOOKING_AID` i
Vercel (oanvänd, skadar inte).

**Hyrbil och flygplatstaxi efter det.** Booking betalar 6 % på hyrbil och 4 % på
flygplatstaxi, mot 4 % på hotell. Restiden från flygplats till ort är uppmätt för alla
trettio orterna, så ytan finns redan — det som saknas är länkarna.

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

**Toppen på startsidan.** Frågan står under 13 september. Om oss är omskriven utan personliga uppgifter i #55, 15 september.

**Bilderna — lösta 11 september, utom Myrkdalen.** Hotlänkningen, den saknade
krediteringen och Verbiers GFDL-bild är borta; se ovan. Myrkdalens hjältebild är
fortfarande hotlänkad från skiresort.info och saknar belagd licens. Det finns inga
vinterbilder av orten på vare sig Commons eller Unsplash, så nästa steg är ortens egen
pressbank eller Fjord Norway — med villkoren lästa innan något används.

**Mobilmenyn** är en flikrad med tre ikoner — Skidorter, Jämför, Om oss. Där saknas både
Nattåget och Liftkortspriser. En fjärde flik är ett designval, inte en rättning.

**Kräver dig, inte kod:** redaktionella poäng för nya orter. Brevlådan
`hello@alpkoll.com` tar emot via ImprovMX, men att SKICKA därifrån är oprövat — det
behövs för mejlet till Omio.

**Svenskägt i Alperna — vilken innehållsidé som byggs först.** Underlaget står under
22–23 september. Om fler alporter ska in, där de svenskägda hotellen ligger, är en egen fråga.

**Avklarat 21 september:** Supabase-regionen är verifierad mot AWS IP-lista och
integritetspolicyns uppgift om eu-north-1 stämmer. Affiliate-ID:t är inte längre
uppskjutet — CJ-kontot är uppsatt och ansökan ligger hos Booking.

**Avklarat 22 september:** Booking-programmet godkänt och spårningen live på alla 30
ortsidor.

## Praktiskt

**Live-sidorna släpar en timme efter en migration.** Allt har `revalidate = 3600`.
En rättad siffra i Supabase syns inte direkt — sidorna förrenderades vid deployen.
**Mät `Age`-headern innan du felsöker något som ser orättat ut.** En merge tvingar fram en
omdeploy och därmed omrendering, så kör hellre SQL:en först och mergar sedan.

**Deploy går inte att köra härifrån i auto-läge.** `npx vercel --prod` blockeras av
auto-lägets klassificerare, vilket är en annan mekanism än behörighetslistan.

**Migrationer:** 29 filer i `supabase/migrations/`, alla körda och verifierade till och med
**029**. Fabian kör dem själv i Supabase SQL Editor; sessionen har bara anon-nyckeln — men
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

**Python finns inte på maskinen**, och `python` öppnar Microsoft Store-genvägen i stället för
att fela tydligt. Ett kommando som rör en fil med Python ser då ut att lyckas medan filen är
orörd — kontrollera utfallet, inte exitkoden. Node finns.

**`scripts/` ligger på grenen `startsida-skiss`, inte på `main`.** Skripten som mätte de
3 000 sträckorna med OSRM följde med skissen och har aldrig mergats. En engångsfil som
importerar ur `lib/` måste alltså läggas i en katalog som finns på grenen du står på, och
den måste ligga inuti repot — en `.mjs` i `%TEMP%` hittar inte `../lib/restider.js`.

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

**Peka ut vilket element som spiller över, inte bara att sidan gör det.** Sidans egen
`scrollWidth` säger ingenting när överflödet ligger i en ruta med `overflowX: auto` — sidan
ser hel ut medan innehållet är gömt inuti. Mät i stället varje element mot sin egen ruta:
`[...d.querySelectorAll('main *')].filter(e => e.scrollWidth > e.clientWidth + 1)`. Det gav
`DIV 420>278` på sportlovssidan 16 september, alltså 142 pixlar utanför skärmen, och noll
efteråt. Kör den mot före-versionen också — `git show main:<fil> > <fil>`, mät, `git checkout <fil>`.

**Wikimedia svarar 429 när dev-servern laddar om många bilder i rad.** Det är bildoptimeringen
som hämtar originalen igen, inte ett fel i koden. En ny laddning efter en stund gav noll fel.

**Byggcachen serverar gammal CSS.** En ändring i `app/globals.css` slog inte igenom
17 september: servern fortsatte leverera den gamla stilmallen under samma chunkhash. Varken
`touch` på filen eller en omstart av dev-servern hjälpte — bara `rm -rf .next` och omstart.
Ändringar i .js-filer hämtas om direkt; det är bara CSS:en som fastnar. Kontrollera vad
servern faktiskt skickar innan något rapporteras som klart:
`CSS=$(curl -s http://localhost:3000/ | grep -o '/_next/static/[^"]*\.css' | head -1)` och
sedan `curl -s "http://localhost:3000$CSS" | grep -o -- "--background:[^;]*"`.

**Webbläsarpanelens skärmbilder går inte att lita på.** De kommer tillbaka vita, svarta,
pixelidentiska med föregående ruta trots att sidan ändrats, eller med "Screenshot timed out
after 5s". Är panelen ihopfälld rapporterar sidan `innerWidth: 0` och varje bild blir tom.
17 september drogs två felaktiga slutsatser ur bilder som inte visade det aktuella
tillståndet — hover var bevisligen aktiv i DOM:en medan bilden visade det ohovrade läget.
Mät i DOM:en i stället: `getBoundingClientRect`, beräknade stilar, `elementsFromPoint`, och
diffa hela trädet med och utan hover. Hämta serverns HTML med `curl` när det gäller vad som
levereras. Går felet inte att mäta — be Fabian om skärmbilden, han ser ytan.
