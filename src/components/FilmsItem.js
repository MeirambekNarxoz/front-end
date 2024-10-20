import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getFilmByID, getAllComments } from "../api";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function FilmsItem() {
    const { filmId } = useParams();
    const [film, setFilm] = useState(null);
    const [comments, setComments] = useState([]);
    const videoRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);

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

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const commentsData = await getAllComments(filmId);
                setComments(commentsData);
            } catch (error) {
                console.error("Error fetching comments data:", error);
            }
        };

        fetchComments();
    }, [filmId]);


    if (!film) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container-fluid bg-dark text-white py-5">
            <div className="background-animation"></div> {/* Background Animation */}
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="film-item-container text-white">
                        <div className="card-header text-center">
                            <img src={`data:image/jpeg;base64, ${film.imageData}`} className="img-fluid" width={"500px"} alt={film.title} />
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
                    <Link to="/" className="btn btn-info mt-3">Back</Link>
                </div>
                <div className="col-md-4">
                    <div className="comments-section">
                        <h3>Comments:</h3>
                        <div className="comment-container">
                            {comments.map((comment) => (
                                <div key={comment.id} className="comment">
                                    <div className="comment-header">
                                        <h5 className="comment-author">{comment.user.lastname}</h5>
                                    </div>
                                    <p className="comment-content">{comment.commentary}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
