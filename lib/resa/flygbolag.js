/**
 * Flygbolagens namn ur IATA-koden, för de bolag som flyger mellan Norden
 * och Alperna. En kod som saknas visas som koden.
 */
const BOLAG = {
  SK: 'SAS',
  DY: 'Norwegian',
  D8: 'Norwegian',
  FR: 'Ryanair',
  RK: 'Ryanair',
  U2: 'easyJet',
  DS: 'easyJet',
  EC: 'easyJet',
  W6: 'Wizz Air',
  LH: 'Lufthansa',
  OS: 'Austrian',
  LX: 'Swiss',
  EW: 'Eurowings',
  KL: 'KLM',
  AF: 'Air France',
  BT: 'airBaltic',
  AY: 'Finnair',
  TP: 'TAP',
  BA: 'British Airways',
  VY: 'Vueling',
  IB: 'Iberia',
  AZ: 'ITA Airways',
  WF: 'Widerøe',
  N7: 'Nordic Regional Airlines',
  TF: 'BRA',
  DX: 'DAT',
  HV: 'Transavia',
  TO: 'Transavia',
  '6B': 'TUI fly Nordic',
  X3: 'TUI fly',
  OA: 'Olympic',
}

export const flygbolag = (kod) => (kod && BOLAG[kod]) || kod || null
