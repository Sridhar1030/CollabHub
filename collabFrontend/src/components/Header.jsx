import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <div>
      {/* Classic Windows 2000 Title Bar */}
      <div
        style={{
          background: 'linear-gradient(to right, #0a246a, #a6caf0)',
          padding: '3px 6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '26px',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Classic folder/app icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="0" y="4" width="16" height="11" fill="#ffcc00" stroke="#808000" strokeWidth="1"/>
            <rect x="0" y="2" width="7" height="3" fill="#ffcc00" stroke="#808000" strokeWidth="1"/>
          </svg>
          <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: 'bold', fontFamily: 'Tahoma, sans-serif' }}>
            CollabHub — Repository Explorer
          </span>
        </div>
        {/* Window control buttons */}
        <div style={{ display: 'flex', gap: '2px' }}>
          {['_', '□', '✕'].map((label, i) => (
            <button
              key={i}
              className="win-close-btn"
              style={{ 
                width: i === 2 ? 16 : 16, 
                background: i === 2 ? '#d4d0c8' : '#d4d0c8',
              }}
              title={['Minimize', 'Maximize', 'Close'][i]}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Bar */}
      <div className="win-menubar">
        {/* App icon + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 8px 0 4px', borderRight: '1px solid #808080' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#0000cc">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
          <Link to="/" style={{ color: '#000000', textDecoration: 'none', fontSize: '11px', fontFamily: 'Tahoma, sans-serif' }}>
            <strong>CollabHub</strong>
          </Link>
        </div>

        {['File', 'View', 'Repository', 'Tools', 'Help'].map(item => (
          <span key={item} className="win-menubar-item">{item}</span>
        ))}

        {/* Spacer + Search */}
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 8px' }}>
          <span style={{ fontSize: '11px' }}>Search:</span>
          <input
            type="text"
            className="win-input"
            placeholder="repositories..."
            style={{ width: '160px' }}
          />
          <button className="win-btn" style={{ padding: '2px 8px' }}>Go</button>
        </div>

        {/* User */}
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '4px', padding: '1px 8px',
          borderLeft: '1px solid #808080'
        }}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="#000080">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span style={{ fontSize: '11px' }}>sridhar1030</span>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ 
        background: '#d4d0c8', 
        borderBottom: '1px solid #808080',
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        gap: '2px'
      }}>
        {[
          { label: '◀ Back', title: 'Back' },
          { label: '▶ Forward', title: 'Forward' },
          { label: '↑ Up', title: 'Up' },
        ].map(btn => (
          <button key={btn.label} className="win-btn" title={btn.title} style={{ fontSize: '11px' }}>
            {btn.label}
          </button>
        ))}
        <div style={{ width: '1px', height: '20px', background: '#808080', margin: '0 4px' }} />
        <button className="win-btn" title="Refresh" style={{ fontSize: '11px' }}>🔄 Refresh</button>
        <div style={{ flex: 1, margin: '0 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>Address:</span>
            <input
              type="text"
              className="win-input"
              defaultValue="collabhub://repositories/sridhar"
              style={{ flex: 1, minWidth: 0 }}
              readOnly
            />
            <button className="win-btn" style={{ padding: '2px 12px' }}>Go</button>
          </div>
        </div>
      </div>
    </div>
  )
}
