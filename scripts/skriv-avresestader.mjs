// Skriver lib/avresestader.js ur mätningen och gör en rimlighetskontroll.
import fs from 'node:fs'
import path from 'node:path'

const [dir, ut] = process.argv.slice(2)
const { stader, bil } = JSON.parse(fs.readFileSync(path.join(dir, 'avresestader.json'), 'utf8'))

console.log('--- koordinaten matchad mot ett annat namn i Wikidata:')
stader.filter((s) => s.wikidataNamn !== s.namn).forEach((s) => console.log(`  ${s.namn} ← ${s.wikidataNamn} (${s.lat}, ${s.lon})`))

console.log('--- stickprov:')
for (const [stad, ort] of [['visby', 'salen'], ['kiruna', 'riksgransen'], ['lulea', 'levi'], ['umea', 'hemavan'], ['ostersund', 'are'], ['karlstad', 'trysil'], ['helsingborg', 'kitzbuehel']]) {
  const v = bil[stad]?.[ort]
  console.log(`  ${stad} → ${ort}: ${v ? `${v[0]} km, ${(v[1] / 60).toFixed(1)} tim` : 'saknas'}`)
}

const rader = stader.map((s) => `  { rang: ${s.rang}, nyckel: '${s.nyckel}', namn: '${s.namn}', scbKod: '${s.scbKod}', bef: ${s.bef}, lat: ${s.lat}, lon: ${s.lon} },`)
const bilrader = stader.map((s) => `  '${s.nyckel}': { ${Object.entries(bil[s.nyckel]).map(([o, v]) => `'${o}': [${v[0]}, ${v[1]}]`).join(', ')} },`)

const fil = `/**
 * Restid med bil från Sveriges 100 största tätorter.
 *
 * Startsidan låter besökaren välja staden hen åker från. Tre städer räcker
 * inte för det: från Umeå, Sundsvall eller Karlstad ser närmaste skidort
 * helt annorlunda ut än från Stockholm.
 *
 * ── STÄDERNA ──────────────────────────────────────────────────────────
 *
 * De 100 största tätorterna efter folkmängd 2023, ur SCB:s tabell
 * LandarealTatortN (MI0810A). Namnen är SCB:s, därför heter en del
 * "Sundsvall och Timrå" och "Upplands Väsby och Sollentuna": SCB slog ihop
 * tätorter som vuxit samman i 2023 års avgränsning.
 *
 * Koordinaten är tätortens punkt i Wikidata, matchad på folkmängden, som där
 * är SCB:s 2023-tal. Stockholm, Göteborg och Malmö behåller koordinaten i
 * lib/restider.js, så att talen blir desamma överallt på sajten.
 *
 * ── RESTIDEN ──────────────────────────────────────────────────────────
 *
 * Samma metod som lib/restider.js: OSRM mot OpenStreetMaps vägnät, från
 * tätortens punkt till ortens koordinat i databasen. Mätt ${new Date().toISOString().slice(0, 10)}.
 * Före användning jämfördes de 90 sträckor som redan fanns lagrade, och alla
 * stämde på kilometern och minuten. Körtid utan trafik, raster och
 * vinterväglag. Från Visby ingår färjan i OSRM:s beräkning.
 *
 * Genereras av ett skript; ändras inte för hand.
 */

export const AVRESESTADER_HAMTAD = '${new Date().toISOString().slice(0, 10)}'

export const AVRESESTADER = [
${rader.join('\n')}
]

/** stadens nyckel -> ortens slug -> [kilometer, minuter]. */
export const BIL_AVRESA = {
${bilrader.join('\n')}
}
`
fs.writeFileSync(ut, fil)
console.log('skrivet:', ut, Math.round(fil.length / 1024), 'kB')
