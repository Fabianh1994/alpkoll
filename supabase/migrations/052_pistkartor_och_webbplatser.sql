-- 052 · Pistkartor och officiella webbplatser som saknades eller var fel
--
-- Fabian 2026-11-20: "Zell am See pistkarta funkar inte."
--
-- Orsak: de 21 orter som lades in i 039–045 och 050 fick aldrig
-- piste_map_url eller resort_url. Ortsidan bygger pistkartekortet som
-- <a href={piste_map_url || resort_url}>, så när båda var NULL blev kortet
-- en länk utan adress, och knappen "Ortens officiella webbplats" likaså.
-- Ett klick gjorde ingenting.
--
-- Kontroll 2026-11-20 av alla 50 publicerade ortsidor på alpkoll.se:
--   21 orter: kortet saknade adress helt (avsnitt 1 nedan).
--    5 orter: adressen fanns men ledde fel (avsnitt 2).
--   24 orter: kartlänken fungerar och lämnas som den är.
--
-- Varje ny adress är öppnad 2026-11-20 och svarade 200 med en sidtitel
-- som handlar om pistkartan eller skidområdet. Tre sajter stänger ute
-- skript (titlis.ch, dolomitisuperski.com, calameo.com) och är lästa via
-- sökindex i stället. Officiell karta i första hand; ortens egen sida om
-- skidområdet när kartan bara finns inbäddad där.
--
-- Kodsidan (app/resort/[slug]/page.js) visar från och med samma PR inte
-- längre kortet eller knappen när adressen saknas. Den här filen gör att
-- de syns igen, nu med fungerande länkar.
--
-- Kör i Supabase SQL Editor, före eller efter merge — ordningen spelar
-- ingen roll. Allt körs i en transaktion.

begin;


-- ── 1. Orter som saknade både pistkarta och webbplats ────────────────

update public.resorts r
set piste_map_url = v.karta,
    resort_url    = v.webb
from (values
  ('alta-badia',         'https://www.altabadia.org/en/ski-area-alta-badia-dolomites',                                                         'https://www.altabadia.org/en'),
  ('bad-gastein',        'https://www.skigastein.com/en/lifts-ski-runs-winter/',                                                                'https://www.skigastein.com/en/'),
  ('branas',             'https://www.branas.se/pistkarta/',                                                                                   'https://www.branas.se/'),
  ('cervinia',           'https://www.cervinia.it/en/skirama',                                                                                 'https://www.cervinia.it/en'),
  ('engelberg',          'https://www.titlis.ch/en/activities/skiing',                                                                         'https://www.engelberg.ch/en/'),
  ('funasfjallen',       'https://www.funasfjallen.se/pistkartor/',                                                                            'https://www.funasfjallen.se/'),
  ('hafjell',            'https://www.alpinco.com/en/hafjell/piste-map',                                                                       'https://www.alpinco.com/en/hafjell'),
  ('idre-fjall',         'https://www.idrefjall.se/om-oss/information/kartor/#pistkarta',                                                      'https://www.idrefjall.se/'),
  ('klappen',            'https://www.klappen.se/skidakning/backar-och-liftar/pistkarta/',                                                     'https://www.klappen.se/'),
  ('la-plagne',          'https://en.la-plagne.com/discover/ski-area/piste-map',                                                               'https://en.la-plagne.com/'),
  ('laax',               'https://www.laax.com/en/map',                                                                                        'https://www.laax.com/en'),
  ('lech-zuers',         'https://winter.intermaps.com/skiarlberg?lang=en',                                                                    'https://www.lechzuers.com/en'),
  ('les-deux-alpes',     'https://explore.les2alpes.com/en/map',                                                                               'https://www.les2alpes.com/en'),
  ('obergurgl',          'https://www.gurgl.com/en/activities/winter/skiing-snowboarding/ski-area-information/ski-area-map-lifts-slopes',      'https://www.gurgl.com/en'),
  ('saalbach',           'https://www.saalbach.com/en/winter/ski-resort/piste-map',                                                            'https://www.saalbach.com/en'),
  ('serre-chevalier',    'https://www.serre-chevalier.com/en/ski-area/interactive-trail-map',                                                  'https://www.serre-chevalier.com/en'),
  ('st-moritz',          'https://www.mountains.ch/en/facilities',                                                                             'https://www.stmoritz.com/en'),
  ('val-d-isere',        'https://www.valdisere.com/en/live/ski-map/',                                                                         'https://www.valdisere.com/en/'),
  ('val-gardena',        'https://www.valgardena.it/en/winter-holidays-dolomites/ski-resort-val-gardena/',                                     'https://www.valgardena.it/en/'),
  ('vemdalen',           'https://www.skistar.com/en/ski-destinations/vemdalen/winter-in-vemdalen/piste-maps2/',                               'https://www.skistar.com/vemdalen'),
  ('zell-am-see-kaprun', 'https://www.zellamsee-kaprun.com/en/sport/winter/skimap',                                                            'https://www.zellamsee-kaprun.com/en')
) as v(slug, karta, webb)
where r.slug = v.slug;


-- ── 2. Orter där kartlänken fanns men ledde fel ──────────────────────
--
-- Ischgl:     pekade på startsidan. Pistkartan har en egen sida.
-- Verbier:    nollades i 018 när bara sommarkartan fanns. Vinterkartan
--             är uppe igen, så fallbacken till verbier.ch behövs inte.
-- Saas-Fee:   den gamla sidan /activities/winter/ski-area slussar nu
--             till startsidan. Kartan har flyttat.
-- Les Arcs:   en.lesarcs.com/piste-map slussar till en Calaméo-broschyr
--             med bykartor över Bourg-Saint-Maurice, inte pistkartan.
--             Liftbolagets sida har kartan och öppna liftar.
-- Madonna:    skiarea.it har ett certifikat som inte gäller för adressen,
--             så webbläsaren varnar. Liftbolaget Funivie Campiglio har
--             flyttat kartan till ski.it.

update public.resorts r
set piste_map_url = v.karta
from (values
  ('ischgl',               'https://www.ischgl.com/en/winter/silvretta-arena/piste-map'),
  ('verbier',              'https://www.verbier4vallees.ch/en/useful-information/interactive-map-winter'),
  ('saas-fee',             'https://www.saas-fee.ch/en/winter-in-the-saas-valley/piste-map'),
  ('les-arcs',             'https://www.lesarcs-peiseyvallandry.com/en/lifts-opening-slopes-status'),
  ('madonna-di-campiglio', 'https://www.ski.it/en/info-live/interactive-ski-map')
) as v(slug, karta)
where r.slug = v.slug;

commit;


-- ── Efterkontroll ─────────────────────────────────────────────────────
--
-- Ska ge noll rader: inga publicerade orter utan pistkarta eller webbplats.
--
--   SELECT slug FROM resorts
--   WHERE published AND (piste_map_url IS NULL OR resort_url IS NULL);
