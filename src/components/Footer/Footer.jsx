import "../Footer/Footer.css";
import { Film } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* LOGO */}
        <div className="footer-logo">

          <div className="logo-icon">
            <Film size={28} />
          </div>

          <h2>
           Movie<span>Explorer</span>
          </h2>

          <p>Tu destino de streaming premium</p>

        </div>

        {/* LINKS */}
        <ul className="footer-links">

          <li>
            <a href="/">Series </a>
          </li>

          <li>
            <a href="/">Peliculas</a>
          </li>

          <li>
            <a href="/">precios</a>
          </li>

          <li>
            <a href="/">Soporte</a>
          </li>

          <li>
            <a href="/">Terminos</a>
          </li>

          <li>
            <a href="/">Privacidad</a>
          </li>

        </ul>

        {/* LINE */}
        <div className="footer-line"></div>

        {/* COPYRIGHT */}
        <div className="footer-copy">

          <p>© 2024 MovieExplorer. Reservados todos los derechos.</p>

          <span>
            Transmite entretenimiento ilimitado en cualquier lugar y en cualquier momento.
          </span>

        </div>

      </div>

    </footer>
  );
};