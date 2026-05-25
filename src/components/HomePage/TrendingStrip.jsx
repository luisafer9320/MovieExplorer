import React, { useEffect, useState } from 'react'
import './homePage.css'

export const TrendingStrip = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY
    if (!apiKey) return setLoading(false)

    const fetchTrending = async () => {
      try {
        const url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&language=es-ES&page=1`
        const res = await fetch(url)
        const data = await res.json()
        setMovies(data.results.slice(0, 12))
      } catch (err) {
        console.error('Trending fetch error', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrending()
  }, [])

  if (loading) return null

  return (
    <div className="trending-strip">
      {movies.map((m) => (
        <div key={m.id} className="trending-item">
          <img
            src={m.poster_path ? `https://image.tmdb.org/t/p/w300${m.poster_path}` : ''}
            alt={m.title}
            className="trending-poster"
          />
          <div className="trending-title" title={m.title}>
            {m.title}
          </div>
        </div>
      ))}
    </div>
  )
}
