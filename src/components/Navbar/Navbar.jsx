import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, User } from 'lucide-react'
import './Navbar.css'

export const Navbar = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  
  // 1. Creamos el estado para saber qué botón tiene el color activo. 
  // Iniciamos con 'Inicio' por defecto.
  const [activeTab, setActiveTab] = useState('Inicio')

  const handleNav = (tab, path) => {
    setActiveTab(tab)
    setIsOpen(false)
    navigate(path)
  }

  return (
    <nav className="navbar">
      <h2>MovieExplorer</h2>


      {/* 2. Cambiamos las palabras sueltas por etiquetas <button> o enlaces */}
      <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
        <li>
          <button 
            type="button"
            className={`nav-btn ${activeTab === 'Inicio' ? 'active' : ''}`}
            onClick={() => handleNav('Inicio', '/')}
          >
            Inicio
          </button>
        </li>
        <li>
          <button 
            type="button"
            className={`nav-btn ${activeTab === 'Películas' ? 'active' : ''}`}
            onClick={() => handleNav('Películas', '/explorer')}
          >
            Películas
          </button>
        </li>
        <li>
          <button 
            type="button"
            className={`nav-btn ${activeTab === 'Series' ? 'active' : ''}`}
            onClick={() => handleNav('Series', '/explorer')}
          >
            Series
          </button>
        </li>
      </ul>

      <div className="navbar-actions">
        <button type="button" className="icon-btn" aria-label="Buscar" onClick={() => navigate('/explorer')}>
          <Search size={18} />
        </button>
        <button type="button" className="icon-btn" aria-label="Perfil">
          <User size={18} />
        </button>
      </div>
    </nav>
  )
}
