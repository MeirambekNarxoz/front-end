import React, { useState, useEffect } from 'react';
import { useNavigate, useParams,Link } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { getFilmByID, updateFilm } from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';

const UpdateFilm = () => {
    const { filmId } = useParams();
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
    
    const [error, setError] = useState(null);

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
        const fetchFilm = async () => {
            try {
                const filmData = await getFilmByID(filmId);
                setFilm(filmData);
            } catch (error) {
                console.error("Error fetching film data:", error);
                setError(error.message);
            }
        };

        fetchFilm();
    }, [filmId]);
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFilm(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (event) => {
        setFilm(prevState => ({
            ...prevState,
            imageData: event.target.files[0]
        }));
    };

    const handleVideoChange = (event) => {
        setFilm(prevState => ({
            ...prevState,
            videoData: event.target.files[0]
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const updatedFilm = await updateFilm(filmId, film, token);
            if (updatedFilm) {
                navigate("/ADMIN", { state: { message: 'Film updated successfully', title: 'Updated Film' } });
            } else {
                NotificationManager.error('Failed to update film', 'Error', 3000);
            }
        } catch (error) {
            console.error(error);
            NotificationManager.error('Failed to update film', 'Error', 3000);
        }
    };

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="container WIDTH ">
            <NotificationContainer />
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h2>Update Film</h2>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Title:</label>
                                    <input type="text" className="form-control" name="title" value={film.title} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Director:</label>
                                    <input type="text" className="form-control" name="director" value={film.director} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Release Date:</label>
                                    <input type="date" className="form-control" name="release_date" value={film.release_date} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Description:</label>
                                    <textarea className="form-control" name="descrip" value={film.descrip} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Image:</label>
                                    <input type="file" className="form-control-file" onChange={handleImageChange} />
                                </div>
                                <div className="form-group">
                                    <label>Video:</label>
                                    <input type="file" className="form-control-file" onChange={handleVideoChange} />
                                </div>
                                <button type="submit" className="btn btn-primary mt-3">Update Film</button>
                            </form>
                        </div>
                    </div>
                    <span className="pull-right"><Link to="/ADMIN" className="btn btn-info">Back</Link></span>
                </div>
            </div>
        </div>
    );
};

export default UpdateFilm;
