import React, { useState, useEffect } from 'react';
import { MovieCard } from './MovieCard';
import './TopMovies.css';

export const TopMovies = () => {
  // 1. Estado para guardar las películas
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // 7. Si está cargando, mostrar mensaje
  if (loading) return <div className="loading">Cargando películas...</div>;
  
  // 8. Si hay error, mostrar mensaje
  if (error) return <div className="error">{error}</div>;

  return (
    <section className="top-movies">
      <h2>Top 10 Películas Populares</h2>
      <div className="movies-grid">
        {/* 9. Mapeamos cada película y creamos un MovieCard con badge */}
        {movies.map((movie, index) => (
          <div className="top-movie" key={movie.id}>
            <div className="rank-badge">#{index + 1}</div>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  )
};