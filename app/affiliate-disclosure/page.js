// app/affiliate-disclosure/page.js
import JuridiskSida, { Avsnitt, Lank, Stark, KONTAKT } from '../JuridiskSida';
import { hasAffiliateId } from '../../lib/booking';
import { PLANERAREN_SYNLIG } from '../../lib/features';

export const metadata = {
  title: 'Affiliateinformation — Alpkoll',
  description:
    'Hur Alpkoll finansieras: affiliate-länkar till Booking.com, vad de betyder för dig och varför de inte påverkar hur orterna presenteras.',
  alternates: { canonical: '/affiliate-disclosure' },
};

export default function AffiliateDisclosurePage() {
  return (
    <JuridiskSida titel="Affiliateinformation" uppdaterad="augusti 2026">
      <Avsnitt titel="Hur Alpkoll finansieras">
        <p>
          Alpkoll är gratis att använda. Sajten finansieras genom
          affiliate-samarbeten — klickar du dig vidare till en tjänst och bokar
          där kan vi få en mindre provision. Det är så sajten kan drivas utan
          att kosta dig något.
        </p>
      </Avsnitt>

      <Avsnitt titel="Vilka vi länkar till">
        <p>Utgående länkar som kan ge provision går till:</p>
        <ul style={{ marginTop: 8, paddingLeft: 20 }}>
          <li>
            <Stark>Booking.com</Stark> — boende på orten
          </li>
          {/* Flygsöket ligger i reseplaneraren, som är dold tills den är
              genomgången (se lib/features.js). Att räkna upp Skyscanner som
              en länk läsaren kan klicka på vore fel så länge sidan inte syns. */}
          {PLANERAREN_SYNLIG && (
            <li>
              <Stark>Skyscanner</Stark> — flygsök och prisjämförelse
            </li>
          )}
        </ul>
        <p style={{ marginTop: 12 }}>
          Klickar du på en sådan länk hamnar du hos partnern. Bokningen sker
          mellan dig och den tjänsten — Alpkoll är inte part i affären. Sådana
          länkar är märkta med <code>rel=&quot;sponsored&quot;</code>, som
          branschstandarden föreskriver.
        </p>
        {hasAffiliateId && (
          <p style={{ marginTop: 12 }}>
            Samarbetet med Booking.com går via affiliatenätverket CJ, som sköter
            mätning och utbetalning. Vad som skickas dit när du klickar står i
            vår <Lank href="/privacy">integritetspolicy</Lank>.
          </p>
        )}

        {hasAffiliateId && (
          <p style={{ marginTop: 12 }}>
            Varje sådan länk är märkt med ordet Annons där den står, så att du
            ser vad den är innan du klickar och inte behöver leta reda på den
            här sidan för att få veta det.
          </p>
        )}

        <p style={{ marginTop: 12 }}>
          Tillkommer fler partner uppdateras den här listan.
        </p>
      </Avsnitt>

      <Avsnitt titel="Påverkar det vad ni rekommenderar?">
        <p>
          <Stark>Nej.</Stark> Ingen ort hamnar högre upp för att det finns ett
          affiliate-avtal, och ingen ort kan betala för placering. Pist, liftar
          och höjder kommer från samma källa för alla orter, och priserna från
          varje orts egen prislista. Poängen är våra egna omdömen, satta efter
          samma skala för alla orter.
        </p>
        <p style={{ marginTop: 12 }}>
          Öppenhet är hela poängen med sajten. Undrar du hur siffrorna tas fram
          står det på <Lank href="/about">om-sidan</Lank>.
        </p>
      </Avsnitt>

      <Avsnitt titel="Kostar det dig mer?">
        <p>
          Nej. Priset hos partnern är detsamma oavsett om du kommer via Alpkoll
          eller går dit direkt. Provisionen betalas av partnern, inte av dig.
        </p>
      </Avsnitt>

      <Avsnitt titel="Kontakt">
        <p>
          Frågor? Skriv till <Lank href={`mailto:${KONTAKT}`}>{KONTAKT}</Lank>.
        </p>
      </Avsnitt>
    </JuridiskSida>
  );
}
