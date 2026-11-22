// /llms.txt — en kort sammanfattning av sajten för AI-tjänster.
//
// Formatet kommer från llmstxt.org: en rubrik, en sammanfattning i ett
// citatblock och sedan listor med länkar till de sidor som bäst förklarar
// sajten. ChatGPT, Claude, Perplexity och liknande kan läsa filen i stället
// för att gissa sig fram genom menyn. Lighthouse letar efter den under
// "Agentisk webbläsning".
//
// Orterna hämtas ur databasen via lib/resorts.js, samma urval som
// sitemapen, så en ny eller dold ort syns här utan att filen skrivs om.
// Jämförelseparen (/jamfor/<par>) listas inte: de flesta är noindex, och
// filen ska bara peka på sidor vi vill att någon hittar.
//
// Inga tal i texten, av samma skäl som i docs/copy.md: de blir gamla
// utan att någon märker det. Antalet orter räknas fram.
import { getResorts } from '../../lib/resorts'
import { SITE_URL } from '../../lib/lang'
import { land } from '../../lib/countries'
import { LANDSIDOR } from '../../lib/landsidor'

export const revalidate = 3600

const lank = (titel, path, text) =>
  `- [${titel}](${SITE_URL}${path})${text ? `: ${text}` : ''}`

export async function GET() {
  const orter = await getResorts()

  // Grupperat per land, länderna i svensk bokstavsordning.
  const perLand = new Map()
  for (const o of orter) {
    const namn = land(o.country) || 'Övriga'
    if (!perLand.has(namn)) perLand.set(namn, [])
    perLand.get(namn).push(o)
  }
  const lander = [...perLand.keys()].sort((a, b) => a.localeCompare(b, 'sv'))

  const text = `# Alpkoll

> Alpkoll är en svensk, oberoende jämförelsesajt för skidorter i Sverige, Norge, Finland, Alperna och Andorra. Sajten jämför ${orter.length} orter på storlek, fallhöjd, snösäkerhet, liftkortspris i kronor och resan dit från Sverige. Allt innehåll är på svenska.

Så fungerar siffrorna:

- Pistkilometer, liftar och höjder kommer från samma källa för alla orter (skiresort.com), så att orterna går att jämföra med varandra. Orternas egen marknadsföring anger ofta högre tal.
- Siffrorna gäller hela det sammankopplade skidområdet. Tre orter i samma område kan därför visa samma tal.
- Liftkortspriset är sexdagarspriset för en vuxen, högsäsong, hämtat ur varje orts egen prislista och omräknat till kronor.
- Ingen ort kan betala för sin placering. Länkar till boende är märkta "Annons".
- Nackdelar skrivs ut. Sajten säger när en ort är dyr, trång eller beroende av konstsnö.

## Jämförelser och guider

${[
  lank('Alla skidorter', '/', 'startsidan, med filter per land och sökning'),
  lank('Jämför två skidorter', '/jamfor', 'ställ två orter mot varandra på storlek, liftkortspris, fallhöjd och resväg'),
  lank('Liftkortspriser', '/liftkortspriser', 'sexdagarspriset för alla orter i kronor, sorterbart'),
  lank('Liftkortsindex', '/liftkortsindex', 'samma priser som rapport: Sverige mot Alperna, och pris per kilometer pist'),
  lank('Fallhöjd i skidorterna', '/fallhojd', 'fallhöjd och höjd över havet för alla orter, sorterbart, med Sälens och de andra delade orternas områden var för sig'),
  lank('Åre eller Alperna?', '/are-eller-alperna', 'vad som skiljer Åre från en alport'),
  lank('Sälen eller Alperna?', '/salen-eller-alperna', 'vad som skiljer Sälen från en alport'),
  lank('Tåg till Alperna', '/nattaget-till-alperna', 'nattåget från Malmö till Österrike: avgångar, stationer och vilka orter det når'),
  lank('Tåg till fjällen', '/tag-till-fjallen', 'vilka svenska skidorter du når med tåg, med eller utan transferbuss, och tiderna'),
  lank('Sportlov', '/sportlov', 'vilken vecka sportlovet är i varje kommun, och vilken fredag nattåget går'),
  lank('Påsklov', '/pasklov', 'vilken vecka påsklovet är i 35 kommuner, och vilka skidorter som har säkrast snö i slutet av mars'),
  lank('Var ska man bo i Sälen?', '/var-bo-i-salen', 'Sälens sex områden jämförda'),
  lank('Bästa skidorterna för barnfamiljer', '/skidorter-for-barnfamiljer', 'topplista för Sverige, Norden och Alperna, med motivering och nackdel för varje ort'),
].join('\n')}

## Skidorter per land

${LANDSIDOR.map((l) => lank(`Skidorter ${l.i}`, `/skidorter/${l.slug}`)).join('\n')}

## Alla orter

${lander
  .map(
    (namn) =>
      `### ${namn}\n\n` +
      perLand
        .get(namn)
        .map((o) => lank(o.name, `/resort/${o.slug}`))
        .join('\n')
  )
  .join('\n\n')}

## Om sajten

${[
  lank('Så jämför vi', '/sa-jamfor-vi', 'vad som avgör ordningen, var siffrorna kommer ifrån och hur poängen sätts'),
  lank('Om Alpkoll', '/about'),
].join('\n')}

## Optional

${[
  lank('Annonser och partnerlänkar', '/affiliate-disclosure'),
  lank('Integritetspolicy', '/privacy'),
  lank('Villkor', '/terms'),
].join('\n')}
`

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
