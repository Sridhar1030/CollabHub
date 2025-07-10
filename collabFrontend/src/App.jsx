import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Layout from './components/Layout'
import Log from './components/Log'
import './App.css'

function App() {
  return (
    <Router>
      <div className=" bg-gray-900">
        <Header />
        <Layout>
          <Routes>
            <Route path="/" element={<Log />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  )
}

export default App 