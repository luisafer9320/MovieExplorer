import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;


export default function MovieDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [movie, setMovie] = useState(null);
	const [credits, setCredits] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchMovie() {
			setLoading(true);
			setError(null);
			try {
				const [res, creditsRes] = await Promise.all([
					fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=es-ES`),
					fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=es-ES`)
				]);
				if (!res.ok) throw new Error('No se pudo cargar la película');
				if (!creditsRes.ok) throw new Error('No se pudo cargar el reparto');
				const data = await res.json();
				const creditsData = await creditsRes.json();
				setMovie(data);
				setCredits(creditsData);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}
		fetchMovie();
	}, [id]);


	if (loading) return <div style={{padding: '2rem'}}>Cargando...</div>;
	if (error) return <div style={{padding: '2rem', color: 'red'}}>{error}</div>;
	if (!movie) return null;

	// Extraer director y actores principales
	let director = null;
	let cast = [];
	if (credits) {
		director = credits.crew?.find((p) => p.job === 'Director');
		cast = credits.cast?.slice(0, 5) || [];
	}

	return (
		<div className="movie-card movie-detail-card" style={{maxWidth: 900, margin: '2rem auto', background: '#18181b', color: '#fff', borderRadius: 24, boxShadow: '0 6px 32px #000a', padding: 0, display: 'flex', flexDirection: 'row', alignItems: 'stretch', overflow: 'hidden', gap: 0}}>
			<div
				className="movie-card-media"
				style={{ backgroundImage: movie.poster_path ? `url(https://image.tmdb.org/t/p/w500${movie.poster_path})` : 'none', width: 340, minWidth: 340, height: '100%', backgroundSize: 'cover', backgroundPosition: 'center', borderTopLeftRadius: 24, borderBottomLeftRadius: 24 }}
			/>
			<div className="movie-card-details" style={{flex: 1, padding: 36, display: 'flex', flexDirection: 'column', gap: 18, justifyContent: 'center'}}>
				<div className="movie-card-headline" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
					<h2 style={{fontSize: 32, fontWeight: 700, margin: 0}} title={movie.title}>{movie.title}</h2>
					<span className="movie-card-badge" style={{fontSize: 18}}>{movie.adult ? 'A' : 'PG-13'}</span>
				</div>
				<div className="movie-card-meta" style={{fontSize: 17, gap: 18, display: 'flex', flexWrap: 'wrap'}}>
					<span>{movie.release_date?.slice(0, 4) ?? '—'}</span>
					<span>{movie.runtime ? `${movie.runtime} min` : '—'}</span>
					<span>{movie.genres?.[0]?.name || '—'}</span>
					<span className="movie-card-rating">⭐ {movie.vote_average?.toFixed(1) ?? '—'}</span>
				</div>
				<p className="movie-card-synopsis" style={{margin: '10px 0 0 0', fontSize: 18, lineHeight: 1.6}}>{movie.overview}</p>
				<div style={{opacity: 0.95, fontSize: 16, marginTop: 8}}>
					<strong>Géneros:</strong> {movie.genres?.map(g => g.name).join(', ') || '—'}
				</div>
				<div style={{opacity: 0.95, fontSize: 16, marginTop: 4}}>
					<strong>Idioma original:</strong> {movie.original_language?.toUpperCase()}
				</div>
				{director && (
					<div style={{marginTop: 18, display: 'flex', alignItems: 'center', gap: 16}}>
						<img src={director.profile_path ? `https://image.tmdb.org/t/p/w185${director.profile_path}` : 'https://via.placeholder.com/80x80?text=No+Image'} alt={director.name} style={{width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff2'}} />
						<div>
							<strong>Director:</strong> <span style={{fontWeight: 500}}>{director.name}</span>
						</div>
					</div>
				)}
				{cast.length > 0 && (
					<div style={{marginTop: 18}}>
						<strong style={{display: 'block', marginBottom: 8}}>Reparto principal:</strong>
						<div style={{display: 'flex', gap: 18, flexWrap: 'wrap'}}>
							{cast.map((a) => (
								<div key={a.id} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 80}}>
									<img src={a.profile_path ? `https://image.tmdb.org/t/p/w185${a.profile_path}` : 'https://via.placeholder.com/80x80?text=No+Image'} alt={a.name} style={{width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff2', marginBottom: 6}} />
									<span style={{fontSize: 14, textAlign: 'center'}}>{a.name}</span>
								</div>
							))}
						</div>
					</div>
				)}
				<button
					style={{marginTop: 32, padding: '14px 36px', background: '#fff', color: '#18181b', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 17, alignSelf: 'flex-start'}}
					onClick={() => navigate('/explorer')}
				>
					← Volver a explorar
				</button>
			</div>
		</div>
	);
}
