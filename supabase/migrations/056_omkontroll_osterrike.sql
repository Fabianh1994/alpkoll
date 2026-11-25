-- 056 · Omkontroll av Österrike, november 2026
--
-- Underlag: projektmappen orter/omkontroll-2026-11/ (st-anton, lech-zuers,
-- solden, obergurgl, ischgl, kitzbuehel, mayrhofen, saalbach,
-- zell-am-see-kaprun, bad-gastein och granskning-omgang3.md). Varje
-- datapunkt för de tio orterna lästes om 2026-11-25, och en oberoende
-- granskare prövade förslagen och gjorde egna stickprov. Siffror, priser,
-- säsonger och restider stämde för alla tio. Det enda som ändras i
-- databasen är två betyg för Zell am See-Kaprun.
--
-- Körordning: oberoende av 054, 055 och merge.

begin;

-- Afterski 7 → 6: Ski Club GB ger Après 2/5 (alt-texten "Aprés" på
-- star2.svg). Powderhounds "vibrant bars & nightlife". Regeln från
-- omgång 7 i docs/poangskala.md: Ski Club 2/5 ger 6, som Saas-Fee.
--
-- Nybörjare 6 → 7: skiresort Schmittenhöhe 5/5 ("reach Zell am See and
-- Schmittental via easy slopes", övningsområde med täckt rullband vid
-- areitXpress, övningsliftar i Schüttdorf, Schmittental och Viehhofen),
-- skiresort Kaprun 4/5, Ski Club GB Beginner 4/5. Granskningen av omgång
-- 2 satte 6 med Lechnerberg (utanför området) och gondolen ner från
-- glaciären som skäl; Schmittenhöhe prövades inte då. Cortina och Madonna
-- har 7 på samma källbild.
update resorts
set apres_ski_score = 6, beginner_score = 7
where slug = 'zell-am-see-kaprun' and apres_ski_score = 7 and beginner_score = 6;

do $$
begin
  if not exists (select 1 from resorts
                 where slug = 'zell-am-see-kaprun' and apres_ski_score = 6 and beginner_score = 7) then
    raise exception 'Zell am See-Kaprun fick inte de nya betygen';
  end if;
end $$;

commit;
