import React from 'react'
import './MovieCard.css'

export const MovieCard = ({ movie }) => {
  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`

  return (
    <div className="movie-card">
      <img src={imageUrl} alt={movie.title} className="movie-poster" />
      <div className="movie-info">
        <h3 title={movie.title}>{movie.title}</h3>
      </div>
    </div>
  )
}