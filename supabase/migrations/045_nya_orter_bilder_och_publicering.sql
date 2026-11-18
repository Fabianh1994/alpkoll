-- 045 · Bilder till de 19 nya orterna, och orterna visas.
--
-- Orterna lades in dolda i 039–044. Här får de bilder i resort_images och
-- published = true. Urvalet gjordes av Fabian 2026-11-18 bland 104 fria
-- kandidater från Wikimedia Commons och Unsplash (projektmappen
-- orter/bildkandidater.json). Position 0 är hjältebilden, resten galleriet
-- i den ordning han valde dem. Licens, fotograf och kreditering följer
-- reglerna i 025; bildtexterna är korta och bär platsnamnet, som i 026.
--
-- Söksträngarna till Booking står i lib/booking.js (BOOKING_SOK) och går
-- live med samma PR. Branäs får ingen Booking-knapp.
--
-- Kör i Supabase SQL Editor. Allt körs i en transaktion.

begin;

insert into public.resort_images
  (resort_slug, position, url, width, height, source, source_page,
   license, license_url, photographer, attribution_required, alt)
values
-- ── val-d-isere ──
('val-d-isere', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Solaise_%C3%A0_Val-d%27Is%C3%A8re_depuis_Barrage_de_Tignes_%28f%C3%A9vrier_2026%29.JPG/1920px-Solaise_%C3%A0_Val-d%27Is%C3%A8re_depuis_Barrage_de_Tignes_%28f%C3%A9vrier_2026%29.JPG', 1920, 1486, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Solaise_%C3%A0_Val-d%27Is%C3%A8re_depuis_Barrage_de_Tignes_(f%C3%A9vrier_2026).JPG',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Florian Pépellin', true, 'Solaise ovanför Val d''Isère, sett från Tignesdammen'),
('val-d-isere', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/2014_02_27_Val_2014_0049_%2813008549405%29.jpg/1920px-2014_02_27_Val_2014_0049_%2813008549405%29.jpg', 1920, 1281, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:2014_02_27_Val_2014_0049_(13008549405).jpg',
 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0', 'benjgibbs', true, 'Val d''Isère uppifrån liften'),
('val-d-isere', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Val_d%E2%80%99Is%C3%A8re_Ski_Center_%28FRA%29_2014.JPG/1920px-Val_d%E2%80%99Is%C3%A8re_Ski_Center_%28FRA%29_2014.JPG', 1920, 1195, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Val_d%E2%80%99Is%C3%A8re_Ski_Center_(FRA)_2014.JPG',
 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'Jmex', true, 'Face de Bellevarde sett från byn'),
('val-d-isere', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Mont_blanc_depuis_Val_d%27_Is%C3%A8re_%285435533825%29.jpg/1920px-Mont_blanc_depuis_Val_d%27_Is%C3%A8re_%285435533825%29.jpg', 1920, 1434, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Mont_blanc_depuis_Val_d%27_Is%C3%A8re_(5435533825).jpg',
 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0', 'Jerome Bon', true, 'Pist högt upp, med Mont Blanc långt bort'),
('val-d-isere', 4, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/2014_02_27_Val_2014_0026_%2813008669473%29.jpg/1920px-2014_02_27_Val_2014_0026_%2813008669473%29.jpg', 1920, 1281, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:2014_02_27_Val_2014_0026_(13008669473).jpg',
 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0', 'benjgibbs', true, 'Sluttningar och bergskam i skidområdet'),

-- ── vemdalen ──
('vemdalen', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Vemdalsskalet.JPG/1920px-Vemdalsskalet.JPG', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Vemdalsskalet.JPG',
 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'Ankara', true, 'Kalfjället ovanför Vemdalsskalet i april'),
('vemdalen', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Vemdalsskalet_2018.jpg/1920px-Vemdalsskalet_2018.jpg', 1920, 906, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Vemdalsskalet_2018.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Ainali', true, 'Backarna i Vemdalsskalet sedda från dalen'),
('vemdalen', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Vemdalsskalt_barnbackarna.JPG/1920px-Vemdalsskalt_barnbackarna.JPG', 1920, 1285, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Vemdalsskalt_barnbackarna.JPG',
 'Public domain', null, 'Pieter Kuiper', false, 'Barnbackarna i Vemdalsskalet'),
('vemdalen', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/H%C3%B6gfj%C3%A4llshotell_Vemdalen.jpg/1920px-H%C3%B6gfj%C3%A4llshotell_Vemdalen.jpg', 1920, 1285, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:H%C3%B6gfj%C3%A4llshotell_Vemdalen.jpg',
 'Public domain', null, 'Pieter Kuiper', false, 'Vemdalsskalets högfjällshotell'),

-- ── lech-zuers ──
('lech-zuers', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Zuers_am_Arlberg.jpg/1920px-Zuers_am_Arlberg.jpg', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Zuers_am_Arlberg.jpg',
 'CC BY 2.5', 'https://creativecommons.org/licenses/by/2.5', 'Florian Lindner', true, 'Zürs med pister och liftar runt byn'),
('lech-zuers', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Lech_am_Arlberg_2006.jpg/1920px-Lech_am_Arlberg_2006.jpg', 1920, 1277, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Lech_am_Arlberg_2006.jpg',
 'CC BY 2.5', 'https://creativecommons.org/licenses/by/2.5', 'Florian Lindner', true, 'Lech med Omeshorn ovanför byn'),
('lech-zuers', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/SDIM0011.jpg/1920px-SDIM0011.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:SDIM0011.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Harrison Fornasier', true, 'Lech en morgon i januari, hus längs floden Lech'),
('lech-zuers', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Ausblick_Albona_2400_m_Richtung_Z%C3%BCrs_und_Lech_-_panoramio.jpg/1920px-Ausblick_Albona_2400_m_Richtung_Z%C3%BCrs_und_Lech_-_panoramio.jpg', 1920, 1178, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Ausblick_Albona_2400_m_Richtung_Z%C3%BCrs_und_Lech_-_panoramio.jpg',
 'CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0', 'qwesy', true, 'Zürs och Lech sedda från Albona'),

-- ── saalbach ──
('saalbach', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Kohlmaisbahn_Saalbach-Hinterglemm.jpg/1920px-Kohlmaisbahn_Saalbach-Hinterglemm.jpg', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Kohlmaisbahn_Saalbach-Hinterglemm.jpg',
 'CC BY-SA 2.5', 'https://creativecommons.org/licenses/by-sa/2.5', 'F30', true, 'Kohlmaisbahn över Saalbach'),
('saalbach', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Hinterglemm_%2819961777010%29.jpg/1920px-Hinterglemm_%2819961777010%29.jpg', 1920, 1079, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Hinterglemm_(19961777010).jpg',
 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0', 'larsjuh', true, 'Hinterglemm och skidbergen i Glemmdalen'),
('saalbach', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Saalbach_Ski_Center_%28AUT%29_2010.jpg/1920px-Saalbach_Ski_Center_%28AUT%29_2010.jpg', 1920, 1194, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Saalbach_Ski_Center_(AUT)_2010.jpg',
 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'MattiPaavola', true, 'Jausernabfahrt ner mot Vorderglemm'),
('saalbach', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Hinterglemm_from_Zw%C3%B6lferkogelbahn_2010-02-09.jpg/1920px-Hinterglemm_from_Zw%C3%B6lferkogelbahn_2010-02-09.jpg', 1920, 1222, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Hinterglemm_from_Zw%C3%B6lferkogelbahn_2010-02-09.jpg',
 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'MattiPaavola', true, 'Hinterglemm från Zwölferkogelbahn'),

-- ── zell-am-see-kaprun ──
('zell-am-see-kaprun', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Zeller_See_Zell_am_See_Steinernes_Meer.JPG/1920px-Zeller_See_Zell_am_See_Steinernes_Meer.JPG', 1920, 1137, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Zeller_See_Zell_am_See_Steinernes_Meer.JPG',
 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'Wald1siedel', true, 'Zell am See vid sjön, med Steinernes Meer bakom'),
('zell-am-see-kaprun', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Zeller_See_im_Winter_11.jpg/1920px-Zeller_See_im_Winter_11.jpg', 1920, 1060, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Zeller_See_im_Winter_11.jpg',
 'CC BY-SA 3.0 at', 'https://creativecommons.org/licenses/by-sa/3.0/at/deed.en', 'Wald1siedel', true, 'Zeller See på vintern'),

-- ── obergurgl ──
('obergurgl', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Obergurgl.JPG/1920px-Obergurgl.JPG', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Obergurgl.JPG',
 'Public domain', null, 'Suppengrün', false, 'Obergurgl från liften'),
('obergurgl', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Chairlift_in_Ski_Area_Obergurgl-Hochgurgl_in_Tirol.jpg/1920px-Chairlift_in_Ski_Area_Obergurgl-Hochgurgl_in_Tirol.jpg', 1920, 1272, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Chairlift_in_Ski_Area_Obergurgl-Hochgurgl_in_Tirol.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Jan Czeczotka', true, 'Stolslift och pister i Obergurgl-Hochgurgl'),
('obergurgl', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Hochgurgl_-_panoramio.jpg/1920px-Hochgurgl_-_panoramio.jpg', 1920, 847, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Hochgurgl_-_panoramio.jpg',
 'CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0', 'Sloth', true, 'Ötztalalperna från Hochgurgl'),

-- ── bad-gastein ──
('bad-gastein', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Stubnerkogelbahn1.JPG/1920px-Stubnerkogelbahn1.JPG', 1920, 1321, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Stubnerkogelbahn1.JPG',
 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'Wald1siedel', true, 'Stubnerkogelbahn över pisten'),
('bad-gastein', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Stubnerkogel14.JPG/1920px-Stubnerkogel14.JPG', 1920, 1286, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Stubnerkogel14.JPG',
 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'Wald1siedel', true, 'Pist på Stubnerkogel, med Hohe Tauern bakom'),
('bad-gastein', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Kreuzkogel%2C_Sportgastein_18.JPG/1920px-Kreuzkogel%2C_Sportgastein_18.JPG', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Kreuzkogel,_Sportgastein_18.JPG',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Wald1siedel', true, 'Pist i Sportgastein'),
('bad-gastein', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Kreuzkogel%2C_Sportgastein_15.JPG/1920px-Kreuzkogel%2C_Sportgastein_15.JPG', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Kreuzkogel,_Sportgastein_15.JPG',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Wald1siedel', true, 'Bad Gastein uppifrån, med Gasteindalen nedanför'),
('bad-gastein', 4, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Stubnerkogel6.JPG/1920px-Stubnerkogel6.JPG', 1920, 1441, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Stubnerkogel6.JPG',
 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'Wald1siedel', true, 'Gasteindalen från Stubnerkogel'),

-- ── la-plagne ──
('la-plagne', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/La_Plagne_from_Montagne_de_l%27Arc%2C_2018.jpg/1920px-La_Plagne_from_Montagne_de_l%27Arc%2C_2018.jpg', 1920, 1277, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:La_Plagne_from_Montagne_de_l%27Arc,_2018.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'DimiTalen', false, 'Skidområdet sett från Montagne de l''Arc'),
('la-plagne', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Belle-Plagne_2009.JPG/1920px-Belle-Plagne_2009.JPG', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Belle-Plagne_2009.JPG',
 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'Melvynperthuis', true, 'Belle-Plagne från stolliften'),
('la-plagne', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Bellec%C3%B4te_et_T%C3%A9l%C3%A9cabine_Glacier_%C3%A0_La_Plagne_en_hiver_%28f%C3%A9vrier_2024%29.JPG/1920px-Bellec%C3%B4te_et_T%C3%A9l%C3%A9cabine_Glacier_%C3%A0_La_Plagne_en_hiver_%28f%C3%A9vrier_2024%29.JPG', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Bellec%C3%B4te_et_T%C3%A9l%C3%A9cabine_Glacier_%C3%A0_La_Plagne_en_hiver_(f%C3%A9vrier_2024).JPG',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Florian Pépellin', true, 'Bellecôte och glaciärgondolen från Roche de Mio'),

-- ── les-deux-alpes ──
('les-deux-alpes', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Les2Alpes.jpg/1920px-Les2Alpes.jpg', 1920, 1242, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Les2Alpes.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Data 2 Alpes', true, 'Les Deux Alpes med Écrins bakom'),
('les-deux-alpes', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Les_deux_alpes_3400_-_panoramio.jpg/1920px-Les_deux_alpes_3400_-_panoramio.jpg', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Les_deux_alpes_3400_-_panoramio.jpg',
 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'nikola_pu', true, 'Glaciärpisterna med liftar och restaurang'),
('les-deux-alpes', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Deuxalpes3..jpg/1920px-Deuxalpes3..jpg', 1920, 1279, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Deuxalpes3..jpg',
 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0', 'Michael Wassmer', true, 'Pister och liftar under klipporna'),

-- ── serre-chevalier ──
('serre-chevalier', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Le_Monetier_les_Bains_-_%C3%89glise.jpg/1920px-Le_Monetier_les_Bains_-_%C3%89glise.jpg', 1920, 1080, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Le_Monetier_les_Bains_-_%C3%89glise.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Paul.genix', true, 'Monêtier-les-Bains med kyrktornet'),
('serre-chevalier', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/La_Cucumelle_-_Serre_Chevalier.JPG/1920px-La_Cucumelle_-_Serre_Chevalier.JPG', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:La_Cucumelle_-_Serre_Chevalier.JPG',
 'Public domain', null, 'Fredrik Lähnn', false, 'La Cucumelle'),
('serre-chevalier', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Serre_Chevalier_4.JPG/1920px-Serre_Chevalier_4.JPG', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Serre_Chevalier_4.JPG',
 'Public domain', null, 'Fredrik Lähnn', false, 'Pist med utsikt mot Écrins'),
('serre-chevalier', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Le_Monetier_les_Bains_village.jpg/1920px-Le_Monetier_les_Bains_village.jpg', 1920, 1080, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Le_Monetier_les_Bains_village.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Paul.genix', true, 'Monêtier-les-Bains i skymningen'),

-- ── val-gardena ──
('val-gardena', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Marmolada_%2B_Sellaronda_tour_20.jpg/1920px-Marmolada_%2B_Sellaronda_tour_20.jpg', 1920, 1286, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Marmolada_%2B_Sellaronda_tour_20.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'kallerna', true, 'Selva från stolliften Costabella'),
('val-gardena', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Groomed_skirun_from_Seceda_Val_Gardena.jpg/1920px-Groomed_skirun_from_Seceda_Val_Gardena.jpg', 1920, 1281, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Groomed_skirun_from_Seceda_Val_Gardena.jpg',
 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'Wolfgang Moroder', true, 'Pisten från Seceda'),
('val-gardena', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Piz_Sella_te_Gherd%C3%ABina.jpg/1920px-Piz_Sella_te_Gherd%C3%ABina.jpg', 1920, 931, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Piz_Sella_te_Gherd%C3%ABina.jpg',
 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'Wolfgang Moroder', true, 'Pister vid Piz Sella under Langkofel'),
('val-gardena', 3, 'https://images.unsplash.com/photo-1520356496838-3d9184d470f4?w=2560&q=80&fm=jpg&fit=max', 2560, 1703, 'unsplash',
 'https://unsplash.com/photos/6UnSrZnHe0M',
 'Unsplash License', 'https://unsplash.com/license', 'Jacek Dylag', false, 'Castel Gardena i skymningen'),

-- ── alta-badia ──
('alta-badia', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Corvara%2C_Alta_Badia_-_panoramio_%281%29.jpg/1920px-Corvara%2C_Alta_Badia_-_panoramio_%281%29.jpg', 1920, 1242, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Corvara,_Alta_Badia_-_panoramio_(1).jpg',
 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'Zoran Kurelić Rabko', true, 'Corvara under Sassongher'),
('alta-badia', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Cherz_y_Pas_Ciaulong.jpg/1920px-Cherz_y_Pas_Ciaulong.jpg', 1920, 1223, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Cherz_y_Pas_Ciaulong.jpg',
 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'Wolfgang Moroder', true, 'Pister vid Cherz, med Sellamassivet bakom'),
('alta-badia', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Piz_Ciampac_Piz_Ciampai_Sassongher_Corvara_S%C3%BCdtirol.jpg/1920px-Piz_Ciampac_Piz_Ciampai_Sassongher_Corvara_S%C3%BCdtirol.jpg', 1920, 839, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Piz_Ciampac_Piz_Ciampai_Sassongher_Corvara_S%C3%BCdtirol.jpg',
 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'Wolfgang Moroder', true, 'Piz Ciampac, Piz Ciampai och Sassongher över Corvara'),
('alta-badia', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Corvara%2C_Alta_Badia_-_panoramio_%283%29.jpg/1920px-Corvara%2C_Alta_Badia_-_panoramio_%283%29.jpg', 1920, 1201, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Corvara,_Alta_Badia_-_panoramio_(3).jpg',
 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'Zoran Kurelić Rabko', true, 'Corvara och dalen nedanför pisterna'),

-- ── cervinia ──
('cervinia', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Funivia_Plateau_Rosa%27.JPG/1920px-Funivia_Plateau_Rosa%27.JPG', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Funivia_Plateau_Rosa%27.JPG',
 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'Stefano Massa', true, 'Kabinbanan upp mot Plateau Rosa'),
('cervinia', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Cime_Bianche.JPG/1920px-Cime_Bianche.JPG', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Cime_Bianche.JPG',
 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'SteGrifo27', true, 'Gondolen mot Cime Bianche, med Matterhorn bakom'),
('cervinia', 2, 'https://images.unsplash.com/photo-1594887452593-2a5a79d2a845?w=2560&q=80&fm=jpg&fit=max', 2560, 1440, 'unsplash',
 'https://unsplash.com/photos/XaO85rDDtQw',
 'Unsplash License', 'https://unsplash.com/license', 'Matt_214', false, 'Restaurang vid pisten under Matterhorn'),
('cervinia', 3, 'https://images.unsplash.com/photo-1697754262007-0315b675a2fc?w=2560&q=80&fm=jpg&fit=max', 2560, 1920, 'unsplash',
 'https://unsplash.com/photos/ahDMaeXTYtU',
 'Unsplash License', 'https://unsplash.com/license', 'Dimitris Kiriakakis', false, 'Breuil-Cervinia nedanför Matterhorn'),

-- ── laax ──
('laax', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Blick_zum_Crap_Sogn_Gion_-_panoramio.jpg/1920px-Blick_zum_Crap_Sogn_Gion_-_panoramio.jpg', 1920, 1434, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Blick_zum_Crap_Sogn_Gion_-_panoramio.jpg',
 'CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0', 'qwesy', true, 'Pister och liftar mot Crap Sogn Gion'),
('laax', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Snowpark_LAAX_-_panoramio.jpg/1920px-Snowpark_LAAX_-_panoramio.jpg', 1920, 1427, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Snowpark_LAAX_-_panoramio.jpg',
 'CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0', 'qwesy', true, 'Pist och snowpark, med molnen nere i dalen'),
('laax', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Sessellift_zum_Crap_Sogn_Gion_-_panoramio.jpg/1920px-Sessellift_zum_Crap_Sogn_Gion_-_panoramio.jpg', 1920, 1441, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Sessellift_zum_Crap_Sogn_Gion_-_panoramio.jpg',
 'CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0', 'qwesy', true, 'Stolslift upp mot Crap Sogn Gion'),

-- ── st-moritz ──
('st-moritz', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Corviglia_StMoritz.jpg/1920px-Corviglia_StMoritz.jpg', 1920, 1289, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Corviglia_StMoritz.jpg',
 'CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0', 'Frédéric de Goldschmidt', true, 'Corviglias bergstation'),
('st-moritz', 1, 'https://images.unsplash.com/photo-1547980562-3c008cd4b769?w=2560&q=80&fm=jpg&fit=max', 2560, 1708, 'unsplash',
 'https://unsplash.com/photos/Gb_k-cWMjL8',
 'Unsplash License', 'https://unsplash.com/license', 'Sepp Rutz', false, 'St. Moritz Dorf i skymningen, med sjön nedanför'),
('st-moritz', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Piz_Nair_from_Muottas_Muragl.jpg/1920px-Piz_Nair_from_Muottas_Muragl.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Piz_Nair_from_Muottas_Muragl.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Paradise Chronicle', true, 'Piz Nair och Corviglia från Muottas Muragl'),

-- ── engelberg ──
('engelberg', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Ski_chairlift_in_the_Titlis_mountain_area_in_Switzerland.jpg/1920px-Ski_chairlift_in_the_Titlis_mountain_area_in_Switzerland.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Ski_chairlift_in_the_Titlis_mountain_area_in_Switzerland.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Bencegyulai', true, 'Stolslift vid Trübsee'),
('engelberg', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/2018-02-24-Titlis-Rotair.jpg/1920px-2018-02-24-Titlis-Rotair.jpg', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:2018-02-24-Titlis-Rotair.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'CenturioST', true, 'Utsikt från Titlis med kabinbanan Rotair'),
('engelberg', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Engelberg_with_Titlis_and_paraglider.jpg/1920px-Engelberg_with_Titlis_and_paraglider.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Engelberg_with_Titlis_and_paraglider.jpg',
 'CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0', 'Gestumblindi', true, 'Engelberg med Titlis bakom'),

-- ── idre-fjall ──
('idre-fjall', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Idrefjell_alpin.jpg/1920px-Idrefjell_alpin.jpg', 1920, 1276, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Idrefjell_alpin.jpg',
 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0', 'Jørn Eriksson', true, 'Idre Fjälls backar på avstånd'),
('idre-fjall', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Skidlift_Idre_fj%C3%A4ll.JPG/1920px-Skidlift_Idre_fj%C3%A4ll.JPG', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Skidlift_Idre_fj%C3%A4ll.JPG',
 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'Edaen', true, 'Stolslift genom fjällskogen'),
('idre-fjall', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Idre_Fj%C3%A4ll%2C_2023_004%2C_vy_vid_slalombackarna.jpg/1920px-Idre_Fj%C3%A4ll%2C_2023_004%2C_vy_vid_slalombackarna.jpg', 1920, 1313, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Idre_Fj%C3%A4ll,_2023_004,_vy_vid_slalombackarna.jpg',
 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'Bysmon', true, 'Liftar och backar vid backfoten'),
('idre-fjall', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Idre_Fj%C3%A4ll_-_panoramio.jpg/1920px-Idre_Fj%C3%A4ll_-_panoramio.jpg', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Idre_Fj%C3%A4ll_-_panoramio.jpg',
 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'René Bongard', true, 'Pist mellan granarna'),
('idre-fjall', 4, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Chocken%2C_Idre_fj%C3%A4ll%2C_2018.jpg/1920px-Chocken%2C_Idre_fj%C3%A4ll%2C_2018.jpg', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Chocken,_Idre_fj%C3%A4ll,_2018.jpg',
 'CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0', 'Axel Pettersson', true, 'Slalombacken Chocken'),

-- ── branas ──
('branas', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Bran%C3%A4s_-_Soltorget_01_april_2023.jpg/1920px-Bran%C3%A4s_-_Soltorget_01_april_2023.jpg', 1920, 1079, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Bran%C3%A4s_-_Soltorget_01_april_2023.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'David Castor', false, 'Soltorget och pisterna från luften'),
('branas', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Gondolen_i_Bran%C3%A4s.jpg/1920px-Gondolen_i_Bran%C3%A4s.jpg', 1920, 1280, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Gondolen_i_Bran%C3%A4s.jpg',
 'Public domain', null, 'ANDRUN1', false, 'Gondolen mellan granarna'),
('branas', 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/View_from_Bran%C3%A4s_in_winter.JPG/1920px-View_from_Bran%C3%A4s_in_winter.JPG', 1920, 1277, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:View_from_Bran%C3%A4s_in_winter.JPG',
 'Public domain', null, 'Leif Hansson', false, 'Utsikt över Klarälvdalen från toppen'),
('branas', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Bran%C3%A4s_-_sydv%C3%A4stsluttningen_01_april_2023.jpg/1920px-Bran%C3%A4s_-_sydv%C3%A4stsluttningen_01_april_2023.jpg', 1920, 1079, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Bran%C3%A4s_-_sydv%C3%A4stsluttningen_01_april_2023.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'David Castor', false, 'Branäs pister från luften, med Soltorget närmast'),
('branas', 4, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Bran%C3%A4s_-_bron_01_april_2023.jpg/1920px-Bran%C3%A4s_-_bron_01_april_2023.jpg', 1920, 1249, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Bran%C3%A4s_-_bron_01_april_2023.jpg',
 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', 'David Castor', false, 'Skidbron över backsystemet'),

-- ── hafjell ──
('hafjell', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Hafjell.jpg/1920px-Hafjell.jpg', 1920, 1440, 'wikimedia',
 'https://commons.wikimedia.org/wiki/File:Hafjell.jpg',
 'CC BY-SA 2.0', 'https://creativecommons.org/licenses/by-sa/2.0', 'Ole C Eid', true, 'Pist i Hafjell, med Lågendalen nedanför')
on conflict (resort_slug, position) do nothing;

-- Hjältebilden blir ortens image_url, som i 025.
update public.resorts set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Solaise_%C3%A0_Val-d%27Is%C3%A8re_depuis_Barrage_de_Tignes_%28f%C3%A9vrier_2026%29.JPG/1920px-Solaise_%C3%A0_Val-d%27Is%C3%A8re_depuis_Barrage_de_Tignes_%28f%C3%A9vrier_2026%29.JPG' where slug = 'val-d-isere';
update public.resorts set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Vemdalsskalet.JPG/1920px-Vemdalsskalet.JPG' where slug = 'vemdalen';
update public.resorts set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Zuers_am_Arlberg.jpg/1920px-Zuers_am_Arlberg.jpg' where slug = 'lech-zuers';
update public.resorts set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Kohlmaisbahn_Saalbach-Hinterglemm.jpg/1920px-Kohlmaisbahn_Saalbach-Hinterglemm.jpg' where slug = 'saalbach';
update public.resorts set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Zeller_See_Zell_am_See_Steinernes_Meer.JPG/1920px-Zeller_See_Zell_am_See_Steinernes_Meer.JPG' where slug = 'zell-am-see-kaprun';
update public.resorts set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Obergurgl.JPG/1920px-Obergurgl.JPG' where slug = 'obergurgl';
update public.resorts set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Stubnerkogelbahn1.JPG/1920px-Stubnerkogelbahn1.JPG' where slug = 'bad-gastein';
update public.resorts set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/La_Plagne_from_Montagne_de_l%27Arc%2C_2018.jpg/1920px-La_Plagne_from_Montagne_de_l%27Arc%2C_2018.jpg' where slug = 'la-plagne';
update public.resorts set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Les2Alpes.jpg/1920px-Les2Alpes.jpg' where slug = 'les-deux-alpes';
update public.resorts set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Le_Monetier_les_Bains_-_%C3%89glise.jpg/1920px-Le_Monetier_les_Bains_-_%C3%89glise.jpg' where slug = 'serre-chevalier';
update public.resorts set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Marmolada_%2B_Sellaronda_tour_20.jpg/1920px-Marmolada_%2B_Sellaronda_tour_20.jpg' where slug = 'val-gardena';
update public.resorts set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Corvara%2C_Alta_Badia_-_panoramio_%281%29.jpg/1920px-Corvara%2C_Alta_Badia_-_panoramio_%281%29.jpg' where slug = 'alta-badia';
update public.resorts set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Funivia_Plateau_Rosa%27.JPG/1920px-Funivia_Plateau_Rosa%27.JPG' where slug = 'cervinia';
update public.resorts set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Blick_zum_Crap_Sogn_Gion_-_panoramio.jpg/1920px-Blick_zum_Crap_Sogn_Gion_-_panoramio.jpg' where slug = 'laax';
update public.resorts set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Corviglia_StMoritz.jpg/1920px-Corviglia_StMoritz.jpg' where slug = 'st-moritz';
update public.resorts set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Ski_chairlift_in_the_Titlis_mountain_area_in_Switzerland.jpg/1920px-Ski_chairlift_in_the_Titlis_mountain_area_in_Switzerland.jpg' where slug = 'engelberg';
update public.resorts set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Idrefjell_alpin.jpg/1920px-Idrefjell_alpin.jpg' where slug = 'idre-fjall';
update public.resorts set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Bran%C3%A4s_-_Soltorget_01_april_2023.jpg/1920px-Bran%C3%A4s_-_Soltorget_01_april_2023.jpg' where slug = 'branas';
update public.resorts set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Hafjell.jpg/1920px-Hafjell.jpg' where slug = 'hafjell';

-- Orterna visas.
update public.resorts set published = true
where slug in (
  'val-d-isere',
  'vemdalen',
  'lech-zuers',
  'saalbach',
  'zell-am-see-kaprun',
  'obergurgl',
  'bad-gastein',
  'la-plagne',
  'les-deux-alpes',
  'serre-chevalier',
  'val-gardena',
  'alta-badia',
  'cervinia',
  'laax',
  'st-moritz',
  'engelberg',
  'idre-fjall',
  'branas',
  'hafjell'
);

commit;

-- Kontroll efteråt:
--   select slug, published, image_url is not null as bild from resorts
--   where slug in ('val-d-isere', 'vemdalen', 'lech-zuers', 'saalbach', 'zell-am-see-kaprun', 'obergurgl', 'bad-gastein', 'la-plagne', 'les-deux-alpes', 'serre-chevalier', 'val-gardena', 'alta-badia', 'cervinia', 'laax', 'st-moritz', 'engelberg', 'idre-fjall', 'branas', 'hafjell');
--   Förväntat: 19 rader, alla published = true och bild = true.
