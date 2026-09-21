// Vem som driver sajten, och hur man når hen.
//
// Lagen om elektronisk handel kräver att den som tillhandahåller en
// tjänst online uppger namn och kontaktuppgift, och marknadsföringslagen
// att det framgår vem som svarar för marknadsföringen. Båda blir skarpa
// i och med affiliatelänkarna: en sajt som tjänar pengar på utgående
// länkar ska gå att koppla till en avsändare.
//
// Adressen publiceras inte. Formellt räknar lagen upp den bland
// uppgifterna, men Alpkoll drivs av en privatperson och inte från en
// affärslokal, och adressen lämnas därför på begäran till den som frågar
// på mejladressen nedan.
//
// Konstanten låg förut på två ställen, i app/JuridiskSida.js och med en
// egen kopia i app/about/page.js. Den ligger här i stället, eftersom
// app/SiteFooter.js också behöver den och inte kan importera från
// JuridiskSida — den senare importerar SiteFooter, och importen hade
// blivit cirkulär.

export const KONTAKT = 'hello@alpkoll.com'

/** Den fysiska person som ansvarar för sajten och dess marknadsföring. */
export const AVSANDARE = 'Fabian Henningsson'
