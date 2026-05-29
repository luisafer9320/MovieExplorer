import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MovieCard } from './MovieCard';
import './TopMovies.css';

export const TopMovies = () => {
  const navigate = useNavigate();
  // 1. Estado para guardar las películas
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para controlar qué película está al inicio del carrusel horizontal
  const [currentIndex, setCurrentIndex] = useState(0);

  // 2. useEffect se ejecuta cuando el componente se carga
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // 3. Obtenemos la API key del archivo .env
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;

        // 4. URL de la API TMDB para películas populares
        const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es-ES&page=1`;

        // 5. Hacemos la solicitud a la API
        const response = await fetch(url);
        const data = await response.json();

        // 6. Tomamos solo las primeras 10 películas
        setMovies(data.results.slice(0, 10));
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las películas');
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Funciones para mover las flechas hacia la izquierda o derecha
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };
// Se asignó correctamente el nombre de la función 'handleNext'
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  };

  // 7. Si está cargando, mostrar mensaje
  if (loading) return <div className="loading">Cargando películas...</div>;

  // 8. Si hay error, mostrar mensaje
  if (error) return <div className="error">{error}</div>;

  return (
    <section className="top-movies">
      <h2>Top 10 Películas Populares</h2>

      {/* Contenedor wrapper para posicionar las flechas flotantes de forma absoluta */}
      <div className="carousel-wrapper">

        {/* Botón Flecha Izquierda */}
        <button className="top-arrow arrow-left" onClick={handlePrev}>‹</button>

        {/* Riel dinámico que se desplaza horizontalmente */}
        <div
          className="movies-track"
          style={{ transform: `translateX(calc(-${currentIndex} * (200px + 24px)))` }}
        >
          {/* 9. Mapeamos cada película y creamos la tarjeta con su información debajo */}
          {movies.map((movie, index) => {
            // Extraemos los datos de la API para usarlos de forma ordenada fuera de la card
            const title = movie.title || movie.name || 'Película';
            const year = movie.release_date?.slice(0, 4) || movie.first_air_date?.slice(0, 4) || '—';
            const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '—';

            // La URL oficial de los servidores de imágenes de TMDB
            const imageUrl = movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : 'https://via.placeholder.com/500x750?text=No+Image';

            return (
              <div className="top-movie" key={movie.id}>
                {/* Medalla de posición del Top */}
                <div className="rank-badge">#{index + 1}</div>

                {/* Card clickeable para navegar a la ficha */}
                <div
                  className="movie-card"
                  style={{ backgroundImage: `url(${imageUrl})`, cursor: 'pointer' }}
                  title={title}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                />

                {/* Bloque con los textos desacoplados abajo, de forma independiente y moderna */}
                <div className="top-movie-info">
                  <h3 className="top-movie-title" title={title}>{title}</h3>
                  <div className="top-movie-meta">
                    <span className="top-movie-rating">★ {rating}</span>
                    <span className="top-movie-dot">•</span>
                    <span>{year}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botón Flecha Derecha */}
        <button className="top-arrow arrow-right" onClick={handleNext}>›</button>
      </div>
    </section>
  );
};