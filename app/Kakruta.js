'use client';

// Kakrutan: frågar om Microsoft Clarity får spela in hur sidan används,
// och laddar Clarity först efter ett ja.
//
// Kraven den är byggd efter (lagen om elektronisk kommunikation 9 kap. 28 §,
// GDPR och IMY:s vägledning om kakor):
//  - Inget laddas och ingen kaka sätts innan besökaren tryckt "Ja, det är okej".
//  - Ja- och nej-knappen är lika stora och ser likadana ut. Ett nej ska vara
//    lika lätt som ett ja.
//  - Inga förifyllda val. Att stänga eller scrolla förbi rutan är inget ja.
//  - Valet går att ändra när som helst, via "Kakinställningar" i sidfoten.
//
// Rutan täcker inte sidan och har ingen mörk bakgrund bakom sig: två av tre
// besökare läser på mobil, och en ruta som döljer innehållet får många att
// lämna. På mobil ligger den ovanför menyraden längst ner, på dator i
// nedre vänstra hörnet.
//
// Valet sparas i localStorage och inte i en kaka. Att minnas ett nej är
// nödvändigt för att kunna respektera det och kräver inget samtycke.

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  CLARITY_ID,
  OPPNA_KAKRUTAN,
  SAMTYCKE_GILTIGT_MS,
  SAMTYCKE_NYCKEL,
  SAMTYCKE_VERSION,
} from '../lib/clarity';

function lasVal() {
  try {
    const rad = JSON.parse(window.localStorage.getItem(SAMTYCKE_NYCKEL));
    if (!rad || rad.v !== SAMTYCKE_VERSION) return null;
    if (rad.val !== 'ja' && rad.val !== 'nej') return null;
    if (typeof rad.t !== 'number' || Date.now() - rad.t > SAMTYCKE_GILTIGT_MS) return null;
    return rad.val;
  } catch {
    // Privat läge eller blockerad lagring: inget sparat val, rutan frågar.
    return null;
  }
}

function sparaVal(val) {
  try {
    window.localStorage.setItem(
      SAMTYCKE_NYCKEL,
      JSON.stringify({ val, v: SAMTYCKE_VERSION, t: Date.now() })
    );
    return true;
  } catch {
    // Går valet inte att spara gäller det ändå resten av besöket.
    return false;
  }
}

// Clarity-koden som Microsoft anger, med ID:t som argument. Skriptet
// hämtas från clarity.ms först här.
function laddaClarity() {
  if (window.alpkollClarityLaddad) return;
  (function (c, l, a, r, i) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    const t = l.createElement(r);
    t.async = 1;
    t.src = 'https://www.clarity.ms/tag/' + i;
    const y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', CLARITY_ID);
  // Flaggan ligger på window, inte på window.clarity: clarity.js byter ut
  // funktionen när det laddats.
  window.alpkollClarityLaddad = true;

  // Sedan oktober 2025 kräver Clarity en samtyckessignal för besökare i
  // EES. Analys är godkänt; annonslagring nekas, Alpkoll använder ingen.
  window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
}

function raderaKakor() {
  const bas = window.location.hostname.split('.').slice(-2).join('.');
  for (const namn of ['_clck', '_clsk']) {
    for (const doman of ['', `; domain=${window.location.hostname}`, `; domain=.${bas}`]) {
      document.cookie = `${namn}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${doman}`;
    }
  }
}

// Vid ett nej efter ett tidigare ja: säg nej till Clarity med samma API som
// gav ja, be det radera sina kakor, ta bort förstapartskakorna själva och
// ladda om, så att inget Clarity-skript ligger kvar i minnet. Omladdningen
// väntar en stund så att nej-signalen hinner iväg, och kakorna raderas en
// gång till precis före, ifall Clarity skrivit dem på nytt.
// Microsofts egna kakor på clarity.ms och bing.com kan bara Microsoft radera.
function stangAvClarity() {
  try {
    if (window.clarity) {
      window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' });
      window.clarity('consent', false);
    }
  } catch {
    // Skriptet kan vara blockerat av en annonsblockerare.
  }
  raderaKakor();
  window.setTimeout(() => {
    raderaKakor();
    window.location.reload();
  }, 400);
}

const knapp = {
  flex: 1,
  minHeight: 44,
  padding: '10px 16px',
  fontFamily: 'var(--font-body)',
  fontSize: 15,
  fontWeight: 600,
  color: '#f0ece4',
  background: 'rgba(212,165,116,0.10)',
  border: '1px solid rgba(212,165,116,0.55)',
  borderRadius: 8,
  cursor: 'pointer',
};

// Valet läses ur localStorage som en extern källa. Servern får 'server',
// så att sidan renderas utan ruta där och rutan dyker upp först när
// webbläsaren läst valet.
const VAL_ANDRAT = 'alpkoll:samtycke-andrat';
function prenumerera(uppdatera) {
  window.addEventListener('storage', uppdatera);
  window.addEventListener(VAL_ANDRAT, uppdatera);
  return () => {
    window.removeEventListener('storage', uppdatera);
    window.removeEventListener(VAL_ANDRAT, uppdatera);
  };
}

export default function Kakruta() {
  const val = useSyncExternalStore(prenumerera, lasVal, () => 'server');
  // Satt när rutan öppnats från sidfoten trots att ett val redan finns.
  const [oppnad, setOppnad] = useState(false);
  // Valet i minnet, för när localStorage inte går att skriva till.
  const [valIMinnet, setValIMinnet] = useState(null);
  const forstaKnapp = useRef(null);
  const ruta = useRef(null);
  // Elementet som öppnade rutan, så att fokus kan lämnas tillbaka dit.
  const oppnadesFran = useRef(null);
  // Rutans höjd, så att sidans slut går att scrolla fram ovanför den.
  const [hojd, setHojd] = useState(0);

  const galler = valIMinnet ?? val;
  const visas = val !== 'server' && (galler === null || oppnad);

  useEffect(() => {
    if (galler === 'ja') laddaClarity();
    // Ett nej i en annan flik når hit via storage-händelsen. Är Clarity
    // laddat i den här fliken stängs det av här också.
    if (galler === 'nej' && window.alpkollClarityLaddad) stangAvClarity();
  }, [galler]);

  useEffect(() => {
    const oppna = () => {
      oppnadesFran.current = document.activeElement;
      setOppnad(true);
    };
    window.addEventListener(OPPNA_KAKRUTAN, oppna);
    return () => window.removeEventListener(OPPNA_KAKRUTAN, oppna);
  }, []);

  // Öppnas rutan från sidfoten flyttas fokus dit, så att den som använder
  // tangentbord eller skärmläsare hamnar rätt. Vid första besöket tas
  // fokus inte, då skulle rutan avbryta läsningen.
  useEffect(() => {
    if (oppnad) forstaKnapp.current?.focus();
  }, [oppnad]);

  useEffect(() => {
    if (!visas || !ruta.current) return;
    const obs = new ResizeObserver(([e]) => setHojd(e.target.offsetHeight));
    obs.observe(ruta.current);
    return () => obs.disconnect();
  }, [visas]);

  const valj = (nytt) => {
    const sparat = sparaVal(nytt);
    // Valet hålls i minnet bara om det inte gick att spara. Annars gäller
    // det sparade, så att ett nej i en annan flik slår igenom här.
    setValIMinnet(sparat ? null : nytt);
    setOppnad(false);
    window.dispatchEvent(new Event(VAL_ANDRAT));
    oppnadesFran.current?.focus?.();
    oppnadesFran.current = null;
  };

  if (!visas) return null;

  return (
    <>
    {/* Lika högt som rutan, i sidans flöde längst ner, så att sidfoten
        och sidans slut går att scrolla fram ovanför rutan. */}
    <div aria-hidden="true" style={{ height: hojd + 24 }} />
    <section
      ref={ruta}
      role="region"
      aria-labelledby="kakruta-rubrik"
      aria-describedby="kakruta-text"
      className="kakruta"
      style={{
        position: 'fixed',
        zIndex: 300,
        background: '#1c1a17',
        border: '1px solid rgba(212,165,116,0.25)',
        borderRadius: 12,
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        padding: '14px 16px 16px',
        color: '#f0ece4',
        fontFamily: 'var(--font-body)',
      }}
    >
      <h2 id="kakruta-rubrik" style={{
        fontFamily: 'var(--font-body)',
        fontSize: 15,
        fontWeight: 600,
        margin: '0 0 4px',
        color: '#f0ece4',
      }}>
        Får Alpkoll använda Microsoft Clarity?
      </h2>
      <p id="kakruta-text" style={{
        fontSize: 13,
        lineHeight: 1.5,
        margin: '0 0 12px',
        color: 'rgba(240,236,228,0.72)',
      }}>
        Det spelar in klick och scroll och sätter kakor.{' '}
        <Link href="/privacy#kakor" style={{ color: '#D4A574', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Läs mer ›
        </Link>
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button ref={forstaKnapp} type="button" style={knapp} onClick={() => valj('nej')}>
          Nej, tack
        </button>
        <button type="button" style={knapp} onClick={() => valj('ja')}>
          Ja, det är okej
        </button>
      </div>

      <style>{`
        .kakruta {
          left: 12px;
          right: 12px;
          /* Ovanför menyraden längst ner: 10 px luft + 48 px flikar. */
          bottom: calc(70px + env(safe-area-inset-bottom, 0px));
        }
        .kakruta button:hover { background: rgba(212,165,116,0.2) !important; }
        .kakruta button:focus-visible { outline: 2px solid #D4A574; outline-offset: 2px; }
        @media (min-width: 769px) {
          .kakruta { left: 24px; right: auto; bottom: 24px; max-width: 400px; }
        }
        /* Liggande telefon: rubriken stryks så att rutan tar mindre plats. */
        @media (max-height: 500px) {
          .kakruta h2 { display: none; }
          .kakruta p { margin-bottom: 8px !important; }
        }
      `}</style>
    </section>
    </>
  );
}
