import { useState } from 'react';
import CommitLog from './CommitLog';
import CodeBaseFiles from './CodebaseFiles';
import Issues from './Issues';
import { useCollaborators } from '../hooks/useCollaborators';

export default function RepositoryTabs({ logs, selectedRepo }) {
  const [activeTab, setActiveTab] = useState('code');
  const username = "sridhar";
  const { collaborators } = useCollaborators(username, selectedRepo);

  const tabs = [
    {
      id: 'code',
      label: 'Code',
      icon: (
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      id: 'history',
      label: 'Commits',
      icon: (
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      id: 'issues',
      label: 'Issues',
      icon: (
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      {/* Classic Tab Strip */}
      <div style={{ display: 'flex', alignItems: 'flex-end', paddingLeft: '2px', paddingTop: '4px' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`win-tab${activeTab === tab.id ? ' active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontFamily: 'Tahoma, sans-serif' }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content panel */}
      <div
        className="win-raised"
        style={{
          background: '#d4d0c8',
          padding: '8px',
          minHeight: '400px',
          borderTop: '1px solid #ffffff',
        }}
      >
        {activeTab === 'code' && (
          <CodeBaseFiles username={username} repo={selectedRepo} />
        )}
        {activeTab === 'history' && (
          <CommitLog logs={logs} selectedRepo={selectedRepo} />
        )}
        {activeTab === 'issues' && (
          <Issues username={username} repo={selectedRepo} collaborators={collaborators} />
        )}
      </div>
    </div>
  );
}
