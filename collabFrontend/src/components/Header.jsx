import { Link } from 'react-router-dom'
import collabhubLogo from '../assets/collbhub_logo.png'

export default function Header() {
  return (
    <nav className="glass-dark sticky top-0 z-50 border-b border-[#30363d]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3 group">
              {/* Brand logo */}
              <div className="relative">
                <img
                  src={collabhubLogo}
                  alt="CollabHub logo"
                  className="w-10 h-10 rounded-md object-cover border border-[#30363d]"
                />
              </div>
              <span className="text-xl font-semibold text-[#e6edf3] group-hover:text-[#58a6ff] transition-colors">
                CollabHub
              </span>
            </Link>

            {/* Navigation items */}
            <div className="hidden md:flex items-center space-x-1 ml-6">
              <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-[#7d8590] hover:text-[#e6edf3] hover:bg-[#161b22]">
                Repositories
              </a>
              <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-[#7d8590] hover:text-[#e6edf3] hover:bg-[#161b22]">
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
                className="w-64 px-4 py-2 pl-10 rounded-md bg-[#0d1117] border border-[#30363d] text-[#e6edf3] placeholder-[#7d8590] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-[#58a6ff]"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-[#7d8590]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* User avatar */}
            <div className="w-8 h-8 rounded-full bg-[#21262d] border border-[#30363d] flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-[#58a6ff] transition-all">
              <span className="text-white text-sm font-semibold">S</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 