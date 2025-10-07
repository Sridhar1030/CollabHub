import { useState } from 'react';
import CommitLog from './CommitLog';
import CodeBaseFiles from './CodebaseFiles'; // Assuming the file is named CodeBaseFiles.jsx

export default function RepositoryTabs({ logs, selectedRepo }) {
  const [activeTab, setActiveTab] = useState('code');
  const username = "sridhar";

  const handleTabClick = (tabId) => {
    console.log('Tab clicked:', tabId);
    setActiveTab(tabId);
  };

  const tabs = [
    {
      id: 'code',
      name: 'Code',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      ),
      count: null
    },
    {
      id: 'history',
      name: 'Commits',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      count: null
    }
  ];

  return (
    <div className="glass-dark rounded-xl overflow-hidden shadow-glass-lg animate-slide-down">
      {/* Tab Headers - GitHub Style */}
      <div className="border-b border-white/10">
        <div className="flex px-6">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleTabClick(tab.id);
                }}
                className={`relative py-4 px-5 border-b-2 font-semibold text-sm flex items-center space-x-2 transition-all duration-200 cursor-pointer group ${
                  isActive
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-white/20'
                }`}
                style={{ zIndex: 10 }}
              >
                <span className={`${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'} transition-colors`}>
                  {tab.icon}
                </span>
                <span>{tab.name}</span>
                {tab.count !== null && (
                  <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-500'
                      : 'glass text-gray-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="relative">
        {activeTab === 'code' && (
          <div className="p-6">
            {/* The new component handles all the file tree and content logic */}
            <CodeBaseFiles username={username} repo={selectedRepo} />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-0">
            <CommitLog logs={logs} selectedRepo={selectedRepo} />
          </div>
        )}
      </div>
    </div>
  );
}