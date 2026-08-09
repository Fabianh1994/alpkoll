
-- (Raden ovan är avsiktligt tom: tappas första tecknet vid kopiering
--  spelar det då ingen roll.)
-- 008 · Frankrike — siffror, restid och svensk text
--
-- Omgång 3: Tignes, Les Arcs, Alpe d'Huez och Chamonix.
-- Siffror från skiresort.com, samma källa som tidigare omgångar.
--
-- Två avvikelser som krävde ett beslut:
--
-- Les Arcs stod som 425 km. Det är Paradiski — Les Arcs plus La Plagne
-- sammanlagt. skiresort.com listar orten som 200 km och 52 liftar och
-- publicerar ingen samlad Paradiski-siffra på den sidan, till skillnad
-- från hur de gör med Les 3 Vallées. Jag tar källans egen siffra och
-- låter texten förklara att Paradiski-kortet öppnar La Plagne via
-- Vanoise Express, hellre än att visa ett tal jag inte kan belägga.
--
-- Chamonix lämnas orörd på pist och liftar. Källan delar upp dalen i
-- separata områden — Brévent/Flégère, Grands Montets och flera till —
-- eftersom de inte hänger ihop med lift. Det finns alltså ingen enskild
-- siffra att jämföra mot. Texten säger i stället rakt ut att bergen är
-- skilda och att man tar buss mellan dem, vilket är det en läsare
-- behöver veta när 170 km ställs mot orter där allt sitter ihop.

begin;

-- ── Tignes ─────────────────────────────────────────────────────────
-- Delar område med Val d'Isère. Liftantalet avsåg bara Tignes egen sida.
update public.resorts set
  ski_area = 'Tignes/Val d''Isère',
  total_lifts = 80,
  season_start_month = 11,
  transfer_minutes = 180, transfer_note = 'med bil från Genève',
  notes = 'Hänger ihop med Val d''Isère till 300 kilometer pist, och ligger så högt att snön är säker från november till maj. Grande Motte-glaciären håller öppet även på sommaren. Tignes byggdes på sjuttiotalet och ser ut därefter — högt, funktionellt och utan charm. Val d''Isère bredvid är vackrare, och dyrare.',
  where_to_stay = 'Tignes består av flera delar på olika höjd. Le Lac och Val Claret ligger högst, kring 2 100 meter, med åkning direkt utanför dörren och merparten av restaurangerna. Tignes 1800 och Les Boisses ligger lägre och är billigare, med lift upp. Val d''Isère är det eleganta alternativet på andra sidan området, på samma liftkort.',
  transport_info = 'Flyg till Genève, cirka 3 timmar med bil — sista biten är serpentinväg. Med tåg åker du till Bourg-Saint-Maurice och tar buss den sista timmen.'
where slug = 'tignes';

-- ── Les Arcs ───────────────────────────────────────────────────────
update public.resorts set
  total_pistes_km = 200, total_lifts = 52,
  transfer_minutes = 165, transfer_note = 'med bil från Genève',
  notes = '200 kilometer pist mellan 1 200 och 3 226 meter, vilket ger ovanligt lång sammanhängande fallhöjd. Med Paradiski-kortet öppnas även La Plagne via linbanan Vanoise Express, som tar dig över dalen på några minuter. Byarna är sjuttiotalsarkitektur i trä, byggda rakt in i sluttningen — praktiskt snarare än pittoreskt.',
  where_to_stay = 'Arc 1950 är den nyaste delen, byggd i alpstil med gångstråk och restauranger, och den som mest liknar en by. Arc 2000 ligger högst och närmast den snösäkra åkningen. Arc 1800 är störst och har mest liv, medan Arc 1600 är lugnast. Siffrorna anger höjden i meter.',
  transport_info = 'Flyg till Genève, knappt 3 timmar med bil. Tåget går till Bourg-Saint-Maurice, och därifrån tar bergbanan dig upp till Arc 1600 på sju minuter — ovanligt smidigt jämfört med de flesta alporter, där stationen ligger en bussresa bort.'
where slug = 'les-arcs';

-- ── Alpe d'Huez ────────────────────────────────────────────────────
-- Grenoble ligger 65 km bort men har mycket begränsad flygtrafik och
-- är svår att nå från Sverige. Flygplatsfältet anger porten hit, inte
-- närmaste landningsbana — se migration 005.
update public.resorts set
  total_lifts = 68, altitude_base = 1125,
  nearest_airport = 'Lyon', airport_distance_km = 160,
  transfer_minutes = 135, transfer_note = 'med bil från Lyon',
  notes = '250 kilometer pist och en av Alpernas längsta nedfarter: Sarenne mäter 16 kilometer från Pic Blanc på 3 330 meter. Orten kallas L''Île au Soleil för sitt soliga läge, vilket är trevligt att åka i men gör snön i de lägre partierna opålitlig framåt mars och april.',
  where_to_stay = 'Alpe d''Huez är utsträckt, och läget avgör mycket. Kring Rond-Point des Pistes bor du närmast liftarna och det mesta av utelivet. Nedre delen är billigare men innebär promenad eller skidbuss. Vaujany på andra sidan området är lugnare och har en egen stor gondol in i systemet.',
  transport_info = 'Flyg till Lyon, drygt 2 timmar med bil. Grenoble ligger närmare men har så begränsad trafik att den sällan är ett alternativ från Sverige. Med tåg åker du till Grenoble och tar buss den sista dryga timmen uppför de tjugoen hårnålskurvorna.'
where slug = 'alpe-d-huez';

-- ── Chamonix ───────────────────────────────────────────────────────
-- Pist och liftar oförändrade, se kommentaren överst.
update public.resorts set
  transfer_minutes = 75, transfer_note = 'med bil från Genève',
  notes = 'Alpinismens huvudstad, i skuggan av Mont Blanc. Åkningen är inget sammanhängande område utan flera skilda berg längs dalen — du tar buss mellan dem, vilket är värt att veta när de 170 kilometrarna jämförs med orter där allt hänger ihop. Grands Montets och Vallée Blanche lockar dem som söker brant och offpist snarare än välpreparerad pist.',
  where_to_stay = 'Chamonix är en stad med liv året om, inte en skidby: restauranger, butiker och bergsutrustning finns öppet hela året. Bor du i centrum har du gångavstånd till Aiguille du Midi och till skidbussarna. Argentière längre upp i dalen ligger närmast Grands Montets och är lugnare. Les Houches i andra änden är familjevänligast.',
  transport_info = 'Flyg till Genève, bara drygt en timme med bil — Chamonix är den lättast nådda av de stora alporterna, och bussar går direkt från flygplatsen. Med tåg åker du via Saint-Gervais och byter till Mont-Blanc Express, som stannar i varje by längs dalen.'
where slug = 'chamonix';

commit;

-- ── Kontroll ────────────────────────────────────────────────────────
--   select slug, ski_area, total_pistes_km, total_lifts, altitude_base,
--          nearest_airport, transfer_minutes
--   from public.resorts
--   where slug in ('tignes','les-arcs','alpe-d-huez','chamonix');
--
-- Antal publicerade orter med engelsk text kvar (ska bli 18):
--   select count(*) from public.resorts
--   where published and notes ~* '\y(the|and|with|from|for)\y';
