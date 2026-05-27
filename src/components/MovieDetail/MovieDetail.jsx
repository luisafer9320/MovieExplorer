import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, ArrowLeft } from 'lucide-react';
import './MovieDetail.css'; // <-- Conectamos tus estilos adaptados premium

export const MovieDetail = () => {
    const { id } = useParams(); 
    const [movie, setMovie] = useState(null);
    const [credits, setCredits] = useState(null);
    const [loading, setLoading] = useState(true);

    const apiKey = import.meta.env.VITE_TMDB_API_KEY;

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const movieRes = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=es-ES`
                );
                const movieData = await movieRes.json();
                setMovie(movieData);

                const creditsRes = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=es-ES`
                );
                const creditsData = await creditsRes.json();
                setCredits(creditsData);

            } catch (error) {
                console.error("Error cargando detalles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id, apiKey]);

    if (loading) return <div className="detail-loading">Cargando ficha técnica...</div>;
    if (!movie) return <div className="detail-loading">No se encontró la película.</div>;

    const director = credits?.crew?.find(person => person.job === 'Director');
    const actors = credits?.cast?.slice(0, 6) || [];

    return (
        <div className="detail-page">
            
            {/* Botón Volver con Animación Fluida */}
            <Link to="/" className="back-link">
                <ArrowLeft size={20} /> Volver al Explorador
            </Link>

            {/* Contenedor Ficha de Cristal Premium */}
            <div className="detail-container">
                
                {/* Póster de la película */}
                <img 
                    className="detail-poster"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                    alt={movie.title} 
                />

                {/* Zona de Información Detallada */}
                <div className="detail-info">
                    <h1>{movie.title}</h1>
                    {movie.tagline && <p className="detail-tagline">"{movie.tagline}"</p>}

                    {/* Meta Info en Formato de Mini Pills de Cristal */}
                    <div className="detail-meta">
                        <span className="rating-badge">
                            <Star size={14} fill="#fff" stroke="none" /> {movie.vote_average?.toFixed(1)}
                        </span>
                        <span>
                            <Clock size={14} /> {movie.runtime} min
                        </span>
                        <span>
                            {movie.release_date?.slice(0, 4)}
                        </span>
                    </div>

                    <h3>Sinopsis</h3>
                    <p className="detail-overview">{movie.overview || "No hay sinopsis disponible."}</p>

                    {/* Ficha dinámica del Director de la película */}
                    {director && (
                        <div className="detail-director">
                            <h3>Director</h3>
                            <p>{director.name}</p>
                        </div>
                    )}

                    {/* Ficha dinámica de Actores principales */}
                    <div>
                        <h3>Reparto Principal</h3>
                        <div className="actors-grid">
                            {actors.map(actor => (
                                <div key={actor.id} className="actor-card">
                                    <img 
                                        className="actor-photo"
                                        src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'https://via.placeholder.com/185x278?text=Sin+Foto'} 
                                        alt={actor.name}
                                    />
                                    <p className="actor-name">{actor.name}</p>
                                    <p className="actor-character">{actor.character}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MovieDetail;