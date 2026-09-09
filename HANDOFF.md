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

## Vad som väntar

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

**4. Sportlovssidan — nästa sida att bygga.** Vilken skidort är billigast just ditt läns
sportlovsvecka? Svenskt sportlov ligger v.7–v.10 beroende på län, och frågan har inget svar
någonstans på internet. Kräver svensk skolkalender krossad mot ortens prislista — två
datamängder ingen utom en svensk sajt sätter ihop.

Halva underlaget finns: v9 är referensvecka i prisdatan, och Snälltågets enda
Stockholmsavgång går 26 februari 2027, som är Stockholms sportlov. Det som saknas är länens
veckor och pris för fler veckor än v9 — det senare hämtas ändå i oktober.

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
