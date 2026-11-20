-- 051 · Bilder till Kläppen och Funäsfjällen, och orterna visas.
--
-- Orterna lades in dolda i 050. Bilderna valdes av Fabian 2026-11-20.
-- Position 0 är hjältebilden. Licens och fotograf är lästa på filsidan
-- samma dag.
--
-- Booking: Kläppen och Funäsfjällen får ingen Booking-knapp än
-- (null i BOOKING_SOK, lib/booking.js). Kläppen säljer sitt boende själv;
-- Funäsfjällens söksträng är inte provad.
--
-- Kör efter 050, i Supabase SQL Editor. Allt körs i en transaktion.

begin;

insert into public.resort_images
  (resort_slug, position, url, width, height, source, source_page,
   license, license_url, photographer, attribution_required, alt)
values
-- ── klappen ──
('klappen', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Kl%C3%A4ppen.jpg/1920px-Kl%C3%A4ppen.jpg', 1920, 1079, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Kl%C3%A4ppen.jpg',
 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0', 'Marcus Hansson', true, 'Barn kastar snö i backen i Kläppen en solig dag'),
-- ── funasfjallen ──
('funasfjallen', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/T%C3%A4nndalen_20240318.jpg/1920px-T%C3%A4nndalen_20240318.jpg', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:T%C3%A4nndalen_20240318.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Helena Hansson', true, 'Tänndalen-skylten i snön, med fjällen bakom'),
('funasfjallen', 1, 'https://images.unsplash.com/photo-1611659179711-b679d3f7e394?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/6q7QDzkJSZA',
 'Unsplash-licens', 'https://unsplash.com/license', 'Philip Myrtorp', false, 'Snötäckta vidder ovanför Funäsdalen')
on conflict (resort_slug, position) do nothing;

-- Hjältebilden på alla ytor: image_url följer position 0.
update public.resorts r
set image_url = i.url
from public.resort_images i
where i.resort_slug = r.slug and i.position = 0
  and r.slug in ('klappen', 'funasfjallen');

-- Orterna visas.
update public.resorts set published = true
where slug in ('klappen', 'funasfjallen');

commit;

-- Kontroll efteråt:
--   select slug, published, image_url is not null as bild from resorts
--   where slug in ('klappen', 'funasfjallen');
--   Förväntat: 2 rader, published = true och bild = true.
