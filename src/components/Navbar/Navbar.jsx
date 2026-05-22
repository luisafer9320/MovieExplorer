import { useState } from 'react'
import './Navbar.css'

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  // 1. Creamos el estado para saber qué botón tiene el color activo. 
  // Iniciamos con 'Inicio' por defecto.
  const [activeTab, setActiveTab] = useState('Inicio')

  return (
    <nav className="navbar">
      <h2>MovieExplorer</h2>


      {/* 2. Cambiamos las palabras sueltas por etiquetas <button> o enlaces */}
      <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
        <li>
          <button 
            type="button"
            className={`nav-btn ${activeTab === 'Inicio' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('Inicio');
              setIsOpen(false); // Cierra el menú móvil al hacer clic
            }}
          >
            Inicio
          </button>
        </li>
        <li>
          <button 
            type="button"
            className={`nav-btn ${activeTab === 'Películas' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('Películas');
              setIsOpen(false);
            }}
          >
            Películas
          </button>
        </li>
        <li>
          <button 
            type="button"
            className={`nav-btn ${activeTab === 'Series' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('Series');
              setIsOpen(false);
            }}
          >
            Series
          </button>
        </li>
      </ul>
    </nav>
  )
}
