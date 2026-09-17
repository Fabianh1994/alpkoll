// Landsflaggor som ritad SVG.
//
// Etiketten på ortkorten bar förut flaggemojin — 🇳🇴 och 🇫🇷 är inte
// flaggtecken utan par av regionsbokstäver, som typsnittet förväntas slå
// ihop till en flagga. Segoe UI Emoji, som Windows använder, har inga
// flaggsymboler alls. Därför visade Chrome på Windows bokstavsparet: "NO
// Norge", "FR Frankrike". På Mac och iPhone blev samma tecken en flagga.
// Etiketten såg alltså olika ut beroende på vad besökaren satt vid, och på
// den vanligaste av dem såg den ut som ett fel.
//
// Ritade flaggor ser likadana ut överallt, kostar ingen nätverksbegäran och
// väcker ingen licensfråga — nationsflaggor är inte upphovsrättsskyddade.
//
// Flaggorna är dekor. Landets namn står i klartext bredvid, så svg:n är
// aria-hidden och läses inte upp två gånger.

// Vapen och sigill utelämnas. Andorras flagga har ett riksvapen mitt i,
// Spaniens likaså; vid nio bildpunkters höjd är de ändå inte urskiljbara,
// och en otydlig klump är sämre än en ren trikolor.
const FLAGGOR = {
  France: { b: 16, ritning: (
    <>
      <rect width="5.333" height="11" fill="#002654" />
      <rect x="5.333" width="5.334" height="11" fill="#fff" />
      <rect x="10.667" width="5.333" height="11" fill="#ED2939" />
    </>
  ) },
  Italy: { b: 16, ritning: (
    <>
      <rect width="5.333" height="11" fill="#008C45" />
      <rect x="5.333" width="5.334" height="11" fill="#F4F5F0" />
      <rect x="10.667" width="5.333" height="11" fill="#CD212A" />
    </>
  ) },
  Andorra: { b: 16, ritning: (
    <>
      <rect width="5.333" height="11" fill="#10069F" />
      <rect x="5.333" width="5.334" height="11" fill="#FEDD00" />
      <rect x="10.667" width="5.333" height="11" fill="#D50032" />
    </>
  ) },
  Austria: { b: 16, ritning: (
    <>
      <rect width="16" height="11" fill="#ED2939" />
      <rect y="3.667" width="16" height="3.666" fill="#fff" />
    </>
  ) },
  Bulgaria: { b: 16, ritning: (
    <>
      <rect width="16" height="11" fill="#fff" />
      <rect y="3.667" width="16" height="3.666" fill="#00966E" />
      <rect y="7.333" width="16" height="3.667" fill="#D62612" />
    </>
  ) },
  Spain: { b: 16, ritning: (
    <>
      <rect width="16" height="11" fill="#AA151B" />
      <rect y="2.75" width="16" height="5.5" fill="#F1BF00" />
    </>
  ) },
  Japan: { b: 16, ritning: (
    <>
      <rect width="16" height="11" fill="#fff" />
      <circle cx="8" cy="5.5" r="3.3" fill="#BC002D" />
    </>
  ) },
  // Nordiska korset: den lodräta armen sitter till vänster om mitten.
  Sweden: { b: 16, ritning: (
    <>
      <rect width="16" height="11" fill="#006AA7" />
      <rect y="4.5" width="16" height="2" fill="#FECC00" />
      <rect x="5" width="2" height="11" fill="#FECC00" />
    </>
  ) },
  Finland: { b: 16, ritning: (
    <>
      <rect width="16" height="11" fill="#fff" />
      <rect y="4.5" width="16" height="2" fill="#003580" />
      <rect x="5" width="2" height="11" fill="#003580" />
    </>
  ) },
  Norway: { b: 16, ritning: (
    <>
      <rect width="16" height="11" fill="#BA0C2F" />
      <rect y="4" width="16" height="3" fill="#fff" />
      <rect x="4.5" width="3" height="11" fill="#fff" />
      <rect y="4.75" width="16" height="1.5" fill="#00205B" />
      <rect x="5.25" width="1.5" height="11" fill="#00205B" />
    </>
  ) },
  // Schweiz flagga är kvadratisk, inte avlång. Den ritas som en kvadrat
  // och blir därmed smalare än de andra i etiketten. Det är rätt.
  Switzerland: { b: 11, ritning: (
    <>
      <rect width="11" height="11" fill="#D52B1E" />
      <rect x="2.2" y="4.4" width="6.6" height="2.2" fill="#fff" />
      <rect x="4.4" y="2.2" width="2.2" height="6.6" fill="#fff" />
    </>
  ) },
}

/** Finns det en ritad flagga för landet? Kanada, USA och Nya Zeeland saknas
 *  — deras orter är dolda sedan migration 003, och en lönnlöv eller ett
 *  stjärnfält går inte att rita läsbart i den här storleken. */
export const harFlagga = (engelsktLandsnamn) => Boolean(FLAGGOR[engelsktLandsnamn])

/**
 * @param country  Landets engelska namn, som det står i databasen.
 * @param hojd     Flaggans höjd i bildpunkter. Bredden följer av formatet.
 */
export default function Flagga({ country, hojd = 9 }) {
  const flagga = FLAGGOR[country]
  if (!flagga) return null

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${flagga.b} 11`}
      width={(flagga.b / 11) * hojd}
      height={hojd}
      style={{ display: 'block', flexShrink: 0, borderRadius: 1 }}
    >
      {flagga.ritning}
    </svg>
  )
}
