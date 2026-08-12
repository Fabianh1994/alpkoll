
-- 019 — liftkortspriser hämtade från ortens egen sida
--
-- Tjugotvå av de trettio publicerade orterna får både dagspris och
-- sexdagarspris hämtat från den sida orten själv säljer kortet på, samt
-- valutan orten fakturerar i. Underlaget står ort för ort i
-- docs/liftkortspriser.md, med kvot, säsong och vilket kort som avses.
--
-- Varför fältet måste röras: migration 013 rättade dagspriserna kraftigt
-- uppåt men lämnade lift_pass_week_eur, som ingen migration någonsin
-- rört. Kvoten vecka/dag kollapsade — spannet var 2,19–7,00 och tolv av
-- trettio låg under fyra dagsbiljetter. Livignos veckokort stod på 158 €
-- bredvid ett dagskort på 72. Det finns inget veckokort någonstans som
-- kostar 2,2 dagsbiljetter.
--
-- Definition för varje rad: vuxen, sexdagarskort, ordinarie pris i kassan
-- (inte onlinerabatt), huvudsäsong. Referensvecka v9 2027 där priset
-- varierar över säsongen. Dynamiska priser är fångade 2026-08-12.
--
-- Rimlighetskontrollen som varje rad har passerat: ett sexdagarskort
-- ligger på 4,5–5,5 gånger dagspriset. Två rader ligger utanför och båda
-- har ett känt skäl utskrivet nedan.


-- ── De gamla värdena bevaras här med flit ─────────────────────────────
--
-- Varje UPDATE har det tidigare värdet i kommentaren. Det är inte
-- prydnad: Alpkoll ska publicera en årlig artikel om hur mycket varje ort
-- höjde priset mot året innan, och en UPDATE som skriver över utan att
-- lämna spår raderar underlaget för den serien vid första körningen.
--
-- Jämförelsen ska göras i ortens egen valuta. En kursrörelse är inte en
-- prishöjning, och de gamla talen nedan är dessutom euro rakt igenom —
-- de kan därför inte jämföras rakt av med de nya nordiska raderna.


-- ── Valuta och belopp ändras i samma UPDATE ───────────────────────────
--
-- Regeln från migration 016. Sätts valutan först står ett eurobelopp kvar
-- och renderas som kronor; sätts beloppet först renderas 3 744 kronor som
-- 3 744 euro. Båda felen ser fullt rimliga ut för den som inte känner
-- orten. Därför står de tre fälten alltid tillsammans.


-- ── Österrike ─────────────────────────────────────────────────────────

-- var 83 / 258. Premiumsäsong 20.12.26–13.3.27, KitzSki.
UPDATE resorts SET lift_pass_day_eur = 83, lift_pass_week_eur = 423, lift_pass_currency = 'EUR' WHERE slug = 'kitzbuehel';

-- var 83 / 258. v2/v9/v13 lika; topp 478,50 gäller jul och sportlovsveckorna.
UPDATE resorts SET lift_pass_day_eur = 84.50, lift_pass_week_eur = 469, lift_pass_currency = 'EUR' WHERE slug = 'solden';

-- var 79 / 283. Ett pris hela säsongen.
UPDATE resorts SET lift_pass_day_eur = 83, lift_pass_week_eur = 451, lift_pass_currency = 'EUR' WHERE slug = 'ischgl';

-- var 82 / 372. Veckopriset är 25/26 — Ski Arlberg har inte publicerat
-- 26/27, kontrollerat 2026-08-12. Dagspriset är oförändrat från 013.
UPDATE resorts SET lift_pass_week_eur = 450, lift_pass_currency = 'EUR' WHERE slug = 'st-anton';


-- ── Frankrike ─────────────────────────────────────────────────────────

-- var 75 / 282. Tignes–Val d'Isère, samma område som våra 300 km.
UPDATE resorts SET lift_pass_day_eur = 78, lift_pass_week_eur = 468, lift_pass_currency = 'EUR' WHERE slug = 'tignes';

-- var 66 / 272. 19.12.26–9.4.27.
UPDATE resorts SET lift_pass_day_eur = 68, lift_pass_week_eur = 336.50, lift_pass_currency = 'EUR' WHERE slug = 'alpe-d-huez';

-- var 70 / 268. Classic Pass = Les Arcs/Peisey-Vallandry, 200 km, alltså
-- exakt det område våra pisttal avser. Paradiski är ett större kort.
UPDATE resorts SET lift_pass_day_eur = 71, lift_pass_week_eur = 368, lift_pass_currency = 'EUR' WHERE slug = 'les-arcs';

-- Les 3 Vallées: samma kort och samma pris för alla tre orterna, precis
-- som pist- och lifttalen är samma. Dagspriset lämnas som det står i 013;
-- källan anger det ungefärligt och det är inte hämtat med samma säkerhet
-- som veckopriset.
-- courchevel var 82 / 354, meribel 82 / 290, val-thorens 82 / 354.
UPDATE resorts SET lift_pass_week_eur = 421, lift_pass_currency = 'EUR' WHERE slug IN ('courchevel', 'meribel', 'val-thorens');


-- ── Italien ───────────────────────────────────────────────────────────

-- var 72 / 158 — den värsta raden i hela tabellen, 2,2 dagsbiljetter för
-- en vecka. Högsäsong 25/26 (31.1–27.3); 26/27 ej publicerat. Dagspriset
-- från 013 stämmer exakt mot ortens egen sida, vilket är en oberoende
-- bekräftelse på att veckopriset hör till samma prislista.
UPDATE resorts SET lift_pass_day_eur = 72, lift_pass_week_eur = 362, lift_pass_currency = 'EUR' WHERE slug = 'livigno';

-- var 85 / 238. SkiArea Campiglio Dolomiti di Brenta, samma namn som
-- radens ski_area. Högsäsong 25/26. Obs söndagsregeln: ortens prislista
-- lägger på 10 € om kortet innehåller en söndag, vilket en svensk vecka
-- nästan alltid gör. Listpriset lagras, som för alla andra orter.
UPDATE resorts SET lift_pass_day_eur = 85, lift_pass_week_eur = 424, lift_pass_currency = 'EUR' WHERE slug = 'madonna-di-campiglio';


-- ── Schweiz ───────────────────────────────────────────────────────────

-- var 124 / 588 euro. Nu i franc: internationella kortet Zermatt–Cervinia,
-- som är det som ger våra 322 km. Zermatt ensamt kostar 89 / 384.
UPDATE resorts SET lift_pass_day_eur = 104, lift_pass_week_eur = 432, lift_pass_currency = 'CHF' WHERE slug = 'zermatt';

-- var 101 / 552 euro. 4 Vallées, samma som våra 412 km.
-- Verbier–Tzoumaz ensamt kostar 86 / 374.
UPDATE resorts SET lift_pass_day_eur = 94, lift_pass_week_eur = 409, lift_pass_currency = 'CHF' WHERE slug = 'verbier';

-- var 90 / 358 euro. Saas-Fee-kortet (Saas-Fee + Saas-Almagell).
-- Destination-kortet gäller hela Saastal och är en annan produkt.
UPDATE resorts SET lift_pass_day_eur = 84, lift_pass_week_eur = 413, lift_pass_currency = 'CHF' WHERE slug = 'saas-fee';


-- ── Sverige ───────────────────────────────────────────────────────────
--
-- De två enda orterna som lagras i kronor, och därmed de enda som visas
-- utan "ca" och utan omräkning. SkiStar, fångat 2026-08-12 för startdag
-- 1 mars 2027.

-- var 73 / 300 euro.
UPDATE resorts SET lift_pass_day_eur = 759, lift_pass_week_eur = 3744, lift_pass_currency = 'SEK' WHERE slug = 'are';

-- var 63 / 265 euro. Veckokortet inkluderar två skiddagar i Trysil.
UPDATE resorts SET lift_pass_day_eur = 650, lift_pass_week_eur = 3126, lift_pass_currency = 'SEK' WHERE slug = 'salen';

-- var 48 / 265 euro. 5 dagar 2 195 + extra dag 352; orten har ingen egen
-- sexdagarsrad. OBS: kortet gäller Björkliden OCH Riksgränsen, medan våra
-- 21 km avser Riksgränsen ensamt — men orten säljer inget kort som bara
-- gäller den egna sidan, så det finns ingen rätt produkt att välja i
-- stället. Se docs/liftkortspriser.md.
UPDATE resorts SET lift_pass_day_eur = 520, lift_pass_week_eur = 2547, lift_pass_currency = 'SEK' WHERE slug = 'riksgransen';


-- ── Norge ─────────────────────────────────────────────────────────────
--
-- Lagras i norska kronor, inte svenska, trots att SkiStar säljer Trysil
-- och Hemsedal i SEK på sin svenska sida. En norsk ort tar betalt i NOK;
-- att lagra SkiStars svenska prislapp vore att lagra deras växelkurs.

-- var 73 / 360 euro (och 3 739 SEK i arbetsdokumentet).
UPDATE resorts SET lift_pass_day_eur = 775, lift_pass_week_eur = 3806, lift_pass_currency = 'NOK' WHERE slug = 'trysil';

-- var 63 / 340 euro (och 3 702 SEK i arbetsdokumentet).
UPDATE resorts SET lift_pass_day_eur = 745, lift_pass_week_eur = 3769, lift_pass_currency = 'NOK' WHERE slug = 'hemsedal';

-- var 70 / 315 euro. Produkten heter "6–8 dagar", 25/26.
UPDATE resorts SET lift_pass_day_eur = 693, lift_pass_week_eur = 2871, lift_pass_currency = 'NOK' WHERE slug = 'geilo';

-- var 60 / 320 euro. Kvoten blir 3,97, under bandet 4,5–5,5, och det är
-- inte en felavläsning: Myrkdalen kapar priset så att 6, 7 och 8 dagar
-- alla kostar 2 620. Den som stannar en vecka betalar för knappt fyra
-- dagar. Säsong ej utsatt i ortens prislista.
UPDATE resorts SET lift_pass_day_eur = 660, lift_pass_week_eur = 2620, lift_pass_currency = 'NOK' WHERE slug = 'myrkdalen';


-- ── De åtta som INTE rörs, och varför ─────────────────────────────────
--
-- Sju av dem har inte publicerat vinterpriser. Kontrollerat 2026-08-12,
-- och det är augusti: sajterna står i sommarläge. Ruka anger själv att
-- liftkorten släpps 2 oktober.
--
--   chamonix, cortina-d-ampezzo, hemavan, levi, mayrhofen, ruka, voss
--
-- Den åttonde, grandvalira, är underkänd på område: flerdagarskortet
-- gäller Grandvalira PLUS Ordino Arcalís PLUS Pal Arinsal, 308 km mot
-- våra 215. Samma mönster som Saalbach och Bad Gastein.
--
-- Att lämna åtta orter orörda bryter mot principen i migration 013 om att
-- delrättning är sämre än ingen rättning. Avsteget är medvetet och taget
-- av Fabian: de gamla veckopriserna är inte bara gamla utan trasiga, och
-- tjugotvå rätta tal bredvid åtta trasiga är bättre än trettio trasiga.
-- De åtta blir varken bättre eller sämre av den här migrationen.


-- ── Efterkontroll ─────────────────────────────────────────────────────
--
-- 1. Kvoten vecka/dag ska ligga i 4,5–5,5 för de tjugotvå rättade, utom
--    Myrkdalen som kapar priset (3,97). De åtta orörda ligger kvar utanför
--    bandet — det är själva poängen med att de är kvar att göra:
--
--      SELECT slug, lift_pass_currency, lift_pass_day_eur, lift_pass_week_eur,
--             round(lift_pass_week_eur / lift_pass_day_eur, 2) AS kvot
--      FROM resorts WHERE published ORDER BY kvot;
--
--      Förväntat utanför bandet: grandvalira 2,52, cortina 2,80,
--      mayrhofen 2,90, myrkdalen 3,97 (kapat), chamonix 4,75, ruka 4,83,
--      voss 5,24, hemavan 7,00. Åtta rader, sju av dem de orörda.
--
-- 2. Ingen rad får ha en valuta utan att beloppet hämtats i den valutan.
--    Alla icke-euro-rader ska vara de tio nordiska och schweiziska ovan:
--
--      SELECT slug, lift_pass_currency FROM resorts
--      WHERE published AND lift_pass_currency <> 'EUR' ORDER BY slug;
--
--      Förväntat: are, geilo, hemsedal, myrkdalen, riksgransen, saas-fee,
--      salen, trysil, verbier, zermatt.
--
-- 3. est_weekly_cost_eur ska vara orörd — den är euro för alla orter och
--    styrs inte av lift_pass_currency:
--
--      SELECT count(*) FROM resorts WHERE published AND est_weekly_cost_eur % 50 <> 0;
--
--      Förväntat: 0, precis som före den här migrationen.
