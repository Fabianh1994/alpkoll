import OrtEllerAlperna from '../OrtEllerAlperna'
import { SITE_URL } from '../../lib/lang'

// Samma intervall som ortsidorna. Sidans tal räknas ur databasen vid
// rendering, så en rättad siffra slår igenom här inom en timme.
export const revalidate = 3600

const titel = 'Åre eller Alperna? Så skiljer de sig | Alpkoll'
const beskrivning =
  'Åre mot Alperna: storlek, fallhöjd, vad liftkortet kostar i kronor och hur ' +
  'lång resan är från Sverige — inklusive de alporter du når med nattåg.'

export const metadata = {
  title: titel,
  description: beskrivning,
  alternates: { canonical: `${SITE_URL}/are-eller-alperna` },
  openGraph: {
    title: titel,
    description: beskrivning,
    url: `${SITE_URL}/are-eller-alperna`,
    siteName: 'Alpkoll',
    type: 'article',
    locale: 'sv_SE',
    images: ['/og-image.png'],
  },
  twitter: { card: 'summary_large_image', title: titel, description: beskrivning, images: ['/og-image.png'] },
}

export default function Sidan() {
  return <OrtEllerAlperna slug="are" />
}
