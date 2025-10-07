export default function EmptyState() {
  return (
    <div className="glass-dark rounded-xl p-16 text-center shadow-glass-lg animate-slide-down">
      <div className="relative inline-block mb-6">
        <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
        <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-3">
        Select a Repository
      </h2>
      <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
        Choose a repository from the sidebar to explore its commit history, codebase, and collaborate with your team
      </p>

      <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-gray-400">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>Active Projects</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span>Team Collaboration</span>
        </div>
      </div>
    </div>
  )
} 