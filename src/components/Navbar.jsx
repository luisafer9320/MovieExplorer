import './Navbar.css'

export const Navbar = () => {
  return (
    <nav className="navbar">
      <h2>MovieExplorer</h2>

      <ul className="nav-links">
        <li>Inicio</li>
        <li>Películas</li>
        <li>Series</li>
      </ul>
    </nav>
  )
}