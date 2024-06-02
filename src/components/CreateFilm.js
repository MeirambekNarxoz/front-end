import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { CreateFilms , getAllGenre, deleteFilm, getAllFilms} from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';

const CreateFilmsComponent = () => {
    
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [films, setFilms] = useState([])
    const [authorities, setAuthorities] = useState(""); 
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [film, setFilm] = useState({
        title: '',
        director: '',
        release_date: '',
        descrip: '',
        genres: [],
        imageData: '',
        videoData: ''
    });
    useEffect(() => {
        
        if (!token) {
            navigate("/login", { state: { message: 'You need to login first.', title: 'Login Required' } });
            return;
        } 
        const decodedToken = jwtDecode(token);
        const authorities = decodedToken.authorities;
        setAuthorities(authorities);
        if (authorities !== "ADMIN") { 
            navigate("/profile", { state: { message: 'You are not authorized.', title: 'Unauthorized' } });
        }
        const fetchGenres = async () => {
            try {
                const filmsData = await getAllFilms();
                setFilms(filmsData);
                const data = await getAllGenre();
                setGenres(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchGenres();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }
    const handleTitleChange = (event) => {
        setFilm({ ...film, title: event.target.value });
    };

    const handleDirectorChange = (event) => {
        setFilm({ ...film, director: event.target.value });
    };

    const handleReleaseChange = (event) => {
        setFilm({ ...film, release_date: event.target.value });
    };

    const handleDescriptionChange = (event) => {
        setFilm({ ...film, descrip: event.target.value });
    };

    const handleImageChange = (event) => {
        setFilm({ ...film, imageData: event.target.files[0] })
    };

    const handleVideoChange = (event) => {
        setFilm({ ...film, videoData: event.target.files[0] })
    };
    const handleGenreChange = (event) => {
        const { value } = event.target;
        const updatedGenres = film.genres.includes(value)
            ? film.genres.filter(genre => genre !== value)
            : [...film.genres, value];
        setFilm({ ...film, genres: updatedGenres });
    };
    const handleDelete = async (filmId) => {
        try {
            await deleteFilm(filmId);
            setFilms(films.filter(film => film.id !== filmId));
        } catch (error) {
            console.error("Error deleting film:", error);
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            const filmData = {
                title: film.title,
                descrip: film.descrip,
                director: film.director,
                genres: film.genres,
                releaseDate: film.release_date,
            };
            formData.append('imageData', film.imageData);
            formData.append('videoData', film.videoData);
            const filmBlog = new Blob([JSON.stringify(filmData)], {
                type: "application/json",
            });
            formData.append("film", filmBlog);
            const savedFilm = await CreateFilms(formData, token);
    
            if (savedFilm) {
                navigate("/ADMIN", { state: { message: 'Film created successfully', title: 'Saved Film' } });
            } else {
                NotificationManager.error('Failed to create film', 'Error', 3000);
            }
        } catch (error) {
            console.log(error);
            NotificationManager.error('Failed to create film', 'Error', 3000);
        }
    };
    
    return (
        <div className="containers WIDTHS">
            <NotificationContainer />
            {window.history.replaceState({},"")}
            <div className="row">
                <div className="col-md-6">
                    <h2>Create Film</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title:</label>
                            <input type="text" className="form-control" name="title" value={film.title} onChange={handleTitleChange} />
                        </div>
                        <div className="form-group">
                            <label>Director:</label>
                            <input type="text" className="form-control" name="director" value={film.director} onChange={handleDirectorChange} />
                        </div>
                        <div className="form-group">
                            <label>Release Date:</label>
                            <input type="date" className="form-control" name="release_date" value={film.release_date} onChange={handleReleaseChange} />
                        </div>
                        <div className="form-group">
                            <label>Description:</label>
                            <textarea className="form-control" name="descrip" value={film.descrip} onChange={handleDescriptionChange} />
                        </div>
                        <div className="form-group">
                            <label>Genres:</label>
                            {genres.map(genre => (
                                <div key={genre.id} className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={genre.id}
                                        value={genre.name}
                                        checked={film.genres.includes(genre.name)}
                                        onChange={handleGenreChange}
                                    />
                                    <label className="form-check-label" htmlFor={genre.id}>{genre.name}</label>
                                </div>
                            ))}
                        </div>
                        <div className="form-group">
                            <label>Image:</label>
                            <input type="file" className="form-control-file" onChange={handleImageChange} />
                        </div>
                        <div className="form-group">
                            <label>Video:</label>
                            <input type="file" className="form-control-file" onChange={handleVideoChange} />
                        </div>
                        <button type="submit" className="btn btn-primary">Create Film</button>
                    </form>
                </div>
                <div className="col-md-6">
                    <h2>Films</h2>
                    {films.map(film => (
                        <div key={film.id} className="card mb-3">
                            <div className="card-body">
                                <h5 className="card-title">{film.title}</h5>
                                <p className="card-text">Director: {film.director}</p>
                                <p className="card-text">Release Date: {film.release_date}</p>
                                <button className="btn btn-danger" onClick={() => handleDelete(film.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <span className="pull-right"><Link to="/ADMIN" className="btn btn-info">Back</Link></span>
        </div>
    );
};

export default CreateFilmsComponent;
