// app/sa-jamfor-vi/page.js
//
// Sidan finns för att marknadsföringslagen kräver den. Sedan
// omnibusreglerna 1 september 2022 ska den som låter konsumenter söka
// digitalt bland erbjudanden redovisa vad som främst avgör ordningen
// resultaten presenteras i, och hur kriterierna väger mot varandra.
// Informationen ska stå i ett eget avsnitt som är direkt tillgängligt
// från den plats där resultaten visas — därav länkarna från /jamfor,
// jämförelsesidorna och sidfoten.
//
// Underlaget är docs/poangskala.md, men sidan är inte en kopia av det.
// Dokumentet är skrivet för den som sätter poäng; det här är skrivet för
// den som läser dem. Går de isär ska dokumentet vinna — det är där
// skälen står utskrivna.
//
// Brasklappen om mittfältet står med flit. Poängskalan säger själv att
// de befintliga orterna inte är omsatta enligt den nya skalan, och att
// dölja det hade gjort sidan till marknadsföring i stället för
// upplysning.

import JuridiskSida, { Avsnitt, Lank, Stark } from '../JuridiskSida';
import { getResorts } from '../../lib/resorts';
import { harPris } from '../../lib/liftkortspriser';
import { DELOMRADEN } from '../../lib/delomraden';

// Antalen räknas ur datan. Handskrivna tal här ("sex orter utan pris",
// "trettio orter av trettioåtta", "170 kilometer") stod kvar långt efter
// att urvalet och talen ändrats (omgång 10, migration 049).
export const revalidate = 3600;

const NORDEN = new Set(['Sweden', 'Norway', 'Finland']);

const ORD = ['noll', 'en', 'två', 'tre', 'fyra', 'fem', 'sex', 'sju', 'åtta', 'nio', 'tio', 'elva', 'tolv'];
const ord = (n) => ORD[n] || String(n);

/** "A", "A och B", "A, B och C". */
const lista = (namn) =>
  namn.length < 2 ? namn.join('') : `${namn.slice(0, -1).join(', ')} och ${namn[namn.length - 1]}`;

export const metadata = {
  title: 'Så jämför vi skidorterna — Alpkoll',
  description:
    'Vad som avgör ordningen orterna visas i, var siffrorna kommer ifrån och hur poängen sätts. Ingen ort kan betala för placering.',
  alternates: { canonical: '/sa-jamfor-vi' },
};

export default async function SaJamforViPage() {
  const orter = await getResorts();

  const utanPris = orter.filter((r) => !harPris(r)).length;
  const summerade = orter.filter((r) => DELOMRADEN[r.slug]);
  const exempel = summerade.find((r) => r.slug === 'chamonix') || summerade[0];

  const norden = orter.filter((r) => NORDEN.has(r.country)).length;
  const andorra = orter.filter((r) => r.country === 'Andorra');
  const alperna = orter.length - norden - andorra.length;
  const andorraText = andorra.length === 1 ? andorra[0].name : ord(andorra.length);
  const regioner = andorra.length
    ? `${ord(alperna)} i Alperna, ${ord(norden)} i Norden och ${andorraText} i Andorra`
    : `${ord(alperna)} i Alperna och ${ord(norden)} i Norden`;

  return (
    <JuridiskSida titel="Så jämför vi" etikett="Om siffrorna" uppdaterad="november 2026">
      <Avsnitt titel="Ordningen är inte en rangordning">
        <p>
          <Stark>Listorna står i bokstavsordning.</Stark> Både startsidans
          ortlista och väljaren på jämförelsesidan sorteras på namn, med svensk
          bokstavsordning så att Åre hamnar sist och inte bland A:na. Ingen ort
          ligger högre upp för att den är bättre, populärare eller lönsammare
          för oss.
        </p>
        <p style={{ marginTop: 12 }}>
          <Stark>Prislistan sorteras på pris</Stark> när du väljer det, och
          ingenting annat.
        </p>
        <p style={{ marginTop: 12 }}>
          <Stark>I jämförelsetabellen markeras det bästa värdet i varje rad.</Stark>{' '}
          Den markeringen är mekanisk: raden Pist totalt markerar det högre
          talet, raden Liftkortspris det lägre. Delar två orter samma tal
          markeras ingen av dem. Vad som räknas som bäst står i radens egen
          riktning, inte i något omdöme om orten.
        </p>
      </Avsnitt>

      <Avsnitt titel="Var siffrorna kommer ifrån">
        <p>
          <Stark>En källa för alla orter: skiresort.com.</Stark> Pist, liftar,
          höjder och fördelningen mellan blå, röd och svart hämtas därifrån för
          samtliga orter. Orternas egen marknadsföring anger ofta högre tal, men
          blandade källor gör orterna ojämförbara — och det är jämförelsen som
          är hela poängen.
        </p>
        <p style={{ marginTop: 12 }}>
          <Stark>Priserna kommer ur varje orts egen prislista</Stark>, med
          säsongen utskriven intill beloppet. Ett pris vi inte kunnat hämta och
          kontrollera visas inte alls — ett tal vi inte kan belägga är sämre än
          inget tal.{' '}
          {utanPris > 0 ? (
            <>
              Därför står {ord(utanPris)} {utanPris === 1 ? 'ort' : 'orter'} utan
              pris i dag, med skälet utskrivet på{' '}
              <Lank href="/liftkortspriser">prislistesidan</Lank>.
            </>
          ) : (
            <>
              I dag har alla orter på sajten ett pris, och{' '}
              <Lank href="/liftkortspriser">prislistesidan</Lank> visar vad
              varje kort gäller.
            </>
          )}
        </p>
        <p style={{ marginTop: 12 }}>
          <Stark>Restiderna är uppmätta</Stark>, inte uppskattade: körsträckan
          från hundra svenska tätorter är räknad med vägdata, och nattågets
          tider är hämtade ur tågbolagens tidtabeller.
        </p>
        {exempel && (
          <p style={{ marginTop: 12 }}>
            {summerade.length === 1
              ? `${exempel.name} har tal som är summan av flera områden som inte når varandra med lift.`
              : `${lista(summerade.map((r) => r.name))} har tal som är summan av flera områden som inte når varandra med lift.`}{' '}
            Där listas delarna var för sig på ortsidan, eftersom de{' '}
            {exempel.total_pistes_km} kilometrarna i {exempel.name} ligger i
            skilda områden och inte är jämförbara med 150 kilometer som hänger
            ihop.
          </p>
        )}
      </Avsnitt>

      <Avsnitt titel="Poängen är omdömen, inte mätvärden">
        <p>
          De tolv poängen mellan 1 och 10 — snösäkerhet, nybörjarnivå, offpist,
          bykänsla och de andra — är redaktionella bedömningar. Det gör dem inte
          godtyckliga: varje skala har namngivna orter i topp och botten, och en
          ny ort placeras genom att jämföras med dem. Zermatt är tia på
          snösäkerhet därför att pisten når 3 899 meter på glaciär; Sälen är
          en sexa därför att orten ligger mellan 572 och 887 meter.
        </p>
        <p style={{ marginTop: 12 }}>
          <Stark>En poäng måste gå att belägga med en faktamening.</Stark> Kan
          motiveringen inte skrivas utan att beskriva vår egen smak hör poängen
          inte hemma här. På det testet föll omdömet om naturskönhet, som togs
          bort: att Dolomiterna är vackrare än Dalarna är ett tycke.
        </p>
        <p style={{ marginTop: 12 }}>
          <Stark>Var ärliga med precisionen:</Stark> poängen är jämförbara i
          topp och botten, men mittfältet är ännu inte genomgånget ort för ort.
          En sjua bredvid en annan sjua säger därför mindre än en tia bredvid en
          trea. Arbetet med mitten pågår, och tills det är klart bör du läsa
          motiveringarna snarare än talen när två orter ligger nära varandra.
        </p>
      </Avsnitt>

      <Avsnitt titel="Vad som inte påverkar någonting">
        <p>
          <Stark>Ingen ort kan betala för placering</Stark>, och ingen betalar
          för att finnas med. Vi tar inte emot ersättning från skidorter,
          liftbolag eller researrangörer för hur de presenteras.
        </p>
        <p style={{ marginTop: 12 }}>
          Sajten finansieras av affiliatelänkar till bokningstjänster, och de
          länkarna är märkta där de står. Provisionen påverkar varken ordningen,
          poängen eller vilka orter som finns på sajten — den hänger på om du
          bokar boende, inte på vilken ort du väljer. Mer om det står i vår{' '}
          <Lank href="/affiliate-disclosure">affiliateinformation</Lank>.
        </p>
      </Avsnitt>

      <Avsnitt titel="Vilka orter som visas">
        <p>
          På sajten finns i dag {ord(orter.length)} orter: {regioner}. Fler
          orter ligger i databasen men visas inte. Orterna utanför Europa är
          sällan aktuella för en svensk skidvecka, och några alpina orter står
          utanför urvalet av redaktionella skäl. En ort kan också vara dold
          medan något fattas, till exempel en bild vi har rätt att visa.
        </p>
        <p style={{ marginTop: 12 }}>
          Jämförelseverktyget låter dig ställa vilka två publicerade orter som
          helst mot varandra. Att en jämförelse inte är länkad från sajten
          betyder bara att vi inte skrivit något om just det paret.
        </p>
      </Avsnitt>

      <Avsnitt titel="Hittar du ett fel?">
        <p>
          Siffror åldras och orter bygger nya liftar. Ser du något som inte
          stämmer, skriv till{' '}
          <Lank href="mailto:hello@alpkoll.com">hello@alpkoll.com</Lank> — det
          är den snabbaste vägen att få det rättat.
        </p>
      </Avsnitt>
    </JuridiskSida>
  );
}
