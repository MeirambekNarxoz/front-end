import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getFilmByID } from "../api";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function FilmsItem() {
    const { filmId } = useParams();
    const [film, setFilm] = useState(null);

    useEffect(() => {
        const fetchFilm = async () => {
            try {
                const filmData = await getFilmByID(filmId);
                setFilm(filmData);
            } catch (error) {
                console.error("Error fetching film data:", error);
            }
        };

        fetchFilm();
    }, [filmId]);

    if (!film) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container-fluid bg-dark text-white py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card bg-secondary text-white">
                        <div className="card-header">
                            <img src={`data:image/jpeg;base64, ${film.imageData}`} width="384" height="488" alt={film.title} />
                            <h2 className="mb-0">{film.title}</h2>
                        </div>
                        <div className="card-body">
                            <p className="card-text">Title: {film.title}</p>
                            <p className="card-text">Director: {film.director}</p>
                            <p className="card-text">Release Date: {film.release_date}</p>
                            <p className="card-text">Description: {film.descrip}</p>
                            <p className="card-text">Genres: {film.genres && film.genres.join(', ')}</p>
                        </div>
                    </div>
                    <Link to="/" className="btn btn-info">Back</Link>
                </div>
            </div>
        </div>
    );
}
