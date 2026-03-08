import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const resortWikiTitles = {
  'Méribel': 'Méribel',
  'Chamonix': 'Chamonix',
  'Tignes': 'Tignes',
  'Les Arcs': 'Les Arcs',
  'Alpe d Huez': "Alpe d'Huez",
  'Davos': 'Davos',
  'Saas-Fee': 'Saas-Fee',
  'Crans-Montana': 'Crans-Montana',
  'Kitzbühel': 'Kitzbühel',
  'Ischgl': 'Ischgl',
  'Mayrhofen': 'Mayrhofen',
  'Sölden': 'Sölden',
  'Cortina d Ampezzo': "Cortina d'Ampezzo",
  'Madonna di Campiglio': 'Madonna di Campiglio',
  'Livigno': 'Livigno',
  'Grandvalira': 'Grandvalira',
  'Åre': 'Åre_ski_resort',
  'Sälen': 'Sälen',
  'Riksgränsen': 'Riksgränsen',
  'Hemavan': 'Hemavan',
  'Trysil': 'Trysil',
  'Hemsedal': 'Hemsedal',
  'Voss': 'Voss,_Norway',
  'Geilo': 'Geilo',
  'Myrkdalen': 'Myrkdalen',
  'Levi': 'Levi_ski_resort',
  'Ruka': 'Ruka,_Finland',
  'Whistler': 'Whistler_Blackcomb',
  'Aspen': 'Aspen,_Colorado',
  'Park City': 'Park_City_Mountain_Resort',
  'Jackson Hole': 'Jackson_Hole_Mountain_Resort',
  'Niseko': 'Niseko',
  'Queenstown': 'Queenstown,_New_Zealand',
}

async function getWikiImage(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=800&origin=*`
  try {
    const response = await fetch(url)
    const data = await response.json()
    const pages = data.query.pages
    const page = Object.values(pages)[0]
    return page?.thumbnail?.source || null
  } catch (error) {
    console.error(`Error fetching wiki image for ${title}:`, error)
    return null
  }
}

async function updateImages() {
  for (const [resortName, wikiTitle] of Object.entries(resortWikiTitles)) {
    console.log(`Fetching image for ${resortName}...`)
    const imageUrl = await getWikiImage(wikiTitle)
    if (imageUrl) {
      await supabase.from('resorts').update({ image_url: imageUrl }).eq('name', resortName)
      console.log(`✓ ${resortName}: ${imageUrl}`)
    } else {
      console.log(`✗ No image for ${resortName}`)
    }
    await new Promise(resolve => setTimeout(resolve, 300))
  }
  console.log('Done!')
}

updateImages()