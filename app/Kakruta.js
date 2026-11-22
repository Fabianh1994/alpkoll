'use client';

// Kakrutan: frågar om Microsoft Clarity får spela in hur sidan används,
// och laddar Clarity först efter ett ja.
//
// Kraven den är byggd efter (lagen om elektronisk kommunikation 9 kap. 28 §,
// GDPR och IMY:s vägledning om kakor):
//  - Inget laddas och ingen kaka sätts innan besökaren tryckt Godkänn.
//  - Godkänn och Neka är lika stora och ser likadana ut. Ett nej ska vara
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
  } catch {
    // Går valet inte att spara gäller det ändå resten av besöket.
  }
}

// Clarity-koden som Microsoft anger, med ID:t som argument. Skriptet
// hämtas från clarity.ms först här.
function laddaClarity() {
  if (window.clarity && window.clarity.alpkollLaddad) return;
  (function (c, l, a, r, i) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    const t = l.createElement(r);
    t.async = 1;
    t.src = 'https://www.clarity.ms/tag/' + i;
    const y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', CLARITY_ID);
  window.clarity.alpkollLaddad = true;

  // Sedan oktober 2025 kräver Clarity en samtyckessignal för besökare i
  // EES. Analys är godkänt; annonslagring nekas, Alpkoll använder ingen.
  window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
}

// Vid ett nej efter ett tidigare ja: be Clarity radera sina kakor och sluta
// spela in, och ta bort förstapartskakorna själva ifall skriptet inte
// hunnit ladda. Microsofts kakor på clarity.ms kan bara Microsoft radera.
function stangAvClarity() {
  try {
    if (window.clarity) window.clarity('consent', false);
  } catch {
    // Skriptet kan vara blockerat av en annonsblockerare.
  }
  const bas = window.location.hostname.split('.').slice(-2).join('.');
  for (const namn of ['_clck', '_clsk']) {
    for (const doman of ['', `; domain=${window.location.hostname}`, `; domain=.${bas}`]) {
      document.cookie = `${namn}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${doman}`;
    }
  }
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

  const galler = valIMinnet ?? val;
  const visas = val !== 'server' && (galler === null || oppnad);

  useEffect(() => {
    if (galler === 'ja') laddaClarity();
  }, [galler]);

  useEffect(() => {
    const oppna = () => setOppnad(true);
    window.addEventListener(OPPNA_KAKRUTAN, oppna);
    return () => window.removeEventListener(OPPNA_KAKRUTAN, oppna);
  }, []);

  // Öppnas rutan från sidfoten flyttas fokus dit, så att den som använder
  // tangentbord eller skärmläsare hamnar rätt. Vid första besöket tas
  // fokus inte, då skulle rutan avbryta läsningen.
  useEffect(() => {
    if (oppnad) forstaKnapp.current?.focus();
  }, [oppnad]);

  const valj = (nytt) => {
    const tidigare = galler;
    sparaVal(nytt);
    setValIMinnet(nytt);
    setOppnad(false);
    window.dispatchEvent(new Event(VAL_ANDRAT));
    if (nytt === 'nej' && tidigare === 'ja') {
      stangAvClarity();
      // Laddar om så att inget Clarity-skript ligger kvar i minnet.
      window.location.reload();
    }
  };

  if (!visas) return null;

  return (
    <section
      role="dialog"
      aria-modal="false"
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
        Får Alpkoll se hur sidan används?
      </h2>
      <p id="kakruta-text" style={{
        fontSize: 13,
        lineHeight: 1.5,
        margin: '0 0 12px',
        color: 'rgba(240,236,228,0.72)',
      }}>
        Säger du ja spelar Microsoft Clarity in klick och scroll och sätter
        kakor för det. Sajten fungerar likadant om du nekar.{' '}
        <a href="/privacy#kakor" style={{ color: '#D4A574', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Läs mer ›
        </a>
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button ref={forstaKnapp} type="button" style={knapp} onClick={() => valj('nej')}>
          Neka
        </button>
        <button type="button" style={knapp} onClick={() => valj('ja')}>
          Godkänn
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
      `}</style>
    </section>
  );
}
