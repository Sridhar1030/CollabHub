import { useState, useEffect } from 'react';
import api from '../api';

export default function RepositoryHeader({ selectedRepo }) {
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const response = await api.get('/getUsers');
        setCollaborators(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching collaborators:', err);
        setError('Failed to fetch collaborators');
      } finally {
        setLoading(false);
      }
    };
    fetchCollaborators();
  }, []);

  function CollaboratorsModal() {
    if (!showModal) return null;
    return (
      <div className="win-modal-overlay" onClick={() => setShowModal(false)}>
        <div
          className="win-window"
          style={{ width: '360px', maxWidth: '95vw' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Title bar */}
          <div className="win-titlebar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="#ffff00">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span>Collaborators — {selectedRepo}</span>
            </div>
            <button className="win-close-btn" onClick={() => setShowModal(false)}>✕</button>
          </div>

          {/* Content area */}
          <div style={{ padding: '8px' }}>
            {/* Info bar */}
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '4px 6px', marginBottom: '8px',
              background: '#ffffcc',
              border: '1px solid #808000',
              fontSize: '11px'
            }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="#808000">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {collaborators.length} team member{collaborators.length !== 1 ? 's' : ''}
            </div>

            <div className="win-sunken" style={{ background: '#ffffff', maxHeight: '300px', overflowY: 'auto' }}>
              {collaborators.map((collaborator, index) => {
                const username = collaborator.split(' <')[0];
                const email = collaborator.match(/<(.+)>/)?.[1] || '';
                return (
                  <div
                    key={index}
                    className="win-list-item"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 6px' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="#000080">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span style={{ flex: 1, fontWeight: 'bold' }}>{username}</span>
                    <span style={{ color: '#0000cc' }}>{email}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', gap: '4px' }}>
              <button className="win-btn win-btn-primary" onClick={() => setShowModal(false)}>OK</button>
              <button className="win-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Repository info panel */}
      <div className="win-raised" style={{ background: '#d4d0c8', padding: '0', marginBottom: '4px' }}>
        {/* Title bar */}
        <div
          style={{
            background: 'linear-gradient(to right, #0a246a, #a6caf0)',
            padding: '3px 6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            minHeight: '20px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="#ffff00">
            <path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
          </svg>
          <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: 'bold', fontFamily: 'Tahoma, sans-serif' }}>
            {selectedRepo}
          </span>
        </div>

        <div style={{ padding: '6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="32" height="32" viewBox="0 0 16 16" fill="#0000cc">
              <path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
            </svg>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#000000' }}>{selectedRepo}</div>
              <div style={{ fontSize: '11px', color: '#008000' }}>● Public repository — Updated recently</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {loading ? (
              <span style={{ fontSize: '11px', color: '#808080' }}>Loading...</span>
            ) : error ? (
              <span style={{ fontSize: '11px', color: '#cc0000' }}>{error}</span>
            ) : (
              <button
                className="win-btn"
                onClick={() => setShowModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
              >
                <svg width="14" height="14" viewBox="0 0 20 20" fill="#000080">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                {collaborators.length} Collaborator{collaborators.length !== 1 ? 's' : ''}...
              </button>
            )}
          </div>
        </div>
      </div>

      <CollaboratorsModal />
    </>
  );
}
