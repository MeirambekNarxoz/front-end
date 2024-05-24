import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { getAllFilms, getAllGenre } from "../api";
import {jwtDecode}from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-notifications/lib/notifications.css';
import '../css/style.css';

export default function Profile() {

    const location = useLocation();
    const navigate = useNavigate();
    const [genres, setGenres] = useState([]);
    const [films, setFilms] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [ID, setID] = useState(null); 

    useEffect(() => {
        const fetchData = async () => {
            const token= localStorage.getItem('token');
            if (!token) {
                navigate("/login", { state: { message: 'You need to login first.', title: 'Login Required' } });
                return;
            }
            try {
              const ID = jwtDecode(token).ID;
              setID(ID);

                const genreData = await getAllGenre();
                setGenres(genreData);

                const filmData = await getAllFilms(selectedGenres); 
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
    }, []); 

    const handleGenreChange = (e) => {
        const genreId = parseInt(e.target.value);
        if (e.target.checked) {
            setSelectedGenres([...selectedGenres, genreId]);
        } else {
            setSelectedGenres(selectedGenres.filter(id => id !== genreId));
        }
    };

    const handleFilmDetails = (film) => {
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate("/", { state: { message: 'You have been logged out successfully.', title: 'Logout Successful' } });
    }
    

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
                            <li className="nav-item"><button onClick={handleLogout} className="btn btn-secondary">Logout</button></li>
                            <li className="nav-item"><Link to={`/ProfileUser/${ID}`} className="btn btn-info">Profile</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>

            <header className="masthead text-white text-center">
                <NotificationContainer/>
                {window.history.replaceState({},"")}
            </header>

            <div>
                {/*  Selection Genre */}
            </div>

            <section className="page-section" id="services">
                <div className="container">
                    <br/><br/><br/><br/>
                    <div className="text-center">
                        <h1 className="section-heading text-uppercase">FILMS</h1>
                        <h3 className="section-subheading text-muted">Enjoy your viewing</h3>
                    </div>
                    <div className="row">
                        {films.filter(film => {
                            if (selectedGenres.length === 0) return true; 
                            return selectedGenres.some(genre => film.genres && film.genres.includes(genre));
                        }).map((film) => (
                            <div key={film.id} className="col-md-4 mb-4" onClick={() => handleFilmDetails(film)}>
                                <div className="portfolio-item">
                                    <div className="portfolio-hover">
                                        <div className="portfolio-hover-content"><i className="fas fa-plus fa-3x"></i></div>
                                    </div>
                                    <img src={`data:image/jpeg;base64, ${film.imageData}`} width="384" height="488" alt={film.title} />
                                    <div className="portfolio-caption">
                                        <div className="title">
                                            <a href={film.link} title={film.title}>{film.title}</a>
                                        </div>
                                        <div className="portfolio-caption-subheading text-muted">Illustration</div>
                                    </div>
                                    <Link to={`/film/${film.id}`} className="btn btn-info">View</Link>
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
                    <div className="row">
                        
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
