// Skickar alla adresser i sitemapen till IndexNow, så att Bing (och därmed
// ChatGPT:s sökning), Yandex, Seznam och Naver hämtar ändrade sidor inom
// minuter i stället för veckor. Google använder inte IndexNow.
//
// Körs av .github/workflows/indexnow.yml efter varje lyckad
// produktionsdeploy på Vercel, eller för hand: node scripts/indexnow.mjs
//
// Nyckeln är inte hemlig. Den ligger öppet i public/<nyckel>.txt, och det
// är filen som bevisar för IndexNow att vi äger alpkoll.se.

const SAJT = 'https://alpkoll.se'
const NYCKEL = '05c321e835623d6e64e78c3be16d0d19'

const xml = await (await fetch(`${SAJT}/sitemap.xml`)).text()
const adresser = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
if (adresser.length === 0) throw new Error('Sitemapen gav inga adresser')

const svar = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: 'alpkoll.se',
    key: NYCKEL,
    keyLocation: `${SAJT}/${NYCKEL}.txt`,
    urlList: adresser.slice(0, 10000),
  }),
})

console.log(`IndexNow: ${adresser.length} adresser, svar ${svar.status}`)
// 200 och 202 är båda godkänt. 403 betyder att nyckelfilen inte nås än.
if (![200, 202].includes(svar.status)) process.exit(1)
