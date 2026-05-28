import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ExplorerCarousel.css'

const getImage = (movie) => {
  if (!movie) return ''
  return movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : ''
}


export default function ExplorerCarousel({ movies = [] }) {
  const navigate = useNavigate();
  if (!movies || movies.length === 0) return null;

  // Estado para controlar qué tarjeta al 100% se está visualizando
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="explorer-carousel">
      {/* FLECHA DE NAVEGACIÓN IZQUIERDA */}
      <button className="carousel-arrow arrow-left" onClick={handlePrev}>‹</button>

      {/* RIEL MÓVIL: Se desplaza horizontalmente en múltiplos de 100vw */}
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${currentIndex * 100}vw)` }}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="carousel-item"
            style={{ backgroundImage: `url(${getImage(movie)})` }}
          >
            <div className="carousel-overlay" />

            <div className="carousel-content">
              <div className="carousel-badge">📈 TENDENCIA</div>
              <h2 className="carousel-title">{movie.title || movie.name}</h2>

              <div className="carousel-meta">
                <span className="carousel-rating">★ {movie.vote_average?.toFixed(1) ?? '—'}</span>
                <span>•</span>
                <span className="carousel-year">{(movie.release_date || movie.first_air_date || '').slice(0, 4) || '—'}</span>
              </div>

              <p className="carousel-overview">{movie.overview}</p>

              <div className="carousel-actions">
                <button className="play-btn" onClick={() => navigate(`/movie/${movie.id}`)}>Ver detalles</button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* FLECHA DE NAVEGACIÓN DERECHA */}
      <button className="carousel-arrow arrow-right" onClick={handleNext}>›</button>

    </div>
  );
}