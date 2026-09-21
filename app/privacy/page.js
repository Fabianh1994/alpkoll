// app/privacy/page.js
import JuridiskSida, { Avsnitt, Lank, Stark, KONTAKT } from '../JuridiskSida';
import { hasAffiliateId } from '../../lib/booking';

export const metadata = {
  title: 'Integritetspolicy — Alpkoll',
  description:
    'Så hanterar Alpkoll dina uppgifter: inga konton, inga egna kakor, ingen spårning. Statistiken är anonym och databasen ligger inom EU.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <JuridiskSida titel="Integritetspolicy" uppdaterad="augusti 2026">
      <Avsnitt titel="Vilka vi är">
        <p>
          Alpkoll är ett jämförelseverktyg för skidorter som drivs från Sverige.
          Du når oss på <Lank href={`mailto:${KONTAKT}`}>{KONTAKT}</Lank>.
        </p>
      </Avsnitt>

      <Avsnitt titel="Vilka uppgifter vi samlar in">
        <p>
          <Stark>Så lite som möjligt.</Stark> Alpkoll kräver inget konto, och vi
          lagrar inga personuppgifter i vår databas.
        </p>
        <p style={{ marginTop: 12 }}>
          <Stark>Besöksstatistik:</Stark> vi använder Vercel Web Analytics, som
          inte sätter kakor och inte samlar in personuppgifter. Den räknar
          anonyma sidvisningar — din IP-adress lagras inte, ingen enhet
          fingeravtrycks och inget följs mellan olika sajter.
        </p>
        <p style={{ marginTop: 12 }}>
          <Stark>Länkar vidare:</Stark> när du klickar dig vidare till en
          tredjepartstjänst, till exempel Booking.com, kan den tjänsten sätta
          egna kakor på sin egen webbplats. Det ligger utanför vår kontroll,
          och där gäller deras integritetspolicy.
        </p>

        {/* Stycket beskriver en behandling som inte sker förrän
            affiliatespårningen är påslagen. Utan ID byggs en vanlig
            söklänk, ingenting skickas till något nätverk, och en policy
            som beskriver det ändå hade varit lika fel som en som tiger
            när det väl sker. Samma flagga styr annonsmärkningen. */}
        {hasAffiliateId && (
          <p style={{ marginTop: 12 }}>
            <Stark>När du klickar på en partnerlänk:</Stark> våra länkar till
            Booking.com går via affiliatenätverket CJ, som drivs av Epsilon
            International UK Ltd. I samma stund som du klickar tar de emot din
            IP-adress, uppgifter om din webbläsare, tidpunkten och vilken sida
            på Alpkoll du kom från. Det sker för att Booking ska veta att
            besökaren kom härifrån, så att vi får provision om du bokar. CJ är
            själva personuppgiftsansvariga för den behandlingen, uppgifterna
            behandlas på servrar i USA med EU-kommissionens standardavtalsklausuler
            som skydd, och de sparas i upp till sex år. Ingenting av detta sker
            medan du läser — bara när du klickar.
          </p>
        )}
      </Avsnitt>

      <Avsnitt titel="Var uppgifterna lagras">
        <p>
          Vår databas med skidorter ligger hos Supabase i Stockholm
          (EU-regionen eu-north-1). Webbplatsen körs hos Vercel. Inga
          personuppgifter om besökare lagras i något av systemen.
        </p>
      </Avsnitt>

      <Avsnitt titel="Kakor">
        <p>
          Alpkoll sätter inga egna kakor. Vi använder varken
          spårningskakor, annonskakor eller analyskakor, och därför finns det
          heller ingen kakruta att klicka bort. Det gäller även
          partnerlänkarna: de är vanliga länkar, och ingenting från vår
          partner laddas eller lagras medan du är kvar på Alpkoll. Tjänster vi
          länkar till kan använda kakor på sina egna domäner.
        </p>
      </Avsnitt>

      <Avsnitt titel="Dina rättigheter enligt GDPR">
        <p>
          Eftersom vi inte samlar in personuppgifter finns det normalt
          ingenting att begära ut eller radera. Skulle du ändå tro att vi har
          uppgifter om dig har du rätt att:
        </p>
        <ul style={{ marginTop: 8, paddingLeft: 20 }}>
          <li>begära tillgång till dina uppgifter</li>
          <li>begära rättelse eller radering av dem</li>
          <li>invända mot behandlingen</li>
          <li>lämna klagomål till Integritetsskyddsmyndigheten (IMY)</li>
        </ul>
        <p style={{ marginTop: 12 }}>
          Hör av dig till <Lank href={`mailto:${KONTAKT}`}>{KONTAKT}</Lank> i
          frågor som rör personuppgifter.
        </p>
      </Avsnitt>

      <Avsnitt titel="Ändringar i policyn">
        <p>
          Vi kan komma att uppdatera den här policyn. Datumet högst upp på
          sidan visar när den senast ändrades.
        </p>
      </Avsnitt>
    </JuridiskSida>
  );
}
