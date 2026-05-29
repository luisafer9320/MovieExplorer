import React, { useEffect, useMemo, useState, useRef } from 'react'
import {
    Search,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'

import './Explorer.css'
import ExplorerCarousel from './ExplorerCarousel'
import { MovieCard } from '../MovieCard/MovieCard'

const sections = [
    { id: 'today', title: '🔥 Top 10 de Hoy', subtitle: 'Las películas más vistas del día', path: 'movie/popular' },
    { id: 'trending', title: '🔥 Trending Now', subtitle: 'Lo más viral en este momento', path: 'trending/movie/day' },
    { id: 'popular', title: '⭐ Popular Movies', subtitle: 'Los éxitos que todos están viendo', path: 'movie/popular' },
    { id: 'top-rated', title: '🏆 Top Rated', subtitle: 'Las películas mejor valoradas', path: 'movie/top_rated' },
    { id: 'now-playing', title: '🎬 Now Playing', subtitle: 'Estrenos recientes para ver ya', path: 'movie/now_playing' },
    { id: 'coming-soon', title: '🎯 Coming Soon', subtitle: 'Próximos estrenos que no te puedes perder', path: 'movie/upcoming' },
]

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

    const genreId =
        movie.genre_ids?.[0] ||
        movie.genres?.[0]?.id

    return genreMap[genreId] || 'Película'
}

const getMovieYear = (movie) =>
    movie?.release_date?.slice(0, 4) ||
    movie?.first_air_date?.slice(0, 4) ||
    '—'

export const Explorer = () => {

    const containerRef = useRef(null)
    const loadMoreRef = useRef(null) // Referencia para el scroll infinito
    const [scrollProgress, setScrollProgress] = useState(0)
    const [query, setQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState('Películas')
    const [moviesBySection, setMoviesBySection] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [visibleCount, setVisibleCount] = useState(12) // Control de scroll infinito en la grid

    const categories = [
        'Películas',
        'Series',
        'Documentales',
        'Animación'
    ]

    useEffect(() => {

        const apiKey =
            import.meta.env.VITE_TMDB_API_KEY

        if (!apiKey) {
            setError('Falta la clave TMDb en el archivo .env')
            setLoading(false)
            return
        }

        const fetchSectionMovies = async (section) => {
            const page = 1
            const url =
                `https://api.themoviedb.org/3/${section.path}?api_key=${apiKey}&language=es-ES&page=${page}`
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`Error en la API: ${response.status}`)
            }

            const data = await response.json()
            if (section.id !== 'today') {
                try {
                    const res2 = await fetch(`https://api.themoviedb.org/3/${section.path}?api_key=${apiKey}&language=es-ES&page=2`)
                    if (res2.ok) {
                        const data2 = await res2.json()
                        return [...data.results, ...data2.results]
                    }
                } catch (e) { /* Fallback silencioso */ }
            }
            return data.results
        }

        const loadData = async () => {
            try {
                const results = await Promise.all(
                    sections.map(async (section) => [
                        section.id,
                        await fetchSectionMovies(section)
                    ])
                )

                const moviesMap =
                    Object.fromEntries(results)
                setMoviesBySection(moviesMap)
            } catch (err) {

                setError(
                    'No se pudieron cargar las películas. Intenta más tarde.'
                )

            } finally {
                setLoading(false)
            }
        }

        loadData()

    }, [])

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const onScroll = () => {
            const max =
                el.scrollHeight - el.clientHeight
            const scrolled =
                max > 0
                    ? (el.scrollTop / max) * 100
                    : 0
            setScrollProgress(
                Math.min(100, Math.max(0, scrolled))
            )
        }

        el.addEventListener(
            'scroll',
            onScroll,
            { passive: true }
        )

        onScroll()

        return () =>
            el.removeEventListener('scroll', onScroll)

    }, [containerRef])

    // =========================================================
    // DECLARACIÓN DE LAS MEMORIAS (Movidas arriba para evitar el ReferenceError)
    // =========================================================
    const allMovies = useMemo(
        () =>
            Object.values(moviesBySection)
                .flat()
                .reduce((unique, movie) => {

                    if (
                        !unique.some(
                            (item) => item.id === movie.id
                        )
                    ) {
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
            const title =
                movie.title?.toLowerCase() ?? ''
            const overview =
                movie.overview?.toLowerCase() ?? ''
            return (
                title.includes(search) ||
                overview.includes(search)
            )
        })

    }, [allMovies, query])

    // =========================================================
    // EFECTOS DEPENDIENTES DE LAS VARIABLES ANTERIORES
    // =========================================================

    // Lógica de Scroll Infinito mediante IntersectionObserver
    useEffect(() => {
        if (loading || error) return

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setVisibleCount((prevCount) => prevCount + 8)
            }
        }, { threshold: 1.0 })

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current)
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current)
            }
        }
    }, [loading, error, filteredMovies])

    // Reiniciar paginación al escribir en el buscador
    useEffect(() => {
        setVisibleCount(12)
    }, [query])

    const scrollSlider = (id, direction) => {

        const slider =
            document.querySelector(`#slider-${id}`)

        if (!slider) return

        slider.scrollBy({
            left: direction === 'left'
                ? -900
                : 900,
            behavior: 'smooth'
        })
    }

    if (loading) {
        return (
            <section className="explorer-page">
                <div className="explorer-loading">
                    Cargando explorador...
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section className="explorer-page">
                <div className="explorer-error">
                    {error}
                </div>
            </section>
        )
    }

    const infiniteMovies = filteredMovies.slice(0, visibleCount)

    return (
        <section
            className="explorer-page"
            ref={containerRef}
        >

            <div className="page-scroller">
                <div
                    className="page-scroller__bar"
                    style={{
                        width: `${scrollProgress}%`
                    }}
                />
            </div>

            <div className="explorer-controls">

                <div className="search-box">

                    <Search
                        size={20}
                        color="#94a3b8"
                    />

                    <input
                        type="text"
                        placeholder="Busca una película o serie..."
                        value={query}
                        onChange={(e) =>
                            setQuery(e.target.value)
                        }
                    />
                </div>

                <div className="genre-filters">

                    {categories.map((category) => (

                        <button
                            key={category}
                            className={`genre-pill ${activeCategory === category
                                    ? 'active'
                                    : ''
                                }`}
                            onClick={() =>
                                setActiveCategory(category)
                            }
                        >
                            {category}
                        </button>

                    ))}
                </div>
            </div>

            <ExplorerCarousel
                movies={allMovies.slice(0, 12)}
            />

            <div className="top-sections">

                {sections.map((section) => {

                    let sectionMovies =
                        moviesBySection[section.id] ?? []

                    if (section.id === 'today') {
                        sectionMovies = sectionMovies.slice(0, 10)
                    }

                    return (

                        <div
                            key={section.id}
                            className="top-section"
                        >

                            <div className="top-section-header">
                                <div>
                                    <h2>{section.title}</h2>
                                    <p>{section.subtitle}</p>
                                </div>
                            </div>

                            {/* FLECHA IZQUIERDA */}
                            <button
                                className="slider-arrow left"
                                onClick={() =>
                                    scrollSlider(
                                        section.id,
                                        'left'
                                    )
                                }
                            >
                                <ChevronLeft size={28} />
                            </button>

                            {/* SLIDER */}
                            <div
                                className="top-section-cards"
                                id={`slider-${section.id}`}
                            >

                                {sectionMovies.map((movie, index) => (

                                    <article
                                        key={`${section.id}-${movie.id}`}
                                        className="section-card"
                                    >

                                        <div
                                            className="section-card-media"
                                            style={{
                                                backgroundImage:
                                                    `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`
                                            }}
                                        />

                                        <div className="section-card-details">

                                            <h3>
                                                {movie.title}
                                            </h3>

                                            <div className="section-card-meta">

                                                <span>
                                                    ⭐ {movie.vote_average?.toFixed(1) ?? '—'}
                                                </span>

                                                <span>
                                                    {getMovieYear(movie)}
                                                </span>

                                                <span>
                                                    {getGenreName(movie)}
                                                </span>

                                            </div>

                                        </div>

                                    </article>

                                ))}

                            </div>

                            {/* FLECHA DERECHA */}
                            <button
                                className="slider-arrow right"
                                onClick={() =>
                                    scrollSlider(
                                        section.id,
                                        'right'
                                    )
                                }
                            >
                                <ChevronRight size={28} />
                            </button>

                        </div>
                    )
                })}
            </div>

            <div className="explorer-grid">
                <div className="explorer-grid-header">
                    <h2>Para compartir en familia o con amigos</h2>
                    <p>
                        {filteredMovies.length} películas encontradas
                    </p>

                </div>

                <div className="movie-grid">

                    {infiniteMovies.map((movie) => (

                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            compact={false}
                        />

                    ))}

                </div>

                {filteredMovies.length > visibleCount && (
                    <div ref={loadMoreRef} style={{ height: '20px', margin: '10px 0' }} />
                )}
            </div>
        </section>
    )
}

export default Explorer