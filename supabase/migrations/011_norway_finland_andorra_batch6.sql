
-- (Raden ovan är avsiktligt tom: tappas första tecknet vid kopiering
--  spelar det då ingen roll.)
-- 011 · Norge, Finland och Andorra — sista omgången
--
-- Åtta orter: Trysil, Hemsedal, Geilo, Voss, Myrkdalen, Levi, Ruka och
-- Grandvalira. Därmed är alla 32 publicerade orter genomgångna.
--
-- Störst avvikelse i hela arbetet: Ruka stod som 34 km där området har
-- 19. Voss bas stod som 60 m mot verkliga 284.
--
-- Grandvaliras siffror lämnas orörda — jag hittade ingen sida hos
-- källan. Övrigt för orten är uppdaterat.

begin;

-- ── Trysil ─────────────────────────────────────────────────────────
update public.resorts set
  total_pistes_km = 78, total_lifts = 41,
  altitude_base = 395, altitude_top = 1100,
  transfer_minutes = 150, transfer_note = 'med bil från Oslo',
  notes = 'Norges största skidort, och för många svenskar den närmaste riktiga fjällorten efter Sälen. 78 kilometer pist runt hela Trysilfjellet, vilket betyder att du alltid hittar en sida i lä. Backarna är breda och välpreparerade och passar familjer, men fjället når bara 1 100 meter så terrängen blir sällan brant.',
  where_to_stay = 'Boendet ligger runt fjället i flera separata områden. Turistsenteret på västsidan är störst och har mest service. Høyfjellssenteret ligger högre upp med kortare väg till liftarna. Fageråsen på norra sidan är lugnast. Skidbuss går mellan områdena, men det lönar sig att välja sida efter var du tänkt åka.',
  transport_info = 'De flesta svenskar kör: knappt sex timmar från Stockholm, tre från Karlstad. Flyger du går det till Oslo, cirka 2,5 timmar med bil därifrån. Scandinavian Mountains Airport vid Sälen ligger bara en timme bort, men har begränsad säsongstrafik.'
where slug = 'trysil';

-- ── Hemsedal ───────────────────────────────────────────────────────
update public.resorts set
  total_pistes_km = 44, total_lifts = 22, season_end_month = 5,
  transfer_minutes = 180, transfer_note = 'med bil från Oslo',
  notes = 'Kallas Skandinaviens Alper, vilket är en överdrift men inte gripet ur luften: Hemsedal har brantare åkning än de flesta nordiska orter och når 1 450 meter. 44 kilometer pist, bra offpist när snön ligger rätt, och ett uteliv som drar en yngre publik än de renodlade familjeorterna.',
  where_to_stay = 'Skisenteret vid liftfoten ligger närmast åkningen och har boende direkt vid pisten. Hemsedal by fyra kilometer bort har butiker, restauranger och merparten av utelivet, med skidbuss däremellan. Väljer du byn får du mer liv men mer transport.',
  transport_info = 'Flyg till Oslo, cirka 3 timmar med bil. Kör du från Sverige tar det ungefär sju timmar från Stockholm och fem från Göteborg. Bussar går från Oslo under säsongen.'
where slug = 'hemsedal';

-- ── Geilo ──────────────────────────────────────────────────────────
update public.resorts set
  total_pistes_km = 34, total_lifts = 20, altitude_base = 779,
  transfer_minutes = 180, transfer_note = 'med bil från Oslo',
  notes = 'Ligger på Hardangervidda mellan Oslo och Bergen, och är lika mycket längdskidort som alpin — här möts två stora spårsystem. Den alpina delen är liten, 34 kilometer på ömse sidor om dalen, och passar familjer och nybörjare. Bergensbanan stannar mitt i byn, vilket gör Geilo till en av få fjällorter du når helt utan bil.',
  where_to_stay = 'Byn ligger mellan skidområdena: Geilolia och Vestlia på ena sidan, Geilo Skisenter på den andra. Bor du centralt har du gångavstånd till stationen och restaurangerna men skidbuss till backarna. Vestlia är det lugnare valet med boende direkt vid pisten.',
  transport_info = 'Bergensbanan stannar i Geilo — tåget från Oslo tar drygt tre timmar, från Bergen ungefär lika länge. Med bil från Oslo tar det cirka 3 timmar. Från Sverige är tåget via Oslo ofta smidigare än att köra.'
where slug = 'geilo';

-- ── Voss ───────────────────────────────────────────────────────────
update public.resorts set
  total_pistes_km = 45, total_lifts = 10,
  altitude_base = 284, altitude_top = 964,
  transfer_minutes = 75, transfer_note = 'med bil från Bergen',
  notes = 'Ligger i Fjordnorge mellan Bergen och Sognefjorden, med 45 kilometer pist och bara tio liftar. Voss är mer känt som Norges huvudstad för extremsport — fallskärm, forsränning, base — än som skidort, och lever året om. Basen ligger på 284 meter, så snön i de lägre partierna är opålitlig.',
  where_to_stay = 'Voss är en stad vid en sjö, inte en skidby, med tågstation och service i centrum. Skidområdet ligger ovanför staden och nås med gondol från centrum. Bor du i staden har du restauranger och butiker; vill du ha pisten utanför dörren finns boende uppe vid Bavallen.',
  transport_info = 'Flyg till Bergen, cirka 1,5 timme med bil. Bergensbanan stannar i Voss, och gondolen upp till skidområdet går från stationen — en av få orter där tåget tar dig hela vägen och lift tar vid direkt.'
where slug = 'voss';

-- ── Myrkdalen ──────────────────────────────────────────────────────
update public.resorts set
  total_lifts = 11, altitude_base = 450, altitude_top = 1060,
  season_start_month = 11,
  transfer_minutes = 105, transfer_note = 'med bil från Bergen',
  notes = 'Liten ort en halvtimme från Voss, känd för att få mest snö i Norge — flera meter per säsong är normalt. 35 kilometer pist och elva liftar gör området litet, men snösäkerheten är i särklass för att ligga så nära kusten. Här finns lite annat än skidåkning.',
  where_to_stay = 'Myrkdalen är i praktiken ett hotell och några stugområden vid liftfoten, inte en by. Allt ligger inom gångavstånd från backen. Vill du ha restauranger och stadsliv bor du i Voss en halvtimme bort och kör upp.',
  transport_info = 'Flyg till Bergen, knappt två timmar med bil. Bussar går från Voss, dit Bergensbanan går från både Bergen och Oslo.'
where slug = 'myrkdalen';

-- ── Levi ───────────────────────────────────────────────────────────
update public.resorts set
  total_pistes_km = 39, total_lifts = 26, altitude_base = 196,
  season_start_month = 10, season_end_month = 5,
  transfer_minutes = 20, transfer_note = 'med bil från Kittilä',
  notes = 'Finlands största skidort, i Lappland norr om polcirkeln. Bara 39 kilometer pist och ett fjäll på 531 meter — men säsongen sträcker sig från oktober till maj, och i november och december åker man i mörker under norrsken. Levi arrangerar världscup i slalom och har mer service än storleken antyder.',
  where_to_stay = 'Levi är kompakt och byggt runt liftfoten, med hotell, restauranger och butiker samlade i centrum. Det mesta ligger inom gångavstånd från backen. Boendet växlar mellan hotell och stugor, och i högsäsong bokas det långt i förväg.',
  transport_info = 'Flyg till Kittilä, bara femton kilometer bort, med direktflyg från Helsingfors och charter från flera europeiska städer. Från Sverige går det via Helsingfors — avståndet gör flyget till det rimliga valet.'
where slug = 'levi';

-- ── Ruka ───────────────────────────────────────────────────────────
update public.resorts set
  total_pistes_km = 19, total_lifts = 22, altitude_base = 291,
  season_end_month = 5,
  transfer_minutes = 30, transfer_note = 'med bil från Kuusamo',
  notes = 'Nordöstra Finland nära ryska gränsen, med en säsong från oktober till maj — över tvåhundra dagar. Området är litet, 19 kilometer pist, men liftkapaciteten är hög i förhållande till storleken så köerna blir sällan långa. Ruka är också ett centrum för längdåkning och nordisk kombination.',
  where_to_stay = 'Ruka är en samlad by vid liftfoten där allt ligger nära. Kuusamo tjugofem kilometer bort är den större orten med mer service men utan skidåkning. Boendet är mest stugor, och under mörkertiden ingår norrskenet i paketet.',
  transport_info = 'Flyg till Kuusamo, tjugofem kilometer bort, med direktflyg från Helsingfors. Från Sverige krävs byte i Helsingfors. Att köra går, men räkna med två dagar från Stockholm.'
where slug = 'ruka';

-- ── Grandvalira ────────────────────────────────────────────────────
update public.resorts set
  transfer_minutes = 180, transfer_note = 'med bil från Barcelona',
  notes = 'Pyrenéernas största skidområde, i furstendömet Andorra mellan Frankrike och Spanien. 210 kilometer pist fördelat på flera byar, och priser som ligger märkbart under Alpernas — dagskortet kostar ungefär en tredjedel av Zermatts. Andorra är dessutom tullfritt, vilket märks i butikerna.',
  where_to_stay = 'Grandvalira sträcker sig över flera orter. Soldeu och El Tarter ligger mitt i området med bäst tillgång till åkningen. Pas de la Casa vid franska gränsen är känt för uteliv och shopping snarare än charm. Encamp ligger lägre, har gondol upp och är billigast.',
  transport_info = 'Flyg till Barcelona, cirka 3 timmar med bil — Andorra har ingen egen flygplats. Toulouse ligger på ungefär samma avstånd. Bussar går direkt från båda flygplatserna.'
where slug = 'grandvalira';

commit;

-- ── Kontroll ────────────────────────────────────────────────────────
-- Ska ge NOLL rader — alla 32 publicerade orter på svenska:
--   select slug from public.resorts
--   where published and notes ~* '\y(the|and|with|from|for)\y';
--
-- Orter som fortfarande saknar uppmätt restid (ska bli 0):
--   select count(*) from public.resorts
--   where published and transfer_minutes is null;
