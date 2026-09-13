# Skrivregler

Gäller all text på alpkoll.se: ortstexterna i databasen, sidorna i koden och
meningarna som räknas fram ur datan. Beslutade 13 september 2026, med
copygranskningen samma dag som underlag.

Hittar en kontroll något ska texten skrivas om. Reglerna skrivs inte om för
att en text ska klara dem.

## Facit

Nattågssidan. Den svarar på sökfrågan i första meningen: "Ja, det går tåg från
Sverige till Alperna." Sedan kommer stationerna, hållplatserna, skidtillägget i
kronor och det Snälltåget inte skriver ut. Den har nästan inga adjektiv och
säger aldrig att den är unik.

## Vem som talar

- **Ortstexter, frågor och jämförelser** skrivs i du-form utan synlig avsändare.
  "Tåget du vill ha avgår fredag 14.55", inte "vi rekommenderar fredagståget".
- **"Vi"** används bara när sajten redovisar ett eget beslut: "Vi visar inget
  liftkortspris för Levi än."
- **"Jag"** används bara på Om oss, där det är sant att sajten är en person.

## Omdömen

En text får säga rakt ut att en ort är fel val. Då ska tre saker stå med:

1. vem det gäller,
2. ett faktum som förklarar varför,
3. en annan ort på sajten att välja i stället.

> Vill du åka brant är Sälen fel val. Fallhöjden är 315 meter, minst av de
> svenska orterna här. Åre har 939.

Omdömet får aldrig säga emot poängen i `docs/poangskala.md`. Det gäller vem
orten passar, aldrig kvalitet: "fel ort om du vill åka brant" går bra, "tråkig
ort" gör det inte. Inga omdömen om enskilda hotell, restauranger eller företag.
Tonen är torr. "Fel val" räcker.

## Så byggs en text

- **Första meningen** svarar på det läsaren kom för: ska jag åka hit, vad
  kostar det, hur kommer jag dit.
- **Namn i stället för adjektiv.** Liften, nedfarten, byn, busslinjen. Varje
  nytt namn ska vara belagt, och källan står i migrationens kommentar.
- **Svensk referenspunkt.** Restid från svenska städer, sportlovsveckan, pris i
  kronor, jämförelse med Åre eller Sälen.
- **Råd i stället för stämning.** Var du bor för att slippa skidbussen, när
  snön i byn blir opålitlig.
- **Texten slutar när den är klar.** Ingen sista mening som sammanfattar.

## Tal

- Restider, priser och tidtabeller skrivs inte för hand i löptext. De hämtas ur
  datan (`lib/restider.js`, `lib/nattaget.js`, prisfälten), så att text och
  tal inte kan glida isär. Migration 023 och 027 rättade handskrivna tal som
  hade blivit fel.
- Tusentalsmellanrum: 2 807 m, inte 2807 m.
- En skillnad över hundra procent skrivs som gånger: "mer än sex gånger så
  mycket pist", inte "559 % mer".
- Superlativ kräver källa. "Mest snö i Norge" och "världens största
  skidområde" är orternas egen marknadsföring.

## Det här skrivs inte

| Mönster | Exempel som stod på sajten |
|---|---|
| Tankstreck som slutkläm | "byggda rakt in i sluttningen — praktiskt snarare än pittoreskt" |
| Bisats med ", vilket" | "Kallas Skandinaviens Alper, vilket är en överdrift men inte gripet ur luften" |
| X snarare än Y, inte X utan Y | "terrängen är mjuk snarare än dramatisk" |
| Tre i rad | "högt, funktionellt och utan charm" |
| Epitet och smeknamn | "Alpinismens huvudstad" |
| Rubriker som slogans | "Tjugo flikar. Noll svar." |
| Sajten om sig själv | "En sajt som bara berömmer hjälper ingen att välja." |
| Löften om stämning | "i november och december åker man i mörker under norrsken" |
| Branschord | destinationer, åretruntdestination, pärla, smultronställe |

Tankstreck får användas i sifferspann och för ett kort inskott mitt i en
mening. Som slutkläm stryks det.

## Framräknade meningar

En mening som räknas fram ur datan ska läsas som om den skrivits för just den
orten. Blir den identisk på alla orter i en grupp säger den ingenting om orten
och stryks. Villkorstext hör hemma i villkorsrutan, inte i ett svar.

## Kontroll före merge

Räkna mönstren i de ändrade texterna. JavaScripts `\b` räknar inte å, ä och ö
som bokstäver, så ordgränser skrivs med `\p{L}` och flaggan `u`. Med `\b`
missas till exempel "ökända".

```js
const monster = / — |, vilket|snarare än|(?<!\p{L})vykort/gu
```

Målet är noll träffar i ortstexter och rubriker.
