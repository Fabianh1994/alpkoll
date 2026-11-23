import VarBo, { varBoMetadata } from '../VarBo'

// Var ska man bo i Sälen? Innehållet står i lib/varbo.js.
//
// Den vanligaste forumfrågan om Sälen (Familjeliv, RikaTillsammans,
// Freeride). Adressen är kvar sedan 17 november 2026, så att det Google
// redan har hittat behålls. Titeln börjar sedan 23 november med "Boende i
// Sälen", det folk söker på (3 600 sökningar i månaden).

export const metadata = varBoMetadata('salen')

export default function Page() {
  return <VarBo slug="salen" />
}
