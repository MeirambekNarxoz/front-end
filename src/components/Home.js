import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAllFilms, getAllGenre, getFilmByGenre } from "../api";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-notifications/lib/notifications.css';
import '../css/Page.css';
import { Select } from 'antd';
import { NotificationContainer, NotificationManager } from 'react-notifications';

export default function Home() {
  const location = useLocation();
  const [genres, setGenres] = useState([]);
  const [films, setFilms] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const genreData = await getAllGenre();
        setGenres(genreData);

        const filmData = await getFilmsByGenres(selectedGenres);
        setFilms(filmData);

        if (location.state) {
          NotificationManager.success(location.state.message, location.state.title, 3000);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        NotificationManager.error("Failed to fetch data", "Error", 3000);
      }
    };

    fetchData();
  }, [location.state]);

  const getFilmsByGenres = async (selectedGenres) => {
    if (selectedGenres.length === 0) {
      return getAllFilms();
    } else {
      const filmsByGenres = await Promise.all(selectedGenres.map(genreId => getFilmByGenre(genreId))); 
      return filmsByGenres.flat().filter((film, index, self) => self.findIndex(f => f.id === film.id) === index);
    }
  };

  const handleGenreChange = async (selectedOptions) => {
    setSelectedGenres(selectedOptions);

    const filmData = await getFilmsByGenres(selectedOptions);
    setFilms(filmData);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#page-top">NETFLIX</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link to="/login" className="nav-link">LOGIN</Link></li>
              <li className="nav-item"><Link to="/register" className="nav-link">REGISTER</Link></li>
              <li className="nav-item"><Link to="/" className="nav-link">BACK</Link></li>
              <Select
                mode="multiple"
                style={{ width: '150px' }}
                placeholder="Select Genre:"
                onChange={handleGenreChange}
              >
                {genres.map(genre => (
                  <Select.Option key={genre.id} value={genre.id}>
                    {genre.name}
                  </Select.Option>
                ))}
              </Select>
            </ul>
          </div>
        </div>
      </nav>

      <header className="masthead text-white text-center">
        <NotificationContainer/>
        {window.history.replaceState({},"")}
      </header>

      <section className="page-section" id="services">
        <div className="containers">
          <br/><br/><br/><br/>
          <div className="text-center">
            <h1 className="section-heading text-uppercase">FILMS</h1>
            <h3 className="section-subheading text-muted">Enjoy your viewing</h3>
          </div>
          <div className="film-list">
            {films.map((film) => (
              <div key={film.id} className="col-md-4 mb-4" >
                <div className="film-card h5 p img">
                    <div className="portfolio-hover">
                      <div className="portfolio-hover-content"><i className="fas fa-plus fa-3x"></i></div>
                    </div>
                    <img src={`data:image/jpeg;base64, ${film.imageData}`} width="500px"  alt={film.title} />
                  <div className="portfolio-caption">
                    <div className="title">
                      <a href={film.link} title={film.title}>{film.title}</a>
                    </div>
                    <div className="portfolio-caption-subheading text-muted">Illustration</div>
                  </div>
                  <Link to={`/films/${film.id}`} className="btn btn-info">View</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section bg-light" id="portfolio">
        <div className="container">
          <div className="text-center">
            <h2 className="section-heading text-uppercase">Portfolio</h2>
            <h3 className="section-subheading text-muted">Lorem ipsum dolor sit amet consectetur.</h3>
          </div>
        </div>
      </section>
      <footer className="footer py-4 bg-dark">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-4 text-lg-start text-center text-white">Copyright &copy; Your Website 2024</div>
            <div className="col-lg-4 my-3 my-lg-0">
              <a className="btn btn-dark btn-social mx-2" href="#!" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a className="btn btn-dark btn-social mx-2" href="#!" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a className="btn btn-dark btn-social mx-2" href="#!" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <div className="col-lg-4 text-lg-end text-center">
              <a className="link-light text-decoration-none me-3" href="#!">Privacy Policy</a>
              <a className="link-light text-decoration-none" href="#!">Terms of Use</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
