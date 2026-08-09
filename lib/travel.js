// Restid till orten.
//
// transfer_minutes är den verkliga restiden från nearest_airport och
// fylls i ort för ort. Så länge fältet är tomt uppskattas tiden ur
// avståndet, precis som tidigare — annars hade 27 orter visat ett streck
// medan fem visade en siffra.
//
// Uppskattningen är trubbig: den vet inget om serpentinvägar och inget
// om att Zermatt inte går att köra till. Den är ett mellanläge, inte ett
// mål. Se migration 005.

/** 210 -> "3,5 tim". 45 -> "45 min". */
export function formateraRestid(minuter) {
  if (!Number.isFinite(minuter) || minuter <= 0) return null
  if (minuter < 90) return `${minuter} min`

  const timmar = minuter / 60
  const text = Number.isInteger(timmar)
    ? String(timmar)
    : timmar.toFixed(1).replace('.', ',')

  return `${text} tim`
}

/** Grov uppskattning ur avståndet, för orter som ännu saknar mätvärde. */
function uppskattaUrAvstand(km) {
  if (!Number.isFinite(km)) return null
  if (km < 50) return 'ca 45 min'
  if (km < 100) return 'ca 1,5 tim'
  if (km < 150) return 'ca 2 tim'
  if (km < 200) return 'ca 2,5 tim'
  if (km < 300) return 'ca 3 tim'
  return 'ca 4 tim'
}

/**
 * Restid att visa i rutan, med färdsätt när det är känt.
 * "3,5 tim med tåg — byn är bilfri" respektive "ca 2,5 tim".
 */
export function restid(resort) {
  const matt = formateraRestid(resort.transfer_minutes)
  if (matt) {
    return resort.transfer_note ? `${matt} ${resort.transfer_note}` : matt
  }
  return uppskattaUrAvstand(resort.airport_distance_km) || '—'
}
