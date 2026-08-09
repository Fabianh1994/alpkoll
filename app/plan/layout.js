import { PLANERAREN_SYNLIG } from '../../lib/features'

// Reseplaneraren är en klientkomponent och kan därför inte exportera
// metadata själv. Den här layouten finns för att kunna märka sidan
// noindex medan den är dold, så att Google släpper den i stället för att
// indexera något halvfärdigt.
//
// Sidan svarar fortfarande — den som redan har länken får ingen 404.
export const metadata = {
  title: 'Planera din skidresa — Alpkoll',
  robots: PLANERAREN_SYNLIG
    ? { index: true, follow: true }
    : { index: false, follow: true },
}

export default function PlanLayout({ children }) {
  return children
}
