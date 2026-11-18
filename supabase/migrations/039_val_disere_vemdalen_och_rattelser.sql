-- 039 · Provomgången: Val d'Isère och Vemdalen läggs in dolda, och
-- Tignes och Sälen rättas.
--
-- Underlaget är faktafilerna i projektmappen orter/ (val-d-isere.md,
-- vemdalen.md, salen.md) och granskningen granskning-provomgang.md, alla
-- 2026-11-18. Varje tal nedan är kontrollerat mot skiresort.com två gånger,
-- av forskaren och av granskaren.
--
-- De två nya orterna läggs in med published = false. De visas inte förrän
-- de har en bild med licens i resort_images och en provad söksträng i
-- BOOKING_SOK (lib/booking.js), enligt CLAUDE.md.
--
-- Kör i Supabase SQL Editor. Allt körs i en transaktion.

begin;

-- ── Rättelser ─────────────────────────────────────────────────────────

-- Tignes: liftkapacitet och konstsnö hade ingen migration bakom sig och
-- stämmer inte med källan. Pistfördelningen 55/25/20 står KVAR: källan
-- visar nu 10/63/27, men där betyder "Easy" bara gröna pister för den här
-- posten (skiresorts egen nybörjarsida, ortens pistantal 23 gröna + 67
-- blå av 160, Iglu 83 av 154). Talet går inte att jämföra med andra orter.
update resorts
set lift_capacity_per_hour = 153857,
    snowmaking_coverage_pct = 50
where slug = 'tignes';

-- Sälen: 59 205 + 52 254 pers/h och konstsnö 75 % / 80 % viktat på
-- 42 / 45 km. 65 000 och 60 fanns inte i källan eller i någon migration.
update resorts
set lift_capacity_per_hour = 111459,
    snowmaking_coverage_pct = 78
where slug = 'salen';

-- Sälen: migration 031 är aldrig körd. Ortsidan visar fortfarande
-- "Fallhöjden är 315 meter" mot 308 m i rutorna. Samma sats som 031;
-- den gör ingenting om texten redan är rättad.
update resorts
set notes = replace(
  notes,
  'Vill du åka brant är Sälen fel val. Fallhöjden är 315 meter, minst av de svenska orterna här. Åre har 939.',
  'Vill du åka brant är Sälen fel val. Fallhöjden är den minsta av de svenska orterna här, och Åre har ungefär tre gånger så mycket.'
)
where slug = 'salen'
  and notes like '%Fallhöjden är 315 meter%';

-- ── Val d'Isère ───────────────────────────────────────────────────────
--
-- Samma område som Tignes, så pist, liftar, höjder, fördelning, kapacitet
-- och konstsnö är Tignes tal efter rättelsen ovan. Betygen för området är
-- lika med Tignes; afterski och bykänsla gäller byn och skiljer sig.
--
-- Liftkortet: Tignes-Val d'Isère, vuxen, vinterpris 12 dec–23 apr, ortens
-- egen prislista. Fasta prisnivåer, inte dynamiskt. Visas först när
-- orten läggs in i VERIFIERADE i lib/liftkortspriser.js.
--
-- Restiden från Genève är mätt med OSRM, samma metod som lib/restider.js.
-- OBS: samma mätning ger Tignes 191 min, medan databasen har 180. De
-- befintliga orternas restider är alltså inte mätta på samma sätt; det
-- rättas i en senare omgång.

insert into resorts (
  slug, name, country, region, ski_area, latitude, longitude,
  season_start_month, season_end_month,
  altitude_base, altitude_top, total_pistes_km,
  blue_percent, red_percent, black_percent,
  total_lifts, lift_capacity_per_hour, snowmaking_coverage_pct,
  lift_pass_day_eur, lift_pass_week_eur, lift_pass_currency,
  nearest_airport, airport_distance_km, transfer_minutes,
  snow_guarantee_score, beginner_score, intermediate_score, expert_score,
  off_piste_score, snowpark_score, family_friendly_score,
  apres_ski_score, village_charm_score, crowd_score,
  notes, where_to_stay, accommodation_zone, transport_info,
  published
) values (
  'val-d-isere', 'Val d''Isère', 'France', 'Savoie', 'Tignes/Val d''Isère', 45.4497, 6.9772,
  11, 5,
  1550, 3456, 300,
  55, 25, 20,
  80, 153857, 50,
  78, 468, 'EUR',
  'Genève', 183, 196,
  9, 7, 8, 9,
  9, 8, 6,
  8, 7, 5,
  'Val d''Isère delar pisten och liftkortet med Tignes. Byn fanns före liftarna och har kvar en gammal kärna med hus i trä och sten. Orten passar dig som åker rött och svart och vill ha afterski när liftarna stänger. Står du på skidor för första gången är Val d''Isère fel val. Nedfarterna ner till byn är svåra, och nybörjare rekommenderas att ta liften ner. I Sälen bor du vid övningsbacken.',
  'Bo i centrum, Val d''Isère 1850, om du har barn i skidskola, eftersom barnområdet och flera övningsliftar ligger där. La Daille längst ner i dalen har egna gratis övningsliftar. Byn är utspridd, så kolla avståndet till närmaste lift innan du bokar. Gratis skidbuss går genom byn.',
  'Val d''Isère 1850, La Daille, Le Fornet',
  'Flyg till Genève och åk bil eller transferbuss genom Tarentaisedalen förbi Bourg-Saint-Maurice. Med tåg åker du till Bourg-Saint-Maurice och tar bussen sista biten upp. Lokalbussarna blir fulla på lördagarna när veckorna byts. Vid kraftigt snöfall eller lavinfara kan vägen in i dalen stängas.',
  false
)
on conflict (slug) do nothing;

-- ── Vemdalen ──────────────────────────────────────────────────────────
--
-- Tre poster hos skiresort.com som delar SkiPass men inte liftar:
-- Vemdalsskalet 18 km, Björnrike 14 km, Klövsjö/Storhogna 19 km. Talen är
-- summan, på samma sätt som Sälen (migration 013), och delarna står i
-- lib/delomraden.js så att fallhöjden blir 440 m (Björnrike) och inte
-- 498 m, som ingen backe har. ski_area lämnas tomt.
--
-- Liftkortet saknas: SkiStars pris ska hämtas ur bokningskalendern för
-- startdag 1 mars 2027, som för Sälen och Åre (migration 019).
--
-- Restiden från Östersund är mätt med OSRM: 115 km, 117 min.

insert into resorts (
  slug, name, country, region, ski_area, latitude, longitude,
  season_start_month, season_end_month,
  altitude_base, altitude_top, total_pistes_km,
  blue_percent, red_percent, black_percent,
  total_lifts, lift_capacity_per_hour, snowmaking_coverage_pct,
  lift_pass_day_eur, lift_pass_week_eur, lift_pass_currency,
  nearest_airport, airport_distance_km, transfer_minutes,
  snow_guarantee_score, beginner_score, intermediate_score, expert_score,
  off_piste_score, snowpark_score, family_friendly_score,
  apres_ski_score, village_charm_score, crowd_score,
  notes, where_to_stay, accommodation_zone, transport_info,
  published
) values (
  'vemdalen', 'Vemdalen', 'Sweden', 'Härjedalen', null, 62.4830, 13.9736,
  11, 4,
  448, 946, 51,
  51, 29, 20,
  44, 52271, 69,
  null, null, 'SEK',
  'Östersund', 115, 117,
  6, 9, 6, 5,
  5, 7, 8,
  6, 6, 7,
  'Vemdalen är tre skidområden i Härjedalen med samma SkiPass: Vemdalsskalet, Björnrike och Klövsjö/Storhogna. De hänger inte ihop med lift, och mellan dem går skidbussen. Hälften av pisten är blå, och orten passar familjer och nybörjare som vill ha nära till backen. Vill du åka brant är Vemdalen fel val. Fallhöjden är liten, och Åre har ungefär dubbelt så mycket.',
  'Med små barn passar Björnrike, där barn- och nybörjarområdet ligger vid liftarna. Vemdalsskalet har flest restauranger och mest afterski, och barnområdet vid Skalets torg har täckt rullband. Klövsjö och Storhogna har mest blå pist.',
  'Vemdalsskalet, Björnrike, Klövsjö/Storhogna',
  'De flesta kör bil. Snälltågets nattåg går på fredagar till Röjan, med transfer till alla tre områdena, och hemresan bokas samtidigt. Flyger du är Östersund porten, och sista biten går med bil. Skidbussen mellan områdena är gratis med SkiPass.',
  false
)
on conflict (slug) do nothing;

commit;
