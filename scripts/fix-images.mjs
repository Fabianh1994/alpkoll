import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://odlzoewjwyipiopttucv.supabase.co', 'sb_publishable_AkOsusAh_OvwVxqK40kmdg_ZDGwHsrC')

const resorts = [
  { name: 'Zermatt', wiki: 'Zermatt' },
  { name: 'Val Thorens', wiki: 'Val_Thorens' },
  { name: 'St. Anton', wiki: 'St._Anton_am_Arlberg' },
  { name: 'Verbier', wiki: 'Verbier' },
  { name: 'Courchevel', wiki: 'Courchevel' },
  { name: 'Whistler', wiki: 'Whistler_Blackcomb' },
  { name: 'Grandvalira', wiki: 'Grandvalira' },
  { name: 'Trysil', wiki: 'Trysil' },
  { name: 'Voss', wiki: 'Voss_Resort' },
  { name: 'Geilo', wiki: 'Geilo' },
  { name: 'Myrkdalen', wiki: 'Myrkdalen' },
  { name: 'Levi', wiki: 'Levi,_Finland' },
  { name: 'Ruka', wiki: 'Ruka,_Finland' },
]

for (const resort of resorts) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${resort.wiki}`
  const res = await fetch(url)
  const data = await res.json()
  const image = data?.thumbnail?.source || data?.originalimage?.source
  if (image) {
    await supabase.from('resorts').update({ image_url: image }).eq('name', resort.name)
    console.log(`? ${resort.name}: ${image}`)
  } else {
    console.log(`? ${resort.name}: no image found`)
  }
}
