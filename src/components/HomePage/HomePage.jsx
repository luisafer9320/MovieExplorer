import React from 'react';
import './homePage.css'
import { Film } from 'lucide-react'
import { TopMovies } from './TopMovies'

export const Home = () => {
  return (
    <>
      <main className="home">

        <div className="background-overlay"></div>
        <section className="hero-container">
          <div className="logo-container">
            <div className="logo-box">
              <Film size={40} color="white" strokeWidth={1.5} />
            </div>

            <h1>Movie Explorer</h1>
            <p>
              Acceso a entretenimiento ilimitado
            </p>

          </div>

          <div className="welcome-card">
            <h2>
              Bienvenido a <span>MovieExplorer</span>
            </h2>
            <p>
              Miles de películas te esperan.
              Comienza tu experiencia ahora.
            </p>
            <button>
              Acceder →
            </button>
            <div className="stats-container">
              <div className="stat-box">
                <h3>10K+</h3>
                <span>Películas</span>
              </div>
              <div className="stat-box">
                <h3>4K</h3>
                <span>Calidad</span>
              </div>
              <div className="stat-box">
                <h3>∞</h3>
                <span>Sin límites</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <TopMovies />
    </>
  )
}

