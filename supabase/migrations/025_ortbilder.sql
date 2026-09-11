
-- 025 — ortbilder: hjältebild och galleri per ort, med kreditering
--
-- Fram till nu bar varje ort en enda bild i resorts.image_url, utan fotograf
-- och utan licens. Tjugo av de tjugosex bilderna från Wikimedia Commons stod
-- under licenser som kräver att fotografen namnges, och ingen gjorde det.
-- Fyra bilder var dessutom hotlänkade från andra företags servrar, och åtta
-- orter visade en tumnagel på 330 px som helskärmsbild.
--
-- Den här migrationen lägger en rad per bild i en egen tabell: 150 bilder
-- för 29 orter, 82 från Wikimedia Commons och 68 från Unsplash,
-- varav 39 kräver kreditering. Urvalet gjordes av Fabian 2026-09-11 bland
-- 610 fria kandidater; alt-texterna är skrivna efter vad varje bild visar.
--
--
-- ── Beslut som inte syns i schemat ────────────────────────────────────
--
-- 1. POSITION 0 ÄR HJÄLTEBILDEN. resorts.image_url sätts till samma adress
--    längst ner, så att startsidans kort, jämförelsesidorna och ortsidan
--    visar samma bild. Ortsidan lägger krediteringen på hjältebilden bara
--    när adresserna är desamma.
--
-- 2. ADRESSERNA PEKAR PÅ ORIGINALEN. next/image hämtar och skalar dem, så
--    Alpkoll lagrar inga egna kopior. Commons-original större än 1920 px
--    lagras som Wikimedias tumnagel i 1920 — 2560 är ingen standardbredd och
--    ger 400, och 3840 stryps med 429 när Wikimedia måste skapa den.
--    Unsplash-adresserna bär ?w=2560 av samma skäl: originalen är upp till
--    6000 px.
--
-- 3. KREDITERINGEN FÖLJER LICENSEN. attribution_required kommer ur Commons
--    egen metadata. Fotografens namn är rensat där fältet bar något annat —
--    Flickr-importens ortsangivelse, en panoramanot eller en hel
--    licenstext. Unsplash kräver ingen kreditering men namnet står med.
--
-- 4. TRE ORTER HAR INGET URVAL. Trysil och Riksgränsen behåller sin
--    nuvarande bild, nu med licens och fotograf. Myrkdalen har ingen rad:
--    dess bild är hotlänkad från skiresort.info och har ingen licens vi kan
--    belägga. image_url lämnas orörd för Myrkdalen.
--
-- Koden läser tabellen med en tom lista som reserv, så ortsidan fungerar
-- likadant före och efter migrationen. Kör den gärna före merge.


begin;

create table if not exists public.resort_images (
  id                   bigint      generated always as identity primary key,
  resort_slug          text        not null,
  position             smallint    not null,
  url                  text        not null,
  width                integer,
  height               integer,
  source               text        not null,
  source_page          text        not null,
  license              text        not null,
  license_url          text,
  photographer         text,
  attribution_required boolean     not null default false,
  alt                  text        not null,

  constraint resort_images_position check (position >= 0),
  constraint resort_images_kalla check (source in ('wikimedia', 'unsplash')),
  constraint resort_images_unik unique (resort_slug, position),
  constraint resort_images_kredit_komplett
    check (not attribution_required or (photographer is not null and license_url is not null))
);

comment on table public.resort_images is
  'En bild per rad: position 0 ar hjaltebilden, resten galleriet. Kalla, licens och fotograf per bild.';
comment on column public.resort_images.attribution_required is
  'Sant nar licensen kraver att fotografen namnges dar bilden visas. Hamtat ur Commons metadata.';
comment on column public.resort_images.url is
  'Adress till originalet eller Wikimedias tumnagel i 1920 px. next/image skalar vidare.';

alter table public.resort_images
  drop constraint if exists resort_images_ort_finns;

alter table public.resort_images
  add constraint resort_images_ort_finns
  foreign key (resort_slug) references public.resorts(slug) on update cascade;

create index if not exists resort_images_ort
  on public.resort_images (resort_slug, position);

-- Läsbar för alla, skrivbar för ingen utom via SQL Editor. Samma
-- exponering som resorts och lift_pass_prices.
alter table public.resort_images enable row level security;

drop policy if exists resort_images_las on public.resort_images;
create policy resort_images_las
  on public.resort_images for select
  to anon, authenticated
  using (true);


insert into public.resort_images
  (resort_slug, position, url, width, height, source, source_page,
   license, license_url, photographer, attribution_required, alt)
values
-- ── alpe-d-huez ───────────────────────────────────────────────────────

('alpe-d-huez', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/View_of_Alpe_d%27Huez_from_Marcel%27s_Farm%2C_Huez%2C_2026.jpg/1920px-View_of_Alpe_d%27Huez_from_Marcel%27s_Farm%2C_Huez%2C_2026.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:View_of_Alpe_d%27Huez_from_Marcel%27s_Farm,_Huez,_2026.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'DimiTalen', false, 'Alpe d''Huez sett från pisten, med byn nedanför och snöklädda toppar bakom'),

('alpe-d-huez', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/View_of_central_Alpe_d%27Huez_from_C%C3%B4tes_Souveraines%2C_Huez%2C_2026.jpg/1920px-View_of_central_Alpe_d%27Huez_from_C%C3%B4tes_Souveraines%2C_Huez%2C_2026.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:View_of_central_Alpe_d%27Huez_from_C%C3%B4tes_Souveraines,_Huez,_2026.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'DimiTalen', false, 'Byn Alpe d''Huez uppifrån, en tätt bebyggd sluttning med hotell och lägenhetshus i snö'),

('alpe-d-huez', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Les_Jeux_area_of_Alpe_d%27Huez%2C_Huez%2C_2026.jpg/1920px-Les_Jeux_area_of_Alpe_d%27Huez%2C_Huez%2C_2026.jpg', 1920, 1075, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Les_Jeux_area_of_Alpe_d%27Huez,_Huez,_2026.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'DimiTalen', false, 'Breda pister på fjällsidan ovanför Alpe d''Huez'),

('alpe-d-huez', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Centre_commercial_Les_Bergers%2C_Alpe_d%27Huez%2C_Huez%2C_2026.jpg/1920px-Centre_commercial_Les_Bergers%2C_Alpe_d%27Huez%2C_Huez%2C_2026.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Centre_commercial_Les_Bergers,_Alpe_d%27Huez,_Huez,_2026.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'DimiTalen', false, 'Gågatan i Alpe d''Huez med skiduthyrning, kaféer och folk i solen'),

('alpe-d-huez', 4, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/R%C3%A9sidence_2000%2C_Alpe_d%27Huez%2C_Huez%2C_2026.jpg/1920px-R%C3%A9sidence_2000%2C_Alpe_d%27Huez%2C_Huez%2C_2026.jpg', 1920, 1161, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:R%C3%A9sidence_2000,_Alpe_d%27Huez,_Huez,_2026.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'DimiTalen', false, 'Långt lägenhetshus i trä och betong vid pisten i Alpe d''Huez'),

('alpe-d-huez', 5, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/H%C3%B4tel_Le_D%C3%B4me%2C_Alpe_d%27Huez%2C_Huez%2C_2026.jpg/1920px-H%C3%B4tel_Le_D%C3%B4me%2C_Alpe_d%27Huez%2C_Huez%2C_2026.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:H%C3%B4tel_Le_D%C3%B4me,_Alpe_d%27Huez,_Huez,_2026.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'DimiTalen', false, 'Moderna hotell- och lägenhetshus kring en öppen plats i Alpe d''Huez'),

-- ── are ───────────────────────────────────────────────────────────────

('are', 0, 'https://images.unsplash.com/photo-1641799540196-fe49811e048e?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/xlUxyexDTbA',
 'Unsplash-licens', 'https://unsplash.com/license', 'Hendrik Morkel', false, 'Kabinbanan på Åreskutan i gryningsljus, med nedisade liftstolpar och dimma över dalen'),

('are', 1, 'https://images.unsplash.com/photo-1465427017340-dcc817cc0c30?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/X-jaQtzAPS0',
 'Unsplash-licens', 'https://unsplash.com/license', 'Dmitriy Karfagenskiy', false, 'Åreskutan i rosa kvällsljus, med snötyngd skog och stugor nedanför'),

('are', 2, 'https://images.unsplash.com/photo-1602257061058-5a5e07d7f716?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/tkHxUga1ozc',
 'Unsplash-licens', 'https://unsplash.com/license', 'Håkon Grimstad', false, 'Pister genom skogen på fjällsidan i Åre i kvällssol'),

('are', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Mountains_%C3%85re_%287014326713%29.jpg/1920px-Mountains_%C3%85re_%287014326713%29.jpg', 1920, 1275, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Mountains_%C3%85re_(7014326713).jpg',
 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0', 'larsjuh', true, 'Äldre hotellbyggnader i Åre by med fjället och backarna bakom'),

('are', 4, 'https://images.unsplash.com/photo-1582641643642-e3c7b0c30392?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/SB7lO6VZzjI',
 'Unsplash-licens', 'https://unsplash.com/license', 'Peter van der Meulen', false, 'Molnhav över dalen sett från fjället i Åre, med en liftmast i förgrunden'),

('are', 5, 'https://images.unsplash.com/photo-1610659962938-0e700a88cda1?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/D0Jxh96WLk0',
 'Unsplash-licens', 'https://unsplash.com/license', 'Mikael Björnson', false, 'Solnedgång över fjällen från toppen av en pist i Åre'),

-- ── chamonix ──────────────────────────────────────────────────────────

('chamonix', 0, 'https://images.unsplash.com/photo-1520853225856-e87762ef8c55?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/__sQnsCYj_I',
 'Unsplash-licens', 'https://unsplash.com/license', 'Kasya Shahovskaya', false, 'Aiguille du Midi med utsiktsstationen på toppen och Chamonixdalen långt nedanför'),

('chamonix', 1, 'https://images.unsplash.com/photo-1689861086072-9a2c8a0edc8f?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/BuZGsjwmYjU',
 'Unsplash-licens', 'https://unsplash.com/license', 'Meizhi Lang', false, 'Kvällsstämning vid klocktornet på torget i Chamonix, med de spetsiga topparna bakom'),

('chamonix', 2, 'https://images.unsplash.com/photo-1701045855437-e4d0cba3c362?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/u5JUXp3Lfz4',
 'Unsplash-licens', 'https://unsplash.com/license', 'Hongbin', false, 'Kabinbanan upp mot Aiguille du Midi framför snöklädda toppar'),

('chamonix', 3, 'https://images.unsplash.com/photo-1465220183275-1faa863377e3?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/JVtcrWcbj1c',
 'Unsplash-licens', 'https://unsplash.com/license', 'Chris Biron', false, 'Snöklädda sluttningar under bergskedjan ovanför Chamonix'),

('chamonix', 4, 'https://images.unsplash.com/photo-1667027234805-68e364df9870?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/OmIMYsumWJQ',
 'Unsplash-licens', 'https://unsplash.com/license', 'Tom Podmore', false, 'Blomsterlådor vid ån Arve i centrala Chamonix, med Mont Blanc-massivet bakom'),

('chamonix', 5, 'https://images.unsplash.com/photo-1514977406940-016107995b73?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/g3gIQlpovQg',
 'Unsplash-licens', 'https://unsplash.com/license', 'Victoire Joncheray', false, 'Hotell Alpina i Chamonix, ett högt trähus i flera våningar, i snöfall'),

-- ── cortina-d-ampezzo ─────────────────────────────────────────────────

('cortina-d-ampezzo', 0, 'https://images.unsplash.com/photo-1665317039412-e58541bbe47e?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/S6X1PIQT0ww',
 'Unsplash-licens', 'https://unsplash.com/license', 'Elena Crobu', false, 'Kyrktornet och huvudgatan i Cortina d''Ampezzo i kvällssol, med Dolomiterna bakom'),

('cortina-d-ampezzo', 1, 'https://images.unsplash.com/photo-1582155966507-5ed6351a7bce?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/VFmyG-1tqQ8',
 'Unsplash-licens', 'https://unsplash.com/license', 'Dario Morandotti', false, 'Klippformationen Cinque Torri i vinterskrud ovanför Cortina d''Ampezzo'),

('cortina-d-ampezzo', 2, 'https://images.unsplash.com/photo-1601287433320-a335372b3721?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/L7EJxDMFnkg',
 'Unsplash-licens', 'https://unsplash.com/license', 'Betty Subrizi', false, 'Hus och hotell i snö i utkanten av Cortina d''Ampezzo'),

('cortina-d-ampezzo', 3, 'https://images.unsplash.com/photo-1609908119408-c5f407e10d06?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/qvUR0Ns7uu8',
 'Unsplash-licens', 'https://unsplash.com/license', 'Secret Travel Guide', false, 'Skidåkare på pisten under Dolomiternas lodräta klippväggar vid Cortina d''Ampezzo'),

('cortina-d-ampezzo', 4, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Cortina_d%E2%80%99Ampezzo7.jpg/1920px-Cortina_d%E2%80%99Ampezzo7.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Cortina_d%E2%80%99Ampezzo7.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Ailita Liteva', true, 'Cortina d''Ampezzo i dalen med skogklädda berg och snöfläckiga toppar bakom'),

-- ── courchevel ────────────────────────────────────────────────────────

('courchevel', 0, 'https://images.unsplash.com/photo-1649421811395-5bfcf16cc37a?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/lDoujbHM3Qk',
 'Unsplash-licens', 'https://unsplash.com/license', 'Piotr Figlarz', false, 'Toppstationen i Courchevel framför snöklädda berg och ett molntäcke'),

('courchevel', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Courchevel_Moriond_from_Courchevel_Village.jpg/1920px-Courchevel_Moriond_from_Courchevel_Village.jpg', 1920, 1277, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Courchevel_Moriond_from_Courchevel_Village.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'DimiTalen', false, 'Courchevel genom snötyngd granskog en snöig dag'),

('courchevel', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Courchevel_February_03%2C_2017-6263_%2832836796696%29.jpg/1920px-Courchevel_February_03%2C_2017-6263_%2832836796696%29.jpg', 1920, 1024, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Courchevel_February_03,_2017-6263_(32836796696).jpg',
 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0', 'WASD42', true, 'Chaletbyggnader i trä längs en gata i Courchevel'),

('courchevel', 3, 'https://images.unsplash.com/photo-1649421810290-8808f00beea6?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/NfTv1c8_B3U',
 'Unsplash-licens', 'https://unsplash.com/license', 'Piotr Figlarz', false, 'En familj med skidor vid en utsiktspunkt ovanför pisterna i Courchevel'),

('courchevel', 4, 'https://images.unsplash.com/photo-1705518795105-e30886e8bc30?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/9qyX5I2YU6E',
 'Unsplash-licens', 'https://unsplash.com/license', 'Slim MARS', false, 'Snötäckta chaletar bland granar i Courchevel'),

('courchevel', 5, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Les_3_Vall%C3%A9es%2C_View_to_Courchevel_Moriond_-_panoramio_%282%29.jpg/1920px-Les_3_Vall%C3%A9es%2C_View_to_Courchevel_Moriond_-_panoramio_%282%29.jpg', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Les_3_Vall%C3%A9es,_View_to_Courchevel_Moriond_-_panoramio_(2).jpg',
 'CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0', 'qwesy qwesy', true, 'Gondolbanan över ett högt lägenhetshus i Courchevel, med dalen bakom'),

-- ── geilo ─────────────────────────────────────────────────────────────

('geilo', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Dronebilde_av_Geilo_GEO_02549_Foto_Paul_Lockhart.jpg/1920px-Dronebilde_av_Geilo_GEO_02549_Foto_Paul_Lockhart.jpg', 1920, 1190, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Dronebilde_av_Geilo_GEO_02549_Foto_Paul_Lockhart.jpg',
 'CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0', 'Randi Bygdestøl', true, 'Geilo uppifrån i blå timme, med upplysta pister och byn i dalen'),

('geilo', 1, 'https://images.unsplash.com/photo-1652229220022-60fa2c743ee6?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/8-rqYJUnKdI',
 'Unsplash-licens', 'https://unsplash.com/license', 'Benjamin Vang', false, 'Vidsträckt snöigt fjällandskap vid Geilo med en ensam stuga'),

('geilo', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/View_on_Geilo.jpg/1920px-View_on_Geilo.jpg', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:View_on_Geilo.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'DutchColours', true, 'Fjällstugor bland björkar med snöklädda vidder bakom Geilo'),

-- ── grandvalira ───────────────────────────────────────────────────────

('grandvalira', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Grandvalira_-_Pas_de_la_Casa_-_Grau_Roig_%283%29.jpg/1920px-Grandvalira_-_Pas_de_la_Casa_-_Grau_Roig_%283%29.jpg', 1920, 1281, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Grandvalira_-_Pas_de_la_Casa_-_Grau_Roig_(3).jpg',
 'CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0', 'Alberto-g-rovi', true, 'Liftbasen i Grandvalira med pister och Pyrenéernas toppar bakom'),

('grandvalira', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Grandvalira_-_Pas_de_la_Casa_-_Grau_Roig_%281%29.jpg/1920px-Grandvalira_-_Pas_de_la_Casa_-_Grau_Roig_%281%29.jpg', 1920, 1281, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Grandvalira_-_Pas_de_la_Casa_-_Grau_Roig_(1).jpg',
 'CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0', 'Alberto-g-rovi', true, 'Pister och en restaurang i trä vid liftbasen i Grandvalira'),

('grandvalira', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Panorama_Pas_de_la_Casa.jpg/1920px-Panorama_Pas_de_la_Casa.jpg', 1920, 505, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Panorama_Pas_de_la_Casa.jpg',
 'Public domain', null, 'Fred K', false, 'Breda pister på högplatån i Grandvalira'),

('grandvalira', 3, 'https://images.unsplash.com/photo-1600807817203-86ed0fd1e8c8?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/cDb3rcZadDM',
 'Unsplash-licens', 'https://unsplash.com/license', 'Alexander Tryastsyn', false, 'Kabinbanan över pisterna vid Soldeu i Grandvalira'),

('grandvalira', 4, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Grandvalira_Ski_Center_%28AND%29_2021.jpg/1920px-Grandvalira_Ski_Center_%28AND%29_2021.jpg', 1920, 1282, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Grandvalira_Ski_Center_(AND)_2021.jpg',
 'CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0', 'Alberto-g-rovi', true, 'Liftbasen i Grandvalira med flaggor och backar upp mot bergen'),

-- ── hemavan ───────────────────────────────────────────────────────────

('hemavan', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Hemavan%2C_Glidaren_piste_2.jpg/1920px-Hemavan%2C_Glidaren_piste_2.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Hemavan,_Glidaren_piste_2.jpg',
 'Public domain', null, 'Magnus Bäck', false, 'Nypistad backe i Hemavan med utsikt över kalfjället i motljus'),

('hemavan', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Hemavan%2C_top_of_Mellanliften_looking_up.jpg/1920px-Hemavan%2C_top_of_Mellanliften_looking_up.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Hemavan,_top_of_Mellanliften_looking_up.jpg',
 'Public domain', null, 'Magnus Bäck', false, 'Släpliften upp mot kalfjället i Hemavan'),

('hemavan', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Snowy_mountains_1%2C_Hemavan.jpg/1920px-Snowy_mountains_1%2C_Hemavan.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Snowy_mountains_1,_Hemavan.jpg',
 'Public domain', null, 'Magnus Bäck', false, 'Snöklädd fjälltopp över frostig björkskog vid Hemavan'),

('hemavan', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Hemavan%2C_top_of_Mellanliften_from_Kungsliften%27s_base.jpg/1920px-Hemavan%2C_top_of_Mellanliften_from_Kungsliften%27s_base.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Hemavan,_top_of_Mellanliften_from_Kungsliften%27s_base.jpg',
 'Public domain', null, 'Magnus Bäck', false, 'Öppen fjällsluttning med pister i Hemavan en solig dag'),

('hemavan', 4, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Hemavan_valley%2C_base_of_Kungsliften.jpg/1920px-Hemavan_valley%2C_base_of_Kungsliften.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Hemavan_valley,_base_of_Kungsliften.jpg',
 'Public domain', null, 'Magnus Bäck', false, 'Utsikt från en fjällstuga över dalen i Hemavan'),

('hemavan', 5, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Hemavan%2C_valley_from_Mellanbacken.jpg/1920px-Hemavan%2C_valley_from_Mellanbacken.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Hemavan,_valley_from_Mellanbacken.jpg',
 'Public domain', null, 'Magnus Bäck', false, 'Pist ovanför trädgränsen med utsikt över dalen i Hemavan'),

-- ── hemsedal ──────────────────────────────────────────────────────────

('hemsedal', 0, 'https://images.unsplash.com/photo-1735505767859-49d4ca3964cd?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/N5ntpTIvFuE',
 'Unsplash-licens', 'https://unsplash.com/license', 'Hannes Knutsson', false, 'Stolliften i Hemsedal med en snowboardåkare och dalen långt nedanför'),

('hemsedal', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Hemsedal_fraa_fly_1.jpg/1920px-Hemsedal_fraa_fly_1.jpg', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Hemsedal_fraa_fly_1.jpg',
 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0', 'Johan Simon Seland', true, 'Fjällen i Hemsedal uppifrån i vinterskrud, med pisterna på sluttningen'),

('hemsedal', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/View_from_Skarsnuten_-_panoramio.jpg/1920px-View_from_Skarsnuten_-_panoramio.jpg', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:View_from_Skarsnuten_-_panoramio.jpg',
 'CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0', 'Henrik Buhl', true, 'Snöklädda toppar ovanför Hemsedal'),

('hemsedal', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Hemsedal_skisenter.jpg/1920px-Hemsedal_skisenter.jpg', 1920, 553, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Hemsedal_skisenter.jpg',
 'CC BY-SA 2.0', 'https://creativecommons.org/licenses/by-sa/2.0', 'Siri', true, 'Pister genom skogen på fjällsidan i Hemsedal'),

('hemsedal', 4, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/View_from_Skarsnuten_-_facing_north_-_panoramio.jpg/1920px-View_from_Skarsnuten_-_facing_north_-_panoramio.jpg', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:View_from_Skarsnuten_-_facing_north_-_panoramio.jpg',
 'CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0', 'Henrik Buhl', true, 'Stugor i snötäckt skog under fjälltopparna i Hemsedal'),

-- ── ischgl ────────────────────────────────────────────────────────────

('ischgl', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Panorama_Ischgl_Idalp.jpg/1920px-Panorama_Ischgl_Idalp.jpg', 1920, 502, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Panorama_Ischgl_Idalp.jpg',
 'Public domain', null, 'Gürkan Sengün', false, 'Fullsatt solterrass vid pisten i Ischgl med snöklädda toppar bakom'),

('ischgl', 1, 'https://images.unsplash.com/photo-1663321060226-65c5c8c48636?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/rzdlQ1MvTW4',
 'Unsplash-licens', 'https://unsplash.com/license', 'Jennifer Jäger', false, 'Utsikt från kabinbanan över Paznauntalet och bergen kring Ischgl'),

('ischgl', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Ischgl_pists.jpg/1920px-Ischgl_pists.jpg', 1920, 1272, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Ischgl_pists.jpg',
 'Public domain', null, 'Gürkan Sengün', false, 'Skidområdet ovanför Ischgl med breda nedfarter mellan topparna'),

('ischgl', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Ischgl_2009_town.jpg/1920px-Ischgl_2009_town.jpg', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Ischgl_2009_town.jpg',
 'Public domain', null, 'Gürkan Sengün', false, 'Affärsgata i Ischgl med sportbutiker och hotell'),

('ischgl', 4, 'https://images.unsplash.com/photo-1618299723086-dca317f56e04?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/-RBBkEylA8Y',
 'Unsplash-licens', 'https://unsplash.com/license', 'Alexander Sinn', false, 'Orörd snö och frostiga granar på fjällsidan vid Ischgl'),

('ischgl', 5, 'https://images.unsplash.com/photo-1678125690470-87eb8e4de992?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/k3yFP2y_4D8',
 'Unsplash-licens', 'https://unsplash.com/license', 'Hans Ott', false, 'Kabinbana över skogen i dalen vid Ischgl'),

-- ── kitzbuehel ────────────────────────────────────────────────────────

('kitzbuehel', 0, 'https://images.unsplash.com/photo-1700142572634-150b3857e71d?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/6zXzmDC1OOI',
 'Unsplash-licens', 'https://unsplash.com/license', 'Kitzbühel', false, 'Stollift och pister på snöklädda toppar i skidområdet vid Kitzbühel'),

('kitzbuehel', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/6370_Kitzbuhel%2C_Austria_-_panoramio_%281%29.jpg/1920px-6370_Kitzbuhel%2C_Austria_-_panoramio_%281%29.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:6370_Kitzbuhel,_Austria_-_panoramio_(1).jpg',
 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'Michal Gorski', true, 'Kitzbühel i dalen sett från berget, med snöfläckiga sluttningar'),

('kitzbuehel', 2, 'https://images.unsplash.com/photo-1701720898136-59172d777e4b?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/VT6fiS_Msfg',
 'Unsplash-licens', 'https://unsplash.com/license', 'Shpëtim Ujkani', false, 'Färgglada fasader och juldekorationer i Kitzbühels gamla stad'),

('kitzbuehel', 3, 'https://images.unsplash.com/photo-1700142571819-910da809254e?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/gs52dmVmVv8',
 'Unsplash-licens', 'https://unsplash.com/license', 'Kitzbühel', false, 'Timrad fjällstuga i snö med utsikt mot bergen kring Kitzbühel'),

('kitzbuehel', 4, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Kitzb%C3%BChl%2C_Tirol%2C_im_Hintergrund_der_Hahnenkamm_%28Streif%29_%2811540575696%29.jpg/1920px-Kitzb%C3%BChl%2C_Tirol%2C_im_Hintergrund_der_Hahnenkamm_%28Streif%29_%2811540575696%29.jpg', 1920, 1411, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Kitzb%C3%BChl,_Tirol,_im_Hintergrund_der_Hahnenkamm_(Streif)_(11540575696).jpg',
 'CC BY-SA 2.0', 'https://creativecommons.org/licenses/by-sa/2.0', 'Heribert Pohl', true, 'Snötäckta hus i Kitzbühel under skogklädda backar'),

('kitzbuehel', 5, 'https://images.unsplash.com/photo-1695402933622-9021c04276ff?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/plwt-ERRi8I',
 'Unsplash-licens', 'https://unsplash.com/license', 'Benjamin Price', false, 'Stort vitt pensionat i snö med skogklädda berg bakom, Kitzbühel'),

-- ── les-arcs ──────────────────────────────────────────────────────────

('les-arcs', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Arc_1950_and_Arc_2000_from_Bois_de_l%27Ours_piste_%28middle%29.jpg/1920px-Arc_1950_and_Arc_2000_from_Bois_de_l%27Ours_piste_%28middle%29.jpg', 1920, 1170, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Arc_1950_and_Arc_2000_from_Bois_de_l%27Ours_piste_(middle).jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'DimiTalen', false, 'Byarna i Les Arcs från pisten, med en stollift i förgrunden'),

('les-arcs', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Arc_1950_and_Arc_2000_from_the_bottom_of_the_Bois_de_l%27Ours_slope%2C_Les_Arcs%2C_2018.jpg/1920px-Arc_1950_and_Arc_2000_from_the_bottom_of_the_Bois_de_l%27Ours_slope%2C_Les_Arcs%2C_2018.jpg', 1920, 1133, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Arc_1950_and_Arc_2000_from_the_bottom_of_the_Bois_de_l%27Ours_slope,_Les_Arcs,_2018.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'DimiTalen', false, 'Lägenhetshus vid liftbasen i Les Arcs med backarna ovanför'),

('les-arcs', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Arc_1950_with_Mont_Blanc_in_distance.jpg/1920px-Arc_1950_with_Mont_Blanc_in_distance.jpg', 1920, 1277, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Arc_1950_with_Mont_Blanc_in_distance.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'DimiTalen', false, 'Les Arcs vid pisten med dalen och snöklädda toppar bakom'),

('les-arcs', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Arc_2000_from_Marmottes_skilift.jpg/1920px-Arc_2000_from_Marmottes_skilift.jpg', 1920, 1276, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Arc_2000_from_Marmottes_skilift.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'DimiTalen', false, 'Lägenhetshus i Les Arcs vid en bred pist'),

('les-arcs', 4, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Arc_1950_and_Arc_2000_from_the_bottom_of_Edelweiss_piste%2C_2012.jpg/1920px-Arc_1950_and_Arc_2000_from_the_bottom_of_Edelweiss_piste%2C_2012.jpg', 1920, 1277, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Arc_1950_and_Arc_2000_from_the_bottom_of_Edelweiss_piste,_2012.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'DimiTalen', false, 'Skidåkare på väg ner mot byn i Les Arcs'),

('les-arcs', 5, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Arc_1950_from_beside_the_Cabriolet_2000_station.jpg/1920px-Arc_1950_from_beside_the_Cabriolet_2000_station.jpg', 1920, 1277, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Arc_1950_from_beside_the_Cabriolet_2000_station.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'DimiTalen', false, 'Chaletby i Les Arcs under en brant snöklädd topp'),

-- ── levi ──────────────────────────────────────────────────────────────

('levi', 0, 'https://images.unsplash.com/photo-1738168601625-b03a23f75a26?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/FR5oNZ1aJVI',
 'Unsplash-licens', 'https://unsplash.com/license', 'Janosch Jost', false, 'Frostklädd granskog och pisterna på fjället i Levi i vintersol'),

('levi', 1, 'https://images.unsplash.com/photo-1505281906411-28d444dd417e?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/TosJYG4Zimg',
 'Unsplash-licens', 'https://unsplash.com/license', 'Jouni Rajala', false, 'Norrsken över snötyngda träd på fjället i Levi'),

('levi', 2, 'https://images.unsplash.com/photo-1546205811-43c360b42f1c?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/HShd0DeMRIc',
 'Unsplash-licens', 'https://unsplash.com/license', 'Joakim Honkasalo', false, 'Utsikt över skog och myrar från fjället i Levi i skymning'),

('levi', 3, 'https://images.unsplash.com/photo-1738168601625-09608ad00d8d?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/UgUPOVcMSXM',
 'Unsplash-licens', 'https://unsplash.com/license', 'Janosch Jost', false, 'Stugby i snöig skog uppifrån i blå timme, Levi'),

-- ── livigno ───────────────────────────────────────────────────────────

('livigno', 0, 'https://images.unsplash.com/photo-1697555185463-9b4d11713270?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/b8QCJ5gYgjc',
 'Unsplash-licens', 'https://unsplash.com/license', 'Josef Pelikán', false, 'Breda, öppna pister på sluttningarna i Livigno'),

('livigno', 1, 'https://images.unsplash.com/photo-1773160498169-17d485e7c870?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/LzlDX-juwZ4',
 'Unsplash-licens', 'https://unsplash.com/license', 'Rich Martello', false, 'Huvudgatan i Livigno med snö på taken och fjällsidan bakom'),

('livigno', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Livigno-Valandrea_telecabine.JPG/1920px-Livigno-Valandrea_telecabine.JPG', 1920, 1435, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Livigno-Valandrea_telecabine.JPG',
 'Public domain', null, 'Abxbay', false, 'Livigno i den breda dalen, med pisterna ner mot byn'),

('livigno', 3, 'https://images.unsplash.com/photo-1737399845206-5d1a9fb696fc?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/JXxszcOJLBc',
 'Unsplash-licens', 'https://unsplash.com/license', 'Michaela Böhm (Římáková)', false, 'Livigno uppifrån, med byn i dalen och skidbackar genom skogen'),

('livigno', 4, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Alpine_village_landscape_%28Unsplash%29.jpg/1920px-Alpine_village_landscape_%28Unsplash%29.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Alpine_village_landscape_(Unsplash).jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'Mira Bozhko miroslava', false, 'Den snötäckta dalbotten i Livigno mellan höga toppar'),

('livigno', 5, 'https://images.unsplash.com/photo-1642841220705-b03194dd9de7?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/4b30K9Qw3Iw',
 'Unsplash-licens', 'https://unsplash.com/license', 'Hendrik Morkel', false, 'Turskidåkare i spår uppför en orörd snösluttning vid Livigno'),

-- ── madonna-di-campiglio ──────────────────────────────────────────────

('madonna-di-campiglio', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Vista_su_Madonna_di_Campiglio.jpg/1920px-Vista_su_Madonna_di_Campiglio.jpg', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Vista_su_Madonna_di_Campiglio.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Manuel righi', true, 'Madonna di Campiglio vid pistens fot, med Brentadolomiterna bakom'),

('madonna-di-campiglio', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Madonna_town.jpg/1920px-Madonna_town.jpg', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Madonna_town.jpg',
 'Public domain', null, 'Bunny', false, 'Hotell och kaféer vid torget i Madonna di Campiglio'),

('madonna-di-campiglio', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Fortini_Lift_-_panoramio_%283%29.jpg/1920px-Fortini_Lift_-_panoramio_%283%29.jpg', 1920, 1080, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Fortini_Lift_-_panoramio_(3).jpg',
 'CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0', 'Almondox', true, 'Stollift genom granskogen i Madonna di Campiglio'),

('madonna-di-campiglio', 3, 'https://images.unsplash.com/photo-1656705991498-3c8c70897190?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/ahMeM6L3fv4',
 'Unsplash-licens', 'https://unsplash.com/license', 'Marek Piwnicki', false, 'Brentadolomiternas klippor ovanför molnen'),

('madonna-di-campiglio', 4, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Madonna_snow.JPG/1920px-Madonna_snow.JPG', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Madonna_snow.JPG',
 'Public domain', null, 'Bunny', false, 'Pister på högplatån med utsikt mot bergskedjan, Madonna di Campiglio'),

-- ── mayrhofen ─────────────────────────────────────────────────────────

('mayrhofen', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/View_of_Mayrhofen_%28Austria%29.jpg/1920px-View_of_Mayrhofen_%28Austria%29.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:View_of_Mayrhofen_(Austria).jpg',
 'CC BY-SA 2.0', 'https://creativecommons.org/licenses/by-sa/2.0', 'atze67', true, 'Mayrhofen i kvällsljus med upplysta hotell och stjärnhimmel över bergen'),

('mayrhofen', 1, 'https://images.unsplash.com/photo-1679843005601-ec568556c274?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/m8Bn-WK4lDo',
 'Unsplash-licens', 'https://unsplash.com/license', 'Benno Bos', false, 'Snöklädd topp i Zillertal sedd från pisten ovanför Mayrhofen'),

('mayrhofen', 2, 'https://images.unsplash.com/photo-1679842995085-f7db087116d7?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/O3UtF2JC7kc',
 'Unsplash-licens', 'https://unsplash.com/license', 'Benno Bos', false, 'Gondol vid toppstationen ovanför Mayrhofen med bergen i Zillertal bakom'),

('mayrhofen', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Blick_Richtung_Mayrhofen_von_der_Ahorn-Talabfahrt_-_panoramio.jpg/1920px-Blick_Richtung_Mayrhofen_von_der_Ahorn-Talabfahrt_-_panoramio.jpg', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Blick_Richtung_Mayrhofen_von_der_Ahorn-Talabfahrt_-_panoramio.jpg',
 'CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0', 'qwesy qwesy', true, 'Zillertal med Mayrhofen i dalbotten, sett från berget'),

('mayrhofen', 4, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Panoramah%C3%BCtte_auf_dem_Ahorn_-_panoramio.jpg/1920px-Panoramah%C3%BCtte_auf_dem_Ahorn_-_panoramio.jpg', 1920, 963, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Panoramah%C3%BCtte_auf_dem_Ahorn_-_panoramio.jpg',
 'CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0', 'qwesy qwesy', true, 'Fjällrestaurang i trä med snowboards utanför, ovanför Mayrhofen'),

-- ── meribel ───────────────────────────────────────────────────────────

('meribel', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Looking_up_Le_Laitelet_and_L%27Hameau%2C_M%C3%A9ribel-Mottaret%2C_from_the_bottom_of_the_slopes.jpg/1920px-Looking_up_Le_Laitelet_and_L%27Hameau%2C_M%C3%A9ribel-Mottaret%2C_from_the_bottom_of_the_slopes.jpg', 1920, 1277, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Looking_up_Le_Laitelet_and_L%27Hameau,_M%C3%A9ribel-Mottaret,_from_the_bottom_of_the_slopes.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'DimiTalen', false, 'Skidåkare vid liftbasen i Méribel framför chalethotell'),

('meribel', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Snow-covered_M%C3%A9ribel-Centre.jpg/1920px-Snow-covered_M%C3%A9ribel-Centre.jpg', 1920, 1277, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Snow-covered_M%C3%A9ribel-Centre.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'DimiTalen', false, 'Méribel i snöfall, chaletbyn på sluttningen ovanför skogen'),

('meribel', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/M%C3%A9ribel_Village.jpg/1920px-M%C3%A9ribel_Village.jpg', 1920, 1277, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:M%C3%A9ribel_Village.jpg',
 'Public domain', null, 'Dimitri Neyt', false, 'Chaletar vid pistens slut i Méribel'),

('meribel', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/M%C3%A9ribel-Mottaret_from_the_piste_Martre.jpg/1920px-M%C3%A9ribel-Mottaret_from_the_piste_Martre.jpg', 1920, 1277, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:M%C3%A9ribel-Mottaret_from_the_piste_Martre.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'DimiTalen', false, 'Skidåkare på pisten ner mot chaletarna i Méribel'),

('meribel', 4, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Dent_de_Burgin_and_Le_Chatelet%2C_M%C3%A9ribel-Mottaret%2C_from_across_the_valley.jpg/1920px-Dent_de_Burgin_and_Le_Chatelet%2C_M%C3%A9ribel-Mottaret%2C_from_across_the_valley.jpg', 1920, 1277, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Dent_de_Burgin_and_Le_Chatelet,_M%C3%A9ribel-Mottaret,_from_across_the_valley.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'DimiTalen', false, 'Chaletbebyggelse vid pisterna på fjällsidan i Méribel'),

('meribel', 5, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Midway_station_Tougn%C3%A8te%2C_M%C3%A9ribel.jpg/1920px-Midway_station_Tougn%C3%A8te%2C_M%C3%A9ribel.jpg', 1920, 1277, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Midway_station_Tougn%C3%A8te,_M%C3%A9ribel.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'DimiTalen', false, 'Pist och liftstation med utsikt över bergen kring Méribel'),

-- ── riksgransen ───────────────────────────────────────────────────────

('riksgransen', 0, 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Riksgr%C3%A4nsen_ski_resort.jpg', 800, 487, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Riksgr%C3%A4nsen_ski_resort.jpg',
 'Public domain', null, 'Joru', false, 'Liftstation i snöyra på fjället i Riksgränsen'),

-- ── ruka ──────────────────────────────────────────────────────────────

('ruka', 0, 'https://images.unsplash.com/photo-1590461281761-bfb110874f2a?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/T4apmQNUhm8',
 'Unsplash-licens', 'https://unsplash.com/license', 'Ilya Shishikhin', false, 'Byn i Ruka med hotell och lägenhetshus nedanför fjällets pister'),

('ruka', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Rukatunturi.jpg/1920px-Rukatunturi.jpg', 1920, 536, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Rukatunturi.jpg',
 'CC BY-SA 2.0', 'https://creativecommons.org/licenses/by-sa/2.0', 'Timo Newton-Syms', true, 'Toppen i Ruka i kvällssol, med snötyngda träd i orange ljus'),

('ruka', 2, 'https://images.unsplash.com/photo-1590457226842-da02b74c5ff8?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/H1YPQdvlHJ8',
 'Unsplash-licens', 'https://unsplash.com/license', 'Ilya Shishikhin', false, 'Skidåkare och snowboardåkare i solnedgången på fjället i Ruka'),

('ruka', 3, 'https://images.unsplash.com/photo-1590461278405-4d87405259c5?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/l79zJPi1rm4',
 'Unsplash-licens', 'https://unsplash.com/license', 'Ilya Shishikhin', false, 'Stollift på fjällsidan i Ruka en klar dag'),

('ruka', 4, 'https://images.unsplash.com/photo-1590457559181-7485fde09a78?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/x53TvSEuyJI',
 'Unsplash-licens', 'https://unsplash.com/license', 'Ilya Shishikhin', false, 'Snötyngda granar längs en pist i Ruka i blå timme'),

('ruka', 5, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Kuusamo%2C_Finland_-_panoramio_%2825%29.jpg/1920px-Kuusamo%2C_Finland_-_panoramio_%2825%29.jpg', 1920, 1278, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Kuusamo,_Finland_-_panoramio_(25).jpg',
 'CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0', 'Tatiana Bashinskaya', true, 'Upplyst pist genom snötyngd skog i Ruka'),

-- ── saas-fee ──────────────────────────────────────────────────────────

('saas-fee', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/In_the_shadow_%2851697904033%29.jpg/1920px-In_the_shadow_%2851697904033%29.jpg', 1920, 1283, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:In_the_shadow_(51697904033).jpg',
 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0', 'Paolo Gamba', true, 'Saas-Fee i kvällsljus mellan lärkträd, med en solbelyst topp bakom'),

('saas-fee', 1, 'https://images.unsplash.com/photo-1646602207923-96a702084421?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/QxN4YKrxIIk',
 'Unsplash-licens', 'https://unsplash.com/license', 'corey catracho', false, 'Kabinbana över glaciären ovanför Saas-Fee'),

('saas-fee', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Saas-Fee_im_Winter_mit_Panorama.jpg/1920px-Saas-Fee_im_Winter_mit_Panorama.jpg', 1920, 1078, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Saas-Fee_im_Winter_mit_Panorama.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Daniel Reust', true, 'Saas-Fee i dalen under höga snöklädda toppar'),

('saas-fee', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Kugelpanorama_von_Saas-Fee_im_Februar_2026.jpg/1920px-Kugelpanorama_von_Saas-Fee_im_Februar_2026.jpg', 1920, 960, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Kugelpanorama_von_Saas-Fee_im_Februar_2026.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Reustli', true, 'Saas-Fee uppifrån, byn i snö omgiven av berg'),

('saas-fee', 4, 'https://images.unsplash.com/photo-1572177072675-f7ebe34128e7?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/inXCdqrh-c8',
 'Unsplash-licens', 'https://unsplash.com/license', 'Uwe Conrad', false, 'Den roterande restaurangen på Mittelallalin ovanför Saas-Fee'),

-- ── salen ─────────────────────────────────────────────────────────────

('salen', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Tand%C3%A5dalen.jpg/1920px-Tand%C3%A5dalen.jpg', 1920, 856, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Tand%C3%A5dalen.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'David Castor', false, 'Pister genom skogen på fjället i Sälen en klar vinterdag'),

('salen', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/E8-an.jpg/1920px-E8-an.jpg', 1920, 946, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:E8-an.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'David Castor', false, 'Skidåkare vid toppstationen för en stollift i Sälen'),

('salen', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Ravinbackarna.jpg/1920px-Ravinbackarna.jpg', 1920, 985, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Ravinbackarna.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'David Castor', false, 'Pister och snötyngda granar på kalfjället i Sälen'),

('salen', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Tr%C3%A4d_p%C3%A5_Hundfj%C3%A4llet.jpg/1920px-Tr%C3%A4d_p%C3%A5_Hundfj%C3%A4llet.jpg', 1920, 1053, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Tr%C3%A4d_p%C3%A5_Hundfj%C3%A4llet.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'David Castor', false, 'Snöskulpterade träd på kalfjället i Sälen'),

('salen', 4, 'https://images.unsplash.com/photo-1641556636878-601412881373?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/uVr9qzQfNRc',
 'Unsplash-licens', 'https://unsplash.com/license', 'Elwin de Witte', false, 'Stugor längs en snöig väg i skogen i Tandådalen, Sälen'),

('salen', 5, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Uppe_p%C3%A5_Hundfj%C3%A4llet.jpg/1920px-Uppe_p%C3%A5_Hundfj%C3%A4llet.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Uppe_p%C3%A5_Hundfj%C3%A4llet.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'David Castor', false, 'Ett ensamt snötyngt träd på fjällplatån i Sälen'),

-- ── solden ────────────────────────────────────────────────────────────

('solden', 0, 'https://images.unsplash.com/photo-1606051287351-b63602db1e85?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/QDgmWDGmuLQ',
 'Unsplash-licens', 'https://unsplash.com/license', 'Aleksandra Krasinska', false, 'Vägen upp mot skidområdet i Sölden, med hotell och snöklädda toppar'),

('solden', 1, 'https://images.unsplash.com/photo-1711281135064-7d3cf75263ef?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/PVpeYfVDWSM',
 'Unsplash-licens', 'https://unsplash.com/license', 'Bart Lambregts', false, 'Gondol över pisterna högt upp i skidområdet i Sölden'),

('solden', 2, 'https://images.unsplash.com/photo-1706812297929-9305e91d09a5?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/0_9Ry8KjeG0',
 'Unsplash-licens', 'https://unsplash.com/license', 'Aron Marinelli', false, 'Toppstation på en snöklädd bergskam i Sölden'),

('solden', 3, 'https://images.unsplash.com/photo-1588848231156-bc151732411b?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/N52KCSGmAj4',
 'Unsplash-licens', 'https://unsplash.com/license', 'Sara Kurig', false, 'Restaurangen Ice Q på Gaislachkogl i Sölden'),

('solden', 4, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Solden_-_panoramio_%281%29.jpg/1920px-Solden_-_panoramio_%281%29.jpg', 1920, 987, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Solden_-_panoramio_(1).jpg',
 'CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0', 'Sloth', true, 'Sölden i snöfall, sett från en sluttning ovanför byn'),

('solden', 5, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Solden_-_panoramio.jpg/1920px-Solden_-_panoramio.jpg', 1920, 597, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Solden_-_panoramio.jpg',
 'CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0', 'Sloth', true, 'Hus i snö vid ån i Sölden en grå dag'),

-- ── st-anton ──────────────────────────────────────────────────────────

('st-anton', 0, 'https://images.unsplash.com/photo-1679039361934-d31657c44695?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/oftYYTU7IV0',
 'Unsplash-licens', 'https://unsplash.com/license', 'Maarten Scheer', false, 'Pister och toppar i skidområdet vid St. Anton en solig dag'),

('st-anton', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Galzigbahn_Riesenrad_2.jpg/1920px-Galzigbahn_Riesenrad_2.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Galzigbahn_Riesenrad_2.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Simon Legner', true, 'En gondol i dalstationen i St. Anton'),

('st-anton', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Park_n%C3%A4chst_dem_Hannes-Schneider-Weg%2C_St._Anton_am_Arlberg%2C_23.02.2019.jpg/1920px-Park_n%C3%A4chst_dem_Hannes-Schneider-Weg%2C_St._Anton_am_Arlberg%2C_23.02.2019.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Park_n%C3%A4chst_dem_Hannes-Schneider-Weg,_St._Anton_am_Arlberg,_23.02.2019.jpg',
 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'Liberaler Humanist', true, 'Pister ner mot byn i St. Anton med skogklädda berg bakom'),

('st-anton', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Rosana-Fluss_in_St._Anton_am_Arlberg%2C_23.02.2019.jpg/1920px-Rosana-Fluss_in_St._Anton_am_Arlberg%2C_23.02.2019.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Rosana-Fluss_in_St._Anton_am_Arlberg,_23.02.2019.jpg',
 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'Liberaler Humanist', true, 'St. Anton vid ån Rosanna, med hotell och snöklädda toppar'),

('st-anton', 4, 'https://images.unsplash.com/photo-1651170077966-7d3ba8d50155?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/cudcxiWGPeo',
 'Unsplash-licens', 'https://unsplash.com/license', 'Lisa Zangerl', false, 'Fjällstuga ovanför ett molnhav, sett genom ett rött nät, St. Anton'),

-- ── tignes ────────────────────────────────────────────────────────────

('tignes', 0, 'https://images.unsplash.com/photo-1629896117857-78d6a79016ab?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/KhOo3PqkFcA',
 'Unsplash-licens', 'https://unsplash.com/license', 'Gaspard Guillod', false, 'Tignes uppifrån, med byarna vid dalbotten och pisterna runt omkring'),

('tignes', 1, 'https://images.unsplash.com/photo-1676542952421-4502ce3a04be?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/IDOgqbdkXF0',
 'Unsplash-licens', 'https://unsplash.com/license', 'Valentin de Brabandère', false, 'Två snowboardåkare på väg mot chalethotellen vid pisten i Tignes'),

('tignes', 2, 'https://images.unsplash.com/photo-1571697456697-a42f1039de6e?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/I-h_wO7ZfT0',
 'Unsplash-licens', 'https://unsplash.com/license', 'David Magalhães', false, 'Tignes i kvällsljus med upplysta chaletar och snötäckt berg bakom'),

('tignes', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/2017-01_Tignes_19.jpg/1920px-2017-01_Tignes_19.jpg', 1920, 1080, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:2017-01_Tignes_19.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Antoine Lamielle', true, 'Tignes le Lac med sina stora lägenhetskomplex vid pisten'),

('tignes', 4, 'https://images.unsplash.com/photo-1453745558060-956d4c4deff8?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/Gw31jigR9j4',
 'Unsplash-licens', 'https://unsplash.com/license', 'Robert Bye', false, 'Nedisad stollift mot blå himmel i Tignes'),

('tignes', 5, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/2017-01_Tignes_11.jpg/1920px-2017-01_Tignes_11.jpg', 1920, 1080, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:2017-01_Tignes_11.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Antoine Lamielle', true, 'Pist ner mot Tignes med höghus och snöklädda toppar'),

-- ── trysil ────────────────────────────────────────────────────────────

('trysil', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Trysil%2C_Norges_st%C3%B8rste_skisted.jpg/1920px-Trysil%2C_Norges_st%C3%B8rste_skisted.jpg', 1920, 882, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Trysil,_Norges_st%C3%B8rste_skisted.jpg',
 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0', 'Ola Matsson', true, 'Trysilfjellet med pisterna ovanför Trysil by en klar vinterdag'),

-- ── val-thorens ───────────────────────────────────────────────────────

('val-thorens', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/View_of_Val_Thorens_in_the_morning_from_Boismint_2.jpg/1920px-View_of_Val_Thorens_in_the_morning_from_Boismint_2.jpg', 1920, 1277, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:View_of_Val_Thorens_in_the_morning_from_Boismint_2.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'DimiTalen', false, 'Val Thorens högt uppe i dalen, byn omgiven av snötäckta sluttningar'),

('val-thorens', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/View_of_Val_Thorens_in_the_morning_from_Boismint_1.jpg/1920px-View_of_Val_Thorens_in_the_morning_from_Boismint_1.jpg', 1920, 1277, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:View_of_Val_Thorens_in_the_morning_from_Boismint_1.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'DimiTalen', false, 'Val Thorens sett från pisten, med stolliften och topparna bakom'),

('val-thorens', 2, 'https://images.unsplash.com/photo-1519659675643-e5885721661f?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/Q1DWowDiki0',
 'Unsplash-licens', 'https://unsplash.com/license', 'Joan Oger', false, 'Fullsatt uteservering vid La Folie Douce på pisten i Val Thorens'),

('val-thorens', 3, 'https://images.unsplash.com/photo-1669188485205-94a60453faeb?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/C4L6ELacv-4',
 'Unsplash-licens', 'https://unsplash.com/license', 'Ziyi Zhu', false, 'Butiker och restauranger vid gågatan i Val Thorens'),

('val-thorens', 4, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Val_Thorens.jpg/1920px-Val_Thorens.jpg', 1920, 1277, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Val_Thorens.jpg',
 'Public domain', null, 'Dimitri Neyt', false, 'Skidåkare på pisten ner mot byggnaderna i Val Thorens'),

('val-thorens', 5, 'https://images.unsplash.com/photo-1576068086646-596a0e8f1987?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/SxuHRvHEkXM',
 'Unsplash-licens', 'https://unsplash.com/license', 'Elisabeth Agustín', false, 'Skidåkare på pisten i Val Thorens vid solnedgång'),

-- ── verbier ───────────────────────────────────────────────────────────

('verbier', 0, 'https://images.unsplash.com/photo-1649161992932-2bb759b727d4?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/o_9iqxordDk',
 'Unsplash-licens', 'https://unsplash.com/license', 'Gabor Koszegi', false, 'Chaletar och snötyngda granar i Verbier'),

('verbier', 1, 'https://images.unsplash.com/photo-1615518538341-4f7f5cfb1220?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/5RRuwB92crY',
 'Unsplash-licens', 'https://unsplash.com/license', 'James Tamim', false, 'Snötäckta chalettak i Verbier under en rosa kvällshimmel'),

('verbier', 2, 'https://images.unsplash.com/photo-1767714453178-58934c7ffd93?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/ZH65pZvb0Do',
 'Unsplash-licens', 'https://unsplash.com/license', 'Peter Burdon', false, 'Bokstäverna VERBIER i snön med utsikt över dalen'),

('verbier', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Mont-Fort_aerial_tramway.jpg/1920px-Mont-Fort_aerial_tramway.jpg', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Mont-Fort_aerial_tramway.jpg',
 'Public domain', null, 'VasilievVV', false, 'Kabinbanan mot Mont Fort ovanför Verbier'),

('verbier', 4, 'https://images.unsplash.com/photo-1586356258212-c43e5013c489?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/fy0ZQiVuk54',
 'Unsplash-licens', 'https://unsplash.com/license', 'Alex Lange', false, 'Skidåkare i orörd pudersnö i Verbier'),

('verbier', 5, 'https://images.unsplash.com/photo-1645349568017-f6ef273b8901?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/5Xi8vqB6nKc',
 'Unsplash-licens', 'https://unsplash.com/license', 'Teo Zac', false, 'Chalet i trä med balkonger och snöklädda toppar bakom, Verbier'),

-- ── voss ──────────────────────────────────────────────────────────────

('voss', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Voss_Gondol_Aerial_passenger_lift_Cableway_%28taubane%29_View_from_gondola_cabin_Vossavangen_M%C3%B8lstertunet_Vangsvatnet_etc_Blue_winter_afternoon_light_Snow_Voss_Norway_2019-11-20_0901.jpg/1920px-Voss_Gondol_Aerial_passenger_lift_Cableway_%28taubane%29_View_from_gondola_cabin_Vossavangen_M%C3%B8lstertunet_Vangsvatnet_etc_Blue_winter_afternoon_light_Snow_Voss_Norway_2019-11-20_0901.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Voss_Gondol_Aerial_passenger_lift_Cableway_(taubane)_View_from_gondola_cabin_Vossavangen_M%C3%B8lstertunet_Vangsvatnet_etc_Blue_winter_afternoon_light_Snow_Voss_Norway_2019-11-20_0901.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Wolfmann', true, 'Voss gondol ovanför byn och sjön Vangsvatnet i snö'),

('voss', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Voss_Gondol_Gondola_aerial_passenger_lift_%28taubane%29_View_from_cabin_Vossavangen_Voss_railway_station_Kulturhus_E16_Prestegardslandet_Vangsvatnet_Nyre_Jernesmoen_Bordalen_November_afternoon_sunset_Snow_Voss_Norway_2019-11-20_0552.jpg/1920px-Voss_Gondol_Gondola_aerial_passenger_lift_%28taubane%29_View_from_cabin_Vossavangen_Voss_railway_station_Kulturhus_E16_Prestegardslandet_Vangsvatnet_Nyre_Jernesmoen_Bordalen_November_afternoon_sunset_Snow_Voss_Norway_2019-11-20_0552.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Voss_Gondol_Gondola_aerial_passenger_lift_(taubane)_View_from_cabin_Vossavangen_Voss_railway_station_Kulturhus_E16_Prestegardslandet_Vangsvatnet_Nyre_Jernesmoen_Bordalen_November_afternoon_sunset_Snow_Voss_Norway_2019-11-20_0552.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Wolfmann', true, 'Passagerare i Voss gondol med utsikt över byn och sjön'),

('voss', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Voss_Gondol_Gondola_aerial_passenger_lift_%28taubane%29_View_from_cabin_Vossavangen_Vangsvatnet_M%C3%B8lstertunet_Tvildemoen_Cableway_Railway_Station_Snow_November_afternoon_sunset_etc_Voss_Norway_Distorted_panorama_photo_2019-11-20_IMG_5721.jpg/1920px-Voss_Gondol_Gondola_aerial_passenger_lift_%28taubane%29_View_from_cabin_Vossavangen_Vangsvatnet_M%C3%B8lstertunet_Tvildemoen_Cableway_Railway_Station_Snow_November_afternoon_sunset_etc_Voss_Norway_Distorted_panorama_photo_2019-11-20_IMG_5721.jpg', 1920, 563, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Voss_Gondol_Gondola_aerial_passenger_lift_(taubane)_View_from_cabin_Vossavangen_Vangsvatnet_M%C3%B8lstertunet_Tvildemoen_Cableway_Railway_Station_Snow_November_afternoon_sunset_etc_Voss_Norway_Distorted_panorama_photo_2019-11-20_IMG_5721.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Wolfmann', true, 'Utsikt från Voss gondol över Vossevangen och Vangsvatnet'),

('voss', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Voss_Gondol_Aerial_passenger_lift_Cableway_%28taubane%29_View_from_gondola_cabin_Vossavangen_Vangsvatnet_etc_Tower_-1_Blue_winter_afternoon_light_Snow_Voss_Norway_2019-11-20_0877.jpg/1920px-Voss_Gondol_Aerial_passenger_lift_Cableway_%28taubane%29_View_from_gondola_cabin_Vossavangen_Vangsvatnet_etc_Tower_-1_Blue_winter_afternoon_light_Snow_Voss_Norway_2019-11-20_0877.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Voss_Gondol_Aerial_passenger_lift_Cableway_(taubane)_View_from_gondola_cabin_Vossavangen_Vangsvatnet_etc_Tower_-1_Blue_winter_afternoon_light_Snow_Voss_Norway_2019-11-20_0877.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Wolfmann', true, 'Gondolen på väg upp från Voss med dimma över sjön'),

-- ── zermatt ───────────────────────────────────────────────────────────

('zermatt', 0, 'https://images.unsplash.com/photo-1605750454112-f2f3f696eeb0?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/Cl10giNfsZs',
 'Unsplash-licens', 'https://unsplash.com/license', 'The 414 Company', false, 'Zermatt i snö med Matterhorn ovanför byn'),

('zermatt', 1, 'https://images.unsplash.com/photo-1586752488885-6ce47fdfd874?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/uAcg4PZ_f-o',
 'Unsplash-licens', 'https://unsplash.com/license', 'Victor He', false, 'Gornergratbanan framför Matterhorn och snöklädda toppar'),

('zermatt', 2, 'https://images.unsplash.com/photo-1743702263351-40b1b84be3a2?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/E1fpEyfYSTQ',
 'Unsplash-licens', 'https://unsplash.com/license', 'Krzysztof Kowalik', false, 'Skidåkare på pisten med Matterhorn i bakgrunden'),

('zermatt', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/CH.VS.Zermatt_2019-12-29_7471b_The-Matterhorn_OrigX%2BR.jpg/1920px-CH.VS.Zermatt_2019-12-29_7471b_The-Matterhorn_OrigX%2BR.jpg', 1920, 804, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:CH.VS.Zermatt_2019-12-29_7471b_The-Matterhorn_OrigX%2BR.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Roy Egloff', true, 'Zermatt i dalen mellan snöklädda berg, med Matterhorn i fjärran'),

('zermatt', 4, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Zermatt-aerial-2.jpg/1920px-Zermatt-aerial-2.jpg', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Zermatt-aerial-2.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Alexey M.', true, 'Snötäckta hustak i centrala Zermatt uppifrån'),

('zermatt', 5, 'https://images.unsplash.com/photo-1577953318254-3246026dd45d?w=2560&q=80&fm=jpg&fit=max', null, null, 'unsplash',
 'https://unsplash.com/photos/QP5KknAGAV8',
 'Unsplash-licens', 'https://unsplash.com/license', 'Kevin Schmid', false, 'Solterrass i trä med utsikt mot Matterhorn');


-- Hjältebilden på alla ytor: image_url följer position 0.
update public.resorts r
set image_url = i.url
from public.resort_images i
where i.resort_slug = r.slug
  and i.position = 0;

commit;


-- ── Efterkontroll ─────────────────────────────────────────────────────
--
-- 1. 150 rader, fördelade på källor:
--
--      SELECT source, count(*) FROM resort_images GROUP BY source ORDER BY source;
--
--      Förväntat: unsplash 68, wikimedia 82.
--
-- 2. Kreditering krävs för 39 bilder, och alla har fotograf och licenslänk
--    — villkoret på tabellen gör det omöjligt annars:
--
--      SELECT count(*) FROM resort_images WHERE attribution_required;
--
--      Förväntat: 39.
--
-- 3. Varje publicerad ort utom Myrkdalen har en hjältebild i tabellen:
--
--      SELECT r.slug FROM resorts r
--      LEFT JOIN resort_images i ON i.resort_slug = r.slug AND i.position = 0
--      WHERE r.published AND i.id IS NULL ORDER BY r.slug;
--
--      Förväntat: myrkdalen.
--
-- 4. image_url är densamma som hjältebildens adress:
--
--      SELECT r.slug FROM resorts r
--      JOIN resort_images i ON i.resort_slug = r.slug AND i.position = 0
--      WHERE r.image_url IS DISTINCT FROM i.url;
--
--      Förväntat: inga rader.
--
-- 5. Anon-nyckeln kan läsa tabellen — annars kan sajten aldrig visa galleriet:
--
--      SET ROLE anon; SELECT count(*) FROM resort_images; RESET ROLE;
--
--      Förväntat: 150.
