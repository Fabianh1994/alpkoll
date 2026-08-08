// ── Språk och domän ──────────────────────────────────────────────
//
// Sajten körs tills vidare enbart på svenska via alpkoll.se.
// alpkoll.com redirectas hit i next.config.mjs.
//
// Engelskan är inte borttagen — dictionaries/en.json, LangContext och
// useDictionary ligger kvar orörda. För att slå på den igen:
//   1. ta bort redirect-blocket i next.config.mjs
//   2. låt getLang() läsa host igen (se DOMAIN_LANG nedan)

export const SITE_LANG = 'sv'
export const SITE_URL = 'https://alpkoll.se'

/**
 * Språk för aktuell request.
 *
 * Just nu alltid svenska — därför behöver varken layout eller sidor
 * läsa request-headers för att avgöra språk.
 *
 * Tvåspråkigt läge såg ut så här och är det som ska tillbaka:
 *   const host = (await headers()).get('host') || ''
 *   return host.includes('alpkoll.se') ? 'sv' : 'en'
 */
export function getLang() {
  return SITE_LANG
}
