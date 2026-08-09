// Månadsnamn renderas i koden, inte i databasen.
//
// Databasen lagrar månader som heltal 1–12 (season_start_month,
// season_end_month, best_months_nums) sedan migration 001. Det gör datan
// språkneutral: ett språkbyte kräver ingen databasändring, och ingen
// logik behöver strängjämföra månadsnamn.

const MANADER = [
  'januari', 'februari', 'mars', 'april', 'maj', 'juni',
  'juli', 'augusti', 'september', 'oktober', 'november', 'december',
]

/** 11 -> "november". Returnerar null för ogiltiga värden. */
export function manad(nr) {
  if (!Number.isInteger(nr) || nr < 1 || nr > 12) return null
  return MANADER[nr - 1]
}

/** 11 -> "November", för början av en mening eller ett kortvärde. */
export function manadVersal(nr) {
  const m = manad(nr)
  return m ? m[0].toUpperCase() + m.slice(1) : null
}

/**
 * [1, 2, 3] -> "januari, februari och mars"
 * Svenska sätter "och" före sista ledet — en ren kommalista läser som
 * en uppräkning som inte är slut.
 */
export function manadslista(nummer) {
  if (!Array.isArray(nummer) || nummer.length === 0) return null

  const namn = nummer.map(manad).filter(Boolean)
  if (namn.length === 0) return null
  if (namn.length === 1) return namn[0]

  return `${namn.slice(0, -1).join(', ')} och ${namn[namn.length - 1]}`
}

/**
 * Är orten öppen i en given månad? Hanterar säsonger som spänner över
 * årsskiftet (november–april) lika väl som sådana som inte gör det
 * (juni–oktober, för glaciäråkning på södra halvklotet).
 */
export function oppenIManad(startManad, slutManad, manadNr) {
  if (!startManad || !slutManad || !manadNr) return false
  if (startManad <= slutManad) return manadNr >= startManad && manadNr <= slutManad
  return manadNr >= startManad || manadNr <= slutManad
}
