import React from 'react'
import { useNavigate } from 'react-router-dom'
import './MovieCard.css'

const genreMap = {
  28: 'Acción',
  12: 'Aventura',
  16: 'Animación',
  35: 'Comedia',
  80: 'Crimen',
  99: 'Documental',
  18: 'Drama',
  10751: 'Familiar',
  14: 'Fantasía',
  36: 'Historia',
  27: 'Terror',
  10402: 'Música',
  9648: 'Misterio',
  10749: 'Romance',
  878: 'Ciencia ficción',
  53: 'Thriller',
  10752: 'Bélico',
  37: 'Western',
}

const getGenreName = (movie) => {
  if (!movie) return 'Película'
  const genreId = movie.genre_ids?.[0] || movie.genres?.[0]?.id
  return genreMap[genreId] || 'Película'
}
export const MovieCard = ({
  movie,
  titulo,
  anio,
  duracion,
  clasificacion,
  sinopsis,
  imagen,
  generos,
  compact = false,
  className = '',
}) => {
  const navigate = useNavigate();
  const title = titulo || movie?.title || movie?.name || 'Película'
  const year = anio || movie?.release_date?.slice(0, 4) || movie?.first_air_date?.slice(0, 4) || '—'
  const duration =
    duracion ||
    (movie?.runtime ? `${movie.runtime} min` : movie?.duration ? `${movie.duration} min` : '—')
  const ageRating = clasificacion || (movie?.adult ? 'A' : 'PG-13')
  const rating = movie?.vote_average ? movie.vote_average.toFixed(1) : '—'
  const summary = sinopsis || movie?.overview || 'Sinopsis no disponible.'
  const imageUrl =
    imagen ||
    (movie?.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '')
  const genre = generos || getGenreName(movie)

  return (
    <article
      className={`movie-card ${compact ? 'movie-card-compact' : ''} ${className}`}
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <div
        className="movie-card-media"
        style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : 'none' }}
      />
      <div className="movie-card-details">
        <div className="movie-card-headline">
          <h3 title={title}>{title}</h3>
          <span className="movie-card-badge">{ageRating}</span>
        </div>

        <div className="movie-card-meta">
          <span>{year}</span>
          <span>{duration}</span>
          <span>{genre}</span>
          <span className="movie-card-rating">⭐ {rating}</span>
        </div>

        {!compact && <p className="movie-card-synopsis">{summary}</p>}
      </div>
    </article>
  )
}

