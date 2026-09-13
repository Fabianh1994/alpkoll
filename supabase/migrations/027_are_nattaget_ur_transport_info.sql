
-- 027 — ta nattåget ur Åres transport_info
--
-- Åre har två nattåg från Stockholm: SJ, som går varje dag, och Snälltåget,
-- som går fyra dagar i veckan. transport_info beskrev ett av dem utan att
-- säga vilket. "Nattåget från Stockholm ... tar ungefär sju timmar" syftar på
-- SJ enligt genomgången i migration 023, och ortsidans svar om resan lade
-- Snälltågets tider direkt efter. Läst tillsammans blev det ett tåg som tar
-- sju timmar och går fyra dagar i veckan, och något sådant tåg finns inte.
--
-- Trafikverket meddelade 9 september 2026 att SJ:s nattåg Stockholm–Duved är
-- upphandlat 13 december 2026 till 13 juni 2027. Båda tågen beskrivs nu i
-- lib/restider.js med operatör, period och källa, och faller bort när
-- linjens sista dag passerat. En mening i databasen gör inte det.
--
-- "Ungefär sju timmar" stämmer inte för nattåget. SJ:s bokning 13 september
-- 2026 visar nattåg 70 Stockholm 22.40, Åre 07.59, alltså 9 tim 19 min utan
-- byte. Sju timmar är dagtågets restid (6 tim 50 min). Meningen tas bort i
-- stället för att skrivas om, eftersom tidtabellen byts 13 december.
--
-- Övrig text är oförändrad ord för ord. Villkoret på den gamla texten gör att
-- migrationen inte skriver över en ändring som gjorts efter 13 september.
--
-- Riksgränsen lämnas orörd. Dess mening gäller nattåget mot Narvik, en annan
-- linje som avtalet inte omfattar, och ingenting på den sidan säger emot den.

update resorts
set transport_info = 'Med bil tar det åtta timmar från Stockholm. Vill du flyga går direktflyg till Åre Östersund, en timme med bil från byn.'
where slug = 'are'
  and transport_info like 'Nattåget från Stockholm stannar mitt i Åre by%';

-- Efterkontroll: ska ge en rad som inte nämner nattåget.
--
-- select slug, transport_info
-- from resorts
-- where slug = 'are';
