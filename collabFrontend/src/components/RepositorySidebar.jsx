export default function RepositorySidebar({ repos, selectedRepo, onRepoClick }) {
  return (
    <div style={{ width: '220px', flexShrink: 0 }}>
      {/* Panel header */}
      <div
        style={{
          background: 'linear-gradient(to right, #0a246a, #a6caf0)',
          padding: '3px 6px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          minHeight: '20px',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="#ffff00">
          <path d="M2 6a2 2 0 012-2h5l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
        <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: 'bold', fontFamily: 'Tahoma, sans-serif' }}>
          Repositories
        </span>
      </div>

      {/* Sunken list area */}
      <div
        className="win-sunken"
        style={{
          background: '#ffffff',
          padding: '2px',
          maxHeight: 'calc(100vh - 180px)',
          overflowY: 'auto',
          minHeight: '200px',
        }}
      >
        {repos.length === 0 ? (
          <div style={{ padding: '16px 8px', textAlign: 'center', color: '#808080', fontSize: '11px' }}>
            <div style={{ marginBottom: '8px' }}>📁</div>
            <div>No repositories found.</div>
            <div style={{ marginTop: '4px', color: '#808080' }}>Push a repository to get started.</div>
          </div>
        ) : (
          repos.map((repo) => (
            <div
              key={repo}
              onClick={() => onRepoClick(repo)}
              className={`win-list-item${selectedRepo === repo ? ' selected' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill={selectedRepo === repo ? '#ffff00' : '#0000cc'}
              >
                <path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
              </svg>
              <span>{repo}</span>
            </div>
          ))
        )}
      </div>

      {/* Status count */}
      <div
        style={{
          background: '#d4d0c8',
          borderTop: '1px solid #808080',
          padding: '2px 6px',
          fontSize: '11px',
          color: '#000000',
        }}
      >
        {repos.length} object{repos.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
