// Räknar ut de tre resorna — bil, tåg och flyg — med Googles ruttmotor och
// flygdatan från /api/flyg. Allt körs i läsarens webbläsare, med nyckeln
// som är låst till alpkoll.se.
//
// Google-svaret görs om till Alpkolls egna etapper (lib/resa/resvag.js)
// direkt, så att kartan och tidslinjen inte behöver veta något om Google.

import {
  FLYGPLATS_FORE, EFTER_LANDNING, fordon, resa, pauspunkter, svenskTid, datumFor,
} from '../../lib/resa/resvag'
import { FLYGPLATSER, avreseFor, ankomstFor, avstandKm, flygplats } from '../../lib/resa/flygplatser'

const punkt = (p) => ({ lat: typeof p.lat === 'function' ? p.lat() : p.lat, lng: typeof p.lng === 'function' ? p.lng() : p.lng })
const ms = (route, falt) => route?.[falt] ?? route?.staticDurationMillis ?? null

/**
 * Kortaste bilvägen mellan två punkter, som en etapp. null om Google inte
 * hittar någon. Med `via` går vägen över läsarens egna stopp, och `viaMin`
 * säger efter hur lång körning stoppet kommer.
 */
export async function bilEtapp(lib, fran, till, startMs, { typ = 'bil', via = null } = {}) {
  const { Route } = lib.routes
  const fraga = {
    origin: { lat: fran.lat, lng: fran.lng },
    destination: { lat: till.lat, lng: till.lng },
    travelMode: 'DRIVING',
    polylineQuality: 'OVERVIEW',
    language: 'sv',
    region: 'se',
    fields: ['durationMillis', 'staticDurationMillis', 'distanceMeters', 'path', ...(via ? ['legs'] : [])],
  }
  if (via) fraga.intermediates = [{ location: { lat: via.lat, lng: via.lng } }]
  const { routes } = await Route.computeRoutes(fraga)
  const r = routes?.[0]
  if (!r) return null
  const min = Math.round((ms(r, 'durationMillis') || 0) / 60000)
  const forsta = via && r.legs?.[0]
  return {
    typ,
    fran: { namn: fran.namn, lat: fran.lat, lng: fran.lng },
    till: { namn: till.namn, lat: till.lat, lng: till.lng, kod: till.kod },
    start: startMs,
    slut: startMs + min * 60000,
    min,
    km: Math.round((r.distanceMeters || 0) / 1000),
    path: (r.path || []).map(punkt),
    viaMin: forsta ? Math.round((ms(forsta, 'durationMillis') || 0) / 60000) : null,
  }
}

/**
 * Kollektivtrafik mellan två punkter. Med `ankomst` söker Google en resa
 * som är framme senast då, annars en som går tidigast `startMs`.
 * Returnerar etapperna i ordning, eller null.
 */
export async function kollektivEtapper(lib, fran, till, { startMs, ankomstMs, lagen = null } = {}) {
  const { Route } = lib.routes
  const fraga = {
    origin: { lat: fran.lat, lng: fran.lng },
    destination: { lat: till.lat, lng: till.lng },
    travelMode: 'TRANSIT',
    language: 'sv',
    region: 'se',
    fields: ['durationMillis', 'distanceMeters', 'legs'],
  }
  if (ankomstMs) fraga.arrivalTime = new Date(ankomstMs)
  else fraga.departureTime = new Date(startMs)
  if (lagen) fraga.transitPreference = { allowedTransitModes: lagen }

  let routes
  try {
    ;({ routes } = await Route.computeRoutes(fraga))
  } catch {
    return null
  }
  const r = routes?.[0]
  if (!r?.legs?.length) return null

  const steg = r.legs.flatMap((l) => l.steps || [])
  if (!steg.some((s) => s.transitDetails)) return null

  // Steg för steg: gångsteg slås ihop, och varje åk blir en egen etapp med
  // linje, bolag och hållplatser.
  const rad = []
  for (const s of steg) {
    const path = (s.path || []).map(punkt)
    const t = s.transitDetails
    if (t) {
      const linje = t.transitLine || {}
      const bolag = linje.agencies?.[0] || {}
      rad.push({
        typ: fordon(linje.vehicle?.vehicleType),
        fran: { namn: t.departureStop?.name, ...pos(t.departureStop, path[0]) },
        till: { namn: t.arrivalStop?.name, ...pos(t.arrivalStop, path[path.length - 1]) },
        start: t.departureTime?.getTime(),
        slut: t.arrivalTime?.getTime(),
        linje: linje.shortName || linje.name || t.tripShortText || null,
        linjenamn: linje.name || null,
        tagnummer: t.tripShortText || null,
        riktning: t.headsign || null,
        hallplatser: t.stopCount ?? null,
        bolag: bolag.name || null,
        lank: bolag.url ? String(bolag.url) : null,
        farg: linje.color || null,
        path,
      })
    } else {
      const forra = rad[rad.length - 1]
      const min = (s.staticDurationMillis || 0) / 60000
      if (forra?.typ === 'gang') {
        forra.min += min
        forra.meter += s.distanceMeters || 0
        forra.path.push(...path)
      } else {
        rad.push({ typ: 'gang', min, meter: s.distanceMeters || 0, path })
      }
    }
  }

  // Gångetapperna får tider från åken runt dem: före första åket räknas
  // bakåt, annars framåt från förra åket.
  for (let i = 0; i < rad.length; i++) {
    const e = rad[i]
    if (e.typ !== 'gang') continue
    const forra = rad[i - 1]
    const nasta = rad[i + 1]
    if (forra?.slut) e.start = forra.slut
    else if (nasta?.start) e.start = nasta.start - Math.round(e.min) * 60000
    else e.start = startMs || ankomstMs - Math.round(e.min) * 60000
    e.slut = e.start + Math.round(e.min) * 60000
    e.min = Math.round(e.min)
    e.fran = { namn: forra?.till?.namn || fran.namn, ...(e.path[0] || fran) }
    e.till = { namn: nasta?.fran?.namn || till.namn, ...(e.path[e.path.length - 1] || till) }
  }

  // Ett par meter till en perrong är inte en etapp.
  return rad.filter((e) => e.typ !== 'gang' || e.min >= 3 || e === rad[0] || e === rad[rad.length - 1])
    .filter((e) => Number.isFinite(e.start) && Number.isFinite(e.slut))
}

function pos(stopp, reserv) {
  const ll = stopp?.location?.latLng || stopp?.location
  if (ll && (ll.lat != null)) return punkt(ll)
  return reserv || {}
}

/**
 * Läsarens val för bilresan. `pausVar` är minuter bakom ratten mellan
 * pauserna, `maxDag` längsta körning en dag (0 = hela vägen utan natt), och
 * `egetStopp` ett eget stopp på vägen: { namn, lat, lng, min } där min 0
 * betyder övernattning.
 */
export const BILVAL = { pausVar: 150, pauslangd: 'vanlig', maxDag: 660, egetStopp: null }

/** Paus och lunch i minuter för varje pauslängd. */
export const PAUSLANGD = { kort: [10, 30], vanlig: [20, 45], lang: [30, 60] }

/** Resan med bil, med pausförslag längs vägen. */
export async function planeraBil(lib, hem, mal, startMs, val = BILVAL) {
  const e = await bilEtapp(lib, hem, mal, startMs, { via: val.egetStopp })
  if (!e) return { satt: 'bil', saknas: val.egetStopp ? 'Google hittade ingen bilväg via ditt stopp.' : 'Google hittade ingen bilväg.' }
  return bilMedPauser(e, val)
}

/**
 * Lägger pauser, luncher och nätter på en bilväg. Körs om direkt när
 * läsaren ändrar pauserna, utan att fråga Google igen.
 */
export function bilMedPauser(e, val = BILVAL) {
  const v = { ...BILVAL, ...val }
  const [kort, lunch] = PAUSLANGD[v.pauslangd] || PAUSLANGD.vanlig
  // Pauserna räknas in i ankomsten: lunch mellan 11 och 14, annars en kort
  // paus. Varje paus skjuter de följande lika mycket.
  //
  // Mer körning än en dags del delas i lika långa dagar, så att ingen dag
  // blir mycket längre än den andra. Natten läggs vid pausen närmast
  // dagens del, och efter klockan 20 med mer än tre timmar kvar föreslås
  // natten ändå. Med mindre kvar kör de flesta hela vägen fram. Väljer
  // läsaren att köra hela vägen blir det ingen natt alls.
  // "Hela vägen" betyder ingen natt, men över 16 timmar bakom ratten
  // läggs en natt in ändå.
  const maxDag = v.maxDag || (e.min > 960 ? 960 : 0)
  const dagar = maxDag ? Math.max(1, Math.ceil(e.min / maxDag)) : 1
  let perDag = e.min / dagar
  let nastaNatt = perDag

  // Läsarens eget stopp ersätter de automatiska pauserna nära det.
  let punkter = pauspunkter(e.path, e.min, v.pausVar)
  const eget = v.egetStopp && e.viaMin != null
    ? { lat: v.egetStopp.lat, lng: v.egetStopp.lng, efterMin: e.viaMin, egen: true, namn: v.egetStopp.namn, onskadMin: v.egetStopp.min }
    : null
  if (eget) {
    punkter = [...punkter.filter((p) => Math.abs(p.efterMin - eget.efterMin) > 45), eget].sort((a, b) => a.efterMin - b.efterMin)
  }

  let tillagt = 0
  const timmeFor = (t) => Number(new Intl.DateTimeFormat('sv-SE', { hour: 'numeric', hourCycle: 'h23', timeZone: 'Europe/Stockholm' }).format(new Date(t)))
  const natt = (p, startMs, timme) => {
    // Före 05 sovs det till samma dags morgon, annars till nästa.
    const morgon = svenskTid(datumFor(startMs + (timme >= 5 ? 86400000 : 0)), '08:00')
    const langdMin = Math.max(0, Math.round((morgon - startMs) / 60000))
    tillagt += langdMin
    // Resten av vägen delas om i lika långa dagar från natten.
    const kvar = e.min - p.efterMin
    if (maxDag) perDag = kvar / Math.max(1, Math.ceil(kvar / maxDag))
    nastaNatt = p.efterMin + perDag
    return { ...p, startMs, langdMin, natt: true }
  }
  const pauser = punkter.map((p) => {
    const startMs = e.start + (p.efterMin + tillagt) * 60000
    const timme = timmeFor(startMs)
    const kvar = e.min - p.efterMin
    if (p.egen) {
      if (p.onskadMin === 0) return natt(p, startMs, timme)
      tillagt += p.onskadMin
      return { ...p, startMs, langdMin: p.onskadMin }
    }
    const sent = v.maxDag > 0 && (timme >= 20 || timme < 5)
    const dags = maxDag > 0 && p.efterMin >= nastaNatt - 75
    if ((dags || sent) && kvar > 180) return natt(p, startMs, timme)
    const langdMin = timme >= 11 && timme < 14 ? lunch : kort
    tillagt += langdMin
    return { ...p, startMs, langdMin }
  })
  return resa('bil', [{ ...e, slut: e.slut + tillagt * 60000 }], { km: e.km, pauser, pausMin: tillagt, korMin: e.min, bilvag: e, bilval: v })
}

/** Spårtrafik: tåg, regionaltåg, tunnelbana och spårvagn. */
const SPAR = ['TRAIN', 'RAIL', 'SUBWAY', 'LIGHT_RAIL']
const gangMin = (et) => et.filter((e) => e.typ === 'gang').reduce((s, e) => s + e.min, 0)

/**
 * Resan med tåg och buss. Tåget går först: få sätter sig på en långfärdsbuss
 * en bit av en tågresa. Google frågas två gånger, med bara spår och med
 * allt. Spårresan väljs om den finns, inte kräver lång promenad och inte
 * tar mer än tre timmar längre. Annars blir det resan med buss, och en lång
 * bussträcka sägs ut.
 *
 * Med `ankomstMs` söks en resa som är framme senast då (tidigare avgång).
 */
export async function planeraTag(lib, hem, mal, startMs, { ankomstMs } = {}) {
  const nar = ankomstMs ? { ankomstMs } : { startMs }
  const [spar, alla] = await Promise.all([
    kollektivEtapper(lib, hem, mal, { ...nar, lagen: SPAR }).catch(() => null),
    kollektivEtapper(lib, hem, mal, nar).catch(() => null),
  ])
  // Resan ska gå den valda dagen: framåt räknas avgången, bakåt ankomsten.
  const dag = datumFor(ankomstMs || startMs)
  const ratDag = (et) => !!et?.length && datumFor(ankomstMs ? et.at(-1).slut : et[0].start) === dag
  const sparOk = spar?.length && gangMin(spar) <= 40 && (ratDag(spar) || !ratDag(alla))
  // Framåt jämförs när resan är framme, bakåt när den går.
  const battre = () => ankomstMs
    ? spar[0].start >= alla[0].start - 180 * 60000
    : spar.at(-1).slut <= alla.at(-1).slut + 180 * 60000
  // Finns inget annat duger spårresan även med lång promenad.
  const valt = (sparOk && (!alla?.length || battre())) || (!alla?.length && spar?.length) ? spar : alla
  if (!valt?.length) return { satt: 'tag', saknas: 'Google hittade ingen resa med tåg eller buss den dagen.' }
  const langBuss = valt.find((e) => e.typ === 'buss' && e.slut - e.start >= 90 * 60000)
  return resa('tag', valt, {
    baraSpar: valt === spar,
    langBuss: langBuss ? { min: Math.round((langBuss.slut - langBuss.start) / 60000), fran: langBuss.fran?.namn, till: langBuss.till?.namn, bolag: langBuss.bolag } : null,
    valdStart: startMs,
  })
}

/**
 * Resan med flyg. Prövar flygen från de närmaste flygplatserna till ortens
 * flygplatser och väljer det som gör att du är framme tidigast.
 *
 * @param ort  { slug, namn, portkod }
 */
export async function planeraFlyg(lib, hem, mal, ort, startMs, datum, { hemat = false } = {}) {
  if (avstandKm(hem, mal) < 250) return { satt: 'flyg', saknas: 'Orten ligger för nära för att flyget ska löna sig.' }

  // Hemåt är det tvärtom: från ortens flygplatser till de närmaste hemma.
  const fran = hemat ? ankomstFor(ort.slug, ort.portkod) : avreseFor(hem)
  const till = (hemat ? avreseFor(mal) : ankomstFor(ort.slug, ort.portkod)).filter((k) => !fran.includes(k))
  if (!till.length) return { satt: 'flyg', saknas: 'Det finns ingen flygplats att flyga till för den här orten.' }

  const par = fran.flatMap((f) => till.map((t) => [f, t]))
  const svar = await Promise.all(par.map(([f, t]) =>
    fetch(`/api/flyg?fran=${f}&till=${t}&datum=${datum}`).then((r) => r.json()).catch(() => ({ flyg: [] }))))

  if (svar.every((s) => s.saknarNyckel)) return { satt: 'flyg', saknas: 'Flygdatan är inte inkopplad än.' }
  if (svar.every((s) => s.utanforFonster)) return { satt: 'flyg', saknas: 'Flyg går att söka från i dag och ett år framåt.' }
  const flyg = svar.flatMap((s) => s.flyg || []).filter((f) => f.byten <= 1 && FLYGPLATSER[f.fran] && FLYGPLATSER[f.till])
  if (!flyg.length) return { satt: 'flyg', saknas: hemat ? 'Inga flyg hem hittades den dagen.' : 'Inga flyg hittades den dagen från flygplatserna närmast dig.' }

  // Bilvägen till varje avreseflygplats och från varje ankomstflygplats,
  // en gång per flygplats.
  const plats = (kod) => ({ namn: FLYGPLATSER[kod].namn, lat: FLYGPLATSER[kod].lat, lng: FLYGPLATSER[kod].lng, kod })
  const unika = (lista) => [...new Set(lista)]
  const [dit, darifran] = await Promise.all([
    Promise.all(unika(flyg.map((f) => f.fran)).map(async (k) => [k, await bilEtapp(lib, hem, plats(k), 0, hemat ? { typ: 'transfer' } : {}).catch(() => null)])),
    Promise.all(unika(flyg.map((f) => f.till)).map(async (k) => [k, await bilEtapp(lib, plats(k), mal, 0, hemat ? {} : { typ: 'transfer' }).catch(() => null)])),
  ])
  const bilDit = Object.fromEntries(dit)
  const bilFran = Object.fromEntries(darifran)

  const kandidater = flyg
    .filter((f) => bilDit[f.fran] && bilFran[f.till])
    .map((f) => {
      const avgang = Date.parse(f.avgang)
      const ankomst = Date.parse(f.ankomst)
      const lamna = avgang - (FLYGPLATS_FORE + bilDit[f.fran].min) * 60000
      const framme = ankomst + (EFTER_LANDNING + bilFran[f.till].min) * 60000
      return { ...f, lamna, framme }
    })
  if (!kandidater.length) return { satt: 'flyg', saknas: 'Google hittade ingen väg till eller från flygplatserna.' }

  // Flyg som går att hinna till om du åker tidigast vald tid; finns inget
  // sådant visas dagens alla, och tidslinjen säger att du behöver åka tidigare.
  const hinns = kandidater.filter((k) => k.lamna >= startMs - 15 * 60000)
  const urval = (hinns.length ? hinns : kandidater)
    // Flyg på den valda dagen går före flyg från dagarna runt omkring.
    .sort((a, b) => !!a.narliggande - !!b.narliggande || a.framme - b.framme || (a.pris ?? 1e9) - (b.pris ?? 1e9))

  const valt = urval[0]
  const resan = await byggFlygresa(lib, hem, mal, valt, bilDit[valt.fran], bilFran[valt.till], { hemat })
  return {
    ...resan,
    tidigare: !hinns.length,
    valdStart: startMs,
    alternativ: urval.slice(0, 6),
    bilDit,
    bilFran,
  }
}

/** Hela flygresan för ett valt flyg: vägen dit, flygplatsen, flyget och transfern. */
export async function byggFlygresa(lib, hem, mal, f, bilDit, bilFran, { hemat = false, vidare = 'auto', kollTid = null, taxiExtra = 0 } = {}) {
  // Läsaren kan säga att vägen mellan flygplatsen och orten tar längre tid
  // än Googles bilväg, till exempel med delad transferbuss.
  if (taxiExtra) {
    if (hemat) bilDit = { ...bilDit, min: bilDit.min + taxiExtra }
    else bilFran = { ...bilFran, min: bilFran.min + taxiExtra }
  }
  const avgang = Date.parse(f.avgang)
  const ankomst = Date.parse(f.ankomst)
  const fran = FLYGPLATSER[f.fran]
  const till = FLYGPLATSER[f.till]
  const vidFlygplats = avgang - FLYGPLATS_FORE * 60000

  // Till flygplatsen: kollektivt om det inte tar mycket längre än bilen.
  // Hemåt kan läsaren välja en tidigare avgång från orten (kollTid).
  const kollektivtDit = await kollektivEtapper(lib, hem, { namn: fran.namn, ...fran }, { ankomstMs: hemat && kollTid ? Math.min(kollTid, vidFlygplats) : vidFlygplats }).catch(() => null)
  const kollMin = kollektivtDit?.length ? (kollektivtDit.at(-1).slut - kollektivtDit[0].start) / 60000 : Infinity
  // Hemåt är det här vägen från orten, och där får läsaren välja själv.
  const ditKoll = hemat && vidare !== 'auto'
    ? vidare === 'kollektivt' && !!kollektivtDit?.length
    : kollMin <= bilDit.min * 1.5 + 20
  const ditEtapper = ditKoll
    ? kollektivtDit
    : [{ ...bilDit, start: vidFlygplats - bilDit.min * 60000, slut: vidFlygplats, extra: hemat ? taxiExtra : 0 }]

  const flygEtapp = {
    typ: 'flyg',
    fran: { namn: fran.namn, lat: fran.lat, lng: fran.lng, kod: f.fran },
    till: { namn: till.namn, lat: till.lat, lng: till.lng, kod: f.till },
    start: avgang,
    slut: ankomst,
    min: f.minuter,
    bolag: f.bolag,
    bolagKod: f.bolagKod || null,
    linje: f.nummer,
    byten: f.byten,
    pris: f.pris,
    vaska: f.vaska || null,
    lank: f.lank,
    delar: f.delar || null,
    // Flygbågen går via bytesflygplatsen när den är känd.
    path: [
      { lat: fran.lat, lng: fran.lng },
      ...(f.delar || []).slice(0, -1).map((d) => flygplats(d.till)).filter(Boolean).map((p) => ({ lat: p.lat, lng: p.lng })),
      { lat: till.lat, lng: till.lng },
    ],
  }
  const incheckning = {
    typ: 'vanta', namn: 'Incheckning och säkerhetskontroll',
    start: ditEtapper.at(-1).slut, slut: avgang, path: [],
    fran: flygEtapp.fran, till: flygEtapp.fran,
  }
  const bagage = {
    typ: 'vanta', namn: hemat ? 'Bagage och vidare hem' : 'Bagage och vidare till transfern',
    start: ankomst, slut: ankomst + EFTER_LANDNING * 60000, path: [],
    fran: flygEtapp.till, till: flygEtapp.till,
  }

  // Från flygplatsen: buss eller tåg om det finns och inte är orimligt
  // mycket längre än bilen, annars transfer med bilvägen som karta.
  const efter = bagage.slut
  // Dit kan läsaren välja en senare avgång från flygplatsen (kollTid).
  const kollektivtFran = await kollektivEtapper(lib, { namn: till.namn, ...till }, mal, { startMs: !hemat && kollTid ? Math.max(kollTid, efter) : efter }).catch(() => null)
  const kollFranSlut = kollektivtFran?.at(-1)?.slut ?? Infinity
  const franKoll = !hemat && vidare !== 'auto'
    ? vidare === 'kollektivt' && !!kollektivtFran?.length
    : kollFranSlut - efter <= (bilFran.min * 1.8 + 30) * 60000
  if (!hemat && franKoll) bagage.namn = `Bagage och vidare till ${kollektivtFran.find((e) => e.typ !== 'gang')?.typ === 'buss' ? 'bussen' : 'tåget'}`
  const franEtapper = franKoll
    ? kollektivtFran
    : [{ ...bilFran, typ: hemat ? 'bil' : 'transfer', start: efter, slut: efter + bilFran.min * 60000, extra: hemat ? 0 : taxiExtra }]

  // Vägen mellan flygplatsen och orten går att göra på två sätt: tåg och
  // buss enligt Googles tidtabeller, eller taxi och transfer på bilvägen.
  // Båda visas, så att läsaren kan välja.
  const ortKoll = hemat ? kollektivtDit : kollektivtFran
  const ortBil = hemat ? bilDit : bilFran
  const vidareVal = {
    kollektivt: ortKoll?.length ? {
      min: Math.round((ortKoll.at(-1).slut - ortKoll[0].start) / 60000),
      start: ortKoll[0].start,
      slut: ortKoll.at(-1).slut,
      byten: Math.max(0, ortKoll.filter((e) => e.typ !== 'gang').length - 1),
      satt: [...new Set(ortKoll.filter((e) => e.typ !== 'gang').map((e) => e.typ))],
    } : null,
    taxi: {
      min: ortBil.min,
      km: ortBil.km,
      start: hemat ? vidFlygplats - ortBil.min * 60000 : efter,
      slut: hemat ? vidFlygplats : efter + ortBil.min * 60000,
    },
    valt: (hemat ? ditKoll : franKoll) ? 'kollektivt' : 'taxi',
    flygplats: hemat ? fran.namn : till.namn,
    taxiExtra,
    flyttad: !!kollTid,
  }

  return resa('flyg', [...ditEtapper, incheckning, flygEtapp, bagage, ...franEtapper], { flyget: f, hemat, vidare: vidareVal })
}

/**
 * Lunchställen och kaféer nära pauspunkterna, rangordnade efter hur
 * populära de är hos Google. Alpkoll betygsätter inte restauranger själv.
 */
export async function stoppLangsVagen(lib, pauser) {
  if (!pauser?.length) return []
  const { Place } = lib.places
  const svar = await Promise.all(pauser.map(async (p) => {
    // Läsarens eget stopp behöver inga förslag.
    if (p.egen) return { ...p, platser: [] }
    try {
      const { places } = await Place.searchNearby({
        fields: ['displayName', 'location', 'googleMapsURI', 'primaryTypeDisplayName', 'formattedAddress'],
        locationRestriction: { center: { lat: p.lat, lng: p.lng }, radius: 12000 },
        includedPrimaryTypes: ['restaurant', 'cafe', 'hamburger_restaurant', 'pizza_restaurant'],
        maxResultCount: 6,
        rankPreference: 'POPULARITY',
        language: 'sv',
        region: 'se',
      })
      // Cirkeln kan gå över vatten: en paus vid Helsingborg fick annars
      // namn och matställen från Helsingør. Ortnamnet tas från det närmaste
      // stället, och bara ställen i samma land som det visas.
      const avstand = (pl) => Math.hypot(pl.location.lat() - p.lat, (pl.location.lng() - p.lng) * Math.cos((p.lat * Math.PI) / 180))
      const land = (pl) => (pl.formattedAddress || '').split(',').pop().trim()
      const narmast = [...(places || [])].filter((pl) => pl.location).sort((a, b) => avstand(a) - avstand(b))[0]
      // Två McDonald's i listan säger ingenting, så varje namn visas en gång.
      const iLandet = (places || [])
        .filter((pl) => !narmast || land(pl) === land(narmast))
        .filter((pl, i, alla) => alla.findIndex((q) => q.displayName === pl.displayName) === i)
        .slice(0, 3)
      return {
        ...p,
        ort: ortUrAdress(narmast?.formattedAddress),
        platser: iLandet.map((pl) => ({
          namn: pl.displayName,
          typ: pl.primaryTypeDisplayName || null,
          lank: pl.googleMapsURI ? String(pl.googleMapsURI) : null,
          ...punkt(pl.location),
        })),
      }
    } catch {
      return { ...p, platser: [] }
    }
  }))
  return svar
}

/** "Storgatan 1, 792 30 Mora, Sverige" -> "Mora" */
function ortUrAdress(adress) {
  if (!adress) return null
  const delar = adress.split(',').map((d) => d.trim())
  const medPostnummer = delar.find((d) => /\d{3}\s?\d{2}\s+\D/.test(d) || /^\d{4}\s+\D/.test(d))
  const ort = medPostnummer ? medPostnummer.replace(/^[\d\s]+/, '') : delar[delar.length - 2] || null
  // Tyska rastplatser kan heta "Wittstock/Dosse-AH" (Autohof).
  return ort ? ort.replace(/-AH$/, '') : null
}
