
-- (Raden ovan är avsiktligt tom: tappas första tecknet vid kopiering
--  spelar det då ingen roll.)
-- 005 · Verklig restid per ort
--
-- Bakgrund
--   "Ungefärlig restid" räknades fram ur airport_distance_km i trappsteg:
--   under 200 km gav "2–2,5 tim" oavsett om vägen var motorväg eller
--   serpentin. Formeln blev fel just där restiden betyder mest.
--
--   Värst för Zermatt: rutan angav en biltransfer till en by dit man
--   inte får köra. Resan den beskrev går inte att genomföra.
--
-- Lösning
--   transfer_minutes lagrar den verkliga restiden från närmaste
--   flygplats, transfer_note hur man tar sig dit. Koden faller tillbaka
--   på den gamla uppskattningen så länge fältet är tomt, så orterna kan
--   fyllas i omgångar utan att sidan går sönder däremellan.
--
--   airport_distance_km behålls — den säger något eget om avstånd, och
--   den används inte längre för att gissa tid.

begin;

alter table public.resorts
  add column if not exists transfer_minutes smallint,
  add column if not exists transfer_note    text;

comment on column public.resorts.transfer_minutes is
  'Verklig restid i minuter från nearest_airport. Null = koden uppskattar ur avståndet.';
comment on column public.resorts.transfer_note is
  'Hur man tar sig dit, t.ex. "med bil" eller "med tåg — byn är bilfri".';

-- ── Omgång 1 ───────────────────────────────────────────────────────

-- Genève–Zermatt går med tåg via Visp och Täsch. Privatbilar släpps
-- inte in i byn, så det finns ingen biltransfer att ange.
update public.resorts set
  transfer_minutes = 210,
  transfer_note    = 'med tåg — byn är bilfri'
where slug = 'zermatt';

update public.resorts set
  transfer_minutes = 120,
  transfer_note    = 'med bil'
where slug = 'verbier';

-- Serpentinvägen upp till 2 300 m gör resan längre än avståndet antyder;
-- den gamla formeln gissade 2–2,5 tim.
update public.resorts set
  transfer_minutes = 180,
  transfer_note    = 'med bil'
where slug = 'val-thorens';

update public.resorts set
  transfer_minutes = 150,
  transfer_note    = 'med bil'
where slug = 'courchevel';

-- Méribel stod som Grenoble. Genève är den praktiska porten för svenska
-- resenärer och är redan angiven för de två andra orterna i Les 3
-- Vallées — tre orter i samma dal bör inte ha olika utgångspunkt.
-- Vill du hellre ha Chambéry, som ligger närmare rent geografiskt,
-- är det en rad att ändra.
update public.resorts set
  nearest_airport     = 'Genève',
  airport_distance_km = 180,
  transfer_minutes    = 150,
  transfer_note       = 'med bil'
where slug = 'meribel';

-- ── Säsong i Les 3 Vallées ─────────────────────────────────────────
-- Courchevel och Méribel stod som december–april medan Val Thorens
-- stod som november–maj, trots gemensamt liftsystem och liftkort.
-- skiresort.com anger mitten av november till början av maj för hela
-- området.
update public.resorts set
  season_start_month = 11,
  season_end_month   = 5
where slug in ('courchevel', 'meribel', 'val-thorens');

commit;

-- ── Kontroll ────────────────────────────────────────────────────────
--   select slug, nearest_airport, airport_distance_km,
--          transfer_minutes, transfer_note,
--          season_start_month, season_end_month
--   from public.resorts
--   where transfer_minutes is not null order by slug;
--
-- Återstår att fylla i för 27 orter. Tills dess uppskattar koden ur
-- avståndet, precis som förut:
--   select count(*) from public.resorts
--   where published and transfer_minutes is null;
