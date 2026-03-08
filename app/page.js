import { supabase } from '../lib/supabase'

const resortImages = {
  'Zermatt': 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
  'Val Thorens': 'https://images.unsplash.com/photo-1548777123-e216912df7d8?w=800',
  'St. Anton': 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800',
  'Verbier': 'https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?w=800',
  'Courchevel': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
}

const defaultImage = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800'

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
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Nav */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-6">
        <span className="text-white font-bold text-xl tracking-tight">⛷️ Alpkoll</span>
        <div className="flex gap-8 text-sm text-white/70">
          <span className="cursor-pointer hover:text-white transition">Resorts</span>
          <span className="cursor-pointer hover:text-white transition">Plan a Trip</span>
          <span className="cursor-pointer hover:text-white transition">About</span>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        
       {/* YouTube video background */}
        <iframe
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ transform: 'scale(1.5)' }}
          src="https://www.youtube.com/embed/k12GHIJB92c?autoplay=1&mute=1&loop=1&playlist=k12GHIJB92c&controls=0&showinfo=0&rel=0&modestbranding=1"
          allow="autoplay; fullscreen"
          frameBorder="0"
        />
      

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-4">
            AI-Powered Ski Trip Optimizer
          </p>
          <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
            Find Your Perfect<br />
            <span className="text-cyan-400">Mountain</span>
          </h1>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
            Compare the world's best ski resorts by snow, terrain, price and vibe. Built for skiers, powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-cyan-400 text-slate-950 font-bold px-8 py-4 rounded-2xl text-sm hover:bg-cyan-300 transition">
              Explore Resorts ↓
            </button>
            <button className="border border-white/30 text-white px-8 py-4 rounded-2xl text-sm hover:border-white/60 transition">
              How It Works
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </div>

      </div>

      {/* Resort section */}
      <div className="px-6 md:px-12 py-16 max-w-7xl mx-auto">
        
        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-2">Handpicked</p>
            <h2 className="text-3xl font-bold">Top Resorts</h2>
          </div>
          <span className="text-white/40 text-sm">{resorts.length} resorts</span>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-3 bg-slate-800 rounded-2xl px-5 py-4 mb-10">
          <span className="text-slate-400">🔍</span>
          <span className="text-slate-400 text-sm">Search resorts, countries, regions...</span>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resorts.map((resort) => (
            <div
              key={resort.id}
              className="relative rounded-3xl overflow-hidden h-72 cursor-pointer group"
            >
              <img
                src={resortImages[resort.name] || defaultImage}
                alt={resort.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs uppercase tracking-widest text-slate-300 mb-1">
                  {resort.region}, {resort.country}
                </p>
                <h3 className="text-xl font-bold mb-3">{resort.name}</h3>
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 text-xs">
                    🏔️ {resort.altitude_top}m
                  </span>
                  <span className="bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 text-xs">
                    🎿 {resort.total_pistes_km}km
                  </span>
                  <span className="bg-cyan-400/20 text-cyan-300 backdrop-blur-sm rounded-full px-3 py-1 text-xs">
                    ❄️ {resort.snow_guarantee_score}/10 snow
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </main>
  )
}
