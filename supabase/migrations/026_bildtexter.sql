
-- 026 — bildtexterna omskrivna
--
-- Texterna från 025 visas som bildtext i galleriets förstoring och på
-- /bildkallor, och de lät maskinskrivna. Nästan alla följde samma mall —
-- ort, ljus eller väder, "med X och Y bakom" — och staplade samma ord:
-- snöklädda toppar, snötyngd, orörd, vinterskrud. Fabian 2026-09-11:
-- "Ingen människa skriver så."
--
-- De nya texterna är korta och bär platsnamnet där källan har ett:
-- Boismint, Idalp, Pardatschgrat, Galzigbahn, Hundfjället, Marmottes. En
-- text säger bara det bilden visar, och säger det rakt ut när bilden inte
-- är en vinterbild.
--
-- Den gamla texten står som kommentar ovanför varje rad.


begin;

-- ── alpe-d-huez ───────────────────────────────────────────────────────

-- var: Alpe d'Huez sett från pisten, med byn nedanför och snöklädda toppar bakom
update public.resort_images set alt = 'Alpe d''Huez sett från Marcel''s Farm' where resort_slug = 'alpe-d-huez' and position = 0;

-- var: Byn Alpe d'Huez uppifrån, en tätt bebyggd sluttning med hotell och lägenhetshus i snö
update public.resort_images set alt = 'Centrala Alpe d''Huez från Côtes Souveraines' where resort_slug = 'alpe-d-huez' and position = 1;

-- var: Breda pister på fjällsidan ovanför Alpe d'Huez
update public.resort_images set alt = 'Pisterna vid Les Jeux' where resort_slug = 'alpe-d-huez' and position = 2;

-- var: Gågatan i Alpe d'Huez med skiduthyrning, kaféer och folk i solen
update public.resort_images set alt = 'Köpcentret Les Bergers mitt i byn' where resort_slug = 'alpe-d-huez' and position = 3;

-- var: Långt lägenhetshus i trä och betong vid pisten i Alpe d'Huez
update public.resort_images set alt = 'Résidence 2000, ett av de stora husen vid pisten' where resort_slug = 'alpe-d-huez' and position = 4;

-- var: Moderna hotell- och lägenhetshus kring en öppen plats i Alpe d'Huez
update public.resort_images set alt = 'Hôtel Le Dôme och husen runt torget' where resort_slug = 'alpe-d-huez' and position = 5;

-- ── are ───────────────────────────────────────────────────────────────

-- var: Kabinbanan på Åreskutan i gryningsljus, med nedisade liftstolpar och dimma över dalen
update public.resort_images set alt = 'Kabinbanans toppstation på Åreskutan i gryningen' where resort_slug = 'are' and position = 0;

-- var: Åreskutan i rosa kvällsljus, med snötyngd skog och stugor nedanför
update public.resort_images set alt = 'Åreskutan en vinterkväll' where resort_slug = 'are' and position = 1;

-- var: Pister genom skogen på fjällsidan i Åre i kvällssol
update public.resort_images set alt = 'Nedfarterna genom skogen på Åreskutan' where resort_slug = 'are' and position = 2;

-- var: Äldre hotellbyggnader i Åre by med fjället och backarna bakom
update public.resort_images set alt = 'Åre by, med backarna ovanför husen' where resort_slug = 'are' and position = 3;

-- var: Molnhav över dalen sett från fjället i Åre, med en liftmast i förgrunden
update public.resort_images set alt = 'Molnen ligger kvar i dalen nedanför Åre' where resort_slug = 'are' and position = 4;

-- var: Solnedgång över fjällen från toppen av en pist i Åre
update public.resort_images set alt = 'Solnedgång från toppen av Åreskutan' where resort_slug = 'are' and position = 5;

-- ── chamonix ──────────────────────────────────────────────────────────

-- var: Aiguille du Midi med utsiktsstationen på toppen och Chamonixdalen långt nedanför
update public.resort_images set alt = 'Toppstationen på Aiguille du Midi' where resort_slug = 'chamonix' and position = 0;

-- var: Kvällsstämning vid klocktornet på torget i Chamonix, med de spetsiga topparna bakom
update public.resort_images set alt = 'Klocktornet på torget i Chamonix en vinterkväll' where resort_slug = 'chamonix' and position = 1;

-- var: Kabinbanan upp mot Aiguille du Midi framför snöklädda toppar
update public.resort_images set alt = 'Kabinbanan upp till Aiguille du Midi' where resort_slug = 'chamonix' and position = 2;

-- var: Snöklädda sluttningar under bergskedjan ovanför Chamonix
update public.resort_images set alt = 'Pisterna ovanför Chamonix' where resort_slug = 'chamonix' and position = 3;

-- var: Blomsterlådor vid ån Arve i centrala Chamonix, med Mont Blanc-massivet bakom
update public.resort_images set alt = 'Ån Arve i Chamonix, en sommardag' where resort_slug = 'chamonix' and position = 4;

-- var: Hotell Alpina i Chamonix, ett högt trähus i flera våningar, i snöfall
update public.resort_images set alt = 'Hotel Alpina i snöfall' where resort_slug = 'chamonix' and position = 5;

-- ── cortina-d-ampezzo ─────────────────────────────────────────────────

-- var: Kyrktornet och huvudgatan i Cortina d'Ampezzo i kvällssol, med Dolomiterna bakom
update public.resort_images set alt = 'Kyrktornet vid Corso Italia, huvudgatan i Cortina' where resort_slug = 'cortina-d-ampezzo' and position = 0;

-- var: Klippformationen Cinque Torri i vinterskrud ovanför Cortina d'Ampezzo
update public.resort_images set alt = 'Cinque Torri' where resort_slug = 'cortina-d-ampezzo' and position = 1;

-- var: Hus och hotell i snö i utkanten av Cortina d'Ampezzo
update public.resort_images set alt = 'Hus i snön i utkanten av Cortina' where resort_slug = 'cortina-d-ampezzo' and position = 2;

-- var: Skidåkare på pisten under Dolomiternas lodräta klippväggar vid Cortina d'Ampezzo
update public.resort_images set alt = 'En pist under Dolomiternas klippor vid Cortina' where resort_slug = 'cortina-d-ampezzo' and position = 3;

-- var: Cortina d'Ampezzo i dalen med skogklädda berg och snöfläckiga toppar bakom
update public.resort_images set alt = 'Cortina d''Ampezzo i dalen' where resort_slug = 'cortina-d-ampezzo' and position = 4;

-- ── courchevel ────────────────────────────────────────────────────────

-- var: Toppstationen i Courchevel framför snöklädda berg och ett molntäcke
update public.resort_images set alt = 'Toppstationen ovanför molnen i Courchevel' where resort_slug = 'courchevel' and position = 0;

-- var: Courchevel genom snötyngd granskog en snöig dag
update public.resort_images set alt = 'Courchevel Moriond sett från Courchevel Village' where resort_slug = 'courchevel' and position = 1;

-- var: Chaletbyggnader i trä längs en gata i Courchevel
update public.resort_images set alt = 'Chaletar längs gatan i Courchevel' where resort_slug = 'courchevel' and position = 2;

-- var: En familj med skidor vid en utsiktspunkt ovanför pisterna i Courchevel
update public.resort_images set alt = 'En familj på väg ut i backen i Courchevel' where resort_slug = 'courchevel' and position = 3;

-- var: Snötäckta chaletar bland granar i Courchevel
update public.resort_images set alt = 'Chaletar i nysnö i Courchevel' where resort_slug = 'courchevel' and position = 4;

-- var: Gondolbanan över ett högt lägenhetshus i Courchevel, med dalen bakom
update public.resort_images set alt = 'Gondolen över Courchevel Moriond' where resort_slug = 'courchevel' and position = 5;

-- ── geilo ─────────────────────────────────────────────────────────────

-- var: Geilo uppifrån i blå timme, med upplysta pister och byn i dalen
update public.resort_images set alt = 'Geilo från luften en vinterkväll' where resort_slug = 'geilo' and position = 0;

-- var: Vidsträckt snöigt fjällandskap vid Geilo med en ensam stuga
update public.resort_images set alt = 'Fjället ovanför Geilo' where resort_slug = 'geilo' and position = 1;

-- var: Fjällstugor bland björkar med snöklädda vidder bakom Geilo
update public.resort_images set alt = 'Stugor i björkskogen ovanför Geilo' where resort_slug = 'geilo' and position = 2;

-- ── grandvalira ───────────────────────────────────────────────────────

-- var: Liftbasen i Grandvalira med pister och Pyrenéernas toppar bakom
update public.resort_images set alt = 'Liftbasen vid Grau Roig' where resort_slug = 'grandvalira' and position = 0;

-- var: Pister och en restaurang i trä vid liftbasen i Grandvalira
update public.resort_images set alt = 'Restaurangen vid pisterna i Grau Roig' where resort_slug = 'grandvalira' and position = 1;

-- var: Breda pister på högplatån i Grandvalira
update public.resort_images set alt = 'Pisterna ovanför Pas de la Casa' where resort_slug = 'grandvalira' and position = 2;

-- var: Kabinbanan över pisterna vid Soldeu i Grandvalira
update public.resort_images set alt = 'Kabinbanan i Soldeu' where resort_slug = 'grandvalira' and position = 3;

-- var: Liftbasen i Grandvalira med flaggor och backar upp mot bergen
update public.resort_images set alt = 'Liftbasen i Grandvalira' where resort_slug = 'grandvalira' and position = 4;

-- ── hemavan ───────────────────────────────────────────────────────────

-- var: Nypistad backe i Hemavan med utsikt över kalfjället i motljus
update public.resort_images set alt = 'Utsikt från pisten Glidaren' where resort_slug = 'hemavan' and position = 0;

-- var: Släpliften upp mot kalfjället i Hemavan
update public.resort_images set alt = 'Toppen av Mellanliften' where resort_slug = 'hemavan' and position = 1;

-- var: Snöklädd fjälltopp över frostig björkskog vid Hemavan
update public.resort_images set alt = 'Fjällen västerut, troligen på norska sidan' where resort_slug = 'hemavan' and position = 2;

-- var: Öppen fjällsluttning med pister i Hemavan en solig dag
update public.resort_images set alt = 'Mellanliften sedd från Kungsliftens dalstation' where resort_slug = 'hemavan' and position = 3;

-- var: Utsikt från en fjällstuga över dalen i Hemavan
update public.resort_images set alt = 'Dalen och pisten Bäckravinen från Kungsliftens dalstation' where resort_slug = 'hemavan' and position = 4;

-- var: Pist ovanför trädgränsen med utsikt över dalen i Hemavan
update public.resort_images set alt = 'Dalen sedd från Mellanbacken' where resort_slug = 'hemavan' and position = 5;

-- ── hemsedal ──────────────────────────────────────────────────────────

-- var: Stolliften i Hemsedal med en snowboardåkare och dalen långt nedanför
update public.resort_images set alt = 'Stolliften upp ur dalen i Hemsedal' where resort_slug = 'hemsedal' and position = 0;

-- var: Fjällen i Hemsedal uppifrån i vinterskrud, med pisterna på sluttningen
update public.resort_images set alt = 'Hemsedal från flygplan' where resort_slug = 'hemsedal' and position = 1;

-- var: Snöklädda toppar ovanför Hemsedal
update public.resort_images set alt = 'Utsikten från Skarsnuten' where resort_slug = 'hemsedal' and position = 2;

-- var: Pister genom skogen på fjällsidan i Hemsedal
update public.resort_images set alt = 'Hemsedal skisenter' where resort_slug = 'hemsedal' and position = 3;

-- var: Stugor i snötäckt skog under fjälltopparna i Hemsedal
update public.resort_images set alt = 'Från Skarsnuten, norrut' where resort_slug = 'hemsedal' and position = 4;

-- ── ischgl ────────────────────────────────────────────────────────────

-- var: Fullsatt solterrass vid pisten i Ischgl med snöklädda toppar bakom
update public.resort_images set alt = 'Solterrassen på Idalp' where resort_slug = 'ischgl' and position = 0;

-- var: Utsikt från kabinbanan över Paznauntalet och bergen kring Ischgl
update public.resort_images set alt = 'Utsikt från kabinbanan över Paznaun' where resort_slug = 'ischgl' and position = 1;

-- var: Skidområdet ovanför Ischgl med breda nedfarter mellan topparna
update public.resort_images set alt = 'Pisterna sedda från Pardatschgrat' where resort_slug = 'ischgl' and position = 2;

-- var: Affärsgata i Ischgl med sportbutiker och hotell
update public.resort_images set alt = 'Affärsgatan i Ischgl' where resort_slug = 'ischgl' and position = 3;

-- var: Orörd snö och frostiga granar på fjällsidan vid Ischgl
update public.resort_images set alt = 'Skogen ovanför Ischgl efter ett snöfall' where resort_slug = 'ischgl' and position = 4;

-- var: Kabinbana över skogen i dalen vid Ischgl
update public.resort_images set alt = 'Kabinbanan upp från dalen' where resort_slug = 'ischgl' and position = 5;

-- ── kitzbuehel ────────────────────────────────────────────────────────

-- var: Stollift och pister på snöklädda toppar i skidområdet vid Kitzbühel
update public.resort_images set alt = 'Stolliftar i skidområdet ovanför Kitzbühel' where resort_slug = 'kitzbuehel' and position = 0;

-- var: Kitzbühel i dalen sett från berget, med snöfläckiga sluttningar
update public.resort_images set alt = 'Kitzbühel sett från berget' where resort_slug = 'kitzbuehel' and position = 1;

-- var: Färgglada fasader och juldekorationer i Kitzbühels gamla stad
update public.resort_images set alt = 'Gamla stan i Kitzbühel i juletid' where resort_slug = 'kitzbuehel' and position = 2;

-- var: Timrad fjällstuga i snö med utsikt mot bergen kring Kitzbühel
update public.resort_images set alt = 'En fjällstuga ovanför Kitzbühel' where resort_slug = 'kitzbuehel' and position = 3;

-- var: Snötäckta hus i Kitzbühel under skogklädda backar
update public.resort_images set alt = 'Kitzbühel med Hahnenkamm och Streif i bakgrunden' where resort_slug = 'kitzbuehel' and position = 4;

-- var: Stort vitt pensionat i snö med skogklädda berg bakom, Kitzbühel
update public.resort_images set alt = 'Ett pensionat i utkanten av Kitzbühel' where resort_slug = 'kitzbuehel' and position = 5;

-- ── les-arcs ──────────────────────────────────────────────────────────

-- var: Byarna i Les Arcs från pisten, med en stollift i förgrunden
update public.resort_images set alt = 'Arc 1950 och Arc 2000 från pisten Bois de l''Ours' where resort_slug = 'les-arcs' and position = 0;

-- var: Lägenhetshus vid liftbasen i Les Arcs med backarna ovanför
update public.resort_images set alt = 'Arc 1950 och Arc 2000 från foten av Bois de l''Ours' where resort_slug = 'les-arcs' and position = 1;

-- var: Les Arcs vid pisten med dalen och snöklädda toppar bakom
update public.resort_images set alt = 'Arc 1950 med Mont Blanc i fjärran' where resort_slug = 'les-arcs' and position = 2;

-- var: Lägenhetshus i Les Arcs vid en bred pist
update public.resort_images set alt = 'Arc 2000 från släpliften Marmottes' where resort_slug = 'les-arcs' and position = 3;

-- var: Skidåkare på väg ner mot byn i Les Arcs
update public.resort_images set alt = 'Arc 1950 och Arc 2000 från Edelweiss-pisten' where resort_slug = 'les-arcs' and position = 4;

-- var: Chaletby i Les Arcs under en brant snöklädd topp
update public.resort_images set alt = 'Arc 1950 från Cabriolet-stationen' where resort_slug = 'les-arcs' and position = 5;

-- ── levi ──────────────────────────────────────────────────────────────

-- var: Frostklädd granskog och pisterna på fjället i Levi i vintersol
update public.resort_images set alt = 'Skogen och pisterna på Levitunturi' where resort_slug = 'levi' and position = 0;

-- var: Norrsken över snötyngda träd på fjället i Levi
update public.resort_images set alt = 'Norrsken över Levi' where resort_slug = 'levi' and position = 1;

-- var: Utsikt över skog och myrar från fjället i Levi i skymning
update public.resort_images set alt = 'Utsikt från fjället i Levi en vinterkväll' where resort_slug = 'levi' and position = 2;

-- var: Stugby i snöig skog uppifrån i blå timme, Levi
update public.resort_images set alt = 'En stugby i Levi uppifrån' where resort_slug = 'levi' and position = 3;

-- ── livigno ───────────────────────────────────────────────────────────

-- var: Breda, öppna pister på sluttningarna i Livigno
update public.resort_images set alt = 'Pisterna i Livigno' where resort_slug = 'livigno' and position = 0;

-- var: Huvudgatan i Livigno med snö på taken och fjällsidan bakom
update public.resort_images set alt = 'Huvudgatan i Livigno' where resort_slug = 'livigno' and position = 1;

-- var: Livigno i den breda dalen, med pisterna ner mot byn
update public.resort_images set alt = 'Utsikt från Valandrea-gondolen' where resort_slug = 'livigno' and position = 2;

-- var: Livigno uppifrån, med byn i dalen och skidbackar genom skogen
update public.resort_images set alt = 'Livigno från luften' where resort_slug = 'livigno' and position = 3;

-- var: Den snötäckta dalbotten i Livigno mellan höga toppar
update public.resort_images set alt = 'Dalen i Livigno' where resort_slug = 'livigno' and position = 4;

-- var: Turskidåkare i spår uppför en orörd snösluttning vid Livigno
update public.resort_images set alt = 'Turåkare på väg upp i Livigno' where resort_slug = 'livigno' and position = 5;

-- ── madonna-di-campiglio ──────────────────────────────────────────────

-- var: Madonna di Campiglio vid pistens fot, med Brentadolomiterna bakom
update public.resort_images set alt = 'Madonna di Campiglio och Brentadolomiterna' where resort_slug = 'madonna-di-campiglio' and position = 0;

-- var: Hotell och kaféer vid torget i Madonna di Campiglio
update public.resort_images set alt = 'Torget i Madonna di Campiglio' where resort_slug = 'madonna-di-campiglio' and position = 1;

-- var: Stollift genom granskogen i Madonna di Campiglio
update public.resort_images set alt = 'Fortini-liften' where resort_slug = 'madonna-di-campiglio' and position = 2;

-- var: Brentadolomiternas klippor ovanför molnen
update public.resort_images set alt = 'Brentadolomiterna i moln' where resort_slug = 'madonna-di-campiglio' and position = 3;

-- var: Pister på högplatån med utsikt mot bergskedjan, Madonna di Campiglio
update public.resort_images set alt = 'Pisterna ovanför Madonna di Campiglio' where resort_slug = 'madonna-di-campiglio' and position = 4;

-- ── mayrhofen ─────────────────────────────────────────────────────────

-- var: Mayrhofen i kvällsljus med upplysta hotell och stjärnhimmel över bergen
update public.resort_images set alt = 'Mayrhofen och Finkenberg en vinternatt' where resort_slug = 'mayrhofen' and position = 0;

-- var: Snöklädd topp i Zillertal sedd från pisten ovanför Mayrhofen
update public.resort_images set alt = 'Utsikt från pisten ovanför Mayrhofen' where resort_slug = 'mayrhofen' and position = 1;

-- var: Gondol vid toppstationen ovanför Mayrhofen med bergen i Zillertal bakom
update public.resort_images set alt = 'Gondolen vid toppstationen' where resort_slug = 'mayrhofen' and position = 2;

-- var: Zillertal med Mayrhofen i dalbotten, sett från berget
update public.resort_images set alt = 'Mot Mayrhofen från Ahorns nedfart till dalen' where resort_slug = 'mayrhofen' and position = 3;

-- var: Fjällrestaurang i trä med snowboards utanför, ovanför Mayrhofen
update public.resort_images set alt = 'Panoramahütte på Ahorn' where resort_slug = 'mayrhofen' and position = 4;

-- ── meribel ───────────────────────────────────────────────────────────

-- var: Skidåkare vid liftbasen i Méribel framför chalethotell
update public.resort_images set alt = 'Le Laitelet och L''Hameau i Méribel-Mottaret, sett från pistens slut' where resort_slug = 'meribel' and position = 0;

-- var: Méribel i snöfall, chaletbyn på sluttningen ovanför skogen
update public.resort_images set alt = 'Méribel-Centre i snöfall' where resort_slug = 'meribel' and position = 1;

-- var: Chaletar vid pistens slut i Méribel
update public.resort_images set alt = 'Méribel Village' where resort_slug = 'meribel' and position = 2;

-- var: Skidåkare på pisten ner mot chaletarna i Méribel
update public.resort_images set alt = 'Méribel-Mottaret från pisten Martre' where resort_slug = 'meribel' and position = 3;

-- var: Chaletbebyggelse vid pisterna på fjällsidan i Méribel
update public.resort_images set alt = 'Dent de Burgin och Le Chatelet i Méribel-Mottaret' where resort_slug = 'meribel' and position = 4;

-- var: Pist och liftstation med utsikt över bergen kring Méribel
update public.resort_images set alt = 'Mellanstationen på Tougnète' where resort_slug = 'meribel' and position = 5;

-- ── riksgransen ───────────────────────────────────────────────────────

-- var: Liftstation i snöyra på fjället i Riksgränsen
update public.resort_images set alt = 'En liftstation i Riksgränsen en blåsig dag' where resort_slug = 'riksgransen' and position = 0;

-- ── ruka ──────────────────────────────────────────────────────────────

-- var: Byn i Ruka med hotell och lägenhetshus nedanför fjällets pister
update public.resort_images set alt = 'Ruka by nedanför backarna' where resort_slug = 'ruka' and position = 0;

-- var: Toppen i Ruka i kvällssol, med snötyngda träd i orange ljus
update public.resort_images set alt = 'Solnedgång över backarna på Rukatunturi' where resort_slug = 'ruka' and position = 1;

-- var: Skidåkare och snowboardåkare i solnedgången på fjället i Ruka
update public.resort_images set alt = 'Åkare på toppen av Ruka i solnedgången' where resort_slug = 'ruka' and position = 2;

-- var: Stollift på fjällsidan i Ruka en klar dag
update public.resort_images set alt = 'Stolliften på Ruka' where resort_slug = 'ruka' and position = 3;

-- var: Snötyngda granar längs en pist i Ruka i blå timme
update public.resort_images set alt = 'Granar i snö längs en pist i Ruka' where resort_slug = 'ruka' and position = 4;

-- var: Upplyst pist genom snötyngd skog i Ruka
update public.resort_images set alt = 'Kvällsåkning i Ruka' where resort_slug = 'ruka' and position = 5;

-- ── saas-fee ──────────────────────────────────────────────────────────

-- var: Saas-Fee i kvällsljus mellan lärkträd, med en solbelyst topp bakom
update public.resort_images set alt = 'Saas-Fee i skuggan mellan lärkträden' where resort_slug = 'saas-fee' and position = 0;

-- var: Kabinbana över glaciären ovanför Saas-Fee
update public.resort_images set alt = 'Linbanan över glaciären ovanför Saas-Fee' where resort_slug = 'saas-fee' and position = 1;

-- var: Saas-Fee i dalen under höga snöklädda toppar
update public.resort_images set alt = 'Saas-Fee och bergen runt dalen' where resort_slug = 'saas-fee' and position = 2;

-- var: Saas-Fee uppifrån, byn i snö omgiven av berg
update public.resort_images set alt = 'Saas-Fee uppifrån i februari' where resort_slug = 'saas-fee' and position = 3;

-- var: Den roterande restaurangen på Mittelallalin ovanför Saas-Fee
update public.resort_images set alt = 'Den roterande restaurangen på Mittelallalin' where resort_slug = 'saas-fee' and position = 4;

-- ── salen ─────────────────────────────────────────────────────────────

-- var: Pister genom skogen på fjället i Sälen en klar vinterdag
update public.resort_images set alt = 'Tandådalen sett från Hundfjället' where resort_slug = 'salen' and position = 0;

-- var: Skidåkare vid toppstationen för en stollift i Sälen
update public.resort_images set alt = 'Toppstationen för E8-an på Hundfjället' where resort_slug = 'salen' and position = 1;

-- var: Pister och snötyngda granar på kalfjället i Sälen
update public.resort_images set alt = 'Ravinbackarna på Hundfjället' where resort_slug = 'salen' and position = 2;

-- var: Snöskulpterade träd på kalfjället i Sälen
update public.resort_images set alt = 'Snöiga träd på Hundfjället' where resort_slug = 'salen' and position = 3;

-- var: Stugor längs en snöig väg i skogen i Tandådalen, Sälen
update public.resort_images set alt = 'Stugor i Tandådalen' where resort_slug = 'salen' and position = 4;

-- var: Ett ensamt snötyngt träd på fjällplatån i Sälen
update public.resort_images set alt = 'Uppe på Hundfjället' where resort_slug = 'salen' and position = 5;

-- ── solden ────────────────────────────────────────────────────────────

-- var: Vägen upp mot skidområdet i Sölden, med hotell och snöklädda toppar
update public.resort_images set alt = 'Hotell längs vägen i Sölden' where resort_slug = 'solden' and position = 0;

-- var: Gondol över pisterna högt upp i skidområdet i Sölden
update public.resort_images set alt = 'Gondolen mot Schwarzkogel' where resort_slug = 'solden' and position = 1;

-- var: Toppstation på en snöklädd bergskam i Sölden
update public.resort_images set alt = 'Gaislachkogl, där 007 Elements ligger' where resort_slug = 'solden' and position = 2;

-- var: Restaurangen Ice Q på Gaislachkogl i Sölden
update public.resort_images set alt = 'Ice Q på Gaislachkogl' where resort_slug = 'solden' and position = 3;

-- var: Sölden i snöfall, sett från en sluttning ovanför byn
update public.resort_images set alt = 'Sölden i snöfall' where resort_slug = 'solden' and position = 4;

-- var: Hus i snö vid ån i Sölden en grå dag
update public.resort_images set alt = 'Hus vid ån i Sölden' where resort_slug = 'solden' and position = 5;

-- ── st-anton ──────────────────────────────────────────────────────────

-- var: Pister och toppar i skidområdet vid St. Anton en solig dag
update public.resort_images set alt = 'Skidområdet ovanför St. Anton' where resort_slug = 'st-anton' and position = 0;

-- var: En gondol i dalstationen i St. Anton
update public.resort_images set alt = 'En gondol i Galzigbahns dalstation' where resort_slug = 'st-anton' and position = 1;

-- var: Pister ner mot byn i St. Anton med skogklädda berg bakom
update public.resort_images set alt = 'Parken vid Hannes-Schneider-Weg i St. Anton' where resort_slug = 'st-anton' and position = 2;

-- var: St. Anton vid ån Rosanna, med hotell och snöklädda toppar
update public.resort_images set alt = 'Ån Rosanna genom St. Anton' where resort_slug = 'st-anton' and position = 3;

-- var: Fjällstuga ovanför ett molnhav, sett genom ett rött nät, St. Anton
update public.resort_images set alt = 'En fjällstuga ovanför molnen, genom ett pistnät' where resort_slug = 'st-anton' and position = 4;

-- ── tignes ────────────────────────────────────────────────────────────

-- var: Tignes uppifrån, med byarna vid dalbotten och pisterna runt omkring
update public.resort_images set alt = 'Tignes från luften' where resort_slug = 'tignes' and position = 0;

-- var: Två snowboardåkare på väg mot chalethotellen vid pisten i Tignes
update public.resort_images set alt = 'Snowboardåkare på väg hem i Tignes' where resort_slug = 'tignes' and position = 1;

-- var: Tignes i kvällsljus med upplysta chaletar och snötäckt berg bakom
update public.resort_images set alt = 'Tignes en vinterkväll' where resort_slug = 'tignes' and position = 2;

-- var: Tignes le Lac med sina stora lägenhetskomplex vid pisten
update public.resort_images set alt = 'Tignes le Lac från skidområdet' where resort_slug = 'tignes' and position = 3;

-- var: Nedisad stollift mot blå himmel i Tignes
update public.resort_images set alt = 'Nedisad stollift i Tignes' where resort_slug = 'tignes' and position = 4;

-- var: Pist ner mot Tignes med höghus och snöklädda toppar
update public.resort_images set alt = 'Pisten ner mot Tignes le Lac' where resort_slug = 'tignes' and position = 5;

-- ── trysil ────────────────────────────────────────────────────────────

-- var: Trysilfjellet med pisterna ovanför Trysil by en klar vinterdag
update public.resort_images set alt = 'Trysilfjellet och Trysil by' where resort_slug = 'trysil' and position = 0;

-- ── val-thorens ───────────────────────────────────────────────────────

-- var: Val Thorens högt uppe i dalen, byn omgiven av snötäckta sluttningar
update public.resort_images set alt = 'Val Thorens från Boismint en januarimorgon' where resort_slug = 'val-thorens' and position = 0;

-- var: Val Thorens sett från pisten, med stolliften och topparna bakom
update public.resort_images set alt = 'Val Thorens och stolliften vid Boismint' where resort_slug = 'val-thorens' and position = 1;

-- var: Fullsatt uteservering vid La Folie Douce på pisten i Val Thorens
update public.resort_images set alt = 'La Folie Douce' where resort_slug = 'val-thorens' and position = 2;

-- var: Butiker och restauranger vid gågatan i Val Thorens
update public.resort_images set alt = 'Gågatan i Val Thorens' where resort_slug = 'val-thorens' and position = 3;

-- var: Skidåkare på pisten ner mot byggnaderna i Val Thorens
update public.resort_images set alt = 'Pisten in mot Val Thorens' where resort_slug = 'val-thorens' and position = 4;

-- var: Skidåkare på pisten i Val Thorens vid solnedgång
update public.resort_images set alt = 'Solnedgång över pisterna i Val Thorens' where resort_slug = 'val-thorens' and position = 5;

-- ── verbier ───────────────────────────────────────────────────────────

-- var: Chaletar och snötyngda granar i Verbier
update public.resort_images set alt = 'Chaletar i Verbier efter snöfall' where resort_slug = 'verbier' and position = 0;

-- var: Snötäckta chalettak i Verbier under en rosa kvällshimmel
update public.resort_images set alt = 'Verbier i skymningen' where resort_slug = 'verbier' and position = 1;

-- var: Bokstäverna VERBIER i snön med utsikt över dalen
update public.resort_images set alt = 'Skylten vid Croix de Coeur' where resort_slug = 'verbier' and position = 2;

-- var: Kabinbanan mot Mont Fort ovanför Verbier
update public.resort_images set alt = 'Kabinbanan till Mont Fort' where resort_slug = 'verbier' and position = 3;

-- var: Skidåkare i orörd pudersnö i Verbier
update public.resort_images set alt = 'Offpist i Verbier' where resort_slug = 'verbier' and position = 4;

-- var: Chalet i trä med balkonger och snöklädda toppar bakom, Verbier
update public.resort_images set alt = 'En chalet i Verbier' where resort_slug = 'verbier' and position = 5;

-- ── voss ──────────────────────────────────────────────────────────────

-- var: Voss gondol ovanför byn och sjön Vangsvatnet i snö
update public.resort_images set alt = 'Vossevangen och Vangsvatnet från gondolen' where resort_slug = 'voss' and position = 0;

-- var: Passagerare i Voss gondol med utsikt över byn och sjön
update public.resort_images set alt = 'I Voss gondol på väg upp' where resort_slug = 'voss' and position = 1;

-- var: Utsikt från Voss gondol över Vossevangen och Vangsvatnet
update public.resort_images set alt = 'Utsikt från gondolen i november' where resort_slug = 'voss' and position = 2;

-- var: Gondolen på väg upp från Voss med dimma över sjön
update public.resort_images set alt = 'Gondolen ovanför Vangsvatnet' where resort_slug = 'voss' and position = 3;

-- ── zermatt ───────────────────────────────────────────────────────────

-- var: Zermatt i snö med Matterhorn ovanför byn
update public.resort_images set alt = 'Zermatt och Matterhorn' where resort_slug = 'zermatt' and position = 0;

-- var: Gornergratbanan framför Matterhorn och snöklädda toppar
update public.resort_images set alt = 'Gornergratbanan' where resort_slug = 'zermatt' and position = 1;

-- var: Skidåkare på pisten med Matterhorn i bakgrunden
update public.resort_images set alt = 'Åkare nedanför Matterhorn' where resort_slug = 'zermatt' and position = 2;

-- var: Zermatt i dalen mellan snöklädda berg, med Matterhorn i fjärran
update public.resort_images set alt = 'Zermatt från Hotel Schönegg' where resort_slug = 'zermatt' and position = 3;

-- var: Snötäckta hustak i centrala Zermatt uppifrån
update public.resort_images set alt = 'Zermatt från luften' where resort_slug = 'zermatt' and position = 4;

-- var: Solterrass i trä med utsikt mot Matterhorn
update public.resort_images set alt = 'Terrass med utsikt mot Matterhorn' where resort_slug = 'zermatt' and position = 5;

commit;


-- ── Efterkontroll ─────────────────────────────────────────────────────
--
-- 1. Inga av de gamla malluttrycken ska finnas kvar:
--
--      SELECT resort_slug, position, alt FROM resort_images
--      WHERE alt ILIKE '%snöklädd%' OR alt ILIKE '%snötyngd%'
--         OR alt ILIKE '%orörd%' OR alt ILIKE '%vinterskrud%' OR alt ILIKE '%bakom%';
--
--      Förväntat: inga rader.
--
-- 2. Varje rad har en text:
--
--      SELECT count(*) FROM resort_images WHERE alt IS NULL OR alt = '';
--
--      Förväntat: 0.
