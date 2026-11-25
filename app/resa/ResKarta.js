'use client'

import { useEffect, useRef } from 'react'
import { KARTSTIL } from './google'
import { FARG } from '../../lib/resa/resvag'

// Kartan med hela resan. Varje etapp ritas i sin färg längs den riktiga
// vägen: bilvägen och spåren som Google räknat fram, och flyget som den
// båge planet flyger (geodetisk linje). Gångsträckor är prickade.

const bokstav = (fyll, kant = '#121110', skala = 7) => ({
  path: 0, // google.maps.SymbolPath.CIRCLE
  fillColor: fyll,
  fillOpacity: 1,
  strokeColor: kant,
  strokeWeight: 2.5,
  scale: skala,
})

export default function ResKarta({ lib, resa, hem, mal, stopp, aktiv, onValjEtapp }) {
  const ruta = useRef(null)
  const karta = useRef(null)
  const ritat = useRef([])

  useEffect(() => {
    if (!lib || !ruta.current || karta.current) return
    karta.current = new lib.maps.Map(ruta.current, {
      center: { lat: 60, lng: 15 },
      zoom: 5,
      styles: KARTSTIL,
      backgroundColor: '#121110',
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: 'cooperative',
      clickableIcons: false,
    })
  }, [lib])

  useEffect(() => {
    const g = lib?.google
    const m = karta.current
    if (!g || !m) return
    ritat.current.forEach((o) => o.setMap(null))
    ritat.current = []
    if (!resa?.etapper) return

    const granser = new g.maps.LatLngBounds()
    const lagg = (o) => { ritat.current.push(o); return o }

    resa.etapper.forEach((e, i) => {
      if (!e.path?.length) return
      const farg = FARG[e.typ] || FARG.annat
      const markerad = aktiv == null || aktiv === i
      const opacitet = markerad ? 1 : 0.35
      e.path.forEach((p) => granser.extend(p))

      if (e.typ === 'flyg') {
        // Streckad båge, med ett plan mitt på.
        lagg(new g.maps.Polyline({
          map: m, path: e.path, geodesic: true, strokeOpacity: 0, zIndex: 3,
          icons: [
            { icon: { path: 'M 0,-1 0,1', strokeOpacity: opacitet, strokeColor: farg, scale: 2.5 }, offset: '0', repeat: '14px' },
            { icon: { path: g.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 4, fillColor: '#D4A574', fillOpacity: opacitet, strokeColor: '#121110', strokeWeight: 1 }, offset: '50%' },
          ],
        }))
        return
      }
      if (e.typ === 'gang') {
        lagg(new g.maps.Polyline({
          map: m, path: e.path, strokeOpacity: 0, zIndex: 2,
          icons: [{ icon: { path: g.maps.SymbolPath.CIRCLE, fillColor: farg, fillOpacity: 0.8 * opacitet, strokeOpacity: 0, scale: 2 }, offset: '0', repeat: '9px' }],
        }))
        return
      }
      // Mörk kant under, färgad linje över: syns mot både vatten och land.
      lagg(new g.maps.Polyline({ map: m, path: e.path, strokeColor: '#121110', strokeOpacity: 0.9 * opacitet, strokeWeight: markerad ? 8 : 6, zIndex: 1 }))
      const linje = lagg(new g.maps.Polyline({
        map: m, path: e.path, strokeColor: farg, strokeOpacity: opacitet, strokeWeight: markerad ? 4.5 : 3, zIndex: 2,
        ...(e.typ === 'transfer' ? { strokeOpacity: 0, icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: opacitet, strokeColor: farg, scale: 3 }, offset: '0', repeat: '12px' }] } : {}),
      }))
      if (onValjEtapp) linje.addListener('click', () => onValjEtapp(i))
    })

    // Bytespunkter: där en etapp slutar och nästa börjar, med ett annat färdsätt.
    resa.etapper.forEach((e, i) => {
      const nasta = resa.etapper[i + 1]
      if (!nasta || !e.till?.lat || e.typ === 'vanta' || nasta.typ === 'gang' || e.typ === 'gang') return
      lagg(new g.maps.Marker({
        map: m, position: { lat: e.till.lat, lng: e.till.lng }, zIndex: 5,
        icon: { ...bokstav('#f0ece4', '#121110', 5), path: g.maps.SymbolPath.CIRCLE },
        title: e.till.namn || '',
      }))
    })

    ;(stopp || []).forEach((s, i) => {
      lagg(new g.maps.Marker({
        map: m, position: { lat: s.lat, lng: s.lng }, zIndex: 6,
        icon: { ...bokstav('#121110', '#D4A574', 9), path: g.maps.SymbolPath.CIRCLE },
        label: { text: String(i + 1), color: '#D4A574', fontSize: '11px', fontWeight: '600' },
        title: s.ort ? `Paus vid ${s.ort}` : 'Paus',
      }))
    })

    if (hem) {
      granser.extend(hem)
      lagg(new g.maps.Marker({
        map: m, position: hem, zIndex: 7, title: 'Hemma',
        icon: { ...bokstav('#f0ece4', '#121110', 8), path: g.maps.SymbolPath.CIRCLE },
      }))
    }
    if (mal) {
      granser.extend(mal)
      lagg(new g.maps.Marker({
        map: m, position: mal, zIndex: 8, title: mal.namn || 'Framme',
        icon: {
          // En bergstopp i accentfärgen.
          path: 'M -11,6 L -3,-8 L 1,-2 L 4,-6 L 11,6 Z',
          fillColor: '#D4A574', fillOpacity: 1, strokeColor: '#121110', strokeWeight: 2, scale: 1.3,
        },
      }))
    }

    if (!granser.isEmpty()) m.fitBounds(granser, { top: 40, right: 40, bottom: 40, left: 40 })
  }, [lib, resa, hem, mal, stopp, aktiv, onValjEtapp])

  return (
    <div
      ref={ruta}
      role="img"
      aria-label="Karta över resan"
      style={{ width: '100%', height: '100%', minHeight: 360, background: '#121110' }}
    />
  )
}
