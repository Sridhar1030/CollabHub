export default function LoadingState() {
  return (
    <div className="glass-dark rounded-xl p-16 text-center shadow-glass-lg">
      <div className="relative inline-block mb-4">
        <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full animate-pulse"></div>
        <div className="relative animate-spin w-12 h-12 border-3 border-blue-500/30 border-t-blue-500 rounded-full"></div>
      </div>
      <p className="text-gray-200 font-medium">Loading repository data...</p>
      <p className="text-gray-400 text-sm mt-2">Please wait while we fetch the information</p>
    </div>
  )
} 