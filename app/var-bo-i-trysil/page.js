import VarBo, { varBoMetadata } from '../VarBo'

// Var ska man bo i Trysil? Innehållet står i lib/varbo.js.

export const metadata = varBoMetadata('trysil')

export default function Page() {
  return <VarBo slug="trysil" />
}
