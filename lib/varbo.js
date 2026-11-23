// Var ska man bo? En sida per ort, byggd ur listan nedan.
//
// Boende i Sälen, Åre och Trysil söks ca 11 000 gånger i månaden (Google
// Ads, november 2026, se /mnt/project-files/alpkoll/sokord/ i projektet).
// Sidorna svarar på frågan var i orten man ska bo, och leder vidare till
// dem som hyr ut där.
//
// UTHYRARNA ÄR ALLA SOM HYR UT I OMRÅDET, INTE BARA DE SOM GER PROVISION.
// Beslutat 23 november 2026: sidorna byggs för hur de ska se ut med många
// besökare, inte efter vilka avtal Alpkoll har i dag. Länkarna går genom
// app/Partnerlank.js som partnern 'direkt', utan spårning och utan
// annonsmärkning. Får en uthyrare ett avtal läggs den till som egen
// partner där, och `partner` sätts på raden i UTHYRARE nedan. Sidorna
// behöver inte skrivas om.
//
// Uthyrarna står i bokstavsordning och utan omdömen, enligt docs/copy.md.
// En uthyrare står bara vid ett område där dess egen sida visar boende.
//
// Ny ort: en ny post i VAR_BO, en söksträng för Booking som redan är
// provad i lib/booking.js, och en mapp app/var-bo-i-<ort>/ med samma
// page.js som de andra.
//
// Underlag och källor: /mnt/project-files/alpkoll/boende/ och
// /mnt/project-files/alpkoll/research/salen-omraden-2026-11-17.md.
// Pisttal kommer från skiresort.com, som resten av sajten.
//
// Uppdateras en gång om året, på hösten: säsongsdatum, tåg, nyheter och
// att varje uthyrares adress fortfarande fungerar.

export const HAMTAD = '23 november 2026'

/**
 * Alla som hyr ut, med en mening om vad de är. `url` är sidan för just
 * orten när en sådan finns.
 */
export const UTHYRARE = {
  'agoiare': { namn: 'AGO i Åre', vad: 'stugor och lägenheter', url: 'https://www.agoiare.se/boenden/' },
  'copperhill': { namn: 'Copperhill Mountain Lodge', vad: 'hotell högst upp i Björnen', url: 'https://www.copperhill.se/' },
  'guestit-are': { namn: 'Guestit', vad: 'privata stugor och lägenheter', url: 'https://guestit.se/destinations/hitta-boende-i-are' },
  'gumo': { namn: 'GuMo', vad: 'privata stugor', url: 'https://gumo.se/' },
  'holidayclub-are': { namn: 'Holiday Club Åre', vad: 'hotell och lägenheter med bad', url: 'https://www.holidayclub.se/are' },
  'klappen': { namn: 'Kläppen', vad: 'anläggningens egna stugor, hotell och camping', url: 'https://www.klappen.se/boende/' },
  'radisson-trysil': { namn: 'Radisson Blu Resort Trysil', vad: 'hotell med bad', url: 'https://www.skistar.com/sv/boende/radisson-blu-trysil/radisson-blu-resort/' },
  'rehnbergs': { namn: 'Rehnbergs Stuguthyrning', vad: 'privata stugor och lägenheter', url: 'https://tandadalen.com/' },
  'skistar-are': { namn: 'SkiStar', vad: 'stugor, lägenheter och hotell', url: 'https://www.skistar.com/sv/vara-skidorter/are/vinter-i-are/boende/' },
  'skistar-salen': { namn: 'SkiStar', vad: 'stugor, lägenheter och hotell', url: 'https://www.skistar.com/sv/vara-skidorter/salen/vinter-i-salen/boende/' },
  'skistar-trysil': { namn: 'SkiStar', vad: 'stugor, lägenheter och hotell', url: 'https://www.skistar.com/sv/vara-skidorter/trysil/vinter-i-trysil/boende/' },
  'stoten': { namn: 'Stöten', vad: 'anläggningens eget hotell och boende', url: 'https://www.stoten.se/' },
  'stugknuten-are': { namn: 'Stugknuten', vad: 'privata stugor', url: 'https://www.stugknuten.com/sv/hyra-stuga/%C3%A5re' },
  'stugknuten-salen': { namn: 'Stugknuten', vad: 'privata stugor', url: 'https://www.stugknuten.com/sv/hyra-stuga/s%C3%A4len' },
  'trysil-hotell': { namn: 'Trysil Hotell', vad: 'hotell i byn', url: 'https://www.trysilhotell.net/' },
  'trysilfjellbooking': { namn: 'Trysilfjellbooking', vad: 'stugor och lägenheter', url: 'https://www.trysilfjellbooking.no/nb/hytter-leiligheter' },
}

const SKISTAR_SALEN = 'https://www.skistar.com/en/ski-destinations/salen/winter-in-salen/ski-areas/'
const SKISTAR_ARE = 'https://www.skistar.com/sv/vara-skidorter/are/vinter-i-are/'
const SKISTAR_TRYSIL = 'https://www.skistar.com/sv/vara-skidorter/trysil/'
const VISIT_ARE = 'https://aresweden.com/se-och-gora/skidomraden-liftkort-i-are/'
const VISIT_ARE_BARN = 'https://aresweden.com/se-och-gora/alpint/skidomraden-for-barn/'

export const VAR_BO = {
  salen: {
    slug: 'salen',
    ort: 'Sälen',
    path: '/var-bo-i-salen',
    jamfor: [['Åre eller Sälen', '/jamfor/are-vs-salen'], ['Sälen eller Trysil', '/jamfor/salen-vs-trysil'], ['Sälen eller Alperna', '/salen-eller-alperna'], ['sportlovet', '/sportlov']],
    titel: 'Boende i Sälen: var ska man bo? Alla sex områden jämförda | Alpkoll',
    beskrivning:
      'Lindvallen, Högfjället, Tandådalen, Hundfjället, Stöten eller Kläppen? ' +
      'Vem varje område passar, vad det saknar, vilket liftkort som gäller och vem som hyr ut stugor där.',
    ingress: [
      'Sälen är sex skidområden, inte ett. SkiStars fyra, Lindvallen, Högfjället, ' +
        'Tandådalen och Hundfjället, delar liftkort och skibuss. Stöten och Kläppen är ' +
        'egna anläggningar med egna liftkort. Var du bor avgör alltså både vilka backar du ' +
        'har utanför dörren och vilket liftkort som gäller.',
    ],
    kortSvar: [
      { vem: 'Små barn', var: 'Lindvallen eller Hundfjället' },
      { vem: 'Nybörjare', var: 'Högfjället eller Lindvallen' },
      { vem: 'Vill åka brant', var: 'Tandådalen eller Hundfjället' },
      { vem: 'Kompisgäng med afterski', var: 'Högfjället' },
      { vem: 'Snowpark', var: 'Kläppen eller Tandådalen' },
      { vem: 'Kommer med tåget till Mora', var: 'Lindvallen, Högfjället, Tandådalen, Hundfjället eller Stöten' },
      { vem: 'Utanför SkiStar', var: 'Stöten eller Kläppen' },
    ],
    omraden: [
      {
        namn: 'Lindvallen',
        agare: 'SkiStar',
        passar: 'Barnfamiljer och nybörjare. SkiStar kallar området ett av Europas största för barn och nybörjare, med Valleberget, rullband och skidskola intill Experiums badhus.',
        nackdel: 'Lite för den som vill åka brant: Lindvallen och Högfjället har tillsammans 3 km svår pist av 42.',
        lift: 'Hänger ihop med Högfjället med lift. Till Tandådalen och Hundfjället tar du skibussen, gratis med SkiPass.',
        tal: 'Med Högfjället: 42 km pist, 58 liftar, 579–887 m.',
        kalla: `${SKISTAR_SALEN}lindvallen/`,
        uthyrare: ['gumo', 'rehnbergs', 'skistar-salen', 'stugknuten-salen'],
      },
      {
        namn: 'Högfjället',
        agare: 'SkiStar',
        passar: 'Nybörjare och vuxna sällskap. Mest gröna och blå backar, afterski vid Högfjällshotellet, och ett eget områdespass från 295 kr om dagen.',
        nackdel: 'Minst av områdena, med 6 liftar och 9 backar, och ingen snowpark. Mer åkning kräver liften över till Lindvallen.',
        lift: 'Hänger ihop med Lindvallen med lift.',
        tal: 'Räknas ihop med Lindvallen, se ovan.',
        kalla: `${SKISTAR_SALEN}hogfjallet/`,
        uthyrare: ['gumo', 'rehnbergs', 'skistar-salen', 'stugknuten-salen'],
      },
      {
        namn: 'Tandådalen',
        agare: 'SkiStar',
        passar: 'Familjer där någon vill utvecklas. Backar från grönt till svart, SkiStars snowpark i Östra Tandådalen och ett lugnare barnområde där.',
        nackdel: 'SkiStar nämner ingen afterski här. Den som vill ut på kvällen får ta bussen.',
        lift: 'Hänger ihop med Hundfjället med lift. Till Lindvallen och Högfjället tar du skibussen.',
        tal: 'Med Hundfjället: 45 km pist, varav 12 km svår, 48 liftar, 572–872 m.',
        kalla: `${SKISTAR_SALEN}tandadalen/`,
        uthyrare: ['gumo', 'rehnbergs', 'skistar-salen', 'stugknuten-salen'],
      },
      {
        namn: 'Hundfjället',
        agare: 'SkiStar',
        passar: 'Familjer med små barn som också vill ha brant åkning i närheten. Trollskogen och barnområdet vid Trollbäckstorget, och Väggen, en av Sveriges brantaste backar enligt SkiStar.',
        nackdel: 'SkiStar beskriver ingen afterski här. Den som vill ut på kvällen får åka till Lindvallen eller Högfjället.',
        lift: 'Hänger ihop med Tandådalen med lift.',
        tal: 'Räknas ihop med Tandådalen, se ovan.',
        kalla: `${SKISTAR_SALEN}hundfjallet/`,
        uthyrare: ['gumo', 'rehnbergs', 'skistar-salen', 'stugknuten-salen'],
      },
      {
        namn: 'Stöten',
        agare: 'Eget bolag, eget liftkort',
        passar: 'Familjer som vill ha en egen anläggning utanför SkiStar. Skidskola från 3 år, barnklubb för 3–8 år, och en ny sexstolslift vid Skidtorget till vintern 2026/27.',
        nackdel: 'Mest lätt åkning: 32,5 av 42,5 km pist är lätta. SkiPass gäller inte här.',
        lift: 'Egen anläggning. Snälltågets buss från Mora stannar här.',
        tal: '42,5 km pist, 27 liftar, 438–830 m.',
        kalla: 'https://www.stoten.se/en/skiing-stoten/',
        uthyrare: ['gumo', 'stoten', 'stugknuten-salen'],
      },
      {
        namn: 'Kläppen',
        agare: 'Familjeägt, eget liftkort',
        passar: 'Familjer med små barn och den som vill åka park. Barn till och med 7 år åker gratis, Kläppen Snowpark är nationalarena för freeski och snowboard, och här finns Sälens enda gondol.',
        nackdel: 'Lägst och minst: 26 km pist och toppen på 655 m. SkiPass gäller inte här, och Snälltågets buss från Mora stannar inte här.',
        lift: 'Egen anläggning.',
        tal: '26 km pist, 22 liftar, 340–655 m.',
        kalla: 'https://www.klappen.se/en/skiing/',
        uthyrare: ['gumo', 'klappen', 'stugknuten-salen'],
      },
    ],
    // Liftkortet: stycken med länkar. [text, [länktext, url]] blandat.
    liftkort: [
      ['SkiStars SkiPass gäller i alla fyra SkiStar-områden, och skibussen mellan dem är gratis med giltigt kort (', ['SkiStar', 'https://www.skistar.com/en/Salen/SkiPass-and-Skiing/'], ', ', ['skibussen', 'https://skistar.com/en/ski-destinations/salen/winter-in-salen/services/ski-bus'], '). Ett veckokort för en vuxen kostar 3 126 kr under sportlovet 2027, drygt 7 % mer än året innan (', ['EFN', 'https://efn.se/skistar-hojer-liftkortspriser-i-salen-under-hogsasong'], ').'],
      ['Stöten och Kläppen säljer egna kort, och SkiPass gäller inte där. Bor du i Stöten och vill prova Lindvallen köper du alltså två kort.'],
    ],
    fotnot: ['Näsfjället finns kvar på kartor men är inte med här. Bolaget gick i konkurs 2021, och i mars 2026 fanns ingen köpare (', ['SVT', 'https://www.svt.se/nyheter/lokalt/dalarna/bolaget-tomdes-nu-vill-ingen-kopa-skidanlaggningen-i-salen'], ').'],
    kallor: ['Pisttalen kommer från skiresort.com, samma källa som resten av sajten (', ['Lindvallen/Högfjället', 'https://www.skiresort.com/en/ski-resort/lindvallen-hoegfjaellet-saelen/'], ', ', ['Tandådalen/Hundfjället', 'https://www.skiresort.com/en/ski-resort/tandaadalen-hundfjaellet-saelen/'], '). Där redovisas SkiStars fyra områden som två par, därför står talen per par. Beskrivningarna bygger på områdenas egna sidor, och uthyrarna på deras egna sidor.'],
  },

  are: {
    slug: 'are',
    ort: 'Åre',
    path: '/var-bo-i-are',
    jamfor: [['Åre eller Sälen', '/jamfor/are-vs-salen'], ['Åre eller Trysil', '/jamfor/are-vs-trysil'], ['Åre eller Alperna', '/are-eller-alperna'], ['sportlovet', '/sportlov']],
    titel: 'Boende i Åre: var ska man bo? Åre by, Björnen, Tegefjäll eller Duved | Alpkoll',
    beskrivning:
      'Åre by, Björnen, Tegefjäll eller Duved? Vilka områden som hänger ihop med lift, ' +
      'vem varje område passar, vad det saknar och vem som hyr ut där.',
    ingress: [
      'Åre är fyra byar längs samma dal, och de hänger inte ihop på samma sätt. Åre by och ' +
        'Björnen sitter ihop med liftar. Tegefjäll och Duved, en bit västerut, är ett eget ' +
        'skidområde, och dit tar du skidbussen. Samma SkiPass gäller i alla fyra.',
      'Valet står alltså mellan att bo där det händer mest, i Åre by, och att bo lugnare med ' +
        'kortare köer men längre väg till restaurangerna.',
    ],
    kortSvar: [
      { vem: 'Små barn', var: 'Björnen' },
      { vem: 'Nybörjare', var: 'Björnen eller Tegefjäll' },
      { vem: 'Vill åka brant', var: 'Åre by' },
      { vem: 'Kompisgäng med afterski', var: 'Åre by' },
      { vem: 'Vill slippa trängsel', var: 'Tegefjäll eller Duved' },
      { vem: 'Kommer med nattåget', var: 'Åre by eller Duved' },
      { vem: 'Åker i april', var: 'Åre by' },
    ],
    omraden: [
      {
        namn: 'Åre by',
        agare: 'Byn och centrala skidområdet',
        passar: 'Den som vill åka mycket och brant, och kompisgäng. Bergbanan, Kabinbanan och VM8:an går från byn, och närmast byn är backarna mest röda och svarta. Restauranger, barer, butiker och tågstationen ligger i byn.',
        nackdel: 'Här är det mest folk under högsäsong. Små barn och nybörjare får åka till Rödkullen, där barnområdet ligger, med skidbussen eller via liften upp.',
        lift: 'De flesta boenden ligger på gångavstånd från en lift. Hänger ihop med Björnen.',
        boende: 'Lägenheter och hotell i byn, och lugnare lägen högre upp i backen.',
        kalla: `${SKISTAR_ARE}boende/are-by/`,
        kalla2: `${SKISTAR_ARE}skidomraden/are-by/`,
        uthyrare: ['holidayclub-are', 'skistar-are', 'stugknuten-are'],
      },
      {
        namn: 'Björnen',
        agare: 'Öster om Åre by',
        passar: 'Barnfamiljer. Barnområde med knappliftar och åkband i centrum, Kids Park och många gröna och blå backar i direkt anslutning. Kvällsåkning i några av backarna.',
        nackdel: 'Lugnt på kvällen, och till Åre by är det runt 15 minuter med bil. Liftarna stänger 11 april 2027, tre veckor före Åre by.',
        lift: 'Många boenden ligger vid backen. Sadelexpressen och Hermelinenliften tar dig över till Åre bys skidområde.',
        boende: 'Mest lägenheter och stugor med självhushåll, och Copperhill högst upp.',
        kalla: `${SKISTAR_ARE}boende/bjornen/`,
        kalla2: VISIT_ARE_BARN,
        uthyrare: ['agoiare', 'copperhill', 'guestit-are', 'skistar-are', 'stugknuten-are'],
      },
      {
        namn: 'Tegefjäll',
        agare: 'Väster om Åre by',
        passar: 'Familjer som vill bo lugnt nära backen. Barnområde precis nedanför E14, Vildmarksstigen genom skogen, och breda röda och blå backar under trädgränsen, som ger lä när det blåser.',
        nackdel: 'Hänger inte ihop med Åre by. Byn ligger runt 10 minuter österut, och vill du åka på Åreskutan eller äta ute där tar du skidbussen.',
        lift: 'Hänger ihop med Duved med liftar. Skidbussen går till Åre by och Björnen.',
        boende: 'Främst lägenheter och stugor med självhushåll.',
        kalla: `${SKISTAR_ARE}boende/tegefjall/`,
        kalla2: `${SKISTAR_ARE}skidomraden/duved-tegefjall/`,
        uthyrare: ['agoiare', 'guestit-are', 'skistar-are', 'stugknuten-are'],
      },
      {
        namn: 'Duved',
        agare: 'En mil väster om Åre by',
        passar: 'Den som vill ha en egen by med lugnare tempo och åker tåg. Nattåget stannar i Duved. Barnområde med rullband och knapplift vid linbanan, och längdspår nära.',
        nackdel: 'En mil till Åre by. Liftarna i Duved och Tegefjäll stänger 4 april 2027, fyra veckor före Åre by.',
        lift: 'Boenden i byn ligger nära liften. Hänger ihop med Tegefjäll.',
        boende: 'Hotell och lägenheter i byn, och stugområden runt omkring.',
        kalla: `${SKISTAR_ARE}boende/duved/`,
        kalla2: VISIT_ARE_BARN,
        uthyrare: ['agoiare', 'guestit-are', 'skistar-are', 'stugknuten-are'],
      },
    ],
    liftkort: [
      ['SkiPass gäller i alla fyra områdena, och skidbussen mellan Åre by, Björnen, Tegefjäll och Duved är gratis med giltigt kort (', ['Visit Åre', VISIT_ARE], ', ', ['Länstrafiken', 'https://ltr.se/res-med-oss/60358.skidbussar-i-are.html'], '). Bor du i Duved eller Tegefjäll och vill åka mest där finns ett billigare pass för bara de två områdena (', ['SkiStar', `${SKISTAR_ARE}boende/duved/`], ').'],
      ['Säsongen 2026/27 öppnar Åre by 11 december och håller öppet till 2 maj 2027. Björnen och Duved–Tegefjäll öppnar 18 december och stänger 11 respektive 4 april (', ['Visit Åre', VISIT_ARE], '). Åker du sent på säsongen är Åre by alltså det säkra valet.'],
    ],
    kallor: ['Beskrivningarna bygger på SkiStars och Visit Åres sidor om varje område, och uthyrarna på deras egna sidor.'],
  },

  trysil: {
    slug: 'trysil',
    ort: 'Trysil',
    path: '/var-bo-i-trysil',
    jamfor: [['Sälen eller Trysil', '/jamfor/salen-vs-trysil'], ['Åre eller Trysil', '/jamfor/are-vs-trysil'], ['Hemsedal eller Trysil', '/jamfor/hemsedal-vs-trysil'], ['sportlovet', '/sportlov']],
    titel: 'Boende i Trysil: var ska man bo? Turistsenteret, Fageråsen eller byn | Alpkoll',
    beskrivning:
      'Turistsenteret, Fageråsen eller Trysil sentrum? Avstånden mellan dem, ' +
      'vem varje område passar, vad det saknar och vem som hyr ut där.',
    ingress: [
      'Trysil har två boendeområden på fjället, Turistsenteret och Fageråsen, och byn ' +
        'Trysil sentrum nere i dalen. På skidor hänger hela fjället ihop. Med bil är det ' +
        '12 km mellan Turistsenteret och Fageråsen. Det märks på kvällen, när restaurangen ' +
        'eller badet ligger i det andra området.',
    ],
    kortSvar: [
      { vem: 'Små barn', var: 'Turistsenteret eller Fageråsen' },
      { vem: 'Reser utan bil', var: 'Turistsenteret' },
      { vem: 'Vill bo högt med utsikt', var: 'Fageråsen' },
      { vem: 'Afterski och spa', var: 'Fageråsen' },
      { vem: 'Vill bo i en by med butiker', var: 'Trysil sentrum' },
    ],
    omraden: [
      {
        namn: 'Turistsenteret',
        agare: 'Fjällets fot, mot byn',
        passar: 'Barnfamiljer och den som reser utan bil. SkiStar kallar det det mest centrala området: barnområdet Eventyr, Trysilgondolen som går därifrån sedan december 2025, skiduthyrning, butiker och Radisson Blu med bad.',
        nackdel: 'Till Høyfjellssenteret och SkiStar Lodge i Fageråsen är det 12 km med bil.',
        lift: 'Många boenden ligger några meter från backe eller lift. Gondolen går från Eventyr.',
        boende: 'Hotell, lägenheter, stugor och camping.',
        kalla: `${SKISTAR_TRYSIL}vinter-i-trysil/boende/turistsenteret/`,
        kalla2: `${SKISTAR_TRYSIL}trysilgondolen/`,
        uthyrare: ['radisson-trysil', 'skistar-trysil', 'trysilfjellbooking'],
      },
      {
        namn: 'Fageråsen',
        agare: 'Högt upp på fjället',
        passar: 'Familjer och par som vill bo högt. Høyfjellssenteret har barnområde, skidskola, skiduthyrning och butik samlat, och vid SkiStar Lodge finns spa, restauranger och afterski.',
        nackdel: 'Till byn och till Turistsenteret är det 11–12 km med bil.',
        lift: 'Ski in/ski out eller kort väg till transportlift från många stugor och lägenheter.',
        boende: 'Hotell, lägenheter och stora stugor.',
        kalla: `${SKISTAR_TRYSIL}vinter-i-trysil/boende/fagerasen/`,
        uthyrare: ['skistar-trysil', 'trysilfjellbooking'],
      },
      {
        namn: 'Trysil sentrum',
        agare: 'Byn nere i dalen',
        passar: 'Den som vill bo i en riktig by med butiker och kaféer, och har bil eller tar bussen till backen.',
        nackdel: 'Inget boende vid backen. Till Turistsenteret är det 2,7 km, och du tar skibussen eller bilen varje morgon.',
        lift: 'Skibussen till fjället stannar i byn och är gratis med SkiPass.',
        boende: 'Hotell och lägenheter i byn.',
        kalla: 'https://www.trysilhotell.net/overnatting/skibuss/',
        kalla2: `${SKISTAR_TRYSIL}vinter-i-trysil/boende/`,
        uthyrare: ['trysil-hotell'],
      },
    ],
    liftkortRubrik: 'Liftkortet och resan dit',
    liftkort: [
      ['SkiPass gäller i hela Trysil, och skibussen mellan områdena och byn är gratis med giltigt kort (', ['SkiStar', `${SKISTAR_TRYSIL}vinter-i-trysil/servicetjanster/skidbuss/`], '). Tidtabellen för 2026/27 var inte publicerad 23 november.'],
      ['Från vintern 2026/27 kan du åka Snälltåget via Oslo och ta en transferbuss vidare till Trysil, bokat som en resa hos SkiStar (', ['SkiStar', `${SKISTAR_TRYSIL}vinter-i-trysil/resan-hit/`], ').'],
    ],
    kallor: ['Beskrivningarna bygger på SkiStars sidor om varje område, och uthyrarna på deras egna sidor. Avstånden är uppmätta vägavstånd i OpenStreetMap mellan Trysil Hotell i byn, Radisson Blu vid Turistsenteret och Trysil Høyfjellssenter i Fageråsen.'],
  },
}

/** De tre sidorna i den ordning de länkas till varandra. */
export const VAR_BO_ORDNING = ['salen', 'are', 'trysil']
