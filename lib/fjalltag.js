/**
 * Tåg till fjällen, vintern 2026/27: vilka skidorter på Alpkoll du når med
 * tåg från Sverige, och hur.
 *
 * Samma princip som lib/nattaget.js: tidtabellen beskriver ett tågbolag,
 * inte orten, så den ligger i kod och skrivs om varje höst. Sidan
 * /tag-till-fjallen bygger sina meningar ur listan, så att ett påstående
 * om "tåg hela vägen" inte kan överleva att datan ändras.
 *
 * Hämtat 2026-11-20 från:
 *   snalltaget.se/tag-till-jamtland-harjedalen-vinter (Åre, Vemdalen-Röjan)
 *   snalltaget.se/tag-till-salen (Mora och transferbussen till Sälen)
 *   skistar.com/sv/vara-skidorter/res-till-vara-skidorter/tag/ (SJ till Åre,
 *     transfer till Vemdalen)
 *   svenskaturistforeningen.se/.../tag-till-fjallen/ (SJ Stockholm–Narvik)
 *
 * ── UPPDATERAS VARJE HÖST ───────────────────────────────────────────────
 * Snälltåget och SJ släpper vintertidtabellen under hösten. Byt SASONG,
 * HAMTAD och tiderna nedan, och kontrollera att varje ort fortfarande har
 * samma station och buss. Står en tid inte i källan skrivs den inte ut.
 */

export const SASONG = '2026/27'
export const HAMTAD = '2026-11-20'

/**
 * typ:
 *   'hela-vagen'  tåget stannar i orten
 *   'buss'        tåg till en station, sedan transferbuss
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
        text: 'Nattåg från Malmö via Stockholm onsdagar och lördagar under vintern, med fler avgångar runt jul och påsk. Vissa avgångar går via Göteborg i stället för Linköping.',
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
    slug: 'salen',
    typ: 'buss',
    station: 'Mora',
    sammanfattning: 'Nytt för vintern: Snälltåget till Mora på lördagar, med transferbuss vidare till alla fyra SkiStar-områdena och Stöten.',
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
    slug: 'idre-fjall',
    typ: 'inget',
    sammanfattning: 'Idre Fjäll har ingen järnväg. Snälltågets buss från Mora går till Sälen, inte till Idre.',
    linjer: [],
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
]

export const fjalltagFor = (slug) => FJALLTAG.find((f) => f.slug === slug) || null
