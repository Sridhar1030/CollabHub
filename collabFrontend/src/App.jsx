import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Log from './components/Log'
import PodIndicator from './components/PodIndicator'
import './App.css'

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', background: '#d4d0c8', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ flex: 1, padding: '8px' }}>
          <Routes>
            <Route path="/" element={<Log />} />
          </Routes>
        </div>
        <PodIndicator />
      </div>
    </Router>
  )
}

export default App
