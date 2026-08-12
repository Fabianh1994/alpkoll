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

**Låga poäng skrivs ut.** Cervinia får 3 för bykänsla. Det är inte elakt, det är upplysning — och det är samma princip som att Zermatt är dyrt och Val Thorens ingen vykortsby.

**Där ett fält korrelerar nämns det.** Nybörjarpoängen ska inte motsäga `blue_percent`, och snösäkerheten ska inte motsäga `altitude_top`. Poängen är inte härledd ur fältet, men den får inte stå i strid med det.

**En poäng måste gå att belägga med en faktamening.** Kan motiveringen inte skrivas utan att beskriva den egna smaken hör poängen inte hemma på sajten. Kravet kostar ingenting extra, eftersom varje ytterlägespoäng ändå ska ha en motivering — se nedan.

Det är på det testet `scenery_score` föll (beslut 2026-08-10). "Dolomiterna är vackrare än Dalarna" är ett tycke, inte en upplysning. Kolumnen ligger kvar i databasen men renderas inte, och ska inte tas in. Bykänsla ligger nära i subjektivitet men klarar testet: *"belle époque-kurort med teater och balsal, byggd före liftarna"* är ett faktum om Bad Gastein oavsett vad läsaren tycker om saken.

## Motiveringarna

Poängen visas aldrig naken. Ett tal mellan 1 och 10 utan förklaring är ett påstående utan belägg.

**Motiveringen hör till orten, inte till paret.** "Cervinias by byggdes som liftanläggning och bebyggelsen får hård kritik" är sann oavsett vilken ort Cervinia ställs mot. Den skrivs en gång och används på varje jämförelsesida orten förekommer på. Därför kan den heller aldrig motsäga ett enskilt par.

**Text skrivs bara där den bär:** vid ytterlägen (3 eller lägre, 9 eller högre) och där ett par skiljer sig tre steg eller mer. En sjua mot en sexa behöver ingen förklaring.

Meningen som binder ihop de två orterna genereras ur talen. Motiveringarna är ortsfakta. Ingen av dem är skriven för ett visst par.

**Poängen avser samma sak som siffrorna: hela det sammankopplade området** — utom bykänsla och afterski, som handlar om byn.

## Skalorna

### Snösäkerhet
Sannolikheten att det finns bra snö under säsongen. Höjd, glaciär, konstsnö och läge.

- **10** Zermatt, Val Thorens — glaciär och åkning över 3 000 m
- **9** Tignes, Sölden, Saas-Fee, Verbier, Ischgl
- **7** normal alport utan glaciär
- **6** Sälen — 330–887 m, lägst på sajten

### Nybörjarnivå
Hur väl orten tar hand om någon som aldrig stått på skidor. Övningsområden, breda blå backar, skidskolor, och att man inte tvingas ner för något svårt för att ta sig hem.

- **10** Sälen — sajtens tydligaste nybörjarort, 45 % blå pist
- **9** Cervinia, Saalbach
- **6** normal alport
- **4** Chamonix — osammanhängande områden, brant, dåliga övningsbackar

### Mellannivå
Utbudet för den som åker blått och rött obehindrat men inte söker det branta. Det här är de flesta.

- **10** Courchevel, Val Thorens, Cervinia
- **8** normal stor alport
- **6** små orter med begränsad variation

### Avancerad nivå
Pistad svår åkning: branta svarta, längd, fallhöjd. Skiljs från offpist med flit.

- **10** Chamonix, St. Anton, Verbier, Zermatt
- **7** normal alport
- **3** Cervinia — närmast ingenting för den vane, trots områdets storlek

### Offpist
Åkning utanför pist: terräng, tillgänglighet, guidekultur, snömängd.

- **10** Chamonix, St. Anton, Verbier, Zermatt
- **9** Myrkdalen, Riksgränsen, Tignes
- **6** normal alport
- **4** Val Gardena — pistparadis, inte pudermål

### Snowpark
Hoppens och railsens kvalitet och underhåll.

- **9** Val Thorens
- **8** Saalbach (Nitro Snowpark Leogang), Livigno, Courchevel, Tignes
- **6** normal alport
- **5** orter med park mest på pappret

### Bykänsla
Hur byn känns att vistas i när skidorna är av. Arkitektur, gatuliv, om platsen fanns före liftarna.

- **10** Zermatt, Cortina d'Ampezzo, Kitzbühel
- **9** Bad Gastein (belle époque), Val Gardena, Chamonix
- **6** funktionell ort
- **5** Tignes — byggd som anläggning
- **3** Cervinia — byn saknar charm, bebyggelsen är hårt kritiserad

### Afterski
Hur mycket som händer från liftstopp och framåt.

- **10** Ischgl, St. Anton
- **9** Saalbach, Kitzbühel, Mayrhofen, Sölden
- **7** normal alport
- **5** Val Gardena — kvällen tillbringas vid matbordet, inte i baren

### Familjevänligt
Barnens perspektiv: skidskola, avstånd, om man kan bo nära backen, om orten är byggd för barn.

- **10** Sälen
- **9** Saalbach, Courchevel
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

**Kvar att avgöra:** om `family_friendly_score` avser området eller byn. Skalan beskriver den med ord som handlar om byn, men undantaget ovan räknar bara upp bykänsla och afterski. Frågan är skarp för Les 3 Vallées, där Courchevel står på 9 och Méribel och Val Thorens på 7 för samma backar.

**Fältet som inte hör hit men hänger ihop:** `avg_snowfall_cm` visas inte längre någonstans. Mätningen 2026-08-12 mot skiresort.com — sajtens enda källa — visar att den inte bär någon säsongssiffra alls, bara aktuellt snödjup; kontrollerat på både Sölden och Åre. Talen kan därmed inte komma därifrån och går inte att kontrollera mot något. Fördelningen pekade åt samma håll: alla 30 publicerade värden delbara med tio, elva unika tal bland trettio. Kolumnen ligger kvar i databasen — orter döljs och fält slutar visas, ingetdera raderas.
