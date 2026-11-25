// Laddar Google Maps först när läsaren börjar använda planeraren.
//
// Integritetspolicyn lovar att ingenting från Google laddas medan man bara
// läser på Alpkoll. Skriptet hämtas därför när läsaren klickar i
// adressfältet eller trycker på knappen, och texten under fältet säger det.
//
// Nyckeln står i NEXT_PUBLIC_GOOGLE_MAPS_NYCKEL. Den syns i webbläsaren och
// är låst i Google Cloud till alpkoll.se och de tre API:er som används.

let laddning = null

export const harNyckel = () => Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_NYCKEL)

export function laddaGoogle() {
  if (laddning) return laddning
  laddning = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('ingen webbläsare'))
    if (window.google?.maps?.importLibrary) return resolve(window.google)

    const nyckel = process.env.NEXT_PUBLIC_GOOGLE_MAPS_NYCKEL || ''
    const namn = `__alpkollGoogle${Date.now()}`
    window[namn] = () => {
      delete window[namn]
      resolve(window.google)
    }
    const s = document.createElement('script')
    const fraga = new URLSearchParams({
      key: nyckel,
      v: 'weekly',
      language: 'sv',
      region: 'SE',
      loading: 'async',
      callback: namn,
    })
    s.src = `https://maps.googleapis.com/maps/api/js?${fraga}`
    s.async = true
    s.onerror = () => {
      laddning = null
      reject(new Error('Google Maps gick inte att ladda'))
    }
    document.head.appendChild(s)
  })
  return laddning
}

export async function bibliotek() {
  const google = await laddaGoogle()
  const [maps, routes, places, geometry] = await Promise.all([
    google.maps.importLibrary('maps'),
    google.maps.importLibrary('routes'),
    google.maps.importLibrary('places'),
    google.maps.importLibrary('geometry'),
  ])
  const lib = { google, maps, routes, places, geometry }
  // Bara i utvecklingsläge: en lokal testsida kan byta ut rutt- och
  // platsdelarna mot en attrapp, så att sidan går att prova utan nyckel.
  if (process.env.NODE_ENV !== 'production' && window.__resaAttrapp) Object.assign(lib, window.__resaAttrapp)
  return lib
}

/**
 * Kartan i Alpkolls färger: mörk grund som sidan, vägar i varmgrått,
 * vatten nästan svart och inga affärsikoner som tävlar med resvägen.
 */
export const KARTSTIL = [
  { elementType: 'geometry', stylers: [{ color: '#1a1816' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#9a9184' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#121110' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#3a352f' }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#5a5248' }, { weight: 1.2 }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#c9c0b3' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#1d1b18' }] },
  { featureType: 'landscape.natural.terrain', elementType: 'geometry', stylers: [{ color: '#24211d' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ visibility: 'on' }, { color: '#1f2a1f' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2c2824' }] },
  { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3b352e' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#121110' }] },
  { featureType: 'road.local', stylers: [{ visibility: 'simplified' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2a3136' }] },
  { featureType: 'transit.station', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d1114' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4e5a63' }] },
]
