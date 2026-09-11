// Krediteringen för en bild ur resort_images.
//
// Egen fil utan beroenden, därför att galleriet är en klientkomponent och
// lib/ortbilder.js drar in Supabase-klienten och Reacts serverns cache().

/**
 * "Foto: Antoine Lamielle, CC BY-SA 4.0" respektive "Foto: Hannes Knutsson / Unsplash".
 *
 * Unsplash kräver ingen kreditering men namnet står med ändå. Licensen
 * skrivs bara ut för Commons, där den är det kreditering betyder.
 */
export function kreditering(bild) {
  if (!bild) return null
  if (bild.source === 'unsplash') {
    return bild.photographer ? `Foto: ${bild.photographer} / Unsplash` : 'Foto: Unsplash'
  }
  return bild.photographer ? `Foto: ${bild.photographer}, ${bild.license}` : bild.license
}
