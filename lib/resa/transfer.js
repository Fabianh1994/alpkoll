/**
 * Bilvägen från flygplatserna till varje ort, för ortsidans "tre
 * närmaste flygplatserna" innan läsaren skrivit sin adress.
 *
 * Samma metod för alla orter, av samma skäl som i lib/restider.js: OSRM
 * mot OpenStreetMaps vägnät, från flygplatsens koordinat i
 * lib/resa/flygplatser.js till ortens koordinat i databasen. Kandidaterna
 * per ort är de flygplatser man rimligen flyger till från Sverige; de tre
 * med kortast bilväg står kvar. Inga köer, inget vinterväglag.
 *
 * Exakt restid hemifrån räknar reseplaneraren live; det här är hummet.
 *
 * slug -> [[flygplats, km, minuter], ...] i ordning efter minuter.
 */

export const TRANSFER_MATT = '25 november 2026'

/** Där bilen inte kommer ända fram. */
export const SISTA_BITEN = {
  zermatt: 'Byn är bilfri: bilen stannar i Täsch, och sista biten går med tåg.',
}

export const TRANSFER = {
  'alpe-d-huez': [['GNB', 106, 98], ['LYS', 154, 124], ['GVA', 215, 183]],
  'alta-badia': [['INN', 136, 121], ['VCE', 173, 148], ['VRN', 216, 181]],
  are: [['OSD', 87, 85], ['TRD', 135, 137]],
  'bad-gastein': [['SZG', 97, 80], ['MUC', 265, 177], ['INN', 196, 180]],
  branas: [['SCR', 89, 91], ['KSD', 162, 150], ['OSL', 204, 198]],
  cervinia: [['TRN', 121, 101], ['MXP', 181, 146], ['LIN', 194, 157]],
  chamonix: [['GVA', 90, 87], ['TRN', 174, 137], ['LYS', 217, 144]],
  'cortina-d-ampezzo': [['VCE', 147, 111], ['INN', 165, 146], ['MUC', 360, 273]],
  courchevel: [['CMF', 109, 95], ['LYS', 188, 135], ['GVA', 148, 154]],
  engelberg: [['ZRH', 101, 87], ['BSL', 139, 112]],
  funasfjallen: [['TRD', 183, 192], ['OSD', 209, 209], ['SCR', 201, 210]],
  geilo: [['OSL', 228, 229], ['BGO', 244, 258]],
  grandvalira: [['TLS', 170, 144], ['BCN', 194, 165]],
  hafjell: [['OSL', 159, 128]],
  hemavan: [['HMV', 5, 7]],
  hemsedal: [['OSL', 209, 212], ['BGO', 279, 288]],
  'idre-fjall': [['SCR', 121, 122], ['OSD', 265, 273]],
  ischgl: [['INN', 96, 77], ['FDH', 167, 138], ['ZRH', 237, 187]],
  kitzbuehel: [['SZG', 75, 80], ['INN', 100, 87], ['MUC', 166, 118]],
  klappen: [['SCR', 46, 51], ['OSL', 235, 205]],
  'la-plagne': [['CMF', 119, 104], ['LYS', 198, 145], ['GVA', 158, 164]],
  laax: [['ZRH', 155, 119]],
  'lech-zuers': [['INN', 112, 90], ['FDH', 127, 100], ['ZRH', 197, 149]],
  'les-arcs': [['CMF', 138, 131], ['LYS', 216, 171], ['GVA', 177, 191]],
  'les-deux-alpes': [['GNB', 110, 102], ['LYS', 158, 129], ['TRN', 178, 176]],
  levi: [['KTT', 16, 19], ['RVN', 177, 150]],
  livigno: [['INN', 176, 155], ['BGY', 174, 196], ['ZRH', 219, 196]],
  'madonna-di-campiglio': [['VRN', 156, 156], ['BGY', 174, 157], ['INN', 224, 189]],
  mayrhofen: [['INN', 76, 66], ['SZG', 173, 127], ['MUC', 197, 138]],
  meribel: [['CMF', 103, 89], ['LYS', 181, 129], ['GVA', 142, 149]],
  obergurgl: [['INN', 94, 80], ['MUC', 252, 204]],
  riksgransen: [['EVE', 87, 86], ['KRN', 140, 121]],
  ruka: [['KAO', 33, 51], ['RVN', 205, 186]],
  saalbach: [['SZG', 88, 88], ['INN', 158, 150], ['MUC', 231, 169]],
  'saas-fee': [['GVA', 227, 180], ['MXP', 195, 182], ['ZRH', 235, 223]],
  salen: [['SCR', 32, 38], ['OSL', 228, 202]],
  'serre-chevalier': [['TRN', 122, 118], ['GNB', 152, 141], ['LYS', 201, 167]],
  solden: [['INN', 82, 70], ['MUC', 240, 195]],
  'st-anton': [['INN', 92, 66], ['FDH', 129, 101], ['ZRH', 199, 150]],
  'st-moritz': [['BGY', 155, 176], ['ZRH', 217, 180], ['MXP', 186, 194]],
  tignes: [['CMF', 142, 131], ['LYS', 221, 172], ['GVA', 181, 191]],
  trysil: [['SCR', 46, 50], ['OSL', 174, 146]],
  'val-d-isere': [['CMF', 144, 137], ['LYS', 222, 177], ['GVA', 183, 196]],
  'val-gardena': [['INN', 118, 99], ['VRN', 193, 150], ['VCE', 198, 179]],
  'val-thorens': [['CMF', 122, 106], ['LYS', 200, 147], ['GVA', 161, 166]],
  vemdalen: [['OSD', 115, 117]],
  verbier: [['GVA', 162, 133]],
  voss: [['BGO', 103, 115]],
  'zell-am-see-kaprun': [['SZG', 78, 77], ['INN', 148, 138], ['MUC', 221, 157]],
  zermatt: [['GVA', 236, 190], ['MXP', 204, 192], ['ZRH', 245, 233]],
}
