export default function Layout({ children }) {
  return (
    <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59, 130, 246) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      {children}
    </main>
  )
} 