// Funktioner som är påslagna eller avstängda.
//
// Reseplaneraren är dold tills den är genomgången. Den fungerar, men har
// kvar problem som inte hör hemma på en publik sajt:
//
//   · månadsväljaren och stegnumreringen stämde inte med innehållet
//   · förklaringstexterna låg hårdkodade på engelska
//   · transferrutorna visar kilometer trots att vi mäter restid
//   · getAccessScore mäter transfern från flygplatsen, inte hela resan
//
// Sidan ligger kvar och svarar — den är bara olänkad, borttagen ur
// sitemapen och märkt noindex, så att sökmotorer släpper den i stället
// för att indexera något halvfärdigt. Ingen adress går sönder för den
// som redan har länken.
//
// Sätt till true för att tända den igen. Inga andra ändringar behövs.
export const PLANERAREN_SYNLIG = false
