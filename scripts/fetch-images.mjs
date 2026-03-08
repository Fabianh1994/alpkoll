import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const googleApiKey = process.env.GOOGLE_API_KEY
const googleCseId = process.env.GOOGLE_CSE_ID

const supabase = createClient(supabaseUrl, supabaseKey)

async function fetchImageForResort(resortName, country) {
  const query = `${resortName} ski resort winter mountain aerial photo`
 const url = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleCseId}&q=${encodeURIComponent(query)}&searchType=image&num=1&imgSize=large&imgType=photo&siteSearch=unsplash.com&siteSearchFilter=e`
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.items && data.items.length > 0) {
      return data.items[0].link
    }
    return null
  } catch (error) {
    console.error(`Error fetching image for ${resortName}:`, error)
    return null
  }
}

async function updateAllResortImages() {
  const { data: resorts, error } = await supabase
    .from('resorts')
    .select('id, name, country')
    .order('name')

  if (error) {
    console.error('Error fetching resorts:', error)
    return
  }

  console.log(`Found ${resorts.length} resorts to update...`)

  for (const resort of resorts) {
    console.log(`Fetching image for ${resort.name}...`)
    
    const imageUrl = await fetchImageForResort(resort.name, resort.country)
    
    if (imageUrl) {
      const { error: updateError } = await supabase
        .from('resorts')
        .update({ image_url: imageUrl })
        .eq('id', resort.id)
      
      if (updateError) {
        console.error(`Error updating ${resort.name}:`, updateError)
      } else {
        console.log(`✓ Updated ${resort.name}: ${imageUrl}`)
      }
    } else {
      console.log(`✗ No image found for ${resort.name}`)
    }

    // Wait 1 second between requests to avoid hitting API limits
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log('Done!')
}

updateAllResortImages()
