import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { CreateGenre, getAllGenre, deleteGenre } from "../api";
import { NotificationManager, NotificationContainer } from 'react-notifications';
import 'bootstrap/dist/css/bootstrap.min.css';
import {jwtDecode}from 'jwt-decode';

const CreateGenreComponent = () => {
    const [authorities, setAuthorities] = useState(""); 
    const navigate = useNavigate();
    const [genre, setGenre] = useState({ name: '' });
    const [genres, setGenres] = useState([]);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
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
        const fetchData = async () => {
            try {
                const genreData = await getAllGenre();
                setGenres(genreData);
                if (genreData.length > 0 && genreData[0].name) {
                    setGenre(prevGenre => ({ ...prevGenre, name: genreData[0].name }));
                }
            } catch (error) {
                console.error("Error fetching genre data:", error);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (genreId) => {
        try {
            const deletedGenreDetails = genres.find(genre => genre.id === genreId);
            await deleteGenre(genreId);
            setGenres(prevGenres => prevGenres.filter(genre => genre.id !== genreId));
            NotificationManager.success(`${deletedGenreDetails.name} was deleted`, 'Deleted', 3000);
            navigate(0);
        } catch (error) {
            NotificationManager.error('Error deleting genre:', `${error.message}`, 3000);
        }
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        try {
            const existingGenre = genres.find(existingGenre => existingGenre.name.toLowerCase() === genre.name.toLowerCase());
            if (existingGenre) {
                setMessage(`${genre.name} already exists`);
                return;
            }
            const savedGenre = await CreateGenre(genre);
            if (savedGenre) {
                setGenre({ ...genre, name: '' });
                navigate("/ADMIN", { state: { message: savedGenre.name + " was saved", title: 'Saved Category' } });
            } else {
                console.error("Error saving genre: Empty response");
            }
        } catch (error) {
            console.error("Error saving genre:", error);
            NotificationManager.error('Error saving genre:', `${error.message}`, 3000);
            navigate(0);
        }
    }

    const handleName = (ev) => {
        setGenre({ ...genre, name: ev.target.value });
    }
    const isAdmin = true; 
    if (!isAdmin) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container-fluid bg-dark text-white py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card bg-secondary text-white">
                        <div className="card-header">
                            <h2 className="mb-0">Create New Category</h2>
                            <NotificationContainer />
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Name:</label>
                                    <input type="text" className="form-control" value={genre.name} onChange={handleName} required />
                                </div>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </form>
                        </div>

                        <div>
                            {genres.map(genre => (
                                <div key={genre.id} className="form-check">
                                    <label className="form-check-label" htmlFor={genre.id}>{genre.name}</label>
                                    <button className="btn btn-danger ml-3" onClick={() => handleDelete(genre.id)}>Delete</button>
                                </div>
                            ))}
                        </div>
                        <span className="pull-right"><Link to="/ADMIN" className="btn btn-info">Back</Link></span>
                    </div>
                </div>
            </div>
            {message != null && (
                <h4 className="alert alert-danger">{message}</h4>
            )}
        </div>
    );
}

export default CreateGenreComponent;
