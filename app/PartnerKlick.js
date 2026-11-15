'use client'

// Länken i Partnerlank, med en räknare på klicket.
//
// Partnerlank är en serverkomponent och kan inte lyssna på klick. Därför
// ligger själva <a> här, i en klientkomponent som gör en enda sak utöver
// att vara länk: säger till Vercel Analytics att någon klickade.
//
// Händelsen bär två egenskaper, partnern och spårningsnamnet. Det är allt
// Pro-planen tar per händelse, och det räcker: spårningsnamnet säger redan
// sidtyp, placering och ort. Ingen kaka sätts och inget om besökaren
// skickas med — samma anonyma räkning som sidvisningarna.
//
// På gratisplanen tas egna händelser inte emot. Då gör anropet ingenting,
// och länken fungerar som förut.

import { track } from '@vercel/analytics'

export default function PartnerKlick({ partner, sid, href, rel, style, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel={rel}
      style={style}
      onClick={() => track('partnerklick', { partner, sid })}
    >
      {children}
    </a>
  )
}
