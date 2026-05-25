import React, { useEffect, useMemo, useState } from 'react'
import { Search, Play, Star, Film, TrendingUp } from 'lucide-react'
import './Explorer.css'

const sections = [
  {
    id: 'today',
    title: '🔥 Top 10 de Hoy',
    subtitle: 'Las películas más vistas del día',
    path: 'movie/popular',
  },
  {
    id: 'trending',
    title: '🔥 Trending Now',
    subtitle: 'Lo más viral en este momento',
    path: 'trending/movie/day',
  },
  {
    id: 'popular',
    title: '⭐ Popular Movies',
    subtitle: 'Los éxitos que todos están viendo',
    path: 'movie/popular',
  },
  {
    id: 'top-rated',
    title: '🏆 Top Rated',
    subtitle: 'Las películas mejor valoradas',
    path: 'movie/top_rated',
  },
  {
    id: 'now-playing',
    title: '🎬 Now Playing',
    subtitle: 'Estrenos recientes para ver ya',
    path: 'movie/now_playing',
  },
  {
    id: 'coming-soon',
    title: '🎯 Coming Soon',
    subtitle: 'Próximos estrenos que no te puedes perder',
    path: 'movie/upcoming',
  },
]

const getPosterUrl = (posterPath) =>
  posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : ''
const getBackdropUrl = (backdropPath) =>
  backdropPath ? `https://image.tmdb.org/t/p/original${backdropPath}` : ''

export const Explorer = () => {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Películas')
  const [moviesBySection, setMoviesBySection] = useState({})
  const [heroMovie, setHeroMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const categories = ['Películas', 'Series', 'Documentales', 'Animación']

  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY

    if (!apiKey) {
      setError('Falta la clave TMDb en el archivo .env')
      setLoading(false)
      return
    }

    const fetchSectionMovies = async (section) => {
      const url = `https://api.themoviedb.org/3/${section.path}?api_key=${apiKey}&language=es-ES&page=1`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status}`)
      }
      const data = await response.json()
      return data.results.slice(0, 10)
    }

    const loadData = async () => {
      try {
        const results = await Promise.all(
          sections.map(async (section) => [section.id, await fetchSectionMovies(section)])
        )
        const moviesMap = Object.fromEntries(results)
        setMoviesBySection(moviesMap)
        const heroMovieCandidate = moviesMap.popular?.[0] || moviesMap.trending?.[0] || Object.values(moviesMap).flat()[0]
        setHeroMovie(heroMovieCandidate || null)
      } catch (err) {
        setError('No se pudieron cargar las películas. Intenta más tarde.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const allMovies = useMemo(
    () =>
      Object.values(moviesBySection)
        .flat()
        .reduce((unique, movie) => {
          if (!unique.some((item) => item.id === movie.id)) {
            unique.push(movie)
          }
          return unique
        }, []),
    [moviesBySection]
  )

  const filteredMovies = useMemo(() => {
    if (!query) return allMovies

    const search = query.toLowerCase()
    return allMovies.filter((movie) => {
      const title = movie.title?.toLowerCase() ?? ''
      const overview = movie.overview?.toLowerCase() ?? ''
      const genre = movie.genre_ids?.join(',') ?? ''
      return title.includes(search) || overview.includes(search) || genre.includes(search)
    })
  }, [allMovies, query])

  if (loading) {
    return (
      <section className="explorer-page">
        <div className="explorer-loading">Cargando explorador...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="explorer-page">
        <div className="explorer-error">{error}</div>
      </section>
    )
  }

  return (
    <section className="explorer-page">
      <div
        className="explorer-hero"
        style={{
          backgroundImage: heroMovie
            ? `linear-gradient(180deg, rgba(4, 8, 17, 0.25), rgba(4, 8, 17, 0.95)), url(${getBackdropUrl(
                heroMovie.backdrop_path
              )})`
            : undefined,
        }}
      >
        <div className="hero-copy">
          <span className="hero-badge">
            <TrendingUp size={16} />
            En tendencia
          </span>
          <h1>{heroMovie ? heroMovie.title : 'Explora estrenos y éxitos'}</h1>
          <p>
            Descubre las mejores películas del momento con imágenes reales de TMDb y una experiencia de
            navegación premium.
          </p>
        </div>

        <div className="hero-actions">
          <button type="button" className="hero-button hero-primary">
            <Play size={18} /> Explorar ahora
          </button>
          <button type="button" className="hero-button hero-secondary">
            <Film size={18} /> Ver novedades
          </button>
        </div>
      </div>

      <div className="explorer-controls">
        <div className="search-box">
          <Search size={20} color="#94a3b8" />
          <input
            type="text"
            placeholder="Busca una película o serie..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="genre-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`genre-pill ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="top-sections">
        {sections.map((section) => {
          const sectionMovies = moviesBySection[section.id] ?? []
          return (
            <div key={section.id} className="top-section">
              <div className="top-section-header">
                <div>
                  <h2>{section.title}</h2>
                  <p>{section.subtitle}</p>
                </div>
              </div>
              <div className="top-section-cards">
                {sectionMovies.map((movie, index) => (
                  <article
                    key={`${section.id}-${movie.id}`}
                    className="section-card"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(4, 8, 17, 0.18), rgba(4, 8, 17, 0.96)), url(${getPosterUrl(
                        movie.poster_path
                      )})`,
                    }}
                  >
                    <div className="section-card-content">
                      <span className="section-card-badge">#{index + 1}</span>
                      <h3>{movie.title}</h3>
                      <p>{new Date(movie.release_date).getFullYear() || '—'} · {movie.vote_average.toFixed(1)}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="explorer-grid">
        <div className="explorer-grid-header">
          <h2>Resultados</h2>
          <p>{filteredMovies.length} películas encontradas</p>
        </div>
        <div className="movie-grid">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.6)), url(${getPosterUrl(
                  movie.poster_path
                )})`,
              }}
            >
              <span className="movie-number">{movie.id}</span>
              <div className="movie-body">
                <span className="movie-tag">{movie.genre_ids ? 'Película' : 'Título'}</span>
                <h3>{movie.title}</h3>
                <p>{movie.overview}</p>
              </div>
              <div className="movie-footer">
                <div className="movie-rating">
                  <Star size={16} fill="gold" color="gold" />
                  <span>{movie.vote_average?.toFixed(1) ?? '—'}</span>
                </div>
                <button className="movie-play" type="button">
                  <Play size={20} fill="white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
