export default function RepositorySidebar({ repos, selectedRepo, onRepoClick }) {
  return (
    <div className="w-80 shrink-0">
      <div className="glass-dark rounded-xl p-6 sticky top-24 shadow-glass-lg animate-slide-down">
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h5l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Repositories</h3>
            <p className="text-xs text-gray-400">{repos.length} total</p>
          </div>
        </div>
        
        <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
          {repos.map((repo) => (
            <button 
              key={repo} 
              onClick={() => onRepoClick(repo)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                selectedRepo === repo 
                  ? 'bg-blue-500/20 border border-blue-500 text-white shadow-lg shadow-blue-500/20 scale-[1.02]' 
                  : 'glass hover-glass text-gray-200 hover:text-white hover:scale-[1.01]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${selectedRepo === repo ? 'bg-blue-500' : 'bg-gray-400 group-hover:bg-white'} transition-colors`}></div>
                <svg className={`w-4 h-4 ${selectedRepo === repo ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'}`} fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
                </svg>
                <span className="font-medium truncate flex-1">{repo}</span>
                {selectedRepo === repo && (
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
        
        {repos.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 glass-dark rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm font-medium">No repositories found</p>
            <p className="text-gray-400 text-xs mt-1">Push a repository to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}