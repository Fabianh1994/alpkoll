# Poängskalan

De tio poängen 1–10 på ortsidorna är redaktionella omdömen, inte mätvärden. Det gör dem inte godtyckliga — men det betyder att de bara har mening **i förhållande till varandra**. En sjua säger ingenting; en sjua *bredvid Zermatts tia* säger något.

Det här dokumentet finns för att en poäng satt i dag ska betyda samma sak som en poäng satt om ett år.

## Varför skalan skrevs om

Granskning 2026-08-10 av de 32 dåvarande orterna visade att ytterlägena var genomtänkta men mitten satt på autopilot:

| Poäng | Vanligaste värdet | Antal orter | Använt spann |
|---|---|---|---|
| Nybörjare | 6 | 14 av 32 | 4–8 |
| Snowpark | 7 | 14 av 32 | 5–9 |
| Familjevänligt | 7 | 14 av 32 | 5–9 |
| Mellannivå | 8 | 15 av 32 | 6–10 |

Ungefär hälften av orterna låg på ett enda standardvärde per poäng, och toppen av flera skalor stod tom. Sälen — den mest nybörjarinriktade orten på sajten — hade 8 för nybörjare och delade den platsen med Courchevel.

Konsekvensen är att en genomtänkt sjua hamnar bredvid en slentriansjua, och läsaren tror att hon jämför två bedömningar.

## Reglerna

**Ankare, inte känsla.** Varje poäng har namngivna orter i topp och botten. En ny ort placeras genom att jämföras med dem, aldrig mot en abstrakt tia.

**Hela skalan används.** Om ingen ort är en tia är skalan en niogradig skala med en tom ruta. Är en ort bäst i materialet på något får den tio.

**Låga poäng skrivs ut.** Les Deux Alpes får 4 för bykänsla. Det är inte elakt, det är upplysning — och det är samma princip som att Zermatt är dyrt och Val Thorens ingen vykortsby.

**Där ett fält korrelerar nämns det.** Nybörjarpoängen ska inte motsäga `blue_percent`, och snösäkerheten ska inte motsäga `altitude_top`. Poängen är inte härledd ur fältet, men den får inte stå i strid med det.

**En poäng måste gå att belägga med en faktamening.** Kan motiveringen inte skrivas utan att beskriva den egna smaken hör poängen inte hemma på sajten. Kravet kostar ingenting extra, eftersom varje ytterlägespoäng ändå ska ha en motivering — se nedan.

Det är på det testet `scenery_score` föll (beslut 2026-08-10). "Dolomiterna är vackrare än Dalarna" är ett tycke, inte en upplysning. Kolumnen ligger kvar i databasen men renderas inte, och ska inte tas in. Bykänsla ligger nära i subjektivitet men klarar testet: *"belle époque-kurort kring varma källor och Gasteinfallet, som rinner genom centrum, med Grand Hotel de l'Europe från 1906–1909"* är ett faktum om Bad Gastein oavsett vad läsaren tycker om saken. (Här stod tidigare "med teater och balsal", som ingen källa belägger; rättat 2026-11-18 efter granskningen av omgång 2.)

## Motiveringarna

Poängen visas aldrig naken. Ett tal mellan 1 och 10 utan förklaring är ett påstående utan belägg.

**Motiveringen hör till orten, inte till paret.** "Cervinia byggdes ut kring linbanan från 1936 och på höjden under 1960-talet" är sann oavsett vilken ort Cervinia ställs mot. Den skrivs en gång och används på varje jämförelsesida orten förekommer på. Därför kan den heller aldrig motsäga ett enskilt par.

**Text skrivs bara där den bär:** vid ytterlägen (3 eller lägre, 9 eller högre) och där ett par skiljer sig tre steg eller mer. En sjua mot en sexa behöver ingen förklaring.

Meningen som binder ihop de två orterna genereras ur talen. Motiveringarna är ortsfakta. Ingen av dem är skriven för ett visst par.

**Poängen avser samma sak som siffrorna: hela det sammankopplade området** — utom bykänsla, afterski och familjevänligt, som handlar om byn.

Familjevänligt lades till undantaget 2026-11-18 (granskningen av omgång 2, beslut A). Skalan beskriver poängen med ord om byn, och källorna skiljer byar i samma område åt: Lech-Zürs och St. Anton delar Ski Arlberg men inte barnens vardag. Nybörjarnivå avser fortsatt området, eftersom den ska stämma med `blue_percent`. Les 3 Vallées behöver ingen ändring: Courchevel 9 och Méribel och Val Thorens 7 är byarnas olika omdömen.

## Skalorna

### Snösäkerhet
Sannolikheten att det finns bra snö under säsongen. Höjd, glaciär, konstsnö och läge.

- **10** Zermatt, Val Thorens — pist på glaciär över 3 800 m (Zermatt, 3 899 m) eller en by över 2 200 m med pisterna mellan husen (Val Thorens, 2 300 m)
- **9** Tignes, Sölden, Saas-Fee, Verbier, Ischgl — glaciär eller åkning över 3 000 m räcker hit, inte till tian
- **7** normal alport utan glaciär
- **6** Sälen — 572–887 m, lägst på sajten

Ankaret för tian skärptes 2026-11-18 (granskningen av omgång 3). Där stod
tidigare "glaciär och åkning över 3 000 m", vilket också Tignes (Grande
Motte-glaciären, 3 456 m) uppfyller utan att vara en tia, och vilket Val
Thorens, som saknar glaciär, inte uppfyller. Les Deux Alpes (glaciär,
3 523 m, byn på 1 650 m) får därför 9. Toppen räknas bara där det finns
pist: Chamonix 3 842 m är Aiguille du Midi.

### Nybörjarnivå
Hur väl orten tar hand om någon som aldrig stått på skidor. Övningsområden, breda blå backar, skidskolor, och att man inte tvingas ner för något svårt för att ta sig hem.

- **10** Sälen — sajtens tydligaste nybörjarort, 45 % blå pist
- **9** Alta Badia, Saalbach — Alta Badia 57 % blå pist, nästan hela området nås via lätta nedfarter
- **6** normal alport
- **4** Chamonix — osammanhängande områden, brant, dåliga övningsbackar

### Mellannivå
Utbudet för den som åker blått och rött obehindrat men inte söker det branta. Det här är de flesta.

- **10** Courchevel, Val Thorens
- **9** Val Gardena — mest röd pist, kabinbanor ut på Sellaronda åt båda hållen
- **8** normal stor alport
- **6** små orter med begränsad variation, Engelberg — pisterna delas av Titlis och Jochstock

### Avancerad nivå
Pistad svår åkning: branta svarta, längd, fallhöjd. Skiljs från offpist med flit.

- **10** Chamonix, St. Anton, Verbier, Zermatt
- **7** normal alport
- **4** Alta Badia — två svåra nedfarter, Gran Risa och Vallon

### Offpist
Åkning utanför pist: terräng, tillgänglighet, guidekultur, snömängd.

- **10** Chamonix, St. Anton, Verbier, Zermatt, Engelberg — från Laubersgrat går Laub ner mot Gerschnialp, och fler nedfarter utanför pist nås med lift från Titlis och Jochstock
- **9** Myrkdalen, Riksgränsen, Tignes
- **6** normal alport
- **4** Val Gardena, Alta Badia — åkning utanför pist är förbjuden, i Val Gardena utom i tre freerideområden med guide

### Snowpark
Hoppens och railsens kvalitet och underhåll.

- **10** Laax — fyra parker och en superpipe vid Crap Sogn Gion, och inomhushallen Freestyle Academy vid dalstationen
- **9** Val Thorens
- **8** Saalbach (Nitro Snowpark Leogang), Livigno, Courchevel, Tignes
- **6** normal alport
- **5** orter med park mest på pappret
- **4** Engelberg — Titlis-området har ingen snowpark eller halfpipe, bara en bana med vågor och doserade kurvor vid Jochpass

### Bykänsla
Hur byn känns att vistas i när skidorna är av. Arkitektur, gatuliv, om platsen fanns före liftarna.

- **10** Zermatt, Cortina d'Ampezzo, Kitzbühel
- **9** Bad Gastein (belle époque-kurort kring Gasteinfallet), Val Gardena, Chamonix
- **6** funktionell ort
- **5** Tignes — byggd som anläggning
- **4** Cervinia, Les Deux Alpes — Cervinia byggdes ut kring linbanan från 1936 och på höjden under 1960-talet

### Afterski
Hur mycket som händer från liftstopp och framåt.

- **10** Ischgl, St. Anton
- **9** Saalbach, Kitzbühel, Mayrhofen, Sölden
- **7** normal alport
- **6** Val Gardena, La Plagne — Ski Club GB ger 2/5, men skiresort ger 4/5 och namnger barerna i byarna
- **5** Alta Badia, Serre Chevalier — i Alta Badia slutar afterskin på berget med sista nedfarten, och kvällarna i byarna är lugna

### Familjevänligt
Barnens perspektiv: skidskola, avstånd, om man kan bo nära backen, om orten är byggd för barn.

- **10** Sälen
- **9** Courchevel
- **8** Saalbach — barnområde i varje by, men Saalbach by är utdragen och bullrig på eftermiddagen
- **7** normal alport
- **5** orter där barn är möjligt men inte tänkt

### Gott om plats
**Högt värde betyder färre människor.** Etiketten pekar åt samma håll som skalan — se CLAUDE.md.

- **9** Myrkdalen
- **8** Hemavan, Riksgränsen, Ruka
- **6** normal alport
- **4** Ischgl, Kitzbühel, Chamonix, Val Gardena — Sellaronda-rundan proppar igen

### Maten på berget
Serveringarna i backen: utbud, kvalitet, om man äter för att orka vidare eller för matens skull. Ligger i `dining_score`, som funnits ifylld sedan sajten byggdes utan att någonsin renderas.

Poängen skiljer Norden från Alperna tydligare än någon annan — nordiska orter ligger på 4–6, alporter på 6–10 — och det är en skillnad läsaren märker första dagen.

- **10** Courchevel — stjärnkrogar i backen
- **9** Cortina d'Ampezzo, Zermatt, Val Gardena
- **7** normal alport
- **5** Sälen, Riksgränsen, Myrkdalen, Ruka
- **4** Hemavan — en handfull serveringar

### Resan från Sverige
**Ny poäng, och den enda av de tolv som ingen annan skidsajt har.** Hur lätt orten är att nå från Sverige: avgångar som faktiskt går att boka, om nattåget eller bilen räcker, hur krånglig sista biten är.

Poängen ersätter inte `transfer_minutes`, som bara mäter flygplats → ort och därför inte går att jämföra mellan Norden och Alperna. Den befintliga `public_transport_access` mäter något annat — lokal kollektivtrafik — och duger inte: Sälen står som `false` trots bussar från Stockholm.

- **9** Åre (nattåg sju timmar från Stockholm, direktflyg till Östersund), Sälen (fyra och en halv timme med bil)
- **8** Trysil, St. Anton (nattåg från Malmö, annars Innsbruck), Chamonix (Genève på 75 min, direktbussar)
- **6** normal alport med flyg plus två timmars transfer
- **5** Val Thorens, Zermatt — tre timmar eller mer från flygplatsen
- **4** Riksgränsen, Levi, Ruka — långt norrut, få avgångar
- **3** Livigno — Bergamo plus tre och en halv timme över ett pass som kan stängas

## Att göra

Skalan är skriven mot de fyra nya orterna (Saalbach, Cervinia, Val Gardena, Bad Gastein). **De befintliga är ännu inte omsatta enligt den** — de nämns här som ankare där deras nuvarande poäng är rätt, men mittfältet ligger kvar orört. Tills det arbetet är gjort är poängen jämförbara i topp och botten, inte i mitten.

**Migration 014 är körd 2026-08-12 och verifierad mot databasen.** Efterkontrollen i migrationen fångade en ort som föll bort när den skrevs: Tignes har 55 % blå pist och stod kvar på 5 för nybörjare. Den rättas i migration 015 till 7, samma värde som Voss fick vid identisk blå andel.

Migration 014 rättade det som gick att belägga, och bara det: Sälen till 10 på båda skalorna, de tre orter vars nybörjarpoäng stred mot en blå andel över hälften (Hemsedal 67 %, Voss 55 %, Sölden 52 %), och Les 3 Vallées, där Courchevel, Méribel och Val Thorens bar tre olika omdömen om samma pister. Resten av mittfältet står kvar — 120 nya omdömen utan källa hade varit samma arbetssätt som skapade problemet.

**Avgjort 2026-11-18:** `family_friendly_score` avser byn, se undantaget under Motiveringarna. Frågan var skarp för Les 3 Vallées, där Courchevel står på 9 och Méribel och Val Thorens på 7 för samma backar; de står kvar.

**Fältet som inte hör hit men hänger ihop:** `avg_snowfall_cm` visas inte längre någonstans. Mätningen 2026-08-12 mot skiresort.com — sajtens enda källa — visar att den inte bär någon säsongssiffra alls, bara aktuellt snödjup; kontrollerat på både Sölden och Åre. Talen kan därmed inte komma därifrån och går inte att kontrollera mot något. Fördelningen pekade åt samma håll: alla 30 publicerade värden delbara med tio, elva unika tal bland trettio. Kolumnen ligger kvar i databasen — orter döljs och fält slutar visas, ingetdera raderas.

**Avgjort 2026-11-18 (granskningen av omgång 4):** Cervinia delar skiresort-post och `ski_area` med Zermatt, Matterhorn Ski Paradise, och bär därför Zermatts områdesbetyg: nybörjare 6, mellannivå 9, avancerad 10. Ankarna som hade Cervinia på nybörjare 9, mellannivå 10 och avancerad 3 beskrev den italienska sidan för sig, som Ski Club GB gör, och gick inte att förena med regeln att poängen avser hela området. De är utbytta: nybörjare 9 Alta Badia, mellannivå 10 utan Cervinia, avancerad 4 Alta Badia. Att det mesta av pisten från Cervinia är blå och röd står i ortstexten som råd om var du bor, inte i poängen.

Bykänsla för Cervinia är 4, inte 3. Platsen var en klätterby med hotell före liftarna, och den gamla motiveringen ("byggdes som liftanläggning", "hårt kritiserad") bars bara delvis av källorna. Afterski-ankaret 5 flyttades från Val Gardena till Alta Badia: Ski Club GB ger båda 2/5, men skiresort ger Val Gardena 4/5 och Alta Badia 3/5, samma skillnad som gav La Plagne 6 och Serre Chevalier 5 i omgång 3.

**Avgjort 2026-11-18 (granskningen av omgång 5):** Snowpark fick sin första tia. Laax har fyra parker, en superpipe och en inomhushall, och tre oberoende källor (skiresort, Ski Club GB, inthesnow) beskriver det som det största freestyleutbudet; Val Thorens står kvar på 9. Engelberg blir ankare för 4 i stället för 3: skiresort skriver att Titlis saknar park, men Iglu räknar en, och ett ytterläge kräver mer än en källa när en annan säger emot (samma regel som offpist för Alta Badia i omgång 4). Offpist 10 får en femte ort, Engelberg, med Laub och Galtiberg som Ski Club GB och Powderhounds kallar världsklass.

Mellannivå 9 kräver mer än Ski Club GB 5/5. Laax och St. Moritz har båda det betyget men får 8, som Tignes med samma betyg och mer pist. Nian bärs av Val Gardena, som når hela Sellaronda med lift, och av Zermatt.

Snösäkerhet 9 gäller också glaciärorter med låg by: Laax (1 100 m, 37 % konstsnö) och Engelberg (1 003 m, 40 %) uppfyller ankarets ordalydelse. Den svagare snön på dalnedfarterna står i ortstexten, inte i poängen. Frågan om ankaret bör kräva något om byns höjd är ett ägarbeslut.
