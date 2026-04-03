import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Layout from './components/Layout'
import Log from './components/Log'
import PodIndicator from './components/PodIndicator'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
        {/* Subtle textured backdrop */}
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,#161b22_0%,#0d1117_55%)]"></div>
        
        {/* Animated background dots */}
        <div className="fixed inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(88, 166, 255, 0.22) 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }}></div>
        </div>

        <div className="relative z-10">
          <Header />
          <Layout>
            <Routes>
              <Route path="/" element={<Log />} />
            </Routes>
          </Layout>
          <PodIndicator />
        </div>
      </div>
    </Router>
  )
}

export default App 