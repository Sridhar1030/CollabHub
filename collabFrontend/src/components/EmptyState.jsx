export default function EmptyState() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
    }}>
      {/* Big folder icon */}
      <div style={{ marginBottom: '16px' }}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="0" y="16" width="64" height="44" fill="#ffcc00" stroke="#808000" strokeWidth="2"/>
          <rect x="0" y="8" width="28" height="12" fill="#ffcc00" stroke="#808000" strokeWidth="2"/>
          <rect x="2" y="18" width="60" height="40" fill="#ffe066" stroke="#808000" strokeWidth="1"/>
        </svg>
      </div>

      <div style={{ 
        fontSize: '14px', 
        fontWeight: 'bold', 
        color: '#000000', 
        marginBottom: '8px',
        fontFamily: 'Tahoma, sans-serif'
      }}>
        Select a Repository
      </div>
      <div style={{ 
        fontSize: '11px', 
        color: '#444444', 
        maxWidth: '320px', 
        lineHeight: '1.5',
        fontFamily: 'Tahoma, sans-serif'
      }}>
        Choose a repository from the left panel to explore its commit history, codebase, and collaborate with your team.
      </div>

      {/* Info box */}
      <div style={{ 
        marginTop: '20px', 
        padding: '8px 12px',
        background: '#ffffcc',
        border: '1px solid #808000',
        fontSize: '11px',
        color: '#000000',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: 'Tahoma, sans-serif'
      }}>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="#808000">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        Double-click a repository name to open it
      </div>
    </div>
  )
}
