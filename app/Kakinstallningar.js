'use client';

// Länken "Kakinställningar" i sidfoten. Öppnar kakrutan igen så att ett ja
// kan ändras till ett nej, lika enkelt som det gavs. Se app/Kakruta.js.

import { OPPNA_KAKRUTAN } from '../lib/clarity';

export default function Kakinstallningar({ className, style }) {
  return (
    <button
      type="button"
      className={className}
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', ...style }}
      onClick={() => window.dispatchEvent(new Event(OPPNA_KAKRUTAN))}
    >
      Kakinställningar
    </button>
  );
}
