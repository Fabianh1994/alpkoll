
-- (Raden ovan är avsiktligt tom: tappas första tecknet vid kopiering
--  spelar det då ingen roll.)
-- 007 · Österrike — siffror, restid och svensk text
--
-- Omgång 2 tar Österrikes fem orter samlat: samma flygplats, och fyra av
-- dem nås av Snälltågets nattåg, så resonemanget blir konsekvent.
--
-- Siffror från skiresort.com, samma källa som omgång 1.
-- Störst avvikelse: Mayrhofen stod som 27 liftar där området har 61.
--
-- Snälltåget kör Malmö–Österrike 18 dec 2026 till 14 mars 2027, med
-- anslutningståg från Stockholm, Norrköping, Linköping, Nässjö och
-- Alvesta. Av Alpkolls orter når tåget Sölden, St. Anton, Ischgl och
-- Mayrhofen. Kitzbühel finns inte i deras destinationslista, och därför
-- nämns tåget inte i den ortens text — jag påstår inget om vad som inte
-- går, bara om det som gör det.

begin;

-- ── Sölden ─────────────────────────────────────────────────────────
update public.resorts set
  total_pistes_km = 146, total_lifts = 31,
  season_end_month = 5,
  transfer_minutes = 75, transfer_note = 'med bil från Innsbruck',
  notes = 'Två glaciärer gör Sölden till en av Alpernas mest snösäkra orter — säsongen sträcker sig från oktober till maj. 146 kilometer pist och tre toppar över 3 000 meter. Orten är lika känd för sitt uteliv som för åkningen. Byn längs dalgången är mer funktionell än vacker; hit åker man för snön, inte för vykorten.',
  where_to_stay = 'Sölden sträcker sig längs dalen med hotell och lägenheter utmed huvudgatan. Närmast åkningen bor du kring Giggijochbahn eller Gaislachkoglbahn, områdets två stora ingångar. Hochsölden ligger högre upp, är mindre och lugnare, och har pisten direkt utanför dörren. Vill du ha stillsammare kvällar finns mindre byar längre in i Ötztal.',
  transport_info = 'Flyg till Innsbruck, drygt en timme med bil. Snälltågets nattåg från Malmö går till Österrike vintertid med anslutning hit, vilket gör resan möjlig utan flyg.'
where slug = 'solden';

-- ── St. Anton ──────────────────────────────────────────────────────
update public.resorts set
  ski_area = 'Ski Arlberg',
  total_pistes_km = 300, total_lifts = 85,
  transfer_minutes = 90, transfer_note = 'med bil från Innsbruck',
  notes = 'Österrikes största sammanhängande skidområde, där St. Anton hänger ihop med Lech, Zürs och Warth via 300 kilometer pist. Orten har rykte om sig att vara brant och krävande, och offpisten är det många kommer för. Afterskin är lika omtalad som backarna — Mooserwirt börjar redan vid tretiden.',
  where_to_stay = 'St. Anton är kompakt och det mesta ligger inom gångavstånd från Galzigbahn. Nasserein i utkanten är lugnare, passar familjer och har egen lift in i området. Vill du ha det stillsammare bor du i St. Christoph eller Stuben, båda på samma liftkort. Lech och Zürs på andra sidan Arlbergpasset är dyrare och mer eleganta.',
  transport_info = 'Flyg till Innsbruck, cirka 1,5 timme med bil, eller Zürich på drygt 2,5 timmar. Tåget stannar mitt i St. Anton, som ligger på Arlbergbanan. Snälltågets nattåg från Malmö går hit vintertid — en av få alporter du når från Sverige helt utan flyg.'
where slug = 'st-anton';

-- ── Ischgl ─────────────────────────────────────────────────────────
update public.resorts set
  ski_area = 'Silvretta Arena',
  total_pistes_km = 239, altitude_base = 1360,
  season_start_month = 11,
  transfer_minutes = 90, transfer_note = 'med bil från Innsbruck',
  notes = 'Österrikes mest ökända partyort, med afterski som drar igång på berget vid fyra och håller på långt efter midnatt. 239 kilometer högt belägen pist ihopkopplad med schweiziska Samnaun, och pålitlig snö från november till maj. Det här är inte orten för den som vill ha lugn och ro.',
  where_to_stay = 'Bo i själva Ischgl — allt ligger inom gångavstånd och tre gondoler går direkt från huvudgatan. Hotellen spänner från femstjärnigt till prisvärda pensionat. Mathon och Galtür är lugnare och billigare, en kort bussresa bort. Samnaun på schweiziska sidan är tullfritt, vilket märks på priserna i butikerna.',
  transport_info = 'Flyg till Innsbruck, ungefär 1,5 timme med bil. Närmaste tågstation är Landeck-Zams med halvtimmesbuss till Ischgl. Snälltågets nattåg från Malmö når orten vintertid. Gratis skidbussar trafikerar hela Paznaundalen under säsongen.'
where slug = 'ischgl';

-- ── Kitzbühel ──────────────────────────────────────────────────────
update public.resorts set
  ski_area = 'KitzSki',
  total_pistes_km = 188, total_lifts = 58,
  season_start_month = 11,
  transfer_minutes = 75, transfer_note = 'med bil från Innsbruck',
  notes = 'En medeltida stad snarare än en byggd skidort, med gågator och färgade fasader. KitzSki har 188 kilometer pist men når bara 2 000 meter, vilket gör snön mindre säker än i högre orter — konstsnö är regel snarare än undantag. Hahnenkammloppet i januari är alpina världscupens mest fruktade nedfart.',
  where_to_stay = 'Den gamla stadskärnan är själva poängen: bor du innanför stadsportarna har du restauranger och butiker utanför dörren, men en kort bussresa till liftarna. Närmast åkningen bor du vid Hahnenkammbahn. Kirchberg några kilometer bort är billigare och har egen infart till samma område.',
  transport_info = 'Flyg till Innsbruck eller Salzburg, båda drygt en timme med bil. Kitzbühel har egen tågstation med direktförbindelser från München och Wien.'
where slug = 'kitzbuehel';

-- ── Mayrhofen ──────────────────────────────────────────────────────
update public.resorts set
  ski_area = 'Mountopolis',
  total_pistes_km = 142, total_lifts = 61,
  transfer_minutes = 60, transfer_note = 'med bil från Innsbruck',
  notes = 'Zillertals mest kända ort, med 142 kilometer pist fördelad på flera berg under samlingsnamnet Mountopolis. Här finns Harakiri, Österrikes brantaste preparerade nedfart med 78 procents lutning. Byn ligger lågt, på 630 meter, så snön nere i dalen är opålitlig — åkningen sker uppe på Penken och Ahorn.',
  where_to_stay = 'Mayrhofen är en riktig by med liv året om, och det mesta ligger inom gångavstånd från de två stora gondolerna Penkenbahn och Ahornbahn. Penkenbahn är den du använder mest. Hippach några minuter bort är lugnare och billigare, med egen lift in i samma område.',
  transport_info = 'Flyg till Innsbruck, knappt en timme med bil. Zillertalbahn går från Jenbach på huvudlinjen ända in till Mayrhofen, så tåget hela vägen fungerar. Snälltågets nattåg från Malmö når Mayrhofen vintertid.'
where slug = 'mayrhofen';

commit;

-- ── Kontroll ────────────────────────────────────────────────────────
--   select slug, ski_area, total_pistes_km, total_lifts,
--          transfer_minutes, left(notes, 50)
--   from public.resorts where country = 'Austria' order by slug;
--
-- Antal publicerade orter med engelsk text kvar (ska bli 22):
--   select count(*) from public.resorts
--   where published and notes ~* '\y(the|and|with|from|for)\y';
