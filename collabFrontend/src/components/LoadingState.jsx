export default function LoadingState() {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
      <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-gray-400">Loading repository data...</p>
    </div>
  )
} 