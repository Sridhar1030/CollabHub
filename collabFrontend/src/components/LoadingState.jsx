export default function LoadingState() {
  return (
    <div className="glass-dark rounded-lg p-16 text-center">
      <div className="relative inline-block mb-4">
        <div className="absolute inset-0 bg-[#58a6ff]/25 blur-xl rounded-full animate-pulse"></div>
        <div className="relative animate-spin w-12 h-12 border-2 border-[#58a6ff]/30 border-t-[#58a6ff] rounded-full"></div>
      </div>
      <p className="text-[#e6edf3] font-medium">Loading repository data...</p>
      <p className="text-[#7d8590] text-sm mt-2">Please wait while we fetch the information</p>
    </div>
  )
} 