import VarBo, { varBoMetadata } from '../VarBo'

// Var ska man bo i Åre? Innehållet står i lib/varbo.js.

export const metadata = varBoMetadata('are')

export default function Page() {
  return <VarBo slug="are" />
}
