-- Sälens ortstext sade "Fallhöjden är 315 meter", medan sifferrutorna,
-- sökresultatet och vanliga frågor på samma sida säger 308 m (den största
-- fallhöjden inom ett och samma delområde, se lib/delomraden.js).
-- "fallhöjd sälen" är en av sajtens största sökfrågor.
--
-- Talet stryks ur löptexten i stället för att rättas, enligt docs/copy.md:
-- tal skrivs inte för hand i text, de hämtas ur datan så att de inte kan
-- glida isär igen. Jämförelsen med Åre står kvar som ord.
--
-- Kör i Supabase SQL Editor. Uppdaterar exakt en rad.

update resorts
set notes = replace(
  notes,
  'Vill du åka brant är Sälen fel val. Fallhöjden är 315 meter, minst av de svenska orterna här. Åre har 939.',
  'Vill du åka brant är Sälen fel val. Fallhöjden är den minsta av de svenska orterna här, och Åre har ungefär tre gånger så mycket.'
)
where slug = 'salen'
  and notes like '%Fallhöjden är 315 meter%';
