// Tester för reseplanerarens logik som inte behöver Google: pauser och
// nätter på bilresan, valet mellan bara tåg och tåg med buss, och kostnaden.
// Kör: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { bilMedPauser, planeraTag, BILVAL } from '../app/resa/planera.js'
import { kostnad } from '../lib/resa/kostnad.js'
import { svenskTid } from '../lib/resa/resvag.js'
import { giltigtDatum, rimligt, medResenarer, kanTas, snabbastSatt } from '../lib/resa/val.js'

const MIN = 60000
// En rak väg söderut med en punkt per minut, så att pauserna hamnar jämnt.
function bilvag(min, startMs = svenskTid('2027-02-20', '07:00')) {
  const path = Array.from({ length: min + 1 }, (_, i) => ({ lat: 59 - i * 0.01, lng: 15 }))
  return { typ: 'bil', start: startMs, slut: startMs + min * MIN, min, km: min * 1.3, path, fran: { namn: 'Hemma' }, till: { namn: 'Orten' } }
}
const natter = (r) => r.pauser.filter((p) => p.natt).length

test('kort bilresa får inga pauser', () => {
  const r = bilMedPauser(bilvag(120))
  assert.equal(r.pauser.length, 0)
  assert.equal(r.min, 120)
})

test('pauserna läggs var 2,5 timme och skjuter ankomsten', () => {
  const r = bilMedPauser(bilvag(600))
  assert.deepEqual(r.pauser.map((p) => p.efterMin), [150, 300, 450])
  assert.equal(natter(r), 0)
  assert.equal(r.min, 600 + r.pausMin)
})

test('lunch mellan 11 och 14 blir längre än en kort paus', () => {
  const r = bilMedPauser(bilvag(600))
  const lunch = r.pauser.find((p) => p.efterMin === 300) // 12.00 plus pausen före
  assert.equal(lunch.langdMin, 45)
  assert.equal(r.pauser[0].langdMin, 20)
})

test('lång bilresa delas i lika långa dagar med en natt', () => {
  const r = bilMedPauser(bilvag(1200))
  assert.equal(natter(r), 1)
  const natt = r.pauser.find((p) => p.natt)
  assert.ok(Math.abs(natt.efterMin - 600) <= 150, `natten efter ${natt.efterMin} min`)
})

test('"hela vägen" ger ingen natt under 16 timmar', () => {
  const r = bilMedPauser(bilvag(900), { ...BILVAL, maxDag: 0 })
  assert.equal(natter(r), 0)
})

test('"hela vägen" över 16 timmar lägger in en natt ändå', () => {
  const r = bilMedPauser(bilvag(1200), { ...BILVAL, maxDag: 0 })
  assert.ok(natter(r) >= 1)
})

test('eget stopp ersätter automatiska pauser nära det', () => {
  const e = { ...bilvag(600), viaMin: 310 }
  const r = bilMedPauser(e, { ...BILVAL, egetStopp: { namn: 'Gekås', lat: 57, lng: 12, min: 120 } })
  const egna = r.pauser.filter((p) => p.egen)
  assert.equal(egna.length, 1)
  assert.equal(egna[0].langdMin, 120)
  assert.ok(!r.pauser.some((p) => !p.egen && Math.abs(p.efterMin - 310) <= 45))
})

test('eget stopp med övernattning räknas inte som hotellnatt i kostnaden', () => {
  const e = { ...bilvag(600), viaMin: 300 }
  const r = bilMedPauser(e, { ...BILVAL, egetStopp: { namn: 'Mormor', lat: 57, lng: 12, min: 0 } })
  assert.equal(natter(r), 1)
  const k = kostnad(r, { vuxna: 2 }, {}, null)
  assert.ok(!k.ovrigt.some((t) => /hotell/.test(t)))
})

// En låtsas-Google som svarar med ett åk: tåg när bara spår är tillåtet,
// annars det som skickas in.
function fakeLib({ spar, alla }) {
  const svar = (aker) => aker && {
    routes: [{ legs: [{ steps: aker.map(([typ, fran, till]) => ({
      path: [{ lat: 59, lng: 18 }, { lat: 47, lng: 11 }],
      transitDetails: {
        departureStop: { name: 'A' }, arrivalStop: { name: 'B' },
        departureTime: new Date(fran), arrivalTime: new Date(till),
        transitLine: { shortName: typ, vehicle: { vehicleType: typ === 'buss' ? 'BUS' : 'HEAVY_RAIL' }, agencies: [{ name: typ === 'buss' ? 'FlixBus' : 'SJ' }] },
      },
    })) }] }],
  }
  return { routes: { Route: { computeRoutes: async (q) => svar(q.transitPreference ? spar : alla) || { routes: [] } } } }
}
const kl = (t, d = '2027-02-20') => svenskTid(d, t)
const hem = { lat: 59.3, lng: 18, namn: 'Hemma' }
const mal = { lat: 47.2, lng: 11.8, namn: 'Orten' }

test('tåget väljs framför buss när det är framme inom tre timmar', async () => {
  const lib = fakeLib({ spar: [['tag', kl('07:00'), kl('20:00')]], alla: [['buss', kl('07:00'), kl('18:00')]] })
  const r = await planeraTag(lib, hem, mal, kl('07:00'))
  assert.equal(r.baraSpar, true)
  assert.equal(r.langBuss, null)
})

test('bussen väljs när tåget är mer än tre timmar senare, och sägs ut', async () => {
  const lib = fakeLib({ spar: [['tag', kl('07:00'), kl('23:30')]], alla: [['buss', kl('07:00'), kl('18:00')]] })
  const r = await planeraTag(lib, hem, mal, kl('07:00'))
  assert.equal(r.baraSpar, false)
  assert.ok(r.langBuss?.min >= 90)
})

test('ett tåg nästa dag väljs inte när bussen går rätt dag', async () => {
  const lib = fakeLib({ spar: [['tag', kl('07:00', '2027-02-21'), kl('15:00', '2027-02-21')]], alla: [['buss', kl('09:00'), kl('20:00')]] })
  const r = await planeraTag(lib, hem, mal, kl('07:00'))
  assert.equal(r.baraSpar, false)
})

test('ingen resa alls ger ett tydligt besked', async () => {
  const r = await planeraTag(fakeLib({}), hem, mal, kl('07:00'))
  assert.match(r.saknas, /ingen resa/)
})

test('bränslet räknas på sträcka, förbrukning och literpris', () => {
  const r = bilMedPauser(bilvag(120))
  const k = kostnad(r, { vuxna: 2 }, { forbrukning: 0.5, literpris: 20 }, null)
  const b = k.rader.find((x) => x.namn === 'Bränsle')
  assert.equal(Math.round(b.kr), Math.round((r.km / 10) * 0.5 * 20))
})

test('flygresan tar upp parkeringen vid flygplatsen hemma', () => {
  const t = kl('07:00')
  const resa = {
    satt: 'flyg', hemat: false, flyget: { pris: 1000, bolagKod: 'DY' }, vidare: { valt: 'taxi' },
    etapper: [{ typ: 'bil', start: t, slut: t + 40 * MIN }, { typ: 'flyg', start: t + 2 * 3600000, slut: t + 4 * 3600000 }, { typ: 'transfer', start: t + 5 * 3600000, slut: t + 6 * 3600000 }],
  }
  const k = kostnad(resa, { vuxna: 2 }, {}, null)
  assert.ok(k.ovrigt.includes('parkeringen vid flygplatsen hemma, för hela resan'))
  // Parkeringen räknas en gång, inte igen på hemresan.
  const hemat = { ...resa, hemat: true, etapper: [...resa.etapper].reverse().map((e, i) => ({ ...e, typ: ['transfer', 'flyg', 'bil'][i] })) }
  assert.deepEqual(kostnad(hemat, { vuxna: 2 }, {}, null).ovrigt.filter((t) => /parkering/.test(t)), ['parkeringen vid flygplatsen hemma (räknad på resan dit)'])
  assert.equal(k.rader.find((x) => /^Flyget/.test(x.namn)).kr, 2000)
})

test('datum: bara riktiga datum med rimligt år', () => {
  assert.equal(giltigtDatum('2027-02-20'), true)
  assert.equal(giltigtDatum('2028-02-29'), true)
  assert.equal(giltigtDatum('2027-02-29'), false)
  assert.equal(giltigtDatum('2027-02-30'), false)
  assert.equal(giltigtDatum('0002-02-20'), false) // mitt i årtalet
  assert.equal(giltigtDatum('0202-02-20'), false)
  assert.equal(giltigtDatum('2019-12-31'), false)
  assert.equal(giltigtDatum('2101-01-01'), false)
  assert.equal(giltigtDatum(''), false)
  assert.equal(giltigtDatum(null), false)
})

test('tal: komma och punkt, inom gränserna', () => {
  assert.equal(rimligt('0,7', 0.2, 3), 0.7)
  assert.equal(rimligt('0.5', 0.2, 3), 0.5)
  assert.equal(rimligt('0', 0.2, 3), null)
  assert.equal(rimligt('0,', 0.2, 3), null)
  assert.equal(rimligt('', 0.2, 3), null)
  assert.equal(rimligt('12', 0.2, 3), null)
  assert.equal(rimligt('abc', 5, 50), null)
})

test('Aviasales-länken får rätt antal vuxna', () => {
  assert.equal(medResenarer('https://www.aviasales.com/search/ARN2002INN1', 4), 'https://www.aviasales.com/search/ARN2002INN4')
  assert.equal(medResenarer('https://www.aviasales.com/search/ARN2002INN27021', 3), 'https://www.aviasales.com/search/ARN2002INN27023')
  assert.equal(medResenarer('https://www.aviasales.com/search/ARN2002INN1', 1), 'https://www.aviasales.com/search/ARN2002INN1')
  assert.equal(medResenarer('https://www.aviasales.com/search/ARN2002INN1', 12), 'https://www.aviasales.com/search/ARN2002INN9')
  // Travelpayouts länkar har en frågesträng; bara sökvägen ändras.
  assert.equal(
    medResenarer('https://www.aviasales.com/search/ARN2002INN1?t=DY17012345671&expected_price=1451', 2),
    'https://www.aviasales.com/search/ARN2002INN2?t=DY17012345671&expected_price=1451',
  )
  // Okänd form lämnas orörd.
  assert.equal(medResenarer('https://www.aviasales.com/?origin=ARN', 2), 'https://www.aviasales.com/?origin=ARN')
  assert.equal(medResenarer(null, 2), null)
})

test('Först framme bara bland resor man hinner', () => {
  const SATT = ['bil', 'tag', 'flyg']
  const resor = { bil: { slut: 300 }, tag: { slut: 200 }, flyg: { slut: 100, tidigare: true } }
  assert.equal(snabbastSatt(resor, SATT), 'tag')
  assert.equal(kanTas(resor.flyg), false)
  assert.equal(snabbastSatt({ ...resor, tag: { slut: 50, flyget: { narliggande: true } } }, SATT), 'bil')
  // Går inget att hinna väljs ändå den snabbaste, men den får inget märke.
  assert.equal(snabbastSatt({ bil: { saknas: 'x' }, tag: { saknas: 'x' }, flyg: { slut: 1, tidigare: true } }, SATT), 'flyg')
  assert.equal(snabbastSatt({ bil: { saknas: 'x' }, tag: undefined, flyg: { saknas: 'x' } }, SATT), null)
})

test('nästa lördag räknas på svenskt datum, även strax efter midnatt', async () => {
  const { nastaLordag } = await import('../lib/resa/resvag.js')
  // Torsdag 26 nov 00:40 i Sverige = onsdag 23:40 UTC
  assert.equal(nastaLordag(new Date('2026-11-25T23:40:00Z')), '2026-11-28')
  assert.equal(nastaLordag(new Date('2026-11-28T10:00:00Z')), '2026-12-05')
})
