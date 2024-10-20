import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { getAllFilms, getAllGenre, getFilmByGenre } from "../api";
import {jwtDecode} from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-notifications/lib/notifications.css';
import '../css/Page.css';
import { Select } from 'antd';

export default function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [films, setFilms] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [ID, setID] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate("/login", { state: { message: 'You need to login first.', title: 'Login Required' } });
        return;
      }
      try {
        const ID = jwtDecode(token).ID;
        setID(ID);

        const genreData = await getAllGenre();
        setGenres(genreData);

        const filmData = await getAllFilms();
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
  }, [location.state, navigate]);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.clear();
    sessionStorage.clear();
    navigate("/", { state: { message: 'You have been logged out successfully.', title: 'Logout Successful' } });
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
              <li className="nav-item"><button onClick={handleLogout} className="nav-link btn btn-link">Logout</button></li>
              <li className="nav-item"><Link to={`/ProfileUser/${ID}`} className="nav-link">Profile</Link></li>
              <Select
                mode="multiple"
                style={{ width: '200px' }}
                placeholder="Select Genre"
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
        <NotificationContainer />
        {window.history.replaceState({}, "")}
      </header>

      <section className="page-section" id="services">
        <div className="container">
          <br /><br /><br /><br />
          <div className="text-center">
            <h1 className="section-heading text-uppercase">Films</h1>
            <h3 className="section-subheading text-muted">Enjoy your viewing</h3>
          </div>
          <div className="row">
            {films.length > 0 ? (
              films.map((film) => (
                <div key={film.id} className="col-md-4 mb-4 d-flex align-items-stretch">
                  <div className="card film-card h-100">
                    <img src={`data:image/jpeg;base64, ${film.imageData}`} className="card-img-top" alt={film.title} />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{film.title}</h5>
                      <p className="card-text">{film.genres && film.genres.join(', ')}</p>
                      <Link to={`/film/${film.id}`} className="btn btn-info mt-auto">View</Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p className="text-muted">No films available for the selected genre(s).</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="footer bg-dark text-light py-4" style={{ position: 'fixed', bottom: 0, left: 0, width: '100%' ,height:'60px'}}>
  <div className="container">
    <div className="row">
      <div className="col-md-12 text-center">
        <h5>&copy; 2023 All Rights Reserved</h5>
        <p className="text-muted">Powered by Netflix</p>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
}
