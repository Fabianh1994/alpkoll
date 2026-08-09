import { getResorts } from '../lib/resorts'
import HomeClient from './HomeClient'

// Startsidan hämtade tidigare orterna i webbläsaren med useEffect. Det
// gjorde att sidans första HTML-svar innehöll en tom lista: sökmotorer
// och långsamma uppkopplingar fick noll skidorter, och hero-texten
// skrev ut "0 skidorter" tills datan kommit fram.
//
// Nu hämtas de på servern och skickas som prop. Interaktionen — sökfält,
// landsfilter, parallax — ligger kvar i HomeClient, som fortfarande är
// en klientkomponent. Skillnaden är var datan kommer ifrån, inte var
// koden körs.
//
// Samma revalidate som ortsidorna, så nya orter i Supabase dyker upp
// inom en timme utan ny deploy.
export const revalidate = 3600

export default async function Home() {
  const resorts = await getResorts()

  return <HomeClient resorts={resorts} />
}
