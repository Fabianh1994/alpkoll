
-- (Raden ovan är avsiktligt tom: tappas första tecknet vid kopiering
--  spelar det då ingen roll.)
-- 002 · Svenska ortnamn i nearest_airport och accommodation_zone
--
-- OBS: en rad per ort, med flit. Ett reguljärt uttryck går inte att
-- använda här, eftersom "Village" och "Town" ibland är beskrivande ord
-- och ibland ingår i det verkliga platsnamnet:
--
--   "Snowmass Village"  är en kommun i Colorado        -> rörs inte
--   "Teton Village"     är en ort i Wyoming            -> rörs inte
--   "Niseko Village"    är ett etablerat områdesnamn   -> rörs inte
--   "Canyons Village"   är ett områdesnamn i Park City -> rörs inte
--   "Zermatt village"   är bara en beskrivning         -> tas bort
--
-- Versalerna skiljer dem inte åt — "Åre Village" är beskrivande medan
-- "Teton Village" är ett namn. Därför explicita satser.
--
-- Regeln som tillämpas:
--   · beskrivande "village"/"town" tas bort när ortnamnet ensamt räcker
--   · "Town Centre" blir "centrum"
--   · "Old Town" blir "gamla stan"
--   · äkta platsnamn lämnas orörda

begin;

-- ── Flygplatser ────────────────────────────────────────────────────
-- 19 av 22 är egennamn som ser likadana ut på svenska (Innsbruck,
-- Grenoble, Bergamo, Oslo, Bergen, Narvik, Umeå, Östersund, Mora,
-- Kittilä, Kuusamo, Sapporo, Queenstown, Aspen, Jackson Hole,
-- Salt Lake City, Vancouver, Barcelona, Verona). Tre har svensk form:

update public.resorts set nearest_airport = 'Genève'  where nearest_airport = 'Geneva';
update public.resorts set nearest_airport = 'Venedig' where nearest_airport = 'Venice';
update public.resorts set nearest_airport = 'Zürich'  where nearest_airport = 'Zurich';

-- ── Boendeområden ──────────────────────────────────────────────────
-- Beskrivande "village" tas bort; ortnamnet ensamt är tydligt.
update public.resorts set accommodation_zone = 'Zermatt (bilfritt)'        where slug = 'zermatt';
update public.resorts set accommodation_zone = 'Val Thorens'               where slug = 'val-thorens';
update public.resorts set accommodation_zone = 'Verbier'                   where slug = 'verbier';
update public.resorts set accommodation_zone = 'St. Anton'                 where slug = 'st-anton';
update public.resorts set accommodation_zone = 'Saas-Fee'                  where slug = 'saas-fee';
update public.resorts set accommodation_zone = 'Madonna di Campiglio'      where slug = 'madonna-di-campiglio';
update public.resorts set accommodation_zone = 'Geilo'                     where slug = 'geilo';
update public.resorts set accommodation_zone = 'Hemavan'                   where slug = 'hemavan';
update public.resorts set accommodation_zone = 'Ruka'                      where slug = 'ruka';
update public.resorts set accommodation_zone = 'Åre, Duved'                where slug = 'are';
update public.resorts set accommodation_zone = 'Hemsedal, Trøim'           where slug = 'hemsedal';
update public.resorts set accommodation_zone = 'Ischgl, Mathon'            where slug = 'ischgl';
update public.resorts set accommodation_zone = 'Levi, Sirkka'              where slug = 'levi';
update public.resorts set accommodation_zone = 'Mayrhofen, Hippach'        where slug = 'mayrhofen';
update public.resorts set accommodation_zone = 'Méribel, Méribel-Mottaret' where slug = 'meribel';
update public.resorts set accommodation_zone = 'Sölden, Hochsölden'        where slug = 'solden';
update public.resorts set accommodation_zone = 'Crans, Montana'            where slug = 'crans-montana';

-- "Town Centre" -> centrum
update public.resorts set accommodation_zone = 'Chamonix centrum, Argentière' where slug = 'chamonix';
update public.resorts set accommodation_zone = 'Cortina centrum, Pocol'       where slug = 'cortina-d-ampezzo';
update public.resorts set accommodation_zone = 'Queenstown centrum, Frankton' where slug = 'queenstown';
update public.resorts set accommodation_zone = 'Voss centrum'                 where slug = 'voss';

-- "Town" utan "Centre"
update public.resorts set accommodation_zone = 'Kitzbühel, Kirchberg'       where slug = 'kitzbuehel';
update public.resorts set accommodation_zone = 'Livigno, Trepalle'          where slug = 'livigno';

-- Äkta platsnamn bevarade, bara det beskrivande ordet borttaget
update public.resorts set accommodation_zone = 'Aspen, Snowmass Village'    where slug = 'aspen';
update public.resorts set accommodation_zone = 'Teton Village, Jackson'     where slug = 'jackson-hole';
update public.resorts set accommodation_zone = 'Whistler Village, Upper Village' where slug = 'whistler';
update public.resorts set accommodation_zone = 'Hirafu, Niseko Village'     where slug = 'niseko';

-- "Old Town" -> gamla stan
update public.resorts set accommodation_zone = 'Park City gamla stan, Canyons Village' where slug = 'park-city';

-- Övriga
update public.resorts set accommodation_zone = 'Myrkdalen hotellområde'     where slug = 'myrkdalen';
update public.resorts set accommodation_zone = 'Trysil, Turistsenter'       where slug = 'trysil';

-- Rättar samtidigt en saknad apostrof i ortnamnet
update public.resorts set accommodation_zone = 'Alpe d''Huez, Huez'         where slug = 'alpe-d-huez';

commit;

-- ── Kontroll ────────────────────────────────────────────────────────
--   select slug, accommodation_zone from public.resorts
--   where accommodation_zone ~* '\y(village|town|centre|center|old town|car-free)\y'
--   order by slug;
--
-- Kvarvarande träffar ska bara vara äkta platsnamn:
--   aspen (Snowmass Village), jackson-hole (Teton Village),
--   whistler (Whistler/Upper Village), niseko (Niseko Village),
--   park-city (Canyons Village)
