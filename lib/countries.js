// Landsnamn på svenska.
//
// Databasens country-fält är engelskt ("Austria", "Switzerland") och
// används som nyckel på flera ställen — i filtret på startsidan, i
// flagguppslaget och i sidtitlarna. Att översätta fältet i databasen
// hade brutit de kopplingarna, på samma sätt som månadsnamnen skulle ha
// brutit planerarens säsongslogik. Därför översätts det vid visning.

const SVENSKA = {
  Andorra: 'Andorra',
  Austria: 'Österrike',
  Bulgaria: 'Bulgarien',
  Canada: 'Kanada',
  Finland: 'Finland',
  France: 'Frankrike',
  Italy: 'Italien',
  Japan: 'Japan',
  Norway: 'Norge',
  'New Zealand': 'Nya Zeeland',
  Spain: 'Spanien',
  Sweden: 'Sverige',
  Switzerland: 'Schweiz',
  USA: 'USA',
}

/** "Austria" -> "Österrike". Okända länder returneras oförändrade. */
export function land(engelsktNamn) {
  if (!engelsktNamn) return null
  return SVENSKA[engelsktNamn] || engelsktNamn
}

/**
 * Sentinel för "alla länder" i landsfiltret.
 *
 * Filtret jämförde tidigare mot den översatta etiketten, med startvärdet
 * hårdkodat till 'All'. När sajten blev svensk blev etiketten 'Alla' och
 * jämförelsen falsk — startsidan visade noll skidorter för alla besökare
 * tills någon klickade på ett land.
 *
 * Ett värde som inte kan vara ett landsnamn gör filtret oberoende av
 * vilket språk knappen visar.
 */
export const ALLA_LANDER = '__alla__'
