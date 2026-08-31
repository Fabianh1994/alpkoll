
-- 023 — ta nattågspåståendena ur transport_info
--
-- PR #22 rättade meningen som stod på alpsidorna: fyra orter påstods nås
-- "direkt, utan flygplats och utan transfer", och tåget stannar inte i
-- någon av dem. Rättningen omfattade koden. Samma påstående stod kvar i
-- databasen, i kolumnen transport_info, och renderas på ortsidan i rutan
-- "Med tåg och flyg" — direkt ovanför den härledda nattågsrutan som säger
-- motsatsen. St. Anton säger alltså live, i samma kort, både att nattåget
-- går hit och att man kliver av i Innsbruck och tar buss till Terminal Ost.
--
-- Meningarna tas bort i stället för att skrivas om. Nattåget beskrivs på ett
-- ställe, lib/nattaget.js, och renderas därifrån på ortsidan, alpsidorna och
-- /nattaget-till-alperna. En handskriven mening i datan kan inte hållas sann
-- när tidtabellen ändras — och den tystnar inte heller när säsongen tar slut,
-- vilket de härledda ytorna gör.
--
-- Fyra orter berörs. Genomsökningen gällde alla 38 rader: sex nämner nattåg,
-- och Åre och Riksgränsen syftar på SJ:s nattåg från Stockholm, inte på
-- Snälltåget. De är sanna och lämnas orörda. Kitzbühel nämner inget nattåg
-- alls, trots att det är den enda ort tåget faktiskt stannar i — det säger
-- den härledda rutan i stället.
--
-- Övrig text i fältet är oförändrad: flygplats, avstånd och lokala tåg står
-- kvar ord för ord.

update resorts
set transport_info = 'Flyg till Innsbruck, ungefär 1,5 timme med bil. Närmaste tågstation är Landeck-Zams med halvtimmesbuss till Ischgl. Gratis skidbussar trafikerar hela Paznaundalen under säsongen.'
where slug = 'ischgl';

update resorts
set transport_info = 'Flyg till Innsbruck, knappt en timme med bil. Zillertalbahn går från Jenbach på huvudlinjen ända in till Mayrhofen.'
where slug = 'mayrhofen';

update resorts
set transport_info = 'Flyg till Innsbruck, drygt en timme med bil.'
where slug = 'solden';

-- "Tåget stannar mitt i St. Anton" behålls men får sin egen mening: det är
-- sant om ÖBB:s trafik på Arlbergbanan, och blev vilseledande först när
-- Snälltåget stod i meningen efter.
update resorts
set transport_info = 'Flyg till Innsbruck, cirka 1,5 timme med bil, eller Zürich på drygt 2,5 timmar. St. Anton ligger på Arlbergbanan och har egen station mitt i byn.'
where slug = 'st-anton';

-- Efterkontroll: ska ge noll rader.
--
-- select slug, transport_info
-- from resorts
-- where transport_info ilike '%snälltåg%';
