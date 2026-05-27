import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar/Navbar'
import { Footer } from './components/Footer/Footer'
import { HomePage } from './pages/Home'
import { Explorer } from './pages/Explorer'
import './index.css'

const movie = {
}

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-layout">
               <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explorer" element={<Explorer />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App