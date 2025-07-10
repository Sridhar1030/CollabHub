export default function RepositoryHeader({ selectedRepo }) {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2 3a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm12 3H6v2h8V6zm-8 4h8v2H6v-2z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{selectedRepo}</h2>
          <p className="text-gray-400">Repository details and history</p>
        </div>
      </div>
    </div>
  )
} 