/**
 * Tåg till fjällen, vintern 2026/27: vilka skidorter på Alpkoll du når med
 * tåg från Sverige, och hur.
 *
 * Samma princip som lib/nattaget.js: tidtabellen beskriver ett tågbolag,
 * inte orten, så den ligger i kod och skrivs om varje höst. Sidan
 * /tag-till-fjallen bygger sina meningar ur listan, så att ett påstående
 * om "tåg hela vägen" inte kan överleva att datan ändras.
 *
 * Hämtat 2026-11-20, och Åre och Sälen igen 2026-11-25, från:
 *   snalltaget.se/tag-till-jamtland-harjedalen-vinter (Åre, Vemdalen-Röjan)
 *   snalltaget.se/tag-till-salen (Mora och transferbussen till Sälen)
 *   via.tt.se/pressmeddelande/4611059 (SJ och SkiStar till Sälen, söndagar)
 *   skistar.com/sv/vara-skidorter/res-till-vara-skidorter/tag/ (SJ till Åre,
 *     transfer till Vemdalen)
 *   svenskaturistforeningen.se/.../tag-till-fjallen/ (SJ Stockholm–Narvik)
 *   klappen.se/en/about-klappen/travel-here/travel-by-bus/ (tåg till Mora
 *     eller Borlänge, buss till Kläppen)
 *   idrefjall.se/en/getting-here/ (tåg till Mora, buss till Idre Fjäll)
 *   alpinco.com/no/hafjell/reise (tåg till Lillehammer, buss till Hafjell)
 *   visitvoss.no/en/voss-gondol (gondolen går från stationen i Voss)
 *   snalltaget.se/tag-till-trysil och /tag-till-hemsedal (Oslo och bussen
 *     till SkiStar, 2026-11-25)
 * Att Snälltågets buss från Mora inte stannar i Kläppen följer av
 * hållplatslistan på snalltaget.se/tag-till-salen.
 *
 * ── UPPDATERAS VARJE HÖST ───────────────────────────────────────────────
 * Snälltåget och SJ släpper vintertidtabellen under hösten. Byt SASONG,
 * HAMTAD och tiderna nedan, och kontrollera att varje ort fortfarande har
 * samma station och buss. Står en tid inte i källan skrivs den inte ut.
 */

export const SASONG = '2026/27'
export const HAMTAD = '2026-11-25'

/**
 * typ:
 *   'hela-vagen'  tåget stannar i orten
 *   'buss'        tåg till en station, sedan buss sista biten
 *   'inget'       inget tåg i närheten som går att boka med anslutning
 */
export const FJALLTAG = [
  {
    slug: 'are',
    typ: 'hela-vagen',
    station: 'Åre',
    sammanfattning: 'Nattåget stannar mitt i Åre by, och även i Undersåker och Duved.',
    linjer: [
      {
        bolag: 'Snälltåget',
        text: 'Nattåg från Malmö via Stockholm onsdagar, fredagar och lördagar under vintern, med fler avgångar runt jul och påsk. Vissa avgångar går via Göteborg i stället för Linköping.',
        tider: [
          { plats: 'Malmö C', tid: '16.35' },
          { plats: 'Stockholm C', tid: '22.55' },
          { plats: 'Åre', tid: '07.35' },
        ],
        hem: 'Hemresan går från Åre 16.40 och är i Stockholm strax före midnatt och i Malmö på morgonen.',
        kalla: 'https://www.snalltaget.se/tag-till-jamtland-harjedalen-vinter',
      },
      {
        bolag: 'SJ',
        text: 'Nattåg från Stockholm till Åre och Duved, och dagtåg via Östersund.',
        kalla: 'https://www.skistar.com/sv/vara-skidorter/res-till-vara-skidorter/tag/',
      },
    ],
  },
  {
    slug: 'vemdalen',
    typ: 'buss',
    station: 'Vemdalen-Röjan',
    sammanfattning: 'Snälltåget går till Röjan på fredagar, och sista biten till backen tar du med transferbuss.',
    linjer: [
      {
        bolag: 'Snälltåget',
        text: 'Fredagar 18 december till 12 februari och 12 mars till 2 april, från Malmö via Göteborg och Stockholm. Transferbuss till Vemdalen går från Röjan eller från Östersund.',
        tider: [
          { plats: 'Malmö C', tid: '15.25' },
          { plats: 'Stockholm C', tid: '22.55' },
          { plats: 'Vemdalen-Röjan', tid: '08.10' },
        ],
        kalla: 'https://www.snalltaget.se/tag-till-jamtland-harjedalen-vinter',
      },
    ],
  },
  {
    slug: 'funasfjallen',
    typ: 'buss',
    station: 'Vemdalen-Röjan',
    sammanfattning: 'Samma fredagståg som till Vemdalen, och transferbussen från Röjan går vidare till Funäsdalen och Ramundberget.',
    linjer: [
      {
        bolag: 'Snälltåget',
        text: 'Fredagar 18 december till 12 februari och 12 mars till 2 april, från Malmö via Göteborg och Stockholm. Hemresan bokas samtidigt. Transferbussen från Röjan stannar i Funäsdalen, Bruksvallarna och Ramundberget.',
        tider: [
          { plats: 'Malmö C', tid: '15.25' },
          { plats: 'Stockholm C', tid: '22.55' },
          { plats: 'Vemdalen-Röjan', tid: '08.10' },
        ],
        kalla: 'https://www.snalltaget.se/tag-till-jamtland-harjedalen-vinter',
      },
    ],
  },
  {
    slug: 'salen',
    typ: 'buss',
    station: 'Mora',
    sammanfattning: 'Nytt för vintern: Snälltåget till Mora på lördagar och SJ på söndagar, med buss vidare till SkiStars områden.',
    linjer: [
      {
        bolag: 'Snälltåget',
        text: 'Lördagar 19 december 2026 till 10 april 2027, dagtåg från Malmö via Stockholm, vissa veckor via Göteborg. Bussen väntar i Mora och stannar vid Lindvallen, Högfjällshotellet, Tandådalen, Hundfjället och Stöten. Hemresan går också på lördagar.',
        tider: [
          { plats: 'Malmö C', tid: '05.55' },
          { plats: 'Stockholm C', tid: '10.55' },
          { plats: 'Mora', tid: '14.05' },
          { plats: 'Lindvallen, Experiumtorget (buss)', tid: '16.50' },
        ],
        kalla: 'https://www.snalltaget.se/tag-till-salen',
      },
      {
        bolag: 'SJ',
        text: 'Söndagar 17 januari till 4 april 2027, tåg från Stockholm till Mora och chartrad buss vidare till Lindvallen, Högfjället, Tandådalen och Hundfjället. Hemresan går också på söndagar.',
        tider: [
          { plats: 'Stockholm C', tid: '09.44' },
          { plats: 'Mora', tid: '13.31' },
        ],
        kalla: 'https://via.tt.se/pressmeddelande/4611059/sj-lanserar-ny-destination-salen?lang=sv',
      },
    ],
  },
  {
    slug: 'klappen',
    typ: 'buss',
    station: 'Mora eller Borlänge',
    sammanfattning: 'Tåget går till Mora eller Borlänge, och sista biten till Kläppen tar du med buss. Snälltågets buss från Mora stannar inte i Kläppen.',
    linjer: [
      {
        bolag: 'Tåg och buss',
        text: 'Tåg till Mora eller Borlänge, och därifrån buss till Kläppen. Under vintern stannar också Fjällexpressen i Kläppen.',
        kalla: 'https://www.klappen.se/en/about-klappen/travel-here/travel-by-bus/',
      },
    ],
  },
  {
    slug: 'idre-fjall',
    typ: 'buss',
    station: 'Mora',
    sammanfattning: 'Tåget går till Mora, och därifrån tar du bussen till Idre Fjäll. Snälltågets buss från Mora går till Sälen, inte till Idre.',
    linjer: [
      {
        bolag: 'Tåg och buss',
        text: 'Flera tågbolag kör till Mora, och därifrån går anslutningsbuss till Idre Fjäll. Under vintern stannar också Masexpressen i Mora på väg från Stockholm till Idre Fjäll.',
        kalla: 'https://www.idrefjall.se/en/getting-here/',
      },
    ],
  },
  {
    slug: 'riksgransen',
    typ: 'hela-vagen',
    station: 'Riksgränsen',
    sammanfattning: 'Nattåget Stockholm–Narvik stannar vid Riksgränsen, varje dag.',
    linjer: [
      {
        bolag: 'SJ',
        text: 'Det dagliga nattåget mellan Stockholm och Narvik, med stopp i bland annat Kiruna, Abisko, Björkliden och Riksgränsen. Avtalet med Trafikverket gäller till och med 2028.',
        kalla: 'https://www.svenskaturistforeningen.se/guider-tips/fjallen/transport-fjallen/tag-till-fjallen/',
      },
    ],
  },
  {
    slug: 'branas',
    typ: 'inget',
    sammanfattning: 'Branäs har ingen järnväg i närheten. De flesta kör bil hela vägen.',
    linjer: [],
  },
  {
    slug: 'hemavan',
    typ: 'inget',
    sammanfattning: 'Hemavan har ingen järnväg. Flyget går till Hemavan Tärnaby flygplats i orten.',
    linjer: [],
  },
  {
    slug: 'geilo',
    typ: 'hela-vagen',
    station: 'Geilo',
    sammanfattning: 'Bergensbanan Oslo–Bergen stannar mitt i Geilo. Från Sverige byter du i Oslo.',
    linjer: [],
  },
  {
    slug: 'voss',
    typ: 'hela-vagen',
    station: 'Voss',
    sammanfattning: 'Bergensbanan stannar i Voss, och gondolen upp till backarna går från stationen. Från Sverige byter du i Oslo.',
    linjer: [
      {
        bolag: 'Voss Gondol',
        text: 'Gondolen går från tåg- och busstationen i Voss upp till Hanguren på under nio minuter.',
        kalla: 'https://www.visitvoss.no/en/voss-gondol',
      },
    ],
  },
  {
    slug: 'hafjell',
    typ: 'buss',
    station: 'Lillehammer',
    sammanfattning: 'Tåget går till Lillehammer, och lokalbussen tar dig sista biten till Hafjell. Från Sverige byter du i Oslo.',
    linjer: [
      {
        bolag: 'Tåg och buss',
        text: 'Tåg nästan varje timme från Oslo och Oslo lufthavn till Lillehammer, som ligger 20 minuter från Hafjell. Därifrån går lokalbuss varje timme på dagtid.',
        kalla: 'https://www.alpinco.com/no/hafjell/reise',
      },
    ],
  },
  {
    slug: 'trysil',
    typ: 'buss',
    station: 'Oslo',
    sammanfattning: 'Snälltåget går till Oslo på lördagar och söndagar under vintern, och bussen därifrån tar dig till Trysil.',
    linjer: [
      {
        bolag: 'Snälltåget',
        text: 'Lördagar och söndagar 19 december 2026 till 21 mars 2027, från Malmö via Göteborg till Oslo, på lördagar från Köpenhamn. Bussen från Oslo ingår och stannar vid Turistsenteret, SkiStar Lodge och Høyfjellssenteret. Till påsk går nattåg från Malmö och Lund till Oslo, med buss vidare.',
        tider: [
          { plats: 'Malmö C', tid: '07.05' },
          { plats: 'Oslo S', tid: '13.16' },
          { plats: 'Trysil, Turistsenteret (buss)', tid: '18.15' },
        ],
        hem: 'Hemresan går från Høyfjellssenteret 09.00 och är i Malmö 20.55.',
        kalla: 'https://www.snalltaget.se/tag-till-trysil',
      },
    ],
  },
  {
    slug: 'hemsedal',
    typ: 'buss',
    station: 'Oslo eller Gol',
    sammanfattning: 'Snälltåget går till Oslo på helger under vintern, och bussen därifrån tar dig till SkiStar Lodge. Till påsk går nattåget till Gol.',
    linjer: [
      {
        bolag: 'Snälltåget',
        text: 'Lördagar och söndagar 19 december 2026 till 21 mars 2027, från Malmö via Göteborg till Oslo, på lördagar från Köpenhamn. Bussen från Oslo ingår och går till SkiStar Lodge. Till påsk går nattåg från Malmö och Lund till Gol, med buss sista biten.',
        tider: [
          { plats: 'Malmö C', tid: '07.05' },
          { plats: 'Oslo S', tid: '13.16' },
          { plats: 'Hemsedal, SkiStar Lodge (buss)', tid: '18.15' },
        ],
        hem: 'Hemresan går från SkiStar Lodge 09.30 och är i Malmö 20.55.',
        kalla: 'https://www.snalltaget.se/tag-till-hemsedal',
      },
    ],
  },
]

export const fjalltagFor = (slug) => FJALLTAG.find((f) => f.slug === slug) || null
