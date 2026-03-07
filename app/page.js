import { supabase } from '../lib/supabase'

export default async function Home() {
  const { data: resorts, error } = await supabase
    .from('resorts')
    .select('*')
    .order('name')

  if (error) {
    console.error(error)
    return <div>Error loading resorts</div>
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-2 text-blue-400">⛷️ SkiIntel</h1>
      <p className="text-gray-400 mb-8">AI-powered ski trip optimizer</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resorts.map((resort) => (
          <div key={resort.id} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition">
            <h2 className="text-xl font-bold mb-1">{resort.name}</h2>
            <p className="text-gray-400 text-sm mb-4">{resort.region}, {resort.country}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>🏔️ {resort.altitude_top}m top</div>
              <div>🎿 {resort.total_pistes_km}km pistes</div>
              <div>❄️ Snow score: {resort.snow_guarantee_score}/10</div>
              <div>💶 Day pass: €{resort.lift_pass_day_eur}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}