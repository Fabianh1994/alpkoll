// Vad en vecka kostar.
//
// Ortsidan räknade tidigare fram kostnaden som veckokortet plus 400 till
// 900 euro. Samma påslag för Sälen som för Zermatt, oavsett om man kör
// dit eller flyger. Formeln träffade det researchade est_weekly_cost_eur
// för två av 32 orter och låg systematiskt lågt — Courchevel visade
// 750–1 250 € där fältet säger 2 000 €.
//
// est_weekly_cost_eur är ifyllt för samtliga 32 publicerade orter och
// spänner 900–2 600 €. Det är fortfarande en uppskattning, men en per ort
// i stället för en formel, och texten säger att det är en uppskattning.
//
// price_tier används inte och ska inte användas: klasserna överlappar —
// klass 1 spänner 900–1 550 € och klass 3 spänner 1 300–2 600 € — och gav
// Cortina d'Ampezzo etiketten Budget medan billigare Hemavan fick Premium.

// Hårt mellanslag. Skrivet med fromCharCode i stället för tecknet själv,
// eftersom ett U+00A0 i källkoden inte går att skilja från ett vanligt
// mellanslag när man läser filen.
const HART = String.fromCharCode(0xa0)

/**
 * 1400 -> "1 400 €", med hårda mellanslag både i tusentalet och före
 * valutan. Utan dem kan beloppet brytas mitt i talet, eller lämna
 * euro-tecknet ensamt på nästa rad i ett smalt kort.
 *
 * Grupperingen görs för hand i stället för med toLocaleString: samma tal
 * ska se likadant ut oavsett vilken ICU-data servern och webbläsaren har.
 */
export function euro(belopp) {
  if (!Number.isFinite(belopp) || belopp <= 0) return null
  const grupperat = String(Math.round(belopp)).replace(/\B(?=(\d{3})+(?!\d))/g, HART)
  return `${grupperat}${HART}€`
}

/** "ca 1 400 €", eller null när kostnaden saknas för orten. */
export function veckokostnad(resort) {
  const text = euro(resort?.est_weekly_cost_eur)
  return text ? `ca ${text}` : null
}
