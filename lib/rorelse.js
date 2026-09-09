'use client';

// Vet om besökaren bett systemet om minskad rörelse.
//
// Regeln i app/globals.css nollar övergångarnas längd och räcker för allt
// som rör sig i CSS. Den ser däremot inte rörelse som räknas fram i
// JavaScript: hjältebildens parallax flyttas av en scrollyssnare, och den
// magnetiska knappen av musens position. Båda måste stå still här.
//
// useSyncExternalStore och inte useState plus useEffect: matchMedia är
// precis en sådan extern källa kroken finns för, och servern får sitt
// eget svar. Servern vet inte vad besökaren valt, så den svarar false —
// samma utfall som en webbläsare utan inställningen, vilket gör att
// serverns HTML och klientens första rendering är lika.

import { useSyncExternalStore } from 'react';

const FRAGA = '(prefers-reduced-motion: reduce)';

function prenumerera(vidByte) {
  // matchMedia saknas inte i någon webbläsare vi bryr oss om, men sidan
  // ska inte krascha i en miljö utan den.
  if (typeof window.matchMedia !== 'function') return () => {};
  const fraga = window.matchMedia(FRAGA);
  fraga.addEventListener('change', vidByte);
  return () => fraga.removeEventListener('change', vidByte);
}

const lasIWebblasaren = () =>
  typeof window.matchMedia === 'function' && window.matchMedia(FRAGA).matches;

const lasPaServern = () => false;

export function useMinskadRorelse() {
  return useSyncExternalStore(prenumerera, lasIWebblasaren, lasPaServern);
}
