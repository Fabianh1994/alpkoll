// Travelpayouts Drive: skriptet som verifierar Alpkoll som projekt hos
// Travelpayouts och ger rapporten Content Analytics där.
//
// Drive följer besökaren och kan sätta kakor, så det laddas först efter ett
// ja i kakrutan, precis som Clarity (app/Kakruta.js). Det kan också ändra
// sidan: byta ut länkar, länka ord, lägga in rutor och öppna erbjudanden i
// en flik. Alla de funktionerna ska vara AVSTÄNGDA under Drive → Advanced
// settings hos Travelpayouts. Sajtens partnerlänkar går genom
// app/Partnerlank.js och ska inte röras av något skript.
//
// Adressen sätts i Vercel som NEXT_PUBLIC_TRAVELPAYOUTS_DRIVE, till exempel
// https://tp-em.com/NDExMjM0.js. Står den tom laddas ingenting, kakrutan
// och integritetspolicyn ser ut som förut och ingen tillfrågas på nytt.
// Adressen är inte hemlig, den syns i sidkoden på varje sajt med Drive.
// NEXT_PUBLIC_ läses när sajten byggs: efter att variabeln satts eller
// ändrats i Vercel måste sajten byggas om (Redeploy) innan den gäller.
const adress = (process.env.NEXT_PUBLIC_TRAVELPAYOUTS_DRIVE || '').trim()

// Bara Travelpayouts egen skriptvärd godtas, så att en felinklistrad
// adress inte laddar något annat.
export const DRIVE_SKRIPT = /^https:\/\/tp-em\.com\/[A-Za-z0-9_=-]+\.js$/.test(adress) ? adress : null

export const anvanderDrive = Boolean(DRIVE_SKRIPT)
