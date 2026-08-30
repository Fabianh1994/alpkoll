
-- 022 — pristabell med säsong per rad
--
-- Alpkoll ska publicera en årlig artikel om hur mycket varje ort höjde
-- liftkortspriset mot året innan. Tre kolumner på resorts kan inte bära
-- den serien: en UPDATE nästa höst skriver över 26/27 och lämnar ingenting
-- att jämföra med. 019, 020 och 021 räddade underlaget genom att skriva
-- "var 73 / 300 euro" i kommentarerna, men en kommentar går inte att
-- rendera. Den här migrationen flyttar historiken in i data.
--
-- Beslut av Fabian 2026-08-30, medan det bara är trettio orter att flytta.
--
--
-- ── Fyra saker tabellen gör som kolumnerna inte kan ───────────────────
--
-- 1. SÄSONG PER RAD. Fyra av de hämtade priserna är inte 26/27 utan 25/26
--    — geilo, riksgransen, st-anton och madonna-di-campiglio, för att
--    orten inte publicerat nästa säsong när priset hämtades. I dagens
--    kolumner ser de likadana ut som resten. Nästa år skulle de ge en
--    "höjning" som i själva verket är två års prisutveckling, medan
--    orterna omkring visar ett år. Nu står årtalet på raden.
--
-- 2. PRODUKT PER RAD. Fällan som gör artikeln osann: byter en ort från
--    eget kort till regionkort ser höjningen ut som femtio procent fast
--    det är ett annat område man köpt. Saalbach, Bad Gastein, Mayrhofen
--    och Grandvalira är alla underkända på just den grunden. Med produkt
--    i unikhetsnyckeln kan samma ort och säsong bära både sitt eget kort
--    och regionkortet, och artikeln kan kräva att produkten är densamma
--    båda åren i stället för att lita på att den är det.
--
-- 3. DECIMALER. lift_pass_day_eur och lift_pass_week_eur är heltal.
--    Söldens 84,50 blev 85 vid körning av 019, Alpe d'Huez 336,50 blev
--    337 och Livignos 74,50/374,50 lagrades som 75/375. Kolumnerna här är
--    numeric(8,2) och raderna nedan bär de riktiga talen. En avrundning
--    uppåt båda åren är ofarlig; en avrundning ena året och inte det
--    andra är en påhittad höjning på en procent.
--
-- 4. KÄLLA PER PRIS, INTE PER RAD. Dags- och veckopriset har ofta olika
--    ursprung. Les 3 Vallées-orterna har veckopriset hämtat från ortens
--    egen sida men dagspriset ungefärligt från skiresort.com via 013.
--    St. Anton har bara veckopriset hämtat. Två kolumner för källa i
--    stället för en gör att artikeln kan välja bort det som inte är
--    hämtat, utan att raden måste kastas.
--
--
-- ── Vad som INTE flyttas, och varför ──────────────────────────────────
--
-- Sju orter har priser i resorts som aldrig hämtats från någon källa vi
-- kan namnge: chamonix, levi och ruka (dags- och veckopris) samt
-- cortina-d-ampezzo, grandvalira, hemavan och mayrhofen (dagspris; deras
-- veckopriser nollades i 020). De har varken känd säsong eller känd
-- produkt. Att lägga in dem med en gissad säsong vore att skriva in
-- felet i den kolumn som finns till för att förhindra det.
--
-- De står kvar i resorts och visas som i dag. De får en rad här när de
-- hämtas — flera av dem släpper priser i oktober, se
-- docs/liftkortspriser.md för skäl och datum per ort.
--
-- Kolumnerna på resorts rörs inte av den här migrationen. Sajten läser
-- dem oförändrat och fungerar likadant före och efter. Att koppla om
-- läsningen är ett eget steg, precis som 001 lade till månadskolumnerna
-- innan koden bytte till dem.


begin;

create table if not exists public.lift_pass_prices (
  id           bigint generated always as identity primary key,
  resort_slug  text        not null,
  season       text        not null,
  currency     char(3)     not null,
  day_price    numeric(8,2),
  week_price   numeric(8,2),
  product      text        not null,
  day_source   text,
  week_source  text,
  source_url   text,
  captured_on  date        not null,
  note         text,

  constraint lift_pass_prices_sasongsformat
    check (season ~ '^[0-9]{4}/[0-9]{4}$'),
  constraint lift_pass_prices_nagot_pris
    check (day_price is not null or week_price is not null),
  constraint lift_pass_prices_unik
    unique (resort_slug, season, product)
);

comment on table public.lift_pass_prices is
  'Ett liftkortspris per ort, sasong och produkt. Veckopriset avser vuxen, sexdagarskort, ordinarie pris i kassan, huvudsasong. Underlaget for den arliga prisokningsartikeln.';
comment on column public.lift_pass_prices.season is
  'Den sasong priset GALLER, inte den da det hamtades. Format 2026/2027.';
comment on column public.lift_pass_prices.currency is
  'Ortens egen faktureringsvaluta. Jamforelser mellan ar gors i den — en kursrorelse ar inte en prishojning.';
comment on column public.lift_pass_prices.product is
  'Vilket kort priset avser. Maste vara samma tva ar i rad for att en hojning ska vara sann.';

-- Främmande nyckel mot resorts.slug kräver att slug är unik. Villkoret
-- saknas i schemat — resorts skapades utanför migrationerna — men värdena
-- är unika, vilket ortsidans .single() på slug förutsätter i varje anrop.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'resorts_slug_unik'
  ) then
    alter table public.resorts add constraint resorts_slug_unik unique (slug);
  end if;
end $$;

alter table public.lift_pass_prices
  drop constraint if exists lift_pass_prices_ort_finns;

alter table public.lift_pass_prices
  add constraint lift_pass_prices_ort_finns
  foreign key (resort_slug) references public.resorts(slug) on update cascade;

create index if not exists lift_pass_prices_ort_sasong
  on public.lift_pass_prices (resort_slug, season);

-- Läsbar för alla, skrivbar för ingen utom via SQL Editor. Samma
-- exponering som resorts, som sajten läser med anon-nyckeln.
alter table public.lift_pass_prices enable row level security;

drop policy if exists lift_pass_prices_las on public.lift_pass_prices;
create policy lift_pass_prices_las
  on public.lift_pass_prices for select
  to anon, authenticated
  using (true);


-- ── De tjugotre hämtade priserna ──────────────────────────────────────
--
-- Definition, oförändrad från 019: vuxen, sexdagarskort, ordinarie pris
-- (ej onlinerabatt), huvudsäsong. Referensveckor 2027 är v2 (9–16 jan),
-- v9 (27 feb–6 mar, sportlov) och v13 (27 mar–3 apr), med v9 som huvudtal
-- där priset varierar över säsongen.
--
-- Talen är de som står i docs/liftkortspriser.md, med decimalerna
-- återställda där heltalskolumnen kapade dem.

insert into public.lift_pass_prices
  (resort_slug, season, currency, day_price, week_price, product,
   day_source, week_source, source_url, captured_on, note)
values

-- ── Österrike ─────────────────────────────────────────────────────────

('solden', '2026/2027', 'EUR', 84.50, 469.00, 'Ötztal Sölden',
 'ortens egen sida', 'ortens egen sida', null, '2026-08-12',
 'v2, v9 och v13 kostar lika. Toppnivån 478,50 gäller 19.12–6.1 och 30.1–26.2.'),

('ischgl', '2026/2027', 'EUR', 83.00, 451.00, 'Silvretta Arena Ischgl–Samnaun',
 'ortens egen sida', 'ortens egen sida', null, '2026-08-12',
 'Ett pris hela säsongen.'),

('kitzbuehel', '2026/2027', 'EUR', 83.00, 423.00, 'KitzSki',
 'ortens egen sida', 'ortens egen sida', null, '2026-08-12',
 'Premiumsäsong 20.12.26–13.3.27. Spar 351, Vorteil 387. Läst ur PDF med pdftotext -layout; tabellen var snedställd och rättades med aritmetik.'),

('st-anton', '2025/2026', 'EUR', null, 450.00, 'Ski Arlberg',
 null, 'ortens egen sida', null, '2026-08-12',
 'Priset gäller 25/26 — 26/27 var inte publicerat. Lågsäsong 380. Dagspriset står kvar i resorts och är inte hämtat, därför tomt här.'),

-- ── Frankrike ─────────────────────────────────────────────────────────

('tignes', '2026/2027', 'EUR', 78.00, 468.00, 'Tignes–Val d''Isère',
 'ortens egen sida', 'ortens egen sida', null, '2026-08-12',
 'Samma område som våra 300 km.'),

('alpe-d-huez', '2026/2027', 'EUR', 68.00, 336.50, 'Alpe d''Huez Grand Domaine',
 'ortens egen sida', 'ortens egen sida', null, '2026-08-12',
 '19.12.26–9.4.27.'),

('les-arcs', '2026/2027', 'EUR', 71.00, 368.00, 'Classic Pass Les Arcs/Peisey-Vallandry',
 'ortens egen sida', 'ortens egen sida', null, '2026-08-12',
 '200 km, exakt det område våra pisttal avser. Paradiski är ett större kort. 19.12.26–16.4.27.'),

('courchevel', '2026/2027', 'EUR', 82.00, 421.00, 'Les 3 Vallées',
 'skiresort.com', 'ortens egen sida', null, '2026-08-12',
 'Samma kort och pris som Méribel och Val Thorens, precis som pist- och lifttalen är samma. Dagspriset är ungefärligt och kommer från 013.'),

('meribel', '2026/2027', 'EUR', 82.00, 421.00, 'Les 3 Vallées',
 'skiresort.com', 'ortens egen sida', null, '2026-08-12',
 'Se courchevel.'),

('val-thorens', '2026/2027', 'EUR', 82.00, 421.00, 'Les 3 Vallées',
 'skiresort.com', 'ortens egen sida', null, '2026-08-12',
 'Se courchevel.'),

-- ── Italien ───────────────────────────────────────────────────────────

('livigno', '2026/2027', 'EUR', 74.50, 374.50, 'Skipass Livigno',
 'ortens egen sida', 'ortens egen sida',
 'https://www.livigno.eu/hubfs/tariffe_26-27.pdf', '2026-08-25',
 'ALTA STAGIONE 30.1–29.3.27, bandet v9 ligger i. PDF:en ligger i HubSpots filarea och länkas inte från sommarsidorna.'),

('madonna-di-campiglio', '2025/2026', 'EUR', 85.00, 424.00, 'SkiArea Campiglio Dolomiti di Brenta',
 'ortens egen sida', 'ortens egen sida', null, '2026-08-12',
 'Priset gäller 25/26 — 26/27 var inte publicerat. Söndagsregel: +10 € om kortet innehåller en söndag, vilket en svensk vecka nästan alltid gör. Listpriset lagras.'),

-- ── Schweiz ───────────────────────────────────────────────────────────

('zermatt', '2026/2027', 'CHF', 104.00, 432.00, 'Internationellt kort Zermatt–Cervinia',
 'ortens egen sida', 'ortens egen sida', null, '2026-08-12',
 'Det internationella kortet ger våra 322 km. Zermatt ensamt kostar 89 / 384.'),

('verbier', '2026/2027', 'CHF', 94.00, 409.00, '4 Vallées',
 'ortens egen sida', 'ortens egen sida', null, '2026-08-12',
 '412 km, samma som våra tal. Verbier–Tzoumaz ensamt kostar 86 / 374.'),

('saas-fee', '2026/2027', 'CHF', 84.00, 413.00, 'Saas-Fee-kortet',
 'ortens egen sida', 'ortens egen sida', null, '2026-08-12',
 'Saas-Fee + Saas-Almagell. Destination-kortet gäller hela Saastal och är en annan produkt. En söksammanfattning påstod 336 CHF där ortens egen sida säger 413.'),

-- ── Sverige ───────────────────────────────────────────────────────────

('are', '2026/2027', 'SEK', 759.00, 3744.00, 'SkiStar Åre',
 'ortens egen sida', 'ortens egen sida', null, '2026-08-12',
 'Ur bokningskalendern för startdag 1 mars 2027.'),

('salen', '2026/2027', 'SEK', 650.00, 3126.00, 'SkiStar Sälen',
 'ortens egen sida', 'ortens egen sida', null, '2026-08-12',
 'Veckokortet inkluderar två skiddagar i Trysil.'),

('riksgransen', '2025/2026', 'SEK', 520.00, 2547.00, 'Björkliden + Riksgränsen',
 'ortens egen sida', 'ortens egen sida', null, '2026-08-12',
 'Priset gäller 25/26. 5 dagar 2 195 + extradag 352; orten har ingen egen sexdagarsrad. Kortet gäller båda orterna medan våra 21 km avser Riksgränsen ensamt — orten säljer inget kort som bara gäller den egna sidan.'),

-- ── Norge ─────────────────────────────────────────────────────────────

('trysil', '2026/2027', 'NOK', 775.00, 3806.00, 'SkiStar Trysil',
 'ortens egen sida', 'ortens egen sida', null, '2026-08-12',
 'Hämtat på SkiStars norska sida. Samma kort kostar 3 739 SEK på den svenska — att lagra det vore att lagra SkiStars växelkurs.'),

('hemsedal', '2026/2027', 'NOK', 745.00, 3769.00, 'SkiStar Hemsedal',
 'ortens egen sida', 'ortens egen sida', null, '2026-08-12',
 'Hämtat på SkiStars norska sida. Samma kort kostar 3 702 SEK på den svenska.'),

('myrkdalen', '2026/2027', 'NOK', 660.00, 2620.00, '6–8 sammanhängande dagar',
 'ortens egen sida', 'ortens egen sida', null, '2026-08-25',
 'Kapat pris: 6, 7 och 8 dagar kostar alla 2 620, så kvoten blir 3,97. Valfria dagar kostar 3 050.'),

('voss', '2026/2027', 'NOK', 675.00, 2990.00, '6-8 dagerskort',
 'ortens egen sida', 'ortens egen sida',
 'https://booking.vossresort.no', '2026-08-25',
 'Sammanhängande dagar, kvällsåkning och gondol ingår. Platt 2 990 hela 15–28.2.27. Dagspriset växlar med veckodag: 675 vardag, 720 helg — vardagspriset lagras.'),

('geilo', '2025/2026', 'NOK', 693.00, 2871.00, '6–8 dagar',
 'ortens egen sida', 'ortens egen sida', null, '2026-08-12',
 'Priset gäller 25/26 — 26/27 var inte publicerat. Geilo släpper enligt egen uppgift i september 2026.');

commit;


-- ── Efterkontroll ─────────────────────────────────────────────────────
--
-- 1. Tjugotre rader, fördelade på två säsonger:
--
--      SELECT season, count(*) FROM lift_pass_prices
--      GROUP BY season ORDER BY season;
--
--      Förväntat: 2025/2026 → 4, 2026/2027 → 19.
--
-- 2. De fyra som är 25/26 ska vara exakt dessa, och det är dem nästa års
--    artikel måste hoppa över eller märka ut:
--
--      SELECT resort_slug FROM lift_pass_prices
--      WHERE season = '2025/2026' ORDER BY resort_slug;
--
--      Förväntat: geilo, madonna-di-campiglio, riksgransen, st-anton.
--
-- 3. Beloppen ska stämma med resorts när decimalerna rundas tillbaka.
--    Fyra tal på tre rader har en halv enhet som heltalskolumnen kapade
--    — Söldens dagspris, Alpe d'Huez veckopris och båda Livignos — och
--    de ska rundas rätt igen. Enda raden som ska bli kvar i utfallet är
--    St. Anton, vars dagspris står tomt med flit. Det här är kontrollen
--    av att inget tal skrevs av fel på vägen in:
--
--      SELECT p.resort_slug,
--             r.lift_pass_day_eur  AS kol_dag,   p.day_price,
--             r.lift_pass_week_eur AS kol_vecka, p.week_price
--      FROM lift_pass_prices p
--      JOIN resorts r ON r.slug = p.resort_slug
--      WHERE r.lift_pass_day_eur  IS DISTINCT FROM round(p.day_price)
--         OR r.lift_pass_week_eur IS DISTINCT FROM round(p.week_price)
--      ORDER BY p.resort_slug;
--
--      Förväntat: enbart st-anton.
--
-- 4. De sju orter som medvetet saknar rad ska vara just de sju:
--
--      SELECT r.slug FROM resorts r
--      LEFT JOIN lift_pass_prices p ON p.resort_slug = r.slug
--      WHERE r.published AND p.id IS NULL ORDER BY r.slug;
--
--      Förväntat: chamonix, cortina-d-ampezzo, grandvalira, hemavan,
--      levi, mayrhofen, ruka.
--
-- 5. Valutan ska vara ortens egen, inte euro rakt igenom:
--
--      SELECT currency, count(*) FROM lift_pass_prices
--      GROUP BY currency ORDER BY currency;
--
--      Förväntat: CHF 3, EUR 12, NOK 5, SEK 3.
--
-- 6. Anon-nyckeln ska kunna läsa tabellen — annars kan sajten aldrig
--    rendera serien:
--
--      SET ROLE anon; SELECT count(*) FROM lift_pass_prices; RESET ROLE;
--
--      Förväntat: 23.
