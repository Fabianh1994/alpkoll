// Motiveringarna till topplistan på /skidorter-for-barnfamiljer.
//
// ChatGPT och Googles AI-svar citerar listor där varje ort har en kort,
// konkret motivering och en källa: "Kläppen: barnområde, skidskola,
// maskotar" (Freeride), inte en rad med poängstaplar. Därför står här en
// mening om varför orten passar barnfamiljer och en om vad som talar emot,
// skrivna efter docs/copy.md: namn i stället för adjektiv, inga
// handskrivna restider eller priser, och en nackdel som säger vem den
// gäller och vilken annan ort som passar bättre.
//
// Fakta och citat kommer ur ortsresearchen (orter/<slug>.md i projektets
// filer), där varje påstående har sitt citat. Länkarna i `kallor` är de
// sidor faktameningen bygger på.
//
// En ort som får familjepoäng 8 eller mer men saknas här visas ändå i
// listan, med poängen men utan motivering. Det är en påminnelse om att
// skriva en, inte ett fel.

/** Ändras för hand när listan granskas. Visas på sidan och i dateModified. */
export const UPPDATERAD = '2026-11-20'
/** Dagen sidan först publicerades (PR #84). */
export const PUBLICERAD = '2026-11-17'
/** Säsongen i rubriken. Byts när nästa säsongs priser är inlagda. */
export const SASONG = '2026/27'

const SR = (ort, namn = 'skiresort.com, familjebetyg') => ({
  namn,
  url: `https://www.skiresort.com/en/ski-resort/${ort}/test-result/families-children/`,
})

export const MOTIVERINGAR = {
  salen: {
    kort: 'barnområden i alla fyra SkiStar-områdena',
    varfor:
      'Lindvallen, Högfjället, Tandådalen och Hundfjället har varsitt barnområde, mycket av boendet ligger vid backen, och samma SkiPass gäller i alla fyra.',
    nackdel:
      'Har ni tonåringar som vill åka brant är Sälen fel val. Fallhöjden är den minsta av de svenska orterna här, och Åre har ungefär tre gånger så mycket.',
    kallor: [SR('lindvallen-hoegfjaellet-saelen', 'skiresort.com, Lindvallen och Högfjället'), SR('tandaadalen-hundfjaellet-saelen', 'skiresort.com, Tandådalen och Hundfjället')],
  },
  branas: {
    kort: 'tretton gånger vinnare av Stora Barnsemesterpriset',
    varfor:
      'Branäs har vunnit Stora Barnsemesterpriset tretton gånger, barn upp till sex år åker gratis, och de flesta stugor ligger vid backen. Barnen har två Björnbuseland och Nintendo Land.',
    nackdel:
      'Vill ni åka tidigt på säsongen eller brant är Branäs fel val. Premiären är i mitten av december, och svart pist finns i två backar. Idre Fjäll öppnar tidigare och ligger högre.',
    kallor: [
      { namn: 'Branäs, om anläggningen', url: 'https://www.branas.se/om-branasgruppen/' },
      { namn: 'Branäs, liftkort', url: 'https://www.branas.se/skidakning-i-branas/liftkort/' },
    ],
  },
  'idre-fjall': {
    kort: 'alla boenden ski in/ski out',
    varfor:
      'Alla boenden ligger vid backen, barn under åtta år åker gratis, och barnområdena med rullband ligger vid centrum och Skicenter Syd.',
    nackdel:
      'Vill ni ha kort bilresa från Stockholm är Idre Fjäll ett sämre val. Sälen ligger närmare, med samma sorts lätta backar.',
    kallor: [
      SR('idre-fjaell'),
      { namn: 'Idre Fjäll, skidåkning', url: 'https://www.idrefjall.se/skidakning-pa-idre-fjall/' },
    ],
  },
  hafjell: {
    kort: 'tre familjeområden med gratis rullband',
    varfor:
      'Hafjell har tre familjeområden: Knerten vid liftbotten, Favn och Frontyard vid gondolens topp och Gaia vid Gaiastova. Rullbanden och Gaias knapplift är gratis för alla.',
    nackdel:
      'Har ni barn under tre år som behöver barnpassning är Hafjell fel val, eftersom orten inte har någon. Geilo har Trollklubben i Vestlia.',
    kallor: [SR('hafjell')],
  },
  vemdalen: {
    kort: 'Björnrike är SkiStars familjeområde',
    varfor:
      'Vemdalsskalet, Björnrike och Klövsjö/Storhogna har samma SkiPass och varsitt barnområde med täckt rullband. Björnrike är SkiStars familjeområde, och vid Skalets torg finns barnomsorg från två år.',
    nackdel:
      'Vill ni åka mellan områdena utan buss är Vemdalen fel val. De hänger inte ihop med lift. I Sälen hänger områdena ihop två och två.',
    kallor: [SR('vemdalsskalet'), { namn: 'SkiStar Vemdalen, skidområden', url: 'https://www.skistar.com/en/ski-destinations/vemdalen/winter-in-vemdalen/ski-areas/' }],
  },
  geilo: {
    kort: 'barnområden vid fyra liftbottnar, och tåget till byn',
    varfor:
      'Barnområden finns i Vestlia, Kikut, Slaatta och Havsdalen, Trollklubben i Vestlia har barnpassning, och Bergensbanan stannar mitt i byn.',
    nackdel:
      'Har ni barn som vill åka brant är Geilo fel val. Fallhöjden är liten, och Hemsedal har ungefär dubbelt så mycket.',
    kallor: [SR('geilo')],
  },
  levi: {
    kort: 'Leevilandia och barnomsorg vid backen',
    varfor:
      'Barnområdet Leevilandia vid South Point har rullband och övningsliftar, och barnomsorgen Muksutupa ligger bredvid. Liftarna brukar öppna redan i oktober.',
    nackdel:
      'Vill ni slippa flyget är Levi fel val, och i december och januari är dagsljuset kort. Sälen och Idre Fjäll når ni med bil.',
    kallor: [SR('levi')],
  },
  trysil: {
    kort: 'barningång vid varje lift',
    varfor:
      'Varje del av Trysilfjellet har eget barnområde, och alla liftar har en egen ingång för barn.',
    nackdel:
      'Dalstationerna ligger flera kilometer isär, så boendet avgör var ni åker. I Idre Fjäll och Branäs ligger allt boende vid backen.',
    kallor: [SR('trysil')],
  },
  courchevel: {
    kort: 'lätta backar nära allt boende',
    varfor:
      'Alla byar i Courchevel har boende nära lätta backar, i 1650 och 1850 ligger övningsbackarna direkt ovanför byn, och flera stolsliftar har magnetlås som håller barnen kvar i stolen.',
    nackdel:
      'Har ni en vanlig familjebudget är Courchevel fel val. Boendet hör till de dyraste i Alperna. La Plagne har samma sorts byar vid pisten.',
    kallor: [{ namn: 'Ski Club GB, Courchevel', url: 'https://skiclub.co.uk/resort/courchevel' }],
  },
  'alta-badia': {
    kort: 'barn under åtta år åker gratis med förälder',
    varfor:
      'Barnområden med rullband ligger i byarna vid dalstationerna, i Corvara mitt framför skidskolan, och barn under åtta år åker gratis med en betalande vuxen.',
    nackdel:
      'La Villa ligger i skugga större delen av vintern, så välj Corvara eller Colfosco. I högsäsong är backarna fulla.',
    kallor: [SR('alta-badia')],
  },
  saalbach: {
    kort: 'barnområde med rullband i varje by',
    varfor:
      'Saalbach, Hinterglemm, Leogang och Fieberbrunn har varsitt barnområde, och Leo’s Kinderland har fyra rullband.',
    nackdel:
      'Saalbach by är utdragen och bullrig på eftermiddagen när afterskin drar igång. Med små barn är Hinterglemm eller Leogang lugnare.',
    kallor: [SR('saalbach-hinterglemm-leogang-fieberbrunn-skicircus')],
  },
  obergurgl: {
    kort: 'snösäkert, lugnt och boende vid pisten',
    varfor:
      'Skidskolan driver barnområdena Wiesental och Pirchhütt, i Hochgurgl ligger ett täckt rullband intill hotellen, och liftarna börjar så högt att snön sällan sviker.',
    nackdel:
      'Vill ni ha liv i byn är Obergurgl fel val. Sölden längre ner i samma dal har mer afterski.',
    kallor: [SR('gurgl-obergurgl-hochgurgl')],
  },
  'la-plagne': {
    kort: 'byarna är byggda vid pisten',
    varfor:
      'Plateaubyarna är byggda vid pisten med barnområde och övningslift i varje by, och tre byar är märkta Famille Plus.',
    nackdel:
      'Plateaubyarna är betongbyar från 1960- och 70-talen. Vill ni bo i en gammal by är Saalbach eller Alta Badia bättre val.',
    kallor: [
      { namn: 'inthesnow, La Plagne för familjer', url: 'https://www.inthesnow.com/la-plagne/for-families/' },
      { namn: 'Ski Club GB, La Plagne', url: 'https://skiclub.co.uk/resort/la-plagne' },
    ],
  },
  livigno: {
    kort: 'rullband i hela byn och barnklubb',
    varfor:
      'Övningsområden och rullband finns i hela byn, och barnklubben har förskola.',
    nackdel:
      'Byn är lång, så fel boende ger bussresor varje dag. Bo nära Carosello 3000 eller Mottolino.',
    kallor: [SR('livigno')],
  },
  'saas-fee': {
    kort: 'bilfri by och gratis liftkort för barn',
    varfor:
      'Swiss Snow Kids Village ligger vid skidskolans samlingsplats i byn, och barn under nio år åker gratis när en förälder köper sexdagarskort.',
    nackdel:
      'Bara en femtedel av pisten är blå, så nybörjare får snabbt för brant. Obergurgl har mer lätt pist på samma höjd.',
    kallor: [SR('saas-fee'), { namn: 'Ski Club GB, Saas-Fee', url: 'https://skiclub.co.uk/resort/saas-fee' }],
  },
  'zell-am-see-kaprun': {
    kort: 'täckta rullband och en riktig stad',
    varfor:
      'Barnområden med täckta rullband finns i Schüttdorf, Schmittental och Viehhofen, och Maiskogel har breda, lätta backar ner till Kaprun.',
    nackdel:
      'Det är två skidberg med buss emellan. Vill ni åka från dörren är La Plagne bättre.',
    kallor: [SR('schmittenhoehe-zell-am-see', 'skiresort.com, Schmittenhöhe'), SR('kitzsteinhorn-maiskogel-kaprun', 'skiresort.com, Kaprun')],
  },
  'val-gardena': {
    kort: 'barnområde i varje by och miniklubb från två år',
    varfor:
      'Ortisei, Santa Cristina, Selva och Monte Pana har barnområden och skidskola för barn, och minibarnklubben tar barn från två år.',
    nackdel:
      'Pisten är mest röd, och nybörjarbacken i Selva kräver buss från en del boenden. Alta Badia på andra sidan Sellamassivet har mer blått.',
    kallor: [SR('val-gardena-groeden')],
  },
  'lech-zuers': {
    kort: 'bilfria Oberlech',
    varfor:
      'Oberlech är bilfritt sedan 1997, och Lech och Zürs har barnområden med rullband och babylift.',
    nackdel:
      'Boendet hör till de dyraste i Österrike. Saalbach har barnområde i varje by för mindre pengar.',
    kallor: [{ namn: 'Snowthere, Lech-Zürs', url: 'https://www.snowthere.com/resorts/austria/lech-zurs' }],
  },
}

/**
 * Familjeorter som ännu inte finns i databasen. De nämns på sidan så att
 * läsaren vet att de inte är bortvalda, utan inte jämförda än.
 */
export const SAKNAS = [
  {
    namn: 'Kläppen',
    text: 'vann Freerides omröstning om Sveriges bästa skidort för barnfamiljer 2026 och utsågs till Årets skidanläggning av SLAO samma år',
    kalla: { namn: 'Freeride', url: 'https://www.freeride.se/sveriges-basta-skidort-barnfamiljer/' },
  },
  {
    namn: 'Funäsfjällen',
    text: 'Tänndalen, Ramundberget och Funäsdalsberget med ett liftkort, utsedd till Sveriges bästa skidort fem år i rad av Freerides läsare',
    kalla: { namn: 'Freeride', url: 'https://www.freeride.se/sveriges-basta-skidort/' },
  },
]
