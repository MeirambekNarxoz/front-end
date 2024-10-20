import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { getAllFilms, getAllGenre, getFilmByGenre } from "../api";
import { Select } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-notifications/lib/notifications.css';
import '../css/Page.css';
import {jwtDecode} from "jwt-decode";

const { Option } = Select;

export default function Admin() {
  const location = useLocation();
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [films, setFilms] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showHandAnimation, setShowHandAnimation] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login", { state: { message: 'You need to login first.', title: 'Login Required' } });
      return;
    }
    const decodedToken = jwtDecode(token);
    const userAuthorities = decodedToken.authorities;
    if (userAuthorities !== "ADMIN") {
      navigate("/profile", { state: { message: 'You are not authorized.', title: 'Unauthorized' } });
      return;
    }

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
        NotificationManager.error(`Failed to fetch data: ${error.message}`, "Error", 3000);
      }
    };

    fetchData();

    const timer = setTimeout(() => {
      setShowHandAnimation(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, [location.state, selectedGenres]);

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
     
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container">
          <a className="navbar-brand" href="#page-top">NETFLIX</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link to="/users" className="nav-link">GetAllUsers</Link></li>
              <li className="nav-item"><Link to="/createfilms" className="nav-link">CreateFilms</Link></li>
              <li className="nav-item"><Link to="/creategenre" className="nav-link">CreateGenre</Link></li>
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-link nav-link">Logout</button>
              </li>
            </ul>
            <Select
              mode="multiple"
              style={{ width: '200px' }}
              placeholder="Select Genre"
              onChange={handleGenreChange}
            >
              {genres.map(genre => (
                <Option key={genre.id} value={genre.id}>
                  {genre.name}
                </Option>
              ))}
            </Select>
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
                      <Link to={`/updatefilm/${film.id}`} className="btn btn-info">Update</Link>
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
