import { useState } from 'react'
import CommitLog from './CommitLog'

export default function RepositoryTabs({ logs, files, selectedRepo }) {
  const [activeTab, setActiveTab] = useState('code')

  const handleTabClick = (tabId) => {
    console.log('Tab clicked:', tabId)
    setActiveTab(tabId)
  }

  const tabs = [
    {
      id: 'code',
      name: 'Code',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      ),
      count: files.length
    },
    {
      id: 'history',
      name: 'History',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      count: null
    }
  ]

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      {/* Tab Headers */}
      <div className="border-b border-gray-700 bg-gray-800">
        <div className="flex px-6">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleTabClick(tab.id)
                }}
                className={`relative py-4 px-4 mr-8 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all duration-200 cursor-pointer hover:text-gray-300 ${
                  isActive
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:border-gray-600'
                }`}
                style={{ zIndex: 10 }}
              >
                {tab.icon}
                <span>{tab.name}</span>
                {tab.count !== null && (
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="relative">
        {activeTab === 'code' && (
          <div className="p-6">
            {files.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No files found</h3>
                <p className="text-gray-400">This repository doesn't contain any files</p>
              </div>
            ) : (
              <div className="space-y-4">
                {files.map(({ filename, content }) => (
                  <div key={filename} className="bg-gray-900 rounded-lg border border-gray-600 overflow-hidden">
                    {/* File Header */}
                    <div className="bg-gray-750 px-4 py-3 border-b border-gray-600">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium text-white text-sm">{filename}</span>
                      </div>
                    </div>
                    
                    {/* File Content */}
                    <div className="p-4">
                      <pre className="text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto">
                        {content}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-0">
            <CommitLog logs={logs} selectedRepo={selectedRepo} />
          </div>
        )}
      </div>
    </div>
  )
} 