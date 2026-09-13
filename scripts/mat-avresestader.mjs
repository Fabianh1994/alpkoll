// Mäter bilresan från Sveriges 100 största tätorter (SCB 2023) till alla
// publicerade skidorter, med samma OSRM som lib/restider.js.
//
// node mat-avresestader.mjs <scratchpad>
import fs from 'node:fs'
import path from 'node:path'

const dir = process.argv[2]
const las = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8').replace(/^﻿/, ''))

const scb = las('tatorter_scb_2023.json').slice(0, 100)
const wd = las('tatorter_wikidata.json')
const orter = las('orter_koord.json')
const { STADER, BIL } = await import('file:///' + path.join(dir, 'restider.mjs').replace(/\\/g, '/'))

const slug = (s) => s.toLowerCase()
  .replace(/[åä]/g, 'a').replace(/ö/g, 'o').replace(/é/g, 'e')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Koordinaten matchas på befolkningstalet, som i Wikidata är SCB:s 2023-tal.
// Namnet används bara om talet saknas eller ger flera träffar.
const saknas = []
const stader = scb.map((t, i) => {
  const perTal = wd.filter((w) => w.bef === t.bef && w.datum === '2023-12-31')
  let traff = perTal.length === 1 ? perTal[0] : null
  if (!traff) traff = wd.find((w) => w.namn === t.namn || t.namn.startsWith(w.namn + ' och')) || null
  if (!traff) saknas.push(t.namn)
  const m = traff?.koord.match(/Point\(([-\d.]+) ([-\d.]+)\)/)
  let lon = m ? Number(m[1]) : null
  let lat = m ? Number(m[2]) : null
  // De tre städer sajten redan mätt behåller sin koordinat, så att talen
  // blir desamma som i lib/restider.js.
  const redan = STADER.find((s) => s.namn === t.namn)
  if (redan) { lat = redan.lat; lon = redan.lon }
  return { rang: i + 1, namn: t.namn, nyckel: slug(t.namn), scbKod: t.kod, bef: t.bef, lat, lon, wikidataNamn: traff?.namn ?? null }
})

if (saknas.length) {
  console.log('SAKNAR KOORDINAT:', saknas.join(', '))
  process.exit(1)
}
const dubbletter = stader.map((s) => s.nyckel).filter((n, i, a) => a.indexOf(n) !== i)
if (dubbletter.length) { console.log('DUBBLETTNYCKLAR:', dubbletter); process.exit(1) }

const vila = (ms) => new Promise((r) => setTimeout(r, ms))
const bil = {}
const BATCH = 10
for (let i = 0; i < stader.length; i += BATCH) {
  const kallor = stader.slice(i, i + BATCH)
  const koord = [...kallor.map((s) => `${s.lon},${s.lat}`), ...orter.map((o) => `${o.longitude},${o.latitude}`)]
  const src = kallor.map((_, j) => j).join(';')
  const dst = orter.map((_, j) => j + kallor.length).join(';')
  const url = `https://router.project-osrm.org/table/v1/driving/${koord.join(';')}?sources=${src}&destinations=${dst}&annotations=duration,distance`
  const svar = await fetch(url, { headers: { 'User-Agent': 'Alpkoll-restider/1.0 (https://alpkoll.se)' } })
  const data = await svar.json()
  if (data.code !== 'Ok') { console.log('OSRM FEL', svar.status, data.code, data.message); process.exit(1) }
  kallor.forEach((s, j) => {
    bil[s.nyckel] = {}
    orter.forEach((o, k) => {
      const d = data.distances[j][k]
      const t = data.durations[j][k]
      bil[s.nyckel][o.slug] = d == null || t == null ? null : [Math.round(d / 1000), Math.round(t / 60)]
    })
  })
  process.stdout.write(`${Math.min(i + BATCH, stader.length)} `)
  await vila(1200)
}
console.log()

// Kontroll mot de lagrade sträckorna.
let avvikelser = 0
let jamforda = 0
for (const s of STADER) {
  const nyckel = slug(s.namn)
  for (const o of orter) {
    const lagrad = BIL[o.slug]?.[s.nyckel]
    const ny = bil[nyckel]?.[o.slug]
    if (!lagrad) continue
    jamforda++
    if (!ny || Math.abs(ny[0] - lagrad[0]) > 1 || Math.abs(ny[1] - lagrad[1]) > 1) {
      avvikelser++
      console.log('AVVIKER', s.namn, o.slug, 'lagrad', lagrad, 'ny', ny)
    }
  }
}
console.log(`kontroll: ${jamforda} lagrade sträckor, ${avvikelser} avviker med mer än 1 km eller 1 min`)

const tomma = Object.entries(bil).flatMap(([n, r]) => Object.entries(r).filter(([, v]) => !v).map(([o]) => `${n}→${o}`))
console.log('sträckor utan rutt:', tomma.length ? tomma.join(', ') : 'inga')

fs.writeFileSync(path.join(dir, 'avresestader.json'), JSON.stringify({ stader, bil }, null, 0))
console.log('skrivet: avresestader.json,', stader.length, 'städer ×', orter.length, 'orter')
