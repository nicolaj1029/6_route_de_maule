/**
 * HeroLandscape.jsx
 * Illustrated SVG landscape — shown when real WebP photos are not yet available.
 * Replace photos in property.js to retire this component.
 */
export default function HeroLandscape() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#1A1A18' }}>
      {/* Sky */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(168deg, #8FA8C2 0%, #C4AB88 55%, #B8724A 100%)'
      }} />
      {/* Fields */}
      <div style={{
        position: 'absolute', bottom: '38%', left: 0, right: 0, height: '28%',
        background: 'linear-gradient(180deg, #7A9260 0%, #5A7A48 100%)',
        clipPath: 'polygon(0 35%, 20% 18%, 40% 26%, 60% 12%, 80% 22%, 100% 8%, 100% 100%, 0 100%)'
      }} />
      <div style={{
        position: 'absolute', bottom: '22%', left: 0, right: 0, height: '20%',
        background: '#5A7A45'
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '26%',
        background: 'linear-gradient(180deg, #3D5828 0%, #2A3D18 100%)'
      }} />

      {/* House + scene SVG */}
      <svg
        style={{ position: 'absolute', bottom: '22%', left: '50%', transform: 'translateX(-50%)', width: 220, height: 160 }}
        viewBox="0 0 220 160"
        aria-hidden="true"
      >
        {/* Body */}
        <rect x="40" y="65" width="140" height="85" fill="#E8DDD0" stroke="#C8B89A" strokeWidth="1.5" />
        {/* Roof */}
        <polygon points="25,65 110,8 195,65" fill="#8A5C3A" />
        {/* Chimney */}
        <rect x="145" y="22" width="16" height="34" fill="#7A5030" />
        {/* Door */}
        <rect x="90" y="112" width="40" height="38" rx="2" fill="#4A2A0A" />
        <circle cx="124" cy="132" r="3" fill="#C9A84C" />
        {/* Windows */}
        <rect x="52" y="78" width="34" height="26" rx="2" fill="#A8C4D8" stroke="#7A9AB0" strokeWidth="1" />
        <line x1="69" y1="78" x2="69" y2="104" stroke="#7A9AB0" strokeWidth="0.8" />
        <line x1="52" y1="91" x2="86" y2="91" stroke="#7A9AB0" strokeWidth="0.8" />
        <rect x="134" y="78" width="34" height="26" rx="2" fill="#A8C4D8" stroke="#7A9AB0" strokeWidth="1" />
        <line x1="151" y1="78" x2="151" y2="104" stroke="#7A9AB0" strokeWidth="0.8" />
        <line x1="134" y1="91" x2="168" y2="91" stroke="#7A9AB0" strokeWidth="0.8" />
        {/* Shutters */}
        <rect x="46" y="78" width="10" height="26" fill="#5C7A5C" rx="1" />
        <rect x="74" y="78" width="10" height="26" fill="#5C7A5C" rx="1" />
        <rect x="128" y="78" width="10" height="26" fill="#5C7A5C" rx="1" />
        <rect x="156" y="78" width="10" height="26" fill="#5C7A5C" rx="1" />
      </svg>

      {/* Lavender */}
      <svg
        style={{ position: 'absolute', bottom: '22%', right: '22%', width: 70, height: 40 }}
        viewBox="0 0 70 40"
        aria-hidden="true"
      >
        {[0,12,24,36,48].map((x, i) => (
          <g key={i}>
            <rect x={x + 4} y="22" width="3" height="14" fill="#6A7A40" />
            <ellipse cx={x + 5.5} cy="19" rx="4" ry="6"
              fill={['#8A6AAA','#7A5A9A','#9A7ABA','#8A6AAA','#7A5A9A'][i]} />
          </g>
        ))}
      </svg>

      {/* Trees */}
      <svg style={{ position: 'absolute', bottom: '22%', left: '12%', width: 55, height: 100 }} viewBox="0 0 55 100" aria-hidden="true">
        <rect x="24" y="60" width="7" height="40" fill="#3A2010" />
        <ellipse cx="27" cy="48" rx="20" ry="26" fill="#2A4820" />
        <ellipse cx="27" cy="32" rx="13" ry="18" fill="#3A5830" />
      </svg>
      <svg style={{ position: 'absolute', bottom: '22%', right: '15%', width: 18, height: 90 }} viewBox="0 0 18 90" aria-hidden="true">
        <rect x="7" y="58" width="4" height="32" fill="#2A1808" />
        <ellipse cx="9" cy="44" rx="9" ry="44" fill="#1A3818" />
      </svg>

      {/* Photo placeholder badge */}
      <div style={{
        position: 'absolute', bottom: '1.5rem', left: '1.5rem',
        background: 'rgba(26,26,24,0.65)',
        border: '1px solid rgba(201,168,76,0.3)',
        padding: '0.5rem 0.9rem',
        borderRadius: '3px',
        fontSize: '0.7rem',
        color: 'rgba(201,168,76,0.8)',
        fontFamily: 'monospace',
        letterSpacing: '0.05em',
      }}>
        📸 Illustration · Remplacer par photos réelles WebP
      </div>
    </div>
  )
}
