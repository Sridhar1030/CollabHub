export default function RepositorySidebar({ repos, selectedRepo, onRepoClick }) {
  return (
    <div className="w-80 shrink-0">
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 sticky top-24">
        <div className="flex items-center space-x-2 mb-6">
          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-semibold text-white">Your Repositories</h3>
        </div>
        
        <div className="space-y-2">
          {repos.map((repo) => (
            <button 
              key={repo} 
              onClick={() => onRepoClick(repo)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 border ${
                selectedRepo === repo 
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-650 hover:border-gray-500 hover:text-white'
              } hover:scale-[1.02] hover:shadow-md`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2 3a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm12 3H6v2h8V6zm-8 4h8v2H6v-2z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{repo}</span>
              </div>
            </button>
          ))}
        </div>
        
        {repos.length === 0 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">No repositories found</p>
          </div>
        )}
      </div>
    </div>
  )
} 