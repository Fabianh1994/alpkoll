import { supabase } from '../../../lib/supabase'
import Link from 'next/link'

export default async function ResortPage({ params }) {
const slug = (await params).slug

const { data: resort, error } = await supabase
  .from('resorts')
  .select('*')
  .eq('slug', slug)
  .single()



  if (error || !resort) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 mb-4">Resort not found</p>
          <Link href="/" className="text-cyan-400 hover:text-cyan-300">← Back to resorts</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10">
        <Link href="/" className="text-white font-bold text-xl tracking-tight">⛷️ Alpkoll</Link>
        <Link href="/" className="text-white/60 hover:text-white text-sm transition">← All Resorts</Link>
      </nav>

      {/* Hero image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={resort.image_url || 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200'}
          alt={resort.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute bottom-0 left-0 px-8 pb-8">
          <p className="text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-2">
            {resort.region}, {resort.country}
          </p>
          <h1 className="text-5xl font-bold">{resort.name}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 space-y-12">

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Top Altitude', value: `${resort.altitude_top}m`, icon: '🏔️' },
            { label: 'Pistes', value: `${resort.total_pistes_km}km`, icon: '🎿' },
            { label: 'Lifts', value: resort.total_lifts, icon: '🚡' },
            { label: 'Day Pass', value: `€${resort.lift_pass_day_eur}`, icon: '🎫' },
          ].map(stat => (
            <div key={stat.label} className="bg-slate-800/60 rounded-2xl p-5 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-white/50 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scores */}
        <div>
          <h2 className="text-xl font-bold mb-6">Resort Scores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Snow Guarantee', value: resort.snow_guarantee_score, color: 'bg-cyan-400' },
              { label: 'Intermediate Terrain', value: resort.intermediate_score, color: 'bg-blue-400' },
              { label: 'Expert Terrain', value: resort.expert_score, color: 'bg-purple-400' },
              { label: 'Beginner Friendly', value: resort.beginner_score, color: 'bg-green-400' },
              { label: 'Off-Piste', value: resort.off_piste_score, color: 'bg-orange-400' },
              { label: 'Snowpark', value: resort.snowpark_score, color: 'bg-pink-400' },
              { label: 'Village Charm', value: resort.village_charm_score, color: 'bg-yellow-400' },
              { label: 'Après Ski', value: resort.apres_ski_score, color: 'bg-red-400' },
            ].map(score => (
              <div key={score.label} className="flex items-center gap-4">
                <span className="text-white/60 text-sm w-44 shrink-0">{score.label}</span>
                <div className="flex-1 bg-slate-800 rounded-full h-2">
                  <div
                    className={`${score.color} h-2 rounded-full`}
                    style={{ width: `${score.value * 10}%` }}
                  />
                </div>
                <span className="text-white font-bold text-sm w-8 text-right">{score.value}/10</span>
              </div>
            ))}
          </div>
        </div>

        {/* Terrain breakdown */}
        <div>
          <h2 className="text-xl font-bold mb-6">Terrain Breakdown</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-800/60 rounded-2xl p-5">
              <div className="text-3xl font-bold text-green-400">{resort.blue_percent}%</div>
              <div className="text-white/50 text-sm mt-1">🟦 Blue (Easy)</div>
            </div>
            <div className="bg-slate-800/60 rounded-2xl p-5">
              <div className="text-3xl font-bold text-red-400">{resort.red_percent}%</div>
              <div className="text-white/50 text-sm mt-1">🟥 Red (Intermediate)</div>
            </div>
            <div className="bg-slate-800/60 rounded-2xl p-5">
              <div className="text-3xl font-bold text-slate-300">{resort.black_percent}%</div>
              <div className="text-white/50 text-sm mt-1">⬛ Black (Expert)</div>
            </div>
          </div>
        </div>

        {/* Season & Snow */}
        <div>
          <h2 className="text-xl font-bold mb-6">Season & Snow</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Season Opens', value: resort.season_start },
              { label: 'Season Closes', value: resort.season_end },
              { label: 'Avg Snowfall', value: `${resort.avg_snowfall_cm}cm` },
              { label: 'Best Months', value: resort.best_months },
            ].map(item => (
              <div key={item.label} className="bg-slate-800/60 rounded-2xl p-4">
                <div className="text-white/50 text-xs mb-1">{item.label}</div>
                <div className="font-semibold text-sm">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Getting there */}
        <div>
          <h2 className="text-xl font-bold mb-6">Getting There</h2>
          <div className="bg-slate-800/60 rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <p className="text-white/50 text-xs mb-1">Nearest Airport</p>
              <p className="font-bold text-lg">✈️ {resort.nearest_airport}</p>
            </div>
            <div className="flex-1">
              <p className="text-white/50 text-xs mb-1">Distance to Resort</p>
              <p className="font-bold text-lg">🚗 {resort.airport_distance_km}km</p>
            </div>
            <div className="flex-1">
              <p className="text-white/50 text-xs mb-1">Stay In</p>
              <p className="font-bold text-lg">🏨 {resort.accommodation_zone}</p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {resort.notes && (
          <div className="bg-cyan-400/10 border border-cyan-400/20 rounded-2xl p-6">
            <p className="text-cyan-300 text-sm leading-relaxed">💡 {resort.notes}</p>
          </div>
        )}

{/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          
           <a
            href={resort.resort_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-cyan-400 text-slate-950 font-bold px-8 py-4 rounded-2xl text-sm hover:bg-cyan-300 transition text-center"
          >
            Visit Official Website →
          </a>
          <Link
            href="/"
            className="border border-white/30 text-white px-8 py-4 rounded-2xl text-sm hover:border-white/60 transition text-center"
          >
            ← Back to All Resorts
          </Link>
        </div>

      </div>
    </main>
  )
}