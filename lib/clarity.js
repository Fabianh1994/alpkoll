// Microsoft Clarity: värmekartor och inspelningar av hur besökare klickar
// och scrollar.
//
// Clarity sätter kakor (_clck i ett år, _clsk i ett dygn, plus Microsofts
// egna på clarity.ms) och kräver därför samtycke enligt lagen om
// elektronisk kommunikation. Skriptet laddas först när besökaren tryckt
// Godkänn i kakrutan — se app/Kakruta.js. Allt annat på sajten fungerar
// utan kakor, som förut.
//
// CLARITY_ID är huvudbrytaren, på samma sätt som SPARNING i lib/booking.js.
// Står den på null visas ingen kakruta, ingen länk till kakinställningarna
// och inget Clarity-stycke i integritetspolicyn: finns inget att samtycka
// till ska ingen heller tillfrågas. ID:t är inte hemligt, det syns i
// sidkoden på varje sajt som använder Clarity.
export const CLARITY_ID = 'zhrzfjqo63'

export const anvanderClarity = Boolean(CLARITY_ID)

// Höj versionen när policyn ändras så mycket att ett tidigare ja inte
// längre täcker det som sker. Alla tillfrågas då på nytt.
export const SAMTYCKE_VERSION = 1

// Ett ja eller nej gäller i tolv månader, sedan frågar rutan igen.
export const SAMTYCKE_GILTIGT_MS = 365 * 24 * 60 * 60 * 1000

export const SAMTYCKE_NYCKEL = 'alpkoll-samtycke'

// Händelsen som sidfotens länk skickar för att öppna rutan igen.
export const OPPNA_KAKRUTAN = 'alpkoll:kakinstallningar'
