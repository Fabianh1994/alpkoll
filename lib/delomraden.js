/**
 * Orter vars tal är summan av flera poster hos källan.
 *
 * Konventionen i CLAUDE.md säger att pist, liftar och höjder avser hela
 * det sammankopplade området, och `ski_area` namnger det området för de
 * nio orter i fyra områden som delar tal med sina grannar (migration 047
 * tömde fältet för orter utan grannort på sajten). Två orter faller utanför
 * den regeln: deras tal är hopslagna av flera skilda poster på
 * skiresort.com, och delarna hänger inte ihop med lift.
 *
 * Det syns inte i talen. Sälens 87 km ser ut som ett område, men är 42 km
 * på ett fjäll och 45 på ett annat. Chamonix 169 km är fyra dalstationer
 * med buss emellan. Besökaren som jämför Chamonix med en ort på 150 km
 * läser 169 mot 150 och tror att den första är större; i praktiken åker
 * hon inte mer än 56 km utan att byta område.
 *
 * FALLHÖJDEN ÄR DET SOM BLIR DIREKT FEL. Sajten räknar den som högsta
 * punkt minus lägsta, vilket för ett sammanhängande område är rätt. För
 * en hopslagning korsar uträkningen två områden och ger en fallhöjd ingen
 * backe har: Sälen fick 887 minus 572 = 315 m, alltså Lindvallens topp
 * minus Tandådalens bas, medan den största riktiga fallhöjden är 308 m.
 * Chamonix fick 2 807 m, som är Aiguille du Midi — en linbana med noll
 * kilometer pist, där nedfarten är offpist på glaciär. Störst pistad
 * fallhöjd i dalen är Grands Montets 1 513 m.
 *
 * Därför ligger fallhöjden i fallhojd() här och inte inline på varje sida.
 * Samma spärr som harPris i lib/liftkortspriser.js: används den inte på
 * alla ytor uppstår delrättningen igen, där ortsidan säger ett tal och
 * jämförelsesidan ett annat om samma ort.
 *
 * Listan ligger i kod och inte i databasen därför att den beskriver hur
 * VÅRT tal är hopsatt, inte en egenskap hos orten — samma skäl som
 * lib/liftkortspriser.js och lib/nattaget.js. Den kostar heller ingen
 * migration att rätta.
 *
 * KONTROLLERADE OCH FRIKÄNDA: Grandvalira och Riksgränsen stod länge
 * under samma rubrik i docs/liftkortspriser.md. Kontrollen 21 september
 * 2026 visar att källan har en enda post för var och en, med exakt våra
 * tal — 215 km och 75 liftar respektive 21 km och 6 liftar. Deras fråga
 * gäller vad liftkortet täcker, inte hur talet är hopsatt, och den
 * besvaras i prisnoterna. De hör alltså inte hemma här.
 *
 * Källa: skiresort.com, hämtat 21 september 2026. Sluggarna är
 * translittererade — se lib/nattaget.js om varför en hämtning som ser ut
 * att lyckas kan ge startsidan i stället för orten.
 */

export const DELOMRADEN = {
  salen: {
    // Summan stämmer på kilometern: 42 + 45 = 87 km, 58 + 48 = 106 liftar,
    // och databasens 572-887 är lägsta basen och högsta toppen av de två.
    delar: [
      { namn: 'Lindvallen/Högfjället', pist_km: 42, liftar: 58, bas: 579, topp: 887 },
      { namn: 'Tandådalen/Hundfjället', pist_km: 45, liftar: 48, bas: 572, topp: 872 },
    ],
    forbindelse:
      'Lindvallen och Högfjället hänger ihop med lift, liksom Tandådalen och Hundfjället. Mellan paren går skidbussen, gratis med SkiPass.',
    // Källan har en tredje post i Sälen, Näsfjället, med 10 km och två
    // liftar. Den ingår inte: anläggningen är inte SkiStars och ligger
    // utanför liftkortet våra tal och vårt pris avser.
  },

  vemdalen: {
    // 18 + 14 + 19 = 51 km, 13 + 15 + 16 = 44 liftar, samma tal som SkiStar.
    // Källa: skiresort.com, tre poster, hämtat 18 november 2026.
    delar: [
      { namn: 'Vemdalsskalet', pist_km: 18, liftar: 13, bas: 592, topp: 946 },
      { namn: 'Björnrike', pist_km: 14, liftar: 15, bas: 506, topp: 946 },
      { namn: 'Klövsjö/Storhogna', pist_km: 19, liftar: 16, bas: 448, topp: 875 },
    ],
    forbindelse:
      'Klövsjö och Storhogna hänger ihop med lift. Mellan områdena går skidbussen, gratis med SkiPass.',
  },

  funasfjallen: {
    // 38 + 25 + 10 + 8 + 4 + 2 = 87 km, 18 + 10 + 5 + 4 + 1 + 1 = 39 liftar,
    // samma tal som källans regionsida. Tännäskröket är 8,1 km hos källan.
    // Sex anläggningar med olika ägare men ett liftkort, Fjällpass Lift.
    // Källa: skiresort.com, sex poster, hämtat 20 november 2026. Tänndalen
    // 17 → 18 liftar 25 november 2026 (ny parklift och stormlift 2026).
    delar: [
      { namn: 'Tänndalen', pist_km: 38, liftar: 18, bas: 743, topp: 1038 },
      { namn: 'Ramundberget', pist_km: 25, liftar: 10, bas: 700, topp: 1000 },
      { namn: 'Funäsdalsberget', pist_km: 10, liftar: 5, bas: 663, topp: 977 },
      { namn: 'Tännäskröket', pist_km: 8, liftar: 4, bas: 562, topp: 889 },
      { namn: 'Kappruet', pist_km: 4, liftar: 1, bas: 700, topp: 840 },
      { namn: 'Tänndalsvallen', pist_km: 2, liftar: 1, bas: 750, topp: 864 },
    ],
    forbindelse:
      'Anläggningarna når inte varandra med lift. Under vissa perioder går skidbussen mellan Ramundberget, Funäsdalen och Tänndalen, gratis med Fjällpass Lift.',
  },

  chamonix: {
    // 56 + 55 + 29 + 29 = 169 km och 17 + 15 + 8 + 13 = 53 liftar, som
    // databasen bär sedan migration 046. Där rättades också 170 km och 49
    // liftar, som inte gick att härleda ur källan, och pistfördelningen
    // till delarnas summa: 55 / 75 / 39 km lätt, medel och svår = 33/44/23.
    // Balmes bas är 1 264 m på postens egen sida och 1 453 m i skiresorts
    // regionlista; postens sida gäller (046). Fallhöjden påverkas inte.
    // Källa: skiresort.com, alla fem poster lästa 18 november 2026.
    delar: [
      { namn: 'Brévent–Flégère', pist_km: 56, liftar: 17, bas: 1030, topp: 2525 },
      { namn: 'Les Houches', pist_km: 55, liftar: 15, bas: 1000, topp: 1900 },
      { namn: 'Grands Montets (Argentière)', pist_km: 29, liftar: 8, bas: 1252, topp: 2765 },
      { namn: 'Balme – Le Tour/Vallorcine', pist_km: 29, liftar: 13, bas: 1264, topp: 2250 },
      // Aiguille du Midi bär noll kilometer pist och tas inte med i
      // summan. Den står här därför att det är den posten databasens
      // höjder kommer från: 1 035-3 842 m är linbanans spann, inte
      // dalens pistade åkning.
      { namn: 'Aiguille du Midi', pist_km: 0, liftar: 5, bas: 1035, topp: 3842 },
    ],
    forbindelse:
      'Bara Brévent och Flégère når varandra med lift. Mellan de andra går bussen i dalen.',
  },

  'zell-am-see-kaprun': {
    // 77 + 62,5 = 139,5 km hos källan, lagrat avrundat som 77 + 63 = 140 km, 27 + 24 = 51 liftar. Höjderna 760–3 029 m är
    // Schmittens bas och Kitzsteinhorns topp. Källa: skiresort.com, två
    // poster, hämtat 18 november 2026. Lechnerberg (1,5 km, två liftar) är
    // en egen post utanför liftkortet och ingår inte. Se migration 040.
    delar: [
      { namn: 'Schmittenhöhe (Zell am See)', pist_km: 77, liftar: 27, bas: 760, topp: 2000 },
      // Källans spann 768–3 029 m går inte att åka i ett svep: "There is
      // no valley run at the Kitzsteinhorn." Från Langwiedboden tar man
      // lift ner till Maiskogel, och längsta nedfarterna är 1 051 och
      // 962 m. Delen räknas i pist och liftar men inte i fallhöjden, så
      // att fallhojd() svarar med Schmittenhöhes 1 240 m, som har
      // dalnedfarter till Zell och Schüttdorf. Samma fel som Aiguille du
      // Midi annars, i mildare form.
      { namn: 'Kitzsteinhorn/Maiskogel (Kaprun)', pist_km: 63, liftar: 24, bas: 768, topp: 3029, utanDalnedfart: true },
    ],
    forbindelse:
      'Kitzsteinhorn och Maiskogel hänger ihop med lift. Mellan Zell am See och Kaprun går skidbussen, gratis med liftkortet.',
  },

  'st-moritz': {
    // 155 + 120 + 35 = 310 km, 23 + 14 + 5 = 42 liftar, 33 245 + 18 310 +
    // 4 410 = 55 965 personer i timmen. Höjderna 1 772–3 303 m är
    // Corviglias bas och Corvatschs topp. Källa: skiresort.com, tre
    // poster, hämtat 18 november 2026. Se migration 043.
    //
    // Zuoz (15 km, fem liftar) och de små backarna i Pontresina, Samedan,
    // La Punt och S-chanf ingår i liftkortet Upper Engadin men inte här.
    // Ski Club GB ("The three ski areas in the St Moritz valley ... over
    // 300km ... 42 lifts") och Powderhounds ("312km (combined)", 42
    // liftar) avgränsar St. Moritz till de tre bergen, och Zuoz är en egen
    // by längre ner i dalen. Kortet står i LIFTKORT i lib/liftkortspriser.js.
    delar: [
      { namn: 'Corviglia', pist_km: 155, liftar: 23, bas: 1772, topp: 3057 },
      { namn: 'Corvatsch/Furtschellas', pist_km: 120, liftar: 14, bas: 1797, topp: 3303 },
      // Diavolezza och Lagalb är en post hos källan men två berg: "From
      // Lagalb to Diavolezza, a ski bus operates."
      { namn: 'Diavolezza/Lagalb', pist_km: 35, liftar: 5, bas: 2093, topp: 3006 },
    ],
    forbindelse:
      'Bergen når inte varandra med lift, och mellan Diavolezza och Lagalb går skidbussen. Bussar och tåg i dalen ingår i liftkortet för hela Oberengadin.',
    // Spannet korsar Corviglia och Corvatsch, men de två hänger ihop åt
    // ena hållet på pist: "The black slope leads from Giand'Alva via
    // Hahnensee to St. Moritz Bad" och "The Hahnenseeexpress ski bus runs
    // regularly from the Signalbahn stop to the Corvatsch valley station
    // in Surlej" (skiresort, Corvatsch slope-offering). Standardmeningen
    // "den sträckan går inte att åka" hade därför lurat läsaren. Vilken
    // dalstation som ger Corviglias 1 772 m är inte kontrollerat, och
    // meningen nedan påstår inget om det.
    spannTillagg:
      'Från Corvatsch går den svarta nedfarten Hahnensee ner till Signalbahn i St. Moritz Bad, men tillbaka tar du skidbussen till Surlej.',
  },
}

/** Räkneord i text, som resten av sajten skriver dem. */
export const antalOrd = (n) => ({ 2: 'två', 3: 'tre', 4: 'fyra', 5: 'fem', 6: 'sex', 7: 'sju', 8: 'åtta', 9: 'nio', 10: 'tio' }[n] || String(n))

/** Ortens delområden, eller null för de orter som är ett område. */
export function delomraden(resort) {
  return DELOMRADEN[resort?.slug] || null
}

/** Delarna med pist, i visningsordning — störst först. */
export function pistadeDelar(resort) {
  const post = delomraden(resort)
  if (!post) return []
  return post.delar.filter((d) => d.pist_km > 0).sort((a, b) => b.pist_km - a.pist_km)
}

/**
 * Delarna som fallhöjden räknas på: de pistade, utom de som är flaggade
 * `utanDalnedfart` därför att källans höjdspann inte går att åka i ett
 * svep (Kitzsteinhorn/Maiskogel).
 */
function fallhojdsDelar(resort) {
  return pistadeDelar(resort).filter((d) => !d.utanDalnedfart)
}

/**
 * Delen med störst fallhöjd — den som fallhojd() nedan svarar med.
 *
 * Inte samma som den största delen: Sälens 45 kilometer ligger i
 * Tandådalen, men de 308 metrarna i Lindvallen/Högfjället.
 */
export function brantasteDelen(resort) {
  const delar = fallhojdsDelar(resort)
  if (!delar.length) return null
  return delar.reduce((a, b) => (b.topp - b.bas > a.topp - a.bas ? b : a))
}

/**
 * Fallhöjden att visa, i meter.
 *
 * För en vanlig ort är det höjdspannet, som förut. För en hopslagning är
 * det den största fallhöjden inom ett och samma delområde — alltså den
 * längsta sammanhängande nedfarten orten faktiskt erbjuder, i stället för
 * ett tal som korsar två fjäll.
 *
 * Delar utan pist räknas inte: en linbana är ingen fallhöjd. Inte heller
 * delar flaggade `utanDalnedfart`, se Zell am See-Kaprun ovan.
 */
export function fallhojd(resort) {
  const delar = fallhojdsDelar(resort)
  if (delar.length) return Math.max(...delar.map((d) => d.topp - d.bas))
  return resort.altitude_top - resort.altitude_base
}

/**
 * Inledningen i rutan på ortsidan.
 *
 * Byggd ur datan i stället för skriven per ort, så att talen inte kan
 * glida isär från tabellen intill — samma skäl som restiderna i
 * lib/restider.js. Delen som nämns vid namn är den största, eftersom det
 * är den läsaren annars tror är hela orten.
 */
export function summaText(resort) {
  const delar = pistadeDelar(resort)
  if (!delar.length) return null

  return `De ${resort.total_pistes_km} kilometrarna ligger i ${antalOrd(delar.length)} områden. Störst är ${delar[0].namn} med ${delar[0].pist_km} km. ${DELOMRADEN[resort.slug].forbindelse}`
}

/**
 * Varför fallhöjden inte är högsta topp minus lägsta bas.
 *
 * Två fall, och meningen skiljer på dem. Ligger ytterligheterna i skilda
 * delar korsar spannet dem båda, och då namnges de. Ligger de i samma
 * del är den delen en lift utan pist, som Aiguille du Midi, och då är
 * det den som ska pekas ut.
 */
export function spannMening(resort) {
  const post = delomraden(resort)
  if (!post) return null

  // Ändpunkterna tas ur databasen och inte ur delarna, eftersom det är
  // databasens höjder sidan visar i rutnätet intill. Chamonix bas är
  // 1 035 m, alltså Aiguille du Midi, medan den lägsta pistade delen
  // börjar på 1 000. Meningen ska förklara talet läsaren ser.
  const lagst = post.delar.find((d) => d.bas === resort.altitude_base)
  const hogst = post.delar.find((d) => d.topp === resort.altitude_top)
  if (!lagst || !hogst) return null

  const spann = `${tal(resort.altitude_base)}–${tal(resort.altitude_top)} m`

  // Ligger båda ändpunkterna i samma del är den delen en lift utan pist.
  // Hade den haft pist vore dess egen fallhöjd störst, och då hade
  // fallhojd() redan svarat med hela spannet.
  if (lagst === hogst) {
    return `Spannet ${spann} är ${hogst.namn}, en lift utan pist.`
  }
  // Där delarna hänger ihop åt ena hållet på pist (St. Moritz) är "går
  // inte att åka" fel, och posten säger själv hur det är.
  if (post.spannTillagg) {
    return `Spannet ${spann} korsar ${lagst.namn} och ${hogst.namn}. ${post.spannTillagg}`
  }
  return `Spannet ${spann} korsar ${lagst.namn} och ${hogst.namn}, och den sträckan går inte att åka.`
}

/**
 * Kort mening för jämförelsetabellen, som inte har plats för hela listan.
 */
export function summaMening(resort) {
  const delar = pistadeDelar(resort)
  if (!delar.length) return null

  return `${resort.name} ${resort.total_pistes_km} km ligger i ${antalOrd(delar.length)} områden som inte når varandra med lift. Störst är ${delar[0].namn} med ${delar[0].pist_km} km. Fallhöjden längre ner avser det brantaste av dem.`
}

/**
 * Tusentalsmellanrum, som docs/copy.md föreskriver: 2 807 m, inte 2807.
 *
 * Hårt mellanslag, skrivet med fromCharCode av samma skäl som i
 * lib/pris.js: ett U+00A0 i källkoden går inte att skilja från ett
 * vanligt mellanslag när man läser filen.
 */
export function tal(n) {
  const siffror = String(n)
  let ut = ''
  for (let i = 0; i < siffror.length; i++) {
    if (i > 0 && (siffror.length - i) % 3 === 0) ut += String.fromCharCode(0xa0)
    ut += siffror[i]
  }
  return ut
}
