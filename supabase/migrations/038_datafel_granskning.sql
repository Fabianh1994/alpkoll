-- 038 — datafel från granskningen 2026-11-18
--
-- Alla tal lästa på skiresort.com 2026-11-18, samma källa som övriga orter.
--
-- ── Hemavan ── skiresort.com/en/ski-resort/hemavan/
--   470–1 135 m (vi: 540–1 054), 10 liftar (vi: 17), 30 km
--   lätt 19 km 63 %, medel 9 km 30 %, svår 2 km 7 % (vi: 35 / 40 / 25)
--   liftkapacitet 11 180 personer/tim (vi: 12 000)
--   Texten sade 32 km; pisten rättades till 30 km i migration 035.
--
-- ── Verbier ── 4 Vallées
--   65 liftar (vi: 68), liftkapacitet 94 509 personer/tim (vi: saknades)
--
-- ── Saas-Fee ──
--   lätt 21 %, medel 59 %, svår 20 % (vi: 20 / 60 / 20)
--   liftkapacitet 25 984 personer/tim (vi: 30 000)
--   Texten sade 100 km; pisten rättades till 101 km i migration 035.
--
-- ── Zermatt ── Zermatt – Breuil-Cervinia/Valtournenche – Matterhorn
--   liftkapacitet 96 074 personer/tim (vi: saknades)

begin;

UPDATE resorts SET
  altitude_base = 470, altitude_top = 1135, total_lifts = 10,
  blue_percent = 63, red_percent = 30, black_percent = 7,
  lift_capacity_per_hour = 11180,
  notes = replace(notes, 'Pisten är 32 kilometer', 'Pisten är 30 kilometer')
WHERE slug = 'hemavan';

UPDATE resorts SET total_lifts = 65, lift_capacity_per_hour = 94509
WHERE slug = 'verbier';

UPDATE resorts SET
  blue_percent = 21, red_percent = 59, black_percent = 20,
  lift_capacity_per_hour = 25984,
  notes = replace(notes, 'Pisten är 100 kilometer', 'Pisten är 101 kilometer')
WHERE slug = 'saas-fee';

UPDATE resorts SET lift_capacity_per_hour = 96074
WHERE slug = 'zermatt';

commit;

-- ── Efterkontroll ─────────────────────────────────────────────────────
--   SELECT slug, altitude_base, altitude_top, total_lifts, blue_percent,
--          red_percent, black_percent, lift_capacity_per_hour,
--          position('30 kilometer' in notes) > 0 AS hem30,
--          position('101 kilometer' in notes) > 0 AS sf101
--   FROM resorts WHERE slug IN ('hemavan', 'verbier', 'saas-fee', 'zermatt');
--
--   Förväntat:
--     hemavan   470 / 1135 / 10 / 63 30 7 / 11180 / hem30 = true
--     verbier   65 liftar / 94509
--     saas-fee  21 59 20 / 25984 / sf101 = true
--     zermatt   96074
