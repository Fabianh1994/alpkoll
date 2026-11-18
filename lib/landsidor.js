// En sida per land — /skidorter/<land>.
//
// "skidorter i österrike", "skidorter norge" och "skidorter frankrike" är
// sökningar folk gör innan de har bestämt ort. Startsidan har ett
// landsfilter, men det är ett klientfilter på en och samma adress, så
// Google ser aldrig en sida om Österrike.
//
// Allt med tal på sidan räknas fram ur orterna i databasen: vilken ort som
// är störst, billigast eller närmast kan inte glida isär från ortsidorna.
// Det som står här är det som inte går att räkna fram — vad landet är för
// slags resa, och vad som talar emot det. Inga tal i texterna, av samma
// skäl som i docs/copy.md: de blir gamla utan att någon märker det.
//
// Andorra har bara Grandvalira och får ingen egen sida; en "jämförelse"
// av en ort är ortsidan igen.

export const LANDSIDOR = [
  {
    slug: 'sverige',
    country: 'Sweden',
    namn: 'Sverige',
    i: 'i Sverige',
    nordisk: true,
    ingress:
      'Fjällen nås med bil eller nattåg, utan flyg, och liftkortet köps i kronor. ' +
      'Backarna är kortare än i Alperna, men det är också resan och kön till liften.',
    tankPa: [
      'Fallhöjden är en bråkdel av en alports. Den som åker hela dagarna i en vecka kan ha sett allt efter ett par dagar.',
      'December och januari är mörka och kalla, särskilt längst norrut. Riksgränsen öppnar först i februari.',
      'Sportlovsveckorna fyller orterna. Se vilken vecka din kommun har lov innan du bokar.',
    ],
  },
  {
    slug: 'norge',
    country: 'Norway',
    namn: 'Norge',
    i: 'i Norge',
    nordisk: true,
    ingress:
      'Norge ligger på bilavstånd från Sverige och har större fallhöjd än de flesta svenska orter. ' +
      'Trysil ligger nära gränsen, Hemsedal och Geilo på vägen mot västkusten, Voss och Myrkdalen nära Bergen.',
    tankPa: [
      'Mat och dryck kostar mer än i Sverige, och alkohol betydligt mer. Många handlar hemma innan de kör över gränsen.',
      'Orterna närmast kusten får mycket snö men också blötare väder än inlandet.',
      'Vägen över fjället kan stängas vid oväder. Kolla väglaget före avresan.',
    ],
  },
  {
    slug: 'finland',
    country: 'Finland',
    namn: 'Finland',
    i: 'i Finland',
    nordisk: true,
    ingress:
      'Lapplandsorterna har lång säsong och ofta snö redan i november. ' +
      'Hit flyger de flesta, och vintern är det som lockar lika mycket som backarna: snöskoter, hundspann och norrsken.',
    tankPa: [
      'Fjällen är låga. Den som vill ha långa nedfarter får det inte här.',
      'I december går solen knappt upp. Det är vackert, men skiddagen blir kort.',
      'Det kan bli mycket kallt i januari. Barn behöver bättre kläder än i Alperna.',
    ],
  },
  {
    slug: 'osterrike',
    country: 'Austria',
    namn: 'Österrike',
    i: 'i Österrike',
    nordisk: false,
    ingress:
      'Det vanligaste alplandet för svenskar, och det enda dit nattåget från Sverige går. ' +
      'Orterna är riktiga byar med afterski, och de flesta nås med kort transfer från Innsbruck.',
    tankPa: [
      'Flera orter ligger lägre än i Frankrike och Schweiz och lutar sig mot konstsnö sent och tidigt på säsongen.',
      'Afterskin är en del av resan. Den som vill ha lugna kvällar ska välja by med omsorg.',
      'Svenska sportlovsveckor och tyska skollov krockar. Februari är fullt.',
    ],
  },
  {
    slug: 'frankrike',
    country: 'France',
    namn: 'Frankrike',
    i: 'i Frankrike',
    nordisk: false,
    ingress:
      'Här ligger Alpernas största sammanhängande skidområden och flera av de högst belägna orterna. ' +
      'Många byar är byggda för skidåkning, med pisten utanför dörren.',
    tankPa: [
      'De byggda orterna är praktiska men sällan vackra. Vill du ha vykortsby får du ofta bo längre ner.',
      'Transfern från Genève, Lyon eller Grenoble är längre än från Innsbruck till de österrikiska orterna.',
      'De franska skolloven ligger i februari och början av mars, utspridda över flera veckor.',
    ],
  },
  {
    slug: 'schweiz',
    country: 'Switzerland',
    namn: 'Schweiz',
    i: 'i Schweiz',
    nordisk: false,
    ingress:
      'Höga berg, glaciärer och tåg ända fram till flera av orterna. ' +
      'Schweiz är landet för den som vill ha snösäkerhet och utsikt och kan betala för det.',
    tankPa: [
      'Det dyraste alplandet, både liftkort, boende och mat.',
      'Orterna är kända för offpist och branta åk. För nybörjare finns billigare och enklare val.',
    ],
  },
  {
    slug: 'italien',
    country: 'Italy',
    namn: 'Italien',
    i: 'i Italien',
    nordisk: false,
    ingress:
      'Dolomiterna, Livigno och Madonna di Campiglio: breda, välpistade backar och mat som många minns längre än åkningen. ' +
      'Liftkortet Dolomiti Superski gäller i tolv områden, men de hänger inte ihop med lift.',
    tankPa: [
      'Flera orter har lång transfer från närmaste flygplats.',
      'Pisterna passar mellanåkare bäst. Den som vill ha brant och offpist har bättre val i Frankrike och Schweiz.',
      'Livigno är tullfritt, vilket syns på priserna i butikerna men inte på liftkortet.',
    ],
  },
]

export const landsidaFor = (slug) => LANDSIDOR.find((l) => l.slug === slug) || null

/** Adressen till landets sida, eller null om landet saknar en. */
export function landsidaAdress(country) {
  const l = LANDSIDOR.find((x) => x.country === country)
  return l ? `/skidorter/${l.slug}` : null
}
