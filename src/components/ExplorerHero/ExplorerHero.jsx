import React from 'react';
import './ExplorerHero.css'; // Importamos los estilos que creamos en el Paso 1

// Funciones auxiliares para armar las URLs de las imágenes que nos da TMDB
const getBackdropUrl = (path) => `https://image.tmdb.org/t/p/original${path}`;
const getPosterUrl = (path) => `https://image.tmdb.org/t/p/w500${path}`;

// Tu componente recibe la película actual mediante una propiedad llamada "heroMovie"
function ExplorerHero({ heroMovie }) {
  
  // Si la página está cargando y aún no hay película, muestra este mensaje preventivo
  if (!heroMovie) {
    return <div style={{ color: 'white', padding: '20px' }}>Cargando datos de la película...</div>;
  }

  return (
    <section className="explorer-page">
      <div className="explorer-hero">
        
        {/* 1. IMAGEN DE FONDO GRANDE */}
        <div
          className="hero-backdrop-img"
          style={{
            // El linear-gradient crea una cortina oscura de arriba hacia abajo para que el texto sea legible
            backgroundImage: `linear-gradient(180deg, rgba(4, 8, 17, 0.2), rgba(4, 8, 17, 0.95)), url(${getBackdropUrl(heroMovie.backdrop_path)})`
          }}
        />

        {/* 2. CONTENIDO DEL TEXTO E IMAGEN CHICA */}
        <div className="hero-content">
          <div className="hero-flex-layout">
            
            {/* Portada pequeña en la esquina izquierda */}
            <img 
              src={getPosterUrl(heroMovie.poster_path)} 
              alt={heroMovie.title} 
              className="hero-mini-poster"
            />

            {/* Detalles escritos de la película */}
            <div className="hero-text-details">
              {/* Muestra el título dinámico */}
              <h1 className="hero-title">{heroMovie.title}</h1>
              
              <div className="hero-meta">
                {/* Muestra la calificación redondeada a un decimal */}
                <span className="hero-rating">⭐ {heroMovie.vote_average?.toFixed(1)}</span>
                <span>•</span>
                {/* Extrae solo el año de la fecha completa (ej: "2024-05-12" pasa a "2024") */}
                <span>{heroMovie.release_date?.split('-')[0]}</span>
              </div>

              {/* Muestra el resumen de la trama */}
              <p className="hero-overview">{heroMovie.overview}</p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default ExplorerHero; // Exportamos el componente para usarlo en otros archivos
