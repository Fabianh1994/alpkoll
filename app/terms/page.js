// app/terms/page.js
import JuridiskSida, { Avsnitt, Lank, KONTAKT } from '../JuridiskSida';

export const metadata = {
  title: 'Användarvillkor — Alpkoll',
  description:
    'Villkoren för att använda Alpkoll: vad sajten är, vad siffrorna bygger på och vad vi inte lovar.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <JuridiskSida titel="Användarvillkor" uppdaterad="augusti 2026">
      <Avsnitt titel="Vad Alpkoll är">
        <p>
          Alpkoll är ett kostnadsfritt verktyg för att jämföra skidorter. Vi
          hjälper dig att utforska och ställa orter mot varandra utifrån
          offentligt tillgängliga uppgifter om snö, terräng, priser och
          resväg. Vi säljer varken liftkort, flyg eller boende.
        </p>
      </Avsnitt>

      <Avsnitt titel="Inga garantier">
        <p>
          Uppgifterna om orterna — priser, snödjup, säsongsdatum, pistlängder —
          är hämtade från offentliga källor och uppdateras för hand. Vi gör vad
          vi kan för att hålla dem korrekta, men förhållanden ändras. Kontrollera
          alltid avgörande uppgifter hos orten eller researrangören innan du
          bokar.
        </p>
        <p style={{ marginTop: 12 }}>
          Alpkoll tillhandahålls i befintligt skick, utan garantier av något
          slag. Vi ansvarar inte för beslut som fattas utifrån det som visas
          här.
        </p>
      </Avsnitt>

      <Avsnitt titel="Affiliate-länkar">
        <p>
          Vissa länkar på Alpkoll går vidare till tredjepartstjänster, till
          exempel Booking.com. Det är affiliate-länkar, vilket betyder att vi
          kan få en mindre provision om du bokar via dem. Priset du betalar
          påverkas inte.
        </p>
        <p style={{ marginTop: 12 }}>
          Samarbetena påverkar inte hur orterna presenteras eller i vilken
          ordning de visas. Det avgörs av data — samma källa och samma fält för
          alla orter — inte av kommersiella avtal. Läs mer i vår{' '}
          <Lank href="/affiliate-disclosure">affiliateinformation</Lank>.
        </p>
      </Avsnitt>

      <Avsnitt titel="Din användning av sajten">
        <p>
          Du får använda Alpkoll för personligt, icke-kommersiellt bruk. Du får
          inte skrapa, kopiera eller vidaredistribuera vårt innehåll eller vår
          databas utan tillstånd.
        </p>
      </Avsnitt>

      <Avsnitt titel="Immateriella rättigheter">
        <p>
          Namnet Alpkoll, logotypen, formgivningen och de texter vi själva
          skrivit tillhör Alpkoll. Bilderna på orterna kommer från offentligt
          tillgängligt material och används i informationssyfte.
        </p>
      </Avsnitt>

      <Avsnitt titel="Ändringar i villkoren">
        <p>
          Vi kan komma att uppdatera de här villkoren. Att fortsätta använda
          sajten efter att ändringar publicerats innebär att du godtar de
          uppdaterade villkoren.
        </p>
      </Avsnitt>

      <Avsnitt titel="Kontakt">
        <p>
          Frågor om villkoren? Skriv till{' '}
          <Lank href={`mailto:${KONTAKT}`}>{KONTAKT}</Lank>.
        </p>
      </Avsnitt>
    </JuridiskSida>
  );
}
