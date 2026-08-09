# Alpkoll

Svensk jämförelsesajt för skidorter. Next.js 16 på Vercel, data i Supabase, live på **alpkoll.se**.

## Språk

Sajten körs enbart på svenska. `alpkoll.com` redirectar permanent till `.se` (`next.config.mjs`).

Engelskan är inte borttagen — `dictionaries/en.json`, `LangContext` och `useDictionary` ligger kvar, och `lib/lang.js` beskriver vägen tillbaka. Nya texter skrivs hårdkodat på svenska, som i `app/layout.js`.

**Skidsvenska, inte översatt engelska.** Offpist, fallhöjd, afterski, blå/röd/svart. Där svenskan saknar ord behålls det engelska — snowpark heter snowpark.

**Etiketten ska peka åt samma håll som skalan.** `crowd_score` är högt när det är lite folk, därför heter fältet "Gott om plats" och inte "Trängsel".

**Inga löften vi inte kan hålla.** "Snögaranti" betyder i svensk resebransch pengarna tillbaka. Poängen heter "Snösäkerhet".

**Nackdelar skrivs ut.** Zermatt är dyrt, Val Thorens är ingen vykortsby, Kitzbühel lutar sig mot konstsnö. En jämförelsesajt som bara berömmer hjälper ingen att välja.

## Data

**En källa för alla orter: skiresort.com.** Orternas egen marknadsföring anger ofta högre tal, men blandade källor gör orterna ojämförbara — och poängsättningen i planeraren vilar på siffrorna.

**Pist, liftar och höjder avser hela det sammankopplade området.** `ski_area` namnger det, så att tre orter i Les 3 Vallées kan visa identiska tal utan att se ut som ett fel. Prisavtal som Dolomiti Superski och Paradiski är inte skidområden och hör hemma i texten.

**`nearest_airport` betyder "porten hit", inte "närmast".** Flygplatsen ska gå att boka från Sverige med rimlig anslutning; direktflyg krävs inte.

**Lagra språkneutralt.** Månader är heltal 1–12 och renderas i `lib/months.js`. Landsnamn står kvar på engelska i databasen eftersom de används som nycklar, och översätts i `lib/countries.js`.

**Mät, gissa inte.** `transfer_minutes` är uppmätt restid från flygplatsen — samma innebörd för alla orter, annars blir fältet ojämförbart. Att bilen eller nattåget är den verkliga vägen till nordiska orter bärs av `transport_info`.

**Orter döljs, raderas aldrig.** `published = false` behåller rader, poäng och bilder.

Migrationer ligger i `supabase/migrations/` och körs för hand i Supabase SQL Editor. Varje fil börjar med en tom rad, eftersom kopiering ibland tappar första tecknet.

## Kod

Formspråket är inline style-objekt, inte Tailwind-klasser, trots att Tailwind finns installerat. Följ omgivningen.

Palett: `#121110` bakgrund, `#1c1a17` kort, `#D4A574` accent, `#f0ece4` text. Typsnitt via `var(--font-heading)` och `var(--font-body)`.

**Härled inte tillstånd ur översatt text.** Landsfiltret jämförde mot etiketten med startvärdet hårdkodat till `'All'`; när etiketten blev `'Alla'` visade startsidan noll orter. Använd sentinelvärden som `ALLA_LANDER`.

**Datan hämtas på servern.** `lib/resorts.js` filtrerar på `published` på ett ställe, så startsida, ortsidor, planerare och sitemap inte kan visa olika urval.

**Bilder optimeras bara när vi får kopiera dem** — se `lib/images.js`. Fyra ortbilder hotlänkas från andra företag och ska bytas.

Utgående partnerlänkar har `rel="sponsored"` och byggs i `lib/booking.js`, som är overksam tills `NEXT_PUBLIC_BOOKING_AID` är satt.
