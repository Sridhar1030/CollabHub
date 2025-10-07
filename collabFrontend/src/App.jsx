import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Layout from './components/Layout'
import Log from './components/Log'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        {/* Subtle gradient background */}
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-50 pointer-events-none"></div>
        
        {/* Animated background dots */}
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(96, 165, 250, 0.4) 1px, transparent 0)`,
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
        </div>
      </div>
    </Router>
  )
}

export default App 