

import { Navbar } from './components/Navbar/Navbar'
import { HomePage } from './components/HomePage/HomePage'
import { Footer } from './components/Footer/Footer'
import { explorer } from './components/Explorer/Explorer'

function App() {
  return (
    <div>
      <Navbar />
      <HomePage />
      <Footer/> 
      <explorer/>
    </div>
  )
}
export default App