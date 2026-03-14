// ─── Resort card ──────────────────────────────────────────────
function ResortCard({ resort }) {
  const [hover, setHover] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const flags = {
    'Switzerland': '🇨🇭', 'France': '🇫🇷', 'Austria': '🇦🇹',
    'Japan': '🇯🇵', 'Canada': '🇨🇦', 'USA': '🇺🇸',
    'Norway': '🇳🇴', 'Sweden': '🇸🇪', 'Finland': '🇫🇮',
    'Italy': '🇮🇹', 'Andorra': '🇦🇩', 'New Zealand': '🇳🇿',
    'Bulgaria': '🇧🇬',
  };

  return (
    <Link href={`/resort/${resort.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          borderRadius: 6, overflow: 'hidden', cursor: 'pointer',
          background: '#1c1a17',
          border: '1px solid rgba(255,255,255,0.04)',
          transition: 'border-color 0.35s, transform 0.35s',
          borderColor: hover ? 'rgba(212,165,116,0.2)' : 'rgba(255,255,255,0.04)',
          transform: hover ? 'translateY(-3px)' : 'none',
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: '#141210' }}>
          <img
            src={resort.image_url} alt={resort.name}
            onLoad={() => setLoaded(true)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              opacity: loaded ? 1 : 0,
              transform: hover ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.4s',
            }}
          />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
            background: 'linear-gradient(transparent, #1c1a17)',
          }} />
          <div style={{
            position: 'absolute', top: 12, left: 12,
            fontSize: 11, fontWeight: 500,
            fontFamily: 'var(--font-body)',
            color: 'rgba(255,255,255,0.75)',
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(8px)',
            padding: '4px 10px', borderRadius: 4,
            letterSpacing: '0.03em',
          }}>
            {flags[resort.country] || ''} {resort.country}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '16px 18px 24px' }}>
          <div style={{
            fontSize: 11, color: 'rgba(255,255,255,0.3)',
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4,
          }}>{resort.region}</div>
          <h3 style={{
            fontSize: 24,
            fontFamily: 'var(--font-heading)',
            fontWeight: 400, color: '#f0ece4',
            margin: '0 0 10px', lineHeight: 1.1,
            letterSpacing: '0.03em',
          }}>{resort.name}</h3>
          {resort.notes && (
            <p style={{
              fontSize: 13, fontFamily: 'var(--font-body)',
              color: 'rgba(255,255,255,0.4)',
              fontWeight: 300, margin: 0, lineHeight: 1.6,
            }}>{resort.notes}</p>
          )}
        </div>
      </div>
    </Link>
  );
}