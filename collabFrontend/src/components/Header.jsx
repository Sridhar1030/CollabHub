import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <nav className="glass-dark sticky top-0 z-50 shadow-lg">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3 group">
              {/* GitHub-style icon with glow effect */}
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/30 transition-all"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                </div>
              </div>
              <span className="text-xl font-bold text-white group-hover:text-blue-500 transition-colors">
                CollabHub
              </span>
            </Link>

            {/* Navigation items */}
            <div className="hidden md:flex items-center space-x-1 ml-6">
              <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:text-white hover:bg-gray-700">
                Repositories
              </a>
              <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:text-white hover:bg-gray-700">
                Activity
              </a>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Search bar */}
            <div className="hidden lg:block relative">
              <input
                type="text"
                placeholder="Search repositories..."
                className="w-64 px-4 py-2 pl-10 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* User avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
              <span className="text-white text-sm font-semibold">S</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 