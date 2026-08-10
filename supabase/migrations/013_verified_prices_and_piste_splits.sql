
-- (Raden ovan är avsiktligt tom: tappas första tecknet vid kopiering
--  spelar det då ingen roll.)
-- 013 · Verifierade liftkortspriser och pistfördelningar
--
-- Kontrollmätning 2026-08-10 mot skiresort.com, samma källa som pist,
-- liftar och höjder. Två fält visade sig inte hålla.
--
-- PRISERNA låg en eller flera säsonger efter. Samtliga 28 kontrollerade
-- orter stod för lågt, mellan +10 % och +125 %. Ökningen är inte
-- likformig — Livigno stod på 32 € där källan säger 72, Verbier på 92
-- där källan säger 101 — så ingen faktor kunde skala om dem. Varje ort
-- är hämtad för sig.
--
-- PISTFÖRDELNINGEN var inte hämtad utan uppskattad i femstegs. Beviset:
-- varje värde för samtliga 32 orter var en multipel av fem, och det fanns
-- bara 12 unika kombinationer bland 32 orter — sex orter delade exakt
-- 35/45/20. Verkliga fördelningar ser ut som 21/58/21 och 67/24/9.
--
-- Medianfelet var 17 procentenheter. Riktningen var konsekvent: lätt
-- åkning underskattades och svår överskattades, så varje ort framstod som
-- svårare än den är. Sämsta tänkbara fel för en sajt som ska hjälpa
-- svenska barnfamiljer välja.
--
-- Riksgränsen visar hur felet uppstod: databasen sa 40 % svart, källan
-- säger 6 %. Riksgränsen ÄR ett offpistmål — källan kallar den själv en
-- hotspot för friåkare — men det gäller åkningen utanför pisten. Ryktet
-- hade kodats in i pistfördelningen, där det inte hör hemma. Offpist­
-- poängen 9 är rätt; 40 % svart fanns inte.
--
-- Den tidigare granskningen missade detta eftersom den bara kontrollerade
-- att andelarna summerar till 100 — vilket vilken påhittad trippel som
-- helst gör. En konsistenskontroll som inte kan misslyckas bevisar inget.
--
-- KÄRNDATAN HÖLL. Pistkilometer, antal liftar och höjder stämde exakt mot
-- källan på varje kontrollerad ort utom Grandvalira, som byggts ut, och
-- Sälens bottenhöjd. Båda rättas nedan.
--
-- INTE ÄNDRADE, med skäl:
--   Chamonix — källan delar dalen i delområden (Grands Montets 29 km)
--     medan databasens 170 km är dalkortet. Källans pris gäller alltså
--     ett annat område än vi anger, och ortens eget pris uppges som
--     frånpris som varierar med hur tidigt man köper: Le Pass från 47 €,
--     Mont Blanc Unlimited från 70 €. Databasen står på 60 €. Talet är
--     känt osäkert men lämnas hellre orört än utbytt mot ett som mäter
--     något annat.
--   Hemavan — finns inte hos skiresort.com. Dessutom är BÅDA lagrade
--     länkarna döda: resort_url och piste_map_url pekar på hemavan.se,
--     som vidarebefordrar till en Google-sökning. Riktig domän är
--     hemavan.nu. Se den egna uppgiften om länkkontroll.
--
-- Priserna avser dagskort vuxen högsäsong. Tre är avrundade från
-- halvtal: St. Anton 81,50 och Les 3 Vallées 81,80 blir 82.

begin;

-- ── Österrike ──────────────────────────────────────────────────────
update public.resorts set lift_pass_day_eur = 79,
  blue_percent = 21, red_percent = 58, black_percent = 21 where slug = 'ischgl';

update public.resorts set lift_pass_day_eur = 83,
  blue_percent = 52, red_percent = 28, black_percent = 20 where slug = 'solden';

update public.resorts set lift_pass_day_eur = 82,
  blue_percent = 43, red_percent = 40, black_percent = 17 where slug = 'st-anton';

update public.resorts set lift_pass_day_eur = 83,
  blue_percent = 54, red_percent = 35, black_percent = 11 where slug = 'kitzbuehel';

update public.resorts set lift_pass_day_eur = 82,
  blue_percent = 31, red_percent = 46, black_percent = 23 where slug = 'mayrhofen';

-- ── Frankrike ──────────────────────────────────────────────────────
update public.resorts set lift_pass_day_eur = 66,
  blue_percent = 28, red_percent = 52, black_percent = 20 where slug = 'alpe-d-huez';

update public.resorts set lift_pass_day_eur = 75,
  blue_percent = 55, red_percent = 25, black_percent = 20 where slug = 'tignes';

update public.resorts set lift_pass_day_eur = 70,
  blue_percent = 52, red_percent = 35, black_percent = 13 where slug = 'les-arcs';

-- Courchevel, Méribel och Val Thorens visar alla 600 km pist, alltså hela
-- Les 3 Vallées, men stod med tre olika priser — 59, 58 och 59 € — som
-- såg ut att vara respektive dals eget kort. Sidan lovade 600 kilometer
-- för 59 euro. Priset måste avse det kort som ger tillgång till den pist
-- vi anger, annars prissätter vi något annat än vi visar. Alla tre får
-- därför Les 3 Vallées-kortet, och samma pistfördelning som området.
update public.resorts set lift_pass_day_eur = 82,
  blue_percent = 56, red_percent = 34, black_percent = 10
where slug in ('courchevel', 'meribel', 'val-thorens');

-- ── Italien ────────────────────────────────────────────────────────
update public.resorts set lift_pass_day_eur = 72,
  blue_percent = 28, red_percent = 55, black_percent = 17 where slug = 'livigno';

update public.resorts set lift_pass_day_eur = 80,
  blue_percent = 38, red_percent = 49, black_percent = 13 where slug = 'cortina-d-ampezzo';

update public.resorts set lift_pass_day_eur = 85,
  blue_percent = 32, red_percent = 47, black_percent = 21 where slug = 'madonna-di-campiglio';

-- ── Schweiz ────────────────────────────────────────────────────────
-- Schweiziska priser är omräknade från franc: Zermatt SFr 116,
-- Saas-Fee SFr 84, Verbier SFr 94.
update public.resorts set lift_pass_day_eur = 124,
  blue_percent = 23, red_percent = 69, black_percent = 8 where slug = 'zermatt';

update public.resorts set lift_pass_day_eur = 90,
  blue_percent = 20, red_percent = 60, black_percent = 20 where slug = 'saas-fee';

update public.resorts set lift_pass_day_eur = 101,
  blue_percent = 26, red_percent = 49, black_percent = 25 where slug = 'verbier';

-- ── Andorra ────────────────────────────────────────────────────────
-- Grandvalira är den enda orten där även kärndatan glidit: området har
-- byggts ut från 210 till 215 km och från 67 till 75 liftar.
update public.resorts set lift_pass_day_eur = 69,
  total_pistes_km = 215, total_lifts = 75,
  blue_percent = 47, red_percent = 38, black_percent = 15 where slug = 'grandvalira';

-- ── Norge ──────────────────────────────────────────────────────────
-- Norska priser omräknade från kronor: Trysil 808, Hemsedal 697,
-- Geilo 770, Myrkdalen 660, Voss 690.
update public.resorts set lift_pass_day_eur = 73,
  blue_percent = 51, red_percent = 23, black_percent = 26 where slug = 'trysil';

-- Hemsedal stod 42 procentenheter fel — dagens grövsta avvikelse.
-- Databasen sa 25 % blå och 30 % svart där källan säger 67 % lätt och
-- 9 % svår. Sajten beskrev en expertort där källan beskriver en
-- familjebacke.
update public.resorts set lift_pass_day_eur = 63,
  blue_percent = 67, red_percent = 24, black_percent = 9 where slug = 'hemsedal';

update public.resorts set lift_pass_day_eur = 70,
  blue_percent = 53, red_percent = 35, black_percent = 12 where slug = 'geilo';

update public.resorts set lift_pass_day_eur = 60,
  blue_percent = 48, red_percent = 39, black_percent = 13 where slug = 'myrkdalen';

update public.resorts set lift_pass_day_eur = 63,
  blue_percent = 55, red_percent = 19, black_percent = 26 where slug = 'voss';

-- ── Finland ────────────────────────────────────────────────────────
update public.resorts set lift_pass_day_eur = 58,
  blue_percent = 45, red_percent = 47, black_percent = 8 where slug = 'levi';

update public.resorts set lift_pass_day_eur = 58,
  blue_percent = 47, red_percent = 36, black_percent = 17 where slug = 'ruka';

-- ── Sverige ────────────────────────────────────────────────────────
-- Svenska priser omräknade från kronor: Åre 801, Riksgränsen 520,
-- Sälen 686.
update public.resorts set lift_pass_day_eur = 73,
  blue_percent = 49, red_percent = 42, black_percent = 9 where slug = 'are';

-- Riksgränsen stod som 40 % svart — brantast på hela sajten — där källan
-- säger 6 %. Se den långa noten överst om hur felet uppstod.
update public.resorts set lift_pass_day_eur = 48,
  blue_percent = 47, red_percent = 47, black_percent = 6 where slug = 'riksgransen';

-- ── Sälen ──────────────────────────────────────────────────────────
--
-- Sälen är inte ett sammanhängande område. Lindvallen och Högfjället
-- hänger ihop med liftar, Tandådalen och Hundfjället hänger ihop — men
-- mellan de två paren krävs skidbuss eller bil. Man kan inte åka från
-- Högfjället till Tandådalen.
--
-- Det är skillnaden mot Åre, som är samma ägare men ett berg. Källan
-- listar därför Sälen som två orter:
--   Lindvallen/Högfjället      42 km · 58 liftar · 579-887 m · 53/40/7
--   Tandådalen/Hundfjället     45 km · 48 liftar · 572-872 m · 40/33/27
--
-- Databasens 107 km fanns inte hos någon av dem, och inte heller i
-- summan: 42 + 45 = 87. SkiStar skriver själva "101 pister" — antal
-- nedfarter, inte kilometer, misstänkt nära 107.
--
-- Beslut 2026-08-10: Sälen förblir EN ort och EN sida, eftersom det är
-- det mest sökta skidordet i Sverige och ingen söker på Tandådalen.
-- Huvudtalen avser vad liftkortet ger — 87 km och 106 liftar — och att
-- området består av två delar som bussen förbinder ska stå i klartext på
-- sidan. Ett tal som förklaras är inte vilseledande; det är oförklarade
-- tal regeln i CLAUDE.md finns för att stoppa. Val Gardena får därför
-- fortfarande inte skylta med Dolomiti Superskis 1 200 km, som är tolv
-- orter man inte når på en dag.
--
-- Delområdenas egna siffror hör hemma i en sub_areas-kolumn tillsammans
-- med Chamonix. Den kräver kod som renderar dem och ligger i en egen
-- uppgift — talen ovan är bevarade där så inget går förlorat.
--
-- BOTTENHÖJDEN VAR FEL OCH FELET VÄXTE. altitude_base stod på 330 m.
-- Sälens lägsta punkt är 572. Migration 010 belade topphöjden och
-- rättade den från 620 till 887 men rörde aldrig botten — så den falska
-- fallhöjden växte från 290 till 557 m av rättningen. Verklig fallhöjd
-- är omkring 315 m.
update public.resorts set
  lift_pass_day_eur = 63,
  total_pistes_km = 87, total_lifts = 106,
  altitude_base = 572,
  blue_percent = 46, red_percent = 37, black_percent = 17
where slug = 'salen';

-- ── Orter som döljs ────────────────────────────────────────────────
--
-- Beslut 2026-08-10. Davos och Crans-Montana valdes innan målgruppen
-- låstes till svensken som åker till Alperna eller i Norden. De är
-- internationellt kända men säljs knappt av svenska arrangörer, och
-- Schweiz är dyrt. Samma hål från andra hållet som att Saalbach,
-- Cervinia, Val Gardena och Bad Gastein saknades helt.
--
-- Zermatt, Verbier och Saas-Fee behålls: Zermatt känner alla till, de
-- andra två har ett följe.
--
-- Orter döljs, raderas aldrig — rader, poäng och bilder ligger kvar.
update public.resorts set published = false
where slug in ('davos', 'crans-montana');

commit;
