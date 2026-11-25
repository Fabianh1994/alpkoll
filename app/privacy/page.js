// app/privacy/page.js
import JuridiskSida, { Avsnitt, Lank, Stark, KONTAKT } from '../JuridiskSida';
import { hasAffiliateId } from '../../lib/booking';
import { anvanderClarity } from '../../lib/clarity';
import Kakinstallningar from '../Kakinstallningar';

export const metadata = {
  title: 'Integritetspolicy — Alpkoll',
  // Beskrivningen följer brytaren i lib/clarity.js, så att Google inte
  // visar "inga kakor" när Clarity är påslaget.
  description: anvanderClarity
    ? 'Så hanterar Alpkoll dina uppgifter: inga konton, och kakor bara om du godkänner Microsoft Clarity. Övrig statistik är anonym och databasen ligger inom EU.'
    : 'Så hanterar Alpkoll dina uppgifter: inga konton, inga egna kakor, ingen spårning. Statistiken är anonym och databasen ligger inom EU.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <JuridiskSida titel="Integritetspolicy" uppdaterad={anvanderClarity ? 'november 2026' : 'augusti 2026'}>
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

        {anvanderClarity && (
          <p style={{ marginTop: 12 }}>
            <Stark>Om du godkänner det i kakrutan:</Stark> Microsoft Clarity
            registrerar hur du rör dig på sajten: klick, scroll, musrörelser,
            vilka sidor du besöker, din skärmstorlek och webbläsare. Microsoft
            tar också emot din IP-adress och räknar fram ungefär vilket land du
            är i. Det används för att se var sidorna är krångliga, i
            värmekartor och inspelningar av besök. Inspelningar sparas i 30
            dagar, klickdata och inspelningar vi markerar i 9 månader.
            Behandlingen vilar på ditt samtycke (artikel 6.1 a i GDPR), och du
            kan ta tillbaka det när som helst. Säger du nej, eller inget alls,
            laddas Clarity aldrig.
          </p>
        )}

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
        {anvanderClarity && (
          <p style={{ marginTop: 12 }}>
            Uppgifterna från Microsoft Clarity lagras hos Microsoft Corporation,
            också i USA. Microsoft deltar i EU–USA-ramverket för dataskydd,
            som EU-kommissionen godkänt för överföringar dit. För
            inspelningarna och värmekartorna är Microsoft vårt
            personuppgiftsbiträde. Kakan MUID, som Microsoft synkar via
            bing.com, använder Microsoft också för egna ändamål, och för den är
            Microsoft själva personuppgiftsansvariga.
          </p>
        )}
      </Avsnitt>

      <Avsnitt titel="Kakor" id="kakor">
        {anvanderClarity ? (
          <>
            <p>
              Alpkoll sätter kakor bara om du godkänner Microsoft Clarity i
              rutan som visas vid första besöket. Sajten fungerar likadant om
              du nekar. Ditt val gäller i tolv
              månader och sparas i din webbläsare (localStorage), inte i en kaka.
            </p>
            <p style={{ marginTop: 12 }}>Med ditt ja sätts:</p>
            <ul style={{ marginTop: 8, paddingLeft: 20 }}>
              <li><Stark>_clck</Stark> (alpkoll.se, ett år): ett slumpat ID som
                känner igen din webbläsare mellan besök.</li>
              <li><Stark>_clsk</Stark> (alpkoll.se, ett dygn): knyter ihop
                sidorna i ett besök till en inspelning.</li>
              <li><Stark>CLID, MUID med flera</Stark> (clarity.ms och bing.com,
                Microsofts egna kakor, ungefär ett år): känner igen webbläsaren
                hos Microsoft.</li>
            </ul>
            <p style={{ marginTop: 12 }}>
              Du kan ändra ditt val när som helst under{' '}
              <Kakinstallningar style={{
                font: 'inherit', color: '#D4A574',
              }} />{' '}
              i sidfoten. Ett nej raderar kakorna på alpkoll.se. Microsofts egna
              på clarity.ms och bing.com tar du bort i webbläsarens inställningar.
            </p>
            <p style={{ marginTop: 12 }}>
              Vercel Web Analytics och partnerlänkarna sätter inga kakor.
              Kartan på ortsidorna kommer från Google och laddas först när du
              klickar på Visa karta; då kan Google sätta sina kakor. Samma sak
              gäller reseplaneraren (Resan dit): Google laddas först när du
              klickar i adressfältet. Adressen du skriver skickas till Google
              för att räkna ut vägen och sparas inte av Alpkoll. Flygsökningen
              skickar bara flygplatskoder och datum till Travelpayouts. Tjänster
              vi länkar till kan använda kakor på sina egna domäner.
            </p>
          </>
        ) : (
        <p>
          Alpkoll sätter inga egna kakor. Vi använder varken
          spårningskakor, annonskakor eller analyskakor, och därför finns det
          heller ingen kakruta att klicka bort. Det gäller även
          partnerlänkarna: de är vanliga länkar, och ingenting från vår
          partner laddas eller lagras medan du är kvar på Alpkoll. Kartan på
          ortsidorna kommer från Google och laddas först när du klickar på
          Visa karta; då kan Google sätta sina kakor. Samma sak gäller
          reseplaneraren (Resan dit): Google laddas först när du klickar i
          adressfältet. Adressen du skriver skickas till Google för att räkna
          ut vägen och sparas inte av Alpkoll. Flygsökningen skickar bara
          flygplatskoder och datum till Travelpayouts. Tjänster vi länkar till
          kan använda kakor på sina egna domäner.
        </p>
        )}
      </Avsnitt>

      <Avsnitt titel="Dina rättigheter enligt GDPR">
        {anvanderClarity ? (
          <p>
            Har du godkänt Clarity finns uppgifter om ditt besök hos Microsoft
            under den tid som anges ovan. Annars samlar vi inte in några
            personuppgifter. Du har rätt att:
          </p>
        ) : (
          <p>
            Eftersom vi inte samlar in personuppgifter finns det normalt
            ingenting att begära ut eller radera. Skulle du ändå tro att vi har
            uppgifter om dig har du rätt att:
          </p>
        )}
        <ul style={{ marginTop: 8, paddingLeft: 20 }}>
          <li>begära tillgång till dina uppgifter</li>
          <li>begära rättelse eller radering av dem</li>
          <li>invända mot behandlingen</li>
          {anvanderClarity && <li>ta tillbaka ditt samtycke till Clarity</li>}
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
